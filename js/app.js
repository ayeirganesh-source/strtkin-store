// Function to resolve exact public Supabase Storage URL
function getPublicImageUrl(productOrPath) {
  let imagePath = '';

  // 1. Extract image path from product object or string
  if (typeof productOrPath === 'object' && productOrPath !== null) {
    if (Array.isArray(productOrPath.images) && productOrPath.images.length > 0) {
      imagePath = productOrPath.images[0];
    } else if (productOrPath.image_url) {
      imagePath = productOrPath.image_url;
    }
  } else if (typeof productOrPath === 'string') {
    imagePath = productOrPath;
  }

  // 2. Clean up JSON array string formats like '["https://..."]' or '["filename.png"]'
  if (typeof imagePath === 'string' && imagePath.startsWith('[')) {
    try {
      const parsed = JSON.parse(imagePath);
      if (Array.isArray(parsed) && parsed.length > 0) {
        imagePath = parsed[0];
      }
    } catch (e) {
      imagePath = imagePath.replace(/[\[\]"']/g, '');
    }
  }

  // 3. If empty, return dark placeholder SVG
  if (!imagePath || imagePath.includes('unsplash.com')) {
    return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><rect width="100%" height="100%" fill="%23121212"/><text x="50%" y="50%" fill="%23444444" font-family="sans-serif" font-size="14" text-anchor="middle">No Image Uploaded</text></svg>';
  }

  // 4. If already a full http/https URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // 5. Try Supabase JS client storage method
  if (typeof db !== 'undefined' && db.storage) {
    const { data } = db.storage.from('product-images').getPublicUrl(imagePath);
    if (data && data.publicUrl) {
      return data.publicUrl;
    }
  }

  // 6. Direct fallback URL builder using client configuration URL
  if (typeof SUPABASE_URL !== 'undefined') {
    return `${SUPABASE_URL}/storage/v1/object/public/product-images/${imagePath}`;
  }

  return imagePath;
}

// Cart State Management
function getCart() {
  const cart = localStorage.getItem('strtkin_cart');
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem('strtkin_cart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById('cart-count');
  if (badge) {
    badge.textContent = totalItems;
  }
}

function addToCart(product) {
  let cart = getCart();
  const existingIndex = cart.findIndex(item => item.id === product.id && item.size === product.size);
  
  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  
  saveCart(cart);
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
});