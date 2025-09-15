import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Paginas/Login';
import Produto from './Paginas/Produto';
import Venda from './Paginas/Venda';
import Usuario from './Paginas/Usuario'; 
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/usuario" element={<Usuario />} /> {/* ✅ Rota de cadastro */}
        <Route path="/produto" element={<ProtectedRoute><Produto /></ProtectedRoute>} />
        <Route path="/venda" element={<ProtectedRoute><Venda /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;