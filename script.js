/* Logika Interaksi Website iPhone 14 Pro */

// --- 1. Animasi Canvas ---

const canvas  = document.getElementById("product-canvas");
const context = canvas.getContext("2d");
const frameCount = 266; // Total frame

const currentFrame = (index) =>
  `./Images/${(index + 1).toString().padStart(3, "0")}.webp`;

const images = [];

// Preload gambar untuk kelancaran animasi
const preloadImages = () => {
  for (let i = 0; i < frameCount; i++) {
    images[i] = new Image();
    images[i].src = currentFrame(i);
  }
};

// Render frame pertama
const firstFrame = new Image();
firstFrame.src = currentFrame(0);
firstFrame.onload = function () {
  canvas.width  = firstFrame.width;
  canvas.height = firstFrame.height;
  context.drawImage(firstFrame, 0, 0);
};

// Render frame sesuai posisi scroll
const updateImage = (index) => {
  const img = images[index];
  if (img && img.complete) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0);
  }
};


// --- 2. Kontrol Scroll ---

const scrollContainer = document.querySelector(".scroll-container");
const progressBar     = document.getElementById("scroll-progress");
const navbar          = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;

  // Sinkronasi frame
  const maxScroll      = scrollContainer.clientHeight - window.innerHeight;
  const scrollFraction = Math.max(0, Math.min(1, scrollTop / maxScroll));
  const frameIndex     = Math.min(frameCount - 1, Math.floor(scrollFraction * frameCount));
  requestAnimationFrame(() => updateImage(frameIndex));

  // Progress bar
  const docHeight   = document.documentElement.scrollHeight - window.innerHeight;
  const progressPct = (scrollTop / docHeight) * 100;
  progressBar.style.width = progressPct + "%";

  // Efek navbar
  if (scrollTop > 60) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}, { passive: true });

preloadImages();


// --- 3. Animasi Muncul ---

const revealItems = document.querySelectorAll(".reveal-section");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((el) => revealObserver.observe(el));


// --- 4. Interaksi Konfigurator ---

document.addEventListener("DOMContentLoaded", () => {
  const colorBtns    = document.querySelectorAll(".color-btn");
  const storageBtns  = document.querySelectorAll(".storage-btn");
  const variantImg   = document.getElementById("variant-image");
  const colorName    = document.getElementById("color-name");
  const priceIbox    = document.getElementById("price-ibox");
  const price2026    = document.getElementById("price-2026");

  // Efek transisi halus
  const fadeSwap = (el, newContent, isText = true) => {
    el.style.opacity = "0";
    setTimeout(() => {
      if (isText) {
        el.textContent = newContent;
      } else {
        el.src = newContent.src;
        el.alt = newContent.alt;
      }
      el.style.opacity = "1";
    }, 160);
  };

  colorBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      colorBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");

      const newSrc = btn.getAttribute("data-img");
      const color  = btn.getAttribute("data-color");

      variantImg.style.opacity   = "0";
      variantImg.style.transform = "scale(0.94)";
      setTimeout(() => {
        variantImg.src             = newSrc;
        variantImg.alt             = `iPhone 14 Pro ${color}`;
        variantImg.style.opacity   = "1";
        variantImg.style.transform = "scale(1)";
      }, 210);

      colorName.textContent = color;
    });
  });

  storageBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      storageBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");

      const newPriceIbox  = btn.getAttribute("data-price-ibox");
      const newPrice2026  = btn.getAttribute("data-price-2026");

      fadeSwap(priceIbox, newPriceIbox);
      fadeSwap(price2026, newPrice2026);
    });
  });
});
