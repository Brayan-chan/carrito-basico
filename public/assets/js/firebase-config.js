// Importar Firebase y sus módulos
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA_5IiaWrQbw5CrRYtOpnYYQ2aUpDpMUKE",
  authDomain: "carrito-compras-38f0f.firebaseapp.com",
  projectId: "carrito-compras-38f0f",
  storageBucket: "carrito-compras-38f0f.appspot.com",
  messagingSenderId: "139215439065",
  appId: "1:139215439065:web:7a7a588fcf7781ca3a6ac8",
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

// Configurar para trabajar offline
const firestoreSettings = {
  cacheSizeBytes: 50000000, // 50 MB
  ignoreUndefinedProperties: true,
}

// Exportar la configuración de Firebase
export { app, auth, db }