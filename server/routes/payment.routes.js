// Importamos las dependencias necesarias
import { Router } from "express";

// Creamos la constante de la ruta
const router = Router();

// Tomenlo como ejemplo de endpoints para hacer CRUD

/* Ejemplos de uso de la ruta
router.get('/example', (req, res) => {
    res.send('Example');
});
router.post('/example', (req, res) => {
    res.send('Example');
});
router.put('/example', (req, res) => {
    res.send('Example');
});
router.delete('/example', (req, res) => {
    res.send('Example');
});
*/

router.get('/create-order', (req, res) => {
    res.send('Creating Order');
});

router.get('/success', (req, res) => {
    res.send('Success');
});

// Webhook sirve para recibir notificaciones de eventos de Mercado Pago
router.get('/webhook', (req, res) => {
    res.send('Webhook');
});

// Exportamos la constante
export default router;