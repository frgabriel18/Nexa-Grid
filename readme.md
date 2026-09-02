# NexaGrid

> **dados claros. decisões melhores.**

O **NexaGrid** é um sistema web para criação, edição, organização e exportação de planilhas de forma simples e visual.

O projeto permite criar planilhas do zero ou utilizar modelos prontos com cálculos automáticos. Também possui personalização visual, importação de arquivos, filtros, gráficos, configurações do sistema e lixeira para recuperação de planilhas excluídas.

---

## Objetivo do projeto

O objetivo do NexaGrid é facilitar a criação e o gerenciamento de planilhas, principalmente para pessoas que não possuem muita experiência com Excel ou Google Sheets.

A proposta é permitir que o usuário organize seus dados de forma simples, utilizando uma interface mais amigável e recursos automáticos para cálculos, organização e personalização.

---

## Principais recursos

Atualmente o NexaGrid possui:

- Criação de planilhas em branco;
- Modelos de planilhas pré-prontas;
- Campos de informação e campos de cálculo;
- Escolha da posição de novos campos;
- Cálculos automáticos;
- Edição e exclusão de registros;
- Renomeação e organização de campos;
- Pesquisa de planilhas;
- Pesquisa de registros;
- Filtros por coluna;
- Ordenação de planilhas;
- Desfazer e refazer alterações;
- Personalização de cores;
- Personalização de fonte;
- Personalização de alinhamento;
- Tema claro e escuro;
- Alteração do tamanho geral da fonte;
- Troca de idioma da interface;
- Importação de arquivos Excel e CSV;
- Preservação de parte da formatação de arquivos Excel importados;
- Exportação para `.xlsx`;
- Fórmulas automáticas no arquivo exportado;
- Gráficos automáticos em alguns modelos;
- Backup e restauração;
- Lixeira;
- Restauração de planilhas excluídas;
- Exclusão definitiva;
- Painel rápido próximo à planilha;
- Salvamento automático no navegador.

---

## Modelos de planilha

O NexaGrid possui modelos voltados principalmente para negócios e educação.

### Negócios

#### Controle Financeiro

Permite registrar:

- Descrição;
- Categoria;
- Tipo de movimentação;
- Valor.

O sistema calcula:

- Entradas;
- Saídas;
- Saldo.

---

#### Orçamento

Possui campos como:

- Item;
- Quantidade;
- Valor unitário;
- Total.

O cálculo do total é feito automaticamente:

```text
Quantidade × Valor unitário = Total
```

---

#### Controle de Estoque

Permite controlar:

- Produto;
- Quantidade;
- Custo unitário;
- Preço de venda;
- Valor em estoque;
- Lucro unitário;
- Potencial de venda.

Exemplos de cálculos:

```text
Quantidade × Custo = Valor em estoque

Preço de venda - Custo = Lucro unitário

Quantidade × Preço de venda = Potencial de venda
```

---

#### Vendas e Comissão

Permite registrar vendas e calcular automaticamente:

```text
Quantidade × Valor unitário = Total da venda
```

e:

```text
Total da venda × Comissão % = Comissão
```

---

### Educação

#### Notas Escolares

Permite cadastrar quantas notas forem necessárias.

Exemplo:

```text
Aluno | Nota 1 | Nota 2 | Nota 3 | Nota 4 | Média | Situação
```

Todos os campos configurados com a função **Nota** participam automaticamente da média.

Exemplo:

```text
Nota 1 + Nota 2 + Nota 3 + Nota 4
----------------------------------
                 4
```

A situação do aluno também é calculada automaticamente.

---

#### Frequência Escolar

Possui campos como:

- Aluno;
- Total de aulas;
- Faltas;
- Presenças;
- Frequência %;
- Situação.

Exemplo:

```text
Presenças = Total de aulas - Faltas
```

e:

```text
Frequência = Presenças / Total de aulas × 100
```

---

#### Plano de Estudos

Permite organizar:

- Disciplina;
- Conteúdo;
- Data;
- Horas planejadas;
- Horas estudadas;
- Progresso.

Exemplo:

```text
Horas estudadas / Horas planejadas × 100 = Progresso
```

---

## Sistema de campos

Um dos principais recursos do NexaGrid é o sistema de campos configuráveis.

Ao adicionar um novo campo, o usuário pode escolher:

- Nome;
- Tipo;
- Função;
- Tipo de dado;
- Posição.

### Campo de informação

É preenchido manualmente pelo usuário.

Exemplos:

- Nome;
- Produto;
- Nota;
- Quantidade;
- Data;
- Valor.

### Campo de cálculo

É preenchido automaticamente pelo sistema.

Exemplos:

- Soma;
- Média;
- Multiplicação;
- Lucro;
- Frequência;
- Comissão;
- Progresso.

Os cálculos não dependem apenas da posição da coluna.

Cada campo possui uma função interna, permitindo mover ou adicionar colunas sem quebrar os cálculos existentes.

---

## Tipos de dados

Os campos podem utilizar diferentes tipos de dados, como:

- Texto;
- Número;
- Dinheiro;
- Porcentagem;
- Data;
- Lista de opções;
- Sim/Não.

Isso permite que o NexaGrid trate cada informação de forma mais adequada.

---

## Importação de planilhas

O NexaGrid permite importar arquivos existentes.

Formatos suportados:

- `.xlsx`;
- `.xls`;
- `.csv`.

Durante a importação de arquivos Excel, o sistema tenta preservar informações como:

- Fonte;
- Tamanho da fonte;
- Negrito;
- Itálico;
- Sublinhado;
- Cor do texto;
- Cor de fundo;
- Bordas;
- Alinhamento;
- Largura das colunas;
- Altura das linhas.

O sistema também tenta ignorar linhas e colunas ocultas.

> Alguns recursos muito específicos do Excel podem não ser reproduzidos exatamente.

---

## Exportação

As planilhas podem ser exportadas para:

### Microsoft Excel

O arquivo é gerado no formato:

```text
.xlsx
```

A exportação tenta preservar:

- Dados;
- Cores;
- Bordas;
- Fontes;
- Alinhamento;
- Largura das colunas;
- Fórmulas.

Alguns modelos também recebem fórmulas reais dentro do Excel.

Isso significa que, após baixar o arquivo, o usuário ainda pode alterar valores no Excel e obter novos resultados.

---

### Google Sheets

O NexaGrid gera um arquivo `.xlsx`.

Depois, o usuário pode importar o arquivo no Google Sheets utilizando:

```text
Arquivo → Importar → Upload
```

---

## Personalização

Cada planilha pode possuir sua própria aparência.

O usuário pode alterar:

- Cor do cabeçalho;
- Cor do texto do cabeçalho;
- Cor das informações;
- Fundo das células;
- Cor das bordas;
- Tamanho da fonte;
- Alinhamento;
- Tipo de visualização.

Também existe um painel rápido próximo à tabela para evitar que o usuário precise voltar ao topo da página para realizar alterações frequentes.

---

## Configurações do sistema

O NexaGrid possui uma página separada de configurações.

Nela é possível alterar:

### Tema

- Claro;
- Escuro.

### Tamanho do texto

- Pequeno;
- Normal;
- Grande.

### Idioma

A interface possui suporte a diferentes idiomas configurados no sistema.

As configurações ficam salvas no navegador.

---

## Pesquisa e filtros

O sistema permite pesquisar tanto planilhas quanto registros.

No Dashboard é possível:

- Pesquisar planilhas pelo nome;
- Ordenar por mais recentes;
- Ordenar por mais antigas;
- Ordenar de A-Z;
- Ordenar de Z-A.

Dentro das planilhas é possível:

- Pesquisar registros;
- Filtrar informações por coluna;
- Limpar os filtros.

---

## Desfazer e refazer

O editor possui sistema de histórico.

Isso permite:

```text
↶ Desfazer
↷ Refazer
```

Assim, alterações feitas por engano podem ser recuperadas.

---

## Gráficos

Alguns modelos possuem gráficos automáticos.

Exemplos:

- Frequência dos alunos;
- Vendas;
- Dados financeiros;
- Outros indicadores calculados pelo modelo.

Os gráficos são atualizados conforme os dados da planilha são alterados.

---

## Lixeira

Ao excluir uma planilha, ela não é apagada imediatamente.

Ela é enviada para a **Lixeira**.

Na Lixeira o usuário pode:

- Restaurar uma planilha;
- Excluir uma planilha definitivamente;
- Esvaziar toda a lixeira.

Isso ajuda a evitar perda de dados por exclusão acidental.

---

## Backup

O NexaGrid possui suporte a backup dos dados.

O backup pode incluir:

- Planilhas;
- Configurações;
- Dados da lixeira.

Isso permite restaurar informações caso seja necessário.

---

## Salvamento dos dados

Atualmente os dados são armazenados utilizando o:

```text
localStorage
```

O `localStorage` é um recurso do navegador que permite manter informações salvas mesmo depois de atualizar ou fechar a página.

### Importante

Os dados ficam armazenados no navegador e computador onde o NexaGrid está sendo utilizado.

Por isso, limpar os dados do navegador pode remover as informações salvas.

Para maior segurança, recomenda-se utilizar o recurso de backup.

---

## Tecnologias utilizadas

### HTML

Utilizado para criar a estrutura das páginas.

Exemplos:

- Dashboard;
- Editor;
- Formulários;
- Modais;
- Configurações;
- Lixeira;
- Página Sobre.

### CSS

Responsável pela aparência e responsividade do sistema.

O visual atual utiliza:

- Azul escuro;
- Azul;
- Verde petróleo;
- Cards;
- Gradientes discretos;
- Tema claro;
- Tema escuro;
- Menus personalizados;
- Interface responsiva.

### JavaScript

Responsável pela lógica do sistema.

Entre suas funções estão:

- Criar planilhas;
- Salvar dados;
- Realizar cálculos;
- Importar arquivos;
- Exportar arquivos;
- Controlar filtros;
- Gerenciar histórico;
- Gerenciar a lixeira;
- Alterar configurações;
- Atualizar gráficos.

### localStorage

Utilizado para armazenar dados localmente no navegador.

### XLSX / xlsx-js-style

Utilizado em partes do sistema relacionadas à criação e exportação de arquivos Excel.

### ExcelJS

Utilizado para melhorar a leitura de arquivos Excel importados e acessar mais informações de formatação.

---

## Estrutura do projeto

```text
NexaGrid/
│
├── index.html
├── configuracoes.html
├── lixeira.html
├── sobre.html
├── style.css
└── script.js
```

### `index.html`

Página principal.

Contém:

- Dashboard;
- Editor;
- Criação de planilhas;
- Tabela;
- Modais;
- Ferramentas principais.

### `configuracoes.html`

Página responsável pelas configurações gerais do sistema.

### `lixeira.html`

Página responsável pelas planilhas excluídas.

### `sobre.html`

Apresenta informações sobre o projeto.

### `style.css`

Responsável por todo o estilo visual e responsividade.

### `script.js`

Responsável pela lógica e funcionamento do NexaGrid.

---

## Como executar

O NexaGrid não exige instalação de servidor para funcionar.

### 1. Baixe ou clone o projeto

```bash
git clone URL_DO_SEU_REPOSITORIO
```

### 2. Abra a pasta

Exemplo:

```text
NexaGrid/
```

### 3. Abra o `index.html`

Você pode abrir diretamente no navegador.

Outra opção é utilizar a extensão **Live Server** no Visual Studio Code.

---

## Usando Live Server

No Visual Studio Code:

1. Instale a extensão **Live Server**;
2. Abra a pasta do NexaGrid;
3. Clique com o botão direito em `index.html`;
4. Escolha:

```text
Open with Live Server
```

---

## Publicação no GitHub Pages

O NexaGrid também pode ser publicado gratuitamente usando GitHub Pages.

No GitHub:

1. Abra o repositório;
2. Vá em **Settings**;
3. Abra **Pages**;
4. Em Source, escolha a branch principal;
5. Salve.

Depois disso, o GitHub irá gerar um endereço para acessar o projeto pela internet.

---

## Limitações atuais

Alguns recursos ainda possuem limitações.

Na importação de Excel, recursos como:

- Macros/VBA;
- Gráficos originais do Excel;
- Imagens;
- Formatação condicional muito avançada;
- Alguns temas personalizados;
- Alguns tipos de células mescladas;

podem não ser reproduzidos exatamente dentro do NexaGrid.

Também não existe atualmente sincronização automática entre computadores.

---

## Possíveis melhorias futuras

Algumas ideias para versões futuras:

- Login de usuários;
- Banco de dados;
- Sincronização entre dispositivos;
- Compartilhamento de planilhas;
- Edição colaborativa;
- Controle de permissões;
- Mais tipos de gráficos;
- Mais modelos prontos;
- Fórmulas personalizadas;
- Integração direta com Google Sheets;
- Histórico permanente de versões;
- Salvamento em nuvem.

---

## Sobre o projeto

O NexaGrid foi desenvolvido como um projeto para facilitar a criação e o gerenciamento de planilhas.

A ideia começou com um editor simples e foi evoluindo durante o desenvolvimento.

Entre as principais evoluções estão:

1. Criação de planilhas em branco;
2. Salvamento no navegador;
3. Modelos prontos;
4. Cálculos automáticos;
5. Personalização;
6. Exportação para Excel;
7. Sistema de campos configuráveis;
8. Tema claro e escuro;
9. Idiomas;
10. Importação;
11. Pesquisa e filtros;
12. Gráficos;
13. Histórico de alterações;
14. Backup;
15. Lixeira.

---

## Autor

Projeto desenvolvido por **Gabriel**.

---

## Status

O NexaGrid continua em desenvolvimento.

Novos recursos, melhorias visuais e correções podem ser adicionados ao longo do projeto.

---

**NexaGrid — dados claros. decisões melhores.**
