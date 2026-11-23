// Jornada Way site scripts

// Form endpoints. Paste the Formspree (or similar) URLs here once the accounts exist.
// Until then, the forms show a friendly note instead of sending.
const JORNADA_FORMS = {
  inquiry: "",   // e.g. "https://formspree.io/f/xxxxxxx"
  waitlist: ""   // e.g. "https://formspree.io/f/yyyyyyy"
};

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
      try {
        const res = await fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
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
