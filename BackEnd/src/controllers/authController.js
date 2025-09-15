const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const router = express.Router();

// Login de usuário
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos' });
    }

    return res.json({ 
      message: 'Usuario Logado', 
      name: user.name 
    });
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

// Cadastro de novo usuário
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Email já cadastrado', 
        code: 0 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    return res.status(201).json({ 
      message: 'Usuário cadastrado com sucesso', 
      code: 1 
    });
  } catch (err) {
    return res.status(500).json({ 
      message: 'Falha ao cadastrar usuário', 
      code: 0 
    });
  }
});

// Exclusão de usuário 
router.delete('/delete', async (req, res) => {
  const { email } = req.body;

  try {
    await User.deleteByEmail(email);
    return res.json({ message: 'Usuario deletado com sucesso' });
  } catch (err) {
    return res.status(500).json({ message: 'Falha ao deletar usuario' });
  }
});

module.exports = app => app.use('/api/auth', router);