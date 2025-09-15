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
    
    // ✅ Pega o nome retornado pelo backend
    const nomeUsuario = response.data.name;

    if (!nomeUsuario) {
      alert('Erro: usuário sem nome');
      return;
    }

    // ✅ Salva o nome 
    sessionStorage.setItem('usuario', nomeUsuario);
    
    alert('Login realizado com sucesso!');
    navigate('/produto');
  } catch (error) {
    alert('Email ou senha inválidos');
  }
};

  return (
    <div style={pageContainer}>
      {}
      <div style={container}>
        <div style={card}>
          <h2 style={title}>Login</h2>

          <form onSubmit={handleLogin}>
            <div style={inputGroup}>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu email"
                required
                style={inputStyle}
              />
            </div>
            <div style={inputGroup}>
              <label>Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                required
                style={inputStyle}
              />
            </div>
            <button type="submit" style={buttonStyle}>Entrar</button>
          </form>

          {}
          <div style={linkSection}>
            <p>
              Não tem conta? <a href="/usuario" style={link}>Cadastre-se</a>
            </p>
          </div>
        </div>
      </div>

      {}
      <footer style={footerStyle}>
        Sistema de Controle de Estoque - Projeto Acadêmico ADS
      </footer>
    </div>
  );
};


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
  backgroundColor: '#1877f2',
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

export default Login;