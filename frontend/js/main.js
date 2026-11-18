import { projetoService } from './services/projetoService.js';
import { projetoView } from './ui/projetoView.js';
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

const projetos = criarStore({
  status: 'loading',
  projetos: [],
  erro: null,
  editandoId: null,
  salvando: false,
});


// Toda alteração no estado redesenha a interface.
usuarios.assinar(usuarioView.render);
projetos.assinar(projetoView.render);
usuarios.assinar((estado) => {
  projetoView.preencherUsuarios(estado.usuarios);
  projetoView.render(projetos.get());
});

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
    (u) => Number(u.id) === Number(id)
  );

  if (!usuario) {
    console.error('Usuário não encontrado para edição. ID:', id);
    return;
  }

  usuarioView.preencherForm(usuario);
  usuarios.set({ editandoId: Number(id) });
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

    if (Number(usuarios.get().editandoId) === Number(id)) {
      cancelarEdicaoUsuario();
    }
  

    await carregarUsuarios();

  } catch (e) {
    aviso.erro(e.message);
  }
}


async function carregarProjetos() {
  projetos.set({
    status: 'loading',
    erro: null,
  });

  try {
    const lista = await projetoService.listar();

    projetos.set({
      status: 'success',
      projetos: lista,
    });
  } catch (erro) {
    projetos.set({
      status: 'error',
      erro: erro.message,
    });
  }
}

async function salvarProjeto(dados) {
  const { editandoId } = projetos.get();

  projetos.set({ salvando: true });
  aviso.limpar();

  try {
    if (editandoId !== null) {
      await projetoService.atualizar(editandoId, dados);
      aviso.sucesso('Projeto atualizado com sucesso!');
    } else {
      await projetoService.criar(dados);
      aviso.sucesso('Projeto cadastrado com sucesso!');
    }

    projetoView.limparForm();

    projetos.set({
      editandoId: null,
    });

    await carregarProjetos();
  } catch (erro) {
    aviso.erro(erro.message);
  } finally {
    projetos.set({ salvando: false });
  }
}

function editarProjeto(id) {
  const projeto = projetos.get().projetos.find(
    (p) => Number(p.id) === Number(id)
  );

  if (!projeto) return;

  projetos.set({ editandoId: Number(id) });
  projetoView.preencherForm(projeto);
}

function cancelarEdicaoProjeto() {
  projetos.set({ editandoId: null });
  projetoView.limparForm();
}

async function removerProjeto(id) {
  const confirmar = confirm('Deseja realmente excluir este projeto?');

  if (!confirmar) return;

  aviso.limpar();

  try {
    await projetoService.remover(id);

    aviso.sucesso('Projeto removido com sucesso!');

    if (Number(projetos.get().editandoId) === Number(id)) {
      cancelarEdicaoProjeto();
    }

    await carregarProjetos();
  } catch (erro) {
    aviso.erro(erro.message);
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

projetoView.aoEnviar(salvarProjeto);

projetoView.aoCancelar(cancelarEdicaoProjeto);

projetoView.aoRecarregar(carregarProjetos);

projetoView.aoAcao((acao, id) => {
  if (acao === 'editar') {
    editarProjeto(id);
  }

  if (acao === 'remover') {
    removerProjeto(id);
  }
});

// ===================== INÍCIO =====================

carregarUsuarios();

carregarProjetos();
