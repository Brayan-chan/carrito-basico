// Importar servicios necesarios
import CartService from "./cart-service.js"
import AuthService from "./auth-service.js"

// Función para formatear moneda
export function formatCurrency(amount) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount)
}

// Función para esperar a que la autenticación esté inicializada
async function waitForAuthInitialized() {
  // Si la autenticación ya está inicializada, retornar inmediatamente
  if (AuthService.authInitialized) {
    return Promise.resolve()
  }

  // Si no, esperar hasta que se inicialice
  return new Promise((resolve) => {
    const checkAuth = () => {
      if (AuthService.authInitialized) {
        resolve()
      } else {
        setTimeout(checkAuth, 100)
      }
    }
    checkAuth()
  })
}

// Función para inicializar el proceso de checkout
export async function initCheckout() {
  console.log("Inicializando proceso de checkout")

  // Esperar a que la autenticación esté inicializada
  await waitForAuthInitialized()

  // Verificar si el usuario está autenticado
  if (!AuthService.isAuthenticated()) {
    console.log("Usuario no autenticado, redirigiendo a login")
    // Guardar la URL actual para redirigir después del login
    sessionStorage.setItem("redirectAfterLogin", window.location.href)
    // Redirigir al usuario a la página de login
    window.location.href = "/views/login.html?redirect=checkout"
    return false
  }

  console.log("Usuario autenticado:", AuthService.currentUser?.uid)

  // Verificar si el usuario tiene una dirección de envío
  const hasShippingAddress = await checkUserHasAddress()
  if (!hasShippingAddress) {
    console.log("Usuario sin dirección de envío, redirigiendo a perfil")
    // Redirigir al usuario a la página de perfil para agregar una dirección
    window.location.href = "/views/profile.html?section=addresses&redirect=checkout"
    return false
  }

  // Si llegamos aquí, el usuario está autenticado y tiene una dirección
  console.log("Usuario puede proceder al checkout")
  return true
}

// Función para verificar si el usuario tiene una dirección de envío
async function checkUserHasAddress() {
  if (!AuthService.currentUser) return false

  try {
    const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js")
    const { db } = await import("./firebase-config.js")

    console.log("Verificando direcciones para usuario:", AuthService.currentUser.uid)
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
  console.log("Cargando datos del carrito para checkout")
  const cartItems = CartService.getCart()
  const cartTotal = CartService.getCartTotal()

  console.log("Items en el carrito:", cartItems)
  console.log("Total del carrito:", cartTotal)

  // Actualizar el DOM con los datos del carrito
  const orderItemsContainer = document.getElementById("order-items")
  const checkoutSubtotal = document.getElementById("checkout-subtotal")
  const checkoutTotal = document.getElementById("checkout-total")
  const checkoutBtn = document.getElementById("checkout-btn")

  if (orderItemsContainer) {
    if (cartItems.length === 0) {
      orderItemsContainer.innerHTML = `
        <div class="text-center py-4">
          <p class="text-gray-500 mb-2">Tu carrito está vacío</p>
          <a href="/" class="text-primary hover:underline">Continuar comprando</a>
        </div>
      `

      // Deshabilitar botón de checkout
      if (checkoutBtn) {
        checkoutBtn.disabled = true
        checkoutBtn.classList.add("opacity-50", "cursor-not-allowed")
      }
    } else {
      let itemsHTML = ""
      for (const item of cartItems) {
        itemsHTML += `
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
        `
      }
      orderItemsContainer.innerHTML = itemsHTML

      // Habilitar botón de checkout
      if (checkoutBtn) {
        checkoutBtn.disabled = false
        checkoutBtn.classList.remove("opacity-50", "cursor-not-allowed")
      }
    }
  }

  if (checkoutSubtotal) {
    checkoutSubtotal.textContent = formatCurrency(cartTotal)
  }

  if (checkoutTotal) {
    checkoutTotal.textContent = formatCurrency(cartTotal)
  }
}

// Función para procesar el pago
export async function processPayment(orderData) {
  console.log("Procesando pago con datos:", orderData)
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
      console.log("Redirigiendo a pasarela de pago:", data.init_point)
      // Redirigir al usuario a la página de pago de Mercado Pago
      window.location.href = data.init_point
      return { success: true }
    } else {
      console.error("Error en respuesta del servidor:", data)
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

// Exportar funciones principales
export default {
  initCheckout,
  loadCartData,
  formatCurrency,
  processPayment,
}