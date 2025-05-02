// routes/productos.js
const express = require('express');
const router = express.Router();

// Simulación de base de datos en memoria
let productos = [
  { id: 1, nombre: 'Laptop', precio: 1200, stock: 5, imagenUrl: 'https://via.placeholder.com/150' },
  { id: 2, nombre: 'Ratón', precio: 25, stock: 0, imagenUrl: 'https://via.placeholder.com/150' },
  { id: 3, nombre: 'Teclado', precio: 50, stock: 3, imagenUrl: 'https://via.placeholder.com/150' }
];

// Middleware para marcar si el producto está agotado
function actualizarAgotado(producto) {
  return {
    ...producto,
    agotado: producto.stock === 0
  };
}

// Middleware de autenticación básica usando header "x-api-key"
const verificarAdmin = (req, res, next) => {
  const token = req.header('x-api-key');

  // Aquí definimos nuestra "clave mágica"
  const API_KEY_ADMIN = 'admin123';

  if (token === API_KEY_ADMIN) {
    next(); // tiene permiso
  } else {
    res.status(403).json({ mensaje: 'No autorizado. Proporcione una API Key válida.' });
  }
};

// GET /api/productos - Público
router.get('/', (req, res) => {
  const productosConEstado = productos.map(actualizarAgotado);
  res.json(productosConEstado);
});

// POST /api/productos - Solo admin
router.post('/', verificarAdmin, (req, res) => {
  const { nombre, precio, stock, imagenUrl } = req.body;
  if (!nombre || precio == null || stock == null || !imagenUrl) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios.' });
  }

  const nuevoProducto = {
    id: productos.length ? productos[productos.length - 1].id + 1 : 1,
    nombre,
    precio,
    stock,
    imagenUrl
  };

  productos.push(nuevoProducto);
  res.status(201).json(actualizarAgotado(nuevoProducto));
});

// PUT /api/productos/:id - Solo admin
router.put('/:id', verificarAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, precio, stock, imagenUrl } = req.body;
  const producto = productos.find(p => p.id === id);

  if (producto) {
    producto.nombre = nombre ?? producto.nombre;
    producto.precio = precio ?? producto.precio;
    producto.stock = stock ?? producto.stock;
    producto.imagenUrl = imagenUrl ?? producto.imagenUrl;
    res.json(actualizarAgotado(producto));
  } else {
    res.status(404).json({ mensaje: 'Producto no encontrado' });
  }
});

// DELETE /api/productos/:id - Solo admin
router.delete('/:id', verificarAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  const index = productos.findIndex(p => p.id === id);
  if (index !== -1) {
    const eliminado = productos.splice(index, 1);
    res.json(actualizarAgotado(eliminado[0]));
  } else {
    res.status(404).json({ mensaje: 'Producto no encontrado' });
  }
});

module.exports = route
