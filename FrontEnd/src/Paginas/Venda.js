import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Venda = () => {
  const [values, setValues] = useState({ name: '', quantidade: '' });
  const [vendas, setVendas] = useState([]);
  const [produtos, setProdutos] = useState([]);

  // Função para mudar os valores dos inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  // Cadastrar venda
  const handleSubmit = async (e) => {
    e.preventDefault();
    const nome = values.name;
    const quantidade = parseInt(values.quantidade);

    if (!nome || isNaN(quantidade) || quantidade <= 0) {
      alert('Preencha corretamente');
      return;
    }

    try {
      const response = await api.post('/vendaProduto', {
        nameProduto: nome,
        quantidadeProduto: quantidade,
        usuario: sessionStorage.getItem('usuario')
      });
      alert(response.data.message);
      setValues({ name: '', quantidade: '' });
      carregarVendas();
      carregarProdutos();
    } catch (error) {
      alert('Erro ao vender');
    }
  };

  // Excluir venda
  const handleDelete = async (nameProduto) => {
    if (!window.confirm('Deseja excluir todas as vendas deste produto?')) return;

    try {
      // Usa query string para evitar erro no DELETE com corpo
      const response = await api.delete(`/venda?nameProduto=${encodeURIComponent(nameProduto)}`);
      alert(response.data.message);
      carregarVendas();
      carregarProdutos();
    } catch (error) {
      alert('Erro ao excluir venda');
    }
  };

  // Carregar vendas
  const carregarVendas = async () => {
    try {
      const response = await api.get('/relatorioVenda');
      setVendas(response.data.produtos || []);
    } catch (error) {
      console.log('Erro ao carregar vendas');
    }
  };

  // Carregar produtos
  const carregarProdutos = async () => {
    try {
      const response = await api.get('/produtos');
      setProdutos(response.data || []);
    } catch (error) {
      console.log('Erro ao carregar produtos');
    }
  };

  // Carrega ao abrir
  useEffect(() => {
    carregarVendas();
    carregarProdutos();
  }, []);

  return (
    <div>
      {/* Navbar simples */}
      <nav style={navStyle}>
        <div style={{ fontWeight: 'bold', color: '#003366' }}>
          🔷 Estoque Fácil
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <a href="/produto" style={linkStyle}>Produtos</a>
          <a href="/venda" style={linkStyle}>Vendas</a>
          <span style={{ color: '#555' }}>
            Olá, {sessionStorage.getItem('usuario')}
          </span>
          <button onClick={() => {
            sessionStorage.removeItem('usuario');
            window.location.href = '/';
          }} style={logoutButton}>
            Sair
          </button>
        </div>
      </nav>

      <div style={container}>
        <h2 style={title}>Registrar Venda</h2>

        <form onSubmit={handleSubmit} style={form}>
          <div style={inputGroup}>
            <label>Produto</label>
            <select
              name="name"
              value={values.name}
              onChange={handleChange}
              required
              style={selectStyle}
            >
              <option value="">Selecione</option>
              {produtos.map((p) => (
                <option key={p.id} value={p.nameProduto}>
                  {p.nameProduto} (Estoque: {p.quantidadeProduto}) - R$ {p.valor?.toFixed(2) || '0.00'}
                </option>
              ))}
            </select>
          </div>

          <div style={inputGroup}>
            <label>Quantidade</label>
            <input
              type="number"
              name="quantidade"
              value={values.quantidade}
              onChange={handleChange}
              placeholder="1"
              required
              min="1"
              style={inputStyle}
            />
          </div>

          <button type="submit" style={buttonStyle}>Vender</button>
        </form>

        <h2 style={title}>Histórico de Vendas</h2>
        <button onClick={carregarVendas} style={refreshButton}>Atualizar</button>

        <table style={tableStyle}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th>Produto</th>
              <th>Qtd</th>
              <th>Valor Unit.</th>
              <th>Total</th>
              <th>Usuário</th>
              <th>Data</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {vendas.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                  Nenhuma venda registrada
                </td>
              </tr>
            ) : (
              vendas.map((v, k) => (
                <tr key={k}>
                  <td>{v.nameProduto}</td>
                  <td>{v.quantidadeProduto}</td>
                  <td>R$ {v.valorUnitario?.toFixed(2) || '0.00'}</td>
                  <td>R$ {v.valorTotal?.toFixed(2) || '0.00'}</td>
                  <td>{v.usuario}</td>
                  <td>{new Date(v.dataHora).toLocaleString()}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(v.nameProduto)}
                      style={deleteButton}
                    >
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
        Sistema de Controle de Estoque - Projeto Acadêmico ADS (Mateus Turci)
      </footer>
    </div>
  );
};

// Estilos simples
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

const selectStyle = {
  ...inputStyle,
  height: '40px'
};

const buttonStyle = {
  background: '#003366',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '4px',
  cursor: 'pointer'
};

const refreshButton = {
  ...buttonStyle,
  background: '#006600',
  marginRight: '10px'
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

export default Venda;