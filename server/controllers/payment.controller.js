import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();

// Verificar que el token de acceso esté disponible
const accessToken = process.env.MP_ACCESS_TOKEN;
if (!accessToken) {
    console.error('⚠️ Error: No se ha configurado MP_ACCESS_TOKEN en las variables de entorno');
    console.error('Por favor, configura esta variable con tu token de acceso de Mercado Pago');
}

// Configurar MercadoPago con el token de acceso
const client = new MercadoPagoConfig({ 
    accessToken: accessToken || 'TEST-PLACEHOLDER-TOKEN'
});

export const createOrder = async (req, res) => {
    try {
        if (!accessToken) {
            return res.status(500).json({
                success: false,
                error: 'No se ha configurado el token de acceso de Mercado Pago',
                details: 'Configura la variable de entorno MP_ACCESS_TOKEN'
            });
        }

        // Obtener datos del carrito del request
        const { items, cartItems } = req.body || {};
        
        // Usar los items proporcionados o crear un item de prueba
        const orderItems = items || cartItems || [
            {
                title: 'Producto de prueba',
                unit_price: 5,
                currency_id: 'MXN',
                quantity: 1,
            }
        ];
        
        // Generar un ID de orden único
        const orderId = `order-${Date.now()}`;
        
        // Crear un objeto de preferencia
        const preference = new Preference(client);
        
        const result = await preference.create({
            body: {
                items: orderItems,
                back_urls: {
                    success: `${process.env.APP_URL || 'https://1518-189-174-45-243.ngrok-free.app'}/api/success`,
                    failure: `${process.env.APP_URL || 'https://1518-189-174-45-243.ngrok-free.app'}/api/failure`,
                    pending: `${process.env.APP_URL || 'https://1518-189-174-45-243.ngrok-free.app'}/api/pending`
                },
                auto_return: 'approved',
                notification_url: `${process.env.APP_URL || 'https://1518-189-174-45-243.ngrok-free.app'}/api/webhook`,
                external_reference: orderId
            }
        });

        console.log('✅ Preferencia creada exitosamente');
        console.log('🔗 URL de pago:', result.init_point);
        console.log('📝 ID de preferencia:', result.id);
        console.log('🛒 ID de orden:', orderId);
        
        // Devolver la URL de pago al cliente
        res.json({
            success: true,
            init_point: result.init_point,
            preference_id: result.id,
            order_id: orderId
        });
    } catch (error) {
        console.error('❌ Error al crear la orden:', error);
        
        // Mejorar el mensaje de error para problemas comunes
        let errorMessage = 'Error al crear la orden';
        let errorDetails = error.message;
        
        if (error.message.includes('invalid access token')) {
            errorMessage = 'Token de acceso inválido';
            errorDetails = 'El token de acceso proporcionado no es válido o ha expirado. Por favor, verifica tus credenciales de Mercado Pago.';
        }
        
        res.status(500).json({
            success: false,
            error: errorMessage,
            details: errorDetails
        });
    }
};

// Función para manejar webhooks de Mercado Pago
export const receiveWebhook = async (req, res) => {
    try {
        console.log('🔔 Webhook recibido');
        console.log('Query:', req.query);
        console.log('Body:', req.body);
        
        // Determinar el tipo de notificación
        let notificationType;
        let resourceId;
        
        // Verificar si es una notificación de pago
        if (req.query.type === 'payment' && req.body.data && req.body.data.id) {
            notificationType = 'payment';
            resourceId = req.body.data.id;
        } 
        // Verificar si es una notificación de merchant_order
        else if (req.query.topic === 'merchant_order' && req.query.id) {
            notificationType = 'merchant_order';
            resourceId = req.query.id;
        }
        // Otros tipos de notificaciones
        else if (req.body.type === 'payment' && req.body.data && req.body.data.id) {
            notificationType = 'payment';
            resourceId = req.body.data.id;
        }
        
        console.log(`Tipo de notificación: ${notificationType}, ID: ${resourceId}`);
        
        if (!notificationType || !resourceId) {
            console.log('Tipo de notificación no manejado:', notificationType);
            return res.status(200).send('OK - No procesado');
        }
        
        // Procesar según el tipo de notificación
        if (notificationType === 'payment') {
            try {
                // Obtener información del pago
                const paymentApi = new Payment(client);
                const paymentInfo = await paymentApi.get({ id: resourceId });
                
                console.log('💰 Información del pago recibida:');
                console.log('Estado:', paymentInfo.status);
                console.log('Monto:', paymentInfo.transaction_amount);
                console.log('ID de orden externa:', paymentInfo.external_reference);
                
                // Aquí vamos a actualizar la base de datos o realizar acciones según el estado del pago
                // Por ejemplo: actualizar el estado de la orden, enviar emails, etc.
                
                // Responder al webhook
                return res.status(200).send('OK');
            } catch (error) {
                console.error('❌ Error al procesar el pago:', error);
                return res.status(200).send('Error procesando pago');
            }
        } else if (notificationType === 'merchant_order') {
            // Procesar merchant_order si es necesario
            console.log('📦 Orden de comerciante recibida:', resourceId);
            return res.status(200).send('OK');
        }
        
        // Si llegamos aquí, es un tipo de notificación que no manejamos
        return res.status(200).send('OK - Tipo no manejado');
        
    } catch (error) {
        console.error('Error en el webhook:', error);
        // Siempre responder con 200 para que Mercado Pago no reintente
        return res.status(200).send('Error');
    }
};