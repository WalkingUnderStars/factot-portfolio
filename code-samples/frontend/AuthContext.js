// ===============================
// Auth copntext - manage utilizatorul logat
// ===============================
// folosim react context ca sa avem access
// la utilizatorul logat din oprice pagina
// fara asta, ar trebuie sa passes props manual
// de la pagina la pagina

import React, { createContext, useState, useEffect } from 'react';
import { login as loginApi, register as registerApi, getMe } from '../api';

// Cream contextul
const AuthContext = createContext();

// Provider = wrapper care da acces la context
export const AuthProvider = ({ children }) => {
  // State-uri
  const [user, setUser] = useState(null); // Utilizaotrul logat
  const [loading, setLoading] = useState(true); // se incarca?
  const [error, setError] = useState(null);  // ERoare?

  // ===============================
  // check token - la pornirea siteului
  // ===============================
  // daca avem token in localstorage,
  // obtinem datele utilizatorului automat
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await getMe();
          setUser(response.data.data.user);
        } catch (err) {
          // Token invalid sau expirat
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkToken();
  }, []);

  // ===============================
  // register
  // ===============================
  const register = async (data) => {
    try {
      setError(null);
      const response = await registerApi(data);
      // Salvam token in localstorage
      localStorage.setItem('token', response.data.data.token);
      // Salvam utilizatorul
      setUser(response.data.data.user);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Eroare la register';
      setError(message);
      throw err;
    }
  };

  // ===============================
  // Login
  // ===============================
  const login = async (data) => {
    try {
      setError(null);
      const response = await loginApi(data);
      // Salvam token in locatStorage
      localStorage.setItem('token', response.data.data.token);
      // Salvam utilizatorul
      setUser(response.data.data.user);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Eroare la login';
      setError(message);
      throw err;
    }
  };

  // ===============================
  // logout
  // ===============================
  const logout = () => {
    localStorage.removeItem('token'); // sterge token
    setUser(null);           // Sterge utilizatorul
  };

  // Calori disponibile in tot app-ul
  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
