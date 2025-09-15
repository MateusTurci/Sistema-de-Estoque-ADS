import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Produto = () => {
  const [values, setValues] = useState({ name: '', quantidade: '', valor: '' });
  const [produtos, setProdutos] = useState([]);

  // Função para alterar os valores dos inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  // Cadastrar ou atualizar produto
  const handleSubmit = async (e) => {
    e.preventDefault();
    const nome = values.name.trim();
    const quantidade = parseInt(values.quantidade);
    const valor = parseFloat(values.valor) || 0;

    if (!nome || isNaN(quantidade) || quantidade < 0) {
      alert('Preencha todos os campos corretamente');
      return;
    }

    try {
      await api.post('/cadastroProduto', {
        nameProduto: nome,
        quantidadeProduto: quantidade,
        valor: valor
      });
      alert('Produto cadastrado ou atualizado');
      setValues({ name: '', quantidade: '', valor: '' });
      carregarProdutos();
    } catch (error) {
      alert('Erro ao cadastrar produto');
    }
  };

  // Excluir produto
  const handleDelete = async (nameProduto) => {
    if (window.confirm(`Excluir o produto ${nameProduto}?`)) {
      try {
        await api.delete(`/produto?nameProduto=${encodeURIComponent(nameProduto)}`);
        alert('Produto excluído');
        carregarProdutos();
      } catch (error) {
        alert('Erro ao excluir');
      }
    }
  };

  // Carregar produtos do backend
  const carregarProdutos = async () => {
    try {
      const response = await api.get('/produtos');
      setProdutos(response.data || []);
    } catch (error) {
      console.log('Erro ao carregar produtos');
    }
  };

  // Carrega ao abrir a página
  useEffect(() => {
    carregarProdutos();
  }, []);

  return (
    <div>
      {/* Nav*/}
      <nav style={navStyle}>
        <div style={{ fontWeight: 'bold', color: '#003366' }}>🔷 Estoque Fácil</div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <a href="/produto" style={linkStyle}>Produtos</a>
          <a href="/venda" style={linkStyle}>Vendas</a>
          <span>Olá, {sessionStorage.getItem('usuario')}</span>
          <button
            onClick={() => {
              sessionStorage.removeItem('usuario');
              window.location.href = '/';
            }}
            style={logoutButton}
          >
            Sair
          </button>
        </div>
      </nav>

      <div style={container}>
        <h2 style={title}>Cadastro de Produtos</h2>

        <form onSubmit={handleSubmit} style={form}>
          <div style={inputGroup}>
            <label>Nome do Produto</label>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="Ex: Caneta"
              required
              style={inputStyle}
            />
          </div>
          <div style={inputGroup}>
            <label>Quantidade</label>
            <input
              type="number"
              name="quantidade"
              value={values.quantidade}
              onChange={handleChange}
              placeholder="0"
              required
              min="0"
              style={inputStyle}
            />
          </div>
          <div style={inputGroup}>
            <label>Valor (R$)</label>
            <input
              type="number"
              name="valor"
              step="0.01"
              value={values.valor}
              onChange={handleChange}
              placeholder="0.00"
              required
              style={inputStyle}
            />
          </div>
          <button type="submit" style={buttonStyle}>Cadastrar</button>
        </form>

        <h2 style={title}>Produtos Cadastrados</h2>
        <table style={tableStyle}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th>Produto</th>
              <th>Qtd</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {produtos.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                  Nenhum produto cadastrado
                </td>
              </tr>
            ) : (
              produtos.map((p) => (
                <tr key={p.id}>
                  <td>{p.nameProduto}</td>
                  <td>{p.quantidadeProduto}</td>
                  <td>R$ {p.valor?.toFixed(2) || '0.00'}</td>
                  <td>
                    {p.quantidadeProduto <= 0 ? (
                      <span style={{ color: 'red' }}>Esgotado</span>
                    ) : (
                      <span style={{ color: 'green' }}>Disponível</span>
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleDelete(p.nameProduto)} style={deleteButton}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <footer style={footerStyle}>
        Sistema de Controle de Estoque - Projeto Acadêmico ADS
      </footer>
    </div>
  );
};

// Estilos
const navStyle = {
  padding: '10px 20px',
  backgroundColor: '#e6f2ff',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid #ccc'
};

const linkStyle = {
  color: '#003366',
  textDecoration: 'none',
  fontSize: '14px'
};

const logoutButton = {
  background: '#cc0000',
  color: 'white',
  border: 'none',
  padding: '5px 10px',
  borderRadius: '4px',
  fontSize: '12px',
  cursor: 'pointer'
};

const container = {
  maxWidth: '900px',
  margin: '20px auto',
  padding: '20px'
};

const title = {
  color: '#003366',
  marginBottom: '20px'
};

const form = {
  backgroundColor: '#f9f9f9',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '30px'
};

const inputGroup = {
  marginBottom: '15px'
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '4px'
};

const buttonStyle = {
  background: '#003366',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '4px',
  cursor: 'pointer'
};

const deleteButton = {
  background: '#cc0000',
  color: 'white',
  border: 'none',
  padding: '5px 10px',
  borderRadius: '4px',
  cursor: 'pointer'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '20px'
};

const footerStyle = {
  textAlign: 'center',
  margin: '40px 0 20px',
  fontSize: '12px',
  color: '#777'
};

export default Produto;