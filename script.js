/* Mufraj Ahmed Khan, portfolio.
   Each feature is its own function, run through safely() so one failure
   never takes the others down. The page is fully readable without this file. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function safely(fn) {
    try { fn(); } catch (err) { /* keep the rest of the page working */ }
  }

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  // Re-trigger a CSS animation class and drop it when that animation ends.
  function replayClass(el, cls, animationName) {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
    el.addEventListener('animationend', function done(e) {
      if (animationName && e.animationName !== animationName) return;
      el.classList.remove(cls);
      el.removeEventListener('animationend', done);
    });
  }

  /* ---------- Theme switch (dark by default) ---------- */
  function initTheme() {
    var root = document.documentElement;
    var btn = $('.theme-toggle');
    var hint = $('.theme-hint');
    if (!btn) return;

    function current() {
      return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    }
    function sync() {
      btn.setAttribute('aria-checked', String(current() === 'light'));
    }
    function hideHint() {
      if (!hint || hint.hidden) return;
      hint.hidden = true;
      btn.classList.remove('is-hinting');
      try { localStorage.setItem('themeHint', 'seen'); } catch (e) {}
    }

    btn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      sync();
      hideHint();
    });
    sync();

    // First visit only: point at the switch so people know light mode exists.
    var seen = true;
    try { seen = !!(localStorage.getItem('themeHint') || localStorage.getItem('theme')); } catch (e) {}
    if (!hint || seen) return;
    hint.addEventListener('click', function () { btn.click(); });
    setTimeout(function () {
      if (!btn.offsetParent) return;
      hint.hidden = false;
      btn.classList.add('is-hinting');
      var b = btn.getBoundingClientRect();
      var h = hint.getBoundingClientRect();
      var x = b.left + b.width / 2 - h.left;
      hint.style.setProperty('--arrow-x', Math.max(16, Math.min(h.width - 16, x)) + 'px');
      setTimeout(hideHint, 9000);
    }, 1800);
    window.addEventListener('scroll', function onScroll() {
      if (window.scrollY < 500) return;
      hideHint();
      window.removeEventListener('scroll', onScroll);
    }, { passive: true });
  }

  /* ---------- Header firms up once you scroll ---------- */
  function initHeader() {
    var header = $('.site-header');
    if (!header) return;
    function update() { header.classList.toggle('is-scrolled', window.scrollY > 12); }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------- Live Karachi time in the footer ---------- */
  function initClock() {
    var el = $('[data-clock]');
    if (!el || !window.Intl) return;
    var fmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Karachi' });
    function tick() { el.textContent = fmt.format(new Date()); }
    tick();
    setInterval(tick, 30000);
  }

  /* ---------- Mobile menu ---------- */
  function initMenu() {
    var header = $('.site-header');
    var btn = $('.menu-toggle');
    var nav = $('#site-nav');
    if (!header || !btn || !nav) return;

    function setOpen(open) {
      header.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Close' : 'Menu';
    }

    btn.addEventListener('click', function () {
      setOpen(btn.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('is-open')) {
        setOpen(false);
        btn.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (header.classList.contains('is-open') && !header.contains(e.target)) setOpen(false);
    });
    window.matchMedia('(min-width: 720px)').addEventListener('change', function (mq) {
      if (mq.matches) setOpen(false);
    });
  }

  /* ---------- Active nav link while scrolling ---------- */
  function initActiveNav() {
    if (!('IntersectionObserver' in window)) return;
    var links = $$('.site-nav a[href^="#"]');
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var sections = Object.keys(byId).map(function (id) { return document.getElementById(id); }).filter(Boolean);

    function setActive(id) {
      links.forEach(function (a) {
        if (a === byId[id]) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { observer.observe(s); });

    // Above the work section nothing is active.
    var hero = $('.hero');
    if (hero) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) setActive(null);
      }, { rootMargin: '-40% 0px -55% 0px' }).observe(hero);
    }
  }

  /* ---------- Tile board ---------- */
  function initBoard() {
    var board = $('.board');
    if (!board) return;
    var tiles = $$('.tile', board);
    var size = 5;
    var done = $('.board__done');
    var reset = $('.board__reset');
    var count = $('.board__count b');
    var colours = ['var(--tomato)', 'var(--butter)', 'var(--sky)', 'var(--mint)'];
    var nextColour = 0;

    function isLit(t) { return t.getAttribute('aria-pressed') === 'true'; }

    function neighbours(i) {
      var r = Math.floor(i / size), c = i % size, out = [];
      if (r > 0) out.push(i - size);
      if (r < size - 1) out.push(i + size);
      if (c > 0) out.push(i - 1);
      if (c < size - 1) out.push(i + 1);
      return out.map(function (n) { return tiles[n]; });
    }

    function checkCleared() {
      var lit = tiles.filter(isLit).length;
      var cleared = lit === tiles.length;
      if (count) count.textContent = String(lit);
      board.classList.toggle('is-cleared', cleared);
      if (done) done.hidden = !cleared;
      if (reset) reset.hidden = !cleared;
    }

    function flip(i) {
      var tile = tiles[i];
      var on = !isLit(tile);
      var colour = nextColour;
      if (on) {
        tile.setAttribute('data-c', String(colour));
        nextColour = (nextColour + 1) % colours.length;
      }
      tile.setAttribute('aria-pressed', String(on));
      if (!reduceMotion.matches) {
        replayClass(tile, 'is-flipping', 'tile-flip');
        if (on) {
          setTimeout(function () {
            neighbours(i).forEach(function (n) {
              n.style.setProperty('--pc', colours[colour]);
              replayClass(n, 'is-pulsing', 'tile-pulse');
            });
          }, 110);
        }
      }
      checkCleared();
    }

    function focusTile(i) {
      tiles.forEach(function (t, j) { t.tabIndex = j === i ? 0 : -1; });
      tiles[i].focus();
    }

    tiles.forEach(function (tile, i) {
      tile.addEventListener('click', function () {
        tiles.forEach(function (t, j) { t.tabIndex = j === i ? 0 : -1; });
        flip(i);
      });
    });

    board.addEventListener('keydown', function (e) {
      var i = tiles.indexOf(document.activeElement);
      if (i < 0) return;
      var r = Math.floor(i / size), c = i % size, next = null;
      switch (e.key) {
        case 'ArrowRight': if (c < size - 1) next = i + 1; break;
        case 'ArrowLeft': if (c > 0) next = i - 1; break;
        case 'ArrowDown': if (r < size - 1) next = i + size; break;
        case 'ArrowUp': if (r > 0) next = i - size; break;
        case 'Home': next = e.ctrlKey ? 0 : r * size; break;
        case 'End': next = e.ctrlKey ? tiles.length - 1 : r * size + size - 1; break;
        default: return;
      }
      e.preventDefault();
      if (next !== null) focusTile(next);
    });

    if (reset) {
      reset.addEventListener('click', function () {
        tiles.forEach(function (t) { t.setAttribute('aria-pressed', 'false'); });
        checkCleared();
        focusTile(0);
      });
    }
  }

  /* ---------- Work filters ---------- */
  var applyFilter = function () {};

  function initFilters() {
    var buttons = $$('.filters button');
    var groups = $$('.work-group');
    if (!buttons.length || !groups.length) return;

    applyFilter = function (value) {
      buttons.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === value));
      });
      groups.forEach(function (g) {
        var show = value === 'all' || g.getAttribute('data-group') === value;
        if (show === !g.classList.contains('is-hidden')) return;
        g.classList.add('is-animating');
        g.classList.toggle('is-hidden', !show);
        setTimeout(function () { g.classList.remove('is-animating'); }, 420);
      });
    };

    buttons.forEach(function (b) {
      b.addEventListener('click', function () { applyFilter(b.getAttribute('data-filter')); });
    });

    // Links to #games (e.g. from the cleared board) should never land on a hidden group.
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href="#games"]');
      var games = document.getElementById('games');
      if (!link || !games || !games.classList.contains('is-hidden')) return;
      e.preventDefault();
      applyFilter('all');
      setTimeout(function () {
        games.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth' });
        games.focus({ preventScroll: true });
        history.replaceState(null, '', '#games');
      }, 400);
    });
  }

  /* ---------- Before/after slider (only if the before image exists) ---------- */
  function initCompare() {
    $$('.shot[data-before]').forEach(function (shot) {
      var after = $('.shot__img', shot);
      if (!after) return;

      function probe() {
        var before = new Image();
        before.onload = function () { build(shot, before); };
        before.src = shot.getAttribute('data-before');
      }
      // Only look for the before image once the after image has really loaded.
      if (after.complete && after.naturalWidth) probe();
      else after.addEventListener('load', probe, { once: true });
    });

    function build(shot, before) {
      var pos = 50;
      before.className = 'shot__before';
      before.alt = 'Razab homepage before the redesign';
      before.width = 1600;
      before.height = 1000;

      var handle = document.createElement('div');
      handle.className = 'shot__handle';
      handle.tabIndex = 0;
      handle.setAttribute('role', 'slider');
      handle.setAttribute('aria-label', 'Before and after comparison');
      handle.setAttribute('aria-valuemin', '0');
      handle.setAttribute('aria-valuemax', '100');
      handle.innerHTML = '<span class="shot__grip" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 20 20"><path d="M7.5 5 3 10l4.5 5M12.5 5 17 10l-4.5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';

      var labelBefore = document.createElement('span');
      labelBefore.className = 'shot__label shot__label--before';
      labelBefore.textContent = 'Before';
      labelBefore.setAttribute('aria-hidden', 'true');
      var labelAfter = labelBefore.cloneNode();
      labelAfter.className = 'shot__label shot__label--after';
      labelAfter.textContent = 'After';

      shot.append(before, labelBefore, labelAfter, handle);
      shot.classList.add('is-compare');

      function set(value) {
        pos = Math.max(0, Math.min(100, value));
        shot.style.setProperty('--pos', pos + '%');
        handle.setAttribute('aria-valuenow', String(Math.round(pos)));
        handle.setAttribute('aria-valuetext', Math.round(pos) + '% showing the old design');
      }
      function fromPointer(e) {
        var rect = shot.getBoundingClientRect();
        set(((e.clientX - rect.left) / rect.width) * 100);
      }

      var dragging = false;
      shot.addEventListener('pointerdown', function (e) {
        dragging = true;
        shot.setPointerCapture(e.pointerId);
        fromPointer(e);
      });
      shot.addEventListener('pointermove', function (e) { if (dragging) fromPointer(e); });
      shot.addEventListener('pointerup', function () { dragging = false; });
      shot.addEventListener('pointercancel', function () { dragging = false; });

      handle.addEventListener('keydown', function (e) {
        var step = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5, PageDown: -20, PageUp: 20 }[e.key];
        if (e.key === 'Home') set(0);
        else if (e.key === 'End') set(100);
        else if (step) set(pos + step);
        else return;
        e.preventDefault();
      });

      set(50);
    }
  }

  /* ---------- Copy email ---------- */
  function initCopyEmail() {
    var btn = $('.copy-email');
    var status = $('#copy-status');
    if (!btn) return;
    var email = btn.getAttribute('data-email');
    var timer;

    function fallbackCopy() {
      var area = document.createElement('textarea');
      area.value = email;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(area);
      return ok;
    }

    function confirm() {
      btn.textContent = 'Copied';
      btn.classList.add('is-copied');
      if (status) status.textContent = 'Email address copied to clipboard.';
      clearTimeout(timer);
      timer = setTimeout(function () {
        btn.textContent = 'Copy email';
        btn.classList.remove('is-copied');
        if (status) status.textContent = '';
      }, 2000);
    }

    btn.addEventListener('click', function () {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(confirm, function () { if (fallbackCopy()) confirm(); });
      } else if (fallbackCopy()) {
        confirm();
      }
    });
  }

  /* ---------- Placeholder tiles for missing game screenshots ---------- */
  function initFallbacks() {
    $$('.phone__screen[data-tiles]').forEach(function (screen) {
      var holder = $('.phone__tiles', screen);
      var name = ($('.phone__name', screen) || {}).textContent || '';
      var palette = screen.getAttribute('data-tiles').split(/\s+/);
      if (!holder || holder.children.length) return;
      // A small pattern seeded from the game's name, so each one looks different but stable.
      var seed = 0;
      for (var k = 0; k < name.length; k++) seed = (seed * 31 + name.charCodeAt(k)) >>> 0;
      for (var i = 0; i < 16; i++) {
        seed = (seed * 1103515245 + 12345) >>> 0;
        var span = document.createElement('span');
        span.style.background = 'var(--' + palette[(seed >>> 16) % palette.length] + ')';
        holder.appendChild(span);
      }
    });
  }

  /* ---------- Sections rise into view as you scroll ---------- */
  function initReveal() {
    if (reduceMotion.matches || !('IntersectionObserver' in window)) return;
    var targets = $$('.section-head, .group-title, .group-intro, .case, .game, .more-games, .personal__head, .personal__item, .project, .play, .timeline__item, .polaroid, .about__text, .subhead, .tool, .edu, .certs li, .contact__inner > *');

    // Stagger siblings that share a parent (cards in a grid come in one after another).
    targets.forEach(function (el) {
      var siblings = targets.filter(function (t) { return t.parentNode === el.parentNode; });
      el.style.setProperty('--ri', String(Math.min(siblings.indexOf(el), 5)));
      el.setAttribute('data-reveal', '');
    });
    document.documentElement.classList.add('reveal-ready');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('is-in');
        observer.unobserve(el);
        // Once it has arrived, hand the element back to its normal hover transitions.
        setTimeout(function () {
          el.removeAttribute('data-reveal');
          el.classList.remove('is-in');
          el.style.removeProperty('--ri');
        }, 1400);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Card glow follows the cursor ---------- */
  function initCardGlow() {
    document.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var card = e.target.closest && e.target.closest('.card');
      if (!card) return;
      var rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    }, { passive: true });
  }

  /* ---------- Hero stats count up once ---------- */
  function initCountUp() {
    if (reduceMotion.matches) return;
    $$('.fact strong').forEach(function (el, k) {
      var match = el.textContent.match(/^(\d+(?:\.\d+)?)(.*)$/);
      if (!match) return;
      var target = parseFloat(match[1]), suffix = match[2];
      var decimals = (match[1].split('.')[1] || '').length;
      var start = null, duration = 1100, delay = 500 + k * 120;
      el.textContent = (0).toFixed(decimals) + suffix;
      function frame(now) {
        if (start === null) start = now;
        var t = Math.min(1, (now - start) / duration);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (t < 1) requestAnimationFrame(frame);
      }
      setTimeout(function () { requestAnimationFrame(frame); }, delay);
    });
  }

  safely(initTheme);
  safely(initHeader);
  safely(initClock);
  safely(initReveal);
  safely(initCardGlow);
  safely(initCountUp);
  safely(initMenu);
  safely(initActiveNav);
  safely(initBoard);
  safely(initFilters);
  safely(initCompare);
  safely(initCopyEmail);
  safely(initFallbacks);
})();
