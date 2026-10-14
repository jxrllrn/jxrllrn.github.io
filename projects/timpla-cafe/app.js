const products = [
  { id: "timpla-latte", name: "Timpla Latte", category: "coffee", price: 145, emoji: "☕", image: "assets/products/timpla-latte.png", color: "#ead7bd", tag: "House favorite", description: "Espresso, muscovado, and creamy milk." },
  { id: "ube-cloud", name: "Ube Cloud Latte", category: "coffee", price: 165, emoji: "🧋", image: "assets/products/ube-cloud.png", color: "#d8c4e4", tag: "Bestseller", description: "Espresso, ube cream, and coconut cloud." },
  { id: "barako-brown", name: "Barako Brown Sugar", category: "coffee", price: 155, emoji: "🥤", image: "assets/products/barako-brown.png", color: "#d7b28b", tag: "Local pick", description: "Bold Batangas barako with brown sugar milk." },
  { id: "calamansi-cold", name: "Calamansi Cold Brew", category: "coffee", price: 160, emoji: "🍋", image: "assets/products/calamansi-cold.png", color: "#dfe1a9", tag: "Bright & bold", description: "Slow-steeped coffee with fresh citrus sparkle." },
  { id: "tablea-mocha", name: "Tablea Mocha", category: "coffee", price: 175, emoji: "🍫", image: "assets/products/tablea-mocha.png", color: "#c9a78f", tag: "Rich", description: "Espresso and deep local tablea chocolate." },
  { id: "muscovado-latte", name: "Salted Muscovado Latte", category: "coffee", price: 165, emoji: "🧊", image: "assets/products/muscovado-latte.png", color: "#e4c6a2", tag: "Sweet-salty", description: "Iced latte with muscovado and sea-salt cream." },
  { id: "pandan-matcha", name: "Pandan Coco Matcha", category: "non-coffee", price: 170, emoji: "🍵", image: "assets/products/pandan-matcha.png", color: "#c5d3ab", tag: "No espresso", description: "Matcha, pandan, and smooth coconut milk." },
  { id: "mango-sago", name: "Mango Sago Fizz", category: "non-coffee", price: 150, emoji: "🥭", image: "assets/products/mango-sago.png", color: "#f4d58c", tag: "Refreshing", description: "Mango, mini sago, soda, and a squeeze of lime." },
  { id: "ensaymada", name: "Classic Ensaymada", category: "bites", price: 95, emoji: "🥐", image: "assets/products/ensaymada.png", color: "#f2d29f", tag: "Fresh daily", description: "Soft buttery bread with cheese and sugar." },
  { id: "ube-pandesal", name: "Ube Cheese Pandesal", category: "bites", price: 85, emoji: "🍞", color: "#d7b4d8", tag: "Snack", description: "Warm pandesal with creamy ube-cheese filling.", image: "assets/products/ube-pandesal.png" },
  { id: "bibingka-waffle", name: "Bibingka Waffle", category: "bites", price: 145, emoji: "🧇", color: "#ddc18c", tag: "All-day", description: "Coconut waffle, salted egg butter, and muscovado.", image: "assets/products/bibingka-waffle.png" },
  { id: "taho-affogato", name: "Taho Affogato", category: "bites", price: 150, emoji: "🍨", color: "#e8d8bd", tag: "Timpla twist", description: "Silken taho, arnibal, sago, and espresso.", image: "assets/products/taho-affogato.png" }
];

const peso = value => `₱${value.toLocaleString("en-PH")}`;
function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("timpla-cart") || "{}");
    return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
  } catch {
    return {};
  }
}

let cart = loadCart();
let activeFilter = "all";
let searchTerm = "";
let toastTimer;

const menuGrid = document.querySelector("#menu-grid");
const cartItems = document.querySelector("#cart-items");

function productVisual(item, compact = false) {
  if (item.image) {
    return `<img class="product-photo" src="${item.image}" alt="${item.name}" ${compact ? "" : 'loading="lazy"'}>`;
  }
  return `<span class="product-placeholder" aria-label="Product photography pending"><b>${item.emoji}</b><small>Studio image queued</small></span>`;
}

function renderMenu() {
  const visible = products.filter(item => {
    const matchesCategory = activeFilter === "all" || item.category === activeFilter;
    const searchableText = `${item.name} ${item.description} ${item.tag}`.toLowerCase();
    return matchesCategory && searchableText.includes(searchTerm);
  });
  menuGrid.innerHTML = visible.length ? visible.map((item, index) => `
    <article class="menu-card reveal" style="--reveal-delay:${Math.min(index * 65, 390)}ms">
      <div class="menu-art" style="--card-color:${item.color}">${productVisual(item)}</div>
      <div>
        <span class="tag">${item.tag}</span>
        <h2>${item.name}</h2>
        <p>${item.description}</p>
        <div class="card-bottom">
          <span class="price">${peso(item.price)}</span>
          <button class="add-button" data-add="${item.id}" aria-label="Add ${item.name} to cart">+</button>
        </div>
      </div>
    </article>`).join("") : `<p class="menu-empty">No menu items match your search. Try another flavor or category.</p>`;
  observeReveals(menuGrid);
}

function saveCart() {
  localStorage.setItem("timpla-cart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  const product = products.find(item => item.id === id);
  showToast(`${product.name} added to your order`);
}

function updateCartCount() {
  const count = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  document.querySelectorAll("[data-cart-count]").forEach(node => node.textContent = count);
}

function renderCart() {
  const entries = Object.entries(cart).filter(([, quantity]) => quantity > 0);
  if (!entries.length) {
    cartItems.innerHTML = `<div class="empty-cart"><div><span>☕</span><h2>Your tray is empty</h2><p>Pick a drink or bite to get started.</p><a class="button button-primary" href="#menu">Browse the menu</a></div></div>`;
  } else {
    cartItems.innerHTML = entries.map(([id, quantity]) => {
      const item = products.find(product => product.id === id);
      return `<article class="cart-item">
        <div class="menu-art compact" style="--card-color:${item.color}">${productVisual(item, true)}</div>
        <div><h3>${item.name}</h3><p>${peso(item.price)} each</p></div>
        <div class="quantity">
          <button data-change="${id}" data-delta="-1" aria-label="Remove one ${item.name}">−</button>
          <strong aria-label="Quantity">${quantity}</strong>
          <button data-change="${id}" data-delta="1" aria-label="Add one ${item.name}">+</button>
        </div>
      </article>`;
    }).join("");
  }

  const subtotal = entries.reduce((sum, [id, quantity]) => sum + products.find(item => item.id === id).price * quantity, 0);
  const fee = subtotal ? 15 : 0;
  document.querySelector("#subtotal").textContent = peso(subtotal);
  document.querySelector("#service-fee").textContent = peso(fee);
  document.querySelector("#total").textContent = peso(subtotal + fee);
  document.querySelector("#checkout-button").disabled = !subtotal;
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

const revealObserver = "IntersectionObserver" in window ? new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px" }) : null;

function observeReveals(root = document) {
  root.querySelectorAll(".reveal:not(.in-view)").forEach(element => {
    if (revealObserver) revealObserver.observe(element);
    else element.classList.add("in-view");
  });
}

function route() {
  const requested = location.hash.replace("#", "") || "home";
  const routeName = ["home", "menu", "cart", "contact"].includes(requested) ? requested : "home";
  document.querySelectorAll(".screen").forEach(screen => screen.classList.toggle("active", screen.dataset.screen === routeName));
  document.querySelectorAll("[data-nav]").forEach(link => {
    const active = link.dataset.nav === routeName;
    link.classList.toggle("active", active);
    active ? link.setAttribute("aria-current", "page") : link.removeAttribute("aria-current");
  });
  window.scrollTo({ top: 0, behavior: "auto" });
  if (routeName === "cart") renderCart();
}

document.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) addToCart(addButton.dataset.add);

  const quickAdd = event.target.closest(".quick-add");
  if (quickAdd) addToCart(quickAdd.dataset.productId);

  const changeButton = event.target.closest("[data-change]");
  if (changeButton) {
    const { change: id, delta } = changeButton.dataset;
    cart[id] = Math.max(0, (cart[id] || 0) + Number(delta));
    if (!cart[id]) delete cart[id];
    saveCart();
  }

  const filter = event.target.closest("[data-filter]");
  if (filter) {
    activeFilter = filter.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach(button => {
      const isActive = button === filter;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", isActive);
    });
    renderMenu();
  }
});

document.querySelector("#menu-search").addEventListener("input", event => {
  searchTerm = event.currentTarget.value.trim().toLowerCase();
  renderMenu();
});

function createOrderSummary() {
  const entries = Object.entries(cart).filter(([, quantity]) => quantity > 0);
  const subtotal = entries.reduce((sum, [id, quantity]) => sum + products.find(item => item.id === id).price * quantity, 0);
  const fee = subtotal ? 15 : 0;
  const lines = entries.map(([id, quantity]) => {
    const item = products.find(product => product.id === id);
    return `${quantity}× ${item.name} — ${peso(item.price * quantity)}`;
  });
  return [`Timpla Café — Demo Order`, "", ...lines, "", `Subtotal: ${peso(subtotal)}`, `Service fee: ${peso(fee)}`, `Total: ${peso(subtotal + fee)}`].join("\n");
}

document.querySelector("#checkout-button").addEventListener("click", () => {
  document.querySelector("#order-text").textContent = createOrderSummary();
  document.querySelector("#order-dialog").showModal();
});

document.querySelector("#copy-order").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(document.querySelector("#order-text").textContent);
    showToast("Order summary copied");
  } catch {
    showToast("Copy unavailable—select the summary manually");
  }
});

document.querySelector("#contact-form").addEventListener("submit", event => {
  event.preventDefault();
  event.currentTarget.reset();
  showToast("Demo validated—no message was sent");
});
window.addEventListener("hashchange", route);

renderMenu();
renderCart();
updateCartCount();
route();
document.querySelectorAll(".home-section, .contact-hero, .contact-grid").forEach(element => element.classList.add("reveal"));
observeReveals();
