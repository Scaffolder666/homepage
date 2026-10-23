# Google Analytics 4 setup for shuofeng.org

## Current state

The public pages `index.html`, `news.html`, `cv.html`, `cameleon.html`, and `tom.html` already load the common `analytics.js` file.

- Existing **Vercel Web Analytics** remains active.
- The new **Google Analytics 4** integration is **prepared but OFF** until the website owner supplies a real Measurement ID.
- The non-indexed research/Secret Places pages do not load this script.
- The optional GA4 tag will not load until a visitor actively accepts the analytics banner. Visitors can change their choice through **Analytics preferences** in the public-page footer.
- `privacy.html` explains both analytics providers and the opt-in behavior.

## Owner setup in Google Analytics

1. Sign into https://analytics.google.com/ with the Google account that should own the property.
2. Create or choose an **Analytics account** and **Google Analytics 4 property**. Use `shuofeng.org` for the property name and select the desired reporting timezone (for example America/New_York).
3. Under **Admin → Data collection and modification → Data streams**, add a **Web stream** with URL `https://www.shuofeng.org`.
4. Copy its **Measurement ID**, which begins with `G-`.
5. In `analytics.js`, replace **only** `var GA4_MEASUREMENT_ID = '';` with the actual `G-...` value, or send this public Measurement ID to the website maintainer to insert.
6. Deploy the update to the project's production branch. This static HTML project does not have build-time environment-variable injection, so adding an environment variable alone will **not** change `analytics.js`.
7. In a browser, visit the public website and choose **Allow analytics**. Confirm that the Google tag is loaded and inspect **Reports → Realtime** in GA4.
8. After processing, see **Reports → User Attributes → Demographic details** and select **Region** or **City** for aggregated location views.

## Scope and limitations

- Only consenting visitor activity appears in GA4. Its visit counts will not match Vercel Web Analytics.
- State, province, and city are inferred from network location and may be wrong with VPNs or corporate/school networks.
- City data might be thresholded/suppressed when visitor volume is low, and it cannot identify a street or exact neighborhood.
- GA4 cannot restore historical regional/city information from previously stored Vercel country-level reports.
- The Measurement ID is a public tag identifier, not a password. Never commit a Google account credential or service-account key.
- Existing optional Vercel click events continue independently of GA4.

## References

- GA4 website setup: https://support.google.com/analytics/answer/14183469
- GA4 location dimensions: https://support.google.com/analytics/answer/12948931
- Google basic consent mode: https://developers.google.com/tag-platform/security/concepts/consent-mode
