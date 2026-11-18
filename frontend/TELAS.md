# Telas do Projeto 1 (S4)

Front: `npx http-server -p 5500 -c-1` em `frontend/` · API: `npm run dev` em `backend/`

| Lista | Estado | Como provocar | O que aparece |
|---|---|---|---|
| Usuários | carregando | Network → throttling 3G → F5 | spinner "Carregando usuários…" |
| Usuários | vazio | API recém-iniciada (a memória zera ao reiniciar) | "Nenhum usuário cadastrado. Cadastre o primeiro no formulário." |
| Usuários | erro | Ctrl+C na API → F5 | "Não consegui falar com a API. Ela está rodando?" + botão Tentar de novo |
| Usuários | sucesso | cadastrar "Ana Lima" com ana@exemplo.com | aviso verde "Usuário cadastrado." e tabela com 1 linha |
| Usuários | erro de regra (409) | cadastrar outro usuário com o mesmo e-mail | aviso vermelho com a mensagem do backend (e-mail já cadastrado); o formulário continua preenchido |
| Usuários | erro de validação (front) | enviar o formulário com o nome em branco | aviso vermelho "Informe o nome do usuário." e nenhuma requisição na aba Network |
| Projetos | carregando | Network → throttling 3G → F5 | spinner de carregamento da lista de projetos |
| Projetos | vazio | API recém-iniciada, com usuários mas sem projetos | mensagem de lista vazia de projetos |
| Projetos | erro | Ctrl+C na API → F5 | "Não consegui falar com a API. Ela está rodando?" + botão Tentar de novo |
| Projetos | sucesso | cadastrar "Site novo" escolhendo um usuário no `<select>` | aviso verde "Projeto cadastrado com sucesso!" e tabela com 1 linha mostrando o **nome** do responsável |
| Projetos | erro de validação (front) | enviar sem escolher o usuário no `<select>` | aviso vermelho "Selecione um usuário responsável." e nenhuma requisição na aba Network |
| Projetos | erro de regra (422) | em duas abas: remover o usuário numa, e na outra (sem F5) cadastrar um projeto com ele | aviso vermelho com a mensagem do backend (usuário não existe) |

## Camadas

- api: `js/api.js` · services: `js/services/` · state: `js/state/store.js` · ui: `js/ui/`