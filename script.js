/*
    pega as planilhas que já estavam salvas no navegador

    se não existir nenhuma,
    cria uma lista vazia
*/
let planilhas = JSON.parse(localStorage.getItem("planilhas")) || [];

/*
    aqui fica guardada a planilha
    que está aberta no momento
*/
let planilhaAtual = null;

/*
    agora pegamos algumas partes do html

    fazemos isso para conseguir mudar
    essas partes usando javascript
*/
const dashboard = document.getElementById("dashboard");

const editor = document.getElementById("editor");

const modalCriacao = document.getElementById("modalCriacao");

const modalCampo = document.getElementById("modalCampo");

const listaPlanilhas = document.getElementById("listaPlanilhas");

const cabecalhoTabela = document.getElementById("cabecalhoTabela");

const corpoTabela = document.getElementById("corpoTabela");

const tabelaPlanilha = document.getElementById("tabelaPlanilha");

/*
    essa função cria a personalização padrão

    ela é usada quando uma planilha
    é criada pela primeira vez
*/
function personalizacaoPadrao() {
  return {
    /*
            cor de fundo do cabeçalho
        */
    corCabecalho: "#1597e5",

    /*
            cor do texto do cabeçalho
        */
    corTextoCabecalho: "#ffffff",

    /*
            cor das informações
        */
    corTexto: "#24435a",

    /*
            cor do fundo das células
        */
    corCelulas: "#ffffff",

    /*
            cor das bordas
        */
    corBorda: "#b7dce9",

    /*
            estilo da tabela
        */
    estilo: "grade",

    /*
            tamanho das letras
        */
    tamanhoFonte: "14",

    /*
            posição do texto
        */
    alinhamento: "left",
  };
}

/*
    aqui deixamos apenas planilhas
    do excel ou google sheets

    planilhas antigas de csv são ignoradas
*/
planilhas = planilhas.filter((planilha) => {
  return planilha.tipo === "excel" || planilha.tipo === "google";
});

/*
    algumas planilhas antigas podem não ter
    a parte de personalização

    então colocamos o padrão nelas
*/
planilhas.forEach((planilha) => {
  if (!planilha.personalizacao) {
    planilha.personalizacao = personalizacaoPadrao();
  }
});

/*
    salva qualquer correção feita
*/
salvar();

/* ================================================= */
/* SALVAR DADOS */
/* ================================================= */

/*
    essa função salva todas as planilhas
    dentro do navegador

    usamos localStorage para isso
*/
function salvar() {
  localStorage.setItem("planilhas", JSON.stringify(planilhas));
}

/* ================================================= */
/* DASHBOARD */
/* ================================================= */

/*
    mostra a tela inicial
*/
function mostrarDashboard() {
  /*
        mostra o dashboard
    */
  dashboard.classList.remove("escondido");

  /*
        esconde o editor
    */
  editor.classList.add("escondido");

  /*
        nenhuma planilha fica aberta
    */
  planilhaAtual = null;

  /*
        atualiza as informações da tela
    */
  carregarDashboard();
}

/*
    essa função atualiza tudo
    que aparece no dashboard
*/
function carregarDashboard() {
  /*
        limpa os cards antigos
    */
  listaPlanilhas.innerHTML = "";

  /*
        começa contando registros do zero
    */
  let registros = 0;

  /*
        começa contando campos do zero
    */
  let campos = 0;

  /*
        passa por todas as planilhas
    */
  planilhas.forEach((planilha) => {
    /*
            soma a quantidade de linhas
        */
    registros += planilha.linhas.length;

    /*
            soma a quantidade de colunas
        */
    campos += planilha.colunas.length;
  });

  /*
        mostra quantas planilhas existem
    */
  document.getElementById("totalPlanilhas").textContent = planilhas.length;

  /*
        mostra quantos registros existem
    */
  document.getElementById("totalRegistros").textContent = registros;

  /*
        mostra quantos campos existem
    */
  document.getElementById("totalCampos").textContent = campos;

  /*
        se não existir nenhuma planilha
    */
  if (planilhas.length === 0) {
    /*
            mostra uma mensagem no lugar dos cards
        */
    listaPlanilhas.innerHTML = `

            <div class="vazio">

                <h3>
                    Nenhuma planilha ainda
                </h3>

                <p>
                    Crie sua primeira planilha.
                </p>

            </div>

        `;

    /*
            para a função aqui
        */
    return;
  }

  /*
        agora criamos um card
        para cada planilha salva
    */
  planilhas.forEach((planilha) => {
    /*
            cria um elemento article
        */
    const card = document.createElement("article");

    /*
            coloca a classe visual do card
        */
    card.className = "card-planilha";

    /*
            coloca as informações dentro do card
        */
    card.innerHTML = `

            <h4>
                📄 ${planilha.nome}
            </h4>

            <p>

                ${planilha.linhas.length}
                registros ·

                ${planilha.colunas.length}
                campos

            </p>

            <footer>

                <span class="tag">

                    ${nomeTipo(planilha.tipo)}

                </span>

                <button
                    class="excluir"
                    onclick="
                        excluirPlanilha(
                            event,
                            '${planilha.id}'
                        )
                    "
                >
                    Excluir
                </button>

            </footer>

        `;

    /*
            quando clicar no card
        */
    card.addEventListener("click", () => {
      /*
                    abre aquela planilha
                */
      abrirPlanilha(planilha.id);
    });

    /*
            coloca o card na tela
        */
    listaPlanilhas.appendChild(card);
  });
}

/* ================================================= */
/* CRIAR PLANILHA */
/* ================================================= */

/*
    abre a janela para criar
    uma nova planilha
*/
function abrirCriacao() {
  /*
        limpa o nome antigo
    */
  document.getElementById("nomePlanilha").value = "";

  /*
        limpa os campos antigos
    */
  document.getElementById("camposCriacao").innerHTML = "";

  /*
        cria automaticamente
        um campo chamado Nome
    */
  adicionarCampoCriacao("Nome");

  /*
        abre a janelinha
    */
  modalCriacao.showModal();
}

/*
    fecha a janela de criação
*/
function fecharCriacao() {
  modalCriacao.close();
}

/*
    adiciona um campo
    dentro da criação da planilha
*/
function adicionarCampoCriacao(valor = "") {
  /*
        pega a área onde os campos ficam
    */
  const container = document.getElementById("camposCriacao");

  /*
        cria uma nova caixinha
    */
  const campo = document.createElement("div");

  /*
        coloca uma classe nela
    */
  campo.className = "campo-criacao";

  /*
        cria o campo para escrever
        e o botão para apagar
    */
  campo.innerHTML = `

        <input
            class="campoNovo"
            placeholder="Nome do campo"
            value="${valor}"
            required
        >

        <button
            type="button"
            onclick="
                this.parentElement.remove()
            "
        >
            ✕
        </button>

    `;

  /*
        coloca o novo campo na tela
    */
  container.appendChild(campo);
}

/*
    cria uma planilha de verdade
*/
function criarPlanilha(event) {
  /*
        impede o formulário
        de atualizar a página
    */
  event.preventDefault();

  /*
        pega o nome digitado
    */
  const nome = document.getElementById("nomePlanilha").value.trim();

  /*
        pega o formato escolhido
    */
  const tipo = document.getElementById("tipoExportacao").value;

  /*
        pega todos os campos criados
    */
  const campos = document.querySelectorAll(".campoNovo");

  /*
        cria uma lista vazia
        para guardar as colunas
    */
  const colunas = [];

  /*
        passa por cada campo
    */
  campos.forEach((campo) => {
    /*
            pega o texto escrito
        */
    const valor = campo.value.trim();

    /*
            se tiver algum texto
        */
    if (valor) {
      /*
                adiciona na lista
            */
      colunas.push(valor);
    }
  });

  /*
        se não existir nenhuma coluna
    */
  if (colunas.length === 0) {
    /*
            mostra um aviso
        */
    alert("Adicione pelo menos um campo.");

    return;
  }

  /*
        cria o objeto da nova planilha
    */
  const novaPlanilha = {
    /*
            cria um número único
            para identificar a planilha
        */
    id: Date.now().toString(),

    /*
            nome da planilha
        */
    nome: nome || "Sem título",

    /*
            excel ou google sheets
        */
    tipo: tipo,

    /*
            nomes das colunas
        */
    colunas: colunas,

    /*
            começa sem nenhum registro
        */
    linhas: [],

    /*
            guarda a data de criação
        */
    criadaEm: new Date().toISOString(),

    /*
            coloca a personalização inicial
        */
    personalizacao: personalizacaoPadrao(),
  };

  /*
        coloca a planilha na lista
    */
  planilhas.push(novaPlanilha);

  /*
        salva
    */
  salvar();

  /*
        fecha a janela
    */
  modalCriacao.close();

  /*
        abre a planilha recém-criada
    */
  abrirPlanilha(novaPlanilha.id);
}

/* ================================================= */
/* ABRIR E MOSTRAR PLANILHA */
/* ================================================= */

/*
    abre uma planilha pelo id
*/
function abrirPlanilha(id) {
  /*
        procura a planilha certa
    */
  planilhaAtual = planilhas.find((planilha) => planilha.id === id);

  /*
        se não encontrar
        para a função
    */
  if (!planilhaAtual) {
    return;
  }

  /*
        se for uma planilha antiga
        sem personalização
    */
  if (!planilhaAtual.personalizacao) {
    /*
            adiciona o padrão
        */
    planilhaAtual.personalizacao = personalizacaoPadrao();

    salvar();
  }

  /*
        esconde o dashboard
    */
  dashboard.classList.add("escondido");

  /*
        mostra o editor
    */
  editor.classList.remove("escondido");

  /*
        coloca o nome da planilha
        no campo do editor
    */
  document.getElementById("nomePlanilhaEditor").value = planilhaAtual.nome;

  /*
        mostra o tipo da planilha
    */
  document.getElementById("tipoPlanilha").textContent =
    "Formato: " + nomeTipo(planilhaAtual.tipo);

  /*
        carrega as cores salvas
    */
  carregarPersonalizacao();

  /*
        desenha a tabela
    */
  montarTabela();
}

/*
    essa função desenha a tabela
    dentro da página
*/
function montarTabela() {
  /*
        se não tiver planilha aberta
        não faz nada
    */
  if (!planilhaAtual) {
    return;
  }

  /*
        limpa os títulos antigos
    */
  cabecalhoTabela.innerHTML = "";

  /*
        limpa os registros antigos
    */
  corpoTabela.innerHTML = "";

  /*
        passa por todas as colunas
    */
  planilhaAtual.colunas.forEach((coluna, indice) => {
    /*
                cria uma célula de título
            */
    const th = document.createElement("th");

    /*
                coloca o nome da coluna
            */
    th.textContent = coluna;

    /*
                mostra uma dica
                quando passa o mouse
            */
    th.title = "Clique duas vezes para renomear";

    /*
                se der dois cliques
                no nome da coluna
            */
    th.ondblclick = () => {
      /*
                        permite renomear
                    */
      renomearColuna(indice);
    };

    /*
                coloca o título na tabela
            */
    cabecalhoTabela.appendChild(th);
  });

  /*
        cria a coluna chamada Ações
    */
  const thAcoes = document.createElement("th");

  thAcoes.textContent = "Ações";

  thAcoes.className = "coluna-acoes";

  /*
        coloca a coluna de ações
        no cabeçalho
    */
  cabecalhoTabela.appendChild(thAcoes);

  /*
        agora passa por todos os registros
    */
  planilhaAtual.linhas.forEach((linha, indiceLinha) => {
    /*
                cria uma linha nova
            */
    const tr = document.createElement("tr");

    /*
                passa por cada coluna
            */
    planilhaAtual.colunas.forEach((coluna, indiceColuna) => {
      /*
                        cria uma célula
                    */
      const td = document.createElement("td");

      /*
                        cria um campo onde
                        podemos escrever
                    */
      const input = document.createElement("input");

      /*
                        coloca o valor salvo
                        dentro da célula
                    */
      input.value = linha[indiceColuna] ?? "";

      /*
                        cria um texto de ajuda
                    */
      input.placeholder = "Digite " + coluna.toLowerCase();

      /*
                        toda vez que o usuário digitar
                    */
      input.addEventListener("input", (event) => {
        /*
                                salva o novo texto
                                naquela célula
                            */
        planilhaAtual.linhas[indiceLinha][indiceColuna] = event.target.value;

        /*
                                salva no navegador
                            */
        salvar();
      });

      /*
                        coloca o input
                        dentro da célula
                    */
      td.appendChild(input);

      /*
                        coloca a célula
                        dentro da linha
                    */
      tr.appendChild(td);
    });

    /*
                cria a célula onde
                fica o botão de excluir
            */
    const tdExcluir = document.createElement("td");

    tdExcluir.className = "coluna-acoes";

    /*
                cria o botão
            */
    const botao = document.createElement("button");

    /*
                coloca a lixeira
            */
    botao.textContent = "🗑️";

    /*
                mostra uma dica
            */
    botao.title = "Excluir registro";

    /*
                quando clicar
            */
    botao.onclick = () => {
      /*
                        apaga a linha
                    */
      excluirLinha(indiceLinha);
    };

    /*
                coloca o botão
                dentro da célula
            */
    tdExcluir.appendChild(botao);

    /*
                coloca a célula
                dentro da linha
            */
    tr.appendChild(tdExcluir);

    /*
                coloca a linha
                dentro da tabela
            */
    corpoTabela.appendChild(tr);
  });

  /*
        aplica as cores escolhidas
    */
  aplicarPersonalizacao();
}

/* ================================================= */
/* LINHAS */
/* ================================================= */

/*
    adiciona um novo registro
*/
function adicionarLinha() {
  if (!planilhaAtual) {
    return;
  }

  /*
        cria uma linha vazia

        a quantidade de espaços
        é igual à quantidade de colunas
    */
  const novaLinha = new Array(planilhaAtual.colunas.length).fill("");

  /*
        coloca a nova linha
        na planilha
    */
  planilhaAtual.linhas.push(novaLinha);

  /*
        salva
    */
  salvar();

  /*
        desenha a tabela novamente
    */
  montarTabela();
}

/*
    apaga uma linha
*/
function excluirLinha(indice) {
  if (!planilhaAtual) {
    return;
  }

  /*
        remove uma linha da lista
    */
  planilhaAtual.linhas.splice(indice, 1);

  /*
        salva
    */
  salvar();

  /*
        atualiza a tabela
    */
  montarTabela();
}

/* ================================================= */
/* COLUNAS */
/* ================================================= */

/*
    abre a janela para criar
    uma nova coluna
*/
function adicionarColuna() {
  if (!planilhaAtual) {
    return;
  }

  /*
        limpa o nome antigo
    */
  document.getElementById("novoCampo").value = "";

  /*
        abre a janela
    */
  modalCampo.showModal();
}

/*
    salva uma coluna nova
*/
function salvarNovaColuna(event) {
  /*
        impede a página de atualizar
    */
  event.preventDefault();

  if (!planilhaAtual) {
    return;
  }

  /*
        pega o nome escrito
    */
  const nome = document.getElementById("novoCampo").value.trim();

  /*
        se estiver vazio
        para aqui
    */
  if (!nome) {
    return;
  }

  /*
        adiciona o nome da coluna
    */
  planilhaAtual.colunas.push(nome);

  /*
        como apareceu uma coluna nova,
        todas as linhas precisam receber
        uma célula vazia nova
    */
  planilhaAtual.linhas.forEach((linha) => {
    linha.push("");
  });

  /*
        salva
    */
  salvar();

  /*
        fecha a janela
    */
  modalCampo.close();

  /*
        atualiza a tabela
    */
  montarTabela();
}

/*
    permite mudar o nome
    de uma coluna
*/
function renomearColuna(indice) {
  if (!planilhaAtual) {
    return;
  }

  /*
        pega o nome atual
    */
  const atual = planilhaAtual.colunas[indice];

  /*
        abre uma caixinha perguntando
        o novo nome
    */
  const novo = prompt("Novo nome do campo:", atual);

  /*
        se cancelar
        não faz nada
    */
  if (!novo) {
    return;
  }

  /*
        tira espaços extras
    */
  const nome = novo.trim();

  /*
        não deixa colocar nome vazio
    */
  if (!nome) {
    return;
  }

  /*
        troca o nome antigo
        pelo novo
    */
  planilhaAtual.colunas[indice] = nome;

  /*
        salva
    */
  salvar();

  /*
        atualiza a tabela
    */
  montarTabela();
}

/* ================================================= */
/* NOME DA PLANILHA */
/* ================================================= */

/*
    muda o nome da planilha
*/
function alterarNomePlanilha() {
  if (!planilhaAtual) {
    return;
  }

  /*
        pega o campo onde
        o nome aparece
    */
  const input = document.getElementById("nomePlanilhaEditor");

  /*
        salva o novo nome

        se estiver vazio,
        usa "Sem título"
    */
  planilhaAtual.nome = input.value.trim() || "Sem título";

  /*
        mostra o nome correto
        no campo
    */
  input.value = planilhaAtual.nome;

  /*
        salva
    */
  salvar();
}

/* ================================================= */
/* EXCLUIR PLANILHA */
/* ================================================= */

/*
    apaga uma planilha inteira
*/
function excluirPlanilha(event, id) {
  /*
        impede que o clique no botão
        também abra o card
    */
  event.stopPropagation();

  /*
        pergunta se realmente
        quer apagar
    */
  const confirmar = confirm("Deseja excluir esta planilha?");

  /*
        se escolher cancelar
    */
  if (!confirmar) {
    return;
  }

  /*
        cria uma lista nova
        sem a planilha apagada
    */
  planilhas = planilhas.filter((planilha) => planilha.id !== id);

  /*
        salva a nova lista
    */
  salvar();

  /*
        atualiza o dashboard
    */
  carregarDashboard();
}

/* ================================================= */
/* PERSONALIZAÇÃO */
/* ================================================= */

/*
    coloca nas caixinhas de personalização
    as opções que já estavam salvas
*/
function carregarPersonalizacao() {
  if (!planilhaAtual) {
    return;
  }

  /*
        colocamos a personalização
        dentro da letra p

        isso deixa o código menor
    */
  const p = planilhaAtual.personalizacao;

  /*
        coloca cada configuração
        no lugar certo
    */
  document.getElementById("corCabecalho").value = p.corCabecalho;

  document.getElementById("corTextoCabecalho").value = p.corTextoCabecalho;

  document.getElementById("corTexto").value = p.corTexto;

  document.getElementById("corCelulas").value = p.corCelulas;

  document.getElementById("corBorda").value = p.corBorda;

  document.getElementById("estiloPlanilha").value = p.estilo;

  document.getElementById("tamanhoFonte").value = p.tamanhoFonte;

  document.getElementById("alinhamento").value = p.alinhamento;
}

/*
    salva as mudanças
    que o usuário escolheu
*/
function alterarPersonalizacao() {
  if (!planilhaAtual) {
    return;
  }

  /*
        pega todos os valores
        escolhidos na tela
    */
  planilhaAtual.personalizacao = {
    /*
            cor do cabeçalho
        */
    corCabecalho: document.getElementById("corCabecalho").value,

    /*
            cor do texto do cabeçalho
        */
    corTextoCabecalho: document.getElementById("corTextoCabecalho").value,

    /*
            cor das informações
        */
    corTexto: document.getElementById("corTexto").value,

    /*
            fundo das células
        */
    corCelulas: document.getElementById("corCelulas").value,

    /*
            cor das bordas
        */
    corBorda: document.getElementById("corBorda").value,

    /*
            grade ou tabela
        */
    estilo: document.getElementById("estiloPlanilha").value,

    /*
            tamanho da fonte
        */
    tamanhoFonte: document.getElementById("tamanhoFonte").value,

    /*
            alinhamento
        */
    alinhamento: document.getElementById("alinhamento").value,
  };

  /*
        salva as novas configurações
    */
  salvar();

  /*
        mostra a mudança na hora
    */
  aplicarPersonalizacao();
}

/*
    aplica as cores
    dentro da tabela do site
*/
function aplicarPersonalizacao() {
  if (!planilhaAtual) {
    return;
  }

  /*
        pega a configuração atual
    */
  const p = planilhaAtual.personalizacao;

  /*
        pega todos os títulos
    */
  const cabecalhos = cabecalhoTabela.querySelectorAll("th");

  /*
        pega todas as células
    */
  const celulas = corpoTabela.querySelectorAll("td");

  /*
        pega os campos onde digitamos
    */
  const inputs = corpoTabela.querySelectorAll("input");

  /*
        muda o visual dos títulos
    */
  cabecalhos.forEach((th) => {
    /*
                muda o fundo
            */
    th.style.backgroundColor = p.corCabecalho;

    /*
                muda a cor da letra
            */
    th.style.color = p.corTextoCabecalho;

    /*
                muda o tamanho da letra
            */
    th.style.fontSize = p.tamanhoFonte + "px";

    /*
                muda a posição do texto
            */
    th.style.textAlign = p.alinhamento;

    /*
                muda a cor da borda
            */
    th.style.borderColor = p.corBorda;
  });

  /*
        muda o fundo e borda
        das células
    */
  celulas.forEach((td) => {
    td.style.backgroundColor = p.corCelulas;

    td.style.borderColor = p.corBorda;
  });

  /*
        muda o texto digitado
    */
  inputs.forEach((input) => {
    /*
                cor da letra
            */
    input.style.color = p.corTexto;

    /*
                fundo
            */
    input.style.backgroundColor = p.corCelulas;

    /*
                tamanho
            */
    input.style.fontSize = p.tamanhoFonte + "px";

    /*
                alinhamento
            */
    input.style.textAlign = p.alinhamento;
  });

  /*
        primeiro tira os dois estilos
        para não misturar
    */
  tabelaPlanilha.classList.remove("modo-grade", "modo-tabela");

  /*
        se o usuário escolheu tabela
    */
  if (p.estilo === "tabela") {
    /*
            coloca o modo tabela
        */
    tabelaPlanilha.classList.add("modo-tabela");
  } else {
    /*
            senão usa o modo grade
        */
    tabelaPlanilha.classList.add("modo-grade");
  }
}

/*
    volta todas as configurações
    para o padrão
*/
function restaurarPersonalizacao() {
  if (!planilhaAtual) {
    return;
  }

  /*
        pergunta antes de mudar
    */
  const confirmar = confirm("Deseja restaurar o visual padrão?");

  /*
        se cancelar
    */
  if (!confirmar) {
    return;
  }

  /*
        coloca o padrão novamente
    */
  planilhaAtual.personalizacao = personalizacaoPadrao();

  /*
        salva
    */
  salvar();

  /*
        atualiza as caixinhas
        de escolha
    */
  carregarPersonalizacao();

  /*
        atualiza a tabela
    */
  aplicarPersonalizacao();
}

/* ================================================= */
/* EXPORTAÇÃO */
/* ================================================= */

/*
    escolhe qual tipo de exportação
    será usado
*/
function exportarPlanilha() {
  if (!planilhaAtual) {
    return;
  }

  /*
        verifica se a biblioteca do excel
        carregou corretamente
    */
  if (typeof XLSX === "undefined") {
    /*
            mostra erro
        */
    alert("A biblioteca de exportação não foi carregada.");

    return;
  }

  /*
        se a planilha for excel
    */
  if (planilhaAtual.tipo === "excel") {
    /*
            exporta para excel
        */
    exportarExcel();

    return;
  }

  /*
        se for google sheets
    */
  if (planilhaAtual.tipo === "google") {
    /*
            prepara para google sheets
        */
    exportarGoogleSheets();
  }
}

/*
    junta todos os dados
    em uma lista
*/
function obterDadosPlanilha() {
  return [
    /*
            primeira linha:
            nomes das colunas
        */
    planilhaAtual.colunas,

    /*
            depois:
            todos os registros
        */
    ...planilhaAtual.linhas,
  ];
}

/*
    limpa o nome do arquivo

    alguns símbolos não podem
    ser usados no nome de um arquivo
*/
function limparNomeArquivo(nome) {
  return nome.replace(/[<>:"/\\|?*]/g, "").trim() || "planilha";
}

/*
    prepara uma cor
    para o excel

    exemplo:

    #1597e5

    vira

    1597E5
*/
function corExcel(cor) {
  /*
        se não existir uma cor
        usa preto
    */
  if (!cor) {
    return "000000";
  }

  /*
        tira o #
        e deixa tudo maiúsculo
    */
  return cor.replace("#", "").toUpperCase();
}

/*
    cria as bordas
    que serão colocadas no excel
*/
function criarBorda(cor) {
  return {
    /*
            borda de cima
        */
    top: {
      style: "thin",

      color: {
        rgb: cor,
      },
    },

    /*
            borda de baixo
        */
    bottom: {
      style: "thin",

      color: {
        rgb: cor,
      },
    },

    /*
            borda esquerda
        */
    left: {
      style: "thin",

      color: {
        rgb: cor,
      },
    },

    /*
            borda direita
        */
    right: {
      style: "thin",

      color: {
        rgb: cor,
      },
    },
  };
}

/*
    essa é uma das partes mais importantes

    ela transforma nossos dados
    em uma planilha de excel de verdade
*/
function criarWorksheet() {
  /*
        pega os dados
    */
  const dados = obterDadosPlanilha();

  /*
        transforma a lista
        em uma planilha
    */
  const worksheet = XLSX.utils.aoa_to_sheet(dados);

  /*
        pega a personalização atual

        se não existir,
        usa o padrão
    */
  const p = planilhaAtual.personalizacao || personalizacaoPadrao();

  /*
        prepara as cores
        para o formato do excel
    */
  const corCabecalho = corExcel(p.corCabecalho);

  const corTextoCabecalho = corExcel(p.corTextoCabecalho);

  const corTexto = corExcel(p.corTexto);

  const corCelulas = corExcel(p.corCelulas);

  const corBorda = corExcel(p.corBorda);

  /*
        conta quantas linhas existem

        soma 1 porque existe
        a linha do cabeçalho
    */
  const quantidadeLinhas = planilhaAtual.linhas.length + 1;

  /*
        conta quantas colunas existem
    */
  const quantidadeColunas = planilhaAtual.colunas.length;

  /*
        passa por todas as linhas
    */
  for (let linha = 0; linha < quantidadeLinhas; linha++) {
    /*
            passa por todas as colunas
        */
    for (let coluna = 0; coluna < quantidadeColunas; coluna++) {
      /*
                descobre o endereço
                daquela célula

                exemplo:

                A1
                B1
                C2
            */
      const endereco = XLSX.utils.encode_cell({
        r: linha,

        c: coluna,
      });

      /*
                pega a célula
            */
      let celula = worksheet[endereco];

      /*
                se a célula estiver vazia,
                ela pode ainda não existir

                então criamos ela
            */
      if (!celula) {
        celula = {
          /*
                        valor vazio
                    */
          v: "",

          /*
                        diz que é texto
                    */
          t: "s",
        };

        /*
                    coloca a célula
                    dentro da planilha
                */
        worksheet[endereco] = celula;
      }

      /*
                se for a primeira linha
            */
      if (linha === 0) {
        /*
                    aplica o estilo
                    do cabeçalho
                */
        celula.s = {
          /*
                        cor de fundo
                    */
          fill: {
            patternType: "solid",

            fgColor: {
              rgb: corCabecalho,
            },
          },

          /*
                        estilo da letra
                    */
          font: {
            name: "Arial",

            /*
                            deixa em negrito
                        */
            bold: true,

            /*
                            tamanho
                        */
            sz: Number(p.tamanhoFonte),

            /*
                            cor
                        */
            color: {
              rgb: corTextoCabecalho,
            },
          },

          /*
                        posição do texto
                    */
          alignment: {
            horizontal: p.alinhamento,

            vertical: "center",

            /*
                            deixa o texto quebrar linha
                            se ficar muito grande
                        */
            wrapText: true,
          },

          /*
                        bordas
                    */
          border: criarBorda(corBorda),
        };
      } else {
        /*
                    se não for o cabeçalho,
                    aplica o estilo das informações
                */
        celula.s = {
          /*
                        fundo da célula
                    */
          fill: {
            patternType: "solid",

            fgColor: {
              rgb: corCelulas,
            },
          },

          /*
                        letra das informações
                    */
          font: {
            name: "Arial",

            sz: Number(p.tamanhoFonte),

            color: {
              rgb: corTexto,
            },
          },

          /*
                        alinhamento
                    */
          alignment: {
            horizontal: p.alinhamento,

            vertical: "center",

            wrapText: true,
          },

          /*
                        bordas
                    */
          border: criarBorda(corBorda),
        };
      }
    }
  }

  /*
        agora ajustamos automaticamente
        a largura das colunas
    */
  worksheet["!cols"] = planilhaAtual.colunas.map((coluna, indice) => {
    /*
                    começa usando
                    o tamanho do nome da coluna
                */
    let maior = String(coluna).length;

    /*
                    olha todas as linhas
                */
    planilhaAtual.linhas.forEach((linha) => {
      /*
                                pega o valor
                                daquela coluna
                            */
      const valor = String(linha[indice] ?? "");

      /*
                                se encontrar um texto maior
                            */
      if (valor.length > maior) {
        /*
                                    usa esse novo tamanho
                                */
        maior = valor.length;
      }
    });

    /*
                    devolve a largura da coluna
                */
    return {
      /*
                        adiciona um espacinho extra

                        máximo de 50
                    */
      wch: Math.min(maior + 4, 50),
    };
  });

  /*
        ajusta a altura das linhas
    */
  worksheet["!rows"] = new Array(quantidadeLinhas)
    .fill(null)
    .map((valor, indice) => {
      /*
                        se for o cabeçalho
                        deixa um pouco maior
                    */
      if (indice === 0) {
        return {
          hpt: 28,
        };
      }

      /*
                        altura normal
                    */
      return {
        hpt: 22,
      };
    });

  /*
        devolve a planilha pronta
    */
  return worksheet;
}

/*
    cria o arquivo excel
    e faz o download
*/
function baixarArquivoExcel() {
  /*
        cria a planilha com os estilos
    */
  const worksheet = criarWorksheet();

  /*
        cria um arquivo excel vazio
    */
  const workbook = XLSX.utils.book_new();

  /*
        coloca nossa planilha
        dentro do arquivo
    */
  XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");

  /*
        cria o nome do arquivo
    */
  const nomeArquivo = limparNomeArquivo(planilhaAtual.nome) + ".xlsx";

  /*
        faz o download do arquivo
    */
  XLSX.writeFile(workbook, nomeArquivo, {
    /*
                formato excel
            */
    bookType: "xlsx",

    /*
                ajuda na criação do arquivo
            */
    type: "binary",

    /*
                fala para manter estilos
            */
    cellStyles: true,

    /*
                deixa o arquivo menor
            */
    compression: true,
  });
}

/*
    exporta diretamente
    para arquivo excel
*/
function exportarExcel() {
  /*
        chama a função que baixa
        o arquivo
    */
  baixarArquivoExcel();
}

/*
    prepara a planilha
    para usar no google sheets
*/
function exportarGoogleSheets() {
  /*
        primeiro baixa o arquivo .xlsx
    */
  baixarArquivoExcel();

  /*
        espera meio segundo
    */
  setTimeout(
    () => {
      /*
                pergunta se o usuário
                quer abrir o google sheets
            */
      const abrir = confirm(
        "A planilha foi baixada em .xlsx com a personalização.\n\n" +
          "Agora importe esse arquivo no Google Sheets.\n\n" +
          "Use:\n\n" +
          "Arquivo → Importar → Upload\n\n" +
          "Deseja abrir o Google Sheets?",
      );

      /*
                se escolher sim
            */
      if (abrir) {
        /*
                    abre o google sheets
                    em uma nova aba
                */
        window.open("https://sheets.google.com/", "_blank");
      }
    },

    /*
            espera 500 milissegundos
        */
    500,
  );
}

/* ================================================= */
/* NOME DO FORMATO */
/* ================================================= */

/*
    transforma o valor salvo
    em um nome mais bonito
*/
function nomeTipo(tipo) {
  /*
        se for excel
    */
  if (tipo === "excel") {
    return "Microsoft Excel";
  }

  /*
        se for google sheets
    */
  if (tipo === "google") {
    return "Google Sheets";
  }

  /*
        se aparecer outro valor
    */
  return "Planilha";
}

/* ================================================= */
/* INÍCIO DO SISTEMA */
/* ================================================= */

/*
    quando a página abre,
    carrega o dashboard

    isso faz as planilhas salvas
    aparecerem automaticamente
*/
carregarDashboard();
