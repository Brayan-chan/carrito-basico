// Tailwind config
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#5D5CDE',
                secondary: '#FFE600',
                accent: '#3483FA',
                dark: '#333333',
                light: '#EEEEEE'
            }
        }
    },
    darkMode: 'class'
}

// Deteccion de modo oscuro
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (event.matches) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
});
