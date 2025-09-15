import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Usuario = () => {
  const [dados, setDados] = useState({
    name: '',
    email: '',
    password: ''
  });
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
      alert('Falha ao cadastrar usuário. Tente novamente.');
    }
  };

  return (
    <div style={pageContainer}>
      {/* Container centralizado */}
      <div style={container}>
        <div style={card}>
          <h2 style={title}>Cadastrar Usuário</h2>

          <form onSubmit={handleSubmit}>
            <div style={inputGroup}>
              <label>Nome Completo</label>
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
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={dados.email}
                onChange={handleChange}
                placeholder="email@exemplo.com"
                required
                style={inputStyle}
              />
            </div>
            <div style={inputGroup}>
              <label>Senha</label>
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
            <button type="submit" style={buttonStyle}>Cadastrar</button>
          </form>

          <div style={linkSection}>
            <p>
              Já tem conta? <a href="/" style={link}>Faça login</a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer fixo embaixo */}
      <footer style={footerStyle}>
        Sistema de Controle de Estoque - Projeto Acadêmico ADS
      </footer>
    </div>
  );
};

// === ESTILOS ===
const pageContainer = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#f0f2f5'
};

const container = {
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px'
};

const card = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '8px',
  width: '100%',
  maxWidth: '400px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
};

const title = {
  textAlign: 'center',
  color: '#333',
  marginBottom: '20px'
};

const inputGroup = {
  marginBottom: '15px'
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '14px'
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#006600',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  fontSize: '16px',
  cursor: 'pointer'
};

const linkSection = {
  textAlign: 'center',
  marginTop: '20px',
  fontSize: '14px',
  color: '#555'
};

const link = {
  color: '#1877f2',
  textDecoration: 'none'
};

const footerStyle = {
  textAlign: 'center',
  margin: '20px 0 10px',
  fontSize: '12px',
  color: '#777'
};

export default Usuario;