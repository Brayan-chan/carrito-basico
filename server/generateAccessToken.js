import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const generateAccessToken = async () => {
    try {
        const response = await fetch('https://api.mercadopago.com/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
            }),
        });

        const data = await response.json();

        if (data.access_token) {
            console.log('✅ ACCESS_TOKEN generado con éxito:', data.access_token);
        } else {
            console.error('❌ Error al generar el ACCESS_TOKEN:', data);
        }
    } catch (error) {
        console.error('❌ Error al generar el ACCESS_TOKEN:', error);
    }
};

generateAccessToken();