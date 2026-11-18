
const el = {
  form: document.querySelector('#form-projeto'),
  usuario: document.querySelector('#proj-usuario'),
  salvar: document.querySelector('#proj-salvar'),
  cancelar: document.querySelector('#proj-cancelar'),

  carregando: document.querySelector('#projetos-carregando'),
  erro: document.querySelector('#projetos-erro'),
  erroMsg: document.querySelector('#projetos-erro-msg'),
  recarregar: document.querySelector('#projetos-recarregar'),
  vazio: document.querySelector('#projetos-vazio'),
  sucesso: document.querySelector('#projetos-sucesso'),
  linhas: document.querySelector('#projetos-linhas'),
};

let nomeDoUsuario = new Map();

function preencherUsuarios(usuarios) {
  const selecionado = el.usuario.value;

  nomeDoUsuario = new Map(
    usuarios.map((usuario) => [
      Number(usuario.id),
      usuario.nome,
    ])
  );

  el.usuario.replaceChildren(
    new Option('Selecione um usuário...', '')
  );

  usuarios.forEach((usuario) => {
    el.usuario.add(
      new Option(
        `${usuario.nome} (#${usuario.id})`,
        usuario.id
      )
    );
  });

  if (usuarios.some((u) => String(u.id) === selecionado)) {
    el.usuario.value = selecionado;
  }
}

function preencherForm(projeto) {
  el.form.nome.value = projeto.nome;
  el.form.descricao.value = projeto.descricao;
  el.form.usuarioId.value = projeto.usuarioId;

  el.salvar.textContent = 'Atualizar projeto';
  el.cancelar.hidden = false;
  el.form.nome.focus();
}

function limparForm() {
  el.form.reset();
  el.salvar.textContent = 'Cadastrar projeto';
  el.cancelar.hidden = true;
}

function render(estado) {
  el.carregando.hidden = estado.status !== 'loading';
  el.erro.hidden = estado.status !== 'error';
  el.vazio.hidden =
    estado.status !== 'success' || estado.projetos.length > 0;
  el.sucesso.hidden =
    estado.status !== 'success' || estado.projetos.length === 0;

  el.erroMsg.textContent = estado.erro ?? '';

  el.salvar.disabled = estado.salvando;
  el.salvar.textContent = estado.salvando
    ? 'Salvando...'
    : estado.editandoId
      ? 'Atualizar projeto'
      : 'Cadastrar projeto';

  el.linhas.replaceChildren();

  if (estado.status !== 'success') return;

  estado.projetos.forEach((projeto) => {
    const linha = document.createElement('tr');

    const responsavel =
      nomeDoUsuario.get(Number(projeto.usuarioId)) ??
      `Usuário #${projeto.usuarioId} (não encontrado)`;

    const valores = [
      projeto.id,
      projeto.nome,
      projeto.descricao,
      responsavel,
    ];

    valores.forEach((valor) => {
      const td = document.createElement('td');
      td.textContent = valor ?? '';
      linha.append(td);
    });

    const acoes = document.createElement('td');

    const editar = document.createElement('button');
    editar.type = 'button';
    editar.textContent = 'Editar';
    editar.dataset.acao = 'editar';
    editar.dataset.id = projeto.id;

    const remover = document.createElement('button');
    remover.type = 'button';
    remover.textContent = 'Excluir';
    remover.dataset.acao = 'remover';
    remover.dataset.id = projeto.id;

    acoes.append(editar, remover);
    linha.append(acoes);
    el.linhas.append(linha);
  });
}

function obterDadosForm() {
  return Object.fromEntries(new FormData(el.form));
}

function aoEnviar(callback) {
  el.form.addEventListener('submit', (event) => {
    event.preventDefault();
    callback(obterDadosForm());
  });
}

function aoCancelar(callback) {
  el.cancelar.addEventListener('click', callback);
}

function aoRecarregar(callback) {
  el.recarregar.addEventListener('click', callback);
}

function aoAcao(callback) {
  el.linhas.addEventListener('click', (event) => {
    const botao = event.target.closest('button[data-acao]');
    if (!botao) return;

    callback(
      botao.dataset.acao,
      Number(botao.dataset.id)
    );
  });
}

export const projetoView = {
  render,
  preencherUsuarios,
  preencherForm,
  limparForm,
  aoEnviar,
  aoCancelar,
  aoRecarregar,
  aoAcao,
};
