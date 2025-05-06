import AuthService from './auth-service.js';

// Clase para manejar la autenticación en las solicitudes
const AuthHandler = {
  // Obtener el token de autenticación actual
  async getAuthToken() {
    if (!AuthService.isAuthenticated()) {
      return null;
    }
    
    try {
      return await AuthService.currentUser.getIdToken();
    } catch (error) {
      console.error('Error al obtener token de autenticación:', error);
      return null;
    }
  },
  
  // Agregar token de autenticación a las cabeceras de una solicitud
  async getAuthHeaders() {
    const token = await this.getAuthToken();
    
    if (!token) {
      return {};
    }
    
    return {
      'Authorization': `Bearer ${token}`
    };
  },
  
  // Realizar una solicitud autenticada
  async fetchWithAuth(url, options = {}) {
    const authHeaders = await this.getAuthHeaders();
    
    const mergedOptions = {
      ...options,
      headers: {
        ...options.headers,
        ...authHeaders,
        'Content-Type': 'application/json'
      }
    };
    
    return fetch(url, mergedOptions);
  }
};

export default AuthHandler; 