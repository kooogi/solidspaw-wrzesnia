(function () {
  'use strict';
  try {
    localStorage.setItem('theme', 'light');
  } catch (e) {}
  location.replace('index.html');
})();
