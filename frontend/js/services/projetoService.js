import { api } from '../api.js';

// Limpa e valida os dados antes de enviar ao backend.
function preparar({ nome, descricao, usuarioId }) {
  const dados = {
    nome: (nome ?? '').trim(),
    descricao: (descricao ?? '').trim(),
    usuarioId: Number(usuarioId),
  };

  if (!dados.nome) {
    throw new Error('Informe o nome do projeto.');
  }

  if (!dados.usuarioId || Number.isNaN(dados.usuarioId)) {
    throw new Error('Selecione um usuário responsável.');
  }

  return dados;
}

export const projetoService = {
  listar() {
    return api.get('/projetos');
  },

  async criar(dados) {
    return api.post('/projetos', preparar(dados));
  },

  async atualizar(id, dados) {
    return api.put(`/projetos/${id}`, preparar(dados));
  },

  remover(id) {
    return api.delete(`/projetos/${id}`);
  },
};