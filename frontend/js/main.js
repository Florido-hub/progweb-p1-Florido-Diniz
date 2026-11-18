
import { criarStore } from './state/store.js';
import { usuarioService } from './services/usuarioService.js';
import { usuarioView } from './ui/usuarioView.js';
import { aviso } from './ui/aviso.js';

// ===================== USUÁRIOS =====================

const usuarios = criarStore({
  status: 'carregando',
  usuarios: [],
  erro: null,
  editandoId: null,
  salvando: false,
});

// Toda alteração no estado redesenha a interface.
usuarios.assinar(usuarioView.render);

async function carregarUsuarios() {
  usuarios.set({
    status: 'carregando',
    erro: null,
  });

  try {
    const lista = await usuarioService.listar();

    usuarios.set({
      status: lista.length ? 'sucesso' : 'vazio',
      usuarios: lista,
    });

  } catch (e) {
    usuarios.set({
      status: 'erro',
      erro: e.message,
    });
  }
}

async function salvarUsuario(dados) {
  const { editandoId } = usuarios.get();

  aviso.limpar();

  usuarios.set({ salvando: true });

  try {
    if (editandoId) {
      await usuarioService.atualizar(editandoId, dados);
    } else {
      await usuarioService.criar(dados);
    }

    aviso.sucesso(
      editandoId
        ? 'Usuário atualizado.'
        : 'Usuário cadastrado.'
    );

    usuarioView.limparForm();

    usuarios.set({ editandoId: null });

    await carregarUsuarios();

  } catch (e) {
    aviso.erro(e.message);

  } finally {
    usuarios.set({ salvando: false });
  }
}

function editarUsuario(id) {
  const usuario = usuarios.get().usuarios.find(
    (u) => u.id === id
  );

  if (!usuario) return;

  usuarioView.preencherForm(usuario);

  usuarios.set({ editandoId: id });
}

function cancelarEdicaoUsuario() {
  usuarioView.limparForm();

  usuarios.set({ editandoId: null });
}

async function removerUsuario(id) {
  if (!confirm(`Remover o usuário #${id}?`)) return;

  aviso.limpar();

  try {
    await usuarioService.remover(id);

    aviso.sucesso('Usuário removido.');

    if (usuarios.get().editandoId === id) {
      cancelarEdicaoUsuario();
    }

    await carregarUsuarios();

  } catch (e) {
    aviso.erro(e.message);
  }
}

// ===================== EVENTOS =====================

usuarioView.aoEnviar(salvarUsuario);

usuarioView.aoCancelar(cancelarEdicaoUsuario);

usuarioView.aoRecarregar(carregarUsuarios);

usuarioView.aoClicarNaLista({
  editar: editarUsuario,
  remover: removerUsuario,
});

// ===================== INÍCIO =====================

carregarUsuarios();
