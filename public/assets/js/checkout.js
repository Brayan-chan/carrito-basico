// Importar servicios necesarios
import CartService from "./cart-service.js";

// Función para formatear moneda
export function formatCurrency(amount) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount);
}

// Clase para manejar el proceso de checkout
const CheckoutManager = {
  // Inicializar el proceso de checkout
  init() {
    console.log("Inicializando CheckoutManager");
    
    // Cargar datos del carrito
    this.loadCartData();
    
    // Inicializar botones y eventos
    this.initEventListeners();
  },
  
  // Cargar datos del carrito
  async loadCartData() {
    console.log("Cargando datos del carrito");
    
    // Obtener elementos del DOM
    const cartItemsContainer = document.getElementById("checkout-items");
    const subtotalElement = document.getElementById("checkout-subtotal");
    const totalElement = document.getElementById("checkout-total");
    const checkoutBtn = document.getElementById("checkout-btn");
    
    if (!cartItemsContainer) {
      console.log("No se encontró el contenedor de items");
      return;
    }
    
    // Obtener carrito
    const cart = CartService.getCart();
    console.log("Carrito obtenido:", cart);
    
    if (cart.length === 0) {
      // Carrito vacío
      cartItemsContainer.innerHTML = `
        <div class="text-center py-4">
          <p class="text-gray-500 mb-2">Tu carrito está vacío</p>
          <a href="/" class="text-primary hover:underline">Continuar comprando</a>
        </div>
      `;
      
      // Deshabilitar botón de checkout
      if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.classList.add("opacity-50", "cursor-not-allowed");
      }
      
      return;
    }
    
    // Renderizar items del carrito
    let cartItemsHTML = "";
    
    for (const item of cart) {
      cartItemsHTML += `
        <div class="flex items-center py-3 border-b" data-product-id="${item.productoId}">
          <div class="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
            ${
              item.imagen
                ? `<img src="${item.imagen}" alt="${item.nombre}" class="w-full h-full object-cover">`
                : `<div class="w-full h-full flex items-center justify-center bg-gray-200">
                    <i class="fas fa-box text-gray-400"></i>
                   </div>`
            }
          </div>
          
          <div class="ml-4 flex-grow">
            <h3 class="font-medium text-sm">${item.nombre}</h3>
            <div class="flex justify-between mt-1">
              <div class="text-primary font-medium">${formatCurrency(item.precio)}</div>
              <div class="text-sm">Cantidad: ${item.cantidad}</div>
            </div>
          </div>
        </div>
      `;
    }
    
    cartItemsContainer.innerHTML = cartItemsHTML;
    
    // Actualizar totales
    if (subtotalElement) subtotalElement.textContent = formatCurrency(CartService.getCartTotal());
    if (totalElement) totalElement.textContent = formatCurrency(CartService.getCartTotal());
    
    // Habilitar botón de checkout
    if (checkoutBtn) {
      checkoutBtn.disabled = false;
      checkoutBtn.classList.remove("opacity-50", "cursor-not-allowed");
    }
  },
  
  // Inicializar event listeners
  initEventListeners() {
    console.log("Inicializando event listeners");
    
    const checkoutBtn = document.getElementById("checkout-btn");
    const addressForm = document.getElementById("address-form");
    
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        
        try {
          // Mostrar indicador de carga
          checkoutBtn.textContent = "Procesando...";
          checkoutBtn.disabled = true;
          
          // Verificar si hay dirección seleccionada (si aplica)
          if (addressForm && !this.validateAddressForm()) {
            alert("Por favor selecciona o ingresa una dirección de envío");
            checkoutBtn.textContent = "Proceder al pago";
            checkoutBtn.disabled = false;
            return;
          }
          
          // Obtener datos del carrito
          const cart = CartService.getCart();
          
          if (cart.length === 0) {
            alert("Tu carrito está vacío");
            checkoutBtn.textContent = "Proceder al pago";
            checkoutBtn.disabled = false;
            return;
          }
          
          // Preparar datos para la API
          const orderData = {
            items: cart.map(item => ({
              title: item.nombre,
              unit_price: item.precio,
              quantity: item.cantidad,
              currency_id: "MXN"
            })),
            // Incluir datos de dirección si es necesario
            shipping_address: this.getShippingAddress()
          };
          
          console.log("Enviando datos de orden:", orderData);
          
          // Enviar solicitud a la API
          const response = await fetch("/api/create-order", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
          });
          
          const data = await response.json();
          
          if (data.success) {
            console.log("Orden creada exitosamente:", data);
            // Guardar ID de orden en sessionStorage para referencia futura
            sessionStorage.setItem('lastOrderId', data.order_id);
            // Redirigir a la página de pago de Mercado Pago
            window.location.href = data.init_point;
          } else {
            console.error("Error al crear la orden:", data);
            alert(`Error: ${data.error || "No se pudo procesar el pago"}`);
            checkoutBtn.textContent = "Proceder al pago";
            checkoutBtn.disabled = false;
          }
        } catch (error) {
          console.error("Error en el proceso de checkout:", error);
          alert("Ocurrió un error al procesar tu pago. Por favor, intenta de nuevo.");
          checkoutBtn.textContent = "Proceder al pago";
          checkoutBtn.disabled = false;
        }
      });
    }
  },
  
  // Validar formulario de dirección (si aplica)
  validateAddressForm() {
    const addressForm = document.getElementById("address-form");
    if (!addressForm) return true; // No hay formulario, no se necesita validar
    
    // Implementar validación según tu formulario
    // Por ejemplo:
    const selectedAddress = document.querySelector('input[name="address"]:checked');
    return !!selectedAddress;
  },
  
  // Obtener dirección de envío (si aplica)
  getShippingAddress() {
    const addressForm = document.getElementById("address-form");
    if (!addressForm) return null;
    
    // Implementar según tu formulario
    // Por ejemplo:
    const selectedAddress = document.querySelector('input[name="address"]:checked');
    if (!selectedAddress) return null;
    
    // Retornar datos de la dirección seleccionada
    return {
      street_name: selectedAddress.dataset.street || "",
      street_number: selectedAddress.dataset.number || "",
      zip_code: selectedAddress.dataset.zip || "",
      city: selectedAddress.dataset.city || "",
      state: selectedAddress.dataset.state || "",
      country: selectedAddress.dataset.country || "MX"
    };
  }
};

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  // Solo inicializar en la página de checkout
  if (window.location.pathname.includes("/checkout") || 
      window.location.pathname.includes("/cart") ||
      window.location.pathname.includes("/detalle-pago")) {
    CheckoutManager.init();
  }
});

export default CheckoutManager;