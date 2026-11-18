
import { api } from '../api.js';

// Limpa e valida os dados antes de enviar ao backend.
function preparar({ nome, email }) {
  const dados = {
    nome: (nome ?? '').trim(),
    email: (email ?? '').trim(),
  };

  if (!dados.nome) {
    throw new Error('Informe o nome do usuário.');
  }

  if (!dados.email) {
    throw new Error('Informe o e-mail do usuário.');
  }

  return dados;
}

export const usuarioService = {
  listar() {
    return api.get('/usuarios');
  },

  async criar(dados) {
    return api.post('/usuarios', preparar(dados));
  },

  async atualizar(id, dados) {
    return api.put(`/usuarios/${id}`, preparar(dados));
  },

  remover(id) {
    return api.delete(`/usuarios/${id}`);
  },
};
