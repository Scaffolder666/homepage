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

/*
 * Optional Google Analytics 4 location reporting.
 *
 * Activation: replace the empty string below with the GA4 Web stream's
 * public Measurement ID (for example: G-XXXXXXXXXX).
 * While blank, no Google script, cookie or consent banner is loaded.
 *
 * Google Analytics only starts after the visitor opts in. Existing Vercel
 * Analytics and link-click events above are independent of this feature.
 */
(function () {
  'use strict';

  var GA4_MEASUREMENT_ID = '';
  if (!/^G-[A-Z0-9]+$/i.test(GA4_MEASUREMENT_ID)) return;

  var storageKey = 'sf_ga4_analytics_consent_v1';
  var banner = null;
  var started = false;

  function getChoice() {
    try { return window.localStorage.getItem(storageKey); }
    catch (error) { return null; }
  }

  function saveChoice(choice) {
    try { window.localStorage.setItem(storageKey, choice); }
    catch (error) { /* Private browsing or disabled storage. */ }
  }

  function expireGoogleCookies() {
    var host = window.location.hostname;
    var names = document.cookie.split(';').map(function (pair) {
      return pair.trim().split('=')[0];
    }).filter(function (name) {
      return name === '_ga' || name.indexOf('_ga_') === 0;
    });
    var domains = ['', host, '.' + host];
    var segments = host.split('.');
    if (segments.length > 2) domains.push('.' + segments.slice(-2).join('.'));
    names.forEach(function (name) {
      domains.forEach(function (domain) {
        document.cookie = name + '=; Max-Age=0; path=/' +
          (domain ? '; domain=' + domain : '') + '; SameSite=Lax';
      });
    });
  }

  function startGA4() {
    if (started) return;
    started = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    // Basic consent mode: the Google tag is not requested until consent.
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    window.gtag('js', new Date());
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('set', {
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    window.gtag('config', GA4_MEASUREMENT_ID, {
      send_page_view: true
    });

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' +
      encodeURIComponent(GA4_MEASUREMENT_ID);
    document.head.appendChild(script);
  }

  function dismissBanner() {
    if (banner) {
      banner.remove();
      banner = null;
    }
  }

  function decide(choice) {
    var wasStarted = started;
    saveChoice(choice);
    dismissBanner();
    if (choice === 'accepted') {
      startGA4();
      return;
    }
    if (wasStarted) {
      if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', { analytics_storage: 'denied' });
      }
      expireGoogleCookies();
      // Unload the previously requested Google tag so declined visits
      // do not continue to send any analytics requests.
      window.location.reload();
    }
  }

  function showBanner() {
    if (banner) return;
    banner = document.createElement('section');
    banner.className = 'sf-ga-consent-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Optional website analytics');
    banner.innerHTML =
      '<div class="sf-ga-consent-message">' +
        '<strong>Optional website analytics</strong>' +
        '<p>May I use Google Analytics to see aggregate visits ' +
          'by country, state and city? It loads only with your permission. ' +
          'Existing cookie-free Vercel statistics are separate. ' +
          '<a href="privacy.html">Learn more</a>.</p>' +
      '</div>' +
      '<div class="sf-ga-consent-actions">' +
        '<button type="button" data-ga-consent="declined">No thanks</button>' +
        '<button type="button" data-ga-consent="accepted">Allow analytics</button>' +
      '</div>';
    banner.querySelector('[data-ga-consent="accepted"]').addEventListener(
      'click', function () { decide('accepted'); });
    banner.querySelector('[data-ga-consent="declined"]').addEventListener(
      'click', function () { decide('declined'); });
    document.body.appendChild(banner);
  }

  function addPreferencesControl() {
    var footer = document.querySelector('footer');
    if (!footer) return;
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'sf-ga-preferences';
    button.textContent = 'Analytics preferences';
    button.setAttribute('aria-label', 'Change Google Analytics consent');
    button.addEventListener('click', showBanner);
    footer.appendChild(button);
  }

  var style = document.createElement('style');
  style.textContent =
    '.sf-ga-consent-banner{position:fixed;z-index:10000;left:16px;bottom:16px;' +
    'right:16px;max-width:620px;padding:18px 20px;border:1px solid #dddfe2;' +
    'border-radius:9px;background:#fff;color:#253039;box-shadow:0 8px 28px ' +
    'rgba(20,28,34,.14);font:14px/1.55 Arial,sans-serif;display:flex;' +
    'flex-wrap:wrap;gap:10px 18px;align-items:center}' +
    '.sf-ga-consent-message{flex:1 1 300px}' +
    '.sf-ga-consent-message strong{font-weight:700}' +
    '.sf-ga-consent-message p{margin:5px 0 0;color:#56616b;font-size:13px}' +
    '.sf-ga-consent-message a{color:#a41c30;text-decoration:underline}' +
    '.sf-ga-consent-actions{display:flex;gap:8px;flex-wrap:wrap}' +
    '.sf-ga-consent-actions button{font:600 13px Arial,sans-serif;' +
    'padding:10px 12px;cursor:pointer;border:1px solid #cfd4d8;' +
    'background:#fff;color:#29333b;border-radius:5px}' +
    '.sf-ga-consent-actions button:last-child{background:#a41c30;' +
    'border-color:#a41c30;color:#fff}' +
    '.sf-ga-consent-actions button:focus-visible,.sf-ga-preferences:focus-visible' +
    '{outline:3px solid #397fc4;outline-offset:2px}' +
    '.sf-ga-preferences{display:inline-block;margin:12px 0 4px 14px;' +
    'padding:4px;background:none;border:0;cursor:pointer;' +
    'font:12px Arial,sans-serif;color:#666;text-decoration:underline}' +
    '@media(max-width:600px){.sf-ga-consent-banner{left:10px;right:10px;' +
    'bottom:10px;max-height:65vh;overflow:auto;padding:13px 14px}' +
    '.sf-ga-consent-actions{width:100%}.sf-ga-consent-actions button{flex:1}}';
  document.head.appendChild(style);

  addPreferencesControl();
  if (getChoice() === 'accepted') {
    startGA4();
  } else if (getChoice() !== 'declined') {
    showBanner();
  }
})();
