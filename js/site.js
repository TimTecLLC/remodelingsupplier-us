(function () {
  "use strict";

  var config = window.SITE_CONFIG || {};

  function isPlaceholder(value) {
    if (value == null) return true;
    var text = String(value).trim();
    if (!text) return true;
    return /^REPLACE_WITH_/i.test(text);
  }

  function text(value, fallback) {
    if (isPlaceholder(value)) return fallback || "";
    return String(value).trim();
  }

  function telHref(value) {
    var digits = String(value || "").replace(/[^\d]/g, "");
    if (digits.length === 10) return "tel:+1" + digits;
    if (digits.length === 11 && digits.charAt(0) === "1") return "tel:+" + digits;
    if (String(value).trim().indexOf("+") === 0) {
      return "tel:" + String(value).replace(/[^\d+]/g, "");
    }
    return "tel:" + digits;
  }

  function fillBindings() {
    document.querySelectorAll("[data-bind]").forEach(function (el) {
      var key = el.getAttribute("data-bind");
      var value = config[key];
      var fallback = el.getAttribute("data-fallback") || "";
      var filled = text(value, fallback);
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.value = filled;
        return;
      }
      el.textContent = filled;
    });

    document.querySelectorAll("[data-bind-href]").forEach(function (el) {
      var key = el.getAttribute("data-bind-href");
      var value = config[key];
      if (isPlaceholder(value)) {
        el.classList.add("hidden");
        el.setAttribute("hidden", "");
        return;
      }
      var prefix = el.getAttribute("data-href-prefix") || "";
      if (prefix === "tel:") {
        el.setAttribute("href", telHref(value));
      } else {
        el.setAttribute("href", prefix + String(value).trim());
      }
      el.classList.remove("hidden");
      el.removeAttribute("hidden");
    });

    document.querySelectorAll("[data-show-if]").forEach(function (el) {
      var key = el.getAttribute("data-show-if");
      if (isPlaceholder(config[key])) {
        el.classList.add("hidden");
        el.setAttribute("hidden", "");
      } else {
        el.classList.remove("hidden");
        el.removeAttribute("hidden");
      }
    });

    document.querySelectorAll("[data-hide-if-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-hide-if-placeholder");
      if (isPlaceholder(config[key])) {
        el.classList.add("hidden");
        el.setAttribute("hidden", "");
      }
    });

    var other = Array.isArray(config.OTHER_LINKS) ? config.OTHER_LINKS : [];
    document.querySelectorAll("[data-other-links]").forEach(function (list) {
      list.innerHTML = "";
      other.forEach(function (item) {
        if (!item || isPlaceholder(item.url) || !item.label) return;
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = item.url;
        a.textContent = item.label;
        a.rel = "noopener noreferrer";
        if (/^https?:/i.test(item.url)) a.target = "_blank";
        li.appendChild(a);
        list.appendChild(li);
      });
      if (!list.children.length) {
        var wrap = list.closest("[data-other-links-wrap]");
        if (wrap) {
          wrap.classList.add("hidden");
          wrap.setAttribute("hidden", "");
        }
      }
    });

    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });

    var hasSocial =
      !isPlaceholder(config.INSTAGRAM_URL) ||
      !isPlaceholder(config.FACEBOOK_URL) ||
      !isPlaceholder(config.TIKTOK_URL);
    document.querySelectorAll("[data-placeholder-social]").forEach(function (el) {
      if (hasSocial) {
        el.classList.add("hidden");
        el.setAttribute("hidden", "");
      }
    });
  }

  function upsertJsonLd() {
    var existing = document.getElementById("business-jsonld");
    if (!existing) return;

    var sameAs = [];
    if (!isPlaceholder(config.INSTAGRAM_URL)) sameAs.push(config.INSTAGRAM_URL);
    if (!isPlaceholder(config.FACEBOOK_URL)) sameAs.push(config.FACEBOOK_URL);
    if (!isPlaceholder(config.TIKTOK_URL)) sameAs.push(config.TIKTOK_URL);
    (config.OTHER_LINKS || []).forEach(function (item) {
      if (item && !isPlaceholder(item.url)) sameAs.push(item.url);
    });

    var data = {
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
      "@id": (config.SITE_URL || "https://remodelingsupplier.us") + "/#business",
      name: text(config.BUSINESS_NAME, "Serhii Appliances Services"),
      image: (config.SITE_URL || "https://remodelingsupplier.us") + "/assets/logo.png",
      url: config.SITE_URL || "https://remodelingsupplier.us",
      telephone: isPlaceholder(config.PHONE) ? undefined : telHref(config.PHONE).replace("tel:", ""),
      description:
        "Appliance repair and major-appliance installation in Orlando, Kissimmee, St. Cloud, and roughly 100 miles from downtown Orlando, Florida.",
      email: isPlaceholder(config.EMAIL) ? undefined : config.EMAIL,
      address: {
        "@type": "PostalAddress",
        streetAddress: isPlaceholder(config.ADDRESS) ? "REPLACE_WITH_ADDRESS" : config.ADDRESS,
        addressLocality: "Orlando",
        addressRegion: "FL",
        addressCountry: "US",
      },
      areaServed: [
        { "@type": "City", name: "Orlando", containedInPlace: { "@type": "State", name: "Florida" } },
        { "@type": "City", name: "Kissimmee", containedInPlace: { "@type": "State", name: "Florida" } },
        { "@type": "City", name: "St. Cloud", containedInPlace: { "@type": "State", name: "Florida" } },
        {
          "@type": "GeoCircle",
          name: "About 100 miles from downtown Orlando, FL",
          geoMidpoint: {
            "@type": "GeoCoordinates",
            name: "Downtown Orlando, FL",
            latitude: 28.5383,
            longitude: -81.3792,
          },
          geoRadius: 160934,
        },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Appliance repair and installation",
        itemListElement: [
          "Refrigerator repair and installation",
          "Washer repair and installation",
          "Dryer repair and installation",
          "Stove and cooktop repair and installation",
          "Oven repair and installation",
          "Dishwasher repair and installation",
          "Garbage disposal repair and installation",
          "Microwave repair and installation",
        ].map(function (name) {
          return { "@type": "Offer", itemOffered: { "@type": "Service", name: name } };
        }),
      },
    };

    if (sameAs.length) data.sameAs = sameAs;
    existing.textContent = JSON.stringify(data);
  }

  function setupNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("site-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("open", !open);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("open");
      });
    });
  }

  function serializeForm(form) {
    var data = {};
    new FormData(form).forEach(function (value, key) {
      if (key === "website") return;
      data[key] = String(value).trim();
    });
    return data;
  }

  function showStatus(form, tone, message) {
    var box = form.querySelector(".form-status");
    if (!box) return;
    box.dataset.tone = tone;
    box.textContent = message;
    box.classList.add("is-visible");
    box.removeAttribute("hidden");
    box.setAttribute("role", "status");
  }

  function endpointFor(form) {
    var kind = form.getAttribute("data-form");
    if (kind === "quote") return config.FORMSPREE_QUOTE;
    if (kind === "contact") return config.FORMSPREE_CONTACT;
    return "";
  }

  function mailtoBody(kind, data) {
    var lines = [];
    if (kind === "quote") {
      lines.push("Quote request from the Serhii Appliances Services website.");
      lines.push("");
      lines.push("Name: " + data.name);
      lines.push("Phone: " + data.phone);
      lines.push("Email: " + data.email);
      lines.push("City / ZIP: " + data.location);
      lines.push("Appliance: " + data.appliance);
      lines.push("");
      lines.push("Issue:");
      lines.push(data.issue);
    } else {
      lines.push("Information request from the Serhii Appliances Services website.");
      lines.push("");
      lines.push("Name: " + data.name);
      lines.push("Phone or email: " + data.reply);
      lines.push("");
      lines.push("Message:");
      lines.push(data.message);
    }
    return lines.join("\n");
  }

  function validate(form, data) {
    var kind = form.getAttribute("data-form");
    if (!data.name) return "Please enter your name.";
    if (kind === "quote") {
      if (!data.phone) return "Please enter a phone number so we can reach you.";
      if (!data.email) return "Please enter an email address.";
      if (!data.location) return "Please enter your city or ZIP.";
      if (!data.appliance) return "Please choose an appliance type.";
      if (!data.issue) return "Please describe the issue.";
    } else {
      if (!data.reply) return "Please leave a phone number or email.";
      if (!data.message) return "Please enter a message.";
    }
    return "";
  }

  function handleSubmit(event) {
    var form = event.target;
    if (!form.matches("form[data-form]")) return;
    event.preventDefault();

    var honey = form.querySelector('input[name="website"]');
    if (honey && honey.value) return;

    var data = serializeForm(form);
    var error = validate(form, data);
    if (error) {
      showStatus(form, "error", error);
      return;
    }

    var endpoint = endpointFor(form);
    if (!isPlaceholder(endpoint)) {
      fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Form service error");
          form.reset();
          showStatus(form, "ok", "Thanks. We received your note and will reply as soon as we can.");
        })
        .catch(function () {
          showStatus(
            form,
            "error",
            "The form service could not send this yet. Check FORMSPREE in js/config.js, or set EMAIL to use mailto."
          );
        });
      return;
    }

    if (isPlaceholder(config.EMAIL)) {
      showStatus(
        form,
        "error",
        "This site is ready, but EMAIL (or a Formspree endpoint) still needs to be set in js/config.js before messages can be delivered."
      );
      return;
    }

    var kind = form.getAttribute("data-form");
    var subject =
      kind === "quote"
        ? "Quote request — " + (data.appliance || "appliance") + " — " + data.location
        : "Information request from " + data.name;
    var href =
      "mailto:" +
      encodeURIComponent(config.EMAIL) +
      "?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(mailtoBody(kind, data));
    window.location.href = href;
    showStatus(
      form,
      "ok",
      "Your email app should open with the message filled in. If it does not, send the same details to " +
        config.EMAIL +
        "."
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    fillBindings();
    upsertJsonLd();
    setupNav();
    document.addEventListener("submit", handleSubmit);
  });
})();
