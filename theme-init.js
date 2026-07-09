(function () {
  'use strict';

  var root = document.documentElement;

  try {
    if (localStorage.getItem('theme') === 'light') {
      root.setAttribute('data-theme', 'light');
    }
  } catch (e) {}

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
  }

  function initToggle() {
    var toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        setTheme(getTheme() === 'light' ? 'dark' : 'light');
      });
    }
    updateThemeLabel();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToggle);
  } else {
    initToggle();
  }
})();
