import { projetoService } from '../services/projetoService.js';

export const projetoController = {
  listar(req, res) {
    res.json(projetoService.listar(req.query.usuarioId));
  },

  buscarPorId(req, res) {
    res.json(projetoService.buscarPorId(Number(req.params.id)));
  },

  criar(req, res) {
    const nova = projetoService.criar(req.body);
    res.status(201).json(nova);
  },

  atualizar(req, res) {
    res.json(projetoService.atualizar(Number(req.params.id), req.body));
  },

  remover(req, res) {
    projetoService.remover(Number(req.params.id));
    res.status(204).end();
  },
};