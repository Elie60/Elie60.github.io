(function () {
  var root = document.documentElement;

  function save(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }

  document.getElementById('lang-toggle').addEventListener('click', function () {
    var next = root.getAttribute('data-lang') === 'fr' ? 'en' : 'fr';
    root.setAttribute('data-lang', next);
    root.lang = next;
    save('lang', next);
  });

  document.getElementById('theme-toggle').addEventListener('click', function () {
    var current = root.getAttribute('data-theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    save('theme', next);
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
