// "Banco de dados" em memória: um array. Na S5 vira SQLite.
let usuarios = [];
let proximoId = 1;

export const usuarioModel = {
  listar() {
    return usuarios;
  },

  buscarPorId(id) {
  return usuarios.find((u) => Number(u.id) === Number(id)) ?? null;
},

  existeEmail(email) {
    return usuarios.some((c) => c.email === email);
  },

  inserir({ id, nome, email }) {
    const novo = { id: proximoId++, nome, email: email ?? null };
    usuarios.push(novo);
    return novo;
  },

  atualizar(id, dados) {
  const i = usuarios.findIndex((u) => Number(u.id) === Number(id));
  if (i === -1) return null;

  usuarios[i] = { ...usuarios[i], ...dados, id: Number(id) };
  return usuarios[i];
},

  remover(id) {
  const antes = usuarios.length;

  usuarios = usuarios.filter((u) => Number(u.id) !== Number(id));

  return usuarios.length < antes;
},
};