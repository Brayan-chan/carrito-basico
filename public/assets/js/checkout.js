import AuthService from "./auth-service.js"
import CartService from "./cart-service.js"

// Función para manejar el proceso de checkout
export async function initCheckout() {
  // Verificar si el usuario está autenticado
  if (!AuthService.isAuthenticated()) {
    // Guardar la URL actual para redirigir después del login
    sessionStorage.setItem("redirectAfterLogin", window.location.href)

    // Redirigir al usuario a la página de login
    window.location.href = "/views/login.html?redirect=checkout"
    return false
  }

  // Verificar si el usuario tiene una dirección de envío
  const hasShippingAddress = await checkUserHasAddress()
  if (!hasShippingAddress) {
    // Redirigir al usuario a la página de perfil para agregar una dirección
    window.location.href = "/views/profile.html?section=addresses&redirect=checkout"
    return false
  }

  // Si llegamos aquí, el usuario está autenticado y tiene una dirección
  return true
}

// Función para verificar si el usuario tiene una dirección de envío
async function checkUserHasAddress() {
  if (!AuthService.currentUser) return false

  try {
    const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js")
    const { db } = await import("./firebase-config.js")

    const userDoc = await getDoc(doc(db, "usuarios", AuthService.currentUser.uid))
    if (userDoc.exists()) {
      const userData = userDoc.data()
      return userData.direcciones && userData.direcciones.length > 0
    }
    return false
  } catch (error) {
    console.error("Error al verificar dirección del usuario:", error)
    return false
  }
}

// Función para cargar los datos del carrito en la página de checkout
export async function loadCartData() {
  const cartItems = CartService.getCart()
  const cartTotal = CartService.getCartTotal()

  // Actualizar el DOM con los datos del carrito
  const cartItemsContainer = document.getElementById("cart-items") || document.getElementById("order-items")
  const cartTotalElement = document.getElementById("cart-total") || document.getElementById("checkout-total")

  if (cartItemsContainer) {
    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = `
                <div class="text-center py-8">
                    <p class="text-gray-500">Tu carrito está vacío</p>
                    <a href="/" class="text-primary hover:underline mt-2 inline-block">Continuar comprando</a>
                </div>
            `
    } else {
      cartItemsContainer.innerHTML = cartItems
        .map(
          (item) => `
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center">
                        <div class="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center mr-3">
                            ${
                              item.imagen
                                ? `<img src="${item.imagen}" alt="${item.nombre}" class="w-full h-full object-cover rounded-md">`
                                : `<i class="fas fa-box text-gray-400 text-2xl"></i>`
                            }
                        </div>
                        <div>
                            <h3 class="font-medium">${item.nombre}</h3>
                            <p class="text-sm text-gray-500">Cantidad: ${item.cantidad}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="font-bold">${formatCurrency(item.precio * item.cantidad)}</p>
                        <p class="text-sm text-gray-500">${formatCurrency(item.precio)} c/u</p>
                    </div>
                </div>
            `,
        )
        .join("")
    }
  }

  if (cartTotalElement) {
    cartTotalElement.textContent = formatCurrency(cartTotal)
  }

  // Actualizar el botón de checkout
  const checkoutButton = document.getElementById("checkout-btn")
  if (checkoutButton) {
    if (cartItems.length === 0) {
      checkoutButton.disabled = true
      checkoutButton.classList.add("opacity-50", "cursor-not-allowed")
    } else {
      checkoutButton.disabled = false
      checkoutButton.classList.remove("opacity-50", "cursor-not-allowed")
    }
  }

  // Actualizar subtotal en checkout
  const checkoutSubtotal = document.getElementById("checkout-subtotal")
  if (checkoutSubtotal) {
    checkoutSubtotal.textContent = formatCurrency(cartTotal)
  }
}

// Función para formatear moneda
export function formatCurrency(amount) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount)
}

// Función para procesar el pago
export async function processPayment(orderData) {
  try {
    // Hacer la petición al backend
    const response = await fetch("/api/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })

    const data = await response.json()

    if (data.success) {
      console.log("Redirigiendo a Mercado Pago:", data.init_point)
      // Redirigir al usuario a la página de pago de Mercado Pago
      window.location.href = data.init_point
      return { success: true }
    } else {
      return {
        success: false,
        error: data.error || "Error al procesar el pago",
        details: data.details || "Por favor, intenta de nuevo más tarde",
      }
    }
  } catch (error) {
    console.error("Error de conexión:", error)
    return {
      success: false,
      error: "Error de conexión",
      details:
        "No se pudo conectar con el servidor de pagos. Por favor, verifica tu conexión a internet e intenta de nuevo.",
    }
  }
}