/* ================================================= */
/* AEROGRID - JAVASCRIPT PRINCIPAL */
/* ================================================= */

/*
    este arquivo é responsável por fazer
    praticamente todo o sistema funcionar.

    ele cuida de:

    - criar planilhas
    - salvar planilhas
    - abrir planilhas
    - criar os modelos prontos
    - fazer cálculos automáticos
    - personalizar
    - excluir registros
    - exportar para excel
*/

/* ================================================= */
/* MODELOS PRONTOS */
/* ================================================= */

/*
    aqui cadastramos todos os modelos
    disponíveis no AeroGrid.

    cada modelo possui:

    nome
        nome mostrado para o usuário.

    categoria
        negócios ou educação.

    icone
        emoji mostrado no card.

    descricao
        pequena explicação.

    colunas
        campos que serão criados automaticamente.

    calculadas
        posição das colunas que o usuário
        NÃO precisa preencher.

        elas são calculadas pelo sistema.

    resumo
        informa qual tipo de painel de resultados
        será mostrado acima da tabela.
*/
const modelosPlanilha = {
  /* ================================================= */
  /* NEGÓCIOS */
  /* ================================================= */

  financeiro: {
    nome: "Controle Financeiro",

    categoria: "negocios",

    icone: "💰",

    descricao:
      "Registre entradas e saídas e acompanhe o saldo automaticamente.",

    colunas: ["Descrição", "Categoria", "Tipo", "Valor"],

    /*
            não existe coluna automática dentro da tabela.

            os cálculos de entrada, saída e saldo
            aparecem no painel de resumo.
        */
    calculadas: [],

    resumo: "financeiro",
  },

  orcamento: {
    nome: "Orçamento",

    categoria: "negocios",

    icone: "🧾",

    descricao: "Calcule automaticamente o total de cada item.",

    colunas: ["Item", "Quantidade", "Valor unitário", "Total"],

    /*
            JavaScript começa a contar no zero.

            0 = Item
            1 = Quantidade
            2 = Valor unitário
            3 = Total

            então a coluna 3 será calculada.
        */
    calculadas: [3],

    resumo: "orcamento",
  },

  estoque: {
    nome: "Controle de Estoque",

    categoria: "negocios",

    icone: "📦",

    descricao: "Controle custos, estoque, lucro e potencial de venda.",

    colunas: [
      "Produto",
      "Quantidade",
      "Custo unitário",
      "Preço de venda",
      "Valor em estoque",
      "Lucro unitário",
      "Potencial de venda",
    ],

    /*
            essas três colunas
            são calculadas pelo sistema.
        */
    calculadas: [4, 5, 6],

    resumo: "estoque",
  },

  vendas: {
    nome: "Vendas e Comissão",

    categoria: "negocios",

    icone: "📈",

    descricao: "Calcule o total vendido e a comissão de cada venda.",

    colunas: [
      "Vendedor",
      "Produto",
      "Quantidade",
      "Valor unitário",
      "Total da venda",
      "Comissão %",
      "Comissão",
    ],

    calculadas: [4, 6],

    resumo: "vendas",
  },

  /* ================================================= */
  /* EDUCAÇÃO */
  /* ================================================= */

  notas: {
    nome: "Notas Escolares",

    categoria: "educacao",

    icone: "🎓",

    descricao: "Digite três notas e o sistema calcula média e situação.",

    colunas: ["Aluno", "Nota 1", "Nota 2", "Nota 3", "Média", "Situação"],

    calculadas: [4, 5],

    resumo: "notas",
  },

  frequencia: {
    nome: "Frequência Escolar",

    categoria: "educacao",

    icone: "📚",

    descricao: "Calcule presenças e porcentagem de frequência.",

    colunas: [
      "Aluno",
      "Total de aulas",
      "Faltas",
      "Presenças",
      "Frequência %",
      "Situação",
    ],

    calculadas: [3, 4, 5],

    resumo: "frequencia",
  },

  estudos: {
    nome: "Plano de Estudos",

    categoria: "educacao",

    icone: "📝",

    descricao: "Organize matérias e acompanhe seu progresso.",

    colunas: [
      "Disciplina",
      "Conteúdo",
      "Data",
      "Horas planejadas",
      "Horas estudadas",
      "Progresso %",
    ],

    calculadas: [5],

    resumo: "estudos",
  },
};

/*
    guarda qual filtro está selecionado
    na janela dos modelos.

    começa mostrando todos.
*/
let filtroModelosAtual = "todos";

/* ================================================= */
/* DADOS SALVOS */
/* ================================================= */

/*
    localStorage é uma pequena memória
    do navegador.

    aqui tentamos pegar as planilhas
    que já foram criadas anteriormente.

    se não existir nenhuma,
    usamos uma lista vazia [].
*/
let planilhas = JSON.parse(localStorage.getItem("planilhas")) || [];

/*
    guarda qual planilha
    está aberta no editor.
*/
let planilhaAtual = null;

/* ================================================= */
/* ELEMENTOS DO HTML */
/* ================================================= */

/*
    aqui guardamos algumas partes do HTML
    em variáveis.

    assim não precisamos usar
    document.getElementById várias vezes.
*/
const dashboard = document.getElementById("dashboard");

const editor = document.getElementById("editor");

const modalCriacao = document.getElementById("modalCriacao");

const modalCampo = document.getElementById("modalCampo");

const listaPlanilhas = document.getElementById("listaPlanilhas");

const cabecalhoTabela = document.getElementById("cabecalhoTabela");

const corpoTabela = document.getElementById("corpoTabela");

const tabelaPlanilha = document.getElementById("tabelaPlanilha");

const resumoModelo = document.getElementById("resumoModelo");

/* ================================================= */
/* PERSONALIZAÇÃO PADRÃO */
/* ================================================= */

/*
    essa função devolve as cores
    usadas por uma planilha nova.
*/
function personalizacaoPadrao() {
  return {
    corCabecalho: "#1597e5",

    corTextoCabecalho: "#ffffff",

    corTexto: "#24435a",

    corCelulas: "#ffffff",

    corBorda: "#b7dce9",

    estilo: "grade",

    tamanhoFonte: "14",

    alinhamento: "left",
  };
}

/* ================================================= */
/* CORRIGIR PLANILHAS ANTIGAS */
/* ================================================= */

/*
    mantém apenas planilhas criadas
    para Excel ou Google Sheets.
*/
planilhas = planilhas.filter((planilha) => {
  return planilha.tipo === "excel" || planilha.tipo === "google";
});

/*
    planilhas criadas antes dessas novas funções
    podem não possuir "personalizacao" ou "modelo".

    então adicionamos essas informações.
*/
planilhas.forEach((planilha) => {
  if (!planilha.personalizacao) {
    planilha.personalizacao = personalizacaoPadrao();
  }

  /*
            planilha antiga será tratada
            como planilha em branco.
        */
  if (!planilha.modelo) {
    planilha.modelo = "vazio";
  }
});

/*
    salva as correções.
*/
salvar();

/* ================================================= */
/* SALVAR */
/* ================================================= */

/*
    transforma a lista de planilhas em texto JSON
    e salva dentro do navegador.
*/
function salvar() {
  localStorage.setItem("planilhas", JSON.stringify(planilhas));
}

/* ================================================= */
/* FUNÇÕES DE AJUDA */
/* ================================================= */

/*
    verifica se alguma informação
    realmente foi preenchida.
*/
function temValor(valor) {
  return valor !== "" && valor !== null && valor !== undefined;
}

/*
    transforma valores digitados
    pelo usuário em números.

    exemplos aceitos:

    10
    10,50
    10.50
    R$ 10,50
*/
function numero(valor) {
  /*
        se já for um número,
        não precisamos converter.
    */
  if (typeof valor === "number") {
    return valor;
  }

  /*
        vazio vira zero.
    */
  if (!temValor(valor)) {
    return 0;
  }

  let texto = String(valor).trim().replace(/R\$/gi, "").replace(/\s/g, "");

  /*
        exemplo brasileiro:

        1.500,50

        vira:

        1500.50
    */
  if (texto.includes(".") && texto.includes(",")) {
    texto = texto.replace(/\./g, "").replace(",", ".");
  } else {
    /*
            10,50 vira 10.50
        */
    texto = texto.replace(",", ".");
  }

  /*
        remove caracteres
        que não sejam números.
    */
  texto = texto.replace(/[^0-9.-]/g, "");

  const resultado = Number(texto);

  /*
        se a conversão falhar,
        retorna zero.
    */
  if (Number.isNaN(resultado)) {
    return 0;
  }

  return resultado;
}

/*
    deixa números com no máximo
    duas casas decimais.
*/
function arredondar(valor) {
  return Number(Number(valor).toFixed(2));
}

/*
    transforma número em dinheiro brasileiro.

    1500

    vira:

    R$ 1.500,00
*/
function dinheiro(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",

    currency: "BRL",
  }).format(numero(valor));
}

/*
    deixa um texto em letras pequenas
    e remove acentos.

    isso ajuda o sistema a entender:

    Saída
    saida
    SAÍDA

    como a mesma palavra.
*/
function normalizarTexto(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/*
    procura um modelo pelo seu nome interno.

    exemplo:

    obterModelo("estoque")
*/
function obterModelo(id) {
  return modelosPlanilha[id] || null;
}

/*
    devolve o nome bonito do modelo.
*/
function nomeModelo(id) {
  const modelo = obterModelo(id);

  if (!modelo) {
    return "Planilha em branco";
  }

  return modelo.nome;
}

/*
    verifica se determinada coluna
    deve ser calculada automaticamente.
*/
function ehColunaCalculada(indice) {
  if (!planilhaAtual) {
    return false;
  }

  const modelo = obterModelo(planilhaAtual.modelo);

  if (!modelo) {
    return false;
  }

  return modelo.calculadas.includes(indice);
}

/* ================================================= */
/* DASHBOARD */
/* ================================================= */

/*
    volta para a tela principal.
*/
function mostrarDashboard() {
  /*
        mostra dashboard.
    */
  dashboard.classList.remove("escondido");

  /*
        esconde editor.
    */
  editor.classList.add("escondido");

  /*
        nenhuma planilha está aberta.
    */
  planilhaAtual = null;

  /*
        atualiza os cards e números.
    */
  carregarDashboard();
}

/*
    atualiza as informações
    mostradas no dashboard.
*/
function carregarDashboard() {
  /*
        limpa os cards antigos.
    */
  listaPlanilhas.innerHTML = "";

  let registros = 0;

  let campos = 0;

  /*
        percorre todas as planilhas
        para contar linhas e colunas.
    */
  planilhas.forEach((planilha) => {
    registros += planilha.linhas.length;

    campos += planilha.colunas.length;
  });

  /*
        mostra os totais no HTML.
    */
  document.getElementById("totalPlanilhas").textContent = planilhas.length;

  document.getElementById("totalRegistros").textContent = registros;

  document.getElementById("totalCampos").textContent = campos;

  /*
        caso nenhuma planilha exista,
        mostra uma mensagem.
    */
  if (planilhas.length === 0) {
    listaPlanilhas.innerHTML = `

            <div class="vazio">

                <h3>
                    Nenhuma planilha ainda
                </h3>

                <p>
                    Crie uma do zero ou use um modelo pronto.
                </p>

            </div>

        `;

    return;
  }

  /*
        cria um card para cada planilha.
    */
  planilhas.forEach((planilha) => {
    const card = document.createElement("article");

    card.className = "card-planilha";

    /*
                se a planilha usa um modelo,
                mostramos o nome dele.
            */
    const etiquetaModelo =
      planilha.modelo && planilha.modelo !== "vazio"
        ? `
                        <span class="tag-modelo">

                            ${nomeModelo(planilha.modelo)}

                        </span>
                    `
        : "";

    card.innerHTML = `

                <div class="topo-card-planilha">

                    <h4>

                        📄 ${planilha.nome}

                    </h4>

                    ${etiquetaModelo}

                </div>


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
                clicar no card abre a planilha.
            */
    card.addEventListener("click", () => {
      abrirPlanilha(planilha.id);
    });

    /*
                coloca o card na tela.
            */
    listaPlanilhas.appendChild(card);
  });
}

/* ================================================= */
/* ABRIR CRIAÇÃO */
/* ================================================= */

/*
    prepara e abre o modal
    de criação de planilhas.
*/
function abrirCriacao() {
  /*
        limpa o nome antigo.
    */
  document.getElementById("nomePlanilha").value = "";

  /*
        começa selecionando Excel.
    */
  document.getElementById("tipoExportacao").value = "excel";

  /*
        limpa campos antigos.
    */
  document.getElementById("camposCriacao").innerHTML = "";

  /*
        começa com um campo chamado Nome.
    */
  adicionarCampoCriacao("Nome");

  /*
        começa selecionando
        planilha em branco.
    */
  document.getElementById("modeloSelecionado").value = "vazio";

  filtroModelosAtual = "todos";

  /*
        remove seleção visual
        dos filtros antigos.
    */
  document.querySelectorAll(".filtro-modelo").forEach((botao) => {
    botao.classList.remove("ativo");
  });

  /*
        seleciona novamente
        o primeiro filtro: Todos.
    */
  const primeiroFiltro = document.querySelector(".filtro-modelo");

  if (primeiroFiltro) {
    primeiroFiltro.classList.add("ativo");
  }

  /*
        cria os cards dos modelos.
    */
  renderizarModelos();

  /*
        seleciona planilha em branco.
    */
  selecionarModelo("vazio");

  /*
        abre o modal.
    */
  modalCriacao.showModal();
}

/*
    fecha o modal.
*/
function fecharCriacao() {
  modalCriacao.close();
}

/* ================================================= */
/* GALERIA DE MODELOS */
/* ================================================= */

/*
    cria visualmente todos os cards
    dos modelos disponíveis.
*/
function renderizarModelos() {
  const lista = document.getElementById("listaModelos");

  const selecionado = document.getElementById("modeloSelecionado").value;

  /*
        limpa modelos antigos.
    */
  lista.innerHTML = "";

  /*
        Object.entries transforma os modelos
        em pares:

        id + informações do modelo.
    */
  Object.entries(modelosPlanilha).forEach(([id, modelo]) => {
    /*
                se existe um filtro ativo,
                ignoramos modelos de outra categoria.
            */
    if (
      filtroModelosAtual !== "todos" &&
      modelo.categoria !== filtroModelosAtual
    ) {
      return;
    }

    /*
                cria o botão do modelo.
            */
    const botao = document.createElement("button");

    botao.type = "button";

    botao.className = "card-modelo";

    botao.dataset.modelo = id;

    /*
                destaca se já estiver selecionado.
            */
    if (selecionado === id) {
      botao.classList.add("modelo-selecionado");
    }

    /*
                transforma categoria
                em um nome bonito.
            */
    const categoria = modelo.categoria === "educacao" ? "Educação" : "Negócios";

    /*
                coloca informações dentro do card.
            */
    botao.innerHTML = `

                <span class="icone-modelo">

                    ${modelo.icone}

                </span>


                <span class="conteudo-modelo">

                    <small>

                        ${categoria}

                    </small>


                    <strong>

                        ${modelo.nome}

                    </strong>


                    <span>

                        ${modelo.descricao}

                    </span>

                </span>

            `;

    /*
                clicar seleciona o modelo.
            */
    botao.onclick = () => {
      selecionarModelo(id);
    };

    lista.appendChild(botao);
  });
}

/*
    troca entre:

    Todos
    Negócios
    Educação
*/
function filtrarModelos(filtro, botao) {
  filtroModelosAtual = filtro;

  /*
        tira o destaque de todos.
    */
  document.querySelectorAll(".filtro-modelo").forEach((item) => {
    item.classList.remove("ativo");
  });

  /*
        destaca o atual.
    */
  if (botao) {
    botao.classList.add("ativo");
  }

  /*
        monta novamente a galeria.
    */
  renderizarModelos();
}

/*
    seleciona um modelo específico.
*/
function selecionarModelo(id) {
  const inputModelo = document.getElementById("modeloSelecionado");

  const areaManual = document.getElementById("areaCamposManuais");

  const info = document.getElementById("infoModeloSelecionado");

  const botaoVazio = document.getElementById("modeloVazio");

  /*
        guarda o modelo escolhido.
    */
  inputModelo.value = id;

  /*
        tira destaques antigos.
    */
  document.querySelectorAll(".card-modelo").forEach((card) => {
    card.classList.remove("modelo-selecionado");
  });

  botaoVazio.classList.remove("modelo-selecionado");

  /*
        se escolheu planilha em branco...
    */
  if (id === "vazio") {
    /*
            destaca planilha em branco.
        */
    botaoVazio.classList.add("modelo-selecionado");

    /*
            mostra os campos manuais.
        */
    areaManual.classList.remove("escondido");

    /*
            esconde informações de modelo.
        */
    info.classList.add("escondido");

    return;
  }

  /*
        pega as informações do modelo.
    */
  const modelo = obterModelo(id);

  if (!modelo) {
    return;
  }

  /*
        encontra o card escolhido.
    */
  const card = document.querySelector(`[data-modelo="${id}"]`);

  /*
        destaca o card.
    */
  if (card) {
    card.classList.add("modelo-selecionado");
  }

  /*
        como o modelo já possui campos,
        escondemos a criação manual.
    */
  areaManual.classList.add("escondido");

  /*
        mostra informações do modelo.
    */
  info.innerHTML = `

        <strong>

            ${modelo.icone}

            ${modelo.nome} selecionado

        </strong>


        <p>

            Campos:

            ${modelo.colunas.join(" · ")}

        </p>


        ${
          modelo.calculadas.length > 0
            ? `
                    <small>

                        ∑ Este modelo possui
                        cálculos automáticos.

                    </small>
                `
            : ""
        }

    `;

  info.classList.remove("escondido");

  /*
        se o usuário ainda não colocou um nome,
        usamos o nome do próprio modelo.
    */
  const nomeInput = document.getElementById("nomePlanilha");

  if (!nomeInput.value.trim()) {
    nomeInput.value = modelo.nome;
  }
}

/* ================================================= */
/* CAMPOS MANUAIS */
/* ================================================= */

/*
    adiciona um campo na criação
    de uma planilha em branco.
*/
function adicionarCampoCriacao(valor = "") {
  const container = document.getElementById("camposCriacao");

  /*
        cria uma nova div.
    */
  const campo = document.createElement("div");

  campo.className = "campo-criacao";

  /*
        adiciona input e botão de excluir.
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

  container.appendChild(campo);
}

/* ================================================= */
/* CRIAR PLANILHA */
/* ================================================= */

/*
    recebe as informações do modal
    e cria a nova planilha.
*/
function criarPlanilha(event) {
  /*
        evita que o formulário
        atualize a página.
    */
  event.preventDefault();

  const nome = document.getElementById("nomePlanilha").value.trim();

  const tipo = document.getElementById("tipoExportacao").value;

  const modeloId = document.getElementById("modeloSelecionado").value;

  let colunas = [];

  let linhas = [];

  /*
        CASO 1:
        modelo pronto.
    */
  if (modeloId !== "vazio") {
    const modelo = obterModelo(modeloId);

    if (!modelo) {
      alert("Não foi possível encontrar o modelo.");

      return;
    }

    /*
            copia as colunas do modelo.
        */
    colunas = [...modelo.colunas];

    /*
            já cria uma linha vazia
            para o usuário começar.
        */
    linhas = [new Array(colunas.length).fill("")];
  } else {
    /*
            CASO 2:
            planilha em branco.
        */
    const campos = document.querySelectorAll(".campoNovo");

    campos.forEach((campo) => {
      const valor = campo.value.trim();

      if (valor) {
        colunas.push(valor);
      }
    });

    /*
            não permite criar
            uma planilha sem colunas.
        */
    if (colunas.length === 0) {
      alert("Adicione pelo menos um campo.");

      return;
    }
  }

  /*
        cria o objeto da nova planilha.

        todas as informações importantes
        ficam guardadas aqui.
    */
  const novaPlanilha = {
    /*
            Date.now cria um número praticamente
            único usando o horário atual.
        */
    id: Date.now().toString(),

    nome: nome || "Sem título",

    tipo: tipo,

    modelo: modeloId,

    colunas: colunas,

    linhas: linhas,

    criadaEm: new Date().toISOString(),

    personalizacao: personalizacaoPadrao(),
  };

  /*
        calcula valores iniciais
        caso o modelo possua fórmulas.
    */
  atualizarTodosCalculos(novaPlanilha);

  /*
        adiciona na lista.
    */
  planilhas.push(novaPlanilha);

  /*
        salva.
    */
  salvar();

  /*
        fecha modal.
    */
  modalCriacao.close();

  /*
        abre a planilha recém-criada.
    */
  abrirPlanilha(novaPlanilha.id);
}

/* ================================================= */
/* CÁLCULOS DOS MODELOS */
/* ================================================= */

/*
    essa é a principal função
    de cálculos automáticos.

    ela recebe:

    planilha
        planilha que queremos calcular.

    indiceLinha
        qual linha deve ser recalculada.
*/
function atualizarCalculosModelo(planilha, indiceLinha) {
  const linha = planilha.linhas[indiceLinha];

  if (!linha) {
    return;
  }

  /* ================================================= */
  /* NOTAS ESCOLARES */
  /* ================================================= */

  if (planilha.modelo === "notas") {
    /*
            verifica se as três notas existem.
        */
    const completas = [1, 2, 3].every((indice) => temValor(linha[indice]));

    /*
            se faltar alguma nota,
            não calcula.
        */
    if (!completas) {
      linha[4] = "";

      linha[5] = "";

      return;
    }

    /*
            soma as três notas
            e divide por três.
        */
    const media = (numero(linha[1]) + numero(linha[2]) + numero(linha[3])) / 3;

    linha[4] = arredondar(media);

    /*
            nesse modelo usamos:

            média 6 ou maior = aprovado.
        */
    linha[5] = media >= 6 ? "Aprovado" : "Reprovado";

    return;
  }

  /* ================================================= */
  /* FREQUÊNCIA ESCOLAR */
  /* ================================================= */

  if (planilha.modelo === "frequencia") {
    /*
            precisamos do total de aulas
            e das faltas.
        */
    if (!temValor(linha[1]) || !temValor(linha[2])) {
      linha[3] = "";

      linha[4] = "";

      linha[5] = "";

      return;
    }

    const aulas = numero(linha[1]);

    const faltas = numero(linha[2]);

    /*
            presenças =
            aulas - faltas.
        */
    const presencas = Math.max(aulas - faltas, 0);

    linha[3] = arredondar(presencas);

    if (aulas <= 0) {
      linha[4] = "";

      linha[5] = "";

      return;
    }

    /*
            porcentagem de frequência.
        */
    const frequencia = (presencas / aulas) * 100;

    linha[4] = arredondar(frequencia);

    /*
            75% ou mais:
            Regular

            abaixo:
            Atenção
        */
    linha[5] = frequencia >= 75 ? "Regular" : "Atenção";

    return;
  }

  /* ================================================= */
  /* ORÇAMENTO */
  /* ================================================= */

  if (planilha.modelo === "orcamento") {
    /*
            precisa ter quantidade
            e valor unitário.
        */
    if (!temValor(linha[1]) || !temValor(linha[2])) {
      linha[3] = "";

      return;
    }

    /*
            total =
            quantidade × valor unitário.
        */
    linha[3] = arredondar(numero(linha[1]) * numero(linha[2]));

    return;
  }

  /* ================================================= */
  /* ESTOQUE */
  /* ================================================= */

  if (planilha.modelo === "estoque") {
    /*
            VALOR EM ESTOQUE

            quantidade × custo unitário
        */
    if (temValor(linha[1]) && temValor(linha[2])) {
      linha[4] = arredondar(numero(linha[1]) * numero(linha[2]));
    } else {
      linha[4] = "";
    }

    /*
            LUCRO POR UNIDADE

            preço de venda - custo
        */
    if (temValor(linha[2]) && temValor(linha[3])) {
      linha[5] = arredondar(numero(linha[3]) - numero(linha[2]));
    } else {
      linha[5] = "";
    }

    /*
            POTENCIAL DE VENDA

            quantidade × preço de venda
        */
    if (temValor(linha[1]) && temValor(linha[3])) {
      linha[6] = arredondar(numero(linha[1]) * numero(linha[3]));
    } else {
      linha[6] = "";
    }

    return;
  }

  /* ================================================= */
  /* VENDAS E COMISSÃO */
  /* ================================================= */

  if (planilha.modelo === "vendas") {
    /*
            TOTAL DA VENDA

            quantidade × valor unitário
        */
    if (temValor(linha[2]) && temValor(linha[3])) {
      linha[4] = arredondar(numero(linha[2]) * numero(linha[3]));
    } else {
      linha[4] = "";
    }

    /*
            COMISSÃO

            total × porcentagem / 100
        */
    if (temValor(linha[4]) && temValor(linha[5])) {
      linha[6] = arredondar(numero(linha[4]) * (numero(linha[5]) / 100));
    } else {
      linha[6] = "";
    }

    return;
  }

  /* ================================================= */
  /* PLANO DE ESTUDOS */
  /* ================================================= */

  if (planilha.modelo === "estudos") {
    if (!temValor(linha[3]) || !temValor(linha[4])) {
      linha[5] = "";

      return;
    }

    const planejadas = numero(linha[3]);

    const estudadas = numero(linha[4]);

    if (planejadas <= 0) {
      linha[5] = "";

      return;
    }

    /*
            progresso =

            horas estudadas
            ---------------- × 100
            horas planejadas
        */
    linha[5] = arredondar((estudadas / planejadas) * 100);
  }
}

/*
    recalcula TODAS as linhas
    de uma planilha.
*/
function atualizarTodosCalculos(planilha = planilhaAtual) {
  if (!planilha) {
    return;
  }

  planilha.linhas.forEach((linha, indice) => {
    atualizarCalculosModelo(planilha, indice);
  });
}

/* ================================================= */
/* ABRIR PLANILHA */
/* ================================================= */

function abrirPlanilha(id) {
  /*
        procura a planilha
        usando seu ID.
    */
  planilhaAtual = planilhas.find((planilha) => planilha.id === id);

  if (!planilhaAtual) {
    return;
  }

  /*
        corrige planilhas antigas.
    */
  if (!planilhaAtual.personalizacao) {
    planilhaAtual.personalizacao = personalizacaoPadrao();
  }

  if (!planilhaAtual.modelo) {
    planilhaAtual.modelo = "vazio";
  }

  /*
        recalcula tudo antes de abrir.
    */
  atualizarTodosCalculos(planilhaAtual);

  salvar();

  /*
        troca dashboard pelo editor.
    */
  dashboard.classList.add("escondido");

  editor.classList.remove("escondido");

  /*
        coloca o nome no editor.
    */
  document.getElementById("nomePlanilhaEditor").value = planilhaAtual.nome;

  /*
        mostra o formato.
    */
  document.getElementById("tipoPlanilha").textContent =
    "Formato: " + nomeTipo(planilhaAtual.tipo);

  /*
        mostra o nome do modelo.
    */
  const textoModelo = document.getElementById("textoModeloEditor");

  if (planilhaAtual.modelo && planilhaAtual.modelo !== "vazio") {
    textoModelo.textContent = "Modelo: " + nomeModelo(planilhaAtual.modelo);
  } else {
    textoModelo.textContent = "Editando planilha";
  }

  /*
        carrega visual.
    */
  carregarPersonalizacao();

  /*
        cria a tabela.
    */
  montarTabela();
}

/* ================================================= */
/* MONTAR TABELA */
/* ================================================= */

function montarTabela() {
  if (!planilhaAtual) {
    return;
  }

  /*
        garante que os cálculos
        estejam corretos.
    */
  atualizarTodosCalculos();

  /*
        limpa tabela antiga.
    */
  cabecalhoTabela.innerHTML = "";

  corpoTabela.innerHTML = "";

  /* ================================================= */
  /* CABEÇALHO */
  /* ================================================= */

  planilhaAtual.colunas.forEach((coluna, indice) => {
    const th = document.createElement("th");

    /*
                    nome normal da coluna.
                */
    th.textContent = coluna;

    /*
                    se for calculada,
                    colocamos ∑.
                */
    if (ehColunaCalculada(indice)) {
      th.textContent = "∑ " + coluna;

      th.title = "Calculado automaticamente.";
    } else {
      /*
                        colunas normais podem
                        ser renomeadas com dois cliques.
                    */
      th.title = "Clique duas vezes para renomear.";

      th.ondblclick = () => {
        renomearColuna(indice);
      };
    }

    cabecalhoTabela.appendChild(th);
  });

  /*
        cria coluna Ações.
    */
  const thAcoes = document.createElement("th");

  thAcoes.textContent = "Ações";

  thAcoes.className = "coluna-acoes";

  cabecalhoTabela.appendChild(thAcoes);

  /* ================================================= */
  /* LINHAS */
  /* ================================================= */

  planilhaAtual.linhas.forEach((linha, indiceLinha) => {
    /*
                    cria uma linha <tr>.
                */
    const tr = document.createElement("tr");

    /*
                    cria uma célula
                    para cada coluna.
                */
    planilhaAtual.colunas.forEach((coluna, indiceColuna) => {
      const td = document.createElement("td");

      const input = document.createElement("input");

      /*
                                mostra valor salvo.
                            */
      input.value = linha[indiceColuna] ?? "";

      const calculada = ehColunaCalculada(indiceColuna);

      /*
                                CAMPO CALCULADO
                            */
      if (calculada) {
        /*
                                    bloqueia edição.
                                */
        input.readOnly = true;

        input.classList.add("campo-calculado");

        input.title = "Calculado automaticamente pelo AeroGrid.";
      } else {
        /*
                                    CAMPO NORMAL
                                */
        input.placeholder = "Digite " + coluna.toLowerCase();

        /*
                                    sempre que o usuário digita...
                                */
        input.addEventListener("input", (event) => {
          /*
                                            salva o valor digitado.
                                        */
          planilhaAtual.linhas[indiceLinha][indiceColuna] = event.target.value;

          /*
                                            recalcula aquela linha.
                                        */
          atualizarCalculosModelo(planilhaAtual, indiceLinha);

          /*
                                            atualiza os valores automáticos
                                            na tela.
                                        */
          atualizarCelulasCalculadasDaLinha(tr, indiceLinha);

          /*
                                            salva.
                                        */
          salvar();

          /*
                                            atualiza o resumo.
                                        */
          montarResumoModelo();
        });
      }

      td.appendChild(input);

      tr.appendChild(td);
    });

    /* ================================================= */
    /* BOTÃO EXCLUIR LINHA */
    /* ================================================= */

    const tdExcluir = document.createElement("td");

    tdExcluir.className = "coluna-acoes";

    const botao = document.createElement("button");

    botao.textContent = "🗑️";

    botao.title = "Excluir registro";

    botao.onclick = () => {
      excluirLinha(indiceLinha);
    };

    tdExcluir.appendChild(botao);

    tr.appendChild(tdExcluir);

    corpoTabela.appendChild(tr);
  });

  /*
        aplica cores.
    */
  aplicarPersonalizacao();

  /*
        atualiza painel de resultados.
    */
  montarResumoModelo();
}

/*
    atualiza apenas as células automáticas
    da linha que acabou de ser alterada.

    assim não precisamos redesenhar
    a tabela inteira a cada tecla.
*/
function atualizarCelulasCalculadasDaLinha(tr, indiceLinha) {
  const inputs = tr.querySelectorAll("td input");

  inputs.forEach((input, indice) => {
    if (ehColunaCalculada(indice)) {
      input.value = planilhaAtual.linhas[indiceLinha][indice] ?? "";
    }
  });
}

/* ================================================= */
/* RESUMO DOS MODELOS */
/* ================================================= */

/*
    cria um card de resultado.

    exemplo:

    Saldo
    R$ 1.500,00
*/
function criarCardResumo(titulo, valor, detalhe = "") {
  return `

        <article class="card-resumo">

            <small>
                ${titulo}
            </small>


            <strong>
                ${valor}
            </strong>


            ${
              detalhe
                ? `
                        <span>
                            ${detalhe}
                        </span>
                    `
                : ""
            }

        </article>

    `;
}

/*
    calcula e mostra os resultados
    gerais de cada modelo.
*/
function montarResumoModelo() {
  if (!planilhaAtual || !resumoModelo) {
    return;
  }

  const modelo = obterModelo(planilhaAtual.modelo);

  /*
        planilhas em branco
        não possuem resumo automático.
    */
  if (!modelo || !modelo.resumo) {
    resumoModelo.classList.add("escondido");

    resumoModelo.innerHTML = "";

    return;
  }

  atualizarTodosCalculos();

  let conteudo = "";

  /* ================================================= */
  /* FINANCEIRO */
  /* ================================================= */

  if (modelo.resumo === "financeiro") {
    let entradas = 0;

    let saidas = 0;

    planilhaAtual.linhas.forEach((linha) => {
      const tipo = normalizarTexto(linha[2]);

      const valor = numero(linha[3]);

      /*
                        reconhece palavras relacionadas
                        a dinheiro entrando.
                    */
      if (
        tipo.includes("entrada") ||
        tipo.includes("receita") ||
        tipo.includes("ganho")
      ) {
        entradas += valor;
      }

      /*
                        reconhece dinheiro saindo.
                    */
      if (
        tipo.includes("saida") ||
        tipo.includes("despesa") ||
        tipo.includes("gasto")
      ) {
        saidas += valor;
      }
    });

    const saldo = entradas - saidas;

    conteudo += criarCardResumo("Entradas", dinheiro(entradas));

    conteudo += criarCardResumo("Saídas", dinheiro(saidas));

    conteudo += criarCardResumo("Saldo", dinheiro(saldo));
  }

  /* ================================================= */
  /* ORÇAMENTO */
  /* ================================================= */

  if (modelo.resumo === "orcamento") {
    /*
            soma todos os totais
            da coluna 3.
        */
    const total = planilhaAtual.linhas.reduce((soma, linha) => {
      return soma + numero(linha[3]);
    }, 0);

    conteudo += criarCardResumo("Valor total", dinheiro(total));

    /*
            conta quantos itens
            foram preenchidos.
        */
    conteudo += criarCardResumo(
      "Itens",
      planilhaAtual.linhas.filter((linha) => temValor(linha[0])).length,
    );
  }

  /* ================================================= */
  /* ESTOQUE */
  /* ================================================= */

  if (modelo.resumo === "estoque") {
    let custo = 0;

    let potencial = 0;

    planilhaAtual.linhas.forEach((linha) => {
      custo += numero(linha[4]);

      potencial += numero(linha[6]);
    });

    conteudo += criarCardResumo("Custo do estoque", dinheiro(custo));

    conteudo += criarCardResumo("Potencial de venda", dinheiro(potencial));

    conteudo += criarCardResumo("Lucro potencial", dinheiro(potencial - custo));
  }

  /* ================================================= */
  /* VENDAS */
  /* ================================================= */

  if (modelo.resumo === "vendas") {
    let vendas = 0;

    let comissoes = 0;

    planilhaAtual.linhas.forEach((linha) => {
      vendas += numero(linha[4]);

      comissoes += numero(linha[6]);
    });

    conteudo += criarCardResumo("Total vendido", dinheiro(vendas));

    conteudo += criarCardResumo("Comissões", dinheiro(comissoes));
  }

  /* ================================================= */
  /* NOTAS */
  /* ================================================= */

  if (modelo.resumo === "notas") {
    /*
            pega apenas alunos
            que já possuem média.
        */
    const medias = planilhaAtual.linhas
      .filter((linha) => temValor(linha[4]))
      .map((linha) => numero(linha[4]));

    /*
            conta aprovados.
        */
    const aprovados = planilhaAtual.linhas.filter(
      (linha) => linha[5] === "Aprovado",
    ).length;

    /*
            conta reprovados.
        */
    const reprovados = planilhaAtual.linhas.filter(
      (linha) => linha[5] === "Reprovado",
    ).length;

    /*
            média geral da turma.
        */
    const mediaTurma =
      medias.length > 0
        ? arredondar(
            medias.reduce(
              (soma, media) => soma + media,

              0,
            ) / medias.length,
          )
        : 0;

    conteudo += criarCardResumo("Média da turma", mediaTurma);

    conteudo += criarCardResumo("Aprovados", aprovados);

    conteudo += criarCardResumo("Reprovados", reprovados);
  }

  /* ================================================= */
  /* FREQUÊNCIA */
  /* ================================================= */

  if (modelo.resumo === "frequencia") {
    const frequencias = planilhaAtual.linhas
      .filter((linha) => temValor(linha[4]))
      .map((linha) => numero(linha[4]));

    const media =
      frequencias.length > 0
        ? arredondar(
            frequencias.reduce(
              (soma, valor) => soma + valor,

              0,
            ) / frequencias.length,
          )
        : 0;

    const atencao = planilhaAtual.linhas.filter(
      (linha) => linha[5] === "Atenção",
    ).length;

    conteudo += criarCardResumo("Frequência média", media + "%");

    conteudo += criarCardResumo("Em atenção", atencao);
  }

  /* ================================================= */
  /* PLANO DE ESTUDOS */
  /* ================================================= */

  if (modelo.resumo === "estudos") {
    let planejadas = 0;

    let estudadas = 0;

    planilhaAtual.linhas.forEach((linha) => {
      planejadas += numero(linha[3]);

      estudadas += numero(linha[4]);
    });

    const progresso =
      planejadas > 0 ? arredondar((estudadas / planejadas) * 100) : 0;

    conteudo += criarCardResumo("Horas planejadas", planejadas);

    conteudo += criarCardResumo("Horas estudadas", estudadas);

    conteudo += criarCardResumo("Progresso geral", progresso + "%");
  }

  /*
        coloca todos os cards
        dentro da área de resumo.
    */
  resumoModelo.innerHTML = conteudo;

  /*
        mostra a área.
    */
  resumoModelo.classList.remove("escondido");
}

/* ================================================= */
/* LINHAS */
/* ================================================= */

/*
    adiciona um novo registro.
*/
function adicionarLinha() {
  if (!planilhaAtual) {
    return;
  }

  /*
        cria uma linha com a mesma
        quantidade de campos da planilha.
    */
  const novaLinha = new Array(planilhaAtual.colunas.length).fill("");

  planilhaAtual.linhas.push(novaLinha);

  salvar();

  montarTabela();
}

/*
    remove uma linha.
*/
function excluirLinha(indice) {
  if (!planilhaAtual) {
    return;
  }

  planilhaAtual.linhas.splice(indice, 1);

  salvar();

  montarTabela();
}

/* ================================================= */
/* COLUNAS */
/* ================================================= */

/*
    abre o modal
    para criar uma coluna nova.
*/
function adicionarColuna() {
  if (!planilhaAtual) {
    return;
  }

  document.getElementById("novoCampo").value = "";

  modalCampo.showModal();
}

/*
    salva a nova coluna.
*/
function salvarNovaColuna(event) {
  event.preventDefault();

  if (!planilhaAtual) {
    return;
  }

  const nome = document.getElementById("novoCampo").value.trim();

  if (!nome) {
    return;
  }

  /*
        coloca a coluna no final.
    */
  planilhaAtual.colunas.push(nome);

  /*
        cada linha existente também precisa
        receber uma nova célula vazia.
    */
  planilhaAtual.linhas.forEach((linha) => {
    linha.push("");
  });

  salvar();

  modalCampo.close();

  montarTabela();
}

/*
    permite renomear uma coluna
    com dois cliques.
*/
function renomearColuna(indice) {
  if (!planilhaAtual) {
    return;
  }

  /*
        colunas calculadas não podem
        ser renomeadas.
    */
  if (ehColunaCalculada(indice)) {
    alert("Este campo faz parte de um cálculo automático.");

    return;
  }

  const atual = planilhaAtual.colunas[indice];

  const novo = prompt("Novo nome do campo:", atual);

  if (!novo) {
    return;
  }

  const nome = novo.trim();

  if (!nome) {
    return;
  }

  planilhaAtual.colunas[indice] = nome;

  salvar();

  montarTabela();
}

/* ================================================= */
/* NOME DA PLANILHA */
/* ================================================= */

function alterarNomePlanilha() {
  if (!planilhaAtual) {
    return;
  }

  const input = document.getElementById("nomePlanilhaEditor");

  planilhaAtual.nome = input.value.trim() || "Sem título";

  input.value = planilhaAtual.nome;

  salvar();
}

/* ================================================= */
/* EXCLUIR PLANILHA */
/* ================================================= */

function excluirPlanilha(event, id) {
  /*
        impede que clicar em Excluir
        também abra a planilha.
    */
  event.stopPropagation();

  const confirmar = confirm("Deseja excluir esta planilha?");

  if (!confirmar) {
    return;
  }

  /*
        cria uma nova lista
        sem a planilha excluída.
    */
  planilhas = planilhas.filter((planilha) => planilha.id !== id);

  salvar();

  carregarDashboard();
}

/* ================================================= */
/* PERSONALIZAÇÃO */
/* ================================================= */

/*
    coloca nos controles
    as cores salvas da planilha.
*/
function carregarPersonalizacao() {
  if (!planilhaAtual) {
    return;
  }

  const p = planilhaAtual.personalizacao;

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
    pega as escolhas feitas
    pelo usuário e salva.
*/
function alterarPersonalizacao() {
  if (!planilhaAtual) {
    return;
  }

  planilhaAtual.personalizacao = {
    corCabecalho: document.getElementById("corCabecalho").value,

    corTextoCabecalho: document.getElementById("corTextoCabecalho").value,

    corTexto: document.getElementById("corTexto").value,

    corCelulas: document.getElementById("corCelulas").value,

    corBorda: document.getElementById("corBorda").value,

    estilo: document.getElementById("estiloPlanilha").value,

    tamanhoFonte: document.getElementById("tamanhoFonte").value,

    alinhamento: document.getElementById("alinhamento").value,
  };

  salvar();

  aplicarPersonalizacao();
}

/*
    aplica as escolhas
    diretamente na tabela.
*/
function aplicarPersonalizacao() {
  if (!planilhaAtual) {
    return;
  }

  const p = planilhaAtual.personalizacao;

  const cabecalhos = cabecalhoTabela.querySelectorAll("th");

  const celulas = corpoTabela.querySelectorAll("td");

  const inputs = corpoTabela.querySelectorAll("input");

  /*
        cabeçalhos.
    */
  cabecalhos.forEach((th) => {
    th.style.backgroundColor = p.corCabecalho;

    th.style.color = p.corTextoCabecalho;

    th.style.fontSize = p.tamanhoFonte + "px";

    th.style.textAlign = p.alinhamento;

    th.style.borderColor = p.corBorda;
  });

  /*
        células.
    */
  celulas.forEach((td) => {
    td.style.backgroundColor = p.corCelulas;

    td.style.borderColor = p.corBorda;
  });

  /*
        campos.
    */
  inputs.forEach((input) => {
    input.style.color = p.corTexto;

    input.style.backgroundColor = p.corCelulas;

    input.style.fontSize = p.tamanhoFonte + "px";

    input.style.textAlign = p.alinhamento;
  });

  /*
        tira estilo anterior.
    */
  tabelaPlanilha.classList.remove("modo-grade", "modo-tabela");

  /*
        escolhe o novo.
    */
  if (p.estilo === "tabela") {
    tabelaPlanilha.classList.add("modo-tabela");
  } else {
    tabelaPlanilha.classList.add("modo-grade");
  }
}

/*
    volta para as cores padrão.
*/
function restaurarPersonalizacao() {
  if (!planilhaAtual) {
    return;
  }

  const confirmar = confirm("Deseja restaurar o visual padrão?");

  if (!confirmar) {
    return;
  }

  planilhaAtual.personalizacao = personalizacaoPadrao();

  salvar();

  carregarPersonalizacao();

  aplicarPersonalizacao();
}

/* ================================================= */
/* EXPORTAÇÃO */
/* ================================================= */

/*
    escolhe o método de exportação.
*/
function exportarPlanilha() {
  if (!planilhaAtual) {
    return;
  }

  /*
        verifica se a biblioteca
        foi carregada.
    */
  if (typeof XLSX === "undefined") {
    alert("A biblioteca de exportação não foi carregada.");

    return;
  }

  /*
        recalcula antes de exportar.
    */
  atualizarTodosCalculos();

  salvar();

  if (planilhaAtual.tipo === "excel") {
    exportarExcel();

    return;
  }

  if (planilhaAtual.tipo === "google") {
    exportarGoogleSheets();
  }
}

/*
    junta cabeçalho e registros
    em uma única matriz.
*/
function obterDadosPlanilha() {
  return [planilhaAtual.colunas, ...planilhaAtual.linhas];
}

/*
    remove caracteres proibidos
    de nomes de arquivos.
*/
function limparNomeArquivo(nome) {
  return nome.replace(/[<>:"/\\|?*]/g, "").trim() || "planilha";
}

/*
    transforma:

    #1597e5

    em:

    1597E5

    porque o Excel usa a cor
    dessa forma.
*/
function corExcel(cor) {
  if (!cor) {
    return "000000";
  }

  return cor.replace("#", "").toUpperCase();
}

/*
    cria as quatro bordas
    usadas nas células do Excel.
*/
function criarBorda(cor) {
  return {
    top: {
      style: "thin",

      color: {
        rgb: cor,
      },
    },

    bottom: {
      style: "thin",

      color: {
        rgb: cor,
      },
    },

    left: {
      style: "thin",

      color: {
        rgb: cor,
      },
    },

    right: {
      style: "thin",

      color: {
        rgb: cor,
      },
    },
  };
}

/* ================================================= */
/* FÓRMULAS DENTRO DO EXCEL */
/* ================================================= */

/*
    além de calcular dentro do site,
    também colocamos fórmulas reais no Excel.

    isso significa que depois de baixar,
    se o usuário alterar os valores no Excel,
    os resultados continuam calculando.
*/
function formulaExcelModelo(modelo, linhaExcel, coluna) {
  /* NOTAS */

  if (modelo === "notas") {
    /*
            média.
        */
    if (coluna === 4) {
      return `IF(COUNTA(B${linhaExcel}:D${linhaExcel})=3,AVERAGE(B${linhaExcel}:D${linhaExcel}),"")`;
    }

    /*
            situação.
        */
    if (coluna === 5) {
      return `IF(E${linhaExcel}="","",IF(E${linhaExcel}>=6,"Aprovado","Reprovado"))`;
    }
  }

  /* FREQUÊNCIA */

  if (modelo === "frequencia") {
    if (coluna === 3) {
      return `IF(OR(B${linhaExcel}="",C${linhaExcel}=""),"",MAX(B${linhaExcel}-C${linhaExcel},0))`;
    }

    if (coluna === 4) {
      return `IF(B${linhaExcel}>0,D${linhaExcel}/B${linhaExcel}*100,"")`;
    }

    if (coluna === 5) {
      return `IF(E${linhaExcel}="","",IF(E${linhaExcel}>=75,"Regular","Atenção"))`;
    }
  }

  /* ORÇAMENTO */

  if (modelo === "orcamento" && coluna === 3) {
    return `IF(OR(B${linhaExcel}="",C${linhaExcel}=""),"",B${linhaExcel}*C${linhaExcel})`;
  }

  /* ESTOQUE */

  if (modelo === "estoque") {
    /*
            quantidade × custo.
        */
    if (coluna === 4) {
      return `IF(OR(B${linhaExcel}="",C${linhaExcel}=""),"",B${linhaExcel}*C${linhaExcel})`;
    }

    /*
            venda - custo.
        */
    if (coluna === 5) {
      return `IF(OR(C${linhaExcel}="",D${linhaExcel}=""),"",D${linhaExcel}-C${linhaExcel})`;
    }

    /*
            quantidade × preço.
        */
    if (coluna === 6) {
      return `IF(OR(B${linhaExcel}="",D${linhaExcel}=""),"",B${linhaExcel}*D${linhaExcel})`;
    }
  }

  /* VENDAS */

  if (modelo === "vendas") {
    /*
            total.
        */
    if (coluna === 4) {
      return `IF(OR(C${linhaExcel}="",D${linhaExcel}=""),"",C${linhaExcel}*D${linhaExcel})`;
    }

    /*
            comissão.
        */
    if (coluna === 6) {
      return `IF(OR(E${linhaExcel}="",F${linhaExcel}=""),"",E${linhaExcel}*(F${linhaExcel}/100))`;
    }
  }

  /* ESTUDOS */

  if (modelo === "estudos" && coluna === 5) {
    return `IF(D${linhaExcel}>0,E${linhaExcel}/D${linhaExcel}*100,"")`;
  }

  /*
        se não existir fórmula
        para aquela célula.
    */
  return null;
}

/* ================================================= */
/* CRIAR ARQUIVO EXCEL */
/* ================================================= */

function criarWorksheet() {
  /*
        atualiza tudo primeiro.
    */
  atualizarTodosCalculos();

  const dados = obterDadosPlanilha();

  /*
        transforma nossos dados
        em uma planilha Excel.
    */
  const worksheet = XLSX.utils.aoa_to_sheet(dados);

  const p = planilhaAtual.personalizacao || personalizacaoPadrao();

  /*
        prepara as cores.
    */
  const corCabecalho = corExcel(p.corCabecalho);

  const corTextoCabecalho = corExcel(p.corTextoCabecalho);

  const corTexto = corExcel(p.corTexto);

  const corCelulas = corExcel(p.corCelulas);

  const corBorda = corExcel(p.corBorda);

  /*
        número de linhas.

        +1 representa o cabeçalho.
    */
  const quantidadeLinhas = planilhaAtual.linhas.length + 1;

  const quantidadeColunas = planilhaAtual.colunas.length;

  /*
        percorre todas as células.
    */
  for (let linha = 0; linha < quantidadeLinhas; linha++) {
    for (let coluna = 0; coluna < quantidadeColunas; coluna++) {
      /*
                cria endereço:

                A1
                B1
                C2...
            */
      const endereco = XLSX.utils.encode_cell({
        r: linha,

        c: coluna,
      });

      let celula = worksheet[endereco];

      /*
                células vazias podem não existir.

                então criamos para aplicar estilo.
            */
      if (!celula) {
        celula = {
          v: "",

          t: "s",
        };

        worksheet[endereco] = celula;
      }

      /*
                linhas depois do cabeçalho
                podem receber fórmulas.
            */
      if (linha > 0) {
        const formula = formulaExcelModelo(
          planilhaAtual.modelo,

          linha + 1,

          coluna,
        );

        if (formula) {
          celula.f = formula;
        }
      }

      /*
                CABEÇALHO
            */
      if (linha === 0) {
        celula.s = {
          fill: {
            patternType: "solid",

            fgColor: {
              rgb: corCabecalho,
            },
          },

          font: {
            name: "Arial",

            bold: true,

            sz: Number(p.tamanhoFonte),

            color: {
              rgb: corTextoCabecalho,
            },
          },

          alignment: {
            horizontal: p.alinhamento,

            vertical: "center",

            wrapText: true,
          },

          border: criarBorda(corBorda),
        };
      } else {
        /*
                    CÉLULAS NORMAIS
                */
        celula.s = {
          fill: {
            patternType: "solid",

            fgColor: {
              rgb: corCelulas,
            },
          },

          font: {
            name: "Arial",

            sz: Number(p.tamanhoFonte),

            color: {
              rgb: corTexto,
            },
          },

          alignment: {
            horizontal: p.alinhamento,

            vertical: "center",

            wrapText: true,
          },

          border: criarBorda(corBorda),
        };
      }
    }
  }

  /*
        ajusta automaticamente
        a largura das colunas.
    */
  worksheet["!cols"] = planilhaAtual.colunas.map((coluna, indice) => {
    let maior = String(coluna).length;

    planilhaAtual.linhas.forEach((linha) => {
      const valor = String(linha[indice] ?? "");

      if (valor.length > maior) {
        maior = valor.length;
      }
    });

    return {
      wch: Math.min(maior + 4, 50),
    };
  });

  /*
        ajusta altura das linhas.
    */
  worksheet["!rows"] = new Array(quantidadeLinhas)
    .fill(null)
    .map((valor, indice) => {
      if (indice === 0) {
        return {
          hpt: 28,
        };
      }

      return {
        hpt: 22,
      };
    });

  return worksheet;
}

/* ================================================= */
/* DOWNLOAD */
/* ================================================= */

function baixarArquivoExcel() {
  const worksheet = criarWorksheet();

  /*
        cria uma pasta de trabalho.
    */
  const workbook = XLSX.utils.book_new();

  /*
        adiciona nossa planilha
        dentro do arquivo.
    */
  XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");

  const nomeArquivo = limparNomeArquivo(planilhaAtual.nome) + ".xlsx";

  /*
        cria o arquivo e baixa.
    */
  XLSX.writeFile(workbook, nomeArquivo, {
    bookType: "xlsx",

    type: "binary",

    cellStyles: true,

    compression: true,
  });
}

/*
    Excel apenas baixa.
*/
function exportarExcel() {
  baixarArquivoExcel();
}

/*
    Google Sheets ainda não possui
    integração direta com a conta do usuário.

    então baixamos o .xlsx
    e depois abrimos o Google Sheets.
*/
function exportarGoogleSheets() {
  baixarArquivoExcel();

  setTimeout(
    () => {
      const abrir = confirm(
        "A planilha foi baixada em .xlsx com os cálculos.\n\n" +
          "Agora importe esse arquivo no Google Sheets.\n\n" +
          "Use:\n\n" +
          "Arquivo → Importar → Upload\n\n" +
          "Deseja abrir o Google Sheets?",
      );

      if (abrir) {
        window.open("https://sheets.google.com/", "_blank");
      }
    },

    500,
  );
}

/* ================================================= */
/* NOMES DOS FORMATOS */
/* ================================================= */

/*
    transforma nomes internos
    em nomes bonitos.
*/
function nomeTipo(tipo) {
  if (tipo === "excel") {
    return "Microsoft Excel";
  }

  if (tipo === "google") {
    return "Google Sheets";
  }

  return "Planilha";
}

/* ================================================= */
/* INICIAR O SISTEMA */
/* ================================================= */

/*
    assim que o site abre,
    mostramos as planilhas salvas.
*/
carregarDashboard();

/*
    verifica se a URL possui:

    ?nova=1

    isso acontece quando o usuário
    clica em "Nova planilha"
    na página Sobre.
*/
const parametros = new URLSearchParams(window.location.search);

if (parametros.get("nova") === "1") {
  abrirCriacao();
}
