import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateProfile
  } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
  
  import { 
    doc, 
    setDoc, 
    getDoc, 
    serverTimestamp 
  } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
  
  import { auth, db } from "./firebase-config.js";
  
  // Servicio de autenticación
  const AuthService = {
    // Estado actual del usuario
    currentUser: null,
    userRole: null,
    
    // Observador de cambios en la autenticación
    initAuthListener() {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          this.currentUser = user;
          // Obtener el rol del usuario desde Firestore
          await this.getUserRole();
          // Disparar evento de cambio de autenticación
          this.dispatchAuthEvent({ 
            type: 'AUTH_STATE_CHANGED', 
            user: this.currentUser, 
            role: this.userRole 
          });
        } else {
          this.currentUser = null;
          this.userRole = null;
          // Disparar evento de cambio de autenticación
          this.dispatchAuthEvent({ 
            type: 'AUTH_STATE_CHANGED', 
            user: null, 
            role: null 
          });
        }
      });
    },
    
    // Registrar un nuevo usuario
    async register(email, password, name) {
      try {
        // Crear usuario en Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Actualizar el perfil con el nombre
        await updateProfile(user, {
          displayName: name
        });
        
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
          notificaciones: []
        });
        
        // También crear entrada en la colección de clientes
        await setDoc(doc(db, "clientes", user.uid), {
          usuarioId: user.uid,
          fechaRegistro: serverTimestamp(),
          comprasTotales: 0,
          estado: "activo"
        });
        
        return { success: true, user };
      } catch (error) {
        console.error("Error al registrar usuario:", error);
        return { success: false, error: error.message };
      }
    },
    
    // Iniciar sesión
    async login(email, password) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        return { success: false, error: error.message };
      }
    },
    
    // Cerrar sesión
    async logout() {
      try {
        await signOut(auth);
        return { success: true };
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        return { success: false, error: error.message };
      }
    },
    
    // Restablecer contraseña
    async resetPassword(email) {
      try {
        await sendPasswordResetEmail(auth, email);
        return { success: true };
      } catch (error) {
        console.error("Error al enviar correo de restablecimiento:", error);
        return { success: false, error: error.message };
      }
    },
    
    // Obtener el rol del usuario actual
    async getUserRole() {
      if (!this.currentUser) return null;
      
      try {
        const userDoc = await getDoc(doc(db, "usuarios", this.currentUser.uid));
        if (userDoc.exists()) {
          this.userRole = userDoc.data().rol;
          return this.userRole;
        }
        return null;
      } catch (error) {
        console.error("Error al obtener rol de usuario:", error);
        return null;
      }
    },
    
    // Verificar si el usuario es administrador
    isAdmin() {
      return this.userRole === "admin";
    },
    
    // Verificar si el usuario está autenticado
    isAuthenticated() {
      return !!this.currentUser;
    },
    
    // Disparar eventos de autenticación para que otros componentes puedan escucharlos
    dispatchAuthEvent(detail) {
      window.dispatchEvent(new CustomEvent('authStateChanged', { detail }));
    }
  };
  
  // Inicializar el observador de autenticación
  AuthService.initAuthListener();
  
  export default AuthService;