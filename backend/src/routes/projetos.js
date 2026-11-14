import { Router } from 'express';
import { projetoController } from '../controllers/projetoController.js';

const router = Router();

router.get('/', projetoController.listar);
router.get('/:id', projetoController.buscarPorId);
router.post('/', projetoController.criar);
router.put('/:id', projetoController.atualizar);
router.delete('/:id', projetoController.remover);

export default router;