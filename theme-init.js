(function () {
  'use strict';

  var root = document.documentElement;

  try {
    if (localStorage.getItem('theme') === 'light') {
      root.setAttribute('data-theme', 'light');
    }
  } catch (e) {}

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
