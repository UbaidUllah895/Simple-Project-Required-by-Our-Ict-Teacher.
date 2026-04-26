// QuickBite – script.js (Vanilla JavaScript)

// ── Menu Data (Array of Objects) ──
const menuItems = [
  { id:1, name:"da poto batwa",  emoji:"🍔", price:300, desc:"Juicy beef patty with fresh veggies & sauce" },
  { id:2, name:"chrg wala paratha", emoji:"🍕", price:800, desc:"Crispy crust, tomato sauce & loaded toppings" },
  { id:3, name:"alogano chips",    emoji:"🍟", price:200, desc:"Golden, salted & perfectly crispy every time" },
  { id:4, name:"tor dew",      emoji:"🥤", price:150, desc:"Ice-cold refreshing beverage of your choice"  },
  { id:5, name:"taw kary chrg",    emoji:"🌯", price:350, desc:"Grilled chicken, veggies & garlic mayo wrap"  },
  { id:6, name:"garegari",       emoji:"🍦", price:180, desc:"Creamy soft-serve: vanilla, choc or swirl"   },
];

// ── Cart State ──
let cart = [];

// ── Page Navigation ──
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('nav ul a').forEach(a => a.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  document.getElementById('nav-' + name).classList.add('active');
  if (name === 'menu') renderMenu();
  if (name === 'cart') renderCart();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Render Menu Cards ──
function renderMenu() {
  const grid = document.getElementById('menu-grid');
  grid.innerHTML = '';
  menuItems.forEach(item => {
    const inCart = cart.find(c => c.id === item.id);
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML =
      `<div class="card-img">${item.emoji}</div>
       <div class="card-body">
         <div class="card-name">${item.name}</div>
         <div class="card-desc">${item.desc}</div>
         <div class="card-footer">
           <div class="price"><sup>Rs.</sup>${item.price}</div>
           <button class="btn-add ${inCart ? 'added' : ''}" id="btn-${item.id}" onclick="addToCart(${item.id})">
             ${inCart ? '✓ Added' : '+ Add to Cart'}
           </button>
         </div>
       </div>`;
    grid.appendChild(card);
  });
}

// ── Add Item to Cart ──
function addToCart(id) {
  const item = menuItems.find(m => m.id === id);
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  updateCount();
  toast(`${item.emoji} ${item.name} added to cart!`);
  const btn = document.getElementById('btn-' + id);
  if (btn) { btn.textContent = '✓ Added'; btn.classList.add('added'); }
}

// ── Update Cart Badge ──
function updateCount() {
  document.getElementById('cart-count').textContent = cart.reduce((s, c) => s + c.qty, 0);
}

// ── Change Item Quantity ──
function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeItem(id); return; }
  updateCount();
  renderCart();
}

// ── Remove Item from Cart ──
function removeItem(id) {
  cart = cart.filter(c => c.id !== id);
  updateCount();
  renderCart();
  renderMenu();
  toast('Item removed.');
}

// ── Render Cart Page ──
function renderCart() {
  const box = document.getElementById('cart-content');
  if (cart.length === 0) {
    box.innerHTML = `<div class="empty"><span>🛒</span><h3>Cart is empty!</h3><p>Add some items from the menu.</p><br><button class="btn-order" onclick="showPage('menu')">Browse Menu</button></div>`;
    return;
  }
  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const hasDiscount = subtotal > 1000;
  const discount = hasDiscount ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discount;

  let rows = '';
  cart.forEach(item => {
    rows += `<li class="cart-item">
      <div class="ci-left">
        <span class="ci-emoji">${item.emoji}</span>
        <div><div class="ci-name">${item.name}</div><div class="ci-price">Rs. ${item.price} each</div></div>
      </div>
      <div class="ci-right">
        <div class="qty-box">
          <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id},+1)">+</button>
        </div>
        <div class="ci-total">Rs. ${item.price * item.qty}</div>
        <button class="btn-rm" onclick="removeItem(${item.id})">✕</button>
      </div>
    </li>`;
  });

  const discRow = hasDiscount
    ? `<div class="s-row"><span>Discount <span class="dtag">10% OFF</span></span><span style="color:#22c55e">− Rs. ${discount}</span></div>`
    : `<div class="s-row" style="color:rgba(255,255,255,.45);font-size:.82rem"><span>💡 Spend Rs. ${1000 - subtotal} more for 10% off!</span></div>`;

  box.innerHTML = `
    <ul class="cart-list">${rows}</ul>
    <div class="summary">
      <div class="s-row"><span>Subtotal</span><span>Rs. ${subtotal}</span></div>
      ${discRow}
      <div class="s-row total"><span>Total</span><span>Rs. ${total}</span></div>
      <button class="btn-order" onclick="placeOrder()">🚀 Place Order · Rs. ${total}</button>
    </div>`;
}

// ── Place Order ──
function placeOrder() {
  cart = [];
  updateCount();
  renderCart();
  renderMenu();
  toast('🎉 Order placed! Preparing your food...');
}

// ── Contact Form Validation ──
function submitForm() {
  const name = document.getElementById('c-name').value.trim();
  const msg  = document.getElementById('c-msg').value.trim();
  const en   = document.getElementById('err-name');
  const em   = document.getElementById('err-msg');
  let ok = true;
  en.classList.toggle('show', !name); if (!name) ok = false;
  em.classList.toggle('show', !msg);  if (!msg)  ok = false;
  if (!ok) return;
  document.getElementById('c-name').value = '';
  document.getElementById('c-email').value = '';
  document.getElementById('c-msg').value = '';
  toast("📨 Message sent! We'll get back to you soon.");
}

// ── Toast Notification ──
let timer;
function toast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  clearTimeout(timer);
  timer = setTimeout(() => t.classList.remove('show'), 3000);
}

// ── Init ──
renderMenu();