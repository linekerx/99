/* =====================================================
   НАСТРОЙКИ — всё, что нужно поменять, лежит здесь
   ===================================================== */
const CONFIG = {
  // ссылка на личку в Telegram
  tg: "https://t.me/zxcDemon0010",
  // ссылка на канал / чат с отзывами
  reviewsChannel: "", // пусто — кнопка «все отзывы» скрыта

  // true — отзывы помечены как «пример». Поставь false, когда вставишь реальные отзывы.
  demo: true,

  // цифры репутации: впиши настоящие. Пока стоит 0 — цифра на сайте не показывается.
  stats: [
    { value: 5, suffix: "/5", label: "репутация" },
    { value: 0, suffix: "+", label: "закрытых сделок" },
    { value: 0, suffix: "+", label: "отзывов" },
    { value: 0, suffix: "", label: "лет в теме" },
    { value: 0, suffix: " мин", label: "средняя оценка" },
  ],

  // отзывы: name — ник автора, text — текст, date — дата, deal — что продал
  reviews: [
    { name: "@username", date: "дд.мм.гггг", deal: "подарок / коллекция", text: "Сюда вставь текст реального отзыва из своего канала. Короткий отзыв смотрится так." },
    { name: "@username", date: "дд.мм.гггг", deal: "подарок / коллекция", text: "А так выглядит отзыв подлиннее: продавец рассказывает, как прошла сделка, как быстро пришла оплата и почему он вернётся ещё." },
    { name: "@username", date: "дд.мм.гггг", deal: "опт", text: "Место для отзыва об оптовой сделке. Замени этот текст на настоящий." },
    { name: "@username", date: "дд.мм.гггг", deal: "подарок / коллекция", text: "Пример карточки. Реальный отзыв — реальный ник, чтобы любой мог написать автору и проверить." },
    { name: "@username", date: "дд.мм.гггг", deal: "через гаранта", text: "Место для отзыва о сделке через гаранта. Замени этот текст на настоящий." },
    { name: "@username", date: "дд.мм.гггг", deal: "подарок / коллекция", text: "Ещё один пример. Чем больше реальных отзывов в списке — тем плотнее лента." },
  ],
};

/* ===================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
const root = document.documentElement;
const LITE = () => root.classList.contains("lite");
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ссылки */
$$("[data-tg]").forEach((a) => { a.href = CONFIG.tg; a.target = "_blank"; a.rel = "noopener"; });
if (CONFIG.reviewsChannel) $$("[data-reviews]").forEach((a) => { a.href = CONFIG.reviewsChannel; a.target = "_blank"; a.rel = "noopener"; });
else $$("[data-reviews-wrap]").forEach((e) => e.remove());
$$("[data-handle]").forEach((e) => (e.textContent = "@" + CONFIG.tg.split("/").pop()));
if (!CONFIG.demo) $$("[data-demo]").forEach((e) => e.remove());

/* статистика: показываются только заполненные цифры */
(function stats() {
  const el = $("#stats"), list = CONFIG.stats.filter((s) => Number(s.value) > 0);
  if (!list.length) return el.remove();
  if (list.length < 4) el.style.gridTemplateColumns = `repeat(${list.length},1fr)`;
  el.innerHTML = list.map((s, i) =>
    `<div class="stat" data-reveal style="--d:${i * 0.08}s"><div class="stat-v"><span data-count="${Number(s.value)}">0</span><small>${esc((s.suffix || "").trim())}</small></div><div class="stat-l">${esc(s.label)}</div></div>`
  ).join("");
})();

/* отзывы */
(function reviews() {
  const card = (r) => `
    <article class="rv" data-hover>
      <div class="rv-top">
        <div class="rv-av">${esc((r.name || "?").replace("@", "").charAt(0).toUpperCase())}</div>
        <div><div class="rv-name">${esc(r.name)}</div><div class="rv-date">${esc(r.date || "")}</div></div>
        <div class="rv-stars" aria-hidden="true">★★★★★</div>
      </div>
      <p class="rv-text">${esc(r.text)}</p>
      <div class="rv-foot"><span>${esc(r.deal || "")}</span><span>${CONFIG.demo ? "пример" : "проверено"}</span></div>
    </article>`;
  const list = CONFIG.reviews;
  if (!list.length) { $("#reviews .rv-wrap").remove(); return; }
  const half = Math.ceil(list.length / 2);
  const fill = (el, items) => {
    if (!items.length) items = list;
    // один набор читается скринридером, остальные копии — только для бесшовной прокрутки
    const base = items.map(card).join("");
    const copy = base.replace(/<article class="rv"/g, '<article class="rv" aria-hidden="true"');
    const rep = Math.max(1, Math.ceil(6 / items.length));
    el.innerHTML = base + copy.repeat(rep * 2 - 1);
    el.style.animationDuration = items.length * rep * 9 + "s";
  };
  fill($("#rvRow1"), list.slice(0, half));
  fill($("#rvRow2"), list.slice(half));
})();

/* разбивка заголовков на слова */
$$("[data-split]").forEach((el) => {
  const words = el.textContent.trim().split(/\s+/);
  el.setAttribute("aria-label", el.textContent.trim());
  el.innerHTML = words.map((w, i) =>
    `<span class="w" aria-hidden="true"><span class="wi" style="transition-delay:${Math.min(i * 0.045, 0.9)}s">${esc(w)}</span></span>`
  ).join(" ");
});

/* задержки для карточек в сетках */
$$(".about-grid,.steps,.rules,.buy-list,.faq-list").forEach((g) =>
  [...g.children].forEach((c, i) => c.style.setProperty("--d", i * 0.08 + "s"))
);

/* скрамбл текста */
function scramble(el) {
  const final = el.dataset.text || (el.dataset.text = el.textContent);
  const chars = "!<>-_\\/[]{}—=+*^?#01";
  let frame = 0;
  const total = 28;
  (function tick() {
    let out = "";
    for (let i = 0; i < final.length; i++) {
      const reveal = (i / final.length) * total * 0.7;
      out += frame > reveal + 6 || final[i] === " " ? final[i] : chars[(Math.random() * chars.length) | 0];
    }
    el.textContent = out;
    if (frame++ < total + 6) requestAnimationFrame(tick); else el.textContent = final;
  })();
}

/* счётчики */
function count(el) {
  const to = +el.dataset.count, t0 = performance.now(), dur = 1800;
  (function tick(t) {
    const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.round(to * e).toLocaleString("ru-RU");
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}

/* появление при скролле */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    $$("[data-count]", e.target).forEach(count);
    if (e.target.hasAttribute("data-scramble") && !reduced) scramble(e.target);
    io.unobserve(e.target);
  });
}, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });

function startObservers() {
  $$("[data-reveal],[data-split],[data-scramble]").forEach((el) => io.observe(el));
}

/* прелоадер 00 → 99 */
(function preloader() {
  const pre = $("#preloader"), num = $("#preNum"), bar = $("#preBar");
  const finish = () => {
    pre.classList.add("done");
    document.body.classList.remove("loading");
    startObservers();
    setTimeout(() => { pre.remove(); watchFps(); }, 1000);
  };
  if (reduced) return finish();
  const t0 = performance.now(), dur = 1700;
  (function tick(t) {
    const p = Math.min(1, (t - t0) / dur), e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    num.textContent = String(Math.round(99 * e)).padStart(2, "0");
    bar.style.transform = `scaleX(${e})`;
    if (p < 1) requestAnimationFrame(tick); else setTimeout(finish, 280);
  })(t0);
})();

/* курсор */
const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
addEventListener("pointermove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
if (fine) {
  const cur = $("#cur"), ring = $("#curRing");
  let rx = mouse.x, ry = mouse.y, moving = false;
  const loop = () => {
    rx += (mouse.x - rx) * 0.3; ry += (mouse.y - ry) * 0.3;
    cur.style.transform = `translate3d(${mouse.x}px,${mouse.y}px,0)`;
    ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
    if (Math.abs(mouse.x - rx) + Math.abs(mouse.y - ry) > 0.2) requestAnimationFrame(loop); else moving = false;
  };
  addEventListener("pointermove", () => { root.classList.add("moved"); if (!moving) { moving = true; requestAnimationFrame(loop); } }, { passive: true });
  document.addEventListener("mouseover", (e) => {
    const on = !!e.target.closest("[data-hover]");
    ring.classList.toggle("on", on); cur.classList.toggle("on", on);
  });
  addEventListener("pointerdown", () => ring.classList.add("down"));
  addEventListener("pointerup", () => ring.classList.remove("down"));
  document.addEventListener("mouseleave", () => root.classList.remove("moved"));
}

/* магнитные кнопки */
if (fine && !reduced) {
  $$(".magnetic").forEach((b) => {
    b.addEventListener("mousemove", (e) => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.28}px,${(e.clientY - r.top - r.height / 2) * 0.4}px)`;
    });
    b.addEventListener("mouseleave", () => {
      b.style.transition = "transform .6s cubic-bezier(.2,.8,.2,1), color .45s";
      b.style.transform = "";
      setTimeout(() => (b.style.transition = ""), 600);
    });
  });

  /* 3D-наклон карточек */
  $$(".tilt").forEach((c) => {
    c.addEventListener("mousemove", (e) => {
      const r = c.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      c.style.transition = "border-color .4s, background .4s";
      c.style.transform = `perspective(900px) rotateX(${-py * 10}deg) rotateY(${px * 12}deg) translateZ(8px)`;
    });
    c.addEventListener("mouseleave", () => { c.style.transition = ""; c.style.transform = ""; });
  });
}

/* FAQ */
$$(".faq-item button").forEach((b) =>
  b.addEventListener("click", () => {
    const item = b.parentElement, open = item.classList.contains("open");
    $$(".faq-item.open").forEach((i) => { i.classList.remove("open"); $("button", i).setAttribute("aria-expanded", "false"); });
    if (!open) { item.classList.add("open"); b.setAttribute("aria-expanded", "true"); }
  })
);

/* скролл: прогресс, навигация, параллакс */
(function scrollFx() {
  const bar = $("#progress"), nav = $("#nav"), num = $("#heroNum"), gift = $("#gift"), ticker = $(".ticker-track");
  let last = 0, ticking = false;
  const update = () => {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    nav.classList.toggle("hide", y > last && y > 300);
    last = y;
    if (!reduced && y < innerHeight) {
      const mx = (mouse.x / innerWidth - 0.5), my = (mouse.y / innerHeight - 0.5);
      num.style.transform = `translate(calc(-50% + ${mx * -30}px), calc(-50% + ${y * 0.28 + my * -20}px)) scale(${1 + y * 0.0004})`;
      gift.style.transform = `translate(${mx * 46}px, ${y * -0.18 + my * 36}px)`;
    }
    ticking = false;
  };
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener("scroll", req, { passive: true });
  if (fine) addEventListener("pointermove", () => { if (scrollY < innerHeight) req(); }, { passive: true });
  update();
})();

/* канвас: частицы с линиями */
(function particles() {
  const c = $("#fx");
  if (reduced || !c) return;
  const ctx = c.getContext("2d");
  let w = 0, h = 0, dpr, pts = [], visible = true, skip = false;
  const resize = (force) => {
    const nw = c.clientWidth, nh = c.clientHeight;
    // на телефоне высота прыгает из-за адресной строки — не пересоздаём сцену по мелочам
    if (force !== true && nw === w && Math.abs(nh - h) < 160) return;
    const lite = LITE();
    dpr = lite ? 1 : Math.min(devicePixelRatio || 1, 2);
    w = nw; h = nh;
    c.width = w * dpr; c.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(lite ? 34 : 110, (w * h) / (lite ? 24000 : 14000)));
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.4 + 0.4,
    }));
  };
  resize(true);
  let rt;
  addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(resize, 200); });
  addEventListener("lite", () => resize(true));
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) loop(); }).observe(c);
  let running = false;
  function loop() {
    if (running) return;
    running = true;
    (function frame() {
      if (!visible || document.hidden) { running = false; return; }
      if (LITE() && (skip = !skip)) return requestAnimationFrame(frame); // 30 кадров/с в облегчённом режиме
      ctx.clearRect(0, 0, w, h);
      const rect = c.getBoundingClientRect();
      const mx = mouse.x - rect.left, my = mouse.y - rect.top;
      for (const p of pts) {
        const dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
        if (fine && d2 < 22500) { const f = (1 - d2 / 22500) * 0.6; p.x += (dx / Math.sqrt(d2 || 1)) * f * 3; p.y += (dy / Math.sqrt(d2 || 1)) * f * 3; }
        const k = LITE() ? 2 : 1; p.x += p.vx * k; p.y += p.vy * k;
        if (p.x < 0) p.x = w; else if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; else if (p.y > h) p.y = 0;
        ctx.fillStyle = "rgba(255,255,255,.75)";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
          if (d2 < 13000) {
            ctx.strokeStyle = `rgba(255,255,255,${(1 - d2 / 13000) * 0.22})`;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      requestAnimationFrame(frame);
    })();
  }
  document.addEventListener("visibilitychange", () => { if (!document.hidden && visible) loop(); });
  loop();
})();

/* пауза бесконечных анимаций, когда блок не на экране */
(function offscreen() {
  const o = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle("off", !e.isIntersecting)), { rootMargin: "100px" });
  $$(".hero-grid,.gift,.ticker,.rv-wrap,.cta-marquee,.scroll-hint,.hero-top").forEach((el) => o.observe(el));
})();

/* замер FPS: если компьютер не тянет — включаем облегчённый режим */
function watchFps() {
  if (LITE() || reduced || document.hidden) return;
  let frames = 0;
  const t0 = performance.now();
  requestAnimationFrame(function tick(t) {
    frames++;
    if (t - t0 < 2500) return requestAnimationFrame(tick);
    if (!document.hidden && frames / ((t - t0) / 1000) < 42) {
      root.classList.add("lite");
      dispatchEvent(new Event("lite"));
    }
  });
}

/* часы в футере */
(function clock() {
  const el = $("#clock");
  const tick = () => (el.textContent = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) + " — на связи");
  tick(); setInterval(tick, 1000);
})();
