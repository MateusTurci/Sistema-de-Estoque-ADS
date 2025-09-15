const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors({ origin: 'http://localhost:3000' }));

require('./controllers/authController')(app);
require('./controllers/produtoController')(app);

app.listen(3001, () => {
  console.log('Servidor backend rodando na porta 3001');
});