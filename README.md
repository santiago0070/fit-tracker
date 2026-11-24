# FIT TRACKER

Acompanhamento inteligente de musculação, hipertrofia e evolução física.

O FIT TRACKER é um aplicativo desenvolvido para registrar treinos de musculação, acompanhar a evolução de cargas e repetições e fornecer recomendações fundamentadas no histórico de desempenho.

O projeto tem como objetivo funcionar como um personal trainer digital de acompanhamento, com acesso pelo celular e computador e sincronização dos dados entre dispositivos.

«Status do projeto: Em desenvolvimento — versão 2.0.»

---

Objetivos do projeto

- Organizar fichas de musculação.
- Registrar exercícios, séries, repetições, cargas e RIR.
- Preservar o histórico de todos os treinos.
- Acompanhar a evolução individual por exercício.
- Identificar progressão, estagnação e queda de desempenho.
- Fornecer sugestões para melhorar o treinamento.
- Sincronizar informações entre dispositivos.
- Permitir exportação e restauração dos dados.

Funcionalidades planejadas

1. Dashboard

- Total de treinos registrados.
- Quantidade de exercícios realizados.
- Frequência semanal.
- Indicadores de desempenho.
- Resumo da evolução.

2. Minha ficha

Divisão Full Body A/B/C:

Treino| Ênfase
A| Pernas, peito e costas
B| Costas, peito e braços
C| Glúteos, posterior e ombros

Cada exercício deverá apresentar:

- Nome e imagem ilustrativa.
- Grupo muscular.
- Séries e repetições.
- Tempo de descanso.
- Orientações de execução.

3. Registro de treino

Registro individual de cada exercício, incluindo:

- Data do treino.
- Identificação do treino A, B ou C.
- Exercício realizado.
- Carga utilizada em kg.
- Quantidade de séries.
- Repetições por série.
- Repetições em reserva (RIR).
- Observações pessoais.

Regra fundamental: novos registros não deverão substituir os anteriores. A alteração da ficha não poderá apagar o histórico de treinamento.

4. Evolução

- Gráficos de evolução das cargas.
- Histórico de repetições.
- Comparação entre sessões.
- Evolução mensal.
- Consulta individual por exercício.

5. Personal Trainer IA

Análise dos registros para identificar:

- Progressão de desempenho.
- Possíveis períodos de estagnação.
- Queda de rendimento.
- Dificuldade para concluir séries.
- Necessidade de avaliar recuperação e descanso.

As recomendações serão orientativas. O aplicativo não deverá aumentar cargas automaticamente.

6. Controle de tempo

- Cronômetro de descanso entre séries.
- Acompanhamento da duração da sessão.
- Meta de até 60 minutos por treino.

7. Dados e backup

- Armazenamento local para utilização offline.
- Sincronização com banco de dados na nuvem.
- Exportação dos registros para CSV.
- Backup e restauração em JSON.
- Preservação do histórico entre atualizações.

---

Perfil inicial de treinamento

Configuração| Valor
Objetivo| Hipertrofia
Nível| Intermediário
Frequência| 3 vezes por semana
Divisão| Full Body A/B/C
Dias sugeridos| Segunda, quarta e sexta
Duração máxima| 60 minutos

Essas configurações poderão ser alteradas conforme a evolução do treinamento.

Tecnologias

A arquitetura prevista para o projeto utiliza:

Tecnologia| Finalidade
React| Interface do aplicativo
TypeScript| Tipagem e organização do código
Supabase| Banco de dados e autenticação
PostgreSQL| Armazenamento na nuvem
IndexedDB| Persistência local e uso offline
PWA| Experiência multiplataforma
GitHub| Versionamento e gerenciamento do código

Arquitetura de dados

O Supabase já foi configurado com as seguintes tabelas:

Tabela| Finalidade
profiles| Perfil do usuário
exercises| Cadastro de exercícios
workout_templates| Fichas de treinamento
template_exercises| Exercícios vinculados às fichas
workout_sessions| Sessões de treinamento
exercise_records| Registros dos exercícios
exercise_sets| Registros individuais das séries

O banco utiliza políticas de segurança por linha (RLS) para controlar o acesso aos dados.

Estrutura planejada do projeto

fit-tracker/
│
├── public/
│   ├── images/
│   └── icons/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── database/
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   └── styles/
│
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md

A estrutura poderá evoluir conforme a implementação.

Configuração do ambiente

Pré-requisitos

- Node.js em versão LTS.
- npm.
- Conta no GitHub.
- Projeto configurado no Supabase.

Variáveis de ambiente

Criar um arquivo ".env" na raiz do projeto:

VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=

Preencher com a URL do projeto Supabase e sua chave publicável.

Segurança:

- Nunca enviar o arquivo ".env" para o GitHub.
- Nunca utilizar a chave "service_role" no aplicativo.
- Manter as políticas RLS habilitadas e corretamente configuradas.
- Não compartilhar credenciais privadas.

Instalação

Após a criação da estrutura e dos arquivos do aplicativo:

npm install
npm run dev

O comando de execução dependerá dos scripts definidos no "package.json".

Regras de integridade dos dados

1. Não apagar registros históricos ao modificar fichas.
2. Não inventar cargas, repetições ou resultados.
3. Diferenciar informações registradas de estimativas.
4. Associar cada registro ao exercício correspondente.
5. Preservar os dados durante a sincronização.
6. Evitar duplicidade de registros entre dispositivos.
7. Permitir edição e exclusão mediante confirmação.
8. Manter opções de backup e restauração.

Segurança e responsabilidade

O FIT TRACKER é uma ferramenta de acompanhamento e não substitui a orientação de um profissional de educação física.

A execução correta dos exercícios deve ter prioridade sobre o aumento de carga.

Em caso de dor aguda, o exercício deverá ser interrompido e a situação avaliada adequadamente.

Etapas de desenvolvimento

- [x] Criação do projeto Supabase.
- [x] Configuração da autenticação por e-mail.
- [x] Criação das sete tabelas iniciais.
- [x] Configuração inicial das políticas RLS.
- [ ] Criação da aplicação React + TypeScript.
- [ ] Integração com Supabase.
- [ ] Implementação do login.
- [ ] Desenvolvimento das fichas A/B/C.
- [ ] Registro individual de séries.
- [ ] Armazenamento local offline.
- [ ] Sincronização automática.
- [ ] Dashboard e gráficos de evolução.
- [ ] Personal Trainer IA.
- [ ] Cronômetro de descanso.
- [ ] Exportação CSV e backup JSON.
- [ ] Testes em Android e Windows.

Diretriz principal

O FIT TRACKER deverá evoluir continuamente com base nos registros reais do usuário.

Nenhum histórico deverá ser perdido, nenhuma evolução deverá ser inventada e nenhuma progressão de carga deverá ser automática.

---

FIT TRACKER — Treine, registre, acompanhe e evolua.
