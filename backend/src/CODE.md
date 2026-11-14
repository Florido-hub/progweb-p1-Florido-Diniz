Usuario Model: 

// "Banco de dados" em memória: um array. Na S5 vira SQLite.
let usuarios = [];
let proximoId = 1;

export const usuarioModel = {
  listar() {
    return usuarios;
  },

  buscarPorId(id) {
    return usuarios.find((c) => c.id === id) ?? null;
  },

  existeEmail(email) {
    return usuarios.some((c) => c.email === email);
  },

  inserir({ id, nome, email }) {
    const novo = { id: proximoId++, id, nome, email: email ?? null };
    usuarios.push(novo);
    return novo;
  },

  atualizar(id, dados) {
    const i = usuarios.findIndex((c) => c.id === id);
    if (i === -1) return null;
    usuarios[i] = { ...usuarios[i], ...dados, id }; // o id nunca muda
    return usuarios[i];
  },

  remover(id) {
    const antes = usuarios.length;
    usuarios = usuarios.filter((c) => c.id !== id);
    return usuarios.length < antes; // true = removeu
  },
};

Usuario Service:

import { usuarioModel } from '../models/usuarioModel.js';
import { erro } from '../utils/erro.js';

export const usuarioService = {
  listar() {
    return usuarioModel.listar();
  },

  buscarPorId(id) {
    const usuario = usuarioModel.buscarPorId(id);
    if (!usuario) throw erro(404, 'Usuário não encontrado');
    return usuario;
  },

  criar({ id, nome, email } = {}) {
    // Regra 1: nome e email são obrigatórios
    if (!nome || !email) throw erro(400, 'Campos "nome" e "email" são obrigatórios');
    // Regra 2: email é único
    if (usuarioModel.existeEmail(email)) throw erro(409, 'Já existe um usuário com este email');
    return usuarioModel.inserir({ id, nome, email });
  },

  atualizar(id, dados = {}) {
    const atualizado = usuarioModel.atualizar(id, dados);
    if (!atualizado) throw erro(404, 'Usuário não encontrado');
    return atualizado;
  },

  remover(id) {
    const removido = usuarioModel.remover(id);
    if (!removido) throw erro(404, 'Usuário não encontrado');
  },
};


Usuario Controller:

import { usuarioService } from '../services/usuarioService.js';

export const usuarioController = {
  listar(req, res) {
    res.json(usuarioService.listar());
  },

  buscarPorId(req, res) {
    res.json(usuarioService.buscarPorId(Number(req.params.id)));
  },

  criar(req, res) {
    const novo = usuarioService.criar(req.body);
    res.status(201).json(novo);
  },

  atualizar(req, res) {
    res.json(usuarioService.atualizar(Number(req.params.id), req.body));
  },

  remover(req, res) {
    usuarioService.remover(Number(req.params.id));
    res.status(204).end();
  },
};


Usuario rountes:

import { Router } from 'express';
import { usuarioController } from '../controllers/usuarioController.js';

const router = Router();

router.get('/', usuarioController.listar);
router.get('/:id', usuarioController.buscarPorId);
router.post('/', usuarioController.criar);
router.put('/:id', usuarioController.atualizar);
router.delete('/:id', usuarioController.remover);

export default router;

Projeto Model: 

let projetos = [];
let proximoId = 1;

export const projetoModel = {
  listar() {
    return projetos;
  },

  listarPorUsuario(usuarioId) {
    return projetos.filter((c) => c.usuarioId === usuarioId);
  },

  buscarPorId(id) {
    return projetos.find((c) => c.id === id) ?? null;
  },

  inserir({ nome, descricao, usuarioId }) {
    const nova = {
      id: proximoId++,
      nome,
      descricao,
      usuarioId: Number(usuarioId),
      criadaEm: new Date().toISOString(),
    };
    projetos.push(nova);
    return nova;
  },

  atualizar(id, dados) {
    const i = projetos.findIndex((c) => c.id === id);
    if (i === -1) return null;
    projetos[i] = { ...projetos[i], ...dados, id };
    return projetos[i];
  },

  remover(id) {
    const antes = projetos.length;
    projetos = projetos.filter((c) => c.id !== id);
    return projetos.length < antes;
  },
};


Projeto Service: 


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


Projeto Controller:


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


Projeto Routes:


import { Router } from 'express';
import { projetoController } from '../controllers/projetoController.js';

const router = Router();

router.get('/', projetoController.listar);
router.get('/:id', projetoController.buscarPorId);
router.post('/', projetoController.criar);
router.put('/:id', projetoController.atualizar);
router.delete('/:id', projetoController.remover);

export default router;

app.js:

import express from 'express';
import usuarioRouter from './routes/usuarios.js';
import projetoRouter from './routes/projetos.js'
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// --- Middleware global (antes das rotas) ---
app.use(express.json()); // lê o body JSON para req.body
app.use(logger);         // loga toda requisição

// --- Health check ---
app.get('/', (req, res) => {
  res.json({ api: 'backend', versao: '1.0.0', rotas: ['/usuarios','/projetos'] });
});

// --- Rotas ---
app.use('/usuarios', usuarioRouter);
app.use('/projetos', projetoRouter);

// --- 404 para rotas que não existem ---
app.use((req, res) => {
  res.status(404).json({ erro: `Rota ${req.method} ${req.url} não existe` });
});

// --- Tratador de erro: SEMPRE o último ---
app.use(errorHandler);

export default app;