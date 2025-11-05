import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Usuario = () => {
  const [dados, setDados] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDados({ ...dados, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dados.name || !dados.email || !dados.password) {
      alert('Preencha todos os campos');
      return;
    }

    try {
      const response = await api.post('/auth/register', dados);
      if (response.data.code === 1) {
        alert('Usuário cadastrado com sucesso!');
        navigate('/');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert('Falha ao cadastrar usuário');
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
        <h2 style={title}>Criar Conta</h2>
        <p style={subtitle}>Preencha seus dados</p>

        <form onSubmit={handleSubmit} style={form}>
          <div style={inputGroup}>
            <label style={labelStyle}>Nome Completo</label>
            <input
              type="text"
              name="name"
              value={dados.name}
              onChange={handleChange}
              placeholder="Seu nome"
              required
              style={inputStyle}
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              name="email"
              value={dados.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              required
              style={inputStyle}
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Senha</label>
            <input
              type="password"
              name="password"
              value={dados.password}
              onChange={handleChange}
              placeholder="Sua senha"
              required
              style={inputStyle}
            />
          </div>

          <button type="submit" style={btnSuccess}>Cadastrar</button>
        </form>

        <p style={linkSection}>
          Já tem conta?{' '}
          <a href="/" style={link}>Faça login</a>
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

const btnSuccess = {
  background: '#006600',
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

export default Usuario;