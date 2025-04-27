document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar todas las tarjetas de producto
    const productCards = document.querySelectorAll('.product-card');
    
    // Asignar IDs a cada producto (en un proyecto real, estos vendrían de la base de datos)
    const productIds = {
        "Smartphone XYZ Pro 128GB - Negro": 1,
        "Auriculares Inalámbricos Bluetooth - Blanco": 2,
        "Laptop Ultra Delgada 14 8GB RAM 256GB SSD": 3,
        "Camiseta Premium Algodón - Varios Colores": 4,
        "Licuadora de Alto Rendimiento 1000W": 5,
        "Smart TV 4K 55 UHD": 6,
        "Silla Ergonómica para Oficina": 7,
        "Cafetera Automática Programable": 8,
        "Tenis Deportivos - Negro": 9,
        "Libro - Bestseller Internacional": 10,
        "Cámara Digital 24MP con Zoom": 11,
        "Funda de silicona con MagSafe para el iPhone 16 Plus - Peonía": 3
    };
    
    // Modificar cada enlace para que apunte a la página de detalles con el ID correcto
    productCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obtener el título del producto
            const productTitle = card.querySelector('h3')?.textContent.trim();
            
            if (productTitle && productIds[productTitle]) {
                // Redirigir a la página de detalles con el ID del producto
                window.location.href = `/views/detalles_producto.html?id=${productIds[productTitle]}`;
            } else {
                // Si no se encuentra el ID, redirigir a la página de detalles con un ID predeterminado
                window.location.href = '/views/detalles_producto.html?id=1';
            }
        });
    });
});