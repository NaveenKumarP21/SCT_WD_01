/* =========================================================
   CareerConnect — script.js
   Vanilla JavaScript
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  initNavbarScrollEffect();
  initMobileMenu();
  initActiveNavLink();
  initSearchForm();
  initContactForm();
  initCharacterCounter();
  initScrollReveal();
  initFooterYear();

});


/* =========================================================
   1. NAVBAR SCROLL EFFECT
========================================================= */

function initNavbarScrollEffect() {

  const navbar = document.getElementById("navbar");

  if (!navbar) return;

  const updateNavbar = () => {

    if (window.scrollY > 35) {
      navbar.classList.add("is-scrolled");
    } else {
      navbar.classList.remove("is-scrolled");
    }

  };

  updateNavbar();

  window.addEventListener(
    "scroll",
    updateNavbar,
    { passive: true }
  );

}


/* =========================================================
   2. MOBILE NAVIGATION
========================================================= */

function initMobileMenu() {

  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("primaryNav");

  if (!toggle || !nav) return;

  const links = nav.querySelectorAll("[data-nav-link]");

  const closeMenu = () => {

    nav.classList.remove("is-open");

    toggle.setAttribute(
      "aria-expanded",
      "false"
    );

    toggle.classList.remove("is-active");

  };


  const openMenu = () => {

    nav.classList.add("is-open");

    toggle.setAttribute(
      "aria-expanded",
      "true"
    );

    toggle.classList.add("is-active");

  };


  toggle.addEventListener("click", () => {

    const isOpen =
      nav.classList.contains("is-open");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }

  });


  links.forEach(link => {

    link.addEventListener("click", () => {
      closeMenu();
    });

  });


  document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
      closeMenu();
    }

  });


  window.addEventListener("resize", () => {

    if (window.innerWidth > 980) {
      closeMenu();
    }

  });

}


/* =========================================================
   3. ACTIVE NAVIGATION
========================================================= */

function initActiveNavLink() {

  const navLinks =
    document.querySelectorAll("[data-nav-link]");

  if (!navLinks.length) return;

  const sections = [];

  navLinks.forEach(link => {

    const href =
      link.getAttribute("href");

    if (!href || !href.startsWith("#")) return;

    const section =
      document.querySelector(href);

    if (section) {
      sections.push(section);
    }

  });


  const setActive = id => {

    navLinks.forEach(link => {

      const href =
        link.getAttribute("href");

      link.classList.toggle(
        "is-active",
        href === `#${id}`
      );

    });

  };


  const observer =
    new IntersectionObserver(
      entries => {

        const visible =
          entries
            .filter(entry => entry.isIntersecting)
            .sort(
              (a, b) =>
                a.boundingClientRect.top -
                b.boundingClientRect.top
            );

        if (visible.length) {
          setActive(
            visible[0].target.id
          );
        }

      },
      {
        rootMargin:
          "-35% 0px -55% 0px",
        threshold: 0
      }
    );


  sections.forEach(section => {
    observer.observe(section);
  });

}


/* =========================================================
   4. SEARCH FORM
========================================================= */

function initSearchForm() {

  const form =
    document.getElementById("searchForm");

  const status =
    document.getElementById("searchStatus");

  const roleInput =
    document.getElementById("searchRole");

  const locationInput =
    document.getElementById("searchLocation");

  if (
    !form ||
    !status ||
    !roleInput ||
    !locationInput
  ) {
    return;
  }


  form.addEventListener("submit", event => {

    event.preventDefault();

    const role =
      roleInput.value.trim();

    const location =
      locationInput.value.trim();


    let message =
      "Showing all featured opportunities below.";


    if (role && location) {

      message =
        `Showing opportunities for "${role}" in ${location}.`;

    } else if (role) {

      message =
        `Showing opportunities for "${role}".`;

    } else if (location) {

      message =
        `Showing opportunities in ${location}.`;

    }


    status.textContent = message;


    const jobs =
      document.getElementById("jobs");

    if (jobs) {

      jobs.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }

  });


  /* Clear status when user starts another search */

  [roleInput, locationInput].forEach(input => {

    input.addEventListener("input", () => {

      if (status.textContent) {
        status.textContent = "";
      }

    });

  });

}


/* =========================================================
   5. CONTACT FORM
========================================================= */

function initContactForm() {

  const form =
    document.getElementById("contactForm");

  if (!form) return;


  const success =
    document.getElementById("formSuccess");


  const EMAIL_PATTERN =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  const fields = {

    cfName: {
      required: true
    },

    cfEmail: {
      required: true,
      email: true
    },

    cfSubject: {
      required: true
    },

    cfMessage: {
      required: true,
      minLength: 20,
      maxLength: 500
    }

  };


  const getError = id =>
    document.getElementById(`err-${id}`);


  const showError = (id, message) => {

    const input =
      document.getElementById(id);

    const error =
      getError(id);

    const field =
      input?.closest(".form-field");


    field?.classList.add("has-error");

    if (error) {
      error.textContent = message;
    }

  };


  const clearError = id => {

    const input =
      document.getElementById(id);

    const error =
      getError(id);

    const field =
      input?.closest(".form-field");


    field?.classList.remove("has-error");

    if (error) {
      error.textContent = "";
    }

  };


  const validateField = (id, rules) => {

    const input =
      document.getElementById(id);

    if (!input) return false;

    const value =
      input.value.trim();


    if (
      rules.required &&
      value === ""
    ) {

      showError(
        id,
        "This field is required."
      );

      return false;

    }


    if (
      rules.email &&
      !EMAIL_PATTERN.test(value)
    ) {

      showError(
        id,
        "Enter a valid email address."
      );

      return false;

    }


    if (
      rules.minLength &&
      value.length < rules.minLength
    ) {

      showError(
        id,
        `Please enter at least ${rules.minLength} characters.`
      );

      return false;

    }


    if (
      rules.maxLength &&
      value.length > rules.maxLength
    ) {

      showError(
        id,
        `Please keep the message under ${rules.maxLength} characters.`
      );

      return false;

    }


    clearError(id);

    return true;

  };


  Object.keys(fields).forEach(id => {

    const input =
      document.getElementById(id);

    if (!input) return;


    input.addEventListener(
      "blur",
      () => {

        validateField(
          id,
          fields[id]
        );

      }
    );


    input.addEventListener(
      "input",
      () => {

        if (
          input
            .closest(".form-field")
            ?.classList.contains("has-error")
        ) {

          validateField(
            id,
            fields[id]
          );

        }

      }
    );

  });


  form.addEventListener(
    "submit",
    event => {

      event.preventDefault();

      success.textContent = "";


      let valid = true;


      Object.keys(fields).forEach(id => {

        const result =
          validateField(
            id,
            fields[id]
          );

        if (!result) {
          valid = false;
        }

      });


      if (!valid) {

        const firstError =
          form.querySelector(
            ".has-error input, .has-error textarea, .has-error select"
          );

        firstError?.focus();

        return;

      }


      success.textContent =
        "Thanks — your message has been sent. Our team will get back to you within one business day.";


      form.reset();


      const counter =
        document.getElementById("charCount");

      if (counter) {
        counter.textContent = "0 / 500";
      }


      setTimeout(() => {

        success.textContent = "";

      }, 7000);

    }
  );

}


/* =========================================================
   6. CHARACTER COUNTER
========================================================= */

function initCharacterCounter() {

  const textarea =
    document.getElementById("cfMessage");

  const counter =
    document.getElementById("charCount");

  if (!textarea || !counter) return;


  const updateCounter = () => {

    const length =
      textarea.value.length;

    counter.textContent =
      `${length} / 500`;

  };


  textarea.addEventListener(
    "input",
    updateCounter
  );


  updateCounter();

}


/* =========================================================
   7. SCROLL REVEAL
========================================================= */

function initScrollReveal() {

  const elements =
    document.querySelectorAll(
      "[data-reveal]"
    );

  if (!elements.length) return;


  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  if (reducedMotion) {

    elements.forEach(element => {
      element.classList.add("is-visible");
    });

    return;

  }


  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              "is-visible"
            );

            observer.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold: .12,
        rootMargin:
          "0px 0px -45px 0px"
      }
    );


  elements.forEach(element => {

    observer.observe(element);

  });

}


/* =========================================================
   8. FOOTER YEAR
========================================================= */

function initFooterYear() {

  const year =
    document.getElementById("year");

  if (year) {

    year.textContent =
      new Date().getFullYear();

  }

}