// Jornada Enneagram quiz engine, result pages and subtype library.
(function () {
  const D = window.JORNADA_ENNEAGRAM;
  if (!D) return;
  const INST = ["SP", "SO", "SX"];
  const TYPES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const TIE = 0.04;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const base = document.body.dataset.base || "";
  const instName = k => D.instincts[k].name;
  const subLabel = (inst, type) => `${instName(inst)} ${type}`;

  // ---------- Quiz ----------
  function initQuiz(root) {
    const Q = D.questions;
    const answers = new Array(Q.length).fill(null);
    let i = 0;
    const scale = [
      { v: 1, l: "Strongly disagree" }, { v: 2, l: "Disagree" }, { v: 3, l: "Neutral" },
      { v: 4, l: "Agree" }, { v: 5, l: "Strongly agree" }
    ];

    function intro() {
      root.innerHTML = `
        <div class="qz-card qz-intro">
          <div class="qz-brand"><img src="${base}assets/img/mark-teal.svg" alt=""><span>Jornada Enneagram</span></div>
          <span class="eyebrow">The Lens of the Enneagram</span>
          <h3 class="qz-title">Welcome to a deeper understanding of you</h3>
          <p>Most personality tests tell you <em>what</em> you do. The Enneagram explains <em>why</em> you do it. It is a dynamic system of nine core types, each driven by an unconscious motivation. By finding your subtype, the meeting point of your type and your primary instinct, we uncover the particular flavor of your character.</p>
          <ul class="qz-how">
            <li><strong>Be honest, not ideal.</strong> Answer for how you actually think and feel, not how you wish you were.</li>
            <li><strong>Think long-term.</strong> Reflect on your patterns over the last several years, not just today.</li>
            <li><strong>${Q.length} statements, about 8 minutes.</strong> We measure your core motivation and your instinctual drive to find one of 27 subtypes.</li>
          </ul>
          <button class="btn btn-primary qz-start" type="button">Begin the Assessment</button>
          <p class="qz-fine">This assessment is an educational and self-reflection tool. It is not a clinical diagnostic instrument and does not replace professional psychological advice, therapy or medical care.</p>
        </div>`;
      root.querySelector(".qz-start").addEventListener("click", () => { i = 0; question(); scrollTop(); });
    }

    function scrollTop() {
      const y = root.getBoundingClientRect().top + window.scrollY - 100;
      if (Math.abs(window.scrollY - y) > 200) window.scrollTo({ top: y, behavior: "smooth" });
    }

    function question() {
      const q = Q[i];
      const pct = Math.round((i / Q.length) * 100);
      root.innerHTML = `
        <div class="qz-card">
          <div class="qz-top">
            <span class="qz-count">Statement ${i + 1} of ${Q.length}</span>
            <span class="qz-count">${pct}%</span>
          </div>
          <div class="qz-bar"><span style="width:${pct}%"></span></div>
          <p class="qz-q">${esc(q.t)}</p>
          <div class="qz-scale" role="radiogroup" aria-label="Your answer">
            ${scale.map(s => `<button type="button" class="qz-opt qz-o${s.v}${answers[i] === s.v ? " on" : ""}" data-v="${s.v}" role="radio" aria-checked="${answers[i] === s.v}" aria-label="${s.l}"><span class="dotwrap"><span class="dot"></span></span><span class="lbl">${s.l}</span></button>`).join("")}
          </div>
          <div class="qz-nav">
            <button type="button" class="qz-back"${i === 0 ? " disabled" : ""}>&larr; Back</button>
            <span class="qz-hint">Choose the circle that fits best</span>
          </div>
        </div>`;
      root.querySelectorAll(".qz-opt").forEach(b => b.addEventListener("click", () => {
        answers[i] = +b.dataset.v;
        b.classList.add("on");
        setTimeout(() => { if (i < Q.length - 1) { i++; question(); } else finish(); }, 220);
      }));
      root.querySelector(".qz-back").addEventListener("click", () => { if (i > 0) { i--; question(); } });
    }

    function score() {
      const s = {}, m = {};
      Q.forEach((q, idx) => {
        const n = (answers[idx] - 1) / 4;
        for (const k in q.w) { s[k] = (s[k] || 0) + q.w[k] * n; m[k] = (m[k] || 0) + q.w[k]; }
      });
      const pct = k => (m[k] ? s[k] / m[k] : 0);
      return {
        types: TYPES.map(t => ({ k: t, v: pct("T" + t) })).sort((a, b) => b.v - a.v),
        inst: INST.map(k => ({ k, v: pct(k) })).sort((a, b) => b.v - a.v),
        raw: { types: TYPES.map(t => Math.round(pct("T" + t) * 100)), inst: INST.map(k => Math.round(pct(k) * 100)) }
      };
    }

    function choose(eyebrow, title, opts, done) {
      root.innerHTML = `
        <div class="qz-card">
          <div class="qz-top"><span class="qz-count">${eyebrow}</span><span class="qz-count">Almost there</span></div>
          <div class="qz-bar"><span style="width:100%"></span></div>
          <p class="qz-q">${esc(title)}</p>
          <div class="qz-choices">${opts.map((o, n) => `<button type="button" class="qz-choice" data-n="${n}">${esc(o.label)}</button>`).join("")}</div>
        </div>`;
      root.querySelectorAll(".qz-choice").forEach(b => b.addEventListener("click", () => done(opts[+b.dataset.n].key)));
    }

    function finish() {
      const r = score();
      const go = (type, inst) => {
        const hash = "#s=" + r.raw.types.join(".") + "-" + r.raw.inst.join(".");
        location.href = `${base}enneagram/result.html?r=${inst.toLowerCase()}-${type}${hash}`;
      };
      const pickInst = type => {
        const tiedI = r.inst.filter(x => r.inst[0].v - x.v <= TIE);
        if (tiedI.length < 2) return go(type, r.inst[0].k);
        choose("Tie-breaker", "Which drive feels most urgent in your daily life?",
          tiedI.map(x => ({ key: x.k, label: `${instName(x.k)}: ${D.instincts[x.k].focus}` })), k => go(type, k));
      };
      const tiedT = r.types.filter(x => r.types[0].v - x.v <= TIE).slice(0, 3);
      if (tiedT.length < 2) return pickInst(r.types[0].k);
      choose("Tie-breaker", "At your core, which of these feels most true?",
        tiedT.map(x => ({ key: x.k, label: D.types[x.k].motive })), t => pickInst(t));
    }

    intro();
  }

  // ---------- Result page ----------
  function initResult(root) {
    const id = (new URLSearchParams(location.search).get("r") || "").toLowerCase();
    const m = id.match(/^(sp|so|sx)-([1-9])$/);
    if (!m || !D.subtypes[id]) {
      root.innerHTML = `<section class="light"><div class="wrap center"><h2>Result not found</h2><p class="lede">Take the assessment to discover your Enneagram subtype.</p><a class="btn btn-ghost" href="${base}doors.html#enneagram">Take the Assessment</a></div></section>`;
      return;
    }
    const inst = m[1].toUpperCase(), type = +m[2];
    const S = D.subtypes[id], T = D.types[type], C = D.centers[T.center];
    const label = subLabel(inst, type);
    document.title = `${label}: ${S.title} | Jornada Enneagram`;

    let scores = null;
    const h = location.hash.match(/s=([\d.]+)-([\d.]+)/);
    if (h) {
      const t = h[1].split(".").map(Number), n = h[2].split(".").map(Number);
      if (t.length === 9 && n.length === 3) scores = { t, n };
    }
    const bars = (rows, top) => rows.map(r => `
      <div class="qz-row${r.k === top ? " top" : ""}"><span class="qz-rl">${esc(r.l)}</span>
      <span class="qz-track"><span style="width:${Math.max(3, r.v)}%"></span></span><span class="qz-rv">${r.v}</span></div>`).join("");

    const scoreHtml = scores ? `
      <section class="soft">
        <div class="wrap">
          <div class="center" style="margin-bottom:44px"><span class="eyebrow">Your Results</span><h2>How your answers landed</h2>
          <p class="lede">Scores show how strongly each pattern showed up, from 0 to 100. Close scores are worth exploring, since many people see themselves in more than one type.</p></div>
          <div class="qz-scores">
            <div class="qz-panel"><h3>Core type</h3>${bars(TYPES.map((t, i) => ({ k: t, l: `${t} ${D.types[t].name.replace("The ", "")}`, v: scores.t[i] })), type)}</div>
            <div class="qz-panel"><h3>Instinct</h3>${bars(INST.map((k, i) => ({ k, l: instName(k), v: scores.n[i] })), inst)}
              <p class="qz-note">Your dominant instinct is <strong>${instName(inst)}</strong>, centered on ${D.instincts[inst].focus}.</p></div>
          </div>
        </div>
      </section>` : "";

    const siblings = INST.filter(k => k !== inst).map(k => {
      const sid = `${k.toLowerCase()}-${type}`;
      return `<a class="qz-sib" href="result.html?r=${sid}"><span class="eyebrow">${subLabel(k, type)}</span><h4>${esc(D.subtypes[sid].title)}</h4><span class="more">Read profile &rarr;</span></a>`;
    }).join("");

    root.innerHTML = `
      <section class="hero page-hero center" style="background-image:url('${base}assets/img/${({ Gut: "desert-stars", Heart: "dune-dusk", Head: "canyon-stars" })[T.center]}.jpg');min-height:70vh">
        <div class="wrap">
          <span class="eyebrow">${scores ? "Your Enneagram Subtype" : "Enneagram Subtype"}</span>
          <img class="qz-hero-mark" src="${base}assets/img/mark-teal.svg" alt="">
          <div class="qz-badge"><span>${type}</span><span>${inst}</span></div>
          <h1>${esc(S.title)}</h1>
          <p class="lede">${label} &middot; ${esc(T.name)}${S.counter ? ' &middot; <span class="qz-counter">Countertype</span>' : ""}</p>
        </div>
      </section>

      <section class="light">
        <div class="wrap split" style="align-items:start">
          <div class="reveal in">
            <div class="circles"></div>
            <span class="eyebrow">Who you are</span>
            <h2>${label}</h2>
            <p style="font-size:1.2rem">${esc(S.text)}</p>
            ${S.counter ? `<p class="qz-callout">You are a <strong>countertype</strong>: the subtype of Type ${type} that often looks like a different type. If other tests never quite fit, this may be why.</p>` : ""}
            <p>Type ${type}, ${esc(T.name)}, belongs to ${esc(C.label)}. Its core motivation: <em>${esc(T.motive)}</em></p>
          </div>
          <div class="qz-cards">
            <div class="qz-mini reveal in"><span class="eyebrow">Path to Growth</span><p>${esc(S.growth)}</p></div>
            <div class="qz-mini reveal in"><span class="eyebrow">Daily Practice</span><p>${esc(S.daily)}</p></div>
            <div class="qz-mini reveal in"><span class="eyebrow">${esc(C.label)}</span><p><strong>${esc(C.focus)}.</strong> ${esc(C.work)}</p></div>
          </div>
        </div>
      </section>
      ${scoreHtml}
      <section>
        <div class="wrap">
          <div class="center" style="margin-bottom:50px"><span class="eyebrow">Reflection Pillars</span><h2>From autopilot to presence</h2>
          <p class="lede">Self-awareness is not about changing who you are. It is about uncovering who you became in order to survive, and choosing who you want to be now.</p></div>
          <div class="tools" style="grid-template-columns:repeat(3,1fr)">
            ${D.pillars.map(p => `<div class="tool"><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></div>`).join("")}
          </div>
        </div>
      </section>

      <section class="light">
        <div class="wrap">
          <div class="split" style="align-items:center">
            <div>
              <span class="eyebrow">Go Deeper</span>
              <h2>Explore your type with a guide</h2>
              <p>A test is a beginning. In an Enneagram and Astrology Reading, Rachel reads your type alongside your birth chart, two lenses on who you are and where you are headed.</p>
              <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:18px">
                <a class="btn btn-primary" href="${base}offerings.html?offering=rachel-enneagram-astrology#inquire">Book a Reading</a>
                <a class="btn btn-ghost" href="${base}doors.html#enneagram">Retake the Assessment</a>
              </div>
            </div>
            <div>
              <span class="eyebrow">The Other Type ${type} Subtypes</span>
              <div class="qz-sibs">${siblings}</div>
              <a class="more qz-all" href="${base}enneagram/index.html">Explore all 27 subtypes &rarr;</a>
            </div>
          </div>
        </div>
      </section>
      <section class="form-band center">
        <div class="wrap">
          <span class="eyebrow" style="color:var(--nightsky)">The Jornada App</span>
          <h2>Your daily practice, in your pocket</h2>
          <p class="lede">The Jornada app will bring your subtype's daily growth prompts, reflection and progress tracking together with astrology and Human Design. Join the waitlist to be among the first to begin.</p>
          <form class="waitlist" data-form="waitlist">
            <input type="email" name="email" placeholder="Your email" required aria-label="Email">
            <input type="hidden" name="list" value="app-waitlist">
            <input type="hidden" name="enneagram" value="${label}">
            <button class="btn" type="submit">Join the Waitlist</button>
          </form>
          <p class="form-note"></p>
        </div>
      </section>`;
  }

  // ---------- Library ----------
  function initLibrary(root) {
    root.innerHTML = TYPES.map(t => `
      <div class="qz-type reveal in">
        <div class="qz-type-head"><span class="qz-num">${t}</span><div><span class="eyebrow">${esc(D.centers[D.types[t].center].label)}</span><h3>${esc(D.types[t].name)}</h3><p>${esc(D.types[t].motive)}</p></div></div>
        <div class="qz-sibs">${INST.map(k => {
          const sid = `${k.toLowerCase()}-${t}`, S = D.subtypes[sid];
          return `<a class="qz-sib" href="result.html?r=${sid}"><span class="eyebrow">${subLabel(k, t)}${S.counter ? " &middot; Countertype" : ""}</span><h4>${esc(S.title)}</h4><span class="more">Read profile &rarr;</span></a>`;
        }).join("")}</div>
      </div>`).join("");
  }

  document.addEventListener("DOMContentLoaded", () => {
    const q = document.getElementById("enneagram-quiz"); if (q) initQuiz(q);
    const r = document.getElementById("enneagram-result"); if (r) initResult(r);
    const l = document.getElementById("enneagram-library"); if (l) initLibrary(l);
  });
})();
