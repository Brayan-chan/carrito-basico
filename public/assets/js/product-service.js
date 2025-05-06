import {
    collection,
    getDocs,
    doc,
    getDoc,
    query,
    where,
    orderBy,
    limit as firestoreLimit,
  } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"
  import { db } from "./firebase-config.js"
  
  // Servicio para gestionar productos
  const ProductService = {
    // Caché de productos para mejorar rendimiento
    productsCache: null,
    featuredProductsCache: null,
    categoriesCache: null,
  
    // Obtener todos los productos
    async getAllProducts() {
      try {
        // Si ya tenemos los productos en caché, los devolvemos
        if (this.productsCache) {
          console.log("Devolviendo productos desde caché")
          return this.productsCache
        }
  
        console.log("Obteniendo todos los productos desde Firestore")
        const productsRef = collection(db, "productos")
        const productsSnapshot = await getDocs(productsRef)
  
        const products = []
        productsSnapshot.forEach((doc) => {
          products.push({
            id: doc.id,
            ...doc.data(),
          })
        })
  
        // Guardar en caché
        this.productsCache = products
        console.log(`${products.length} productos obtenidos`)
  
        return products
      } catch (error) {
        console.error("Error al obtener productos:", error)
        // En caso de error, devolvemos un array vacío
        return []
      }
    },
  
    // Obtener un producto por su ID
    async getProductById(productId) {
      try {
        console.log(`Obteniendo producto con ID: ${productId}`)
  
        // Primero intentamos buscar en la caché
        if (this.productsCache) {
          const cachedProduct = this.productsCache.find((p) => p.id === productId || p.id.toString() === productId)
          if (cachedProduct) {
            console.log("Producto encontrado en caché:", cachedProduct.title || cachedProduct.titulo)
            return cachedProduct
          }
        }
  
        // Si no está en caché, lo buscamos en Firestore
        const productRef = doc(db, "productos", productId.toString())
        const productDoc = await getDoc(productRef)
  
        if (productDoc.exists()) {
          const product = {
            id: productDoc.id,
            ...productDoc.data(),
          }
          console.log("Producto obtenido:", product.title || product.titulo)
          return product
        } else {
          console.log("No se encontró el producto")
          return null
        }
      } catch (error) {
        console.error("Error al obtener producto:", error)
        return null
      }
    },
  
    // Obtener productos destacados
    async getFeaturedProducts(limit = 5) {
      try {
        // Si ya tenemos los productos destacados en caché, los devolvemos
        if (this.featuredProductsCache) {
          console.log("Devolviendo productos destacados desde caché")
          return this.featuredProductsCache.slice(0, limit)
        }
  
        console.log("Obteniendo productos destacados")
        const productsRef = collection(db, "productos")
  
        // Intentamos primero con el campo 'destacado'
        let q = query(productsRef, where("destacado", "==", true), firestoreLimit(limit))
        let productsSnapshot = await getDocs(q)
  
        // Si no hay productos destacados, obtenemos los que tienen mejor rating
        if (productsSnapshot.empty) {
          q = query(productsRef, orderBy("rating", "desc"), firestoreLimit(limit))
          productsSnapshot = await getDocs(q)
        }
  
        const products = []
        productsSnapshot.forEach((doc) => {
          products.push({
            id: doc.id,
            ...doc.data(),
          })
        })
  
        // Guardar en caché
        this.featuredProductsCache = products
        console.log(`${products.length} productos destacados obtenidos`)
  
        return products
      } catch (error) {
        console.error("Error al obtener productos destacados:", error)
  
        // Si hay un error, intentamos devolver productos de la caché general
        if (this.productsCache) {
          // Ordenar por rating si está disponible
          const sorted = [...this.productsCache].sort((a, b) => (b.rating || 0) - (a.rating || 0))
          return sorted.slice(0, limit)
        }
  
        return []
      }
    },
  
    // Obtener productos por categoría
    async getProductsByCategory(category, limit = 10) {
      try {
        console.log(`Obteniendo productos de la categoría: ${category}`)
        const productsRef = collection(db, "productos")
        const q = query(productsRef, where("category", "==", category), firestoreLimit(limit))
  
        const productsSnapshot = await getDocs(q)
  
        const products = []
        productsSnapshot.forEach((doc) => {
          products.push({
            id: doc.id,
            ...doc.data(),
          })
        })
  
        console.log(`${products.length} productos obtenidos para la categoría ${category}`)
        return products
      } catch (error) {
        console.error(`Error al obtener productos de la categoría ${category}:`, error)
        return []
      }
    },
  
    // Obtener categorías
    async getCategories() {
      try {
        // Si ya tenemos las categorías en caché, las devolvemos
        if (this.categoriesCache) {
          console.log("Devolviendo categorías desde caché")
          return this.categoriesCache
        }
  
        console.log("Obteniendo categorías")
        const categoriesRef = collection(db, "categorias")
        const categoriesSnapshot = await getDocs(categoriesRef)
  
        const categories = []
        categoriesSnapshot.forEach((doc) => {
          categories.push({
            id: doc.id,
            ...doc.data(),
          })
        })
  
        // Si no hay categorías en la colección, extraemos categorías únicas de los productos
        if (categories.length === 0) {
          const products = await this.getAllProducts()
          const uniqueCategories = [...new Set(products.map((p) => p.category))]
            .filter(Boolean)
            .map((name) => ({ id: name.toLowerCase(), name }))
  
          if (uniqueCategories.length > 0) {
            console.log(`Generadas ${uniqueCategories.length} categorías desde productos`)
            this.categoriesCache = uniqueCategories
            return uniqueCategories
          }
        }
  
        // Guardar en caché
        this.categoriesCache = categories
        console.log(`${categories.length} categorías obtenidas`)
  
        return categories
      } catch (error) {
        console.error("Error al obtener categorías:", error)
        return []
      }
    },
  
    // Formatear precio en formato de moneda
    formatCurrency(price) {
      return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 2,
      }).format(price)
    },
  
    // Calcular el porcentaje de descuento
    calculateDiscount(originalPrice, currentPrice) {
      if (!originalPrice || !currentPrice || originalPrice <= currentPrice) {
        return 0
      }
  
      return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    },
  }
  
  export default ProductService  