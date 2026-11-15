(function () {
  var root = document.documentElement;
  try { var saved = localStorage.getItem('theme'); if (saved) root.setAttribute('data-theme', saved); } catch (e) {}
  var t = document.getElementById('themeToggle');
  function label() { if (t) t.textContent = root.getAttribute('data-theme') === 'dark' ? 'Light' : 'Dark'; }
  label();
  if (t) t.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    label();
  });

  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('in'); }); }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var target = parseFloat(el.getAttribute('data-count')), suffix = el.getAttribute('data-suffix') || '';
    if (reduce) { el.textContent = target + suffix; return; }
    var start = null, dur = 1200;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });

  var ea = document.getElementById('expandAll'), ca = document.getElementById('collapseAll');
  function setAll(open) { document.querySelectorAll('details.item').forEach(function (d) { d.open = open; }); }
  if (ea) ea.addEventListener('click', function () { setAll(true); });
  if (ca) ca.addEventListener('click', function () { setAll(false); });

  var items = document.querySelectorAll('[data-filterable]');
  var search = document.getElementById('search');
  var chips = document.querySelectorAll('.chip[data-filter]');
  var active = 'all';
  function apply() {
    var q = search ? search.value.trim().toLowerCase() : '';
    items.forEach(function (it) {
      var tags = ((it.getAttribute('data-tags') || '') + ' ' + (it.getAttribute('data-country') || '')).toLowerCase().split(/[, ]+/);
      var okTag = active === 'all' || tags.indexOf(active.toLowerCase()) !== -1;
      var okText = !q || it.textContent.toLowerCase().indexOf(q) !== -1;
      it.classList.toggle('hidden', !(okTag && okText));
    });
    var empty = document.getElementById('empty');
    if (empty) empty.classList.toggle('hidden', document.querySelectorAll('[data-filterable]:not(.hidden)').length > 0);
  }
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      chips.forEach(function (x) { x.classList.remove('on'); });
      c.classList.add('on'); active = c.getAttribute('data-filter'); apply();
    });
  });
  if (search) search.addEventListener('input', apply);

  // Expertise orbs: click a circle to open its panel; click again or the close button to collapse
  var panel = document.getElementById('orbPanel');
  var orbs = document.querySelectorAll('.orb');
  function closePanel() {
    if (!panel) return;
    panel.classList.remove('open');
    orbs.forEach(function (o) { o.classList.remove('on'); o.setAttribute('aria-expanded', 'false'); });
  }
  orbs.forEach(function (o) {
    o.addEventListener('click', function () {
      var wasOn = o.classList.contains('on');
      closePanel();
      if (wasOn) return;
      var src = document.getElementById(o.getAttribute('data-src'));
      panel.innerHTML = src.innerHTML;
      panel.style.setProperty('--c1', o.style.getPropertyValue('--c1'));
      panel.style.setProperty('--c2', o.style.getPropertyValue('--c2'));
      o.classList.add('on'); o.setAttribute('aria-expanded', 'true');
      requestAnimationFrame(function () { panel.classList.add('open'); });
      var btn = panel.querySelector('.closer');
      if (btn) btn.addEventListener('click', closePanel);
      setTimeout(function () { panel.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' }); }, 250);
    });
  });
})();

// Journey roadmap: select a milestone to see the detail
(function () {
  var panel = document.getElementById('jPanel');
  if (!panel) return;
  var nodes = document.querySelectorAll('.jnode');
  function close() { panel.classList.remove('open'); nodes.forEach(function (n) { n.classList.remove('on'); n.setAttribute('aria-expanded', 'false'); }); }
  nodes.forEach(function (n) {
    n.addEventListener('click', function () {
      var was = n.classList.contains('on');
      close();
      if (was) return;
      panel.innerHTML = document.getElementById(n.getAttribute('data-src')).innerHTML;
      panel.style.setProperty('--cc', n.style.getPropertyValue('--cc'));
      n.classList.add('on'); n.setAttribute('aria-expanded', 'true');
      requestAnimationFrame(function () { panel.classList.add('open'); });
      var c = panel.querySelector('.closer'); if (c) c.addEventListener('click', close);
    });
  });
  var road = document.querySelector('.road');
  document.querySelectorAll('.road-btn').forEach(function (b) {
    b.addEventListener('click', function () { road.scrollBy({ left: b.classList.contains('l') ? -420 : 420, behavior: 'smooth' }); });
  });
})();

// Open the role a link points to (for example experience.html#adib)
(function () {
  function openHash() {
    if (!location.hash) return;
    var el = document.getElementById(location.hash.slice(1));
    if (!el) return;
    var d = el.tagName === 'DETAILS' ? el : el.querySelector('details');
    while (d) { d.open = true; d = d.parentElement && d.parentElement.closest('details'); }
    setTimeout(function () { el.scrollIntoView({ block: 'start' }); }, 50);
  }
  openHash(); window.addEventListener('hashchange', openHash);
})();
