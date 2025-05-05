import AuthService from "./auth-service.js"
import CartService from "./cart-service.js"

// Función para actualizar la UI según el estado de autenticación
export function updateAuthUI() {
  const authLinks = document.querySelector("#auth-links")
  if (!authLinks) return

  console.log("Actualizando UI de autenticación:", AuthService.isAuthenticated(), AuthService.currentUser)

  if (AuthService.isAuthenticated() && AuthService.currentUser) {
    // Usuario autenticado
    const userName = AuthService.currentUser.displayName || "Usuario"
    const isAdmin = AuthService.isAdmin()

    console.log("Usuario autenticado:", userName, "Es admin:", isAdmin)

    authLinks.innerHTML = `
            <div class="relative group">
                <button class="flex items-center px-1 md:px-2 py-1 mx-1 text-dark hover:text-primary">
                    <i class="far fa-user mr-1"></i>
                    <span class="hidden md:inline text-sm">${userName}</span>
                    <i class="fas fa-chevron-down ml-1 text-xs"></i>
                </button>
                <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20 hidden group-hover:block">
                    <a href="/views/profile.html" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <i class="far fa-user-circle mr-2"></i>Mi perfil
                    </a>
                    <a href="/views/orders.html" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <i class="fas fa-box mr-2"></i>Mis pedidos
                    </a>
                    ${
                      isAdmin
                        ? `
                    <div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                    <a href="/views/admin/dashboard.html" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <i class="fas fa-tachometer-alt mr-2"></i>Panel de administración
                    </a>
                    `
                        : ""
                    }
                    <div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                    <a href="#" id="logout-button" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <i class="fas fa-sign-out-alt mr-2"></i>Cerrar sesión
                    </a>
                </div>
            </div>
            
            <a href="/views/cart.html" class="px-1 md:px-2 py-1 mx-1 text-dark hover:text-primary relative">
                <i class="fas fa-shopping-cart"></i>
                <span class="hidden md:inline ml-1 text-sm">Carrito</span>
                <span class="absolute -top-2 -right-1 bg-primary text-white rounded-full text-xs w-5 h-5 flex items-center justify-center cart-counter">0</span>
            </a>
        `

    // Agregar evento de cierre de sesión
    const logoutButton = document.getElementById("logout-button")
    if (logoutButton) {
      logoutButton.addEventListener("click", async (e) => {
        e.preventDefault()
        await AuthService.logout()
        window.location.href = "/"
      })
    }
  } else {
    // Usuario no autenticado
    console.log("Usuario no autenticado, mostrando enlaces de login/registro")

    authLinks.innerHTML = `
            <a href="/views/login.html" class="px-1 md:px-2 py-1 mx-1 text-dark hover:text-primary">
                <i class="far fa-user"></i>
                <span class="hidden md:inline ml-1 text-sm">Iniciar sesión</span>
            </a>
            <a href="/views/register.html" class="hidden md:inline-block bg-primary text-white font-medium px-6 py-2 rounded-md hover:bg-gray-100 hover:text-primary transition">
                Registrarse
            </a>
            
            <a href="/views/cart.html" class="px-1 md:px-2 py-1 mx-1 text-dark hover:text-primary relative">
                <i class="fas fa-shopping-cart"></i>
                <span class="hidden md:inline ml-1 text-sm">Carrito</span>
                <span class="absolute -top-2 -right-1 bg-primary text-white rounded-full text-xs w-5 h-5 flex items-center justify-center cart-counter">0</span>
            </a>
        `
  }
}

// Función para actualizar el contador del carrito
export function updateCartCounter() {
  const cartCounters = document.querySelectorAll(".cart-counter")
  const itemCount = CartService.getCartItemCount()

  cartCounters.forEach((counter) => {
    counter.textContent = itemCount

    if (itemCount > 0) {
      counter.classList.remove("hidden")
    } else {
      counter.classList.add("hidden")
    }
  })
}

// Inicializar la UI
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM cargado, inicializando UI de autenticación")

  // Verificar autenticación con un pequeño retraso para dar tiempo a Firebase
  setTimeout(() => {
    console.log("Verificando estado de autenticación inicial:", AuthService.isAuthenticated())
    updateAuthUI()
  }, 1000)

  // Actualizar UI cuando cambie el estado de autenticación
  window.addEventListener("authStateChanged", (event) => {
    console.log("Evento authStateChanged recibido:", event.detail)
    updateAuthUI()
  })

  // Actualizar contador del carrito cuando cambie
  window.addEventListener("cartChanged", updateCartCounter)

  // Actualizar contador del carrito inicial
  updateCartCounter()
})