// keyboard.js — 按下物理按键时高亮底部键盘区对应键帽
;(() => {
  const root = document.documentElement
  const section = document.getElementById('keyboard_section')
  const keys = new Map(
    [...section.querySelectorAll('kbd')].map((k) => [k.dataset.key.toLowerCase(), k])
  )

  // 统一小写
  const nameOf = (e) => e.key.toLowerCase()

  const zoom = (delta) => {
    const size = parseFloat(getComputedStyle(root).fontSize)
    root.style.fontSize = `${Math.min(24, Math.max(12, size + delta))}px`
  }

  const toggleTheme = () => {
    const dark = root.getAttribute('data-theme') !== 'dark'
    if (dark) root.dataset.theme = 'dark'
    else root.removeAttribute('data-theme')
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }

  // 顶部导航：分页切换（hash 路由，支持直接链接与前进/后退）
  const navInputs = [...document.querySelectorAll('#nav_form input[type="radio"]')]
  const sections = [...document.querySelectorAll('main > .section')]

  const showSection = (id) => {
    if (!sections.length) return
    const idx = Math.max(0, sections.findIndex((s) => s.id === id))
    sections.forEach((s, n) => s.classList.toggle('is-active', n === idx))
    navInputs[idx].checked = true
    if (location.hash !== `#${sections[idx].id}`) location.hash = sections[idx].id
    scrollTo(0, 0)
    document.title = `${navInputs[idx].labels[0].textContent} · brz256's Lab`
    navInputs[idx].focus({ preventScroll: true })
  }

  const goToSection = (i) => sections[i] && showSection(sections[i].id)

  document
    .getElementById('nav_form')
    ?.addEventListener('change', (e) => showSection(e.target.value.slice(1)))

  addEventListener('hashchange', () => showSection(location.hash.slice(1)))

  // ---- Navigate：把焦点当作“光标”，在元素块之间移动（仿 commitmono）----
  // 空行占位块（.br）只是排版用，不参与选中
  const isPlaceholder = (el) => el.classList.contains('br')

  // “块”= 分页的直接子元素；若包了一层 .section_body（用于布局），则取其子元素
  const blocksOf = (scope) =>
    [...scope.children]
      .flatMap((el) =>
        el.classList.contains('section_body') ? [...el.children] : [el]
      )
      .filter((el) => !isPlaceholder(el))

  // 每个内容块都变成可获得焦点的元素
  sections.forEach((sec) => blocksOf(sec).forEach((el) => (el.tabIndex = 0)))

  // 可选中列表 = 当前选中的分页按钮 + 当前分页内的所有块
  const focusables = () => {
    const current = sections.find((s) => s.classList.contains('is-active'))
    const list = [
      ...document.querySelectorAll('#nav_form input:checked'),
      ...(current ? blocksOf(current) : []),
    ]
    // 跳过被 display:none 隐藏的块
    return list.filter(
      (el) => el.nodeName === 'INPUT' || el.offsetWidth || el.offsetHeight
    )
  }

  // 输入框本身不可见，抖动要作用在它的 label 上
  const shakeTarget = (el) =>
    el?.nodeName === 'INPUT' && el.type === 'radio'
      ? el.parentNode.querySelector('input + label')
      : el

  const SHAKES = ['shake', 'shake_up', 'shake_down', 'shake_left', 'shake_right']

  // 无法继续移动时，朝对应方向抖一下
  const shake = (el, dir) => {
    const node = shakeTarget(el)
    if (!node) return
    const cls = dir ? `shake_${dir}` : 'shake'
    node.classList.remove(...SHAKES)
    void node.offsetHeight // 强制重排，让同一个动画能连续触发
    node.classList.add(cls)
    node.addEventListener('animationend', () => node.classList.remove(cls), {
      once: true,
    })
  }

  // 纵向（j / k、↓ / ↑）：在块列表中前后移动
  const moveFocus = (step) => {
    const list = focusables()
    if (!list.length) return
    const i = list.indexOf(document.activeElement)
    if (i === -1) {
      // 焦点还在 body 上：直接跳到首/尾
      ;(step > 0 ? list[0] : list[list.length - 1]).focus()
      return
    }
    const next = list[i + step]
    if (next) next.focus()
    else shake(list[i], step > 0 ? 'down' : 'up')
  }

  // 横向（h / l、← / →）：在顶部导航上切换分页，在正文里则提示没有横向目标
  const moveSideways = (step) => {
    const i = navInputs.indexOf(document.activeElement)
    if (i === -1) {
      shake(document.activeElement, step > 0 ? 'right' : 'left')
      return
    }
    const next = navInputs[i + step]
    if (next) next.click()
    else shake(navInputs[i], step > 0 ? 'right' : 'left')
  }

  // 焦点进入视口时自动滚动到可见位置
  addEventListener('focusin', (e) => {
    if (e.target.closest?.('#keyboard_section')) return
    e.target.scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
  })

  showSection(location.hash.slice(1))

  const actions = {
    1: () => goToSection(0),
    2: () => goToSection(1),
    3: () => goToSection(2),
    // Navigate：hjkl 等价于 ↓ ← ↑ →
    j: () => moveFocus(1),
    arrowdown: () => moveFocus(1),
    k: () => moveFocus(-1),
    arrowup: () => moveFocus(-1),
    h: () => moveSideways(-1),
    arrowleft: () => moveSideways(-1),
    l: () => moveSideways(1),
    arrowright: () => moveSideways(1),
    enter: () => shake(document.activeElement),
    // Scroll
    w: () => scrollBy(0, -120),
    a: () => scrollBy(-120, 0),
    s: () => scrollBy(0, 120),
    d: () => scrollBy(120, 0),
    '+': () => zoom(1),
    '-': () => zoom(-1),
    m: toggleTheme,
    x: () => section.classList.toggle('hidden'),
  }

  const press = (name, down) => keys.get(name)?.classList.toggle('active_key', down)

  // 只在真正的文本输入场景下放行（radio/checkbox 等仍参与快捷键）
  const isTextField = (el) =>
    el?.matches?.(
      'textarea, [contenteditable=""], [contenteditable="true"], [contenteditable="plaintext-only"], input:not([type="radio"], [type="checkbox"], [type="button"], [type="submit"], [type="reset"], [type="range"], [type="color"], [type="file"])'
    )

  addEventListener('keydown', (e) => {
    if (e.key === 'Tab' || isTextField(e.target)) return
    const name = nameOf(e)
    press(name, true)
    const act = actions[name]
    if (act) {
      e.preventDefault()
      act()
    }
  })

  addEventListener('keyup', (e) => press(nameOf(e), false))

  // 窗口失焦时清除所有高亮，避免“卡住”
  addEventListener('blur', () => keys.forEach((k) => k.classList.remove('active_key')))

  // 点击键帽：闪一下并执行相同动作
  keys.forEach((key, name) =>
    key.addEventListener('click', () => {
      key.classList.add('active_key')
      setTimeout(() => key.classList.remove('active_key'), 120)
      actions[name]?.()
    })
  )
})()
