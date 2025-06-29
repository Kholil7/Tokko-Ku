document.addEventListener("DOMContentLoaded", function () {
  // Function to load navbar HTML
  function loadNavbar() {
    fetch("./src/components/navbar/navbar.html")
      .then((response) => response.text())
      .then((data) => {
        document.getElementById("navbar").innerHTML = data;
        addActiveClass(); // Add active class to current page link
        setupToggleButton(); // Setup toggle button click event
        setupScrollBehavior(); // Setup scroll behavior
      })
      .catch((error) => console.log("Error loading navbar:", error));
  }

  // Function to add active class to current page link
  function addActiveClass() {
    var currentLocation = window.location.href;
    var navLinks = document.querySelectorAll("#navbar a");

    navLinks.forEach(function (link) {
      if (link.href === currentLocation) {
        link.classList.add("active");
      }
    });
  }

  function setupToggleButton() {
    const mobileMenu = document.querySelector("header nav .mobile-menu");
    const menu = document.querySelector("header nav .menu");
    mobileMenu.addEventListener("click", function () {
      menu.classList.toggle("show");
    });
    // Remove class kalau diklik diluar
    document.addEventListener("click", function (event) {
      if (!menu.contains(event.target) && !mobileMenu.contains(event.target)) {
        menu.classList.remove("show");
      }
    });
  }

  function setupScrollBehavior() {
    const header = document.querySelector("header");
    window.onscroll = function () {
      if (document.documentElement.scrollTop >= 200) {
        console.log("test");
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };
  }

  // Load the navbar when the DOM is ready
  loadNavbar();
});

var body = document.querySelector("body");

document.querySelector(".tab").innerHTML = `<p class="all">Semua Menu</p>${[
  ...new Set(
    [...document.querySelectorAll(".category")].map(
      (c) =>
        `<p class="${c.textContent.toLowerCase().replace(" ", "")}">${
          c.textContent
        }</p>`
    )
  ),
].join("")}`;

const products = document.querySelectorAll(".product");

for (var i = 0; i < products.length; i++) {
  var product = products[i];
  var category = product.getElementsByClassName("category")[0];
  var categoryText = category.innerText.toLowerCase().replace(" ", "");
  product.classList.add(categoryText);
}

var tabs = document.querySelectorAll(".tab > p");

tabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    if (!this.classList.contains("active")) {
      var tabClass = this.className;
      tabs.forEach(function (tab) {
        tab.classList.remove("active");
      });
      this.classList.add("active");
      Array.from(products).forEach(function (product) {
        var productClass = product.classList;
        var shouldDisplay =
          tabClass === "all" || productClass.contains(tabClass);

        product.style.display = shouldDisplay ? "block" : "none";
      });
    }
  });
});

// Mengatur tab "All Menu" sebagai tab default yang aktif
tabs[0].classList.add("active");

products.forEach((product) => {
  product.addEventListener("click", () => {
    const clonedContent = product.cloneNode(true);
    const popup = document.querySelector(".popup");
    const ov = document.querySelector(".overlay");
    popup.innerHTML = "";
    popup.appendChild(clonedContent);

    

    generateSizeOptionsFromData(clonedContent);


    popup.classList.add("show");
    ov.classList.add("show");
    body.classList.add("ov");
    fadeIn(document.querySelector(".overlay"));
  });
});

function generateSizeOptionsFromData(container) {
  const wrap = container.querySelector(".product-wrap");
  const sizeContainer = wrap.querySelector(".size");
  const priceElement = wrap.querySelector(".price");

  const priceData = wrap.getAttribute("data-price");

  // Kalau datanya cuma angka (bukan JSON), tidak ada variasi ukuran
  try {
    const hargaPerUkuran = JSON.parse(priceData);

    // Buat <select> ukuran
    let selectHTML = `<span>Berat</span><select class="fixed" onchange="stillValue(); updateHiddenInput('hiddenSizeInput', this.value)">`;

    for (let ukuran in hargaPerUkuran) {
      selectHTML += `<option value="${ukuran}">${ukuran}</option>`;
    }

    selectHTML += `</select><input name="size" type="hidden" id="hiddenSizeInput" value="${Object.keys(hargaPerUkuran)[0]}" />`;

    if (sizeContainer) sizeContainer.innerHTML = selectHTML;

    // Atur ulang harga pertama kali
    const jumlah = parseInt(container.querySelector("#product-amount")?.value || 1);
    updatePrice(jumlah);

  } catch (err) {
    // Tidak ada ukuran → hapus size selector
    if (sizeContainer) sizeContainer.style.display = "none";
  }
}



function closePopup() {
  document.querySelector(".popup").classList.remove("show");
  document.querySelector(".overlay").classList.remove("show");
  fadeOut(document.querySelector(".overlay"));
  body.classList.remove("ov");
}

function appendHTML(selector, html) {
  var elements = document.querySelectorAll(selector);
  elements.forEach(function (element) {
    element.innerHTML += html;
  });
}

function beforeHTML(selector, html) {
  var elements = document.querySelectorAll(selector);
  elements.forEach(function (element) {
    element.insertAdjacentHTML("beforebegin", html);
  });
}

function addToCart() {
  const productName = document.querySelector(".popup h3").textContent;
  const productPrice = document.querySelector(".popup .price").textContent;
  const productQuantity = document.querySelector(
    ".popup #product-amount"
  ).value;
  const productImage = document
    .querySelector(".popup .img img")
    .getAttribute("src");
  const originalPrice = document
    .querySelector(".popup .price")
    .getAttribute("value");
    const sizeInput = document.querySelector(".popup #hiddenSizeInput");
    const size = sizeInput ? sizeInput.value : "-";
    
  // Initialize cartItems as an empty array
  let cartItems = [];

  // Retrieve existing cart items from localStorage
  const existingCartItems = localStorage.getItem("cartItems");

  if (existingCartItems) {
    // Parse the existing cart items from localStorage
    cartItems = JSON.parse(existingCartItems);
  }

  // Add the new product data to the existing cart items
  const newProductData = {
    name: productName,
    price: productPrice,
    image: productImage,
    quantity: productQuantity,
    originalPrice: originalPrice,
    size: size,
    
  };
  cartItems.push(newProductData);

  // Save the updated cart items back to localStorage
  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  // Optionally, you can provide feedback to the user
  alert("Produk Ditambahkan Ke Keranjang");
  closePopup();
  location.reload();
}

beforeHTML(
  ".price",
  `
  <div class="amount">
      <span>Jumlah</span>
      <div class="number">
        <div class="minus" onclick="decreaseValue()"><i class="fas fa-minus"></i></div>
        <div class="value"><input id="product-amount" value="1"/></div>
        <div class="plus" onclick="increaseValue()"><i class="fas fa-plus"></i></div>
      </div>
  </div>
`
);

appendHTML(
  ".product-wrap",
  `
  <div onclick="addToCart()" class="add"><span>Keranjang</span><i class="fas fa-cart-plus"></i></div>
  <div class="close-pop" onclick="closePopup()"><i class="fas fa-times"></i></div>
`
);

// appendHTML(
//   ".product-wrap .size",
//   `
//   <span>Berat</span>
//   <select class="fixed" onchange="stillValue(); updateHiddenInput('hiddenSizeInput', this.value)">
//       <option selected=''>500g</option>
//       <option>1Kg</option>
//       <option>25Kg</option>
//   </select>
//   <input name="size" type="hidden" id="hiddenSizeInput" value="Regular" />
// `
// );





Array.from(document.getElementsByClassName("price")).forEach((e) =>
  e.setAttribute(
    "value",
    e.textContent.replace("Rp", "").replace(/\s/g, "").replace(/\./g, "")
  )
);

function decreaseValue() {
  const inputElement = document.getElementById("product-amount");
  let currentValue = parseInt(inputElement.value);
  if (currentValue > 1) {
    currentValue--;
    inputElement.value = currentValue;
    updatePrice(currentValue);
  }
}

function increaseValue() {
  const inputElement = document.getElementById("product-amount");
  let currentValue = parseInt(inputElement.value);
  currentValue++;
  inputElement.value = currentValue;
  updatePrice(currentValue);
}

function stillValue() {
  const inputElement = document.getElementById("product-amount");
  let currentValue = parseInt(inputElement.value);
  inputElement.value = currentValue;
  updatePrice(currentValue);
}

// Function to update the hidden input based on the selected option
function updateHiddenInput(inputId, value) {
  const hiddenInput = document.getElementById(inputId);
  hiddenInput.value = value;
  console.log(`Hidden input ${inputId} updated to:`, hiddenInput.value);
}

//function updatePrice(quantity) {
  // const priceElement = document.querySelector(".price");
  // const price = parseInt(priceElement.getAttribute("value"));
  // const sizeSelect = document.querySelector(".popup .size select");
  // if (sizeSelect){
  //   const calculateTotalPrice = () => {
  //     let multiplier = 1;
  //     if (sizeSelect && sizeSelect.value === "Medium") {
  //       multiplier = 1.25;
  //     } else if (sizeSelect && sizeSelect.value === "Large") {
  //       multiplier = 1.5;
  //     }
  //     const totalPrice = (price * multiplier) * quantity ;
  //     priceElement.textContent = "Rp " + totalPrice.toLocaleString("id-ID");
  //     priceElement.setAttribute("priceValue", totalPrice);
      
  //   };
  //   sizeSelect.addEventListener("change", calculateTotalPrice);
  //   calculateTotalPrice();
  // } else {
  //   const totalPrice = price * quantity ;
  //   priceElement.textContent = "Rp " + totalPrice.toLocaleString("id-ID");
  //   priceElement.setAttribute("priceValue", totalPrice);
    // priceElement.setAttribute("value", totalPrice);
   
    // function updatePrice(quantity) {
    //   const sizeSelect = document.querySelector(".popup .size select");
    //   const priceElement = document.querySelector(".popup .price");
    //   const selectedSize = sizeSelect ? sizeSelect.value : "500g";
    
    //   const productWrap = document.querySelector(".popup .product-wrap");
    //   const priceDataJSON = productWrap.getAttribute("data-price");
    
    //   let hargaPerBerat = {};
    //   try {
    //     hargaPerBerat = JSON.parse(priceDataJSON);
    //   } catch (e) {
    //     console.error("Data harga tidak valid:", e);
    //   }
    
    //   const hargaSatuan = hargaPerBerat[selectedSize] || 0;
    //   const total = hargaSatuan * quantity;
    
    //   priceElement.textContent = "Rp " + total.toLocaleString("id-ID");
    //   priceElement.setAttribute("priceValue", total);
    //   priceElement.setAttribute("value", hargaSatuan);
    // }
    
    function updatePrice(quantity) {
      const sizeSelect = document.querySelector(".popup .size select");
      const priceElement = document.querySelector(".popup .price");
      const productWrap = document.querySelector(".popup .product-wrap");
    
      if (!priceElement || !productWrap) return;
    
      const priceDataJSON = productWrap.getAttribute("data-price");
    
      // fallback jika harga bukan JSON
      if (!priceDataJSON || !sizeSelect) {
        const hargaSatuan = parseInt(priceElement.getAttribute("value") || "0");
        const total = hargaSatuan * quantity;
        priceElement.textContent = "Rp " + total.toLocaleString("id-ID");
        priceElement.setAttribute("priceValue", total);
        return;
      }
    
      let hargaPerUkuran = {};
      try {
        hargaPerUkuran = JSON.parse(priceDataJSON);
      } catch (e) {
        console.error("Data harga tidak valid:", e);
        return;
      }
    
      const selectedSize = sizeSelect.value;
      const hargaSatuan = hargaPerUkuran[selectedSize] || 0;
      const total = hargaSatuan * quantity;
    
      priceElement.textContent = "Rp " + total.toLocaleString("id-ID");
      priceElement.setAttribute("priceValue", total);
      priceElement.setAttribute("value", hargaSatuan);
    }
    
    

function fadeOut(el) {
  el.style.opacity = 1;
  (function fade() {
    if ((el.style.opacity -= 0.08) < 0) {
      el.style.display = "none";
    } else {
      requestAnimationFrame(fade);
    }
  })();
}

function fadeIn(el, display) {
  el.style.opacity = 0;
  el.style.display = display || "block";
  (function fade() {
    var val = parseFloat(el.style.opacity);
    if (!((val += 0.08) > 1)) {
      el.style.opacity = val;
      requestAnimationFrame(fade);
    }
  })();
}
