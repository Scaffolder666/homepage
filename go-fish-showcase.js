/* Read-only Go Fish puzzle showcase for Outside the Lab.
 * Configure data-feed-url with the owner's deliberately published portfolio.json.
 * Never load a visitor's app session or access private catches and GPS records. */
(function () {
  'use strict';
  const root = document.getElementById('fishdex-showcase');
  if (!root) return;
  const url = root.dataset.feedUrl || '';
  if (!url) return; // no public data until the owner explicitly opts in

  let endpoint;
  try {
    endpoint = new URL(url);
    if (endpoint.protocol !== 'https:' ||
      endpoint.hostname !== 'ahcrtudzspqzvmlechun.supabase.co' ||
      !/^\/storage\/v1\/object\/public\/puzzle-showcase\/[0-9a-f-]{36}\/portfolio\.json$/i.test(endpoint.pathname))
      return;
  } catch { return; }

  const area = root.querySelector('.fishdex-showcase-grid');
  const summary = root.querySelector('.fishdex-showcase-summary');
  const status = root.querySelector('.fishdex-showcase-status');

  function metric(n, title) {
    const el = document.createElement('div');
    const count = document.createElement('strong');
    count.textContent = String(n);
    const label = document.createElement('span');
    label.textContent = title;
    el.append(count, label);
    return el;
  }

  function render(data) {
    if (!data || data.schema !== 1 || !Array.isArray(data.puzzles)) throw new Error('Invalid showcase');
    if (!Number.isSafeInteger(data.catchCount) || !Number.isSafeInteger(data.speciesCount)) throw new Error('Invalid counts');
    const items = data.puzzles.slice(0, 6).filter(p =>
      p && typeof p.name === 'string' && p.name.length < 100 &&
      Number.isSafeInteger(p.have) && Number.isSafeInteger(p.total) &&
      p.have >= 0 && p.total > 0 && p.have <= p.total &&
      typeof p.image === 'string' && /^data:image\/webp;base64,[A-Za-z0-9+/=]+$/.test(p.image));
    if (!items.length) throw new Error('No published puzzles');
    summary.replaceChildren(
      metric(data.speciesCount, 'Species collected'),
      metric(data.catchCount, 'Catches logged'),
      metric(data.completedCount || 0, 'Puzzles completed')
    );
    for (const p of items) {
      const card = document.createElement('div');
      card.className = 'fishdex-puzzle-card';
      const head = document.createElement('div');
      head.className = 'fishdex-puzzle-head';
      const name = document.createElement('strong');
      name.textContent = p.name;
      const count = document.createElement('span');
      count.textContent = p.have + ' / ' + p.total;
      head.append(name, count);
      const img = document.createElement('img');
      img.src = p.image;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.alt = 'Go Fish progress puzzle ' + p.name + ': ' + p.have + ' of ' + p.total + ' pieces';
      const rail = document.createElement('div');
      rail.className = 'fishdex-progress';
      const fill = document.createElement('span');
      fill.style.width = (p.have / p.total * 100) + '%';
      rail.appendChild(fill);
      card.append(head, rail, img);
      area.appendChild(card);
    }
    status.hidden = true;
    summary.hidden = false;
    area.hidden = false;
    root.classList.add('is-live');
    const stamp = root.querySelector('.fishdex-updated');
    if (stamp && data.updatedAt && !Number.isNaN(Date.parse(data.updatedAt))) {
      stamp.textContent = 'Last synced ' + new Date(data.updatedAt).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'});
    }
  }
  fetch(endpoint.href, {cache:'no-store', credentials:'omit', referrerPolicy:'no-referrer'})
    .then(r => { if (!r.ok) throw new Error('Snapshot unavailable'); return r.json(); })
    .then(render)
    .catch(() => { if (status) status.textContent = 'Public puzzle preview is temporarily unavailable.'; });
})();
