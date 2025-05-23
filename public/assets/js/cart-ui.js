import CartService from "./cart-service.js"
import AuthService from "./auth-service.js"
import { formatCurrency } from "./checkout.js"

// Clase para manejar la UI del carrito
const CartUI = {
  // Inicializar la UI del carrito
  init() {
    console.log("Inicializando CartUI")

    // Verificar si estamos en la página del carrito y cargar los items
    if (window.location.pathname.includes("/views/cart.html")) {
      console.log("Estamos en la página del carrito, cargando items")
      // Asegurarse de que la página se haya cargado completamente
      if (document.readyState === "complete") {
        this.loadCartItems()
      } else {
        window.addEventListener("load", () => {
          this.loadCartItems()
        })
      }
    }

    // Inicializar el modal del carrito si existe
    this.initCartModal()

    // Escuchar cambios en el carrito y actualizar indicador
    window.addEventListener("cartChanged", () => {
      console.log("Evento cartChanged recibido")
      this.updateCartIndicator()
    })

    // Actualizar indicador al cargar la página
    this.updateCartIndicator()
  },

  // Actualizar el indicador del carrito en el header
  updateCartIndicator() {
    console.log("Actualizando indicador del carrito")
    const cartCount = CartService.getCartItemCount()
    console.log("Cantidad de productos en el carrito:", cartCount)

    // Seleccionar todos los indicadores del carrito
    const cartIndicators = document.querySelectorAll(".cart-count")

    cartIndicators.forEach((indicator) => {
      if (cartCount > 0) {
        indicator.textContent = cartCount
        indicator.classList.remove("hidden")
      } else {
        indicator.classList.add("hidden")
      }
    })
  },

  // Cargar los items del carrito en la página de carrito
  async loadCartItems() {
    console.log("Cargando items del carrito en la página")
    const cartItemsContainer = document.getElementById("cart-items")
    const checkoutBtn = document.getElementById("checkout-btn")
    const cartSubtotal = document.getElementById("cart-subtotal")
    const cartTotal = document.getElementById("cart-total")

    if (!cartItemsContainer) {
      console.error("Contenedor de items del carrito no encontrado")
      return
    }

    const cart = CartService.getCart()
    console.log("Carrito obtenido para mostrar:", cart)

    if (cart.length === 0) {
      // Carrito vacío
      cartItemsContainer.innerHTML = `
        <div class="text-center py-8">
          <div class="mb-4">
            <i class="fas fa-shopping-cart text-gray-300 text-5xl"></i>
          </div>
          <p class="text-gray-500 mb-4">Tu carrito está vacío</p>
          <a href="/" class="text-primary hover:underline">Continuar comprando</a>
        </div>
      `

      // Deshabilitar botón de checkout
      if (checkoutBtn) {
        checkoutBtn.disabled = true
        checkoutBtn.classList.add("opacity-50", "cursor-not-allowed")
      }

      // Mostrar totales en cero
      if (cartSubtotal) cartSubtotal.textContent = formatCurrency(0)
      if (cartTotal) cartTotal.textContent = formatCurrency(0)
    } else {
      // Renderizar items del carrito
      let cartItemsHTML = ""

      for (const item of cart) {
        cartItemsHTML += `
          <div class="flex items-center py-4 border-b" data-product-id="${item.productoId}">
            <div class="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
              ${
                item.imagen
                  ? `<img src="${item.imagen}" alt="${item.nombre}" class="w-full h-full object-cover">`
                  : `<div class="w-full h-full flex items-center justify-center bg-gray-200">
                      <i class="fas fa-box text-gray-400"></i>
                     </div>`
              }
            </div>
            
            <div class="ml-4 flex-grow">
              <h3 class="font-medium">${item.nombre}</h3>
              <div class="flex justify-between mt-2">
                <div class="text-primary font-medium">${formatCurrency(item.precio)}</div>
                
                <div class="flex items-center">
                  <button class="decrease-quantity w-8 h-8 flex items-center justify-center bg-gray-200 rounded-l-md hover:bg-gray-300">
                    <i class="fas fa-minus text-sm"></i>
                  </button>
                  
                  <input type="number" value="${item.cantidad}" min="1" max="99" 
                    class="quantity-input w-12 h-8 text-center border-y border-gray-300 focus:outline-none">
                  
                  <button class="increase-quantity w-8 h-8 flex items-center justify-center bg-gray-200 rounded-r-md hover:bg-gray-300">
                    <i class="fas fa-plus text-sm"></i>
                  </button>
                </div>
              </div>
              
              <div class="flex justify-between items-center mt-2">
                <span class="text-xs text-green-600">Envío gratis</span>
                <button class="remove-item text-red-500 text-sm hover:underline">
                  <i class="fas fa-trash-alt mr-1"></i> Eliminar
                </button>
              </div>
            </div>
          </div>
        `
      }

      cartItemsContainer.innerHTML = cartItemsHTML

      // Habilitar botón de checkout
      if (checkoutBtn) {
        checkoutBtn.disabled = false
        checkoutBtn.classList.remove("opacity-50", "cursor-not-allowed")
      }

      // Actualizar totales
      if (cartSubtotal) cartSubtotal.textContent = formatCurrency(CartService.getCartTotal())
      if (cartTotal) cartTotal.textContent = formatCurrency(CartService.getCartTotal())

      // Añadir event listeners a los botones
      setTimeout(() => {
        this.addCartItemEventListeners()
      }, 100)
    }
  },

  // Añadir event listeners a los botones de los items del carrito
  addCartItemEventListeners() {
    console.log("Añadiendo event listeners a los items del carrito")

    // Botones para disminuir cantidad
    document.querySelectorAll(".decrease-quantity").forEach((button) => {
      button.addEventListener("click", async (e) => {
        const item = e.target.closest("[data-product-id]")
        const productId = item.dataset.productId
        const quantityInput = item.querySelector(".quantity-input")
        let currentQuantity = Number.parseInt(quantityInput.value)

        if (currentQuantity > 1) {
          currentQuantity--
          quantityInput.value = currentQuantity
          await CartService.updateQuantity(productId, currentQuantity)
          this.updateItemSubtotal()
        }
      })
    })

    // Botones para aumentar cantidad
    document.querySelectorAll(".increase-quantity").forEach((button) => {
      button.addEventListener("click", async (e) => {
        const item = e.target.closest("[data-product-id]")
        const productId = item.dataset.productId
        const quantityInput = item.querySelector(".quantity-input")
        let currentQuantity = Number.parseInt(quantityInput.value)

        currentQuantity++
        quantityInput.value = currentQuantity
        await CartService.updateQuantity(productId, currentQuantity)
        this.updateItemSubtotal()
      })
    })

    // Inputs de cantidad
    document.querySelectorAll(".quantity-input").forEach((input) => {
      input.addEventListener("change", async (e) => {
        const item = e.target.closest("[data-product-id]")
        const productId = item.dataset.productId
        let quantity = Number.parseInt(e.target.value)

        // Validar cantidad
        if (isNaN(quantity) || quantity < 1) {
          quantity = 1
          e.target.value = 1
        } else if (quantity > 99) {
          quantity = 99
          e.target.value = 99
        }

        await CartService.updateQuantity(productId, quantity)
        this.updateItemSubtotal()
      })
    })

    // Botones para eliminar items
    document.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", async (e) => {
        const item = e.target.closest("[data-product-id]")
        const productId = item.dataset.productId

        // Confirmar eliminación
        if (confirm("¿Estás seguro de que deseas eliminar este producto del carrito?")) {
          await CartService.removeFromCart(productId)
          // Recargar items del carrito
          this.loadCartItems()
        }
      })
    })
  },

  // Actualizar el subtotal
  updateItemSubtotal() {
    const cartSubtotal = document.getElementById("cart-subtotal")
    const cartTotal = document.getElementById("cart-total")

    if (cartSubtotal) cartSubtotal.textContent = formatCurrency(CartService.getCartTotal())
    if (cartTotal) cartTotal.textContent = formatCurrency(CartService.getCartTotal())
  },

  // Inicializar el modal del carrito
  initCartModal() {
    const cartModal = document.getElementById("cartModal")
    const cartButtons = document.querySelectorAll(".cart-button")
    const closeCartButton = document.getElementById("closeCart")

    if (cartModal && cartButtons.length > 0) {
      // Abrir modal al hacer clic en el botón del carrito
      cartButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
          // Si estamos en la página del carrito, no hacer nada
          if (window.location.pathname.includes("/views/cart.html")) {
            return
          }

          e.preventDefault()
          this.openCartModal()
        })
      })

      // Cerrar modal al hacer clic en el botón de cerrar
      if (closeCartButton) {
        closeCartButton.addEventListener("click", () => {
          cartModal.classList.add("hidden")
        })
      }

      // Cerrar modal al hacer clic fuera del contenido
      cartModal.addEventListener("click", (e) => {
        if (e.target === cartModal) {
          cartModal.classList.add("hidden")
        }
      })
    }
  },

  // Abrir el modal del carrito
  async openCartModal() {
    const cartModal = document.getElementById("cartModal")
    if (!cartModal) return

    // Mostrar modal
    cartModal.classList.remove("hidden")

    // Cargar contenido del carrito en el modal
    await this.loadCartModalContent()
  },

  // Cargar el contenido del carrito en el modal
  async loadCartModalContent() {
    const cartItemsContainer = document.querySelector("#cartModal .divide-y")
    if (!cartItemsContainer) return

    const cart = CartService.getCart()

    if (cart.length === 0) {
      // Carrito vacío
      cartItemsContainer.innerHTML = `
        <div class="p-6 text-center">
          <div class="mb-4">
            <i class="fas fa-shopping-cart text-gray-300 text-4xl"></i>
          </div>
          <p class="text-gray-500 mb-4">Tu carrito está vacío</p>
          <a href="/" class="text-primary hover:underline">Continuar comprando</a>
        </div>
      `

      // Ocultar sección de totales
      const totalsSection = document.querySelector("#cartModal .p-4.border-t")
      if (totalsSection) totalsSection.classList.add("hidden")
    } else {
      // Renderizar items del carrito
      let cartItemsHTML = ""

      for (const item of cart) {
        cartItemsHTML += `
          <div id="item-${item.productoId}" class="p-4 flex" data-product-id="${item.productoId}">
            <div class="w-20 h-20 bg-gray-200 flex-shrink-0 rounded overflow-hidden">
              ${
                item.imagen
                  ? `<img src="${item.imagen}" alt="${item.nombre}" class="w-full h-full object-cover">`
                  : `<div class="w-full h-full flex items-center justify-center">
                      <i class="fas fa-box text-gray-400"></i>
                     </div>`
              }
            </div>
            <div class="ml-4 flex-grow">
              <h3 class="font-medium text-sm text-gray-800 dark:text-white">${item.nombre}</h3>
              <div class="flex justify-between mt-1">
                <span class="text-primary font-medium">${formatCurrency(item.precio)}</span>
                <div class="flex items-center">
                  <button class="modal-decrease-quantity w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300">-</button>
                  <span class="mx-2 text-sm">${item.cantidad}</span>
                  <button class="modal-increase-quantity w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300">+</button>
                </div>
              </div>
              <div class="mt-2 flex justify-between items-center">
                <span class="text-xs text-green-600">Envío gratis</span>
                <button class="modal-remove-item text-xs text-red-500">Eliminar</button>
              </div>
            </div>
          </div>
        `
      }

      cartItemsContainer.innerHTML = cartItemsHTML

      // Mostrar sección de totales
      const totalsSection = document.querySelector("#cartModal .p-4.border-t")
      if (totalsSection) {
        totalsSection.classList.remove("hidden")

        // Actualizar totales
        const subtotalElement = totalsSection.querySelector(".mb-2:first-child span:last-child")
        const totalElement = totalsSection.querySelector(".text-lg.font-bold span:last-child")

        if (subtotalElement) subtotalElement.textContent = formatCurrency(CartService.getCartTotal())
        if (totalElement) totalElement.textContent = formatCurrency(CartService.getCartTotal())
      }

      // Añadir event listeners a los botones
      this.addCartModalEventListeners()
    }
  },

  // Añadir event listeners a los botones del modal del carrito
  addCartModalEventListeners() {
    // Botones para disminuir cantidad
    document.querySelectorAll(".modal-decrease-quantity").forEach((button) => {
      button.addEventListener("click", async (e) => {
        const item = e.target.closest("[data-product-id]")
        const productId = item.dataset.productId
        const quantitySpan = item.querySelector(".flex.items-center span")
        let currentQuantity = Number.parseInt(quantitySpan.textContent)

        if (currentQuantity > 1) {
          currentQuantity--
          quantitySpan.textContent = currentQuantity
          await CartService.updateQuantity(productId, currentQuantity)
          this.updateCartModalTotals()
        }
      })
    })

    // Botones para aumentar cantidad
    document.querySelectorAll(".modal-increase-quantity").forEach((button) => {
      button.addEventListener("click", async (e) => {
        const item = e.target.closest("[data-product-id]")
        const productId = item.dataset.productId
        const quantitySpan = item.querySelector(".flex.items-center span")
        let currentQuantity = Number.parseInt(quantitySpan.textContent)

        currentQuantity++
        quantitySpan.textContent = currentQuantity
        await CartService.updateQuantity(productId, currentQuantity)
        this.updateCartModalTotals()
      })
    })

    // Botones para eliminar items
    document.querySelectorAll(".modal-remove-item").forEach((button) => {
      button.addEventListener("click", async (e) => {
        const item = e.target.closest("[data-product-id]")
        const productId = item.dataset.productId

        await CartService.removeFromCart(productId)

        // Recargar contenido del modal
        this.loadCartModalContent()
      })
    })

    // Botón de proceder al pago
    const checkoutButton = document.querySelector("#cartModal a.block.bg-primary")
    if (checkoutButton) {
      checkoutButton.addEventListener("click", async (e) => {
        e.preventDefault()

        // Verificar autenticación
        if (!AuthService.isAuthenticated()) {
          // Guardar URL de redirección
          sessionStorage.setItem("redirectAfterLogin", "/views/cart.html")

          // Redirigir a login
          window.location.href = "/views/login.html"
          return
        }

        // Redirigir a checkout
        window.location.href = "/views/checkout.html"
      })
    }
  },

  // Actualizar los totales en el modal del carrito
  updateCartModalTotals() {
    const totalsSection = document.querySelector("#cartModal .p-4.border-t")
    if (!totalsSection) return

    const subtotalElement = totalsSection.querySelector(".mb-2:first-child span:last-child")
    const totalElement = totalsSection.querySelector(".text-lg.font-bold span:last-child")

    if (subtotalElement) subtotalElement.textContent = formatCurrency(CartService.getCartTotal())
    if (totalElement) totalElement.textContent = formatCurrency(CartService.getCartTotal())
  },
}

// Inicializar la UI del carrito cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM cargado, inicializando CartUI")
  CartUI.init()
})

// Si el DOM ya está cargado, inicializar inmediatamente
if (document.readyState === "complete") {
  console.log("DOM ya estaba cargado, inicializando CartUI inmediatamente")
  CartUI.init()
}

export default CartUI
