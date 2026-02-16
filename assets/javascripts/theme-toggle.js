// theme-toggle.js
(function() {
  const themeToggle = () => document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;
  const iconSelector = '.material-icons';

  function initTheme() {
    const toggle = themeToggle();
    if (!toggle) return;
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (savedTheme === null && prefersDark);
    const icon = toggle.querySelector(iconSelector);

    if (isDark) {
      htmlElement.setAttribute('data-theme', 'dark');
      if (icon) icon.textContent = 'light_mode';
    } else {
      htmlElement.removeAttribute('data-theme');
      if (icon) icon.textContent = 'dark_mode';
    }
  }

  function toggleTheme(e) {
    e.preventDefault();
    const toggle = themeToggle();
    if (!toggle) return;
    const icon = toggle.querySelector(iconSelector);
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    if (newTheme === 'dark') {
      htmlElement.setAttribute('data-theme', 'dark');
      if (icon) icon.textContent = 'light_mode';
    } else {
      htmlElement.removeAttribute('data-theme');
      if (icon) icon.textContent = 'dark_mode';
    }

    localStorage.setItem('theme', newTheme);
  }

  document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    const toggle = themeToggle();
    if (toggle) toggle.addEventListener('click', toggleTheme);
  });
})();
