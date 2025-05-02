const express = require('express');
const cors = require('cors');
const app = express();
const productosRouter = require('./routes/productos');

const PORT = 3000;

app.use(cors());
app.use(express.json());

// Usar rutas RESTful bajo /api
app.use('/api/productos', productosRouter);

// Ruta raíz
app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API de productos! Usa /api/productos para ver los productos.');
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

