import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Venda = () => {
  const [values, setValues] = useState({ name: '', quantidade: '' });
  const [vendas, setVendas] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [periodo, setPeriodo] = useState('todos');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nome = values.name;
    const quantidade = parseInt(values.quantidade);

    if (!nome || isNaN(quantidade) || quantidade <= 0) {
      alert('Selecione um produto e quantidade válida');
      return;
    }

    try {
      const response = await api.post('/vendaProduto', {
        nameProduto: nome,
        quantidadeProduto: quantidade,
        usuario: sessionStorage.getItem('usuario'),
      });
      alert(response.data.message);
      setValues({ name: '', quantidade: '' });
      carregarVendas();
      carregarProdutos();
    } catch (error) {
      alert('Erro ao registrar venda');
    }
  };

  const handleDelete = async (nameProduto) => {
    if (window.confirm(`Excluir todas as vendas de "${nameProduto}"? Isso devolverá o estoque.`)) {
      try {
        const response = await api.delete(`/venda?nameProduto=${encodeURIComponent(nameProduto)}`);
        alert(response.data.message);
        carregarVendas();
        carregarProdutos();
      } catch (error) {
        alert('Erro ao excluir venda');
      }
    }
  };

  const carregarVendas = async () => {
    try {
      const response = await api.get('/relatorioVenda');
      setVendas(Array.isArray(response.data?.produtos) ? response.data.produtos : []);
    } catch (error) {
      console.log('Erro ao carregar vendas');
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
    window.location.href = '/';
  };

  useEffect(() => {
    carregarVendas();
    carregarProdutos();
  }, []);

  // --- FILTRO DE PERÍODO ---
  const hoje = new Date();
  const vendasFiltradas = vendas.filter(v => {
    const data = new Date(v.dataHora);

    switch (periodo) {
      case 'hoje':
        return data.toDateString() === hoje.toDateString();
      case 'esta-semana':
        const diaSemana = hoje.getDay();
        const inicio = new Date(hoje);
        inicio.setDate(hoje.getDate() - diaSemana);
        return data >= inicio;
      case 'este-mes':
        return data.getMonth() === hoje.getMonth() && data.getFullYear() === hoje.getFullYear();
      default:
        return true;
    }
  });

  // --- VALOR TOTAL ---
  const totalValor = vendasFiltradas.reduce((sum, v) => sum + v.valorTotal, 0);

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
        <h2 style={title}>Registrar Venda</h2>

        <form onSubmit={handleSubmit} style={form}>
          <div style={inputRow}>
            <div style={inputGroup}>
              <label style={labelStyle}>Produto</label>
              <select
                name="name"
                value={values.name}
                onChange={handleChange}
                required
                style={selectStyle}
              >
                <option value="">Selecione...</option>
                {produtos.map(p => (
                  <option key={p.id} value={p.nameProduto}>
                    {p.nameProduto} (R$ {p.valor?.toFixed(2)}) - Estoque: {p.quantidadeProduto}
                  </option>
                ))}
              </select>
            </div>

            <div style={inputGroup}>
              <label style={labelStyle}>Quantidade</label>
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
          </div>

          <button type="submit" style={btnPrimary}>Vender</button>
        </form>

        <h2 style={title}>Histórico de Vendas</h2>

        {/* Filtro */}
        <div style={filtroBox}>
          <label>Filtrar:</label>
          <select value={periodo} onChange={(e) => setPeriodo(e.target.value)} style={filtroSelect}>
            <option value="todos">Todos</option>
            <option value="hoje">Hoje</option>
            <option value="esta-semana">Esta Semana</option>
            <option value="este-mes">Este Mês</option>
          </select>
        </div>

        {/* Resumo */}
        <div style={resumoBox}>
          <strong>Vendas:</strong> {vendasFiltradas.length} | 
          <strong> Total:</strong> R$ {totalValor.toFixed(2)}
        </div>

        {/* Tabela */}
        <table style={tableStyle}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th>Produto</th>
              <th>Qtd</th>
              <th>Unitário</th>
              <th>Total</th>
              <th>Usuário</th>
              <th>Data</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {vendasFiltradas.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                  Nenhuma venda encontrada
                </td>
              </tr>
            ) : (
              vendasFiltradas.map((v, k) => (
                <tr key={k}>
                  <td>{v.nameProduto}</td>
                  <td>{v.quantidadeProduto}</td>
                  <td>R$ {v.valorUnitario?.toFixed(2)}</td>
                  <td>R$ {v.valorTotal?.toFixed(2)}</td>
                  <td>{v.usuario}</td>
                  <td>{new Date(v.dataHora).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleDelete(v.nameProduto)} style={btnDelete}>
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
  gridTemplateColumns: '2fr 1fr',
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

const selectStyle = {
  ...inputStyle,
  height: '40px'
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

const filtroBox = {
  display: 'flex',
  gap: '10px',
  alignItems: 'center',
  margin: '15px 0'
};

const filtroSelect = {
  padding: '8px',
  border: '1px solid #ccc',
  borderRadius: '4px'
};

const resumoBox = {
  backgroundColor: '#e6f7ff',
  padding: '12px',
  borderRadius: '6px',
  fontSize: '14px',
  color: '#003366',
  marginBottom: '15px'
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

export default Venda;