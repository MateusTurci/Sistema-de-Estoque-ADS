import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Produto = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: '', quantidade: '', valor: '' });
  const [produtos, setProdutos] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

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

  const handleDelete = async (nameProduto) => {
    if (window.confirm(`Excluir o produto "${nameProduto}"?`)) {
      try {
        const response = await api.delete(`/produto?nameProduto=${encodeURIComponent(nameProduto)}`);
        alert(response.data.message);
        carregarProdutos();
      } catch (error) {
        alert('Erro ao excluir produto');
      }
    }
  };

  const carregarProdutos = async () => {
    try {
      const response = await api.get('/produtos');
      setProdutos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log('Erro ao carregar produtos');
    }
  };

  const logout = () => {
    sessionStorage.removeItem('usuario');
    navigate('/');
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav style={navStyle}>
        <div style={navBrand}>🔷 Estoque Fácil</div>
        <div style={navLinks}>
          <a href="/produto" style={navLink}>Produtos</a>
          <a href="/venda" style={navLink}>Vendas</a>
          <span style={navUser}>Olá, {sessionStorage.getItem('usuario')}</span>
          <button onClick={logout} style={logoutButton}>Sair</button>
        </div>
      </nav>

      <div style={pageContainer}>
        <h2 style={title}>Cadastro de Produtos</h2>

        <form onSubmit={handleSubmit} style={form}>
          <div style={inputRow}>
            <div style={inputGroup}>
              <label style={labelStyle}>Nome do Produto</label>
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
              <label style={labelStyle}>Quantidade</label>
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
              <label style={labelStyle}>Valor (R$)</label>
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
          </div>

          <button type="submit" style={btnPrimary}>Cadastrar</button>
        </form>

        <h2 style={title}>Produtos Cadastrados</h2>
        <table style={tableStyle}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th>Produto</th>
              <th>Quantidade</th>
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
                  <td>R$ {p.valor?.toFixed(2)}</td>
                  <td>
                    {p.quantidadeProduto <= 0 ? (
                      <span style={statusEsgotado}>Esgotado</span>
                    ) : p.quantidadeProduto <= 5 ? (
                      <span style={statusBaixo}>Baixo</span>
                    ) : (
                      <span style={statusOk}>Disponível</span>
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleDelete(p.nameProduto)} style={btnDelete}>
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
    </>
  );
};


const navStyle = {
  padding: '12px 20px',
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #ddd',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'sticky',
  top: 0,
  zIndex: 100,
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
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

const navLink = {
  color: '#003366',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: '500'
};

const navUser = {
  color: '#555',
  fontSize: '14px'
};

const logoutButton = {
  background: '#cc0000',
  color: 'white',
  border: 'none',
  padding: '6px 10px',
  borderRadius: '4px',
  fontSize: '12px',
  cursor: 'pointer'
};

const pageContainer = {
  minHeight: 'calc(100vh - 100px)',
  padding: '20px',
  backgroundColor: '#f0f4f8',
  marginTop: '0'
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

const inputRow = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: '15px',
  marginBottom: '15px'
};

const inputGroup = {
  display: 'flex',
  flexDirection: 'column'
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
  padding: '10px 20px',
  borderRadius: '4px',
  cursor: 'pointer'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '20px'
};

const statusOk = {
  color: 'green',
  fontWeight: 'normal'
};

const statusBaixo = {
  color: '#cc7700',
  fontWeight: 'normal'
};

const statusEsgotado = {
  color: 'red',
  fontWeight: 'normal'
};

const btnDelete = {
  background: '#f44336',
  color: 'white',
  border: 'none',
  padding: '5px 10px',
  borderRadius: '4px',
  cursor: 'pointer'
};

const footerStyle = {
  textAlign: 'center',
  padding: '20px 0',
  color: '#777',
  fontSize: '12px',
  borderTop: '1px solid #eee',
  backgroundColor: '#f8f9fa'
};

export default Produto;