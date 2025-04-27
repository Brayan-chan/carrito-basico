import { Router } from "express";
import { createOrder, receiveWebhook } from "../controllers/payment.controller.js";

const router = Router();

// Ruta POST para crear una orden
router.post('/create-order', createOrder);

// Ruta GET para recibir el éxito del pago
router.get('/success', (req, res) => {
    res.send('Pago exitoso! Gracias por tu compra.');
});

// Ruta GET para recibir el fracaso del pago
router.get('/failure', (req, res) => {
    res.send('El pago ha fallado. Por favor, intenta de nuevo.');
});

// Ruta GET para recibir el estado pendiente del pago
router.get('/pending', (req, res) => {
    res.send('El pago está pendiente de confirmación.');
});

// Ruta GET para recibir webhooks (Mercado Pago envía notificaciones por GET)
router.get('/webhook', receiveWebhook);
// También mantener la ruta POST para compatibilidad
router.post('/webhook', receiveWebhook);

export default router;