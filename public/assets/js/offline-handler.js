// Manejador para detectar estado de conexión
const OfflineHandler = {
    isOnline: true,
  
    init() {
      // Verificar estado inicial
      this.isOnline = navigator.onLine
      console.log("Estado de conexión inicial:", this.isOnline ? "Online" : "Offline")
  
      // Escuchar cambios en la conexión
      window.addEventListener("online", () => {
        console.log("Conexión restablecida")
        this.isOnline = true
        this.showConnectionStatus(true)
  
        // Disparar evento personalizado
        window.dispatchEvent(
          new CustomEvent("connectionChanged", {
            detail: { online: true },
          }),
        )
      })
  
      window.addEventListener("offline", () => {
        console.log("Conexión perdida")
        this.isOnline = false
        this.showConnectionStatus(false)
  
        // Disparar evento personalizado
        window.dispatchEvent(
          new CustomEvent("connectionChanged", {
            detail: { online: false },
          }),
        )
      })
  
      // Mostrar estado inicial si está offline
      if (!this.isOnline) {
        this.showConnectionStatus(false)
      }
    },
  
    // Mostrar notificación de estado de conexión
    showConnectionStatus(isOnline) {
      // Eliminar notificación existente si hay alguna
      const existingNotification = document.getElementById("connection-notification")
      if (existingNotification) {
        document.body.removeChild(existingNotification)
      }
  
      // Si está online, solo mostrar brevemente un mensaje de confirmación
      if (isOnline) {
        const notification = document.createElement("div")
        notification.id = "connection-notification"
        notification.className = "fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50"
        notification.textContent = "Conexión restablecida"
  
        document.body.appendChild(notification)
  
        // Eliminar después de 3 segundos
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification)
          }
        }, 3000)
      } else {
        // Si está offline, mostrar una notificación permanente
        const notification = document.createElement("div")
        notification.id = "connection-notification"
        notification.className = "fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50"
        notification.innerHTML = '<i class="fas fa-wifi mr-2"></i> Sin conexión - Modo offline'
  
        document.body.appendChild(notification)
      }
    },
  }
  
  // Inicializar el manejador
  document.addEventListener("DOMContentLoaded", () => {
    OfflineHandler.init()
  })
  
  export default OfflineHandler  