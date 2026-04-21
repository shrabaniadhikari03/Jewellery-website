document.addEventListener("DOMContentLoaded", () => {
  // Scroll Animations
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.2,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // Optional: only animate once
      }
    });
  }, observerOptions);

  const animateElements = document.querySelectorAll(".scroll-animate");
  animateElements.forEach((el) => observer.observe(el));

  // Testimonial Slider Logic
  const testimonialSlider = document.getElementById("testimonialSlider");
  if (testimonialSlider) {
    const slides = testimonialSlider.querySelectorAll(".testimonial-slide");

    const updateActiveSlide = () => {
      const sliderCenter =
        testimonialSlider.scrollLeft + testimonialSlider.clientWidth / 2;
      let minDistance = Infinity;
      let activeIndex = 0;

      slides.forEach((slide, index) => {
        const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
        const distance = Math.abs(sliderCenter - slideCenter);
        if (distance < minDistance) {
          minDistance = distance;
          activeIndex = index;
        }
      });

      slides.forEach((slide, index) => {
        if (index === activeIndex) {
          slide.classList.add("active");
        } else {
          slide.classList.remove("active");
        }
      });
    };

    // Initialize active slide
    updateActiveSlide();

    // Listen for scroll to update active slide
    let scrollTimeout;
    testimonialSlider.addEventListener("scroll", () => {
      window.requestAnimationFrame(updateActiveSlide);
    });

    window.addEventListener("resize", () => {
      window.requestAnimationFrame(updateActiveSlide);
    });

    // Mouse Drag to Scroll
    let isDown = false;
    let startX;
    let scrollLeft;

    testimonialSlider.addEventListener("mousedown", (e) => {
      isDown = true;
      testimonialSlider.style.scrollSnapType = "none";
      testimonialSlider.style.cursor = "grabbing";
      startX = e.pageX - testimonialSlider.offsetLeft;
      scrollLeft = testimonialSlider.scrollLeft;
    });

    const stopDragging = () => {
      if (!isDown) return;
      isDown = false;
      testimonialSlider.style.cursor = "grab";
      testimonialSlider.style.scrollSnapType = "x mandatory";
      // Trigger a tiny scroll to force snap to apply
      testimonialSlider.scrollBy({ left: 1, behavior: "instant" });
      testimonialSlider.scrollBy({ left: -1, behavior: "instant" });
    };

    testimonialSlider.addEventListener("mouseleave", stopDragging);
    testimonialSlider.addEventListener("mouseup", stopDragging);

    testimonialSlider.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - testimonialSlider.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed multiplier
      testimonialSlider.scrollLeft = scrollLeft - walk;
    });

    // Initial scroll to middle element
    setTimeout(() => {
      if (slides.length > 1) {
        const centerIndex = Math.floor(slides.length / 2);
        const centerSlide = slides[centerIndex];
        const scrollPos =
          centerSlide.offsetLeft -
          testimonialSlider.clientWidth / 2 +
          centerSlide.offsetWidth / 2;
        testimonialSlider.scrollTo({
          left: scrollPos,
          behavior: "smooth",
        });
      }
    }, 300);
  }
});
