/* PAGE LOADER */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('pageLoader')?.classList.add('done'), 4500);
});

/* SCROLL PROGRESS */
const $bar = document.getElementById('scrollBar');
window.addEventListener('scroll', () => {
  if ($bar) $bar.style.width = (window.scrollY / (document.documentElement.scrollHeight - innerHeight) * 100) + '%';
}, { passive: true });

/* HEADER */
const $hdr = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  $hdr?.classList.toggle('on', window.scrollY > 50);
}, { passive: true });

/* DRAWER */
const $ham   = document.getElementById('ham');
const $drw   = document.getElementById('drawer');
const $drwX  = document.getElementById('drawerX');
const $drwBg = document.getElementById('drawerBg');
const openD  = () => { $drw?.classList.add('open'); $drwBg?.classList.add('on'); $ham?.classList.add('open'); document.body.style.overflow = 'hidden'; };
const closeD = () => { $drw?.classList.remove('open'); $drwBg?.classList.remove('on'); $ham?.classList.remove('open'); document.body.style.overflow = ''; };
$ham?.addEventListener('click', openD);
$drwX?.addEventListener('click', closeD);
$drwBg?.addEventListener('click', closeD);
$drw?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeD));

/* CURSOR DOT */
const $cur = document.getElementById('cursorDot');
if ($cur && window.matchMedia('(pointer:fine)').matches) {
  let cx = 0, cy = 0, tx = 0, ty = 0;
  window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
  const moveCursor = () => {
    cx += (tx - cx) * 0.14;
    cy += (ty - cy) * 0.14;
    $cur.style.left = cx + 'px';
    $cur.style.top  = cy + 'px';
    requestAnimationFrame(moveCursor);
  };
  moveCursor();

  document.querySelectorAll('a, button, .cert-card, .wt-row, .svc-item, .photo-wrap').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-grow'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-grow'));
  });
}

/* SCROLL REVEAL */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el   = entry.target;
    const sibs = [...(el.parentElement?.children || [])].filter(c =>
      c.classList.contains('reveal') || c.classList.contains('h-line') || c.classList.contains('reveal-right'));
    el.style.transitionDelay = Math.min(sibs.indexOf(el) * 80, 320) + 'ms';
    el.classList.add('in');
    revObs.unobserve(el);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal, .h-line, .reveal-right').forEach(el => revObs.observe(el));

/* SCRAMBLE on sec-tag */
function scramble(el, original, ms = 500) {
  const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const STEPS = 12;
  let step = 0;
  const iv = setInterval(() => {
    const pct = step / STEPS;
    el.textContent = original.split('').map((ch, i) => {
      if (ch === ' ' || ch === '—') return ch;
      return i < Math.floor(pct * original.length) ? ch : pool[Math.floor(Math.random() * pool.length)];
    }).join('');
    if (++step > STEPS) { el.textContent = original; clearInterval(iv); }
  }, ms / STEPS);
}
const scrObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    scramble(e.target, e.target.textContent.trim());
    scrObs.unobserve(e.target);
  });
}, { threshold: 0.6 });
document.querySelectorAll('.sec-tag').forEach(el => scrObs.observe(el));

/* STAT COUNTERS */
const cntObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, to = +el.dataset.target;
    if (isNaN(to)) return;
    const t0 = performance.now(), dur = 1800;
    const tick = now => {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * to);
      if (p < 1) requestAnimationFrame(tick); else el.textContent = to;
    };
    requestAnimationFrame(tick);
    cntObs.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll('.bs-num[data-target]').forEach(el => cntObs.observe(el));

/* TYPING EFFECT */
const $role = document.getElementById('roleText');
if ($role) {
  const ROLES = ['Cybersecurity Student', 'Penetration Tester', 'Python Developer', 'Ethical Hacker'];
  let ri = 0, ci = 0, del = false;
  const typeNext = () => {
    const word = ROLES[ri];
    if (!del) {
      $role.textContent = word.slice(0, ++ci);
      if (ci === word.length) { setTimeout(() => { del = true; }, 1900); setTimeout(typeNext, 2000); return; }
      setTimeout(typeNext, 75);
    } else {
      $role.textContent = word.slice(0, --ci);
      if (ci === 0) { del = false; ri = (ri + 1) % ROLES.length; }
      setTimeout(typeNext, del ? 40 : 75);
    }
  };
  setTimeout(typeNext, 1400);
}

/* WORKS FILTER */
const $worksCount = document.getElementById('worksCount');
document.querySelectorAll('.f-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.f;
    let visible = 0;
    document.querySelectorAll('.wt-row').forEach(row => {
      const show = f === 'all' || row.dataset.cat === f;
      row.style.transition = 'opacity .3s, transform .3s';
      if (show) {
        visible++;
        row.style.opacity = ''; row.style.transform = ''; row.style.pointerEvents = ''; row.style.display = '';
      } else {
        row.style.opacity = '0'; row.style.transform = 'translateY(8px)'; row.style.pointerEvents = 'none';
        setTimeout(() => { if (row.style.opacity === '0') row.style.display = 'none'; }, 330);
      }
    });
    if ($worksCount) {
      setTimeout(() => {
        $worksCount.innerHTML = `Showing <strong>${visible}</strong> project${visible !== 1 ? 's' : ''}`;
      }, 350);
    }
  });
});

/* MAGNETIC BUTTONS */
document.querySelectorAll('.magnet').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r  = el.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width  / 2) * 0.3;
    const dy = (e.clientY - r.top  - r.height / 2) * 0.3;
    el.style.transform = `translate(${dx}px,${dy}px)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});

/* CARD TILT */
document.querySelectorAll('.bento-card, .cert-card, .time-card, .stat-cell').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - .5;
    const y = (e.clientY - r.top)  / r.height - .5;
    card.style.transform = `perspective(900px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg) translateY(-2px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* COPY EMAIL */
function showToast(msg, icon = 'fa-check') {
  const $t = document.getElementById('globalToast');
  if (!$t) return;
  $t.innerHTML = `<i class="fa-solid ${icon}"></i> ${msg}`;
  $t.classList.add('show');
  clearTimeout($t._t);
  $t._t = setTimeout(() => $t.classList.remove('show'), 2800);
}
document.getElementById('copyEmailBtn')?.addEventListener('click', function () {
  const email = this.dataset.email;
  navigator.clipboard.writeText(email)
    .then(() => showToast(`${email} copied!`, 'fa-copy'))
    .catch(() => { showToast('Copied!', 'fa-copy'); });
});

/* LIGHTBOX */
const $lb  = document.getElementById('lightbox');
const $lbI = document.getElementById('lbImg');
const $lbC = document.getElementById('lbCap');
const $lbX = document.getElementById('lbX');
document.querySelectorAll('.cert-card').forEach(c => {
  c.addEventListener('click', () => {
    $lbI.src = c.querySelector('img').src;
    $lbC.textContent = c.dataset.title || '';
    $lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});
const closeLB = () => { $lb?.classList.remove('open'); document.body.style.overflow = ''; setTimeout(() => { if ($lbI) $lbI.src = ''; }, 350); };
$lbX?.addEventListener('click', closeLB);
$lb?.addEventListener('click', e => { if (e.target === $lb) closeLB(); });

/* ESC KEY */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeD(); closeLB(); }
  if (e.key === 'g' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Back to top ↑', 'fa-arrow-up');
  }
});

/* CLOCK WIB */
const $clk = document.getElementById('localTime');
const pad  = n => String(n).padStart(2, '0');
const tickClock = () => {
  if (!$clk) return;
  const w = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
  $clk.textContent = `${pad(w.getHours())}:${pad(w.getMinutes())}:${pad(w.getSeconds())}`;
};
tickClock(); setInterval(tickClock, 1000);

/* BACK TO TOP */
const $top = document.getElementById('topBtn');
window.addEventListener('scroll', () => $top?.classList.toggle('show', window.scrollY > 500), { passive: true });
$top?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* DOT NAV */
const $dots     = document.querySelectorAll('.dot-nav .dot');
const $dotLabel = document.getElementById('dotNavLabel');
const SEC_NAMES = { about:'About', expertise:'Skills', background:'Background', work:'Works', certificates:'Certs', contact:'Contact' };
$dots.forEach(dot => {
  dot.addEventListener('click', () => {
    const sec = document.getElementById(dot.dataset.section);
    sec?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
document.querySelectorAll('section[id]').forEach(sec => {
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const id = e.target.id;
      $dots.forEach(d => d.classList.toggle('on', d.dataset.section === id));
      document.querySelectorAll('.nav-center a').forEach(a => a.classList.toggle('on', a.dataset.sec === id));
      if ($dotLabel) {
        $dotLabel.textContent = SEC_NAMES[id] || '';
        $dotLabel.classList.toggle('show', !!SEC_NAMES[id]);
      }
    });
  }, { threshold: 0.4 }).observe(sec);
});

/* HERO PARALLAX */
const $heroPhoto = document.getElementById('heroPhoto');
if ($heroPhoto) {
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      $heroPhoto.style.transform = `translateY(${window.scrollY * 0.07}px)`;
    }
  }, { passive: true });
}

/* SMOOTH ANCHOR SCROLL */
document.querySelectorAll('a[href^="/#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id  = a.getAttribute('href').split('#')[1];
    const sec = document.getElementById(id);
    if (!sec) return;
    e.preventDefault(); closeD();
    sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* GSAP ENTRANCE */
if (typeof gsap !== 'undefined') {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.logo',          { y: -22, opacity: 0, duration: .7 })
    .from('.nav-center a',  { y: -14, opacity: 0, duration: .5, stagger: .07 }, '-=.5')
    .from('.nav-end',       { y: -14, opacity: 0, duration: .5 }, '-=.4')
    .from('.dot-nav',       { x:  14, opacity: 0, duration: .6 }, '-=.3')
    .from('.side-socials',  { x: -14, opacity: 0, duration: .6 }, '-=.6');
}

/* WORKS ROW HOVER SOUND */
document.querySelectorAll('.wt-row').forEach((row, i) => {
  row.addEventListener('mouseenter', () => {
    row.style.zIndex = '2';
  });
  row.addEventListener('mouseleave', () => {
    row.style.zIndex = '';
  });
});
