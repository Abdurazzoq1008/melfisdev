let cart = JSON.parse(localStorage.getItem('melfis_cart') || '[]');
let currentDeliveryType = 'delivery';
const DELIVERY_COST = 25000;
const FREE_DELIVERY_THRESHOLD = 500000;

document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
  setupEventListeners();
});

function setupEventListeners() {
  // Category filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.category;
      filterProducts(cat);
    });
  });

  // Delivery toggle in checkout
  const toggleBtns = document.querySelectorAll('.toggle-option');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentDeliveryType = btn.dataset.type;
      
      const addrGroup = document.getElementById('delivery-address-group');
      if (currentDeliveryType === 'pickup') {
        addrGroup.style.display = 'none';
      } else {
        addrGroup.style.display = 'block';
      }
      updateCartSummary();
    });
  });

  // Checkout form submit
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);
  }
}

function filterProducts(category) {
  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

function toggleCartDrawer(open) {
  const overlay = document.getElementById('cart-overlay');
  const drawer = document.getElementById('cart-drawer');
  if (open) {
    overlay.classList.add('open');
    drawer.classList.add('open');
    showCartView();
  } else {
    overlay.classList.remove('open');
    drawer.classList.remove('open');
  }
}

function addToCart(id, name, price, image) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, name, price, image, quantity: 1 });
  }
  saveCart();
  updateCartUI();
  showToast(`"${name}" savatchaga qo'shildi! 🌸`);
}

function updateQuantity(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
    saveCart();
    updateCartUI();
  }
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('melfis_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const badge = document.getElementById('cart-count');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = totalItems;
  badge.style.display = totalItems > 0 ? 'flex' : 'none';

  renderCartItems();
  updateCartSummary();
}

function renderCartItems() {
  const container = document.getElementById('cart-items-container');
  const emptyView = document.getElementById('empty-cart');
  const cartContent = document.getElementById('cart-content');

  if (cart.length === 0) {
    container.innerHTML = '';
    emptyView.style.display = 'block';
    cartContent.style.display = 'none';
    return;
  }

  emptyView.style.display = 'none';
  cartContent.style.display = 'block';

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">${(item.price * item.quantity).toLocaleString()} so'm</div>
      </div>
      <div class="qty-control">
        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
        <span style="font-size: 13px; font-weight: 600;">${item.quantity}</span>
        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
      </div>
      <button class="cart-delete-btn" onclick="removeFromCart(${item.id})" title="O'chirish">✕</button>
    </div>
  `).join('');
}

function updateCartSummary() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let deliveryCost = currentDeliveryType === 'pickup' ? 0 : (subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_COST);
  
  if (subtotal === 0) deliveryCost = 0;

  const total = subtotal + deliveryCost;

  const subtotalEl = document.getElementById('summary-subtotal');
  const deliveryEl = document.getElementById('summary-delivery');
  const totalEl = document.getElementById('summary-total');

  if (subtotalEl) subtotalEl.textContent = `${subtotal.toLocaleString()} so'm`;
  if (deliveryEl) {
    if (currentDeliveryType === 'pickup') {
      deliveryEl.textContent = "Bepul (Olib ketish)";
    } else if (deliveryCost === 0 && subtotal > 0) {
      deliveryEl.textContent = "Bepul (Aksiya)";
    } else {
      deliveryEl.textContent = `${deliveryCost.toLocaleString()} so'm`;
    }
  }
  if (totalEl) totalEl.textContent = `${total.toLocaleString()} so'm`;
}

function showCheckoutView() {
  if (cart.length === 0) return;
  document.getElementById('cart-items-section').style.display = 'none';
  document.getElementById('checkout-form-section').style.display = 'block';
  document.getElementById('drawer-title-text').textContent = 'Buyurtmani rasmiylashtirish';
}

function showCartView() {
  document.getElementById('cart-items-section').style.display = 'block';
  document.getElementById('checkout-form-section').style.display = 'none';
  document.getElementById('drawer-title-text').textContent = 'Savatcha';
}

async function handleCheckoutSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');

  const customer = {
    name: form.name.value,
    phone: form.phone.value,
    address: currentDeliveryType === 'delivery' ? form.address.value : 'Do\'kondan olib ketish',
    date: form.date.value || 'Iloji boricha tezroq',
    time: form.time.value || 'Eng yaqin vaqtda',
    card_note: form.card_note.value,
    comment: form.comment.value
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryCost = currentDeliveryType === 'pickup' ? 0 : (subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_COST);
  const total = subtotal + deliveryCost;

  const orderPayload = {
    customer,
    delivery_type: currentDeliveryType,
    items: cart,
    subtotal: subtotal,
    delivery_cost: deliveryCost,
    total_price: total
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "Yuborilmoqda...";

  try {
    const res = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });

    const result = await res.json();
    if (result.success) {
      cart = [];
      saveCart();
      updateCartUI();
      form.reset();
      
      showOrderSuccess(result.message);
    } else {
      alert("Xatolik: " + result.message);
    }
  } catch (err) {
    alert("Buyurtma yuborishda tarmoq xatosi!");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Buyurtmani tasdiqlash";
  }
}

function showOrderSuccess(message) {
  const body = document.getElementById('checkout-form-section');
  body.innerHTML = `
    <div style="text-align: center; padding: 40px 10px;">
      <div style="font-size: 54px; margin-bottom: 16px;">🎉</div>
      <h3 style="font-family: var(--font-serif); font-size: 22px; color: var(--primary); margin-bottom: 12px;">Tashakkur!</h3>
      <p style="color: var(--gray-dark); margin-bottom: 24px; font-size: 14px;">${message}</p>
      <button class="btn-primary" onclick="toggleCartDrawer(false); location.reload();" style="width: 100%;">Do'konga qaytish</button>
    </div>
  `;
}

function showToast(text) {
  const toast = document.getElementById('toast');
  toast.textContent = text;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

