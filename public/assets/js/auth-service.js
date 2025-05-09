import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"

import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"

import { auth, db } from "./firebase-config.js"

// Servicio de autenticación
const AuthService = {
  // Estado actual del usuario
  currentUser: null,
  userRole: null,
  authInitialized: false,

  // Observador de cambios en la autenticación
  initAuthListener() {
    console.log("Inicializando observador de autenticación")

    // Configurar persistencia de sesión
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log("Persistencia de sesión configurada correctamente")
      })
      .catch((error) => {
        console.error("Error al configurar persistencia:", error)
      })

    onAuthStateChanged(auth, async (user) => {
      console.log("Estado de autenticación cambiado:", user ? user.email : "No autenticado")

      if (user) {
        this.currentUser = user
        // Obtener el rol del usuario desde Firestore
        await this.getUserRole()
        // Disparar evento de cambio de autenticación
        this.dispatchAuthEvent({
          type: "AUTH_STATE_CHANGED",
          user: this.currentUser,
          role: this.userRole,
        })
      } else {
        this.currentUser = null
        this.userRole = null
        // Disparar evento de cambio de autenticación
        this.dispatchAuthEvent({
          type: "AUTH_STATE_CHANGED",
          user: null,
          role: null,
        })
      }

      this.authInitialized = true
    })
  },

  // Registrar un nuevo usuario
  async register(email, password, name) {
    try {
      console.log("Intentando registrar usuario:", email)
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Actualizar el perfil con el nombre
      await updateProfile(user, {
        displayName: name,
      })

      // Crear documento de usuario en Firestore
      await setDoc(doc(db, "usuarios", user.uid), {
        nombre: name,
        email: email,
        rol: "cliente", // Por defecto, todos los usuarios nuevos son clientes
        fechaRegistro: serverTimestamp(),
        direcciones: [],
        carrito: [],
        guardados: [],
        historialPedidos: [],
        metodoPago: [],
        notificaciones: [],
      })

      // También crear entrada en la colección de clientes
      await setDoc(doc(db, "clientes", user.uid), {
        usuarioId: user.uid,
        fechaRegistro: serverTimestamp(),
        comprasTotales: 0,
        estado: "activo",
      })

      console.log("Usuario registrado exitosamente:", user.email)
      return { success: true, user }
    } catch (error) {
      console.error("Error al registrar usuario:", error)
      return { success: false, error: error.message }
    }
  },

  // Iniciar sesión
  async login(email, password) {
    try {
      console.log("Intentando iniciar sesión:", email)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log("Inicio de sesión exitoso:", userCredential.user.email)
      return { success: true, user: userCredential.user }
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      return { success: false, error: error.message }
    }
  },

  // Cerrar sesión
  async logout() {
    try {
      console.log("Cerrando sesión")
      await signOut(auth)
      console.log("Sesión cerrada exitosamente")
      return { success: true }
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      return { success: false, error: error.message }
    }
  },

  // Restablecer contraseña
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email)
      return { success: true }
    } catch (error) {
      console.error("Error al enviar correo de restablecimiento:", error)
      return { success: false, error: error.message }
    }
  },

  // Obtener el rol del usuario actual
  async getUserRole() {
    if (!this.currentUser) {
      console.warn("No hay un usuario autenticado.");
      return null;
    }

    try {
      console.log("Obteniendo rol del usuario:", this.currentUser.uid);
      const userDoc = await getDoc(doc(db, "usuarios", this.currentUser.uid));
      if (userDoc.exists()) {
        this.userRole = userDoc.data().rol;
        console.log("Rol del usuario:", this.userRole);
        return this.userRole;
      }
      console.warn("Documento de usuario no encontrado en Firestore.");
      return null;
    } catch (error) {
      console.error("Error al obtener rol de usuario:", error);
      return null;
    }
  },

  // Verificar si el usuario es administrador
  isAdmin() {
    return this.userRole === "admin"
  },

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    return !!this.currentUser
  },

  // Verificar autenticación con retardo
  checkAuthWithDelay(callback, delay = 1000) {
    console.log("Verificando autenticación con retardo...")
    setTimeout(() => {
      console.log("Estado de autenticación:", this.isAuthenticated() ? "Autenticado" : "No autenticado")
      callback(this.isAuthenticated(), this.currentUser)
    }, delay)
  },

  // Disparar eventos de autenticación para que otros componentes puedan escucharlos
  dispatchAuthEvent(detail) {
    console.log("Disparando evento authStateChanged:", detail)
    window.dispatchEvent(new CustomEvent("authStateChanged", { detail }))
  },
}

// Inicializar el observador de autenticación
AuthService.initAuthListener()

export default AuthService