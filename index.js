let cart = [];

fetch("data.json")
    .then(response => response.json())
    .then(data => {
        const productList = document.querySelector(".product-list");
        data.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");
            productCard.innerHTML = `
            <img src="${product.image.desktop}" alt="${product.name}" class="product-list-img">
            <button class="add-to-cart-btn"> <img src="./assets/images/icon-add-to-cart.svg" alt="Add to Cart"> Add to Cart</button>
            <p class="product-category">${product.category}</p>
            <h5>${product.name}</h5>
            <h6>$${product.price.toLocaleString()}</h6>
            `;

            productList.appendChild(productCard);
        });
    })
    .catch(error => console.error("Error fetching data:", error));

document.addEventListener("click", function (e) {
    if (e.target.closest(".add-to-cart-btn")) {
        const card = e.target.closest(".product-card");
        const name = card.querySelector("h5").textContent;
        const price = card.querySelector("h6").textContent.replace("$", "").replace(/,/g, "");
        addToCart(name, price, card);
    }

});

function addToCart(name, price, card) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: parseFloat(price),
            quantity: 1
        });
    }

    updateButton(card, name);
    renderCart();
}

function updateButton(card, name) {
    const item = cart.find(item => item.name === name);

    const buttonContainer = card.querySelector(".add-to-cart-btn");
    buttonContainer.outerHTML = `
        <div class="quantity-control">
            <button class="decrease">-</button>
            <span>${item.quantity}</span>
            <button class="increase">+</button>
        </div>
    `;
}

function renderCart() {
    const emptyCart = document.querySelector(".empty-cart");
    const cartItemsContainer = document.querySelector(".cart-items");
    const cartTotal = document.querySelector(".cart-total");
    const cartCount = document.querySelector(".cart-count");
    const totalPrice = document.querySelector(".total-price");
    const ending = document.querySelector(".footer");
    const checkoutBtn = document.querySelector(".checkout-btn");

    if (!emptyCart || !cartItemsContainer || !cartTotal || !ending) return;

    if (cart.length === 0) {
        emptyCart.style.display = "block";
        cartItemsContainer.style.display = "none";
        cartTotal.style.display = "none";
        cartCount.textContent = 0;
        totalPrice.textContent = "$0";
        ending.style.display = "none";
        checkoutBtn.style.display = "none";
        return;
    }

    emptyCart.style.display = "none";
    cartItemsContainer.style.display = "flex";
    cartTotal.style.display = "flex";
    ending.style.display = "flex";
    checkoutBtn.style.display = "block";

    cartItemsContainer.innerHTML = "";

    let total = 0;
    let totalQuantity = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        totalQuantity += item.quantity;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
            <h4>${item.name} </h4>
            <p> <span>x${item.quantity}</span> $${item.price}  $${item.price * item.quantity} 
          <button class="remove-btn"> <img src="./assets/images/icon-remove-item.svg" alt="Remove Item" class="remove-item-btn"> </button>
            </p>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    cartCount.textContent = totalQuantity;
    totalPrice.textContent = `$${total}`;
}



document.addEventListener("click", function (e) {

    if (e.target.classList.contains("increase")) {
        // increase quantity
        const card = e.target.closest(".product-card");
        const name = card.querySelector("h5").textContent;
        const item = cart.find(item => item.name === name);

        if (item) {
            item.quantity += 1;
            const span = e.target.closest(".quantity-control").querySelector("span");
            span.textContent = item.quantity;
            renderCart();
        }
    }

    if (e.target.classList.contains("decrease")) {
        // decrease quantity
        const card = e.target.closest(".product-card");
        const name = card.querySelector("h5").textContent;
        const item = cart.find(item => item.name === name);

        if (item) {
            item.quantity -= 1;

            if (item.quantity <= 0) {
                // Remove from cart and restore add-to-cart button
                cart = cart.filter(p => p.name !== name);
                const quantityControl = e.target.closest(".quantity-control");
                quantityControl.outerHTML = `<button class="add-to-cart-btn"> <img src="./assets/images/icon-add-to-cart.svg" alt="Add to Cart"> Add to Cart</button>`;
            } else {
                const span = e.target.closest(".quantity-control").querySelector("span");
                span.textContent = item.quantity;
            }
            renderCart();
        }

        document.addEventListener("click", function (e) {

            if (e.target.classList.contains("increase")) {

            }

            if (e.target.classList.contains("decrease")) {

            }


            if (e.target.closest(".remove-btn")) {
                const card = e.target.closest(".cart-item");
                const name = card.querySelector("h4").textContent;

                cart = cart.filter(item => item.name !== name);

                const productCards = document.querySelectorAll(".product-card");
                productCards.forEach(p => {
                    if (p.querySelector("h5").textContent === name) {
                        const control = p.querySelector(".quantity-control");
                        if (control) {
                            control.outerHTML = `<button class="add-to-cart-btn">
                        <img src="./assets/images/icon-add-to-cart.svg"> Add to Cart
                    </button>`;
                        }
                    }
                });

                renderCart();
            }

        });
    }
    document.querySelector(".checkout-btn").addEventListener("click", function () {
        const orderModal = document.querySelector(".order");

        orderModal.style.display = "block";

        renderOrderSummary();
    });


    function renderOrderSummary() {
        const container = document.querySelector(".order-items");
        const totalDisplay = document.querySelector(".order-total");

        container.innerHTML = "";

        let total = 0;

        cart.forEach(item => {
            total += item.price * item.quantity;

            const div = document.createElement("div");
            div.innerHTML = `
            <img src="${product.image.desktop}" alt="${product.name}" class="order-item-img">
            <p>${item.name} x${item.quantity} - $${item.price * item.quantity}</p>
        `;

            container.appendChild(div);
        });

        totalDisplay.textContent = `Total: $${total}`;
    }

    document.querySelector(".new-order-btn").addEventListener("click", function () {
        cart = [];

        document.querySelector(".order").style.display = "none";

        // reset all product buttons
        document.querySelectorAll(".quantity-control").forEach(control => {
            control.outerHTML = `<button class="add-to-cart-btn">
            <img src="./assets/images/icon-add-to-cart.svg"> Add to Cart
        </button>`;
        });

        renderCart();
    });

});
