(() => {
  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav]");
  const floatingWhatsApp = document.querySelector(".floating-whatsapp");

  const setHeaderState = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 18);
    floatingWhatsApp?.classList.toggle("is-visible", window.scrollY > 420);
  };

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    nav?.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("nav-open", !isOpen);
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle?.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
    });
  });

  const serviceButtons = document.querySelectorAll(".service-filter");
  const services = document.querySelectorAll("[data-services] article");

  serviceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter || "all";

      serviceButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      services.forEach((service) => {
        const categories = service.dataset.category?.split(" ") || [];
        const shouldShow = filter === "all" || categories.includes(filter);
        service.classList.toggle("is-hidden", !shouldShow);
      });
    });
  });

  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const setupCarousel = (root) => {
    const track = root.querySelector(".carousel-track, .testimonial-track");
    const slides = Array.from(track?.children || []);
    const prev = root.querySelector("[data-prev]");
    const next = root.querySelector("[data-next]");
    const dotsWrap = root.querySelector(".carousel-dots");
    let index = 0;
    let startX = 0;
    let deltaX = 0;

    if (!track || slides.length === 0 || !dotsWrap) return;

    const dots = slides.map((_, dotIndex) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Ir para item ${dotIndex + 1}`);
      dot.addEventListener("click", () => goTo(dotIndex));
      dotsWrap.appendChild(dot);
      return dot;
    });

    const update = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("active", dotIndex === index);
        dot.setAttribute("aria-current", dotIndex === index ? "true" : "false");
      });
    };

    const goTo = (nextIndex) => {
      index = (nextIndex + slides.length) % slides.length;
      update();
    };

    prev?.addEventListener("click", () => goTo(index - 1));
    next?.addEventListener("click", () => goTo(index + 1));

    track.addEventListener(
      "touchstart",
      (event) => {
        startX = event.touches[0].clientX;
        deltaX = 0;
      },
      { passive: true }
    );

    track.addEventListener(
      "touchmove",
      (event) => {
        deltaX = event.touches[0].clientX - startX;
      },
      { passive: true }
    );

    track.addEventListener("touchend", () => {
      if (Math.abs(deltaX) > 48) {
        goTo(index + (deltaX < 0 ? 1 : -1));
      }
      startX = 0;
      deltaX = 0;
    });

    update();
  };

  document.querySelectorAll("[data-carousel]").forEach(setupCarousel);
})();
