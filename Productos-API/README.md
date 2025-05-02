
# 🛒 Productos API - Productos REST API

API REST simple para la gestión de productos, inspirada en la API de la NASA. Permite consultar productos, y para usuarios autenticados (mediante una clave API), también agregar, actualizar y eliminar productos.

---

## 🔧 Tecnologías utilizadas

- Node.js
- Express.js
- CORS
- API Key simple para autenticación

---

## 📁 Estructura del proyecto

```
productos-API/
├── index.js
├── package.json
├── routes/
│   └── productos.js
```

---

## 🚀 Cómo ejecutar el proyecto localmente

### 1. Clona este repositorio

```bash
git clone https://github.com/tu-usuario/carrito-API.git
cd carrito-API
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Ejecuta la API

```bash
npm start
```

La API estará disponible en:  
👉 `http://localhost:3000`

---

## 📡 Rutas disponibles

### ✅ Pública

- **GET** `/api/productos`  
  Devuelve todos los productos. También indica si están agotados (`agotado: true/false`).

---

### 🔐 Requiere autenticación (`x-api-key: admin123`)

- **POST** `/api/productos`  
  Agrega un nuevo producto.  
  Requiere body con: `nombre`, `precio`, `stock`, `imagenUrl`.

- **PUT** `/api/productos/:id`  
  Actualiza un producto existente.

- **DELETE** `/api/productos/:id`  
  Elimina un producto por su `id`.

---

## 🔐 Autenticación por API Key

Para rutas protegidas, debes enviar el siguiente header:

```
x-api-key: admin123
```

> Esta autenticación es básica y solo de prueba. No usar en producción real.

---

## 📷 Imágenes de productos

Puedes usar URLs públicas, por ejemplo desde [Cloudinary](https://cloudinary.com/), en el campo `imagenUrl` al crear o editar productos.

---

## ✍️ Ejemplo de producto

```json
{
  "nombre": "Monitor",
  "precio": 350,
  "stock": 10,
  "imagenUrl": "https://res.cloudinary.com/tu_usuario/image/upload/v12345/monitor.jpg"
}
```

---

## 📦 Estado de stock

Cada producto incluirá:

```json
"agotado": true // o false, dependiendo del stock
```

---

## 🧪 Ejemplo de fetch con API Key (desde el frontend)

```js
fetch('http://localhost:3000/api/productos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'admin123'
  },
  body: JSON.stringify({
    nombre: 'Tablet',
    precio: 250,
    stock: 4,
    imagenUrl: 'https://res.cloudinary.com/usuario/image/upload/tablet.jpg'
  })
});
```

---



## 💬 Créditos

  
Inspirado en el modelo de la NASA "Picture of the Day API"
