import { usuarioModel } from '../models/usuarioModel.js';
import { projetoModel } from '../models/projetoModel.js';
import { erro } from '../utils/erro.js';

export const projetoService = {
  listar(usuarioId) {
    if (usuarioId) return projetoModel.listarPorUsuario(Number(usuarioId));
    return projetoModel.listar();
  },

  buscarPorId(id) {
    const conta = projetoModel.buscarPorId(id);
    if (!conta) throw erro(404, 'Conta não encontrada');
    return conta;
  },

  criar({nome, descricao, dataCriacao, usuarioId } = {}) {
    if (!nome || !descricao|| !usuarioId) {
      throw erro(400, 'Campos "nome", "descrição" e "usuarioId" são obrigatórios');
    }
    // Regra: o usuario precisa existir
    if (!usuarioModel.buscarPorId(Number(usuarioId))) throw erro(422, 'Usuario informado não existe');
    return projetoModel.inserir({nome, descricao, usuarioId});
  },

  atualizar(id, dados = {}) {
    const atualizada = projetoModel.atualizar(id, dados);
    if (!atualizada) throw erro(404, 'Projeto não encontrado');
    return atualizada;
  },

  remover(id) {
    const removida = projetoModel .remover(id);
    if (!removida) throw erro(404, 'Projeto não encontrado');
  },
};