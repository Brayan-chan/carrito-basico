import CartService from "./cart-service.js"

// Función para inicializar la página de detalles del producto
export function initProductDetail() {
  // Obtener el ID del producto de la URL
  const urlParams = new URLSearchParams(window.location.search)
  const productId = urlParams.get("id")

  if (!productId) {
    console.error("ID de producto no encontrado en la URL")
    return
  }

  // Cargar datos del producto
  loadProductData(productId)

  // Configurar el botón de añadir al carrito
  setupAddToCartButton(productId)
}

// Función para cargar los datos del producto
async function loadProductData(productId) {
  try {
    // Aquí normalmente harías una petición a tu API o Firestore
    // Para este ejemplo, usaremos datos de ejemplo
    const productData = await fetchProductData(productId)

    // Actualizar la UI con los datos del producto
    updateProductUI(productData)
  } catch (error) {
    console.error("Error al cargar datos del producto:", error)
    // Mostrar mensaje de error en la UI
  }
}

// Función para simular la obtención de datos del producto
// En un caso real, esto sería una llamada a tu API o Firestore
async function fetchProductData(productId) {
  // Simulación de una llamada a API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: productId,
        nombre: "Funda de silicona con MagSafe para el iPhone 16 Plus",
        precio: 59.0,
        descripcion:
          "Esta funda de silicona está diseñada por especialistas para adaptarse perfectamente a los botones, la silueta y las curvas de tu iPhone sin abultar prácticamente nada.",
        imagenes: [
          // URLs de imágenes
        ],
        colores: [
          { nombre: "Peonía", codigo: "#ff9ff3" },
          { nombre: "Azul", codigo: "#74b9ff" },
          // Más colores...
        ],
        caracteristicas: [
          "El exterior de silicona es suave al tacto",
          "El interior de microfibra protege tu iPhone",
          // Más características...
        ],
      })
    }, 300)
  })
}

// Función para actualizar la UI con los datos del producto
function updateProductUI(productData) {
  // Actualizar título, precio, descripción, etc.
  // Esta función dependerá de la estructura de tu HTML
}

// Función para configurar el botón de añadir al carrito
function setupAddToCartButton(productId) {
  const addToCartButton = document.querySelector("button.bg-primary")

  if (!addToCartButton) {
    console.error("Botón de añadir al carrito no encontrado")
    return
  }

  addToCartButton.addEventListener("click", async () => {
    try {
      // Obtener datos del producto
      const productData = await fetchProductData(productId)

      // Añadir al carrito
      await CartService.addToCart({
        id: productId,
        nombre: productData.nombre,
        precio: productData.precio,
        imagen: productData.imagenes?.[0] || null,
        cantidad: 1,
      })

      // Mostrar mensaje de éxito
      showNotification("Producto añadido al carrito", "success")
    } catch (error) {
      console.error("Error al añadir al carrito:", error)
      showNotification("Error al añadir al carrito", "error")
    }
  })
}

// Función para mostrar notificaciones
function showNotification(message, type = "info") {
  // Crear elemento de notificación
  const notification = document.createElement("div")
  notification.className = `fixed bottom-4 right-4 px-4 py-2 rounded-md shadow-lg z-50 ${
    type === "success"
      ? "bg-green-500 text-white"
      : type === "error"
        ? "bg-red-500 text-white"
        : "bg-blue-500 text-white"
  }`
  notification.textContent = message

  // Añadir al DOM
  document.body.appendChild(notification)

  // Eliminar después de 3 segundos
  setTimeout(() => {
    notification.classList.add("opacity-0", "transition-opacity", "duration-500")
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 500)
  }, 3000)
}