// Datos de ejemplo de productos (estos seran reemplazados de la API de productos)
const productsData = [
    {
        id: 1,
        title: "Smartphone XYZ Pro 128GB - Negro",
        price: 6749,
        originalPrice: 8999,
        discount: 25,
        description: "El Smartphone XYZ Pro combina un diseño elegante con un rendimiento excepcional. Con su potente procesador y 128GB de almacenamiento, tendrás todo el espacio que necesitas para tus aplicaciones, fotos y videos.",
        features: [
            "Pantalla AMOLED de 6.5 pulgadas",
            "Procesador Octa-core de última generación",
            "Cámara trasera triple de 64MP + 12MP + 5MP",
            "Batería de 4500mAh con carga rápida",
            "Resistente al agua y polvo (IP68)"
        ],
        images: [
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f8f8f8'/%3E%3Crect x='120' y='100' width='160' height='280' rx='20' ry='20' fill='%23333'/%3E%3Crect x='140' y='120' width='120' height='220' fill='%23666'/%3E%3Ccircle cx='200' cy='360' r='15' fill='%23444'/%3E%3C/svg%3E",
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f8f8f8'/%3E%3Crect x='120' y='100' width='160' height='280' rx='20' ry='20' fill='%23333'/%3E%3Crect x='140' y='120' width='120' height='220' fill='%23666'/%3E%3Ccircle cx='200' cy='360' r='15' fill='%23444'/%3E%3C/svg%3E",
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f8f8f8'/%3E%3Crect x='120' y='100' width='160' height='280' rx='20' ry='20' fill='%23333'/%3E%3Crect x='140' y='120' width='120' height='220' fill='%23666'/%3E%3Ccircle cx='200' cy='360' r='15' fill='%23444'/%3E%3C/svg%3E"
        ],
        freeShipping: true,
        stock: 15,
        rating: 4.5,
        reviews: 128,
        category: "Electrónica",
        subcategory: "Celulares"
    },
    {
        id: 2,
        title: "Auriculares Inalámbricos Bluetooth - Blanco",
        price: 1399,
        originalPrice: 1999,
        discount: 30,
        description: "Disfruta de un sonido excepcional con estos auriculares inalámbricos. Con tecnología Bluetooth 5.0 y cancelación de ruido, podrás sumergirte en tu música favorita sin distracciones.",
        features: [
            "Bluetooth 5.0 para una conexión estable",
            "Hasta 20 horas de reproducción",
            "Cancelación activa de ruido",
            "Resistentes al agua (IPX4)",
            "Micrófono integrado para llamadas"
        ],
        images: [
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f8f8f8'/%3E%3Ccircle cx='150' cy='200' r='60' fill='%23fff' stroke='%23ddd' stroke-width='10'/%3E%3Ccircle cx='250' cy='200' r='60' fill='%23fff' stroke='%23ddd' stroke-width='10'/%3E%3Cpath d='M150,140 C150,140 100,140 100,200 C100,260 150,260 150,260' fill='none' stroke='%23ddd' stroke-width='10'/%3E%3Cpath d='M250,140 C250,140 300,140 300,200 C300,260 250,260 250,260' fill='none' stroke='%23ddd' stroke-width='10'/%3E%3C/svg%3E",
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f8f8f8'/%3E%3Ccircle cx='150' cy='200' r='60' fill='%23fff' stroke='%23ddd' stroke-width='10'/%3E%3Ccircle cx='250' cy='200' r='60' fill='%23fff' stroke='%23ddd' stroke-width='10'/%3E%3Cpath d='M150,140 C150,140 100,140 100,200 C100,260 150,260 150,260' fill='none' stroke='%23ddd' stroke-width='10'/%3E%3Cpath d='M250,140 C250,140 300,140 300,200 C300,260 250,260 250,260' fill='none' stroke='%23ddd' stroke-width='10'/%3E%3C/svg%3E"
        ],
        freeShipping: true,
        stock: 42,
        rating: 4.2,
        reviews: 87,
        category: "Electrónica",
        subcategory: "Audio"
    },
    {
        id: 3,
        title: "Funda de silicona con MagSafe para el iPhone 16 Plus - Peonía",
        price: 59,
        originalPrice: 69,
        discount: 15,
        description: "Esta funda de silicona está diseñada por especialistas para adaptarse perfectamente a los botones, la silueta y las curvas de tu iPhone sin abultar prácticamente nada. El exterior de silicona es suave al tacto, y el interior está forrado de microfibra para proteger tu iPhone.",
        features: [
            "El exterior de silicona es suave al tacto",
            "El interior de microfibra protege tu iPhone",
            "Los imanes se alinean perfectamente con tu iPhone",
            "Compatible con cargadores MagSafe",
            "Diseñado para adaptarse perfectamente a tu dispositivo"
        ],
        images: [
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f8f8f8'/%3E%3Ccircle cx='200' cy='200' r='150' fill='%23ff9ff3'/%3E%3Crect x='150' y='120' width='100' height='160' rx='15' ry='15' fill='%23ff9ff3'/%3E%3Ccircle cx='180' cy='150' r='15' fill='%23f8f8f8'/%3E%3Crect x='170' y='240' width='60' height='10' rx='5' ry='5' fill='%23f8f8f8'/%3E%3C/svg%3E",
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f8f8f8'/%3E%3Cpath d='M250,200 L200,150 L150,200 L200,250 Z' fill='%23ff9ff3'/%3E%3Crect x='150' y='120' width='100' height='160' rx='15' ry='15' fill='%23ff9ff3'/%3E%3C/svg%3E",
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f8f8f8'/%3E%3Ccircle cx='200' cy='200' r='150' fill='%23ff9ff3'/%3E%3Cpath d='M200,100 L180,140 L220,140 Z' fill='%23f8f8f8'/%3E%3C/svg%3E"
        ],
        freeShipping: true,
        stock: 78,
        rating: 4.8,
        reviews: 128,
        category: "Accesorios",
        subcategory: "Fundas"
    }
];

// Función para obtener un producto por su ID
function getProductById(id) {
    return productsData.find(product => product.id === parseInt(id));
}

// Función para formatear precio en formato de moneda
function formatCurrency(price) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2
    }).format(price);
}

// Función para actualizar el título de la página
function updatePageTitle(productTitle) {
    document.title = `${productTitle} - ShopZone`;
}

// Función para actualizar el breadcrumb
function updateBreadcrumb(product) {
    const breadcrumbElement = document.querySelector('nav.flex.text-sm ol');
    if (!breadcrumbElement) return;

    // Crear el HTML del breadcrumb
    const breadcrumbHTML = `
        <li class="flex items-center">
            <a href="/" class="text-gray-500 dark:text-gray-400 hover:text-primary">Inicio</a>
            <svg class="h-4 w-4 mx-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
            </svg>
        </li>
        <li class="flex items-center">
            <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-primary">${product.category}</a>
            <svg class="h-4 w-4 mx-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
            </svg>
        </li>
        <li class="flex items-center">
            <a href="#" class="text-gray-500 dark:text-gray-400 hover:text-primary">${product.subcategory}</a>
            <svg class="h-4 w-4 mx-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
            </svg>
        </li>
        <li>
            <span class="text-gray-700 dark:text-gray-300">${product.title}</span>
        </li>
    `;

    breadcrumbElement.innerHTML = breadcrumbHTML;
}

// Función para actualizar la galería de imágenes
function updateProductImages(product) {
    const mainImageElement = document.getElementById('mainImage');
    const thumbnailsContainer = document.querySelector('.grid.grid-cols-6.gap-2');
    
    if (!mainImageElement || !thumbnailsContainer) return;

    // Actualizar imagen principal
    mainImageElement.src = product.images[0];
    mainImageElement.alt = product.title;

    // Actualizar miniaturas
    let thumbnailsHTML = '';
    product.images.forEach((image, index) => {
        thumbnailsHTML += `
            <div class="thumbnail ${index === 0 ? 'active' : ''} col-span-1 rounded-md overflow-hidden cursor-pointer" data-img="${image}">
                <img src="${image}" alt="${product.title} - Vista ${index + 1}" class="w-full h-full object-cover">
            </div>
        `;
    });

    // Rellenar con imágenes de ejemplo si hay menos de 6
    for (let i = product.images.length; i < 6; i++) {
        thumbnailsHTML += `
            <div class="thumbnail col-span-1 rounded-md overflow-hidden cursor-pointer" data-img="${product.images[0]}">
                <img src="${product.images[0]}" alt="${product.title} - Vista adicional" class="w-full h-full object-cover opacity-50">
            </div>
        `;
    }

    thumbnailsContainer.innerHTML = thumbnailsHTML;

    // Reinicializar los eventos de las miniaturas
    initializeThumbnailEvents();
}

// Función para actualizar la información del producto
function updateProductInfo(product) {
    // Actualizar título y precio
    const titleElement = document.querySelector('h1.text-2xl.font-bold');
    const priceElement = document.querySelector('span.text-2xl.font-bold');
    const originalPriceElement = document.querySelector('span.text-xs.text-gray-500.line-through');
    const discountElement = document.querySelector('div.absolute.top-2.left-2.bg-red-500');
    
    if (titleElement) titleElement.textContent = product.title;
    if (priceElement) priceElement.textContent = formatCurrency(product.price);
    
    // Actualizar precio original y descuento si existen
    if (originalPriceElement && product.originalPrice) {
        originalPriceElement.textContent = formatCurrency(product.originalPrice);
        originalPriceElement.classList.remove('hidden');
    } else if (originalPriceElement) {
        originalPriceElement.classList.add('hidden');
    }
    
    if (discountElement && product.discount) {
        discountElement.textContent = `-${product.discount}%`;
        discountElement.classList.remove('hidden');
    } else if (discountElement) {
        discountElement.classList.add('hidden');
    }

    // Actualizar descripción
    const descriptionElement = document.querySelector('.text-sm.text-gray-600.dark\\:text-gray-300.space-y-2');
    if (descriptionElement && product.description) {
        descriptionElement.innerHTML = `<p>${product.description}</p>`;
    }

    // Actualizar características
    const featuresElement = document.querySelector('ul.list-disc.list-inside.text-sm.text-gray-600.dark\\:text-gray-300.space-y-1');
    if (featuresElement && product.features) {
        featuresElement.innerHTML = product.features.map(feature => `<li>${feature}</li>`).join('');
    }

    // Actualizar valoraciones
    const ratingElements = document.querySelectorAll('.flex.items-center.mr-3 .fas.fa-star, .flex.items-center.mr-3 .fas.fa-star-half-alt');
    const reviewCountElement = document.querySelector('.flex.items-center.mr-3 + span');
    
    if (ratingElements.length > 0 && product.rating) {
        // Implementar lógica para mostrar estrellas según la valoración
    }
    
    if (reviewCountElement && product.reviews) {
        reviewCountElement.textContent = `(${product.reviews})`;
    }
}

// Función para inicializar eventos de las miniaturas
function initializeThumbnailEvents() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImg = document.getElementById('mainImage');
    
    if (!thumbnails.length || !mainImg) return;

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Actualizar estado activo
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Actualizar imagen principal
            const imgSrc = this.getAttribute('data-img');
            
            // Animación de fade
            mainImg.style.opacity = 0;
            setTimeout(() => {
                mainImg.src = imgSrc;
                mainImg.style.opacity = 1;
            }, 200);
        });
    });
}

// Función principal para cargar los detalles del producto
function loadProductDetails() {
    // Obtener el ID del producto de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        console.error('ID de producto no especificado');
        // Redirigir a la página principal o mostrar un mensaje de error
        window.location.href = '/';
        return;
    }
    
    // Obtener los datos del producto
    const product = getProductById(parseInt(productId));
    
    if (!product) {
        console.error('Producto no encontrado');
        // Redirigir a la página principal o mostrar un mensaje de error
        window.location.href = '/';
        return;
    }
    
    // Actualizar la página con los detalles del producto
    updatePageTitle(product.title);
    updateBreadcrumb(product);
    updateProductImages(product);
    updateProductInfo(product);
    
    // Inicializar eventos
    initializeThumbnailEvents();
    
    console.log('Detalles del producto cargados:', product.title);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', loadProductDetails);

// Función para manejar el botón de añadir al carrito
function initializeAddToCartButton() {
    const addToCartButton = document.querySelector('button.w-full.bg-primary');
    
    if (!addToCartButton) return;
    
    addToCartButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Obtener el ID del producto actual
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        if (!productId) return;
        
        // Aquí iría la lógica para añadir al carrito
        // Por ahora, solo mostramos un mensaje en la consola
        console.log('Producto añadido al carrito:', productId);
        
        // Animación de confirmación
        const originalText = addToCartButton.innerHTML;
        addToCartButton.innerHTML = '<i class="fas fa-check mr-2"></i>Añadido';
        addToCartButton.classList.add('bg-green-600');
        
        setTimeout(() => {
            addToCartButton.innerHTML = originalText;
            addToCartButton.classList.remove('bg-green-600');
        }, 2000);
    });
}

// Inicializar el botón de añadir al carrito cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeAddToCartButton);