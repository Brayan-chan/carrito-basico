const express = require('express');
const cors = require('cors');
const app = express();
const productosRouter = require('./routes/productos');

const PORT = 3000;

// Formateo bonito de JSON
app.set('json spaces', 2);

// CORS controlado (ajusta el dominio real de tu tienda)
app.use(cors({
  origin: 'https://mitienda.com'  // 👉 cámbialo por tu dominio real
}));

app.use(express.json());

// Usar rutas RESTful bajo /api
app.use('/api/productos', productosRouter);

// Ruta raíz redirige al JSON de productos
app.get('/', (req, res) => {
  res.redirect('/api/productos');
});


// Manejo global de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
