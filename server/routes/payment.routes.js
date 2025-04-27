import { Router } from "express";
import { createOrder, receiveWebhook } from "../controllers/payment.controller.js";

const router = Router();

// ¡Usar POST para crear orden!
router.post('/create-order', createOrder);

router.get('/success', (req, res) => {
    res.send('Success');
});

// Webhook ahora con POST
router.post('/webhook', receiveWebhook);

export default router;