import AuthService from "./auth-service.js"
import ProductService from "./product-service.js"

// Función para inicializar los enlaces de productos
async function initializeProductLinks() {
  console.log("Inicializando enlaces de productos")

  // Esperar a que la autenticación esté inicializada
  await waitForAuth()

  // Obtener todos los enlaces de productos
  const productCards = document.querySelectorAll(".product-card")

  if (productCards.length === 0) {
    console.log("No se encontraron tarjetas de productos para inicializar")
    return
  }

  console.log(`Inicializando ${productCards.length} tarjetas de productos`)

  // Obtener productos destacados para asignar IDs reales
  let featuredProducts = []
  try {
    featuredProducts = await ProductService.getFeaturedProducts(productCards.length)
    console.log("Productos destacados obtenidos:", featuredProducts.length)
  } catch (error) {
    console.error("Error al obtener productos destacados:", error)
  }

  // Asignar eventos a cada tarjeta de producto
  productCards.forEach((card, index) => {
    // Si tenemos productos reales, usamos su ID, de lo contrario usamos un índice
    const productId = featuredProducts[index]?.id || `demo-product-${index + 1}`

    // Actualizar el href con el ID del producto
    card.href = `/views/detalles_producto.html?id=${productId}`

    // Si tenemos datos reales, actualizamos la información del producto
    if (featuredProducts[index]) {
      updateProductCard(card, featuredProducts[index])
    }

    // Asegurarnos de que el enlace funcione correctamente
    card.addEventListener("click", (e) => {
      e.preventDefault()
      window.location.href = `/views/detalles_producto.html?id=${productId}`
    })

    console.log(`Tarjeta de producto ${index + 1} inicializada con ID: ${productId}`)
  })
}

// Función para actualizar la información de una tarjeta de producto
function updateProductCard(card, product) {
  // Actualizar título
  const titleElement = card.querySelector("h3")
  if (titleElement) {
    titleElement.textContent = product.title || product.titulo || "Producto"
  }

  // Actualizar precios
  const priceElement = card.querySelector("span.text-lg.font-bold, span.text-base.font-bold")
  if (priceElement && product.price) {
    priceElement.textContent = ProductService.formatCurrency(product.price)
  }

  // Actualizar precio original si existe
  const originalPriceElement = card.querySelector("span.text-xs.text-gray-500.line-through")
  if (originalPriceElement && product.originalPrice) {
    originalPriceElement.textContent = ProductService.formatCurrency(product.originalPrice)
    originalPriceElement.classList.remove("hidden")
  }

  // Actualizar descuento si existe
  const discountElement = card.querySelector("div.absolute.top-2.left-2.bg-red-500")
  if (discountElement && product.originalPrice && product.price) {
    const discount = ProductService.calculateDiscount(product.originalPrice, product.price)
    if (discount > 0) {
      discountElement.textContent = `-${discount}%`
      discountElement.classList.remove("hidden")
    }
  }

  // Actualizar imagen si existe
  const imageContainer = card.querySelector("div.h-48, div.h-36")
  if (imageContainer && product.images && product.images.length > 0) {
    // Limpiar el contenedor
    imageContainer.innerHTML = ""

    // Crear y añadir la imagen
    const img = document.createElement("img")
    img.src = product.images[0]
    img.alt = product.title || product.titulo || "Producto"
    img.className = "w-full h-full object-contain"
    imageContainer.appendChild(img)
  }
}

// Función para esperar a que la autenticación esté inicializada
function waitForAuth() {
  if (AuthService.authInitialized) {
    return Promise.resolve()
  }

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

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", initializeProductLinks)

export { initializeProductLinks }