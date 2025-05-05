// Servicio para manejar pagos con Mercado Pago
const PaymentService = {
    // Crear una orden de pago
    async createOrder(orderData) {
      try {
        const response = await fetch("/api/create-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        })
  
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`)
        }
  
        const data = await response.json()
  
        if (data.success) {
          return {
            success: true,
            initPoint: data.init_point,
            preferenceId: data.preference_id,
            orderId: data.order_id,
          }
        } else {
          return {
            success: false,
            error: data.error || "Error al crear la orden",
            details: data.details,
          }
        }
      } catch (error) {
        console.error("Error al crear orden de pago:", error)
        return {
          success: false,
          error: "Error de conexión",
          details: error.message,
        }
      }
    },
  
    // Verificar el estado de un pago
    async checkPaymentStatus(paymentId) {
      try {
        const response = await fetch(`/api/payment-status?payment_id=${paymentId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
  
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`)
        }
  
        return await response.json()
      } catch (error) {
        console.error("Error al verificar estado del pago:", error)
        return {
          success: false,
          error: "Error de conexión",
          details: error.message,
        }
      }
    },
  }
  
  export default PaymentService  