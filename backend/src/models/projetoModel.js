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