
document.addEventListener("DOMContentLoaded", function () {
  const cartButton = document.querySelector(".cart-button");
  const closeButton = document.querySelector(".close");
  const checkoutButton = document.getElementById("checkout-button");
  const cartCount = document.getElementById("cart-count");
  modal = document.getElementById("cartModal");

  function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    if (cartCount) {
      cartCount.textContent = cartItems.length;
    }
  }

  if (cartButton) {
    cartButton.addEventListener("click", displayCartModal);
  }

  if (closeButton) {
    closeButton.addEventListener("click", closeModal);
  }

  // if (checkoutButton) {
  //   checkoutButton.addEventListener("click", function () {
  //     alert("Pesanan Anda diproses!");
  //   });
  if (checkoutButton) {
  checkoutButton.addEventListener("click", function () {
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

  updateCartCount(); // Initial cart count update
});

// -------- Modal Functions --------
function displayCartModal() {
  const totalPriceElement = document.getElementById("total-price");
  const cartItemsData = JSON.parse(localStorage.getItem("cartItems")) || [];
  const cartItemsContainer = document.getElementById("cartItemsContainer");
  let totalPriceAllItems = 0;

  cartItemsContainer.innerHTML = ""; // Clear previous items

  cartItemsData.forEach((item, index) => {
    const itemContainer = document.createElement("div");
    itemContainer.classList.add("item-container");

    // Image section
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("item-image");
    const itemImage = document.createElement("img");
    itemImage.src = item.image;
    imageContainer.appendChild(itemImage);

    // Details section
    const detailsContainer = document.createElement("div");
    detailsContainer.classList.add("item-details");
    const itemText = document.createElement("div");
    itemText.classList.add("item");
    const itemName = document.createElement("h5");
    itemName.textContent = item.name;
    const itemDescription = document.createElement("div");
    itemDescription.classList.add("item-description");

    if (item.size && item.size !== "undefined" && item.size !== "-") {
      const size = document.createElement("p");
      size.textContent = "Berat : " + item.size;
      itemDescription.appendChild(size);
    }
    if (item.type && item.type !== "undefined" && item.type !== "-") {
      const type = document.createElement("p");
      type.textContent = "Ice : " + item.type;
      itemDescription.appendChild(type);
    }
    if (item.sugar && item.sugar !== "undefined" && item.sugar !== "-") {
      const sugar = document.createElement("p");
      sugar.textContent = "Sugar : " + item.sugar;
      itemDescription.appendChild(sugar);
    }

    const itemPrice = document.createElement("p");
    itemPrice.textContent = item.price;
    itemPrice.classList.add(`item-price-${index}`);
    itemPrice.setAttribute("value", item.originalPrice);

    itemText.appendChild(itemName);
    itemText.appendChild(itemDescription);
    itemText.appendChild(itemPrice);
    detailsContainer.appendChild(imageContainer);
    detailsContainer.appendChild(itemText);

    // Quantity & Delete section
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    const quantity = document.createElement("div");
    quantity.classList.add("item-quantity");

    const minusButton = document.createElement("div");
    minusButton.classList.add("minus");
    minusButton.innerHTML = '<i class="fas fa-minus"></i>';
    minusButton.onclick = () => decreaseValue();

    const inputField = document.createElement("div");
    inputField.classList.add("value");
    const inputElement = document.createElement("input");
    inputElement.id = `product-amount-${index}`;
    inputElement.value = item.quantity || 1;
    inputField.appendChild(inputElement);

    const plusButton = document.createElement("div");
    plusButton.classList.add("plus");
    plusButton.innerHTML = '<i class="fas fa-plus"></i>';
    plusButton.onclick = () => increaseValue();

    function decreaseValue() {
      let currentValue = parseInt(inputElement.value);
      if (currentValue > 1) {
        inputElement.value = --currentValue;
        item.quantity = currentValue;
        updatePrice(currentValue);
      }
    }

    function increaseValue() {
      let currentValue = parseInt(inputElement.value);
      inputElement.value = ++currentValue;
      item.quantity = currentValue;
      updatePrice(currentValue);
    }

    function updatePrice(quantity) {
      const priceElement = document.querySelector(`.item-price-${index}`);
      const price = parseInt(priceElement.getAttribute("value"));
      const totalPrice = price * quantity;
      priceElement.textContent = "Rp " + totalPrice.toLocaleString("id-ID");
      cartItemsData[index].quantity = quantity;
      cartItemsData[index].price = "Rp " + totalPrice.toLocaleString("id-ID");
      localStorage.setItem("cartItems", JSON.stringify(cartItemsData));
      updateTotalPrice();
    }

    function updateTotalPrice() {
      totalPriceAllItems = cartItemsData.reduce((total, item) => {
        return total + item.originalPrice * item.quantity;
      }, 0);
      totalPriceElement.textContent =
        "Rp " + totalPriceAllItems.toLocaleString("id-ID");
    }

    quantity.appendChild(minusButton);
    quantity.appendChild(inputField);
    quantity.appendChild(plusButton);

    const deleteContainer = document.createElement("div");
    deleteContainer.classList.add("delete-container");
    deleteContainer.onclick = () => deleteCartItem(index);
    const deleteButton = document.createElement("i");
    deleteButton.classList.add("fas", "fa-trash");
    deleteContainer.appendChild(deleteButton);

    buttonContainer.appendChild(quantity);
    buttonContainer.appendChild(deleteContainer);

    itemContainer.appendChild(detailsContainer);
    itemContainer.appendChild(buttonContainer);
    cartItemsContainer.appendChild(itemContainer);

    totalPriceAllItems += parseInt(item.originalPrice) * parseInt(item.quantity);
  });

  totalPriceElement.setAttribute("value", totalPriceAllItems);
  totalPriceElement.textContent =
    "Rp " + totalPriceAllItems.toLocaleString("id-ID");

  openModal();
}

function deleteCartItem(index) {
  const cartItemsData = JSON.parse(localStorage.getItem("cartItems")) || [];
  cartItemsData.splice(index, 1);
  localStorage.setItem("cartItems", JSON.stringify(cartItemsData));
  displayCartModal();
}

function closeModal() {
  modal.style.display = "none";
}

function openModal() {
  modal.style.display = "flex";
}

