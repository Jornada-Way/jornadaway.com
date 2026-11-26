// Jornada Way site scripts

// Form endpoints. Paste the Formspree (or similar) URLs here once the accounts exist.
// Until then, the forms show a friendly note instead of sending.
const JORNADA_FORMS = {
  inquiry: "https://formsubmit.co/ajax/rachel@jornadaway.com",
  waitlist: "mailchimp"
};

// Mailchimp: "Jornada Way Website" embedded form in the main audience, tagged "Jornada Way".
const JORNADA_MAILCHIMP = {
  url: "https://daughterofdirtandstars.us19.list-manage.com/subscribe/post-json",
  u: "5676aba5c19c6555e904d469a",
  id: "238f0de556",
  f_id: "007bc2e1f0",
  tags: "647",
  honey: "b_5676aba5c19c6555e904d469a_238f0de556"
};

function mailchimpSubscribe(email) {
  return new Promise((resolve, reject) => {
    const cb = "jornadaMc" + Date.now();
    const m = JORNADA_MAILCHIMP;
    const q = new URLSearchParams({ u: m.u, id: m.id, f_id: m.f_id, tags: m.tags, EMAIL: email, [m.honey]: "", c: cb });
    const s = document.createElement("script");
    const done = () => { delete window[cb]; s.remove(); };
    window[cb] = res => { done(); resolve(res); };
    s.onerror = () => { done(); reject(new Error("network")); };
    s.src = m.url + "?" + q.toString();
    document.body.appendChild(s);
    setTimeout(() => { if (window[cb]) { done(); reject(new Error("timeout")); } }, 12000);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Header background on scroll
  const header = document.querySelector(".site-header");
  const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile nav
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      nav.classList.remove("open");
      document.body.style.overflow = "";
    }));
  }

  // Reveal on scroll
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  // Prefill inquiry form from ?offering= or from Inquire buttons
  const select = document.querySelector("#offering");
  if (select) {
    const params = new URLSearchParams(location.search);
    const pre = params.get("offering");
    if (pre) select.value = pre;
    document.querySelectorAll("[data-offering]").forEach(btn => {
      btn.addEventListener("click", () => { select.value = btn.dataset.offering; });
    });
  }

  // Writings filter
  const filterBtns = document.querySelectorAll(".filters button");
  filterBtns.forEach(btn => btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("on"));
    btn.classList.add("on");
    const who = btn.dataset.filter;
    document.querySelectorAll(".writing").forEach(w => {
      w.style.display = (who === "all" || w.dataset.author === who) ? "" : "none";
    });
  }));

  // Forms
  document.querySelectorAll("form[data-form]").forEach(form => {
    form.addEventListener("submit", async ev => {
      ev.preventDefault();
      const note = form.querySelector(".form-note") || form.parentElement.querySelector(".form-note");
      const endpoint = JORNADA_FORMS[form.dataset.form];
      if (!endpoint) {
        if (note) note.textContent = "Thank you. This form is almost ready. Please check back very soon.";
        return;
      }
      if (endpoint === "mailchimp") {
        const email = (form.querySelector('input[type="email"]') || {}).value || "";
        try {
          const res = await mailchimpSubscribe(email);
          const msg = String(res && res.msg || "");
          if (res && res.result === "success") {
            form.reset();
            if (note) note.textContent = /confirm/i.test(msg)
              ? "Almost there. Check your inbox to confirm your subscription."
              : "You're on the list. We'll be in touch as the journey unfolds.";
          } else if (/already subscribed/i.test(msg)) {
            if (note) note.textContent = "You're already on the list. Thank you for walking with us.";
          } else {
            if (note) note.textContent = "Please check your email address and try again.";
          }
        } catch {
          if (note) note.textContent = "Something went wrong. Please try again in a moment.";
        }
        return;
      }
      try {
        const data = new FormData(form);
        data.append("_subject", form.dataset.form === "waitlist" ? "New Jornada waitlist signup" : "New Jornada inquiry");
        data.append("_template", "table");
        data.append("_captcha", "false");
        if (data.get("email")) data.append("_replyto", data.get("email"));
        const res = await fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error();
        form.reset();
        if (note) note.textContent = form.dataset.form === "waitlist"
          ? "You're on the list. We'll be in touch as the journey unfolds."
          : "Thank you. We received your note and will reach out personally.";
      } catch {
        if (note) note.textContent = "Something went wrong. Please try again in a moment.";
      }
    });
  });
});

/* Contact menu: Gmail, default email app, or copy address */
(function () {
  let menu = null;
  function close() { if (menu) { menu.remove(); menu = null; } }
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="mailto:"]');
    if (!a) { if (menu && !menu.contains(e.target)) close(); return; }
    e.preventDefault();
    if (menu && menu.dataset.for === a.href) { close(); return; }
    close();
    const email = a.getAttribute("href").replace(/^mailto:/, "").split("?")[0];
    const gmail = "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(email);
    menu = document.createElement("div");
    menu.className = "contact-menu";
    menu.dataset.for = a.href;
    menu.innerHTML =
      '<a href="' + gmail + '" target="_blank" rel="noopener">Open in Gmail</a>' +
      '<a href="mailto:' + email + '" data-direct>Use my email app</a>' +
      '<button type="button">Copy ' + email + '</button>';
    menu.querySelector("[data-direct]").addEventListener("click", (ev) => {
      ev.stopPropagation(); window.location.href = "mailto:" + email; close();
    });
    menu.querySelector("button").addEventListener("click", async (ev) => {
      ev.stopPropagation();
      try { await navigator.clipboard.writeText(email); ev.target.textContent = "Copied"; }
      catch { ev.target.textContent = email; }
      setTimeout(close, 1200);
    });
    menu.querySelector("a[target]").addEventListener("click", () => setTimeout(close, 100));
    document.body.appendChild(menu);
    const r = a.getBoundingClientRect();
    const left = Math.min(r.left + window.scrollX, window.scrollX + document.documentElement.clientWidth - menu.offsetWidth - 12);
    menu.style.left = Math.max(12, left) + "px";
    menu.style.top = (r.bottom + window.scrollY + 8) + "px";
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  window.addEventListener("resize", close);
})();
