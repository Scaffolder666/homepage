/* Public, owner-opted-in Go Fish photo mosaics. No fishing account authentication. */
(function () {
  'use strict';
  const root = document.getElementById('fishlog-showcase');
  if (!root) return;
  const feedUrl = (root.dataset.feedUrl || '').trim();
  // Sharing is private-by-default: no request or public display until configured.
  if (!feedUrl) return;

  let endpoint;
  try {
    endpoint = new URL(feedUrl);
    if (endpoint.protocol !== 'https:' ||
        !/\/storage\/v1\/object\/public\/puzzle-showcase\/[^/]+\/portfolio\.json$/.test(endpoint.pathname)) {
      throw new Error('Unexpected public Go Fish feed URL');
    }
  } catch (error) {
    console.warn('Go Fish portfolio is not configured:', error);
    return;
  }

  function count(value) {
    return Number.isSafeInteger(value) && value >= 0 ? value : 0;
  }
  function stat(label, value) {
    const item = document.createElement('div');
    item.className = 'fishlog-stat';
    const number = document.createElement('strong');
    number.textContent = count(value).toLocaleString('en-US');
    const caption = document.createElement('span');
    caption.textContent = label;
    item.append(number, caption);
    return item;
  }
  function puzzleItem(data) {
    if (!data || typeof data !== 'object' || typeof data.name !== 'string') return null;
    if (typeof data.image !== 'string' ||
        !/^data:image\/(?:webp|png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(data.image)) return null;
    const have = count(data.have);
    const total = count(data.total);
    if (!total || have > total) return null;
    const name = data.name.slice(0, 100);

    const figure = document.createElement('figure');
    figure.className = 'fishlog-puzzle';
    const img = document.createElement('img');
    img.src = data.image;
    img.alt = name + ' catch-photo puzzle';
    img.loading = 'lazy';
    img.decoding = 'async';

    const caption = document.createElement('figcaption');
    const title = document.createElement('span');
    title.className = 'fishlog-puzzle-name';
    title.textContent = name;
    const progressCount = document.createElement('span');
    progressCount.className = 'fishlog-puzzle-count';
    progressCount.textContent = have + '/' + total;
    caption.append(title, progressCount);

    const categories = { challenge: 'Challenge', region: 'Region', family: 'Fish family' };
    const category = Object.prototype.hasOwnProperty.call(categories, data.category)
      ? categories[data.category] : '';
    const categoryLabel = document.createElement('span');
    categoryLabel.className = 'fishlog-category';
    if (category) categoryLabel.textContent = category;

    const progress = document.createElement('progress');
    progress.className = 'fishlog-progress';
    progress.max = total;
    progress.value = have;
    progress.setAttribute('aria-label', name + ' progress');
    figure.append(img, caption);
    if (category) figure.append(categoryLabel);
    figure.append(progress);
    return figure;
  }

  fetch(endpoint.href, { credentials: 'omit', mode: 'cors', cache: 'no-store' })
    .then(function (response) {
      if (!response.ok) throw new Error('Go Fish feed HTTP ' + response.status);
      return response.json();
    })
    .then(function (data) {
      if (!data || data.schema !== 1 || data.app !== 'Go Fish' ||
          !Array.isArray(data.puzzles)) throw new Error('Invalid Go Fish portfolio data');
      const stats = root.querySelector('.fishlog-stats');
      const puzzles = root.querySelector('.fishlog-puzzles');
      if (!stats || !puzzles) return;
      stats.replaceChildren(
        stat('Species caught', data.speciesCount),
        stat('Total catches', data.catchCount),
        stat('Puzzles completed', data.completedCount)
      );
      const cards = data.puzzles.slice(0, 6).map(puzzleItem).filter(Boolean);
      if (cards.length) puzzles.replaceChildren(...cards);
      else puzzles.hidden = true;
      const hint = root.querySelector('.fishlog-scroll-hint');
      if (hint) hint.hidden = cards.length < 2;

      const updated = root.querySelector('.fishlog-updated');
      const date = new Date(data.updatedAt);
      if (updated && Number.isFinite(date.getTime())) {
        updated.textContent = 'Updated ' + date.toLocaleDateString('en-US',
          { month: 'short', day: 'numeric', year: 'numeric' }) + ' via Go Fish';
      } else if (updated) updated.hidden = true;
      root.hidden = false;
    })
    .catch(function (error) {
      // Revocation or network errors never reveal stale private profile data.
      console.warn('Go Fish public showcase unavailable:', error);
    });
})();