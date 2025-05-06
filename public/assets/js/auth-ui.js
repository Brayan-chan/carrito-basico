import AuthService from "./auth-service.js"
import CartService from "./cart-service.js"

// Función para actualizar la UI de autenticación
export function updateAuthUI() {
  const authLinksContainer = document.getElementById("auth-links")
  if (!authLinksContainer) return

  if (AuthService.isAuthenticated()) {
    // Usuario autenticado
    authLinksContainer.innerHTML = `
      <div class="flex items-center">
        <a href="/views/profile.html" class="text-dark hover:text-primary mr-4 hidden md:block">
          <i class="fas fa-user mr-1"></i>
          <span>${AuthService.currentUser.displayName || "Mi cuenta"}</span>
        </a>
        <a href="/views/cart.html" class="text-dark hover:text-primary mr-4 relative cart-button">
          <i class="fas fa-shopping-cart"></i>
          <span class="cart-count absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center hidden">0</span>
        </a>
        <button id="logout-button" class="text-dark hover:text-primary hidden md:block">
          <i class="fas fa-sign-out-alt mr-1"></i>
          <span>Salir</span>
        </button>
      </div>
    `

    // Añadir evento al botón de logout
    const logoutButton = document.getElementById("logout-button")
    if (logoutButton) {
      logoutButton.addEventListener("click", async () => {
        try {
          await AuthService.logout()
          // Redirigir a la página principal
          window.location.href = "/"
        } catch (error) {
          console.error("Error al cerrar sesión:", error)
        }
      })
    }
  } else {
    // Usuario no autenticado
    authLinksContainer.innerHTML = `
      <div class="flex items-center">
        <a href="/views/login.html" class="text-dark hover:text-primary mr-4">
          <i class="fas fa-sign-in-alt mr-1"></i>
          <span class="hidden md:inline">Ingresar</span>
        </a>
        <a href="/views/register.html" class="text-dark hover:text-primary mr-4 hidden md:block">
          <i class="fas fa-user-plus mr-1"></i>
          <span>Registrarse</span>
        </a>
        <a href="/views/cart.html" class="text-dark hover:text-primary relative cart-button">
          <i class="fas fa-shopping-cart"></i>
          <span class="cart-count absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center hidden">0</span>
        </a>
      </div>
    `
  }

  // Actualizar contador del carrito
  const cartCount = CartService.getCartItemCount()
  const cartCountElements = document.querySelectorAll(".cart-count")
  cartCountElements.forEach((element) => {
    if (cartCount > 0) {
      element.textContent = cartCount
      element.classList.remove("hidden")
    } else {
      element.classList.add("hidden")
    }
  })

  // Inicializar botones del carrito
  const cartButtons = document.querySelectorAll(".cart-button")
  cartButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      // Si estamos en la página del carrito, no hacer nada
      if (window.location.pathname.includes("/views/cart.html")) {
        return
      }

      // Prevenir navegación por defecto
      e.preventDefault()

      // Abrir modal del carrito si existe
      const cartModal = document.getElementById("cartModal")
      if (cartModal) {
        // Importar CartUI dinámicamente
        import("./cart-ui.js").then((module) => {
          const CartUI = module.default
          CartUI.openCartModal()
        })
      } else {
        // Si no hay modal, redirigir a la página del carrito
        window.location.href = "/views/cart.html"
      }
    })
  })
}

// Inicializar la UI de autenticación cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  // Esperar a que AuthService esté inicializado
  if (AuthService.authInitialized) {
    updateAuthUI()
  } else {
    // Escuchar cambios en la autenticación
    window.addEventListener("authStateChanged", updateAuthUI)
  }
})

export default { updateAuthUI }