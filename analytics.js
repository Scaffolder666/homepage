(function () {
  'use strict';

  function cleanLabel(link) {
    var label =
      link.getAttribute('data-analytics-label') ||
      link.getAttribute('aria-label') ||
      link.textContent ||
      '';
    return label.replace(/\s+/g, ' ').trim().slice(0, 100) || 'Unlabeled link';
  }

  function cleanDestination(link) {
    var raw = link.getAttribute('href') || '';
    if (raw.indexOf('mailto:') === 0) return 'email';
    if (raw.indexOf('tel:') === 0) return 'phone';
    try {
      var url = new URL(link.href, window.location.href);
      if (url.origin === window.location.origin) return url.pathname || '/';
      return (url.hostname + url.pathname).slice(0, 120);
    } catch (e) {
      return raw.slice(0, 120);
    }
  }

  document.addEventListener('click', function (event) {
    var target = event.target;
    if (!target || !target.closest) return;
    var link = target.closest('a[href]');
    if (!link) return;

    var href = link.getAttribute('href') || '';
    if (!href || href.charAt(0) === '#' || href.indexOf('javascript:') === 0) return;

    if (typeof window.va === 'function') {
      window.va('event', {
        name: 'Link Click',
        data: {
          label: cleanLabel(link),
          destination: cleanDestination(link)
        }
      });
    }
  }, { passive: true });
})();