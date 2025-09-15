import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const usuario = sessionStorage.getItem('usuario');

  React.useEffect(() => {
    if (!usuario) {
      alert('Acesso negado. Faça login.');
      navigate('/');
    }
  }, [usuario, navigate]);

  return usuario ? children : null;
};

export default ProtectedRoute;