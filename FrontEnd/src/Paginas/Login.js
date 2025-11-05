import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      sessionStorage.setItem('usuario', response.data.name);
      alert('Login realizado com sucesso!');
      navigate('/produto');
    } catch (error) {
      alert('Email ou senha inválidos');
    }
  };

  return (
    <div style={pageContainer}>
      {/* Navbar */}
      <nav style={navStyle}>
        <div style={navBrand}>🔷 Estoque Fácil</div>
        <div style={navLinks}>
          <span style={navUser}>Sistema de Controle de Estoque</span>
        </div>
      </nav>

      <div style={card}>
        <h2 style={title}>Entrar no Sistema</h2>
        <p style={subtitle}>Controle de Estoque - ADS</p>

        <form onSubmit={handleLogin} style={form}>
          <div style={inputGroup}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              style={inputStyle}
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              required
              style={inputStyle}
            />
          </div>

          <button type="submit" style={btnPrimary}>Entrar</button>
        </form>

        <p style={linkSection}>
          Não tem conta?{' '}
          <a href="/usuario" style={link}>Cadastre-se</a>
        </p>
      </div>

      <footer style={footerStyle}>
        Sistema de Controle de Estoque - Projeto Acadêmico ADS
      </footer>
    </div>
  );
};


const pageContainer = {
  minHeight: '100vh',
  backgroundColor: '#f0f4f8',
  display: 'flex',
  flexDirection: 'column'
};

const navStyle = {
  padding: '12px 20px',
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #ddd',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const navBrand = {
  fontWeight: 'bold',
  color: '#003366',
  fontSize: '18px'
};

const navLinks = {
  display: 'flex',
  gap: '20px',
  alignItems: 'center'
};

const navUser = {
  color: '#555',
  fontSize: '14px'
};

const card = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '10px',
  width: '100%',
  maxWidth: '400px',
  margin: '40px auto',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  textAlign: 'center'
};

const title = {
  color: '#003366',
  marginBottom: '5px',
  fontSize: '24px'
};

const subtitle = {
  color: '#666',
  fontSize: '14px',
  marginBottom: '20px'
};

const form = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px'
};

const inputGroup = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start'
};

const labelStyle = {
  fontSize: '14px',
  color: '#555',
  marginBottom: '5px'
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  fontSize: '14px'
};

const btnPrimary = {
  background: '#003366',
  color: 'white',
  border: 'none',
  padding: '12px',
  borderRadius: '6px',
  fontSize: '16px',
  cursor: 'pointer',
  marginTop: '10px'
};

const linkSection = {
  marginTop: '20px',
  fontSize: '14px',
  color: '#555'
};

const link = {
  color: '#0066cc',
  textDecoration: 'none'
};

const footerStyle = {
  textAlign: 'center',
  padding: '20px 0',
  color: '#777',
  fontSize: '12px',
  borderTop: '1px solid #eee',
  backgroundColor: '#f8f9fa',
  marginTop: 'auto'
};

export default Login;