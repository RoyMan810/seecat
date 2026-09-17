/* SEECAT — the only behaviour the page needs. No dependencies. */
(function () {
  "use strict";

  /* ---- Mobile nav ------------------------------------------------------ */

  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");

  if (toggle && links) {
    const mobile = window.matchMedia("(max-width: 899px)");

    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      links.hidden = !open;
    };

    // The panel is only ever hidden at mobile widths; above that the CSS lays
    // it out inline and `hidden` must not be left behind.
    const sync = () => {
      if (mobile.matches) setOpen(false);
      else { links.hidden = false; toggle.setAttribute("aria-expanded", "false"); }
    };
    sync();
    mobile.addEventListener("change", sync);

    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Close after picking a destination, and on Escape.
    links.addEventListener("click", (e) => {
      if (mobile.matches && e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobile.matches && !links.hidden) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ---- Copy the contract address --------------------------------------- */

  document.querySelectorAll("[data-copy]").forEach((btn) => {
    const label = btn.textContent;
    let timer;

    btn.addEventListener("click", async () => {
      const field = document.querySelector(btn.dataset.copy);
      if (!field) return;

      const value = field.value || field.textContent || "";
      let ok = true;

      try {
        // Only available over https / localhost; fall back to selection.
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(value);
        } else {
          field.removeAttribute("readonly");
          field.select();
          ok = document.execCommand("copy");
          field.setAttribute("readonly", "");
          field.blur();
        }
      } catch (err) {
        ok = false;
      }

      btn.textContent = ok ? "COPIED" : "SELECT IT";
      btn.dataset.state = ok ? "done" : "";
      if (!ok) { field.removeAttribute("readonly"); field.select(); }

      clearTimeout(timer);
      timer = setTimeout(() => {
        btn.textContent = label;
        delete btn.dataset.state;
        if (!ok) field.setAttribute("readonly", "");
      }, 1800);
    });
  });
})();
