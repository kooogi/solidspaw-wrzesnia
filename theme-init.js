(function () {
  'use strict';

  var root = document.documentElement;

  function getTheme() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function updateThemeLabel() {
    var toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    var isLight = getTheme() === 'light';
    toggle.textContent = isLight ? 'Ciemny' : 'Jasny';
    toggle.setAttribute('aria-label', isLight ? 'Włącz ciemny motyw' : 'Włącz jasny motyw');
  }

  function setTheme(theme) {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
    try { localStorage.setItem('theme', theme); } catch (e) {}
    updateThemeLabel();
    document.dispatchEvent(new CustomEvent('solidspaw-themechange', { detail: { theme: theme } }));
  }

  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', 'light');
    }
  } catch (e) {
    root.setAttribute('data-theme', 'light');
  }

  function initToggle() {
    updateThemeLabel();
    var toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        setTheme(getTheme() === 'light' ? 'dark' : 'light');
      });
    }
  }

  window.SolidSpawTheme = { getTheme: getTheme, setTheme: setTheme };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToggle);
  } else {
    initToggle();
  }
})();
