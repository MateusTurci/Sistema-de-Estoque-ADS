                                        ////////////////////////////////// Arquivo de configuração do Axios /////////////////////////////////////
import axios from 'axios';

                                      ////////////////////////////////// Conecta ao backend na porta 3001/////////////////////////////////////////////
const api = axios.create({
  baseURL: 'http://localhost:3001/api'
});

export default api;