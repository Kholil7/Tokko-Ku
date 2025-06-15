document.addEventListener("DOMContentLoaded", function () {
  // function setupToggleButton() {
  //   const mobileMenu = document.querySelector("header nav .mobile-menu");
  //   const menu = document.querySelector("header nav .menu");
  //   mobileMenu.addEventListener("click", function () {
  //     menu.classList.toggle("show");
  //   });
  //   // Remove class kalau diklik diluar
  //   document.addEventListener("click", function (event) {
  //     if (!menu.contains(event.target) && !mobileMenu.contains(event.target)) {
  //       menu.classList.remove("show");
  //     }
  //   });
  // }
});

// Hero button smooth scroll to #recent
document.addEventListener("DOMContentLoaded", function () {
  // Tombol "Bayar"
  const tombolBayar = document.querySelector(".option.bayar");
  if (tombolBayar) {
    tombolBayar.addEventListener("click", function () {
    alert("Pesanan Anda diproses!");

    // Hapus data keranjang dari localStorage
    localStorage.removeItem("cartItems");

    // Kosongkan tampilan keranjang
    const cartItemsContainer = document.getElementById("cartItemsContainer");
    const totalPriceElement = document.getElementById("total-price");
    const cartCount = document.getElementById("cart-count");

    if (cartItemsContainer) cartItemsContainer.innerHTML = "<p>Keranjang kosong.</p>";
    if (totalPriceElement) totalPriceElement.textContent = "Rp 0";
    if (cartCount) cartCount.textContent = "0";

    closeModal(); // Tutup modal
  });
}

  // Hero button scroll
  const heroButton = document.querySelector("#hero .text .button");
  if (heroButton) {
    heroButton.addEventListener("click", function () {
      const targetElement = document.querySelector("#best");
      if (targetElement) {
        const targetOffset = targetElement.offsetTop - 60;
        window.scrollTo({
          top: targetOffset,
          behavior: "smooth",
        });
      }
    });
  }
});


// Testimonial Slider

var testimonials = document.querySelectorAll(".testimonial");
var navigationContainer = document.querySelector(".navigation");
var currentIndex = 0;
function showTestimonial(index) {
  var navigationButtons = navigationContainer.querySelectorAll("button");
  navigationButtons.forEach(function (button) {
    button.classList.remove("active");
  });
  navigationButtons[index].classList.add("active");
  var testimonialContainer = document.querySelector(".slider-container");
  testimonialContainer.style.transform = "translateX(-" + index * 100 + "%)";
}
function nextTestimonial() {
  currentIndex++;
  if (currentIndex >= testimonials.length) {
    currentIndex = 0;
  }
  showTestimonial(currentIndex);
}
var autoplayInterval = setInterval(nextTestimonial, 3000);
testimonials.forEach(function (testimonial, index) {
  var button = document.createElement("button");
  button.addEventListener("click", function () {
    clearInterval(autoplayInterval);
    currentIndex = index;
    showTestimonial(index);
  });
  navigationContainer.appendChild(button);
});
showTestimonial(currentIndex);

fetch("./menu.html", { mode: "no-cors" })
  .then((response) => response.text())
  .then((data) => {
    const menuWrapElement = new DOMParser()
      .parseFromString(data, "text/html")
      .querySelector(".menu-wrap");
    const bestProductElements = Array.from(
      menuWrapElement.querySelectorAll(".product.best")
    );
    const indexContainer = document.getElementById("index-container");
    bestProductElements.forEach((product) => {
      indexContainer.appendChild(product);
    });
  });

setTimeout(() => {
  const scriptElement = document.createElement("script");
  scriptElement.src = "./src/js/menu.js";
  document.body.appendChild(scriptElement);
}, 5000);
