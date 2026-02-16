// uptime.js — 显示页面已运行时长（自页面加载），支持关闭（不持久化）
(function() {
  const textEl = () => document.getElementById('uptime-text');
  const closeBtn = () => document.getElementById('uptime-close');
  let startTime = Date.now();
  // 基准时间（本地时区）：2025-05-27 12:00:00
  const baseTime = new Date(2025, 4, 27, 12, 0, 0).getTime();
  let timerId = null;

  function formatDuration(ms) {
    const total = Math.floor(ms / 1000);
    const days = Math.floor(total / 86400);
    const hours = Math.floor((total % 86400) / 3600);
    const mins = Math.floor((total % 3600) / 60);
    const secs = total % 60;
    if (days > 0) return `${days}天 ${hours}时 ${mins}分`;
    if (hours > 0) return `${hours}时 ${mins}分 ${secs}秒`;
    if (mins > 0) return `${mins}分 ${secs}秒`;
    return `${secs}秒`;
  }

  function tick() {
    const el = textEl();
    if (!el) return;
    const now = Date.now();
    // 计算从基准时间 (baseTime) 到当前时间过去了多长
    let delta = Math.max(0, now - baseTime);
    let totalSeconds = Math.floor(delta / 1000);
    const seconds = totalSeconds % 60;
    totalSeconds = Math.floor(totalSeconds / 60);
    const minutes = totalSeconds % 60;
    totalSeconds = Math.floor(totalSeconds / 60);
    const hours = totalSeconds % 24;
    const totalDays = Math.floor(totalSeconds / 24);
    const years = Math.floor(totalDays / 365);
    const days = totalDays % 365;
    const pad = (n) => String(n).padStart(2, '0');
    const s = `${pad(years)} 年 ${pad(days)} 天 ${pad(hours)} 时 ${pad(minutes)} 分 ${pad(seconds)} 秒`;
    el.textContent = s;
  }

  function start() {
    tick();
    timerId = setInterval(tick, 1000);
  }

  function stop() {
    if (timerId) { clearInterval(timerId); timerId = null; }
  }

  function hideCard(e) {
    if (e && e.preventDefault) e.preventDefault();
    const card = document.getElementById('uptime-card');
    if (card) card.parentNode && card.parentNode.removeChild(card);
    stop();
    // remove resize handler if set
    if (window.__uptimeClampHandler) {
      window.removeEventListener('resize', window.__uptimeClampHandler);
      try { delete window.__uptimeClampHandler; } catch (err) { window.__uptimeClampHandler = undefined; }
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    startTime = Date.now();
    const cb = closeBtn();
    if (cb) cb.addEventListener('click', hideCard);
    start();

    // Make uptime card draggable using Pointer Events
    const card = document.getElementById('uptime-card');
    if (card) {
      // clamp position so card stays inside viewport
      // preserve anchor state on X/Y axes so card remains attached to edges when resized
      const ANCHOR_THRESHOLD = 16;
      function clampPosition() {
        const margin = 8;
        const rect = card.getBoundingClientRect();
        let left = parseFloat(card.style.left);
        let top = parseFloat(card.style.top);
        if (isNaN(left) || isNaN(top)) {
          left = rect.left;
          top = rect.top;
        }
        const maxLeft = Math.max(window.innerWidth - card.offsetWidth - margin, margin);
        const maxTop = Math.max(window.innerHeight - card.offsetHeight - margin, margin);

        // read anchors (set on release); default to 'none'
        const anchorX = card.dataset.anchorX || 'none';
        const anchorY = card.dataset.anchorY || 'none';

        // distances to edges
        const distLeft = left;
        const distRight = window.innerWidth - (left + card.offsetWidth);
        const distTop = top;
        const distBottom = window.innerHeight - (top + card.offsetHeight);

        let newLeft = left;
        let newTop = top;

        // X axis: keep pinned if anchored
        if (anchorX === 'left') {
          newLeft = margin;
        } else if (anchorX === 'right') {
          newLeft = maxLeft;
        } else {
          newLeft = Math.min(Math.max(left, margin), maxLeft);
          // detect if near edges and set anchor for future resizes
          if (distRight <= ANCHOR_THRESHOLD) card.dataset.anchorX = 'right';
          else if (distLeft <= ANCHOR_THRESHOLD) card.dataset.anchorX = 'left';
          else card.dataset.anchorX = 'none';
        }

        // Y axis: similar
        if (anchorY === 'top') {
          newTop = margin;
        } else if (anchorY === 'bottom') {
          newTop = maxTop;
        } else {
          newTop = Math.min(Math.max(top, margin), maxTop);
          if (distTop <= ANCHOR_THRESHOLD) card.dataset.anchorY = 'top';
          else if (distBottom <= ANCHOR_THRESHOLD) card.dataset.anchorY = 'bottom';
          else card.dataset.anchorY = 'none';
        }

        card.style.left = newLeft + 'px';
        card.style.top = newTop + 'px';
        card.style.right = 'auto';
      }
      // expose for hideCard to remove on cleanup
      window.__uptimeClampHandler = clampPosition;
      window.addEventListener('resize', clampPosition);
      // ensure initial clamp
      clampPosition();
      let dragging = false;
      let startX = 0, startY = 0;
      let origLeft = 0, origTop = 0;

      function onPointerDown(e) {
        // don't start drag when clicking the close button
        if (e.target && e.target.closest && e.target.closest('#uptime-close')) return;
        // only start drag on primary button
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        // clear anchors while dragging so movement is free
        card.dataset.anchorX = 'none';
        card.dataset.anchorY = 'none';
        dragging = true;
        card.setPointerCapture(e.pointerId);
        // compute origin positions
        const rect = card.getBoundingClientRect();
        startX = e.clientX;
        startY = e.clientY;
        // use style.left/top; if not set, initialize from rect
        origLeft = rect.left;
        origTop = rect.top;
        // switch to absolute left/top positioning
        card.style.right = 'auto';
        card.style.left = origLeft + 'px';
        card.style.top = origTop + 'px';
        card.style.transform = 'none';
        document.body.style.userSelect = 'none';
      }

      function onPointerMove(e) {
        if (!dragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        let newLeft = origLeft + dx;
        let newTop = origTop + dy;
        const margin = 8;
        const maxLeft = Math.max(window.innerWidth - card.offsetWidth - margin, margin);
        const maxTop = Math.max(window.innerHeight - card.offsetHeight - margin, margin);
        newLeft = Math.min(Math.max(newLeft, margin), maxLeft);
        newTop = Math.min(Math.max(newTop, margin), maxTop);
        card.style.left = newLeft + 'px';
        card.style.top = newTop + 'px';
      }

      function onPointerUp(e) {
        if (!dragging) return;
        dragging = false;
        try { card.releasePointerCapture(e.pointerId); } catch (err) {}
        // ensure final position is clamped inside viewport
        const rect = card.getBoundingClientRect();
        const margin = 8;
        const maxLeft = Math.max(window.innerWidth - card.offsetWidth - margin, margin);
        const maxTop = Math.max(window.innerHeight - card.offsetHeight - margin, margin);
        let finalLeft = Math.min(Math.max(rect.left, margin), maxLeft);
        let finalTop = Math.min(Math.max(rect.top, margin), maxTop);
        card.style.left = finalLeft + 'px';
        card.style.top = finalTop + 'px';
        // set anchors based on proximity to edges after release
        const distLeft = finalLeft;
        const distRight = window.innerWidth - (finalLeft + card.offsetWidth);
        const distTop = finalTop;
        const distBottom = window.innerHeight - (finalTop + card.offsetHeight);
        card.dataset.anchorX = (distRight <= ANCHOR_THRESHOLD) ? 'right' : (distLeft <= ANCHOR_THRESHOLD ? 'left' : 'none');
        card.dataset.anchorY = (distTop <= ANCHOR_THRESHOLD) ? 'top' : (distBottom <= ANCHOR_THRESHOLD ? 'bottom' : 'none');
        document.body.style.userSelect = '';
      }

      // Start drag from explicit drag handle (smaller area) if present, else from card title or card
      const header = card.querySelector('.drag-handle') || card.querySelector('.card-title') || card;
      header.style.cursor = 'move';
      header.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      // also handle pointercancel
      window.addEventListener('pointercancel', onPointerUp);
    }
  });

})();
