// pega as planilhas que ja estavam salvas
let planilhas = JSON.parse(localStorage.getItem("planilhas")) || [];

// guarda qual planilha esta aberta
let planilhaAtual = null;

// pega partes do html
const dashboard = document.getElementById("dashboard");

const editor = document.getElementById("editor");

const modalCriacao = document.getElementById("modalCriacao");

const modalCampo = document.getElementById("modalCampo");

const listaPlanilhas = document.getElementById("listaPlanilhas");

const cabecalhoTabela = document.getElementById("cabecalhoTabela");

const corpoTabela = document.getElementById("corpoTabela");

const tabelaPlanilha = document.getElementById("tabelaPlanilha");

// cria o visual normal da planilha
function personalizacaoPadrao() {
  return {
    corCabecalho: "#111111",

    corTextoCabecalho: "#ffffff",

    corTexto: "#191919",

    corCelulas: "#ffffff",

    corBorda: "#dddddd",

    estilo: "grade",

    tamanhoFonte: "14",

    alinhamento: "left",
  };
}

// deixa apenas excel e google sheets
planilhas = planilhas.filter((planilha) => {
  return planilha.tipo === "excel" || planilha.tipo === "google";
});

// coloca personalizacao nas planilhas antigas
planilhas.forEach((planilha) => {
  if (!planilha.personalizacao) {
    planilha.personalizacao = personalizacaoPadrao();
  }
});

// salva tudo
salvar();

// salva as planilhas no navegador
function salvar() {
  localStorage.setItem("planilhas", JSON.stringify(planilhas));
}

// mostra a tela inicial
function mostrarDashboard() {
  dashboard.classList.remove("escondido");

  editor.classList.add("escondido");

  planilhaAtual = null;

  carregarDashboard();
}

// atualiza o dashboard
function carregarDashboard() {
  listaPlanilhas.innerHTML = "";

  let registros = 0;

  let campos = 0;

  // conta linhas e colunas
  planilhas.forEach((planilha) => {
    registros += planilha.linhas.length;

    campos += planilha.colunas.length;
  });

  document.getElementById("totalPlanilhas").textContent = planilhas.length;

  document.getElementById("totalRegistros").textContent = registros;

  document.getElementById("totalCampos").textContent = campos;

  // se nao tiver planilha
  if (planilhas.length === 0) {
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

    return;
  }

  // cria os cards
  planilhas.forEach((planilha) => {
    const card = document.createElement("article");

    card.className = "card-planilha";

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

    // abre a planilha
    card.addEventListener("click", () => {
      abrirPlanilha(planilha.id);
    });

    listaPlanilhas.appendChild(card);
  });
}

// abre a criacao
function abrirCriacao() {
  document.getElementById("nomePlanilha").value = "";

  document.getElementById("camposCriacao").innerHTML = "";

  adicionarCampoCriacao("Nome");

  modalCriacao.showModal();
}

// fecha a criacao
function fecharCriacao() {
  modalCriacao.close();
}

// adiciona um campo
function adicionarCampoCriacao(valor = "") {
  const container = document.getElementById("camposCriacao");

  const campo = document.createElement("div");

  campo.className = "campo-criacao";

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

// cria uma planilha
function criarPlanilha(event) {
  event.preventDefault();

  const nome = document.getElementById("nomePlanilha").value.trim();

  const tipo = document.getElementById("tipoExportacao").value;

  const campos = document.querySelectorAll(".campoNovo");

  const colunas = [];

  campos.forEach((campo) => {
    const valor = campo.value.trim();

    if (valor) {
      colunas.push(valor);
    }
  });

  if (colunas.length === 0) {
    alert("Adicione pelo menos um campo.");

    return;
  }

  // cria o objeto da planilha
  const novaPlanilha = {
    id: Date.now().toString(),

    nome: nome || "Sem título",

    tipo: tipo,

    colunas: colunas,

    linhas: [],

    criadaEm: new Date().toISOString(),

    personalizacao: personalizacaoPadrao(),
  };

  planilhas.push(novaPlanilha);

  salvar();

  modalCriacao.close();

  abrirPlanilha(novaPlanilha.id);
}

// abre uma planilha
function abrirPlanilha(id) {
  planilhaAtual = planilhas.find((planilha) => planilha.id === id);

  if (!planilhaAtual) {
    return;
  }

  if (!planilhaAtual.personalizacao) {
    planilhaAtual.personalizacao = personalizacaoPadrao();

    salvar();
  }

  dashboard.classList.add("escondido");

  editor.classList.remove("escondido");

  document.getElementById("nomePlanilhaEditor").value = planilhaAtual.nome;

  document.getElementById("tipoPlanilha").textContent =
    "Formato: " + nomeTipo(planilhaAtual.tipo);

  carregarPersonalizacao();

  montarTabela();
}

// monta a tabela
function montarTabela() {
  if (!planilhaAtual) {
    return;
  }

  cabecalhoTabela.innerHTML = "";

  corpoTabela.innerHTML = "";

  // cria os titulos
  planilhaAtual.colunas.forEach((coluna, indice) => {
    const th = document.createElement("th");

    th.textContent = coluna;

    th.title = "Clique duas vezes para renomear";

    th.ondblclick = () => {
      renomearColuna(indice);
    };

    cabecalhoTabela.appendChild(th);
  });

  // cria titulo acoes
  const thAcoes = document.createElement("th");

  thAcoes.textContent = "Ações";

  thAcoes.className = "coluna-acoes";

  cabecalhoTabela.appendChild(thAcoes);

  // cria as linhas
  planilhaAtual.linhas.forEach((linha, indiceLinha) => {
    const tr = document.createElement("tr");

    // cria as celulas
    planilhaAtual.colunas.forEach((coluna, indiceColuna) => {
      const td = document.createElement("td");

      const input = document.createElement("input");

      input.value = linha[indiceColuna] ?? "";

      input.placeholder = "Digite " + coluna.toLowerCase();

      // salva sempre que escrever
      input.addEventListener("input", (event) => {
        planilhaAtual.linhas[indiceLinha][indiceColuna] = event.target.value;

        salvar();
      });

      td.appendChild(input);

      tr.appendChild(td);
    });

    // botao excluir
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

  aplicarPersonalizacao();
}

// adiciona uma linha
function adicionarLinha() {
  if (!planilhaAtual) {
    return;
  }

  const novaLinha = new Array(planilhaAtual.colunas.length).fill("");

  planilhaAtual.linhas.push(novaLinha);

  salvar();

  montarTabela();
}

// exclui uma linha
function excluirLinha(indice) {
  if (!planilhaAtual) {
    return;
  }

  planilhaAtual.linhas.splice(indice, 1);

  salvar();

  montarTabela();
}

// abre a janela de novo campo
function adicionarColuna() {
  if (!planilhaAtual) {
    return;
  }

  document.getElementById("novoCampo").value = "";

  modalCampo.showModal();
}

// salva uma nova coluna
function salvarNovaColuna(event) {
  event.preventDefault();

  if (!planilhaAtual) {
    return;
  }

  const nome = document.getElementById("novoCampo").value.trim();

  if (!nome) {
    return;
  }

  planilhaAtual.colunas.push(nome);

  planilhaAtual.linhas.forEach((linha) => {
    linha.push("");
  });

  salvar();

  modalCampo.close();

  montarTabela();
}

// renomeia coluna
function renomearColuna(indice) {
  if (!planilhaAtual) {
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

// muda o nome da planilha
function alterarNomePlanilha() {
  if (!planilhaAtual) {
    return;
  }

  const input = document.getElementById("nomePlanilhaEditor");

  planilhaAtual.nome = input.value.trim() || "Sem título";

  input.value = planilhaAtual.nome;

  salvar();
}

// exclui uma planilha
function excluirPlanilha(event, id) {
  event.stopPropagation();

  const confirmar = confirm("Deseja excluir esta planilha?");

  if (!confirmar) {
    return;
  }

  planilhas = planilhas.filter((planilha) => planilha.id !== id);

  salvar();

  carregarDashboard();
}

// coloca as configuracoes salvas na tela
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

// salva a personalizacao escolhida
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

// aplica o visual dentro do site
function aplicarPersonalizacao() {
  if (!planilhaAtual) {
    return;
  }

  const p = planilhaAtual.personalizacao;

  // pega os titulos
  const cabecalhos = cabecalhoTabela.querySelectorAll("th");

  // pega as celulas
  const celulas = corpoTabela.querySelectorAll("td");

  // pega os inputs
  const inputs = corpoTabela.querySelectorAll("input");

  // muda os titulos
  cabecalhos.forEach((th) => {
    th.style.backgroundColor = p.corCabecalho;

    th.style.color = p.corTextoCabecalho;

    th.style.fontSize = p.tamanhoFonte + "px";

    th.style.textAlign = p.alinhamento;

    th.style.borderColor = p.corBorda;
  });

  // muda as celulas
  celulas.forEach((td) => {
    td.style.backgroundColor = p.corCelulas;

    td.style.borderColor = p.corBorda;
  });

  // muda os textos
  inputs.forEach((input) => {
    input.style.color = p.corTexto;

    input.style.backgroundColor = p.corCelulas;

    input.style.fontSize = p.tamanhoFonte + "px";

    input.style.textAlign = p.alinhamento;
  });

  // limpa o estilo anterior
  tabelaPlanilha.classList.remove("modo-grade", "modo-tabela");

  // escolhe o novo estilo
  if (p.estilo === "tabela") {
    tabelaPlanilha.classList.add("modo-tabela");
  } else {
    tabelaPlanilha.classList.add("modo-grade");
  }
}

// restaura o visual normal
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

// escolhe o tipo de exportacao
function exportarPlanilha() {
  if (!planilhaAtual) {
    return;
  }

  // verifica se a biblioteca carregou
  if (typeof XLSX === "undefined") {
    alert("A biblioteca de exportação não foi carregada.");

    return;
  }

  if (planilhaAtual.tipo === "excel") {
    exportarExcel();

    return;
  }

  if (planilhaAtual.tipo === "google") {
    exportarGoogleSheets();
  }
}

// junta os dados
function obterDadosPlanilha() {
  return [
    // primeira linha sao os titulos
    planilhaAtual.colunas,

    // depois ficam os registros
    ...planilhaAtual.linhas,
  ];
}

// limpa o nome do arquivo
function limparNomeArquivo(nome) {
  return nome.replace(/[<>:"/\\|?*]/g, "").trim() || "planilha";
}

// transforma uma cor para o jeito que o excel entende
function corExcel(cor) {
  // se nao tiver cor usa preto
  if (!cor) {
    return "000000";
  }

  // tira o #
  return cor.replace("#", "").toUpperCase();
}

// cria uma borda para o excel
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

// cria a planilha que sera exportada
function criarWorksheet() {
  // pega os dados
  const dados = obterDadosPlanilha();

  // cria a planilha
  const worksheet = XLSX.utils.aoa_to_sheet(dados);

  // pega as configuracoes escolhidas
  const p = planilhaAtual.personalizacao || personalizacaoPadrao();

  // prepara as cores
  const corCabecalho = corExcel(p.corCabecalho);

  const corTextoCabecalho = corExcel(p.corTextoCabecalho);

  const corTexto = corExcel(p.corTexto);

  const corCelulas = corExcel(p.corCelulas);

  const corBorda = corExcel(p.corBorda);

  // quantidade de linhas
  // soma 1 porque existe o cabecalho
  const quantidadeLinhas = planilhaAtual.linhas.length + 1;

  // quantidade de colunas
  const quantidadeColunas = planilhaAtual.colunas.length;

  // passa por todas as linhas
  for (let linha = 0; linha < quantidadeLinhas; linha++) {
    // passa por todas as colunas
    for (let coluna = 0; coluna < quantidadeColunas; coluna++) {
      // descobre o endereco da celula
      // exemplo A1 ou B2
      const endereco = XLSX.utils.encode_cell({
        r: linha,

        c: coluna,
      });

      // pega a celula
      let celula = worksheet[endereco];

      // se ela nao existir
      // cria mesmo assim
      // isso faz ate celulas vazias terem cor
      if (!celula) {
        celula = {
          v: "",

          t: "s",
        };

        worksheet[endereco] = celula;
      }

      // primeira linha = cabecalho
      if (linha === 0) {
        celula.s = {
          // cor de fundo do cabecalho
          fill: {
            patternType: "solid",

            fgColor: {
              rgb: corCabecalho,
            },
          },

          // letra do cabecalho
          font: {
            name: "Arial",

            bold: true,

            sz: Number(p.tamanhoFonte),

            color: {
              rgb: corTextoCabecalho,
            },
          },

          // alinhamento
          alignment: {
            horizontal: p.alinhamento,

            vertical: "center",

            wrapText: true,
          },

          // bordas
          border: criarBorda(corBorda),
        };
      } else {
        // resto das celulas
        celula.s = {
          // fundo
          fill: {
            patternType: "solid",

            fgColor: {
              rgb: corCelulas,
            },
          },

          // texto
          font: {
            name: "Arial",

            sz: Number(p.tamanhoFonte),

            color: {
              rgb: corTexto,
            },
          },

          // alinhamento
          alignment: {
            horizontal: p.alinhamento,

            vertical: "center",

            wrapText: true,
          },

          // bordas
          border: criarBorda(corBorda),
        };
      }
    }
  }

  // ajusta o tamanho das colunas
  worksheet["!cols"] = planilhaAtual.colunas.map((coluna, indice) => {
    // comeca com o tamanho do titulo
    let maior = String(coluna).length;

    // procura o maior texto da coluna
    planilhaAtual.linhas.forEach((linha) => {
      const valor = String(linha[indice] ?? "");

      if (valor.length > maior) {
        maior = valor.length;
      }
    });

    // devolve o tamanho da coluna
    return {
      wch: Math.min(maior + 4, 50),
    };
  });

  // cria uma altura para cada linha
  worksheet["!rows"] = new Array(quantidadeLinhas)
    .fill(null)
    .map((valor, indice) => {
      // cabecalho fica maior
      if (indice === 0) {
        return {
          hpt: 28,
        };
      }

      return {
        hpt: 22,
      };
    });

  // devolve a planilha pronta
  return worksheet;
}

// cria e baixa o arquivo
function baixarArquivoExcel() {
  // cria a worksheet com as cores
  const worksheet = criarWorksheet();

  // cria o arquivo excel
  const workbook = XLSX.utils.book_new();

  // coloca a planilha dentro dele
  XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");

  // cria o nome do arquivo
  const nomeArquivo = limparNomeArquivo(planilhaAtual.nome) + ".xlsx";

  // gera o arquivo como xlsx
  XLSX.writeFile(workbook, nomeArquivo, {
    bookType: "xlsx",

    type: "binary",

    cellStyles: true,

    compression: true,
  });
}

// exporta para excel
function exportarExcel() {
  baixarArquivoExcel();
}

// exporta para google sheets
function exportarGoogleSheets() {
  // primeiro baixa o arquivo
  baixarArquivoExcel();

  // depois pergunta se quer abrir o google sheets
  setTimeout(() => {
    const abrir = confirm(
      "A planilha foi baixada em .xlsx com a personalização.\n\n" +
        "Agora importe esse arquivo no Google Sheets.\n\n" +
        "Use:\n\n" +
        "Arquivo → Importar → Upload\n\n" +
        "Deseja abrir o Google Sheets?",
    );

    if (abrir) {
      window.open("https://sheets.google.com/", "_blank");
    }
  }, 500);
}

// mostra o nome bonito do formato
function nomeTipo(tipo) {
  if (tipo === "excel") {
    return "Microsoft Excel";
  }

  if (tipo === "google") {
    return "Google Sheets";
  }

  return "Planilha";
}

// quando abrir o site
// mostra o dashboard
carregarDashboard();
