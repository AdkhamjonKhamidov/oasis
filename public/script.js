const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const greeting = document.querySelector("[data-greeting]");
const featuredCarousel = document.querySelector("[data-featured-carousel]");
const deferredImages = document.querySelectorAll("[data-deferred-src]");

function closeNavigation() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  navigation.classList.remove("is-open");
}

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  navigation.classList.toggle("is-open", !isExpanded);
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeNavigation);
});

document.querySelector("#current-year").textContent = new Date().getFullYear();

if (deferredImages.length) {
  const loadImage = (image) => {
    image.src = image.dataset.deferredSrc;
    image.removeAttribute("data-deferred-src");
  };

  if ("IntersectionObserver" in window) {
    const imageObserver = new window.IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          loadImage(entry.target);
        }
      });
    }, { rootMargin: "300px 0px" });

    deferredImages.forEach((image) => imageObserver.observe(image));
  } else {
    deferredImages.forEach(loadImage);
  }
}

if (greeting) {
  let greetingTimer;
  const setGreeting = (message) => {
    window.clearTimeout(greetingTimer);
    greeting.classList.add("is-changing");
    greetingTimer = window.setTimeout(() => {
      greeting.textContent = message;
      greeting.classList.remove("is-changing");
    }, 150);
  };

  document.querySelectorAll("[data-welcome-trigger]").forEach((trigger) => {
    trigger.addEventListener("mouseenter", () => {
      setGreeting("Welcome!");
    });
    trigger.addEventListener("mouseleave", () => {
      setGreeting("Xush kelibsiz!");
    });
    trigger.addEventListener("focus", () => {
      setGreeting("Welcome!");
    });
    trigger.addEventListener("blur", () => {
      setGreeting("Xush kelibsiz!");
    });
  });
}

if (featuredCarousel) {
  const slides = Array.from(featuredCarousel.querySelectorAll("[data-dish-slide]"));
  const paginationButtons = Array.from(featuredCarousel.querySelectorAll("[data-carousel-to]"));
  const previousButton = featuredCarousel.querySelector("[data-carousel-prev]");
  const nextButton = featuredCarousel.querySelector("[data-carousel-next]");
  let activeIndex = 0;

  const showSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.hidden = slideIndex !== activeIndex;
    });
    paginationButtons.forEach((button, buttonIndex) => {
      button.setAttribute("aria-pressed", String(buttonIndex === activeIndex));
    });
  };

  previousButton.addEventListener("click", () => showSlide(activeIndex - 1));
  nextButton.addEventListener("click", () => showSlide(activeIndex + 1));
  paginationButtons.forEach((button, index) => {
    button.addEventListener("click", () => showSlide(index));
  });
}
