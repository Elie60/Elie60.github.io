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

  // Booking: the buttons link straight to Calendly. The embedded calendar is
  // an extra; its script loads when the section comes near the screen, and if
  // the browser blocks it the box is hidden so visitors use the button instead.
  var book = document.getElementById('book');
  var calUrl = book && book.getAttribute('data-calendly-url');
  var box = document.getElementById('booking-widget');
  if (!calUrl || !box) return;

  function hideEmbed() { box.hidden = true; }

  function widgetUrl() {
    var dark = root.getAttribute('data-theme') === 'dark' ||
      (!root.getAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var params = 'hide_gdpr_banner=1&primary_color=8b1a1a' +
      (dark ? '&background_color=1d1a19&text_color=eeeae4' : '');
    return calUrl + (calUrl.indexOf('?') === -1 ? '?' : '&') + params;
  }

  var loaded = false;
  function loadWidget() {
    if (loaded) return;
    loaded = true;
    var s = document.createElement('script');
    s.src = 'https://assets.calendly.com/assets/external/widget.js';
    s.async = true;
    s.onerror = hideEmbed;
    s.onload = function () {
      if (!window.Calendly) return hideEmbed();
      box.innerHTML = '';
      window.Calendly.initInlineWidget({ url: widgetUrl(), parentElement: box });
    };
    document.head.appendChild(s);
    // If nothing has appeared after 12 s (blocked by the browser), hide the box.
    setTimeout(function () { if (!box.querySelector('iframe')) hideEmbed(); }, 12000);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries, obs) {
      if (entries.some(function (e) { return e.isIntersecting; })) { loadWidget(); obs.disconnect(); }
    }, { rootMargin: '600px' }).observe(book);
  } else {
    loadWidget();
  }
})();
