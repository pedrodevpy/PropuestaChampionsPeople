/* ==========================================================================
   Champions People — Lógica de la landing
   Depende de js/config.js (objeto BUSINESS y buildWhatsAppLink).
   ========================================================================== */
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const escapeHtml = (str) =>
    String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const iconSvg = (id, cls = "icon") =>
    `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-${id}"/></svg>`;

  /* ------------------------------------------------------------------------
     1. Datos del negocio → HTML (data-bind, enlaces de WhatsApp, tel, mapa)
     ------------------------------------------------------------------------ */
  function bindBusinessData() {
    $$("[data-bind]").forEach((el) => {
      const value = BUSINESS[el.dataset.bind];
      if (value !== undefined) el.textContent = value;
    });

    const waLink = buildWhatsAppLink(BUSINESS.whatsappGreeting);
    $$("[data-wa-link]").forEach((a) => {
      a.href = waLink;
      a.target = "_blank";
      a.rel = "noopener";
    });

    $$("[data-tel-link]").forEach((a) => (a.href = `tel:${BUSINESS.phoneTel}`));

    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BUSINESS.mapsQuery)}`;
    $$("[data-maps-link]").forEach((a) => (a.href = mapsUrl));

    const mapFrame = $("#mapFrame");
    if (mapFrame) {
      mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(BUSINESS.mapsQuery)}&output=embed&z=16`;
    }

    const year = $("#year");
    if (year) year.textContent = new Date().getFullYear();
  }

  /* ------------------------------------------------------------------------
     2. Servicios
     ------------------------------------------------------------------------ */
  function renderServices() {
    const grid = $("#servicesGrid");
    const select = $("#service");
    if (!grid) return;

    grid.innerHTML = BUSINESS.services
      .map((s) => {
        const pricing = Array.isArray(s.pricing) ? s.pricing : [];
        const price = pricing.length
          ? `<ul class="service__pricing">${pricing
              .map(
                (p) => `
                <li>
                  <span class="service__price-value">${escapeHtml(p.price)}<small>${escapeHtml(p.unit || "")}</small></span>
                  ${p.schedule ? `<span class="service__price-schedule">${iconSvg("clock")} ${escapeHtml(p.schedule)}</span>` : ""}
                </li>`
              )
              .join("")}</ul>`
          : `<div class="service__price">Consultar precio<small>Te lo confirmamos por WhatsApp</small></div>`;
        return `
          <article class="service ${s.featured ? "service--featured" : ""} reveal">
            ${s.featured ? '<span class="service__badge">Más reservado</span>' : ""}
            <span class="service__icon">${iconSvg(s.icon || "trophy")}</span>
            <h3 class="service__name">${escapeHtml(s.name)}</h3>
            <p class="service__desc">${escapeHtml(s.description)}</p>
            ${s.capacityLabel ? `<p class="service__meta">${iconSvg("users")} ${escapeHtml(s.capacityLabel)}</p>` : ""}
            ${price}
            <a href="#reservar" class="btn ${s.featured ? "btn--primary" : "btn--dark"}" data-service="${escapeHtml(s.id)}">
              Reservar
            </a>
          </article>`;
      })
      .join("");

    if (select) {
      BUSINESS.services.forEach((s) => {
        const opt = document.createElement("option");
        opt.value = s.id;
        opt.textContent = s.name;
        select.appendChild(opt);
      });
    }

    // Botón "Reservar" de cada tarjeta: preselecciona el servicio en el formulario.
    grid.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-service]");
      if (!btn || !select) return;
      select.value = btn.dataset.service;
      clearFieldError(select);
    });
  }

  /* ------------------------------------------------------------------------
     2b. Descuento / convenio (banner + casilla del formulario)
     ------------------------------------------------------------------------ */
  function renderMembership() {
    const m = BUSINESS.membership;
    const banner = $("#membershipBanner");
    const field = $("#membershipField");
    if (!m || !m.enabled) {
      if (banner) banner.hidden = true;
      if (field) field.hidden = true;
      return;
    }
    if (banner) {
      $(".promo__title", banner).textContent = m.title;
      $(".promo__text", banner).textContent = m.text;
    }
    if (field) $("label span", field).textContent = m.checkboxLabel;

    // El botón del banner marca la casilla de afiliado al ir al formulario.
    $$("[data-member-cta]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const check = $("#member");
        if (check) check.checked = true;
      })
    );
  }

  /* ------------------------------------------------------------------------
     3. Galería
     ------------------------------------------------------------------------ */
  function renderGallery() {
    const grid = $("#galleryGrid");
    if (!grid) return;
    grid.innerHTML = BUSINESS.gallery
      .map(
        (g) => `
        <figure class="gallery__item ${g.size === "wide" ? "gallery__item--wide" : ""} reveal">
          <img src="${escapeHtml(g.src)}" alt="${escapeHtml(g.alt)}" loading="lazy" />
          <figcaption class="gallery__caption">${escapeHtml(g.alt)}</figcaption>
        </figure>`
      )
      .join("");
  }

  /* ------------------------------------------------------------------------
     4. Testimonios (se oculta la sección si el array está vacío)
     ------------------------------------------------------------------------ */
  function renderTestimonials() {
    const grid = $("#testimonialsGrid");
    const section = $("#testimonios");
    if (!grid || !section) return;

    if (!BUSINESS.testimonials.length) {
      section.hidden = true;
      return;
    }

    grid.innerHTML = BUSINESS.testimonials
      .map((t) => {
        const stars = Array.from({ length: 5 }, (_, i) =>
          i < t.rating ? iconSvg("star") : ""
        ).join("");
        const initials = t.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
        return `
          <article class="testimonial reveal">
            <div class="testimonial__stars" aria-label="${t.rating} de 5 estrellas">${stars}</div>
            <p class="testimonial__text">“${escapeHtml(t.text)}”</p>
            <div class="testimonial__author">
              <span class="testimonial__avatar" aria-hidden="true">${escapeHtml(initials)}</span>
              <div><strong>${escapeHtml(t.name)}</strong><span>${escapeHtml(t.role)}</span></div>
            </div>
          </article>`;
      })
      .join("");
  }

  /* ------------------------------------------------------------------------
     5. Horarios y redes sociales
     ------------------------------------------------------------------------ */
  function renderHours() {
    const list = $("#hoursList");
    if (!list) return;
    list.innerHTML = BUSINESS.hours
      .map((h) => `<li><span>${escapeHtml(h.days)}</span><span>${escapeHtml(h.time)}</span></li>`)
      .join("");
  }

  function renderSocial() {
    const items = [
      { key: "instagram", label: "Instagram" },
      { key: "facebook", label: "Facebook" },
      { key: "tiktok", label: "TikTok" },
    ]
      .filter((s) => BUSINESS.social[s.key])
      .map(
        (s) =>
          `<a href="${escapeHtml(BUSINESS.social[s.key])}" target="_blank" rel="noopener" aria-label="${s.label}" title="${s.label}">${iconSvg(s.key)}</a>`
      );

    items.push(
      `<a href="${buildWhatsAppLink(BUSINESS.whatsappGreeting)}" class="social--wa" target="_blank" rel="noopener" aria-label="WhatsApp" title="WhatsApp">${iconSvg("whatsapp")}</a>`
    );

    ["#contactSocial", "#footerSocial"].forEach((sel) => {
      const el = $(sel);
      if (el) el.innerHTML = items.join("");
    });
  }

  /* ------------------------------------------------------------------------
     6. Header, menú móvil y enlace activo
     ------------------------------------------------------------------------ */
  function initHeader() {
    const header = $("#header");
    const toggle = $("#navToggle");
    const nav = $("#nav");

    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const closeMenu = () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menú");
      document.body.style.overflow = "";
    };

    toggle.addEventListener("click", () => {
      const open = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });

    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    // Resalta el enlace de la sección visible.
    const links = $$(".nav__link");
    const sections = links
      .map((l) => $(l.getAttribute("href")))
      .filter(Boolean);

    if ("IntersectionObserver" in window) {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            links.forEach((l) =>
              l.classList.toggle("is-active", l.getAttribute("href") === `#${entry.target.id}`)
            );
          });
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      sections.forEach((s) => obs.observe(s));
    }
  }

  /* ------------------------------------------------------------------------
     7. Animaciones al hacer scroll
     ------------------------------------------------------------------------ */
  function initReveal() {
    const els = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => obs.observe(el));
  }

  /* ------------------------------------------------------------------------
     8. Formulario de reserva → WhatsApp
     ------------------------------------------------------------------------ */
  function formatHour12(hour24) {
    const suffix = hour24 >= 12 ? "PM" : "AM";
    const h = hour24 % 12 === 0 ? 12 : hour24 % 12;
    return `${h}:00 ${suffix}`;
  }

  function formatDate(isoDate) {
    // "2026-09-20" → "20/09/2026"
    const [y, m, d] = isoDate.split("-");
    return `${d}/${m}/${y}`;
  }

  function todayIso() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function setFieldError(input, message) {
    const field = input.closest(".field");
    const error = field.querySelector(".field__error");
    field.classList.add("is-invalid");
    input.setAttribute("aria-invalid", "true");
    if (error) error.textContent = message;
  }

  function clearFieldError(input) {
    const field = input.closest(".field");
    if (!field) return;
    field.classList.remove("is-invalid");
    input.removeAttribute("aria-invalid");
    const error = field.querySelector(".field__error");
    if (error) error.textContent = "";
  }

  function validateField(input) {
    const value = input.value.trim();

    switch (input.id) {
      case "name":
        if (value.length < 3) return "Escribe tu nombre completo.";
        if (!/^[a-záéíóúñü\s.'-]+$/i.test(value)) return "El nombre solo puede contener letras.";
        return "";
      case "phone": {
        const digits = value.replace(/\D/g, "");
        if (!digits) return "Ingresa tu número de teléfono.";
        if (digits.length < 7 || digits.length > 15) return "Ingresa un número de teléfono válido.";
        return "";
      }
      case "service":
        return value ? "" : "Selecciona un servicio.";
      case "date":
        if (!value) return "Selecciona una fecha.";
        if (value < todayIso()) return "La fecha no puede ser anterior a hoy.";
        return "";
      case "time":
        return value ? "" : "Selecciona una hora.";
      case "people": {
        if (!value) return "";
        const n = Number(value);
        if (!Number.isInteger(n) || n < 1) return "Ingresa una cantidad válida.";
        if (n > BUSINESS.booking.maxPeople) return `Máximo ${BUSINESS.booking.maxPeople} personas. Para grupos más grandes escríbenos por WhatsApp.`;
        return "";
      }
      default:
        return "";
    }
  }

  function buildBookingMessage(data) {
    const service = BUSINESS.services.find((s) => s.id === data.service);
    const lines = [
      "Hola, quiero realizar una reserva.",
      "",
      `Nombre: ${data.name}`,
      `Teléfono: ${data.phone}`,
      `Servicio: ${service ? service.name : data.service}`,
      `Fecha: ${formatDate(data.date)}`,
      `Hora: ${data.time}`,
    ];
    if (data.people) lines.push(`Personas: ${data.people}`);
    if (data.member) lines.push(`Afiliado ${BUSINESS.membership.partner}: Sí (descuento exclusivo)`);
    if (data.comments) lines.push(`Comentarios: ${data.comments}`);
    lines.push("", "¿Me confirman disponibilidad? ¡Gracias!");
    return lines.join("\n");
  }

  function initBookingForm() {
    const form = $("#bookingForm");
    if (!form) return;

    const dateInput = $("#date");
    const timeSelect = $("#time");
    const peopleInput = $("#people");
    const submitBtn = $("#submitBtn");
    const success = $("#formSuccess");
    const successLink = $("#successLink");

    // Fecha mínima: hoy.
    dateInput.min = todayIso();
    peopleInput.max = BUSINESS.booking.maxPeople;

    // Franjas horarias desde la configuración.
    for (let h = BUSINESS.booking.firstHour; h <= BUSINESS.booking.lastHour; h++) {
      const opt = document.createElement("option");
      opt.value = formatHour12(h);
      opt.textContent = formatHour12(h);
      timeSelect.appendChild(opt);
    }

    const fields = ["name", "phone", "service", "date", "time", "people"].map((id) => $(`#${id}`));

    // Validación en vivo: limpia el error al corregir.
    fields.forEach((input) => {
      const evt = input.tagName === "SELECT" || input.type === "date" ? "change" : "input";
      input.addEventListener(evt, () => {
        if (input.closest(".field").classList.contains("is-invalid")) {
          const msg = validateField(input);
          msg ? setFieldError(input, msg) : clearFieldError(input);
        }
      });
      input.addEventListener("blur", () => {
        if (!input.value) return;
        const msg = validateField(input);
        msg ? setFieldError(input, msg) : clearFieldError(input);
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      success.hidden = true;

      let firstInvalid = null;
      fields.forEach((input) => {
        const msg = validateField(input);
        if (msg) {
          setFieldError(input, msg);
          if (!firstInvalid) firstInvalid = input;
        } else {
          clearFieldError(input);
        }
      });

      if (firstInvalid) {
        firstInvalid.focus({ preventScroll: true });
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      const data = {
        name: $("#name").value.trim(),
        phone: $("#phone").value.trim(),
        service: $("#service").value,
        date: dateInput.value,
        time: timeSelect.value,
        people: peopleInput.value.trim(),
        member: !!($("#member") && $("#member").checked && BUSINESS.membership && BUSINESS.membership.enabled),
        comments: $("#comments").value.trim(),
      };

      const link = buildWhatsAppLink(buildBookingMessage(data));

      // Feedback visual.
      submitBtn.disabled = true;
      submitBtn.querySelector("span").textContent = "Abriendo WhatsApp…";

      const opened = window.open(link, "_blank", "noopener");
      if (!opened) window.location.href = link; // Si el navegador bloquea pop-ups.

      successLink.href = link;
      success.hidden = false;
      success.scrollIntoView({ behavior: "smooth", block: "nearest" });

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.querySelector("span").textContent = "Solicitar reserva";
      }, 1800);
    });
  }

  /* ------------------------------------------------------------------------
     9. Scroll suave con compensación del header fijo
     ------------------------------------------------------------------------ */
  function initSmoothScroll() {
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute("href");
      if (href === "#") return;
      const target = $(href);
      if (!target) return;
      e.preventDefault();
      const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h"), 10) || 76;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH + 4;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
      history.replaceState(null, "", href);
    });
  }

  /* ------------------------------------------------------------------------
     Inicio
     ------------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    bindBusinessData();
    renderServices();
    renderMembership();
    renderGallery();
    renderTestimonials();
    renderHours();
    renderSocial();
    initHeader();
    initBookingForm();
    initSmoothScroll();
    initReveal(); // Al final: los elementos .reveal generados ya existen.
  });
})();
