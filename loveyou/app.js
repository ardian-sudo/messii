(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var params = new URLSearchParams(location.search);
  var editMode = params.get("edit") === "1";

  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function lsDel(k) { try { localStorage.removeItem(k); } catch (e) {} }

  /* ---------- Konfigurasi: config.js, lalu isian dari link, lalu isian lokal (mode edit) ---------- */
  var PRESETS = window.LOVEYOU_PRESETS || {};
  var DEFAULT_PRESET = PRESETS.manis ? "manis" : Object.keys(PRESETS)[0];
  var BASE = window.LOVEYOU_CONFIG || {};
  var FIELDS = ["preset", "name", "from", "startDate", "letter", "reasons", "memories", "coupons", "photos", "question", "finalMessage"];
  var SHARED = ["preset", "name", "from", "startDate", "letter", "reasons", "memories", "coupons", "question", "finalMessage"];

  function encode(str) {
    var bytes = new TextEncoder().encode(str), bin = "";
    bytes.forEach(function (b) { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function decode(s) {
    s = s.replace(/-/g, "+").replace(/_/g, "/");
    while (s.length % 4) s += "=";
    var bin = atob(s), bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }
  function copyOf(o) { return JSON.parse(JSON.stringify(o)); }
  function overlay(target, src) {
    if (!src || typeof src !== "object") return;
    FIELDS.forEach(function (k) {
      var v = src[k];
      if (v === undefined || v === null || v === "") return;
      if (Array.isArray(v) && !v.length) return;
      target[k] = v;
    });
  }

  var cfg = copyOf(BASE);
  var fromLink = null;
  try { if (params.get("d")) fromLink = JSON.parse(decode(params.get("d"))); } catch (e) { fromLink = null; }
  if (editMode) { try { overlay(cfg, JSON.parse(lsGet("loveyou-cfg") || "null")); } catch (e) {} }
  overlay(cfg, fromLink);

  /* E = isi yang benar-benar dipakai: tulisanmu menimpa preset, sisanya dari preset */
  var E = {};
  function pick(v, fallback) {
    if (Array.isArray(fallback)) return Array.isArray(v) && v.length ? v : fallback;
    return typeof v === "string" && v ? v : fallback;
  }
  function presetOf(key) { return PRESETS[key] || PRESETS[DEFAULT_PRESET] || {}; }
  function normalize() {
    var key = PRESETS[cfg.preset] ? cfg.preset : DEFAULT_PRESET;
    var P = presetOf(key);
    E.preset = key;
    E.titles = P.titles || {};
    E.name = pick(cfg.name, "Sayang");
    E.from = pick(cfg.from, "");
    E.startDate = pick(cfg.startDate, "2025-02-14");
    E.letter = pick(cfg.letter, P.letter || "Halo {nama},\n\nAku sayang kamu.");
    E.reasons = pick(cfg.reasons, P.reasons || ["Karena itu kamu."]);
    E.memories = pick(cfg.memories, P.memories || []);
    E.coupons = pick(cfg.coupons, P.coupons || []);
    E.photos = pick(cfg.photos, []);
    E.question = pick(cfg.question, P.question || "Mau sama aku terus?");
    E.finalMessage = pick(cfg.finalMessage, P.finalMessage || "Terima kasih. Aku sayang kamu.");
  }
  function applyPalette(key) {
    var root = document.documentElement;
    if (key === "manis" || !key) root.removeAttribute("data-palette");
    else root.setAttribute("data-palette", key);
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute("content", getComputedStyle(root).getPropertyValue("--accent").trim() || "#d1215f");
  }
  normalize();

  /* ---------- Animasi: tema halus, muncul saat di-scroll ---------- */
  var themeTimer = null;
  function themed(fn) {
    var root = document.documentElement;
    if (reduce) { fn(); return; }
    root.classList.add("theming");
    fn();
    clearTimeout(themeTimer);
    themeTimer = setTimeout(function () { root.classList.remove("theming"); }, 650);
  }
  var useReveal = document.documentElement.classList.contains("js");
  var io = null, countedUp = false, counting = false;
  if (useReveal) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        io.unobserve(en.target);
        if (en.target.classList.contains("counter")) countUp();
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  }
  function reveal(el, i) {
    if (!io) return;
    el.classList.add("rv");
    el.style.setProperty("--i", String(i || 0));
    io.observe(el);
  }
  Array.prototype.forEach.call(document.querySelectorAll(".sec-head, .counter, .reason-card, .ask, footer"), function (el) { reveal(el, 0); });

  $("themeBtn").addEventListener("click", function () {
    var root = document.documentElement;
    var cur = root.getAttribute("data-theme");
    var sysDark = window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches;
    var isDark = cur ? cur === "dark" : sysDark;
    themed(function () { root.setAttribute("data-theme", isDark ? "light" : "dark"); });
  });

  /* ---------- Hati melayang di latar ---------- */
  (function drift() {
    if (reduce) return;
    var box = $("drift"), n = window.innerWidth < 600 ? 7 : 12;
    for (var i = 0; i < n; i++) {
      var s = document.createElement("span");
      s.textContent = "♥";
      s.style.left = (Math.random() * 100) + "%";
      s.style.fontSize = (12 + Math.random() * 22) + "px";
      s.style.animationDuration = (14 + Math.random() * 16) + "s";
      s.style.animationDelay = (-Math.random() * 24) + "s";
      s.style.setProperty("--sway", (Math.random() * 80 - 40) + "px");
      s.style.setProperty("--spin", (Math.random() * 90 - 45) + "deg");
      box.appendChild(s);
    }
  })();

  /* ---------- Efek hati dan bunga ---------- */
  var cv = $("fx"), ctx = cv.getContext("2d"), parts = [], raf = null, last = 0, dpr = Math.min(2, window.devicePixelRatio || 1);
  function size() { cv.width = window.innerWidth * dpr; cv.height = window.innerHeight * dpr; }
  size(); window.addEventListener("resize", size);
  function start() { if (!raf) { last = 0; raf = requestAnimationFrame(loop); } }

  function burst(x, y, n) {
    if (reduce) return;
    var st = getComputedStyle(document.documentElement);
    var cols = [st.getPropertyValue("--accent").trim(), st.getPropertyValue("--glow").trim(), "#ffc2d4"];
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2, sp = 2 + Math.random() * 6;
      parts.push({ kind: "heart", x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 4, g: 0.16 + Math.random() * 0.1, s: 12 + Math.random() * 20, life: 1, d: 0.008 + Math.random() * 0.01, c: cols[i % cols.length], r: (Math.random() - 0.5) * 0.5 });
    }
    start();
  }

  /* Bunga meledak: mekar dengan pegas, melambat seperti terkena angin, lalu memudar */
  var BLOOM = {
    manis: { petals: ["#ff7aa2", "#ff9db8", "#ffc2d4", "#e8396f", "#fff0f3"], inner: "#fff4f7", core: "#ffd27a" },
    lucu:  { petals: ["#ff8466", "#ffb199", "#ffd0c0", "#ff5b3a", "#ffe9a8"], inner: "#fff6ee", core: "#ffd24a" },
    tulus: { petals: ["#c9a0d4", "#d58bd6", "#b57bc4", "#eadbea", "#f4e8f6"], inner: "#fbf3fc", core: "#ffd9a0" }
  };
  function bloom(x, y, n) {
    if (reduce) return;
    var pal = BLOOM[E.preset] || BLOOM.manis;
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2;
      var sp = 6 + Math.random() * 13;
      var flower = Math.random() < 0.6;
      parts.push({
        kind: "bloom", flower: flower,
        x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 3.5,
        size: flower ? 20 + Math.random() * 28 : 10 + Math.random() * 12,
        color: pal.petals[Math.floor(Math.random() * pal.petals.length)], inner: pal.inner, core: pal.core,
        rot: Math.random() * Math.PI * 2, spin: (Math.random() - 0.5) * 0.06,
        phase: Math.random() * 6.28, sway: 0.4 + Math.random() * 0.8,
        age: 0, life: 1, decay: 1 / (170 + Math.random() * 110)
      });
    }
    start();
  }
  function easeOutBack(k) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); }
  function petalPath(rx, ry, cy) { ctx.beginPath(); ctx.ellipse(0, cy, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); }
  function drawBloom(p) {
    var sz = p.size;
    ctx.fillStyle = p.color;
    if (!p.flower) { petalPath(sz * 0.22, sz * 0.42, 0); return; }
    var i;
    for (i = 0; i < 5; i++) { ctx.save(); ctx.rotate(i * Math.PI * 2 / 5); petalPath(sz * 0.2, sz * 0.32, -sz * 0.3); ctx.restore(); }
    ctx.fillStyle = p.inner; ctx.globalAlpha *= 0.85;
    for (i = 0; i < 5; i++) { ctx.save(); ctx.rotate(Math.PI / 5 + i * Math.PI * 2 / 5); petalPath(sz * 0.13, sz * 0.2, -sz * 0.19); ctx.restore(); }
    ctx.globalAlpha /= 0.85;
    ctx.fillStyle = p.core; ctx.beginPath(); ctx.arc(0, 0, sz * 0.1, 0, Math.PI * 2); ctx.fill();
  }

  function loop(now) {
    var f = last ? Math.min(2.5, Math.max(0.5, (now - last) / 16.667)) : 1;
    last = now;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.scale(dpr, dpr);
    parts = parts.filter(function (p) { return p.life > 0 && p.y < window.innerHeight + 80; });
    parts.forEach(function (p) {
      if (p.kind === "bloom") {
        p.age += f;
        var drag = Math.pow(0.945, f);
        p.vx *= drag; p.vy = p.vy * drag + 0.05 * f;
        p.x += p.vx * f + Math.sin(p.age * 0.045 + p.phase) * p.sway * f;
        p.y += p.vy * f;
        p.rot += p.spin * f;
        p.life -= p.decay * f;
        var k = Math.min(1, p.age / 20);
        var sc = k < 1 ? easeOutBack(k) : 1;
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 0.35, k * 3));
        ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(sc, sc);
        drawBloom(p);
        ctx.restore();
        return;
      }
      p.x += p.vx * f; p.y += p.vy * f; p.vy += p.g * f; p.vx *= Math.pow(0.99, f); p.life -= p.d * f;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.translate(p.x, p.y); ctx.rotate(p.r * (1 - p.life) * 6);
      ctx.fillStyle = p.c;
      ctx.font = p.s + "px sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("\u2665", 0, 0);
      ctx.restore();
    });
    if (parts.length) raf = requestAnimationFrame(loop);
    else { raf = null; last = 0; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); }
  }

  /* ---------- Amplop dan surat ---------- */
  var env = $("env"), letter = $("letter"), letterText = $("letterText"), typer = null;
  function typeLetter() {
    var full = E.letter.replace(/\{nama\}/gi, E.name);
    clearTimeout(typer);
    if (reduce) { letterText.textContent = full; letterText.classList.remove("typing"); return; }
    var i = 0;
    letterText.textContent = "";
    letterText.classList.add("typing");
    (function step() {
      i += 1;
      letterText.textContent = full.slice(0, i);
      if (i >= full.length) { letterText.classList.remove("typing"); return; }
      var ch = full.charAt(i - 1);
      var wait = 22 + Math.random() * 26;
      if (ch === "." || ch === "!" || ch === "?") wait += 280;
      else if (ch === ",") wait += 130;
      else if (ch === "\n") wait += 200;
      typer = setTimeout(step, wait);
    })();
  }
  env.addEventListener("click", function () {
    if (env.classList.contains("open")) return;
    env.classList.add("open");
    env.setAttribute("aria-label", "Amplop sudah terbuka");
    $("hint").textContent = "Surat untukmu";
    var er = env.getBoundingClientRect();
    var ex = er.left + er.width / 2, ey = er.top + er.height * 0.3;
    setTimeout(function () { bloom(ex, ey, 34); }, reduce ? 0 : 320);
    setTimeout(function () { bloom(ex, ey, 22); }, reduce ? 0 : 640);
    setTimeout(function () {
      letter.hidden = false;
      letter.classList.add("unfold");
      typeLetter();
      letter.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    }, reduce ? 0 : 700);
  });

  /* ---------- Hitung hari ---------- */
  function pad(n) { return n < 10 ? "0" + n : String(n); }
  function setNum(el, v) {
    if (el.textContent === v) return;
    el.textContent = v;
    if (reduce) return;
    el.classList.remove("flip"); void el.offsetWidth; el.classList.add("flip");
  }
  var targetDays = 0;
  function countUp() {
    if (countedUp) return;
    countedUp = true;
    if (reduce || targetDays < 2) return;
    counting = true;
    var t0 = performance.now(), dur = 1700;
    (function frame(now) {
      var k = Math.min(1, (now - t0) / dur);
      var eased = 1 - Math.pow(1 - k, 4);
      $("cDays").textContent = Math.round(targetDays * eased).toLocaleString("id-ID");
      if (k < 1) requestAnimationFrame(frame);
      else { counting = false; $("cDays").textContent = targetDays.toLocaleString("id-ID"); }
    })(t0);
  }
  function tick() {
    var p = E.startDate.split("-");
    var start = new Date(+p[0], (+p[1] || 1) - 1, +p[2] || 1, 0, 0, 0);
    if (isNaN(start.getTime())) start = new Date();
    var diff = Date.now() - start.getTime();
    var future = diff < 0;
    var ms = Math.abs(diff);
    targetDays = Math.floor(ms / 86400000);
    if (!counting) {
      if (useReveal && !countedUp) $("cDays").textContent = "0";
      else $("cDays").textContent = targetDays.toLocaleString("id-ID");
    }
    setNum($("cH"), pad(Math.floor(ms / 3600000) % 24));
    setNum($("cM"), pad(Math.floor(ms / 60000) % 60));
    setNum($("cS"), pad(Math.floor(ms / 1000) % 60));
    $("cCaption").textContent = future
      ? "hari lagi menuju hari spesial kita"
      : "hari bersama sejak " + start.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  }
  setInterval(tick, 1000);

  /* ---------- Alasan ---------- */
  var ri = 0;
  var reasonTimer = null;
  function showReason() {
    if (ri >= E.reasons.length) ri = 0;
    $("reasonP").textContent = E.reasons[ri];
    $("reasonN").textContent = "Alasan ke-" + (ri + 1) + " dari " + E.reasons.length;
  }
  function nextReason() {
    var next = (ri + 1) % E.reasons.length;
    if (reduce) { ri = next; showReason(); return; }
    var els = [$("reasonN"), $("reasonP")], card = $("reasonCard");
    clearTimeout(reasonTimer);
    els.forEach(function (el) { el.classList.add("out"); });
    if (card.animate) card.animate([{ scale: 1 }, { scale: 1.025 }, { scale: 1 }], { duration: 520, easing: "cubic-bezier(.34,1.56,.64,1)" });
    reasonTimer = setTimeout(function () {
      ri = next;
      showReason();
      els.forEach(function (el) { el.classList.add("pre"); el.classList.remove("out"); });
      void card.offsetWidth;
      els.forEach(function (el) { el.classList.remove("pre"); });
    }, 280);
  }
  $("reasonBtn").addEventListener("click", function (e) {
    nextReason();
    var r = e.currentTarget.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top, 6);
  });

  /* ---------- Kupon ---------- */
  var used = {};
  try { used = JSON.parse(lsGet("loveyou-coupons") || "{}"); } catch (e) { used = {}; }
  function renderCoupons() {
    var wrap = $("coupons");
    wrap.textContent = "";
    E.coupons.forEach(function (c, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "coupon";
      var t = document.createElement("span"); t.className = "c-title"; t.textContent = c.title || "";
      var d = document.createElement("span"); d.className = "c-desc"; d.textContent = c.desc || "";
      var s = document.createElement("span"); s.className = "c-state";
      b.appendChild(t); b.appendChild(d); b.appendChild(s);
      function paint() {
        var u = !!used[i];
        b.classList.toggle("used", u);
        s.textContent = u ? "Sudah dipakai" : "Ketuk untuk memakai";
        b.setAttribute("aria-pressed", String(u));
      }
      paint();
      b.addEventListener("click", function () {
        used[i] = !used[i];
        lsSet("loveyou-coupons", JSON.stringify(used));
        paint();
        if (used[i]) { var r = b.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, 10); }
      });
      reveal(b, i % 3);
      wrap.appendChild(b);
    });
    wrap.parentNode.hidden = !E.coupons.length;
  }

  /* ---------- Kenangan ---------- */
  function renderMemories() {
    var tl = $("timeline");
    tl.textContent = "";
    E.memories.forEach(function (m, idx) {
      var li = document.createElement("li");
      reveal(li, idx % 4);
      if (m.when) { var w = document.createElement("span"); w.className = "when"; w.textContent = m.when; li.appendChild(w); }
      var h = document.createElement("h3"); h.textContent = m.title || "";
      li.appendChild(h);
      if (m.text) { var p = document.createElement("p"); p.textContent = m.text; li.appendChild(p); }
      tl.appendChild(li);
    });
    tl.parentNode.hidden = !E.memories.length;
  }

  /* ---------- Foto ---------- */
  function renderPhotos() {
    var box = $("polaroids");
    box.textContent = "";
    E.photos.forEach(function (ph, idx) {
      if (!ph || !ph.src) return;
      var fig = document.createElement("figure"); fig.className = "polaroid";
      reveal(fig, idx % 4);
      var img = document.createElement("img");
      img.src = ph.src; img.alt = ph.caption || "Foto kita"; img.loading = "lazy";
      img.addEventListener("error", function () { fig.remove(); if (!box.children.length) $("photoSec").hidden = true; });
      fig.appendChild(img);
      if (ph.caption) { var c = document.createElement("figcaption"); c.textContent = ph.caption; fig.appendChild(c); }
      box.appendChild(fig);
    });
    $("photoSec").hidden = !box.children.length;
  }

  /* ---------- Pertanyaan ---------- */
  var yes = $("yes"), no = $("no"), area = $("askArea"), dodges = 0, said = false;
  var excuses = ["Yakin?", "Coba pikir lagi", "Hampir kena", "Tombol Mau lebih besar lho", "Jangan gitu dong", "Tetap nggak bisa dipencet"];
  function dodge() {
    dodges += 1;
    var aw = area.clientWidth, ah = area.clientHeight, bw = no.offsetWidth, bh = no.offsetHeight;
    no.style.marginLeft = "0";
    no.style.left = Math.random() * Math.max(10, aw - bw) + "px";
    no.style.top = Math.random() * Math.max(10, ah - bh) + "px";
    no.textContent = excuses[(dodges - 1) % excuses.length];
    yes.style.fontSize = Math.min(30, 18 + dodges * 1.5) + "px";
  }
  ["pointerenter", "pointerdown", "focus"].forEach(function (ev) {
    no.addEventListener(ev, function (e) { e.preventDefault(); dodge(); });
  });
  no.addEventListener("click", function (e) { e.preventDefault(); dodge(); });
  yes.addEventListener("click", function () {
    said = true;
    $("ask").classList.add("celebrate");
    renderAsk();
    var r = yes.getBoundingClientRect();
    burst(window.innerWidth / 2, window.innerHeight * 0.3, 60);
    if (r.width) burst(r.left + r.width / 2, r.top, 40);
  });
  function renderAsk() {
    $("h-ask").textContent = said ? "Aku juga, " + E.name : E.question;
    $("askReply").textContent = said ? E.finalMessage : "";
    area.hidden = said;
  }

  /* ---------- Render semua ---------- */
  function render() {
    normalize();
    applyPalette(E.preset);
    var T = E.titles;
    $("toPrefix").textContent = T.to || "Kejutan kecil untuk";
    if (T.days) $("h-days").textContent = T.days;
    if (T.reasons) $("h-reason").textContent = T.reasons;
    if (T.memories) $("h-mem").textContent = T.memories;
    if (T.coupons) $("h-coupon").textContent = T.coupons;
    $("toName").textContent = E.name;
    $("footName").textContent = E.name;
    $("signoff").textContent = E.from ? "Dari " + E.from + ", dengan cinta" : "Dengan cinta";
    $("reasonSub").textContent = "Ada " + E.reasons.length + ", dan aku masih bisa nambah.";
    showReason();
    renderMemories();
    renderCoupons();
    renderPhotos();
    renderAsk();
    tick();
    if (env.classList.contains("open") && !letter.hidden) typeLetter();
  }

  /* ---------- Editor (hanya jika ?edit=1 atau showEditor true) ---------- */
  var panel = $("panel"), editBtn = $("editBtn"), sel = $("inPreset");
  if (editMode || BASE.showEditor === true) editBtn.hidden = false;
  Object.keys(PRESETS).forEach(function (k) {
    var o = document.createElement("option");
    o.value = k; o.textContent = PRESETS[k].label || k;
    sel.appendChild(o);
  });

  function lines(s) { return s.split("\n").map(function (x) { return x.trim(); }).filter(Boolean); }
  function splitBar(line) { return line.split("|").map(function (x) { return x.trim(); }); }
  function memToLine(m) { return [m.when || "", m.title || "", m.text || ""].join(" | "); }
  function couponToLine(c) { return (c.title || "") + " | " + (c.desc || ""); }
  function readForm() {
    var memories = lines($("inMemories").value).map(function (l) {
      var p = splitBar(l);
      if (p.length >= 3) return { when: p[0], title: p[1], text: p.slice(2).join(" | ") };
      if (p.length === 2) return { when: "", title: p[0], text: p[1] };
      return { when: "", title: p[0], text: "" };
    });
    var coupons = lines($("inCoupons").value).map(function (l) {
      var p = splitBar(l);
      return { title: p[0], desc: p.slice(1).join(" | ") };
    });
    return {
      preset: sel.value,
      name: $("inName").value.trim(),
      from: $("inFrom").value.trim(),
      startDate: $("inDate").value,
      letter: $("inLetter").value.trim(),
      reasons: lines($("inReasons").value),
      memories: memories,
      coupons: coupons,
      question: $("inQuestion").value.trim(),
      finalMessage: $("inFinal").value.trim()
    };
  }
  function fillContent(src) {
    $("inLetter").value = src.letter;
    $("inReasons").value = src.reasons.join("\n");
    $("inMemories").value = src.memories.map(memToLine).join("\n");
    $("inCoupons").value = src.coupons.map(couponToLine).join("\n");
    $("inQuestion").value = src.question;
    $("inFinal").value = src.finalMessage;
  }
  function showPresetDesc() { $("presetDesc").textContent = (PRESETS[sel.value] || {}).desc || ""; }
  function fillForm() {
    sel.value = E.preset;
    showPresetDesc();
    $("inName").value = E.name;
    $("inFrom").value = E.from;
    $("inDate").value = E.startDate;
    fillContent(E);
  }
  sel.addEventListener("change", function () {
    var P = presetOf(sel.value);
    showPresetDesc();
    fillContent(P);
    themed(function () { applyPalette(sel.value); });
  });
  editBtn.addEventListener("click", function () {
    var open = panel.hidden;
    panel.hidden = !open;
    editBtn.setAttribute("aria-expanded", String(open));
    if (open) fillForm();
  });
  panel.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = readForm();
    cfg = copyOf(BASE);
    overlay(cfg, data);
    lsSet("loveyou-cfg", JSON.stringify(data));
    render();
    panel.hidden = true;
    editBtn.setAttribute("aria-expanded", "false");
  });
  $("resetBtn").addEventListener("click", function () {
    lsDel("loveyou-cfg");
    cfg = copyOf(BASE);
    render();
    fillForm();
    $("linkBox").hidden = true;
  });
  $("linkBtn").addEventListener("click", function () {
    var data = readForm();
    var out = {};
    SHARED.forEach(function (k) { out[k] = data[k]; });
    var url = location.origin + location.pathname + "?d=" + encode(JSON.stringify(out));
    var box = $("linkOut");
    $("linkBox").hidden = false;
    box.value = url;
    box.focus(); box.select();
    $("linkNote").textContent = url.length > 6000
      ? "Link ini panjang sekali dan mungkin terpotong di beberapa aplikasi. Lebih aman isi config.js lalu deploy ulang."
      : "Link sudah dibuat. Foto diatur lewat config.js, tidak ikut masuk link.";
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {
        $("linkNote").textContent = "Link sudah disalin. Kirim ke dia, dan jangan kirim yang ada ?edit=1.";
      }, function () {});
    }
  });

  render();
})();
