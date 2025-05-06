import ProductService from "./product-service.js"
import AuthService from "./auth-service.js"

// Clase para renderizar la página de inicio
class HomeRenderer {
  constructor() {
    this.productService = ProductService
    this.authService = AuthService
  }

  // Inicializar la página
  async initialize() {
    console.log("Inicializando renderizador de la página de inicio")

    // Esperar a que la autenticación esté inicializada
    await this.waitForAuth()

    // Renderizar las diferentes secciones
    await Promise.all([this.renderCategories(), this.renderFeaturedProducts(), this.renderRecentlyViewed()])

    console.log("Página de inicio renderizada completamente")
  }

  // Renderizar categorías
  async renderCategories() {
    try {
      console.log("Renderizando categorías")
      const categoriesContainer = document.querySelector(
        ".grid.grid-cols-3.sm\\:grid-cols-4.md\\:grid-cols-6.lg\\:grid-cols-8.gap-4",
      )

      if (!categoriesContainer) {
        console.error("No se encontró el contenedor de categorías")
        return
      }

      // Obtener categorías
      const categories = await this.productService.getCategories()

      if (!categories || categories.length === 0) {
        console.log("No hay categorías disponibles")
        return
      }

      // Iconos predeterminados para categorías comunes
      const defaultIcons = {
        electrónica: "fas fa-mobile-alt",
        moda: "fas fa-tshirt",
        hogar: "fas fa-home",
        deportes: "fas fa-running",
        juguetes: "fas fa-gamepad",
        libros: "fas fa-book",
        belleza: "fas fa-spa",
        alimentos: "fas fa-utensils",
      }

      // Generar HTML para cada categoría
      let categoriesHTML = ""

      categories.slice(0, 8).forEach((category) => {
        const categoryName = category.name || category.nombre || category.id
        const categoryId = category.id

        // Determinar qué icono usar
        const iconClass = category.icon || defaultIcons[categoryName.toLowerCase()] || "fas fa-tag"

        categoriesHTML += `
          <a href="/views/category.html?id=${categoryId}" 
             class="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg transition hover:shadow-md">
            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <i class="${iconClass} text-primary text-xl"></i>
            </div>
            <span class="text-sm text-center text-gray-700 dark:text-gray-300">${categoryName}</span>
          </a>
        `
      })

      // Actualizar el contenedor
      categoriesContainer.innerHTML = categoriesHTML
      console.log(`${categories.length} categorías renderizadas`)
    } catch (error) {
      console.error("Error al renderizar categorías:", error)
    }
  }

  // Renderizar productos destacados
  async renderFeaturedProducts() {
    try {
      console.log("Renderizando productos destacados")
      const productsContainer = document.querySelector(
        ".grid.grid-cols-2.sm\\:grid-cols-3.lg\\:grid-cols-4.xl\\:grid-cols-5.gap-4",
      )

      if (!productsContainer) {
        console.error("No se encontró el contenedor de productos destacados")
        return
      }

      // Obtener productos destacados
      const products = await this.productService.getFeaturedProducts(10)

      if (!products || products.length === 0) {
        console.log("No hay productos destacados disponibles")
        return
      }

      // Generar HTML para cada producto
      let productsHTML = ""

      products.forEach((product) => {
        const title = product.title || "Producto"
        const price = product.price || 0
        const originalPrice = product.originalPrice || null
        const discount = originalPrice ? this.productService.calculateDiscount(originalPrice, price) : 0
        const image =
          product.images && product.images.length > 0
            ? product.images[0]
            : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f8f8f8'/%3E%3Ccircle cx='200' cy='200' r='150' fill='%23ddd'/%3E%3Cpath d='M200,100 L200,300 M100,200 L300,200' stroke='%23fff' stroke-width='20'/%3E%3C/svg%3E"

        productsHTML += `
          <a href="/views/detalles_producto.html?id=${product.id}" 
             class="product-card bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md">
            <div class="relative">
              <div class="h-48 bg-gray-200 flex items-center justify-center">
                <img src="${image}" alt="${title}" class="w-full h-full object-contain">
              </div>
              ${discount > 0 ? `<div class="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">-${discount}%</div>` : ""}
            </div>
            <div class="p-4">
              <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 line-clamp-2">${title}</h3>
              <div class="flex flex-col">
                ${originalPrice ? `<span class="text-xs text-gray-500 line-through">${this.productService.formatCurrency(originalPrice)}</span>` : ""}
                <span class="text-lg font-bold text-gray-800 dark:text-white">${this.productService.formatCurrency(price)}</span>
              </div>
              <div class="flex items-center mt-1">
                ${product.freeShipping ? `<span class="text-xs text-green-600">Envío gratis</span>` : ""}
                <span class="text-xs text-primary ml-2">FULL</span>
              </div>
              <div class="mt-2">
                <span class="text-xs text-gray-500">12x ${this.productService.formatCurrency(price / 12)} sin interés</span>
              </div>
            </div>
          </a>
        `
      })

      // Actualizar el contenedor
      productsContainer.innerHTML = productsHTML
      console.log(`${products.length} productos destacados renderizados`)
    } catch (error) {
      console.error("Error al renderizar productos destacados:", error)
    }
  }

  // Renderizar productos vistos recientemente
  async renderRecentlyViewed() {
    try {
      console.log("Renderizando productos vistos recientemente")
      const recentContainer = document.querySelector(
        ".grid.grid-cols-2.sm\\:grid-cols-3.lg\\:grid-cols-4.xl\\:grid-cols-6.gap-4",
      )

      if (!recentContainer) {
        console.error("No se encontró el contenedor de productos vistos recientemente")
        return
      }

      // Obtener historial de productos vistos del localStorage
      const viewedIds = this.getRecentlyViewedIds()

      if (!viewedIds || viewedIds.length === 0) {
        // Si no hay historial, mostrar productos aleatorios
        const allProducts = await this.productService.getAllProducts()
        const randomProducts = this.getRandomProducts(allProducts, 6)
        this.renderProductsInContainer(randomProducts, recentContainer, true)
        return
      }

      // Obtener los productos por sus IDs
      const recentProducts = []
      for (const id of viewedIds) {
        const product = await this.productService.getProductById(id)
        if (product) {
          recentProducts.push(product)
        }
      }

      // Renderizar los productos
      this.renderProductsInContainer(recentProducts, recentContainer, true)
    } catch (error) {
      console.error("Error al renderizar productos vistos recientemente:", error)
    }
  }

  // Obtener IDs de productos vistos recientemente desde localStorage
  getRecentlyViewedIds() {
    try {
      const recentlyViewed = localStorage.getItem("recentlyViewed")
      return recentlyViewed ? JSON.parse(recentlyViewed) : []
    } catch (error) {
      console.error("Error al obtener productos vistos recientemente:", error)
      return []
    }
  }

  // Obtener productos aleatorios
  getRandomProducts(products, count) {
    if (!products || products.length === 0) return []

    const shuffled = [...products].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  // Renderizar productos en un contenedor
  renderProductsInContainer(products, container, isCompact = false) {
    if (!products || products.length === 0 || !container) return

    let productsHTML = ""

    products.forEach((product) => {
      const title = product.title || "Producto"
      const price = product.price || 0
      const image =
        product.images && product.images.length > 0
          ? product.images[0]
          : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f8f8f8'/%3E%3Ccircle cx='200' cy='200' r='150' fill='%23ddd'/%3E%3Cpath d='M200,100 L200,300 M100,200 L300,200' stroke='%23fff' stroke-width='20'/%3E%3C/svg%3E"

      if (isCompact) {
        // Versión compacta para "Visto recientemente"
        productsHTML += `
          <a href="/views/detalles_producto.html?id=${product.id}" 
             class="product-card bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md">
            <div class="h-36 bg-gray-200 flex items-center justify-center">
              <img src="${image}" alt="${title}" class="w-full h-full object-contain">
            </div>
            <div class="p-3">
              <h3 class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 line-clamp-2">${title}</h3>
              <span class="text-base font-bold text-gray-800 dark:text-white">${this.productService.formatCurrency(price)}</span>
              <div class="flex items-center mt-1">
                ${product.freeShipping ? `<span class="text-xs text-green-600">Envío gratis</span>` : ""}
              </div>
            </div>
          </a>
        `
      } else {
        // Versión completa
        const originalPrice = product.originalPrice || null
        const discount = originalPrice ? this.productService.calculateDiscount(originalPrice, price) : 0

        productsHTML += `
          <a href="/views/detalles_producto.html?id=${product.id}" 
             class="product-card bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md">
            <div class="relative">
              <div class="h-48 bg-gray-200 flex items-center justify-center">
                <img src="${image}" alt="${title}" class="w-full h-full object-contain">
              </div>
              ${discount > 0 ? `<div class="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">-${discount}%</div>` : ""}
            </div>
            <div class="p-4">
              <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 line-clamp-2">${title}</h3>
              <div class="flex flex-col">
                ${originalPrice ? `<span class="text-xs text-gray-500 line-through">${this.productService.formatCurrency(originalPrice)}</span>` : ""}
                <span class="text-lg font-bold text-gray-800 dark:text-white">${this.productService.formatCurrency(price)}</span>
              </div>
              <div class="flex items-center mt-1">
                ${product.freeShipping ? `<span class="text-xs text-green-600">Envío gratis</span>` : ""}
                <span class="text-xs text-primary ml-2">FULL</span>
              </div>
              <div class="mt-2">
                <span class="text-xs text-gray-500">12x ${this.productService.formatCurrency(price / 12)} sin interés</span>
              </div>
            </div>
          </a>
        `
      }
    })

    // Actualizar el contenedor
    container.innerHTML = productsHTML
    console.log(`${products.length} productos renderizados en contenedor`)
  }

  // Función para esperar a que la autenticación esté inicializada
  waitForAuth() {
    if (this.authService.authInitialized) {
      return Promise.resolve()
    }

    return new Promise((resolve) => {
      const checkAuth = () => {
        if (this.authService.authInitialized) {
          resolve()
        } else {
          setTimeout(checkAuth, 100)
        }
      }
      checkAuth()
    })
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  const homeRenderer = new HomeRenderer()
  homeRenderer.initialize()
})

export default HomeRenderer
