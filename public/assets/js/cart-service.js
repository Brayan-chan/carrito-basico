import { doc, updateDoc, arrayUnion, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"

import { db } from "./firebase-config.js"
import AuthService from "./auth-service.js"

// Servicio de carrito de compras
const CartService = {
  // Carrito local (para usuarios no autenticados)
  localCart: [],

  // Inicializar el carrito
  async init() {
    // Cargar carrito desde localStorage si el usuario no está autenticado
    if (!AuthService.isAuthenticated()) {
      this.loadLocalCart()
    } else {
      // Si está autenticado, cargar desde Firestore
      await this.loadUserCart()
    }

    // Escuchar cambios en la autenticación
    window.addEventListener("authStateChanged", async (event) => {
      if (event.detail.user) {
        // Usuario inició sesión, migrar carrito local a Firestore
        if (this.localCart.length > 0) {
          await this.migrateLocalCartToUser()
        } else {
          // Cargar carrito del usuario
          await this.loadUserCart()
        }
      } else {
        // Usuario cerró sesión, cargar carrito local
        this.loadLocalCart()
      }
    })
  },

  // Cargar carrito desde localStorage
  loadLocalCart() {
    const savedCart = localStorage.getItem("shopzone_cart")
    if (savedCart) {
      try {
        this.localCart = JSON.parse(savedCart)
      } catch (e) {
        console.error("Error al cargar carrito local:", e)
        this.localCart = []
      }
    }
    this.dispatchCartEvent()
  },

  // Guardar carrito en localStorage
  saveLocalCart() {
    localStorage.setItem("shopzone_cart", JSON.stringify(this.localCart))
    this.dispatchCartEvent()
  },

  // Cargar carrito del usuario desde Firestore
  async loadUserCart() {
    if (!AuthService.currentUser) return

    try {
      const userDoc = await getDoc(doc(db, "usuarios", AuthService.currentUser.uid))
      if (userDoc.exists()) {
        this.localCart = userDoc.data().carrito || []
      } else {
        this.localCart = []
      }
      this.dispatchCartEvent()
    } catch (error) {
      console.error("Error al cargar carrito del usuario:", error)
    }
  },

  // Migrar carrito local a la cuenta del usuario
  async migrateLocalCartToUser() {
    if (!AuthService.currentUser || this.localCart.length === 0) return

    try {
      // Primero cargar el carrito actual del usuario
      const userDoc = await getDoc(doc(db, "usuarios", AuthService.currentUser.uid))
      let userCart = []

      if (userDoc.exists()) {
        userCart = userDoc.data().carrito || []
      }

      // Combinar carritos, evitando duplicados
      for (const item of this.localCart) {
        const existingItemIndex = userCart.findIndex((i) => i.productoId === item.productoId)

        if (existingItemIndex >= 0) {
          // Actualizar cantidad si el producto ya existe
          userCart[existingItemIndex].cantidad += item.cantidad
        } else {
          // Agregar nuevo producto
          userCart.push(item)
        }
      }

      // Actualizar en Firestore
      await updateDoc(doc(db, "usuarios", AuthService.currentUser.uid), {
        carrito: userCart,
      })

      // Actualizar carrito local
      this.localCart = userCart

      // Limpiar localStorage
      localStorage.removeItem("shopzone_cart")

      this.dispatchCartEvent()
    } catch (error) {
      console.error("Error al migrar carrito local:", error)
    }
  },

  // Agregar producto al carrito
  async addToCart(product, quantity = 1) {
    const cartItem = {
      productoId: product.id,
      nombre: product.title || product.nombre,
      precio: product.price || product.precio,
      imagen: product.images?.[0] || product.imagen,
      cantidad: quantity,
    }

    if (AuthService.isAuthenticated()) {
      // Usuario autenticado, guardar en Firestore
      try {
        // Verificar si el producto ya está en el carrito
        const userDoc = await getDoc(doc(db, "usuarios", AuthService.currentUser.uid))
        if (userDoc.exists()) {
          const userCart = userDoc.data().carrito || []
          const existingItem = userCart.find((item) => item.productoId === cartItem.productoId)

          if (existingItem) {
            // Actualizar cantidad
            await updateDoc(doc(db, "usuarios", AuthService.currentUser.uid), {
              carrito: userCart.map((item) =>
                item.productoId === cartItem.productoId ? { ...item, cantidad: item.cantidad + quantity } : item,
              ),
            })
          } else {
            // Agregar nuevo item
            await updateDoc(doc(db, "usuarios", AuthService.currentUser.uid), {
              carrito: arrayUnion(cartItem),
            })
          }

          // Actualizar carrito local
          await this.loadUserCart()
        }
      } catch (error) {
        console.error("Error al agregar producto al carrito:", error)
      }
    } else {
      // Usuario no autenticado, guardar en localStorage
      const existingItemIndex = this.localCart.findIndex((item) => item.productoId === cartItem.productoId)

      if (existingItemIndex >= 0) {
        // Actualizar cantidad
        this.localCart[existingItemIndex].cantidad += quantity
      } else {
        // Agregar nuevo item
        this.localCart.push(cartItem)
      }

      this.saveLocalCart()
    }

    return { success: true }
  },

  // Actualizar cantidad de un producto en el carrito
  async updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      return this.removeFromCart(productId)
    }

    if (AuthService.isAuthenticated()) {
      // Usuario autenticado, actualizar en Firestore
      try {
        const userDoc = await getDoc(doc(db, "usuarios", AuthService.currentUser.uid))
        if (userDoc.exists()) {
          const userCart = userDoc.data().carrito || []
          await updateDoc(doc(db, "usuarios", AuthService.currentUser.uid), {
            carrito: userCart.map((item) => (item.productoId === productId ? { ...item, cantidad: quantity } : item)),
          })

          // Actualizar carrito local
          await this.loadUserCart()
        }
      } catch (error) {
        console.error("Error al actualizar cantidad:", error)
        return { success: false, error: error.message }
      }
    } else {
      // Usuario no autenticado, actualizar en localStorage
      const itemIndex = this.localCart.findIndex((item) => item.productoId === productId)

      if (itemIndex >= 0) {
        this.localCart[itemIndex].cantidad = quantity
        this.saveLocalCart()
      }
    }

    return { success: true }
  },

  // Eliminar producto del carrito
  async removeFromCart(productId) {
    if (AuthService.isAuthenticated()) {
      // Usuario autenticado, eliminar de Firestore
      try {
        const userDoc = await getDoc(doc(db, "usuarios", AuthService.currentUser.uid))
        if (userDoc.exists()) {
          const userCart = userDoc.data().carrito || []
          const itemToRemove = userCart.find((item) => item.productoId === productId)

          if (itemToRemove) {
            await updateDoc(doc(db, "usuarios", AuthService.currentUser.uid), {
              carrito: userCart.filter((item) => item.productoId !== productId),
            })
          }

          // Actualizar carrito local
          await this.loadUserCart()
        }
      } catch (error) {
        console.error("Error al eliminar producto del carrito:", error)
        return { success: false, error: error.message }
      }
    } else {
      // Usuario no autenticado, eliminar de localStorage
      this.localCart = this.localCart.filter((item) => item.productoId !== productId)
      this.saveLocalCart()
    }

    return { success: true }
  },

  // Vaciar carrito
  async clearCart() {
    if (AuthService.isAuthenticated()) {
      // Usuario autenticado, vaciar en Firestore
      try {
        await updateDoc(doc(db, "usuarios", AuthService.currentUser.uid), {
          carrito: [],
        })

        // Actualizar carrito local
        this.localCart = []
        this.dispatchCartEvent()
      } catch (error) {
        console.error("Error al vaciar carrito:", error)
        return { success: false, error: error.message }
      }
    } else {
      // Usuario no autenticado, vaciar localStorage
      this.localCart = []
      this.saveLocalCart()
    }

    return { success: true }
  },

  // Obtener contenido del carrito
  getCart() {
    return this.localCart
  },

  // Obtener cantidad total de productos en el carrito
  getCartItemCount() {
    return this.localCart.reduce((total, item) => total + item.cantidad, 0)
  },

  // Obtener precio total del carrito
  getCartTotal() {
    return this.localCart.reduce((total, item) => total + item.precio * item.cantidad, 0)
  },

  // Disparar evento de cambio en el carrito
  dispatchCartEvent() {
    window.dispatchEvent(
      new CustomEvent("cartChanged", {
        detail: {
          cart: this.localCart,
          itemCount: this.getCartItemCount(),
          total: this.getCartTotal(),
        },
      }),
    )
  },
}

// Inicializar el carrito
CartService.init()

export default CartService
