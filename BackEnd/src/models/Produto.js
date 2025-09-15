const db = require('../database/index'); // ✅ Importa o db corretamente

const cadastroProduto = {
  findByName: (nameProduto) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM produtos WHERE nameProduto = ?';
      db.get(sql, [nameProduto], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },

  create: ({ nameProduto, quantidadeProduto, valor }) => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO produtos (nameProduto, quantidadeProduto, valor) VALUES (?, ?, ?)';
      db.run(sql, [nameProduto, quantidadeProduto, valor], function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, nameProduto, quantidadeProduto, valor });
      });
    });
  },

  updateQuantidade: (nameProduto, quantidadeProduto) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE produtos SET quantidadeProduto = ? WHERE nameProduto = ?';
      db.run(sql, [quantidadeProduto, nameProduto], function (err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      });
    });
  },

  updateValor: (nameProduto, valor) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE produtos SET valor = ? WHERE nameProduto = ?';
      db.run(sql, [valor, nameProduto], function (err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      });
    });
  },

  findAll: () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM produtos';
      db.all(sql, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  deleteByName: (nameProduto) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM produtos WHERE nameProduto = ?';
      db.run(sql, [nameProduto], function (err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      });
    });
  }
};

module.exports = cadastroProduto;