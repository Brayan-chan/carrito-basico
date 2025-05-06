import AuthService from "./auth-service.js"
import ProductService from "./product-service.js"
import CartService from "./cart-service.js"

// Función para actualizar el título de la página
function updatePageTitle(productTitle) {
  document.title = `${productTitle} - ShopZone`
}

// Función para actualizar el breadcrumb
function updateBreadcrumb(product) {
  const breadcrumbElement = document.querySelector("nav.flex.text-sm ol")
  if (!breadcrumbElement) return

  // Crear el HTML del breadcrumb
  const breadcrumbHTML = `
        <li class="flex items-center">
            <a href="/" class="text-gray-500 dark:text-gray-400 hover:text-primary">Inicio</a>
            <svg class="h-4 w-4 mx-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
            </svg>
        </li>
        <li class="flex items-center">
            <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-primary">${product.category || "Categoría"}</a>
            <svg class="h-4 w-4 mx-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
            </svg>
        </li>
        ${
          product.subcategory
            ? `
        <li class="flex items-center">
            <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-primary">${product.subcategory}</a>
            <svg class="h-4 w-4 mx-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
            </svg>
        </li>
        `
            : ""
        }
        <li>
            <span class="text-gray-700 dark:text-gray-300">${product.title || "Producto"}</span>
        </li>
    `

  breadcrumbElement.innerHTML = breadcrumbHTML
}

// Función para actualizar la galería de imágenes
function updateProductImages(product) {
  const mainImageElement = document.getElementById("mainImage")
  const thumbnailsContainer = document.querySelector(".grid.grid-cols-6.gap-2")

  if (!mainImageElement || !thumbnailsContainer) return

  // Obtener las imágenes del producto o usar placeholders
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f8f8f8'/%3E%3Ccircle cx='200' cy='200' r='150' fill='%23ddd'/%3E%3Cpath d='M200,100 L200,300 M100,200 L300,200' stroke='%23fff' stroke-width='20'/%3E%3C/svg%3E",
        ]

  // Actualizar imagen principal
  mainImageElement.src = images[0]
  mainImageElement.alt = product.title || "Imagen del producto"

  // Actualizar miniaturas
  let thumbnailsHTML = ""

  // Primero añadimos las imágenes reales
  images.forEach((image, index) => {
    thumbnailsHTML += `
            <div class="thumbnail ${index === 0 ? "active" : ""} col-span-1 rounded-md overflow-hidden cursor-pointer" data-img="${image}">
                <img src="${image}" alt="${product.title || "Producto"} - Vista ${index + 1}" class="w-full h-full object-cover">
            </div>
        `
  })

  // Si hay menos de 6 imágenes, completamos con imágenes deshabilitadas
  // Pero si hay 3 o menos, duplicamos la primera imagen para simular más vistas
  if (images.length < 6) {
    if (images.length <= 3) {
      // Duplicar la primera imagen para simular más vistas
      for (let i = images.length; i < 6; i++) {
        thumbnailsHTML += `
                <div class="thumbnail col-span-1 rounded-md overflow-hidden cursor-pointer" data-img="${images[0]}">
                    <img src="${images[0]}" alt="${product.title || "Producto"} - Vista adicional" class="w-full h-full object-cover opacity-70">
                </div>
            `
      }
    } else {
      // Si hay más de 3 pero menos de 6, completar con placeholders deshabilitados
      for (let i = images.length; i < 6; i++) {
        thumbnailsHTML += `
                <div class="thumbnail col-span-1 rounded-md overflow-hidden opacity-30">
                    <div class="w-full h-full bg-gray-200 flex items-center justify-center">
                        <i class="fas fa-image text-gray-400"></i>
                    </div>
                </div>
            `
      }
    }
  }

  thumbnailsContainer.innerHTML = thumbnailsHTML

  // Reinicializar los eventos de las miniaturas
  initializeThumbnailEvents()
}

// Función para generar estrellas de valoración
function generateRatingStars(rating) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  let starsHTML = ""

  // Estrellas completas
  for (let i = 0; i < fullStars; i++) {
    starsHTML += `<i class="fas fa-star text-yellow-400 text-sm"></i>`
  }

  // Media estrella si es necesario
  if (hasHalfStar) {
    starsHTML += `<i class="fas fa-star-half-alt text-yellow-400 text-sm"></i>`
  }

  // Estrellas vacías
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += `<i class="far fa-star text-yellow-400 text-sm"></i>`
  }

  return starsHTML
}

// Función para actualizar la información del producto
function updateProductInfo(product) {
  // Actualizar título y precio
  const titleElement = document.querySelector("h1.text-2xl.font-bold")
  const priceElement = document.querySelector("span.text-2xl.font-bold")
  const originalPriceElement = document.querySelector(".flex.flex-col span.text-xs.text-gray-500.line-through")
  const discountElement = document.querySelector(".absolute.top-2.left-2.bg-red-500")

  if (titleElement) titleElement.textContent = product.title || "Producto"

  if (priceElement) {
    priceElement.textContent = ProductService.formatCurrency(product.price || 0)
  }

  // Actualizar precio original y descuento si existen
  if (originalPriceElement && product.originalPrice) {
    originalPriceElement.textContent = ProductService.formatCurrency(product.originalPrice)
    originalPriceElement.classList.remove("hidden")
  } else if (originalPriceElement) {
    originalPriceElement.classList.add("hidden")
  }

  if (discountElement && product.originalPrice && product.price) {
    const discount = ProductService.calculateDiscount(product.originalPrice, product.price)
    if (discount > 0) {
      discountElement.textContent = `-${discount}%`
      discountElement.classList.remove("hidden")
    } else {
      discountElement.classList.add("hidden")
    }
  } else if (discountElement) {
    discountElement.classList.add("hidden")
  }

  // Actualizar valoración y reseñas
  const ratingContainer = document.querySelector(".flex.items-center.mr-3")
  if (ratingContainer && product.rating) {
    ratingContainer.innerHTML = generateRatingStars(product.rating)
  }

  const reviewCountElement = document.querySelector(".flex.items-center.mr-3 + span")
  if (reviewCountElement && product.reviews) {
    reviewCountElement.textContent = `(${product.reviews} reseñas)`
  }

  // Actualizar descripción
  const descriptionElement = document.querySelector(".text-sm.text-gray-600.dark\\:text-gray-300.space-y-2")
  if (descriptionElement && product.description) {
    descriptionElement.innerHTML = `<p>${product.description}</p>`
  }

  // Actualizar características
  const featuresElement = document.querySelector(
    "ul.list-disc.list-inside.text-sm.text-gray-600.dark\\:text-gray-300.space-y-1",
  )
  if (featuresElement && product.features && product.features.length > 0) {
    featuresElement.innerHTML = product.features.map((feature) => `<li>${feature}</li>`).join("")
  }

  // Actualizar información de stock
  updateStockInfo(product)

  // Actualizar opciones de color si existen
  updateColorOptions(product)
}

// Función para actualizar la información de stock
function updateStockInfo(product) {
  // Buscar o crear el contenedor de información de stock
  let stockInfoContainer = document.getElementById("stock-info")
  if (!stockInfoContainer) {
    // Si no existe, buscamos donde insertarlo (después del precio)
    const priceContainer = document.querySelector(".mb-6:has(span.text-2xl.font-bold)")
    if (priceContainer) {
      stockInfoContainer = document.createElement("div")
      stockInfoContainer.id = "stock-info"
      stockInfoContainer.className = "mt-2"
      priceContainer.appendChild(stockInfoContainer)
    }
  }

  if (stockInfoContainer && product.stock !== undefined) {
    let stockClass = "text-green-600"
    let stockText = ""
    let stockIcon = "fa-check-circle"

    if (product.stock <= 0) {
      stockClass = "text-red-600"
      stockText = "Agotado"
      stockIcon = "fa-times-circle"
    } else if (product.stock < 5) {
      stockClass = "text-orange-500"
      stockText = `¡Solo ${product.stock} unidades disponibles!`
      stockIcon = "fa-exclamation-circle"
    } else {
      stockText = `${product.stock} unidades disponibles`
    }

    stockInfoContainer.innerHTML = `
      <div class="flex items-center">
        <i class="fas ${stockIcon} ${stockClass} mr-1"></i>
        <span class="${stockClass} text-sm">${stockText}</span>
      </div>
    `
  }
}

// Función para actualizar las opciones de color
function updateColorOptions(product) {
  // Buscar el contenedor de opciones de color - Corregido el selector
  const colorContainer = document.querySelector("div:has(> label)")

  // Si el producto no tiene colores, ocultamos la sección
  if (!product.colors || !Array.isArray(product.colors) || product.colors.length === 0) {
    if (colorContainer) {
      colorContainer.classList.add("hidden")
    }
    return
  }

  // Si encontramos el contenedor, actualizamos las opciones
  if (colorContainer) {
    colorContainer.classList.remove("hidden")

    // Actualizar el título
    const colorLabel = colorContainer.querySelector("label")
    if (colorLabel) {
      colorLabel.textContent = "Color"
    }

    // Contenedor de opciones de color
    const colorOptionsContainer = colorContainer.querySelector(".flex.flex-wrap.gap-2")
    if (colorOptionsContainer) {
      let colorsHTML = ""

      product.colors.forEach((color, index) => {
        const colorCode = color.code || color.color || "#cccccc"
        const colorName = color.name || color.nombre || `Color ${index + 1}`

        colorsHTML += `
          <div class="color-option ${index === 0 ? "selected" : ""}" 
               style="background-color: ${colorCode};" 
               title="${colorName}" 
               data-color-name="${colorName}" 
               data-color-code="${colorCode}"></div>
        `
      })

      colorOptionsContainer.innerHTML = colorsHTML

      // Inicializar eventos de selección de color
      initializeColorSelection()
    }
  }
}

// Función para inicializar la selección de color
function initializeColorSelection() {
  const colorOptions = document.querySelectorAll(".color-option")
  colorOptions.forEach((option) => {
    option.addEventListener("click", function () {
      // Quitar selección anterior
      colorOptions.forEach((opt) => opt.classList.remove("selected"))

      // Marcar como seleccionado
      this.classList.add("selected")

      // Actualizar etiqueta de color
      const colorName = this.getAttribute("data-color-name")
      const colorLabel = document.querySelector("label")

      if (colorLabel && colorName) {
        colorLabel.textContent = `Color - ${colorName}`
      }
    })
  })
}

// Función para inicializar eventos de las miniaturas
function initializeThumbnailEvents() {
  const thumbnails = document.querySelectorAll(".thumbnail")
  const mainImg = document.getElementById("mainImage")

  if (!thumbnails.length || !mainImg) return

  thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", function () {
      // Si la miniatura está deshabilitada, no hacer nada
      if (this.classList.contains("opacity-30")) return

      // Actualizar estado activo
      thumbnails.forEach((t) => t.classList.remove("active"))
      this.classList.add("active")

      // Actualizar imagen principal
      const imgSrc = this.getAttribute("data-img")

      // Animación de fade
      mainImg.style.opacity = 0
      setTimeout(() => {
        mainImg.src = imgSrc
        mainImg.style.opacity = 1
      }, 200)
    })
  })
}

// Función para manejar el botón de añadir al carrito
function initializeAddToCartButton(product) {
  const addToCartButton = document.querySelector("button.w-full.bg-primary")
  const saveForLaterButton = document.querySelector("a.flex.items-center.justify-center.text-primary")
  const quantityInput = document.getElementById("quantity-input")

  if (!addToCartButton) return

  // Si el producto está agotado, deshabilitar el botón
  if (product.stock <= 0) {
    addToCartButton.disabled = true
    addToCartButton.classList.add("opacity-50", "cursor-not-allowed")
    addToCartButton.innerHTML = '<i class="fas fa-ban mr-2"></i>Agotado'
    return
  }

  // Añadir evento al botón de añadir al carrito
  addToCartButton.addEventListener("click", async (e) => {
    e.preventDefault()

    if (!product) {
      console.error("No se puede añadir al carrito: producto no disponible")
      return
    }

    // Obtener cantidad seleccionada
    const quantity = quantityInput ? Number.parseInt(quantityInput.value) || 1 : 1

    // Obtener color seleccionado si existe
    let selectedColor = null
    const colorOption = document.querySelector(".color-option.selected")
    if (colorOption) {
      selectedColor = {
        name: colorOption.getAttribute("data-color-name"),
        code: colorOption.getAttribute("data-color-code"),
      }
    }

    try {
      // Añadir al carrito
      await CartService.addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        images: product.images,
        color: selectedColor,
        quantity: quantity,
      })

      // Animación de confirmación
      const originalText = addToCartButton.innerHTML
      addToCartButton.innerHTML = '<i class="fas fa-check mr-2"></i>Añadido al carrito'
      addToCartButton.classList.add("bg-green-600")

      setTimeout(() => {
        addToCartButton.innerHTML = originalText
        addToCartButton.classList.remove("bg-green-600")
      }, 2000)
    } catch (error) {
      console.error("Error al añadir al carrito:", error)

      // Mostrar mensaje de error
      const originalText = addToCartButton.innerHTML
      addToCartButton.innerHTML = '<i class="fas fa-exclamation-circle mr-2"></i>Error'
      addToCartButton.classList.add("bg-red-600")

      setTimeout(() => {
        addToCartButton.innerHTML = originalText
        addToCartButton.classList.remove("bg-red-600")
      }, 2000)
    }
  })

  // Añadir evento al botón de guardar para más tarde
  if (saveForLaterButton) {
    saveForLaterButton.addEventListener("click", async (e) => {
      e.preventDefault()

      // Verificar si el usuario está autenticado
      if (!AuthService.isAuthenticated()) {
        // Guardar URL de redirección
        sessionStorage.setItem("redirectAfterLogin", window.location.href)

        // Redirigir a login
        window.location.href = "/views/login.html"
        return
      }

      try {
        // Guardar en la lista de guardados del usuario
        const { doc, updateDoc, arrayUnion, getDoc } = await import(
          "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"
        )
        const { db } = await import("./firebase-config.js")

        const savedItem = {
          productoId: product.id,
          nombre: product.title || product.nombre,
          precio: product.price || product.precio,
          imagen: product.images?.[0] || product.imagen,
          fechaGuardado: new Date().toISOString(),
        }

        await updateDoc(doc(db, "usuarios", AuthService.currentUser.uid), {
          guardados: arrayUnion(savedItem),
        })

        // Animación de confirmación
        const originalText = saveForLaterButton.innerHTML
        saveForLaterButton.innerHTML = '<i class="fas fa-check mr-2"></i>Guardado'
        saveForLaterButton.classList.add("text-green-600")

        setTimeout(() => {
          saveForLaterButton.innerHTML = originalText
          saveForLaterButton.classList.remove("text-green-600")
        }, 2000)
      } catch (error) {
        console.error("Error al guardar producto:", error)

        // Mostrar mensaje de error
        const originalText = saveForLaterButton.innerHTML
        saveForLaterButton.innerHTML = '<i class="fas fa-exclamation-circle mr-2"></i>Error'
        saveForLaterButton.classList.add("text-red-600")

        setTimeout(() => {
          saveForLaterButton.innerHTML = originalText
          saveForLaterButton.classList.remove("text-red-600")
        }, 2000)
      }
    })
  }
}

// Función para añadir selector de cantidad
function addQuantitySelector(product) {
  // Buscar el contenedor donde insertar el selector (antes del botón de añadir al carrito)
  const addToCartButton = document.querySelector("button.w-full.bg-primary")
  if (!addToCartButton) return

  const buttonContainer = addToCartButton.parentElement
  if (!buttonContainer) return

  // Crear el selector de cantidad
  const quantitySelector = document.createElement("div")
  quantitySelector.className = "mb-4"
  quantitySelector.innerHTML = `
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cantidad</label>
    <div class="flex items-center">
      <button id="decrease-quantity" class="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-l-md hover:bg-gray-300 dark:hover:bg-gray-600">
        <i class="fas fa-minus"></i>
      </button>
      <input type="number" id="quantity-input" value="1" min="1" max="${product.stock || 99}" 
        class="w-16 text-center border-y border-gray-300 dark:border-gray-600 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-gray-700 dark:text-gray-300 dark:bg-gray-700">
      <button id="increase-quantity" class="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-r-md hover:bg-gray-300 dark:hover:bg-gray-600">
        <i class="fas fa-plus"></i>
      </button>
    </div>
  `

  // Insertar antes del botón
  buttonContainer.insertBefore(quantitySelector, addToCartButton)

  // Añadir eventos a los botones
  const decreaseBtn = document.getElementById("decrease-quantity")
  const increaseBtn = document.getElementById("increase-quantity")
  const quantityInput = document.getElementById("quantity-input")

  if (decreaseBtn && increaseBtn && quantityInput) {
    decreaseBtn.addEventListener("click", () => {
      const currentValue = Number.parseInt(quantityInput.value) || 1
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1
      }
    })

    increaseBtn.addEventListener("click", () => {
      const currentValue = Number.parseInt(quantityInput.value) || 1
      const maxValue = Number.parseInt(quantityInput.getAttribute("max")) || 99
      if (currentValue < maxValue) {
        quantityInput.value = currentValue + 1
      }
    })

    // Validar entrada manual
    quantityInput.addEventListener("change", () => {
      let value = Number.parseInt(quantityInput.value) || 1
      const maxValue = Number.parseInt(quantityInput.getAttribute("max")) || 99

      if (value < 1) value = 1
      if (value > maxValue) value = maxValue

      quantityInput.value = value
    })
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

// Función para guardar el producto en el historial de vistos recientemente
function saveToRecentlyViewed(productId) {
  try {
    // Obtener historial actual
    const recentlyViewed = localStorage.getItem("recentlyViewed")
    let recentlyViewedArray = recentlyViewed ? JSON.parse(recentlyViewed) : []

    // Eliminar el producto si ya está en el historial
    recentlyViewedArray = recentlyViewedArray.filter((id) => id !== productId)

    // Añadir el producto al principio
    recentlyViewedArray.unshift(productId)

    // Limitar a 10 productos
    if (recentlyViewedArray.length > 10) {
      recentlyViewedArray = recentlyViewedArray.slice(0, 10)
    }

    // Guardar en localStorage
    localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewedArray))
  } catch (error) {
    console.error("Error al guardar en historial de vistos recientemente:", error)
  }
}

// Función principal para cargar los detalles del producto
async function loadProductDetails() {
  console.log("Cargando detalles del producto")

  // Esperar a que la autenticación esté inicializada
  await waitForAuth()

  // Obtener el ID del producto de la URL
  const urlParams = new URLSearchParams(window.location.search)
  const productId = urlParams.get("id")

  if (!productId) {
    console.error("ID de producto no especificado")
    // Redirigir a la página principal o mostrar un mensaje de error
    window.location.href = "/"
    return
  }

  console.log(`Obteniendo producto con ID: ${productId}`)

  try {
    // Obtener los datos del producto
    const product = await ProductService.getProductById(productId)

    if (!product) {
      console.error("Producto no encontrado")
      // Redirigir a la página principal o mostrar un mensaje de error
      window.location.href = "/"
      return
    }

    console.log("Producto obtenido:", product)

    // Guardar en historial de vistos recientemente
    saveToRecentlyViewed(productId)

    // Actualizar la página con los detalles del producto
    updatePageTitle(product.title || "Producto")
    updateBreadcrumb(product)
    updateProductImages(product)
    updateProductInfo(product)

    // Añadir selector de cantidad
    addQuantitySelector(product)

    // Inicializar eventos
    initializeThumbnailEvents()
    initializeAddToCartButton(product)

    console.log("Detalles del producto cargados:", product.title)
  } catch (error) {
    console.error("Error al cargar detalles del producto:", error)
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", loadProductDetails)

export { loadProductDetails }