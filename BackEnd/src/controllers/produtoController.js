const express = require('express');
const cadastroProduto = require('../models/Produto');
const vendaProduto = require('../models/vendaProduto');
const us = require('../models/User');
const router = express.Router();

// Cadastrar ou atualizar produto
router.post('/cadastroProduto', async (req, res) => {
  const { nameProduto, quantidadeProduto, valor } = req.body;

  try {
    const produto = await cadastroProduto.findByName(nameProduto);
    if (!produto) {
      await cadastroProduto.create({ nameProduto, quantidadeProduto, valor: valor || 0 });
      return res.send({ message: 'Produto Cadastrado com Sucesso' });
    } else {
      await cadastroProduto.updateQuantidade(nameProduto, quantidadeProduto);
      if (valor !== undefined) await cadastroProduto.updateValor(nameProduto, valor);
      return res.send({ message: 'Produto atualizado com sucesso' });
    }
  } catch (err) {
    return res.send({ message: 'Falha ao Cadastrar Produto' });
  }
});

// Listar todos os produtos
router.get('/produtos', async (req, res) => {
  try {
    const todos = await cadastroProduto.findAll();
    const validos = (Array.isArray(todos) ? todos : [])
      .filter(p => p.nameProduto && typeof p.nameProduto === 'string' && p.nameProduto.trim() !== '')
      .map(p => ({
        id: p.id,
        nameProduto: p.nameProduto,
        quantidadeProduto: typeof p.quantidadeProduto === 'number' ? p.quantidadeProduto : 0,
        valor: p.valor != null ? parseFloat(p.valor) : 0.00
      }));
    return res.json(validos);
  } catch (err) {
    console.error('Erro na rota /produtos:', err);
    return res.status(500).json({ message: 'Erro ao carregar produtos' });
  }
});

router.post('/vendaProduto', async (req, res) => {
  const { nameProduto, quantidadeProduto, usuario } = req.body;

  try {
    const produto = await cadastroProduto.findByName(nameProduto);
    if (!produto) {
      return res.send({ message: 'Produto não encontrado' });
    }
    if (produto.quantidadeProduto < quantidadeProduto) {
      return res.send({ 
        message: `Estoque insuficiente. Disponível: ${produto.quantidadeProduto}` 
      });
    }

    // ✅ Não valida usuário no banco
    const nomeUsuario = usuario; // Usa diretamente o valor do sessionStorage

    const valorUnitario = produto.valor || 0;
    const valorTotal = quantidadeProduto * valorUnitario;

    await vendaProduto.create({ 
      nameProduto, 
      quantidadeProduto, 
      usuario: nomeUsuario, 
      dataHora: Date.now(),
      valorUnitario,
      valorTotal
    });

    await cadastroProduto.updateQuantidade(nameProduto, produto.quantidadeProduto - quantidadeProduto);

    return res.send({ 
      message: `Venda realizada! Total: R$ ${valorTotal.toFixed(2)}` 
    });
  } catch (err) {
    console.error('Erro ao registrar venda:', err);
    return res.send({ message: 'Falha ao Registrar Venda de Produto' });
  }
});

// Listar todas as vendas
router.get('/relatorioVenda', async (req, res) => {
  try {
    const vendas = await vendaProduto.findAll();
    return res.send({ produtos: vendas });
  } catch (err) {
    return res.send({ message: 'Falha na Lista' });
  }
});

// Excluir produto
router.delete('/produto', async (req, res) => {
  const { nameProduto } = req.query; // ✅ Lê da query string

  if (!nameProduto) {
    return res.status(400).json({ 
      message: 'Nome do produto é obrigatório' 
    });
  }

  try {
    const produto = await cadastroProduto.findByName(nameProduto);
    if (!produto) {
      return res.status(404).json({ 
        message: 'Produto não encontrado' 
      });
    }

    await cadastroProduto.deleteByName(nameProduto);
    return res.json({ 
      message: `Produto "${nameProduto}" excluído com sucesso` 
    });
  } catch (err) {
    console.error('Erro ao excluir produto:', err);
    return res.status(500).json({ 
      message: 'Falha ao excluir produto' 
    });
  }
});

//Excluir Venda
router.delete('/venda', async (req, res) => {
  const nameProduto = req.query.nameProduto; // ✅ Recebe via query
  try {
    const vendas = await vendaProduto.findByName(nameProduto);
    if (!vendas || vendas.length === 0) {
      return res.status(404).json({ message: 'Nenhuma venda encontrada para esse produto' });
    }

    await vendaProduto.deleteByName(nameProduto);

    // Devolver estoque
    const quantidadeRestituída = vendas.reduce((sum, v) => sum + v.quantidadeProduto, 0);
    const produto = await cadastroProduto.findByName(nameProduto);
    if (produto) {
      await cadastroProduto.updateQuantidade(nameProduto, produto.quantidadeProduto + quantidadeRestituída);
    }

    return res.json({ 
      message: `Vendas do produto "${nameProduto}" excluídas. ${quantidadeRestituída} unidades devolvidas ao estoque.` 
    });
  } catch (err) {
    console.error('Erro ao excluir venda:', err);
    return res.status(500).json({ message: 'Falha ao excluir venda' });
  }
});

module.exports = app => app.use('/api', router);