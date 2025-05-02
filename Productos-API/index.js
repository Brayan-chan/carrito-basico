const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let productos = [
  { id: 1, nombre: 'Laptop', precio: 1200, imagenUrl: 'https://via.placeholder.com/150' },
  { id: 2, nombre: 'Mouse', precio: 25, imagenUrl: 'https://via.placeholder.com/150' },
  { id: 3, nombre: 'Teclado', precio: 50, imagenUrl: 'https://via.placeholder.com/150' }
];

// GET - Obtener todos los productos
app.get('/productos', (req, res) => {
  res.json(productos);
});

// POST - Agregar producto
app.post('/productos', (req, res) => {
  const { nombre, precio, imagenUrl } = req.body;
  const nuevoProducto = {
    id: productos.length ? productos[productos.length - 1].id + 1 : 1,
    nombre,
    precio,
    imagenUrl
  };
  productos.push(nuevoProducto);
  res.status(201).json(nuevoProducto);
});

// PUT - Actualizar producto
app.put('/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, precio, imagenUrl } = req.body;
  const producto = productos.find(p => p.id === id);
  if (producto) {
    producto.nombre = nombre;
    producto.precio = precio;
    producto.imagenUrl = imagenUrl;
    res.json(producto);
  } else {
    res.status(404).json({ mensaje: 'Producto no encontrado' });
  }
});

// DELETE - Eliminar producto
app.delete('/productos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = productos.findIndex(p => p.id === id);
  if (index !== -1) {
    const eliminado = productos.splice(index, 1);
    res.json(eliminado[0]);
  } else {
    res.status(404).json({ mensaje: 'Producto no encontrado' });
  }
});

// Ruta raíz
app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API del carrito! Usa /productos para ver los productos.');
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
