// Importar el módulo Express
import express from 'express';

// Crear una instancia de la aplicación Express
const app = express();

// Servir archivos estáticos desde el directorio "public"
app.use(express.static('public'));

// Configurar el puerto en el que el servidor escuchará
const PORT = 3000;

// Iniciar el servidor y escuchar en el puerto especificado
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});