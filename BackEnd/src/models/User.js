const db = require('../database/index'); // ✅ Corrigido

const User = {
  findByEmail: (email) => {
  return new Promise((resolve, reject) => {
    // ✅ Usa LOWER() para ignorar maiúsculas
    const sql = 'SELECT * FROM users WHERE LOWER(email) = LOWER(?)';
    db.get(sql, [email], (err, row) => {
       if (err) return reject(err);
       resolve(row);
      });
    });
  },
  create: ({ name, email, password }) => {
    return new Promise((resolve, reject) => {
     const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
     db.run(sql, [name, email, password], function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, name, email });
      });
    });
  },
  deleteByEmail: (email) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM users WHERE email = ?';
      db.run(sql, [email], function (err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      });
    });
  }
};

module.exports = User;