(function () {
  var d = document, bar = d.querySelector('.progress'), toc = d.querySelector('.toc');
  var heads = [].slice.call(d.querySelectorAll('.doc h2[id]'));
  var wide = matchMedia('(min-width: 901px)');
  var det = toc && toc.querySelector('details');
  if (det) {
    var sync = function () { det.open = wide.matches; };
    sync(); wide.addEventListener('change', sync);
    toc.addEventListener('click', function (e) { if (e.target.closest('a') && !wide.matches) det.open = false; });
  }
  var current = null, busy = false;
  function update() {
    busy = false;
    var max = d.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, scrollY / max) : 0) + ')';
    var cur = null;
    for (var i = 0; i < heads.length; i++) { if (heads[i].getBoundingClientRect().top <= 120) cur = heads[i]; else break; }
    var id = cur ? cur.id : null;
    if (!toc || id === current) return;
    current = id;
    [].forEach.call(toc.querySelectorAll('a'), function (a) {
      var on = a.getAttribute('href') === '#' + id;
      if (on) { a.setAttribute('aria-current', 'true'); if (wide.matches) keepVisible(a); } else a.removeAttribute('aria-current');
    });
  }
  function keepVisible(a) {
    var t = a.offsetTop, h = a.offsetHeight;
    if (t < toc.scrollTop + 20) toc.scrollTop = t - 20;
    else if (t + h > toc.scrollTop + toc.clientHeight - 20) toc.scrollTop = t + h - toc.clientHeight + 20;
  }
  addEventListener('scroll', function () { if (!busy) { busy = true; requestAnimationFrame(update); } }, { passive: true });
  update();
  var p = d.querySelector('[data-print]');
  if (p) p.addEventListener('click', function () { print(); });
})();
