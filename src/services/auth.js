import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


const API_URL = 'http://127.0.0.1:8000/api'; // API

const AuthService = {
  setAuthToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  },



  getToken: () => {
    return localStorage.getItem('token');
  },



   login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      if (response.data.authorisation.token) {
        AuthService.setAuthToken(response.data.authorisation.token);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  },



  register: async (username, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        username,
        email,
        password
      });
      if (response.data.authorisation.token) {
        AuthService.setAuthToken(response.data.authorisation.token);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw error;
    }
  },



  logout: async () => {
    try {
      await axios.post(`${API_URL}/logout`);
      AuthService.setAuthToken(null);
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      AuthService.setAuthToken(null);
    }
  },



  refreshToken: async () => {
    try {
      const response = await axios.post(`${API_URL}/refresh`);
      if (response.data.authorisation.token) {
        AuthService.setAuthToken(response.data.authorisation.token);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Erreur de rafraîchissement du token:', error);
      throw error;
    }
  },



  getCurrentUser: async () => {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Pas de token disponible');
    }
    
    try {
      // Ajouter explicitement le token aux headers pour cette requête
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      const response = await axios.get(`${API_URL}/me`, config);
      console.log('Utilisateur récupéré:', response.data);
      return response.data.user || response.data;
    } catch (error) {
      console.error('Erreur de récupération de l\'utilisateur:', error);
      throw error;
    }
  },



  isAuthenticated: () => {
    const token = AuthService.getToken();
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  }
};

export default AuthService;