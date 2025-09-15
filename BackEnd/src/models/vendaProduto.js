const db = require('../database/index'); // ✅ Corrigido

const vendaProduto = {
  create: ({ nameProduto, quantidadeProduto, usuario, dataHora, valorUnitario, valorTotal }) => {
    const sql = 'INSERT INTO vendas (nameProduto, quantidadeProduto, valorUnitario, valorTotal, usuario, dataHora) VALUES (?, ?, ?, ?, ?, ?)';
    return new Promise((resolve, reject) => {
      db.run(sql, [nameProduto, quantidadeProduto, valorUnitario, valorTotal, usuario, dataHora], function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, nameProduto, quantidadeProduto, valorUnitario, valorTotal, usuario, dataHora });
      });
    });
  },

  findAll: () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM vendas';
      db.all(sql, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  findByName: (nameProduto) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM vendas WHERE nameProduto = ?';
      db.all(sql, [nameProduto], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  deleteByName: (nameProduto) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM vendas WHERE nameProduto = ?';
      db.run(sql, [nameProduto], function (err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      });
    });
  }
};

module.exports = vendaProduto;