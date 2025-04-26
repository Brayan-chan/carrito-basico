// Importar el módulo Express
import express from 'express';

// Importamos Morgan
import morgan from 'morgan';

// Importar el módulo de configuración
import {PORT} from './config.js';

// Cambiar la ruta para que apunte al archivo correcto
import paymentRoutes from './routes/payment.routes.js';

// Crear una instancia de la aplicación Express
const app = express();

// Configurar Morgan para registrar las solicitudes HTTP
app.use(morgan('dev'));

// Servir archivos estáticos desde el directorio "public"
app.use(express.static('public'));
app.use(paymentRoutes);

// Configurar el puerto en el que el servidor escuchará
const port = (PORT);

// Iniciar el servidor y escuchar en el puerto especificado
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});