import express from 'express';
import morgan from 'morgan';
import { PORT } from './config/config.js'; // movimos config.js a carpeta config
import paymentRoutes from './routes/payment.routes.js';

const app = express();

app.use(morgan('dev'));

// ¡Muy importante! Usar middleware para leer JSON
app.use(express.json());

// Prefijo /api
app.use('/api', paymentRoutes);

// Luego archivos públicos
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT} 🚀`);
});
