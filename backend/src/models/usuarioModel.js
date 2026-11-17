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