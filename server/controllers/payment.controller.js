import { MercadoPagoConfig } from 'mercadopago';

// Configura MercadoPago
const mercadopago = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

export const createOrder = async (req, res) => {
    try {
        const result = await mercadopago.preference.create({
            body: {
                items: [
                    {
                        title: 'iPhone 16 Plus',
                        unit_price: 19000,
                        currency_id: 'MXN',
                        quantity: 1,
                    }
                ],
                back_urls: {
                    success: 'http://localhost:3000/success',
                    failure: 'http://localhost:3000/failure',
                    pending: 'http://localhost:3000/pending'
                },
                auto_return: 'approved'
            }
        });

        console.log(result);
        res.json({ init_point: result.init_point });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear la orden');
    }
};

export const receiveWebhook = async (req, res) => {
    try {
        console.log('Webhook recibido:', req.body);

        res.status(200).send('Webhook recibido exitosamente');
    } catch (error) {
        console.error('Error en el webhook:', error);
        res.status(500).send('Error en el webhook');
    }
};