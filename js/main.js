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

  // Booking: shown only when a Calendly link is set on #book. The widget
  // script loads when the section comes near the screen, to keep the page fast.
  var book = document.getElementById('book');
  var calUrl = book && book.getAttribute('data-calendly-url');
  if (!calUrl) return;

  book.hidden = false;
  document.querySelectorAll('.needs-booking').forEach(function (el) { el.hidden = false; });
  document.getElementById('booking-fallback').href = calUrl;

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
    s.onload = function () {
      var box = document.getElementById('booking-widget');
      box.innerHTML = '';
      window.Calendly.initInlineWidget({ url: widgetUrl(), parentElement: box });
    };
    document.head.appendChild(s);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries, obs) {
      if (entries.some(function (e) { return e.isIntersecting; })) { loadWidget(); obs.disconnect(); }
    }, { rootMargin: '600px' }).observe(book);
  } else {
    loadWidget();
  }
})();
