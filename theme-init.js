(function () {
  'use strict';

  var root = document.documentElement;

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

  function updateThemeLabel() {
    var toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    var isLight = root.getAttribute('data-theme') === 'light';
    toggle.textContent = isLight ? 'Ciemny' : 'Jasny';
    toggle.setAttribute('aria-label', isLight ? 'Włącz ciemny motyw' : 'Włącz jasny motyw');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateThemeLabel);
  } else {
    updateThemeLabel();
  }
})();
