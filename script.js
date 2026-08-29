/* ================================================= */
/* AEROGRID - JAVASCRIPT PRINCIPAL */
/* ================================================= */

/*
    esta versão resolve dois pontos importantes:

    1. configurações gerais do site:
       - tema claro/escuro
       - tamanho da fonte
       - idioma português/inglês

    2. cálculos das planilhas:
       antes os cálculos dependiam da POSIÇÃO da coluna.
       agora cada campo possui uma FUNÇÃO.

       exemplo:
       Nota 4 pode ficar em qualquer posição.
       se a função dela for "nota", ela entra na média.
*/

/* ================================================= */
/* TRADUÇÕES */
/* ================================================= */

const traducoes = {
  "pt-BR": {
    "nav.dashboard": "Dashboard",
    "nav.new": "Nova planilha",
    "nav.settings": "Configurações",
    "nav.about": "Sobre",
    "status.ready": "Sistema pronto",

    "dashboard.welcome": "Bem-vindo ao seu workspace",
    "dashboard.title": "Minhas planilhas",
    "dashboard.subtitle": "Crie do zero ou comece usando um modelo pronto.",
    "dashboard.create": "＋ Criar planilha",
    "dashboard.recent": "Planilhas recentes",
    "dashboard.recentText": "Continue trabalhando nos seus arquivos.",
    "dashboard.emptyTitle": "Nenhuma planilha ainda",
    "dashboard.emptyText": "Crie uma do zero ou use um modelo pronto.",

    "banner.title": "Planilhas inteligentes, sem complicação.",
    "banner.text":
      "Use modelos com cálculos automáticos ou crie sua própria estrutura.",

    "stats.sheets": "Planilhas",
    "stats.records": "Registros",
    "stats.fields": "Campos",

    "common.back": "← Voltar",
    "common.cancel": "Cancelar",
    "common.ok": "OK",
    "common.confirm": "Confirmar",
    "common.delete": "Excluir",
    "notification.notice": "Aviso",
    "notification.confirmTitle": "Confirmar ação",
    "notification.inputTitle": "Editar informação",
    "common.confirmDeleteSheet": "Deseja excluir esta planilha?",
    "common.confirmDeleteRow": "Deseja excluir este registro?",

    "editor.editing": "Editando planilha",
    "editor.model": "Modelo",
    "editor.format": "Formato",
    "editor.field": "＋ Campo",
    "editor.record": "＋ Registro",
    "editor.export": "↓ Exportar",
    "editor.actions": "Ações",
    "editor.autoField": "Calculado automaticamente pelo AeroGrid.",
    "editor.rename": "Clique duas vezes para renomear.",
    "editor.newName": "Novo nome do campo:",

    "personalization.title": "Personalização",
    "personalization.text": "Escolha como sua planilha deve aparecer.",
    "personalization.restore": "↻ Restaurar",
    "personalization.restoreConfirm": "Deseja restaurar o visual padrão?",
    "personalization.header": "Cabeçalho",
    "personalization.headerText": "Texto do cabeçalho",
    "personalization.textColor": "Informações",
    "personalization.cells": "Fundo das células",
    "personalization.borders": "Bordas",
    "personalization.view": "Visualização",
    "personalization.grid": "Grade",
    "personalization.table": "Tabela",
    "personalization.fontSize": "Tamanho da fonte",
    "personalization.align": "Alinhamento",

    "font.small": "Pequena",
    "font.normal": "Normal",
    "font.large": "Grande",
    "font.xlarge": "Muito grande",
    "align.left": "Esquerda",
    "align.center": "Centralizado",
    "align.right": "Direita",

    "settings.eyebrow": "Preferências do sistema",
    "settings.title": "Configurações",
    "settings.subtitle": "Ajuste a aparência e o idioma do AeroGrid.",
    "settings.theme": "Tema do site",
    "settings.themeText": "Alterne entre o tema claro e o tema escuro.",
    "settings.light": "Claro",
    "settings.dark": "Escuro",
    "settings.font": "Tamanho do texto",
    "settings.fontText": "Aumente ou diminua os textos de todo o sistema.",
    "settings.language": "Idioma",
    "settings.languageText": "Escolha o idioma usado pela interface.",
    "settings.restoreTitle": "Restaurar configurações",
    "settings.restoreText": "Volta para tema claro, fonte normal e português.",
    "settings.restore": "Restaurar padrão",
    "settings.restoreConfirm": "Deseja restaurar as configurações do AeroGrid?",

    "create.title": "Nova planilha",
    "create.subtitle": "Crie do zero ou escolha um modelo pronto.",
    "create.name": "Nome da planilha",
    "create.namePlaceholder": "Ex: Controle da loja",
    "create.format": "Formato de exportação",
    "create.start": "Como deseja começar?",
    "create.modelsText":
      "Modelos inteligentes já possuem campos e cálculos configurados.",
    "create.blank": "Planilha em branco",
    "create.blankText": "Escolha seus próprios campos.",
    "create.fields": "Campos da planilha",
    "create.fieldsText": "Exemplo: Nome, Idade, Telefone, Cidade...",
    "create.addField": "＋ Adicionar campo",
    "create.submit": "Criar planilha",
    "create.modelSelected": "selecionado",
    "create.modelFields": "Campos",
    "create.autoCalc": "∑ Este modelo possui cálculos automáticos.",
    "create.needField": "Adicione pelo menos um campo.",

    "filter.all": "Todos",
    "filter.business": "Negócios",
    "filter.education": "Educação",

    "field.title": "Novo campo",
    "field.subtitle": "Configure como este campo deve funcionar.",
    "field.name": "Nome do campo",
    "field.namePlaceholder": "Ex: Nota 4",
    "field.type": "Tipo do campo",
    "field.info": "Informação",
    "field.calculation": "Cálculo automático",
    "field.function": "Função do campo",
    "field.position": "Posição",
    "field.add": "Adicionar",
    "field.tipTitle": "Como funciona?",
    "field.tipText":
      "Campos de informação guardam dados. Campos de cálculo são preenchidos automaticamente. A função informa ao AeroGrid como aquele campo participa dos cálculos.",
    "field.general": "Informação comum",
    "field.sum": "Somar campos numéricos da linha",
    "field.average": "Média dos campos numéricos da linha",
    "field.product": "Multiplicar campos numéricos da linha",
    "field.positionStart": "No início",
    "field.positionEnd": "No final",
    "field.positionBetween": "Entre",
    "field.repeatedRole": "Já existe um campo usando essa função neste modelo.",

    "role.student": "Aluno",
    "role.grade": "Nota (participa da média)",
    "role.item": "Item",
    "role.quantity": "Quantidade",
    "role.unitPrice": "Valor unitário",
    "role.product": "Produto",
    "role.unitCost": "Custo unitário",
    "role.salePrice": "Preço de venda",
    "role.seller": "Vendedor",
    "role.commissionPercent": "Comissão %",
    "role.totalClasses": "Total de aulas",
    "role.absences": "Faltas",
    "role.subject": "Disciplina",
    "role.content": "Conteúdo",
    "role.date": "Data",
    "role.plannedHours": "Horas planejadas",
    "role.studiedHours": "Horas estudadas",
    "role.description": "Descrição",
    "role.category": "Categoria",
    "role.movementType": "Tipo de movimentação",
    "role.value": "Valor",

    "calc.gradeAverage": "Média das notas",
    "calc.gradeStatus": "Situação do aluno",
    "calc.budgetTotal": "Total do orçamento",
    "calc.stockValue": "Valor em estoque",
    "calc.unitProfit": "Lucro unitário",
    "calc.salePotential": "Potencial de venda",
    "calc.saleTotal": "Total da venda",
    "calc.commission": "Comissão",
    "calc.presences": "Presenças",
    "calc.attendancePercent": "Frequência %",
    "calc.attendanceStatus": "Situação da frequência",
    "calc.studyProgress": "Progresso %",

    "summary.income": "Entradas",
    "summary.expenses": "Saídas",
    "summary.balance": "Saldo",
    "summary.totalValue": "Valor total",
    "summary.items": "Itens",
    "summary.stockCost": "Custo do estoque",
    "summary.salePotential": "Potencial de venda",
    "summary.profitPotential": "Lucro potencial",
    "summary.sold": "Total vendido",
    "summary.commissions": "Comissões",
    "summary.classAverage": "Média da turma",
    "summary.approved": "Aprovados",
    "summary.failed": "Reprovados",
    "summary.attendanceAverage": "Frequência média",
    "summary.attention": "Em atenção",
    "summary.plannedHours": "Horas planejadas",
    "summary.studiedHours": "Horas estudadas",
    "summary.progress": "Progresso geral",

    "status.approved": "Aprovado",
    "status.failed": "Reprovado",
    "status.regular": "Regular",
    "status.attention": "Atenção",

    "model.financial.name": "Controle Financeiro",
    "model.financial.desc":
      "Registre entradas e saídas e acompanhe o saldo automaticamente.",
    "model.budget.name": "Orçamento",
    "model.budget.desc": "Calcule automaticamente o total de cada item.",
    "model.stock.name": "Controle de Estoque",
    "model.stock.desc": "Controle custos, estoque, lucro e potencial de venda.",
    "model.sales.name": "Vendas e Comissão",
    "model.sales.desc": "Calcule o total vendido e a comissão de cada venda.",
    "model.grades.name": "Notas Escolares",
    "model.grades.desc":
      "Adicione quantas notas precisar e mantenha a média automática.",
    "model.attendance.name": "Frequência Escolar",
    "model.attendance.desc": "Calcule presenças e porcentagem de frequência.",
    "model.study.name": "Plano de Estudos",
    "model.study.desc": "Organize matérias e acompanhe seu progresso.",

    "column.description": "Descrição",
    "column.category": "Categoria",
    "column.type": "Tipo",
    "column.value": "Valor",
    "column.item": "Item",
    "column.quantity": "Quantidade",
    "column.unitPrice": "Valor unitário",
    "column.total": "Total",
    "column.product": "Produto",
    "column.unitCost": "Custo unitário",
    "column.salePrice": "Preço de venda",
    "column.stockValue": "Valor em estoque",
    "column.unitProfit": "Lucro unitário",
    "column.salePotential": "Potencial de venda",
    "column.seller": "Vendedor",
    "column.saleTotal": "Total da venda",
    "column.commissionPercent": "Comissão %",
    "column.commission": "Comissão",
    "column.student": "Aluno",
    "column.grade1": "Nota 1",
    "column.grade2": "Nota 2",
    "column.grade3": "Nota 3",
    "column.average": "Média",
    "column.status": "Situação",
    "column.totalClasses": "Total de aulas",
    "column.absences": "Faltas",
    "column.presences": "Presenças",
    "column.attendance": "Frequência %",
    "column.subject": "Disciplina",
    "column.content": "Conteúdo",
    "column.date": "Data",
    "column.plannedHours": "Horas planejadas",
    "column.studiedHours": "Horas estudadas",
    "column.progress": "Progresso %",

    "export.libraryError": "A biblioteca de exportação não foi carregada.",
    "export.googleMessage":
      "A planilha foi baixada em .xlsx com os cálculos.\n\nAgora importe esse arquivo no Google Sheets.\n\nUse:\nArquivo → Importar → Upload\n\nDeseja abrir o Google Sheets?",

    "about.eyebrow": "Conheça o projeto",
    "about.title": "Sobre o AeroGrid",
    "about.subtitle": "Uma forma simples de criar e organizar planilhas.",
    "about.bannerTitle": "Planilhas não precisam ser complicadas.",
    "about.bannerText":
      "O AeroGrid foi criado para tornar a criação de planilhas mais simples, rápida e acessível.",
    "about.creatorTitle": "Quem criou?",
    "about.creatorText":
      "O AeroGrid foi criado por Gabriel como um projeto para facilitar a criação e organização de planilhas.",
    "about.goalTitle": "Qual é o objetivo?",
    "about.goalText":
      "Permitir que qualquer pessoa consiga criar planilhas de forma simples, inclusive utilizando modelos com cálculos automáticos.",
    "about.howTitle": "Como funciona?",
    "about.howText":
      "O usuário pode criar do zero ou escolher um modelo, preencher os dados, personalizar a aparência e exportar o resultado.",
    "about.ideaEyebrow": "Ideia do projeto",
    "about.ideaTitle": "Facilitar o dia a dia",
    "about.ideaText1":
      "O AeroGrid busca facilitar a criação de planilhas usando uma interface clara e fácil de entender.",
    "about.ideaText2":
      "Os modelos continuam calculando corretamente mesmo quando novos campos são inseridos em posições diferentes.",
    "about.ideaText3":
      "O sistema também permite ajustar tema, tamanho da fonte e idioma conforme a preferência do usuário.",
    "about.resourcesTitle": "Principais recursos",
    "about.resourcesText": "O que o AeroGrid consegue fazer atualmente.",
    "about.resourceCreate": "Criar",
    "about.resourceCreateText": "Crie do zero ou use modelos prontos.",
    "about.resourceCalc": "Calcular",
    "about.resourceCalcText":
      "Médias, totais, porcentagens e outros resultados.",
    "about.resourceSettings": "Configurar",
    "about.resourceSettingsText": "Tema escuro, fonte e idioma.",
    "about.resourceExport": "Exportar",
    "about.resourceExportText":
      "Gere arquivos compatíveis com Excel e Google Sheets.",
    "about.footerText": "Criado para deixar planilhas mais simples.",
    "about.back": "← Voltar ao sistema",
  },

  en: {
    "nav.dashboard": "Dashboard",
    "nav.new": "New spreadsheet",
    "nav.settings": "Settings",
    "nav.about": "About",
    "status.ready": "System ready",

    "dashboard.welcome": "Welcome to your workspace",
    "dashboard.title": "My spreadsheets",
    "dashboard.subtitle": "Start from scratch or use a ready-made template.",
    "dashboard.create": "＋ Create spreadsheet",
    "dashboard.recent": "Recent spreadsheets",
    "dashboard.recentText": "Continue working on your files.",
    "dashboard.emptyTitle": "No spreadsheets yet",
    "dashboard.emptyText": "Create one from scratch or use a template.",

    "banner.title": "Smart spreadsheets, without the hassle.",
    "banner.text":
      "Use templates with automatic calculations or create your own structure.",

    "stats.sheets": "Spreadsheets",
    "stats.records": "Records",
    "stats.fields": "Fields",

    "common.back": "← Back",
    "common.cancel": "Cancel",
    "common.ok": "OK",
    "common.confirm": "Confirm",
    "common.delete": "Delete",
    "notification.notice": "Notice",
    "notification.confirmTitle": "Confirm action",
    "notification.inputTitle": "Edit information",
    "common.confirmDeleteSheet": "Do you want to delete this spreadsheet?",
    "common.confirmDeleteRow": "Do you want to delete this record?",

    "editor.editing": "Editing spreadsheet",
    "editor.model": "Template",
    "editor.format": "Format",
    "editor.field": "＋ Field",
    "editor.record": "＋ Record",
    "editor.export": "↓ Export",
    "editor.actions": "Actions",
    "editor.autoField": "Calculated automatically by AeroGrid.",
    "editor.rename": "Double-click to rename.",
    "editor.newName": "New field name:",

    "personalization.title": "Customization",
    "personalization.text": "Choose how your spreadsheet should look.",
    "personalization.restore": "↻ Restore",
    "personalization.restoreConfirm": "Restore the default spreadsheet style?",
    "personalization.header": "Header",
    "personalization.headerText": "Header text",
    "personalization.textColor": "Information",
    "personalization.cells": "Cell background",
    "personalization.borders": "Borders",
    "personalization.view": "View",
    "personalization.grid": "Grid",
    "personalization.table": "Table",
    "personalization.fontSize": "Font size",
    "personalization.align": "Alignment",

    "font.small": "Small",
    "font.normal": "Normal",
    "font.large": "Large",
    "font.xlarge": "Very large",
    "align.left": "Left",
    "align.center": "Center",
    "align.right": "Right",

    "settings.eyebrow": "System preferences",
    "settings.title": "Settings",
    "settings.subtitle": "Adjust AeroGrid appearance and language.",
    "settings.theme": "Site theme",
    "settings.themeText": "Switch between light and dark themes.",
    "settings.light": "Light",
    "settings.dark": "Dark",
    "settings.font": "Text size",
    "settings.fontText": "Increase or decrease text size across the system.",
    "settings.language": "Language",
    "settings.languageText": "Choose the language used by the interface.",
    "settings.restoreTitle": "Restore settings",
    "settings.restoreText":
      "Returns to light theme, normal font and Portuguese.",
    "settings.restore": "Restore defaults",
    "settings.restoreConfirm": "Restore AeroGrid settings?",

    "create.title": "New spreadsheet",
    "create.subtitle": "Start from scratch or choose a ready-made template.",
    "create.name": "Spreadsheet name",
    "create.namePlaceholder": "Ex: Store control",
    "create.format": "Export format",
    "create.start": "How do you want to start?",
    "create.modelsText":
      "Smart templates already include fields and calculations.",
    "create.blank": "Blank spreadsheet",
    "create.blankText": "Choose your own fields.",
    "create.fields": "Spreadsheet fields",
    "create.fieldsText": "Example: Name, Age, Phone, City...",
    "create.addField": "＋ Add field",
    "create.submit": "Create spreadsheet",
    "create.modelSelected": "selected",
    "create.modelFields": "Fields",
    "create.autoCalc": "∑ This template includes automatic calculations.",
    "create.needField": "Add at least one field.",

    "filter.all": "All",
    "filter.business": "Business",
    "filter.education": "Education",

    "field.title": "New field",
    "field.subtitle": "Configure how this field should work.",
    "field.name": "Field name",
    "field.namePlaceholder": "Ex: Grade 4",
    "field.type": "Field type",
    "field.info": "Information",
    "field.calculation": "Automatic calculation",
    "field.function": "Field function",
    "field.position": "Position",
    "field.add": "Add",
    "field.tipTitle": "How does it work?",
    "field.tipText":
      "Information fields store data. Calculation fields are filled automatically. The function tells AeroGrid how that field participates in calculations.",
    "field.general": "General information",
    "field.sum": "Sum numeric fields in the row",
    "field.average": "Average numeric fields in the row",
    "field.product": "Multiply numeric fields in the row",
    "field.positionStart": "At the beginning",
    "field.positionEnd": "At the end",
    "field.positionBetween": "Between",
    "field.repeatedRole":
      "A field with this function already exists in this template.",

    "role.student": "Student",
    "role.grade": "Grade (included in average)",
    "role.item": "Item",
    "role.quantity": "Quantity",
    "role.unitPrice": "Unit price",
    "role.product": "Product",
    "role.unitCost": "Unit cost",
    "role.salePrice": "Sale price",
    "role.seller": "Seller",
    "role.commissionPercent": "Commission %",
    "role.totalClasses": "Total classes",
    "role.absences": "Absences",
    "role.subject": "Subject",
    "role.content": "Content",
    "role.date": "Date",
    "role.plannedHours": "Planned hours",
    "role.studiedHours": "Studied hours",
    "role.description": "Description",
    "role.category": "Category",
    "role.movementType": "Movement type",
    "role.value": "Value",

    "calc.gradeAverage": "Grade average",
    "calc.gradeStatus": "Student status",
    "calc.budgetTotal": "Budget total",
    "calc.stockValue": "Stock value",
    "calc.unitProfit": "Unit profit",
    "calc.salePotential": "Sales potential",
    "calc.saleTotal": "Sale total",
    "calc.commission": "Commission",
    "calc.presences": "Attendances",
    "calc.attendancePercent": "Attendance %",
    "calc.attendanceStatus": "Attendance status",
    "calc.studyProgress": "Progress %",

    "summary.income": "Income",
    "summary.expenses": "Expenses",
    "summary.balance": "Balance",
    "summary.totalValue": "Total value",
    "summary.items": "Items",
    "summary.stockCost": "Stock cost",
    "summary.salePotential": "Sales potential",
    "summary.profitPotential": "Potential profit",
    "summary.sold": "Total sold",
    "summary.commissions": "Commissions",
    "summary.classAverage": "Class average",
    "summary.approved": "Approved",
    "summary.failed": "Failed",
    "summary.attendanceAverage": "Average attendance",
    "summary.attention": "Needs attention",
    "summary.plannedHours": "Planned hours",
    "summary.studiedHours": "Studied hours",
    "summary.progress": "Overall progress",

    "status.approved": "Approved",
    "status.failed": "Failed",
    "status.regular": "Regular",
    "status.attention": "Attention",

    "model.financial.name": "Financial Control",
    "model.financial.desc":
      "Track income and expenses and see your balance automatically.",
    "model.budget.name": "Budget",
    "model.budget.desc": "Automatically calculate the total for each item.",
    "model.stock.name": "Inventory Control",
    "model.stock.desc": "Track costs, inventory, profit and sales potential.",
    "model.sales.name": "Sales and Commission",
    "model.sales.desc": "Calculate total sales and commission for each sale.",
    "model.grades.name": "School Grades",
    "model.grades.desc":
      "Add as many grades as needed while keeping the average automatic.",
    "model.attendance.name": "School Attendance",
    "model.attendance.desc": "Calculate attendance and attendance percentage.",
    "model.study.name": "Study Plan",
    "model.study.desc": "Organize subjects and track your progress.",

    "column.description": "Description",
    "column.category": "Category",
    "column.type": "Type",
    "column.value": "Value",
    "column.item": "Item",
    "column.quantity": "Quantity",
    "column.unitPrice": "Unit price",
    "column.total": "Total",
    "column.product": "Product",
    "column.unitCost": "Unit cost",
    "column.salePrice": "Sale price",
    "column.stockValue": "Stock value",
    "column.unitProfit": "Unit profit",
    "column.salePotential": "Sales potential",
    "column.seller": "Seller",
    "column.saleTotal": "Sale total",
    "column.commissionPercent": "Commission %",
    "column.commission": "Commission",
    "column.student": "Student",
    "column.grade1": "Grade 1",
    "column.grade2": "Grade 2",
    "column.grade3": "Grade 3",
    "column.average": "Average",
    "column.status": "Status",
    "column.totalClasses": "Total classes",
    "column.absences": "Absences",
    "column.presences": "Attendances",
    "column.attendance": "Attendance %",
    "column.subject": "Subject",
    "column.content": "Content",
    "column.date": "Date",
    "column.plannedHours": "Planned hours",
    "column.studiedHours": "Studied hours",
    "column.progress": "Progress %",

    "export.libraryError": "The export library was not loaded.",
    "export.googleMessage":
      "The spreadsheet was downloaded as .xlsx with calculations.\n\nNow import it into Google Sheets.\n\nUse:\nFile → Import → Upload\n\nOpen Google Sheets?",

    "about.eyebrow": "Meet the project",
    "about.title": "About AeroGrid",
    "about.subtitle": "A simple way to create and organize spreadsheets.",
    "about.bannerTitle": "Spreadsheets do not have to be complicated.",
    "about.bannerText":
      "AeroGrid was created to make spreadsheet creation simpler, faster and more accessible.",
    "about.creatorTitle": "Who created it?",
    "about.creatorText":
      "AeroGrid was created by Gabriel as a project to simplify spreadsheet creation and organization.",
    "about.goalTitle": "What is the goal?",
    "about.goalText":
      "Allow anyone to create spreadsheets easily, including templates with automatic calculations.",
    "about.howTitle": "How does it work?",
    "about.howText":
      "Users can start from scratch or choose a template, fill in data, customize the look and export the result.",
    "about.ideaEyebrow": "Project idea",
    "about.ideaTitle": "Make everyday work easier",
    "about.ideaText1":
      "AeroGrid aims to simplify spreadsheet creation with a clear and easy-to-understand interface.",
    "about.ideaText2":
      "Templates keep calculating correctly even when new fields are inserted in different positions.",
    "about.ideaText3":
      "The system also lets users adjust theme, font size and language.",
    "about.resourcesTitle": "Main features",
    "about.resourcesText": "What AeroGrid can currently do.",
    "about.resourceCreate": "Create",
    "about.resourceCreateText":
      "Start from scratch or use ready-made templates.",
    "about.resourceCalc": "Calculate",
    "about.resourceCalcText":
      "Averages, totals, percentages and other results.",
    "about.resourceSettings": "Configure",
    "about.resourceSettingsText": "Dark theme, font size and language.",
    "about.resourceExport": "Export",
    "about.resourceExportText":
      "Generate files compatible with Excel and Google Sheets.",
    "about.footerText": "Built to make spreadsheets simpler.",
    "about.back": "← Back to system",
  },
};

/* ================================================= */
/* CONFIGURAÇÕES DO SITE */
/* ================================================= */

/* ================================================= */
/* NOTIFICAÇÕES DO PRÓPRIO SITE */
/* ================================================= */

/*
    este sistema substitui as caixas do navegador:

    alert()
    confirm()
    prompt()

    agora todas as mensagens usam um modal do AeroGrid,
    inclusive no tema escuro.
*/
let resolverNotificacao = null;
let tipoNotificacaoAtual = "aviso";

/* fecha o modal e entrega a resposta para quem chamou */
function concluirNotificacao(valor) {
  const modal = document.getElementById("modalNotificacao");

  if (modal && modal.open) {
    modal.close();
  }

  if (resolverNotificacao) {
    const resolver = resolverNotificacao;
    resolverNotificacao = null;
    resolver(valor);
  }
}

/*
    abre a janela personalizada.

    aviso:
        apenas OK.

    confirmar:
        Cancelar + Confirmar.

    texto:
        mostra um campo de texto.
*/
function abrirNotificacao({
  titulo = "AeroGrid",
  mensagem = "",
  tipo = "aviso",
  valorInicial = "",
}) {
  const modal = document.getElementById("modalNotificacao");

  /* sobre.html não precisa deste modal */
  if (!modal) {
    return Promise.resolve(tipo === "texto" ? valorInicial : true);
  }

  tipoNotificacaoAtual = tipo;

  const tituloElemento = document.getElementById("notificacaoTitulo");
  const mensagemElemento = document.getElementById("notificacaoMensagem");
  const areaInput = document.getElementById("areaInputNotificacao");
  const input = document.getElementById("inputNotificacao");
  const cancelar = document.getElementById("botaoCancelarNotificacao");
  const confirmar = document.getElementById("botaoConfirmarNotificacao");
  const icone = document.getElementById("iconeNotificacao");

  tituloElemento.textContent = titulo;
  mensagemElemento.textContent = mensagem;

  cancelar.classList.toggle("escondido", tipo === "aviso");
  areaInput.classList.toggle("escondido", tipo !== "texto");

  if (tipo === "texto") {
    input.value = valorInicial;
  }

  cancelar.textContent = t("common.cancel");
  confirmar.textContent =
    tipo === "aviso" ? t("common.ok") : t("common.confirm");
  icone.textContent = tipo === "texto" ? "✎" : tipo === "confirmar" ? "?" : "!";

  return new Promise((resolve) => {
    resolverNotificacao = resolve;
    modal.showModal();

    setTimeout(() => {
      if (tipo === "texto") {
        input.focus();
        input.select();
      } else {
        confirmar.focus();
      }
    }, 20);
  });
}

/* substitui alert() */
async function mostrarAviso(mensagem, titulo = t("notification.notice")) {
  await abrirNotificacao({
    titulo,
    mensagem,
    tipo: "aviso",
  });
}

/* substitui confirm() */
async function confirmarAcao(
  mensagem,
  titulo = t("notification.confirmTitle"),
) {
  return await abrirNotificacao({
    titulo,
    mensagem,
    tipo: "confirmar",
  });
}

/* substitui prompt() */
async function pedirTexto(
  mensagem,
  valorInicial = "",
  titulo = t("notification.inputTitle"),
) {
  return await abrirNotificacao({
    titulo,
    mensagem,
    tipo: "texto",
    valorInicial,
  });
}

/* botão azul do modal */
function confirmarNotificacao() {
  if (tipoNotificacaoAtual === "texto") {
    const input = document.getElementById("inputNotificacao");
    concluirNotificacao(input.value);
    return;
  }

  concluirNotificacao(true);
}

/* botão cancelar do modal */
function cancelarNotificacao() {
  concluirNotificacao(tipoNotificacaoAtual === "texto" ? null : false);
}

/* Enter confirma quando estamos digitando */
document.addEventListener("keydown", (event) => {
  const modal = document.getElementById("modalNotificacao");

  if (!modal || !modal.open) return;

  if (event.key === "Enter" && tipoNotificacaoAtual === "texto") {
    event.preventDefault();
    confirmarNotificacao();
  }
});

/* ESC funciona como cancelar */
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modalNotificacao");

  if (modal) {
    modal.addEventListener("cancel", (event) => {
      event.preventDefault();
      cancelarNotificacao();
    });
  }
});

const configuracoesPadrao = {
  tema: "light",
  fonte: "normal",
  idioma: "pt-BR",
};

let configuracoes = {
  ...configuracoesPadrao,
  ...(JSON.parse(localStorage.getItem("aerogrid_configuracoes")) || {}),
};

function t(chave) {
  return (
    traducoes[configuracoes.idioma]?.[chave] ??
    traducoes["pt-BR"]?.[chave] ??
    chave
  );
}

function aplicarTraducao() {
  document.querySelectorAll("[data-i18n]").forEach((elemento) => {
    elemento.textContent = t(elemento.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((elemento) => {
    elemento.placeholder = t(elemento.dataset.i18nPlaceholder);
  });

  document.documentElement.lang = configuracoes.idioma;
}

function aplicarConfiguracoes() {
  /* tema */
  document.documentElement.dataset.theme = configuracoes.tema;

  /*
        o CSS usa rem.
        mudar o tamanho do html aumenta/diminui a interface inteira.
    */
  const tamanhos = {
    small: "14px",
    normal: "16px",
    large: "18px",
  };

  document.documentElement.style.fontSize =
    tamanhos[configuracoes.fonte] || "16px";

  const tema = document.getElementById("configTema");
  const fonte = document.getElementById("configFonte");
  const idioma = document.getElementById("configIdioma");

  if (tema) tema.value = configuracoes.tema;
  if (fonte) fonte.value = configuracoes.fonte;
  if (idioma) idioma.value = configuracoes.idioma;

  aplicarTraducao();
}

function alterarConfiguracoes() {
  const tema = document.getElementById("configTema");
  const fonte = document.getElementById("configFonte");
  const idioma = document.getElementById("configIdioma");

  if (tema) configuracoes.tema = tema.value;
  if (fonte) configuracoes.fonte = fonte.value;
  if (idioma) configuracoes.idioma = idioma.value;

  localStorage.setItem("aerogrid_configuracoes", JSON.stringify(configuracoes));

  aplicarConfiguracoes();
  carregarDashboard();
  renderizarModelos();

  if (planilhaAtual) {
    atualizarCabecalhoEditor();
    montarTabela();
  }
}

async function restaurarConfiguracoes() {
  if (!(await confirmarAcao(t("settings.restoreConfirm")))) return;

  configuracoes = { ...configuracoesPadrao };
  localStorage.setItem("aerogrid_configuracoes", JSON.stringify(configuracoes));

  aplicarConfiguracoes();
  carregarDashboard();
  renderizarModelos();
}

/* ================================================= */
/* MODELOS PRONTOS */
/* ================================================= */

/*
    cada campo agora possui:

    tipo: info ou calculo
    papel: função de um dado informado pelo usuário
    calculo: fórmula automática usada pelo sistema

    isso substitui a lógica antiga baseada em posição.
*/
const modelosPlanilha = {
  financeiro: {
    nomeKey: "model.financial.name",
    descricaoKey: "model.financial.desc",
    categoria: "negocios",
    icone: "💰",
    resumo: "financeiro",
    campos: [
      { nomeKey: "column.description", tipo: "info", papel: "descricao" },
      { nomeKey: "column.category", tipo: "info", papel: "categoria" },
      { nomeKey: "column.type", tipo: "info", papel: "tipo_movimento" },
      { nomeKey: "column.value", tipo: "info", papel: "valor" },
    ],
  },

  orcamento: {
    nomeKey: "model.budget.name",
    descricaoKey: "model.budget.desc",
    categoria: "negocios",
    icone: "🧾",
    resumo: "orcamento",
    campos: [
      { nomeKey: "column.item", tipo: "info", papel: "item" },
      { nomeKey: "column.quantity", tipo: "info", papel: "quantidade" },
      { nomeKey: "column.unitPrice", tipo: "info", papel: "valor_unitario" },
      { nomeKey: "column.total", tipo: "calculo", calculo: "total_orcamento" },
    ],
  },

  estoque: {
    nomeKey: "model.stock.name",
    descricaoKey: "model.stock.desc",
    categoria: "negocios",
    icone: "📦",
    resumo: "estoque",
    campos: [
      { nomeKey: "column.product", tipo: "info", papel: "produto" },
      { nomeKey: "column.quantity", tipo: "info", papel: "quantidade" },
      { nomeKey: "column.unitCost", tipo: "info", papel: "custo_unitario" },
      { nomeKey: "column.salePrice", tipo: "info", papel: "preco_venda" },
      {
        nomeKey: "column.stockValue",
        tipo: "calculo",
        calculo: "valor_estoque",
      },
      {
        nomeKey: "column.unitProfit",
        tipo: "calculo",
        calculo: "lucro_unitario",
      },
      {
        nomeKey: "column.salePotential",
        tipo: "calculo",
        calculo: "potencial_venda",
      },
    ],
  },

  vendas: {
    nomeKey: "model.sales.name",
    descricaoKey: "model.sales.desc",
    categoria: "negocios",
    icone: "📈",
    resumo: "vendas",
    campos: [
      { nomeKey: "column.seller", tipo: "info", papel: "vendedor" },
      { nomeKey: "column.product", tipo: "info", papel: "produto" },
      { nomeKey: "column.quantity", tipo: "info", papel: "quantidade" },
      { nomeKey: "column.unitPrice", tipo: "info", papel: "valor_unitario" },
      { nomeKey: "column.saleTotal", tipo: "calculo", calculo: "total_venda" },
      {
        nomeKey: "column.commissionPercent",
        tipo: "info",
        papel: "comissao_percentual",
      },
      { nomeKey: "column.commission", tipo: "calculo", calculo: "comissao" },
    ],
  },

  notas: {
    nomeKey: "model.grades.name",
    descricaoKey: "model.grades.desc",
    categoria: "educacao",
    icone: "🎓",
    resumo: "notas",
    campos: [
      { nomeKey: "column.student", tipo: "info", papel: "aluno" },
      { nomeKey: "column.grade1", tipo: "info", papel: "nota" },
      { nomeKey: "column.grade2", tipo: "info", papel: "nota" },
      { nomeKey: "column.grade3", tipo: "info", papel: "nota" },
      { nomeKey: "column.average", tipo: "calculo", calculo: "media_notas" },
      { nomeKey: "column.status", tipo: "calculo", calculo: "situacao_notas" },
    ],
  },

  frequencia: {
    nomeKey: "model.attendance.name",
    descricaoKey: "model.attendance.desc",
    categoria: "educacao",
    icone: "📚",
    resumo: "frequencia",
    campos: [
      { nomeKey: "column.student", tipo: "info", papel: "aluno" },
      { nomeKey: "column.totalClasses", tipo: "info", papel: "total_aulas" },
      { nomeKey: "column.absences", tipo: "info", papel: "faltas" },
      { nomeKey: "column.presences", tipo: "calculo", calculo: "presencas" },
      {
        nomeKey: "column.attendance",
        tipo: "calculo",
        calculo: "frequencia_percentual",
      },
      {
        nomeKey: "column.status",
        tipo: "calculo",
        calculo: "situacao_frequencia",
      },
    ],
  },

  estudos: {
    nomeKey: "model.study.name",
    descricaoKey: "model.study.desc",
    categoria: "educacao",
    icone: "📝",
    resumo: "estudos",
    campos: [
      { nomeKey: "column.subject", tipo: "info", papel: "disciplina" },
      { nomeKey: "column.content", tipo: "info", papel: "conteudo" },
      { nomeKey: "column.date", tipo: "info", papel: "data" },
      {
        nomeKey: "column.plannedHours",
        tipo: "info",
        papel: "horas_planejadas",
      },
      {
        nomeKey: "column.studiedHours",
        tipo: "info",
        papel: "horas_estudadas",
      },
      {
        nomeKey: "column.progress",
        tipo: "calculo",
        calculo: "progresso_estudos",
      },
    ],
  },
};

/*
    opções de FUNÇÃO para campos de informação.
    "geral" é uma informação comum e não entra em fórmulas.
*/
const papeisPorModelo = {
  vazio: [["geral", "field.general"]],

  notas: [
    ["geral", "field.general"],
    ["aluno", "role.student"],
    ["nota", "role.grade"],
  ],

  orcamento: [
    ["geral", "field.general"],
    ["item", "role.item"],
    ["quantidade", "role.quantity"],
    ["valor_unitario", "role.unitPrice"],
  ],

  estoque: [
    ["geral", "field.general"],
    ["produto", "role.product"],
    ["quantidade", "role.quantity"],
    ["custo_unitario", "role.unitCost"],
    ["preco_venda", "role.salePrice"],
  ],

  vendas: [
    ["geral", "field.general"],
    ["vendedor", "role.seller"],
    ["produto", "role.product"],
    ["quantidade", "role.quantity"],
    ["valor_unitario", "role.unitPrice"],
    ["comissao_percentual", "role.commissionPercent"],
  ],

  frequencia: [
    ["geral", "field.general"],
    ["aluno", "role.student"],
    ["total_aulas", "role.totalClasses"],
    ["faltas", "role.absences"],
  ],

  estudos: [
    ["geral", "field.general"],
    ["disciplina", "role.subject"],
    ["conteudo", "role.content"],
    ["data", "role.date"],
    ["horas_planejadas", "role.plannedHours"],
    ["horas_estudadas", "role.studiedHours"],
  ],

  financeiro: [
    ["geral", "field.general"],
    ["descricao", "role.description"],
    ["categoria", "role.category"],
    ["tipo_movimento", "role.movementType"],
    ["valor", "role.value"],
  ],
};

/* cálculos específicos de cada modelo */
const calculosPorModelo = {
  vazio: [],
  notas: [
    ["media_notas", "calc.gradeAverage"],
    ["situacao_notas", "calc.gradeStatus"],
  ],
  orcamento: [["total_orcamento", "calc.budgetTotal"]],
  estoque: [
    ["valor_estoque", "calc.stockValue"],
    ["lucro_unitario", "calc.unitProfit"],
    ["potencial_venda", "calc.salePotential"],
  ],
  vendas: [
    ["total_venda", "calc.saleTotal"],
    ["comissao", "calc.commission"],
  ],
  frequencia: [
    ["presencas", "calc.presences"],
    ["frequencia_percentual", "calc.attendancePercent"],
    ["situacao_frequencia", "calc.attendanceStatus"],
  ],
  estudos: [["progresso_estudos", "calc.studyProgress"]],
  financeiro: [],
};

/*
    normalmente um papel só deve existir uma vez.
    "nota" é exceção: pode existir Nota 1, Nota 2, Nota 3, Nota 4...
*/
const papeisRepetiveis = new Set(["geral", "nota"]);

let filtroModelosAtual = "todos";

/* ================================================= */
/* DADOS E ELEMENTOS */
/* ================================================= */

let planilhas = JSON.parse(localStorage.getItem("planilhas")) || [];
let planilhaAtual = null;
let contadorCampos = 0;

function criarIdCampo() {
  contadorCampos++;
  return `campo_${Date.now()}_${contadorCampos}`;
}

const dashboard = document.getElementById("dashboard");
const editor = document.getElementById("editor");
const configuracoesTela = document.getElementById("configuracoes");
const modalCriacao = document.getElementById("modalCriacao");
const modalCampo = document.getElementById("modalCampo");
const listaPlanilhas = document.getElementById("listaPlanilhas");
const cabecalhoTabela = document.getElementById("cabecalhoTabela");
const corpoTabela = document.getElementById("corpoTabela");
const tabelaPlanilha = document.getElementById("tabelaPlanilha");
const resumoModelo = document.getElementById("resumoModelo");

/* ================================================= */
/* PERSONALIZAÇÃO PADRÃO DAS PLANILHAS */
/* ================================================= */

function personalizacaoPadrao() {
  return {
    corCabecalho: "#244760",
    corTextoCabecalho: "#ffffff",
    corTexto: "#253746",
    corCelulas: "#ffffff",
    corBorda: "#d5e0e6",
    estilo: "grade",
    tamanhoFonte: "14",
    alinhamento: "left",
  };
}

/* ================================================= */
/* FUNÇÕES DE AJUDA */
/* ================================================= */

function salvar() {
  localStorage.setItem("planilhas", JSON.stringify(planilhas));
}

function temValor(valor) {
  return valor !== "" && valor !== null && valor !== undefined;
}

function numero(valor) {
  if (typeof valor === "number") return valor;
  if (!temValor(valor)) return 0;

  let texto = String(valor).trim().replace(/R\$/gi, "").replace(/\s/g, "");

  if (texto.includes(".") && texto.includes(",")) {
    texto = texto.replace(/\./g, "").replace(",", ".");
  } else {
    texto = texto.replace(",", ".");
  }

  texto = texto.replace(/[^0-9.-]/g, "");

  const resultado = Number(texto);
  return Number.isNaN(resultado) ? 0 : resultado;
}

function numeroOuNull(valor) {
  if (!temValor(valor)) return null;

  const texto = String(valor).trim();
  if (!/[0-9]/.test(texto)) return null;

  const resultado = numero(valor);
  return Number.isFinite(resultado) ? resultado : null;
}

function arredondar(valor) {
  return Number(Number(valor).toFixed(2));
}

function dinheiro(valor) {
  const locale = configuracoes.idioma === "en" ? "en-US" : "pt-BR";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BRL",
  }).format(numero(valor));
}

function normalizarTexto(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function obterModelo(id) {
  return modelosPlanilha[id] || null;
}

function nomeModelo(id) {
  const modelo = obterModelo(id);
  return modelo ? t(modelo.nomeKey) : t("create.blank");
}

function camposPorPapel(planilha, papel) {
  return (planilha.colunas || []).filter((campo) => {
    return campo.tipo === "info" && campo.papel === papel;
  });
}

function campoPorPapel(planilha, papel) {
  return camposPorPapel(planilha, papel)[0] || null;
}

function valorPorPapel(planilha, linha, papel) {
  const campo = campoPorPapel(planilha, papel);
  return campo ? linha[campo.id] : "";
}

/* ================================================= */
/* MIGRAÇÃO DAS PLANILHAS ANTIGAS */
/* ================================================= */

/*
    antes as colunas eram apenas textos e as linhas eram arrays.

    agora cada coluna recebe um ID e uma função.
    isso permite mover/inserir colunas sem quebrar os dados.
*/
function migrarPlanilhas() {
  planilhas = planilhas.filter((planilha) => {
    return planilha.tipo === "excel" || planilha.tipo === "google";
  });

  planilhas.forEach((planilha) => {
    if (!planilha.personalizacao) {
      planilha.personalizacao = personalizacaoPadrao();
    }

    if (!planilha.modelo) {
      planilha.modelo = "vazio";
    }

    const colunasAntigas = Array.isArray(planilha.colunas)
      ? [...planilha.colunas]
      : [];
    const possuiString = colunasAntigas.some(
      (coluna) => typeof coluna === "string",
    );

    if (possuiString) {
      const novasColunas = colunasAntigas.map((nome) => {
        if (typeof nome === "object") {
          return {
            id: nome.id || criarIdCampo(),
            nome: nome.nome || "Campo",
            tipo: nome.tipo || "info",
            papel: nome.papel || "geral",
            calculo: nome.calculo || null,
          };
        }

        return inferirCampoLegado(String(nome), planilha.modelo);
      });

      planilha.linhas = (planilha.linhas || []).map((linha) => {
        if (!Array.isArray(linha)) return linha;

        const novaLinha = {};

        novasColunas.forEach((campo, indice) => {
          novaLinha[campo.id] = linha[indice] ?? "";
        });

        return novaLinha;
      });

      planilha.colunas = novasColunas;
    } else {
      planilha.colunas = (planilha.colunas || []).map((campo) => ({
        id: campo.id || criarIdCampo(),
        nome: campo.nome || "Campo",
        tipo: campo.tipo || "info",
        papel: campo.papel || "geral",
        calculo: campo.calculo || null,
      }));

      planilha.linhas = (planilha.linhas || []).map((linha) => {
        if (!Array.isArray(linha)) return linha;

        const novaLinha = {};
        planilha.colunas.forEach((campo, indice) => {
          novaLinha[campo.id] = linha[indice] ?? "";
        });
        return novaLinha;
      });
    }
  });

  salvar();
}

/*
    tenta reconhecer a função de campos antigos pelo nome.

    exemplo:
    uma antiga "Nota 4" criada no final será reconhecida como nota
    e passará a entrar na média automaticamente.
*/
function inferirCampoLegado(nome, modelo) {
  const texto = normalizarTexto(nome);

  const campo = {
    id: criarIdCampo(),
    nome,
    tipo: "info",
    papel: "geral",
    calculo: null,
  };

  if (modelo === "notas") {
    if (texto.includes("aluno") || texto.includes("student"))
      campo.papel = "aluno";
    else if (/^(nota|grade)\s*\d*/.test(texto)) campo.papel = "nota";
    else if (texto.includes("media") || texto.includes("average")) {
      campo.tipo = "calculo";
      campo.calculo = "media_notas";
    } else if (texto.includes("situacao") || texto.includes("status")) {
      campo.tipo = "calculo";
      campo.calculo = "situacao_notas";
    }
  }

  if (modelo === "orcamento") {
    if (texto.includes("item")) campo.papel = "item";
    else if (texto.includes("quant")) campo.papel = "quantidade";
    else if (texto.includes("unit")) campo.papel = "valor_unitario";
    else if (texto === "total") {
      campo.tipo = "calculo";
      campo.calculo = "total_orcamento";
    }
  }

  if (modelo === "estoque") {
    if (texto.includes("produto") || texto.includes("product"))
      campo.papel = "produto";
    else if (texto.includes("quant")) campo.papel = "quantidade";
    else if (texto.includes("custo") || texto.includes("cost"))
      campo.papel = "custo_unitario";
    else if (texto.includes("preco") || texto.includes("sale price"))
      campo.papel = "preco_venda";
    else if (
      texto.includes("valor em estoque") ||
      texto.includes("stock value")
    ) {
      campo.tipo = "calculo";
      campo.calculo = "valor_estoque";
    } else if (texto.includes("lucro") || texto.includes("profit")) {
      campo.tipo = "calculo";
      campo.calculo = "lucro_unitario";
    } else if (texto.includes("potencial")) {
      campo.tipo = "calculo";
      campo.calculo = "potencial_venda";
    }
  }

  if (modelo === "vendas") {
    if (texto.includes("vendedor") || texto.includes("seller"))
      campo.papel = "vendedor";
    else if (texto.includes("produto") || texto.includes("product"))
      campo.papel = "produto";
    else if (texto.includes("quant")) campo.papel = "quantidade";
    else if (texto.includes("unit")) campo.papel = "valor_unitario";
    else if (
      texto.includes("total") &&
      (texto.includes("vend") || texto.includes("sale"))
    ) {
      campo.tipo = "calculo";
      campo.calculo = "total_venda";
    } else if (texto.includes("comissao") || texto.includes("commission")) {
      if (texto.includes("%")) campo.papel = "comissao_percentual";
      else {
        campo.tipo = "calculo";
        campo.calculo = "comissao";
      }
    }
  }

  if (modelo === "frequencia") {
    if (texto.includes("aluno") || texto.includes("student"))
      campo.papel = "aluno";
    else if (
      texto.includes("total") &&
      (texto.includes("aula") || texto.includes("class"))
    )
      campo.papel = "total_aulas";
    else if (texto.includes("falta") || texto.includes("absence"))
      campo.papel = "faltas";
    else if (texto.includes("presen")) {
      campo.tipo = "calculo";
      campo.calculo = "presencas";
    } else if (texto.includes("%") || texto.includes("frequencia")) {
      campo.tipo = "calculo";
      campo.calculo = "frequencia_percentual";
    } else if (texto.includes("situacao") || texto.includes("status")) {
      campo.tipo = "calculo";
      campo.calculo = "situacao_frequencia";
    }
  }

  if (modelo === "estudos") {
    if (texto.includes("disciplina") || texto.includes("subject"))
      campo.papel = "disciplina";
    else if (texto.includes("conteudo") || texto.includes("content"))
      campo.papel = "conteudo";
    else if (texto.includes("data") || texto.includes("date"))
      campo.papel = "data";
    else if (texto.includes("planej") || texto.includes("planned"))
      campo.papel = "horas_planejadas";
    else if (texto.includes("estud") || texto.includes("studied"))
      campo.papel = "horas_estudadas";
    else if (texto.includes("progres")) {
      campo.tipo = "calculo";
      campo.calculo = "progresso_estudos";
    }
  }

  if (modelo === "financeiro") {
    if (texto.includes("descr")) campo.papel = "descricao";
    else if (texto.includes("categor")) campo.papel = "categoria";
    else if (texto === "tipo" || texto.includes("movement"))
      campo.papel = "tipo_movimento";
    else if (texto.includes("valor") || texto.includes("value"))
      campo.papel = "valor";
  }

  return campo;
}

/* ================================================= */
/* TROCA DE TELAS */
/* ================================================= */

function esconderTelasPrincipais() {
  if (dashboard) dashboard.classList.add("escondido");
  if (editor) editor.classList.add("escondido");
  if (configuracoesTela) configuracoesTela.classList.add("escondido");
}

function mostrarDashboard() {
  if (!dashboard) {
    window.location.href = "index.html";
    return;
  }

  esconderTelasPrincipais();
  dashboard.classList.remove("escondido");
  planilhaAtual = null;
  carregarDashboard();
}

function mostrarConfiguracoes() {
  if (!configuracoesTela) {
    window.location.href = "index.html?config=1";
    return;
  }

  esconderTelasPrincipais();
  configuracoesTela.classList.remove("escondido");
  planilhaAtual = null;
  aplicarConfiguracoes();
}

/* ================================================= */
/* DASHBOARD */
/* ================================================= */

function carregarDashboard() {
  if (!listaPlanilhas) return;

  listaPlanilhas.innerHTML = "";

  let registros = 0;
  let campos = 0;

  planilhas.forEach((planilha) => {
    registros += (planilha.linhas || []).length;
    campos += (planilha.colunas || []).length;
  });

  const totalPlanilhas = document.getElementById("totalPlanilhas");
  const totalRegistros = document.getElementById("totalRegistros");
  const totalCampos = document.getElementById("totalCampos");

  if (totalPlanilhas) totalPlanilhas.textContent = planilhas.length;
  if (totalRegistros) totalRegistros.textContent = registros;
  if (totalCampos) totalCampos.textContent = campos;

  if (planilhas.length === 0) {
    listaPlanilhas.innerHTML = `
            <div class="vazio">
                <h3>${t("dashboard.emptyTitle")}</h3>
                <p>${t("dashboard.emptyText")}</p>
            </div>
        `;
    return;
  }

  planilhas.forEach((planilha) => {
    const card = document.createElement("article");
    card.className = "card-planilha";

    const etiquetaModelo =
      planilha.modelo && planilha.modelo !== "vazio"
        ? `<span class="tag-modelo">${nomeModelo(planilha.modelo)}</span>`
        : "";

    card.innerHTML = `
            <div class="topo-card-planilha">
                <h4>▦ ${planilha.nome}</h4>
                ${etiquetaModelo}
            </div>

            <p>
                ${(planilha.linhas || []).length} ${t("stats.records").toLowerCase()}
                ·
                ${(planilha.colunas || []).length} ${t("stats.fields").toLowerCase()}
            </p>

            <footer>
                <span class="tag">${nomeTipo(planilha.tipo)}</span>
                <button class="excluir" onclick="excluirPlanilha(event, '${planilha.id}')">
                    ${t("common.delete")}
                </button>
            </footer>
        `;

    card.addEventListener("click", () => abrirPlanilha(planilha.id));
    listaPlanilhas.appendChild(card);
  });
}

/* ================================================= */
/* CRIAÇÃO DE PLANILHA */
/* ================================================= */

function abrirCriacao() {
  if (!modalCriacao) {
    window.location.href = "index.html?nova=1";
    return;
  }

  document.getElementById("nomePlanilha").value = "";
  document.getElementById("tipoExportacao").value = "excel";
  document.getElementById("camposCriacao").innerHTML = "";

  adicionarCampoCriacao(t("column.description"));

  document.getElementById("modeloSelecionado").value = "vazio";
  filtroModelosAtual = "todos";

  document.querySelectorAll(".filtro-modelo").forEach((botao) => {
    botao.classList.remove("ativo");
  });

  const primeiroFiltro = document.querySelector(".filtro-modelo");
  if (primeiroFiltro) primeiroFiltro.classList.add("ativo");

  renderizarModelos();
  selecionarModelo("vazio");
  modalCriacao.showModal();
}

function fecharCriacao() {
  if (modalCriacao) modalCriacao.close();
}

function renderizarModelos() {
  const lista = document.getElementById("listaModelos");
  if (!lista) return;

  const selecionado =
    document.getElementById("modeloSelecionado")?.value || "vazio";
  lista.innerHTML = "";

  Object.entries(modelosPlanilha).forEach(([id, modelo]) => {
    if (
      filtroModelosAtual !== "todos" &&
      modelo.categoria !== filtroModelosAtual
    )
      return;

    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "card-modelo";
    botao.dataset.modelo = id;

    if (selecionado === id) botao.classList.add("modelo-selecionado");

    const categoria =
      modelo.categoria === "educacao"
        ? t("filter.education")
        : t("filter.business");

    botao.innerHTML = `
            <span class="icone-modelo">${modelo.icone}</span>
            <span class="conteudo-modelo">
                <small>${categoria}</small>
                <strong>${t(modelo.nomeKey)}</strong>
                <span>${t(modelo.descricaoKey)}</span>
            </span>
        `;

    botao.onclick = () => selecionarModelo(id);
    lista.appendChild(botao);
  });
}

function filtrarModelos(filtro, botao) {
  filtroModelosAtual = filtro;

  document.querySelectorAll(".filtro-modelo").forEach((item) => {
    item.classList.remove("ativo");
  });

  if (botao) botao.classList.add("ativo");
  renderizarModelos();
}

function selecionarModelo(id) {
  const inputModelo = document.getElementById("modeloSelecionado");
  const areaManual = document.getElementById("areaCamposManuais");
  const info = document.getElementById("infoModeloSelecionado");
  const botaoVazio = document.getElementById("modeloVazio");

  if (!inputModelo || !areaManual || !info || !botaoVazio) return;

  inputModelo.value = id;

  document.querySelectorAll(".card-modelo").forEach((card) => {
    card.classList.remove("modelo-selecionado");
  });

  botaoVazio.classList.remove("modelo-selecionado");

  if (id === "vazio") {
    botaoVazio.classList.add("modelo-selecionado");
    areaManual.classList.remove("escondido");
    info.classList.add("escondido");
    return;
  }

  const modelo = obterModelo(id);
  if (!modelo) return;

  const card = document.querySelector(`[data-modelo="${id}"]`);
  if (card) card.classList.add("modelo-selecionado");

  areaManual.classList.add("escondido");

  const nomesCampos = modelo.campos.map((campo) => t(campo.nomeKey));
  const possuiCalculo = modelo.campos.some((campo) => campo.tipo === "calculo");

  info.innerHTML = `
        <strong>${modelo.icone} ${t(modelo.nomeKey)} ${t("create.modelSelected")}</strong>
        <p>${t("create.modelFields")}: ${nomesCampos.join(" · ")}</p>
        ${possuiCalculo ? `<small>${t("create.autoCalc")}</small>` : ""}
    `;

  info.classList.remove("escondido");

  const nomeInput = document.getElementById("nomePlanilha");
  if (nomeInput && !nomeInput.value.trim()) {
    nomeInput.value = t(modelo.nomeKey);
  }
}

function adicionarCampoCriacao(valor = "") {
  const container = document.getElementById("camposCriacao");
  if (!container) return;

  const campo = document.createElement("div");
  campo.className = "campo-criacao";

  campo.innerHTML = `
        <input class="campoNovo" placeholder="${t("field.name")}" value="${valor}" required>
        <button type="button" onclick="this.parentElement.remove()">✕</button>
    `;

  container.appendChild(campo);
}

function criarCampoModelo(campoModelo) {
  return {
    id: criarIdCampo(),
    nome: t(campoModelo.nomeKey),
    tipo: campoModelo.tipo,
    papel: campoModelo.papel || "geral",
    calculo: campoModelo.calculo || null,
  };
}

async function criarPlanilha(event) {
  event.preventDefault();

  const nome = document.getElementById("nomePlanilha").value.trim();
  const tipo = document.getElementById("tipoExportacao").value;
  const modeloId = document.getElementById("modeloSelecionado").value;

  let colunas = [];
  let linhas = [];

  if (modeloId !== "vazio") {
    const modelo = obterModelo(modeloId);
    if (!modelo) return;

    colunas = modelo.campos.map(criarCampoModelo);

    const primeiraLinha = {};
    colunas.forEach((campo) => (primeiraLinha[campo.id] = ""));
    linhas = [primeiraLinha];
  } else {
    document.querySelectorAll(".campoNovo").forEach((campoInput) => {
      const nomeCampo = campoInput.value.trim();

      if (nomeCampo) {
        colunas.push({
          id: criarIdCampo(),
          nome: nomeCampo,
          tipo: "info",
          papel: "geral",
          calculo: null,
        });
      }
    });

    if (colunas.length === 0) {
      await mostrarAviso(t("create.needField"));
      return;
    }
  }

  const novaPlanilha = {
    id: Date.now().toString(),
    nome:
      nome || (modeloId === "vazio" ? t("create.blank") : nomeModelo(modeloId)),
    tipo,
    modelo: modeloId,
    colunas,
    linhas,
    criadaEm: new Date().toISOString(),
    personalizacao: personalizacaoPadrao(),
  };

  atualizarTodosCalculos(novaPlanilha);

  planilhas.push(novaPlanilha);
  salvar();
  modalCriacao.close();
  abrirPlanilha(novaPlanilha.id);
}

/* ================================================= */
/* CÁLCULOS DINÂMICOS */
/* ================================================= */

/*
    média das notas:
    procura TODOS os campos com papel "nota".

    se o usuário adicionar Nota 4, Nota 5 etc.,
    elas entram automaticamente no cálculo.
*/
function calcularMediaNotas(planilha, linha) {
  const camposNotas = camposPorPapel(planilha, "nota");

  if (camposNotas.length === 0) return "";

  const todasPreenchidas = camposNotas.every((campo) => {
    return temValor(linha[campo.id]);
  });

  if (!todasPreenchidas) return "";

  const soma = camposNotas.reduce((total, campo) => {
    return total + numero(linha[campo.id]);
  }, 0);

  return arredondar(soma / camposNotas.length);
}

/*
    cada cálculo procura os dados pela FUNÇÃO do campo,
    não pela posição da coluna.
*/
function calcularCampo(planilha, linha, campo) {
  const calculo = campo.calculo;

  if (calculo === "media_notas") {
    return calcularMediaNotas(planilha, linha);
  }

  if (calculo === "situacao_notas") {
    const media = calcularMediaNotas(planilha, linha);
    if (!temValor(media)) return "";
    return numero(media) >= 6 ? t("status.approved") : t("status.failed");
  }

  if (calculo === "total_orcamento") {
    const quantidade = valorPorPapel(planilha, linha, "quantidade");
    const valor = valorPorPapel(planilha, linha, "valor_unitario");

    if (!temValor(quantidade) || !temValor(valor)) return "";
    return arredondar(numero(quantidade) * numero(valor));
  }

  if (calculo === "valor_estoque") {
    const quantidade = valorPorPapel(planilha, linha, "quantidade");
    const custo = valorPorPapel(planilha, linha, "custo_unitario");

    if (!temValor(quantidade) || !temValor(custo)) return "";
    return arredondar(numero(quantidade) * numero(custo));
  }

  if (calculo === "lucro_unitario") {
    const custo = valorPorPapel(planilha, linha, "custo_unitario");
    const venda = valorPorPapel(planilha, linha, "preco_venda");

    if (!temValor(custo) || !temValor(venda)) return "";
    return arredondar(numero(venda) - numero(custo));
  }

  if (calculo === "potencial_venda") {
    const quantidade = valorPorPapel(planilha, linha, "quantidade");
    const venda = valorPorPapel(planilha, linha, "preco_venda");

    if (!temValor(quantidade) || !temValor(venda)) return "";
    return arredondar(numero(quantidade) * numero(venda));
  }

  if (calculo === "total_venda") {
    const quantidade = valorPorPapel(planilha, linha, "quantidade");
    const valor = valorPorPapel(planilha, linha, "valor_unitario");

    if (!temValor(quantidade) || !temValor(valor)) return "";
    return arredondar(numero(quantidade) * numero(valor));
  }

  if (calculo === "comissao") {
    const total = calcularCampo(planilha, linha, { calculo: "total_venda" });
    const percentual = valorPorPapel(planilha, linha, "comissao_percentual");

    if (!temValor(total) || !temValor(percentual)) return "";
    return arredondar(numero(total) * (numero(percentual) / 100));
  }

  if (calculo === "presencas") {
    const aulas = valorPorPapel(planilha, linha, "total_aulas");
    const faltas = valorPorPapel(planilha, linha, "faltas");

    if (!temValor(aulas) || !temValor(faltas)) return "";
    return arredondar(Math.max(numero(aulas) - numero(faltas), 0));
  }

  if (calculo === "frequencia_percentual") {
    const aulas = numero(valorPorPapel(planilha, linha, "total_aulas"));
    const presencas = calcularCampo(planilha, linha, { calculo: "presencas" });

    if (aulas <= 0 || !temValor(presencas)) return "";
    return arredondar((numero(presencas) / aulas) * 100);
  }

  if (calculo === "situacao_frequencia") {
    const frequencia = calcularCampo(planilha, linha, {
      calculo: "frequencia_percentual",
    });

    if (!temValor(frequencia)) return "";
    return numero(frequencia) >= 75
      ? t("status.regular")
      : t("status.attention");
  }

  if (calculo === "progresso_estudos") {
    const planejadas = numero(
      valorPorPapel(planilha, linha, "horas_planejadas"),
    );
    const estudadas = valorPorPapel(planilha, linha, "horas_estudadas");

    if (planejadas <= 0 || !temValor(estudadas)) return "";
    return arredondar((numero(estudadas) / planejadas) * 100);
  }

  /*
        cálculos genéricos:
        usam todos os campos de informação que realmente são numéricos.
    */
  const valoresNumericos = planilha.colunas
    .filter((outroCampo) => outroCampo.tipo === "info")
    .map((outroCampo) => numeroOuNull(linha[outroCampo.id]))
    .filter((valor) => valor !== null);

  if (calculo === "soma_linha") {
    if (valoresNumericos.length === 0) return "";
    return arredondar(
      valoresNumericos.reduce((total, valor) => total + valor, 0),
    );
  }

  if (calculo === "media_linha") {
    if (valoresNumericos.length === 0) return "";
    const total = valoresNumericos.reduce((soma, valor) => soma + valor, 0);
    return arredondar(total / valoresNumericos.length);
  }

  if (calculo === "produto_linha") {
    if (valoresNumericos.length === 0) return "";
    return arredondar(
      valoresNumericos.reduce((total, valor) => total * valor, 1),
    );
  }

  return "";
}

function atualizarCalculosLinha(planilha, linha) {
  planilha.colunas
    .filter((campo) => campo.tipo === "calculo")
    .forEach((campo) => {
      linha[campo.id] = calcularCampo(planilha, linha, campo);
    });
}

function atualizarTodosCalculos(planilha = planilhaAtual) {
  if (!planilha) return;
  (planilha.linhas || []).forEach((linha) => {
    atualizarCalculosLinha(planilha, linha);
  });
}

/* ================================================= */
/* ABRIR E MONTAR PLANILHA */
/* ================================================= */

function abrirPlanilha(id) {
  if (!dashboard || !editor) return;

  planilhaAtual = planilhas.find((planilha) => planilha.id === id);
  if (!planilhaAtual) return;

  atualizarTodosCalculos(planilhaAtual);
  salvar();

  esconderTelasPrincipais();
  editor.classList.remove("escondido");

  document.getElementById("nomePlanilhaEditor").value = planilhaAtual.nome;

  atualizarCabecalhoEditor();
  carregarPersonalizacao();
  montarTabela();
}

function atualizarCabecalhoEditor() {
  if (!planilhaAtual) return;

  const textoModelo = document.getElementById("textoModeloEditor");
  const tipoPlanilha = document.getElementById("tipoPlanilha");

  if (textoModelo) {
    textoModelo.textContent =
      planilhaAtual.modelo && planilhaAtual.modelo !== "vazio"
        ? `${t("editor.model")}: ${nomeModelo(planilhaAtual.modelo)}`
        : t("editor.editing");
  }

  if (tipoPlanilha) {
    tipoPlanilha.textContent = `${t("editor.format")}: ${nomeTipo(planilhaAtual.tipo)}`;
  }
}

function montarTabela() {
  if (!planilhaAtual || !cabecalhoTabela || !corpoTabela) return;

  atualizarTodosCalculos();

  cabecalhoTabela.innerHTML = "";
  corpoTabela.innerHTML = "";

  /* cabeçalho */
  planilhaAtual.colunas.forEach((campo) => {
    const th = document.createElement("th");
    th.textContent = campo.tipo === "calculo" ? `∑ ${campo.nome}` : campo.nome;

    if (campo.tipo === "calculo") {
      th.title = t("editor.autoField");
    } else {
      th.title = t("editor.rename");
      th.ondblclick = () => renomearColuna(campo.id);
    }

    cabecalhoTabela.appendChild(th);
  });

  const thAcoes = document.createElement("th");
  thAcoes.textContent = t("editor.actions");
  thAcoes.className = "coluna-acoes";
  cabecalhoTabela.appendChild(thAcoes);

  /* linhas */
  planilhaAtual.linhas.forEach((linha, indiceLinha) => {
    const tr = document.createElement("tr");

    planilhaAtual.colunas.forEach((campo) => {
      const td = document.createElement("td");
      const input = document.createElement("input");

      input.value = linha[campo.id] ?? "";

      if (campo.tipo === "calculo") {
        input.readOnly = true;
        input.classList.add("campo-calculado");
        input.title = t("editor.autoField");
      } else {
        input.placeholder = campo.nome;

        input.addEventListener("input", (event) => {
          linha[campo.id] = event.target.value;

          atualizarCalculosLinha(planilhaAtual, linha);
          atualizarCelulasCalculadasDaLinha(tr, linha);
          salvar();
          montarResumoModelo();
        });
      }

      td.appendChild(input);
      tr.appendChild(td);
    });

    const tdExcluir = document.createElement("td");
    tdExcluir.className = "coluna-acoes";

    const botao = document.createElement("button");
    botao.textContent = "🗑️";
    botao.title = t("common.delete");
    botao.onclick = () => excluirLinha(indiceLinha);

    tdExcluir.appendChild(botao);
    tr.appendChild(tdExcluir);
    corpoTabela.appendChild(tr);
  });

  aplicarPersonalizacao();
  montarResumoModelo();
}

function atualizarCelulasCalculadasDaLinha(tr, linha) {
  const inputs = tr.querySelectorAll("td input");

  planilhaAtual.colunas.forEach((campo, indice) => {
    if (campo.tipo === "calculo") {
      inputs[indice].value = linha[campo.id] ?? "";
    }
  });
}

/* ================================================= */
/* RESUMOS DOS MODELOS */
/* ================================================= */

function criarCardResumo(titulo, valor) {
  return `
        <article class="card-resumo">
            <small>${titulo}</small>
            <strong>${valor}</strong>
        </article>
    `;
}

function valorCalculo(planilha, linha, calculo) {
  const campo = planilha.colunas.find((item) => {
    return item.tipo === "calculo" && item.calculo === calculo;
  });

  if (campo) return linha[campo.id];

  return calcularCampo(planilha, linha, { calculo });
}

function montarResumoModelo() {
  if (!planilhaAtual || !resumoModelo) return;

  const modelo = obterModelo(planilhaAtual.modelo);

  if (!modelo || !modelo.resumo) {
    resumoModelo.innerHTML = "";
    resumoModelo.classList.add("escondido");
    return;
  }

  atualizarTodosCalculos();

  let conteudo = "";

  if (modelo.resumo === "financeiro") {
    let entradas = 0;
    let saidas = 0;

    planilhaAtual.linhas.forEach((linha) => {
      const tipo = normalizarTexto(
        valorPorPapel(planilhaAtual, linha, "tipo_movimento"),
      );
      const valor = numero(valorPorPapel(planilhaAtual, linha, "valor"));

      if (
        tipo.includes("entrada") ||
        tipo.includes("receita") ||
        tipo.includes("income") ||
        tipo.includes("ganho")
      ) {
        entradas += valor;
      }

      if (
        tipo.includes("saida") ||
        tipo.includes("despesa") ||
        tipo.includes("expense") ||
        tipo.includes("gasto")
      ) {
        saidas += valor;
      }
    });

    conteudo += criarCardResumo(t("summary.income"), dinheiro(entradas));
    conteudo += criarCardResumo(t("summary.expenses"), dinheiro(saidas));
    conteudo += criarCardResumo(
      t("summary.balance"),
      dinheiro(entradas - saidas),
    );
  }

  if (modelo.resumo === "orcamento") {
    const total = planilhaAtual.linhas.reduce((soma, linha) => {
      return (
        soma + numero(valorCalculo(planilhaAtual, linha, "total_orcamento"))
      );
    }, 0);

    const campoItem = campoPorPapel(planilhaAtual, "item");
    const itens = campoItem
      ? planilhaAtual.linhas.filter((linha) => temValor(linha[campoItem.id]))
          .length
      : planilhaAtual.linhas.length;

    conteudo += criarCardResumo(t("summary.totalValue"), dinheiro(total));
    conteudo += criarCardResumo(t("summary.items"), itens);
  }

  if (modelo.resumo === "estoque") {
    let custo = 0;
    let potencial = 0;

    planilhaAtual.linhas.forEach((linha) => {
      custo += numero(valorCalculo(planilhaAtual, linha, "valor_estoque"));
      potencial += numero(
        valorCalculo(planilhaAtual, linha, "potencial_venda"),
      );
    });

    conteudo += criarCardResumo(t("summary.stockCost"), dinheiro(custo));
    conteudo += criarCardResumo(
      t("summary.salePotential"),
      dinheiro(potencial),
    );
    conteudo += criarCardResumo(
      t("summary.profitPotential"),
      dinheiro(potencial - custo),
    );
  }

  if (modelo.resumo === "vendas") {
    let vendas = 0;
    let comissoes = 0;

    planilhaAtual.linhas.forEach((linha) => {
      vendas += numero(valorCalculo(planilhaAtual, linha, "total_venda"));
      comissoes += numero(valorCalculo(planilhaAtual, linha, "comissao"));
    });

    conteudo += criarCardResumo(t("summary.sold"), dinheiro(vendas));
    conteudo += criarCardResumo(t("summary.commissions"), dinheiro(comissoes));
  }

  if (modelo.resumo === "notas") {
    const medias = planilhaAtual.linhas
      .map((linha) => calcularMediaNotas(planilhaAtual, linha))
      .filter((valor) => temValor(valor));

    const mediaTurma =
      medias.length > 0
        ? arredondar(
            medias.reduce((soma, valor) => soma + numero(valor), 0) /
              medias.length,
          )
        : 0;

    const aprovados = medias.filter((media) => numero(media) >= 6).length;
    const reprovados = medias.filter((media) => numero(media) < 6).length;

    conteudo += criarCardResumo(t("summary.classAverage"), mediaTurma);
    conteudo += criarCardResumo(t("summary.approved"), aprovados);
    conteudo += criarCardResumo(t("summary.failed"), reprovados);
  }

  if (modelo.resumo === "frequencia") {
    const frequencias = planilhaAtual.linhas
      .map((linha) =>
        calcularCampo(planilhaAtual, linha, {
          calculo: "frequencia_percentual",
        }),
      )
      .filter((valor) => temValor(valor));

    const media =
      frequencias.length > 0
        ? arredondar(
            frequencias.reduce((soma, valor) => soma + numero(valor), 0) /
              frequencias.length,
          )
        : 0;

    const atencao = frequencias.filter((valor) => numero(valor) < 75).length;

    conteudo += criarCardResumo(t("summary.attendanceAverage"), `${media}%`);
    conteudo += criarCardResumo(t("summary.attention"), atencao);
  }

  if (modelo.resumo === "estudos") {
    let planejadas = 0;
    let estudadas = 0;

    planilhaAtual.linhas.forEach((linha) => {
      planejadas += numero(
        valorPorPapel(planilhaAtual, linha, "horas_planejadas"),
      );
      estudadas += numero(
        valorPorPapel(planilhaAtual, linha, "horas_estudadas"),
      );
    });

    const progresso =
      planejadas > 0 ? arredondar((estudadas / planejadas) * 100) : 0;

    conteudo += criarCardResumo(t("summary.plannedHours"), planejadas);
    conteudo += criarCardResumo(t("summary.studiedHours"), estudadas);
    conteudo += criarCardResumo(t("summary.progress"), `${progresso}%`);
  }

  resumoModelo.innerHTML = conteudo;
  resumoModelo.classList.remove("escondido");
}

/* ================================================= */
/* LINHAS */
/* ================================================= */

function adicionarLinha() {
  if (!planilhaAtual) return;

  const novaLinha = {};
  planilhaAtual.colunas.forEach((campo) => (novaLinha[campo.id] = ""));

  planilhaAtual.linhas.push(novaLinha);
  atualizarCalculosLinha(planilhaAtual, novaLinha);

  salvar();
  montarTabela();
}

async function excluirLinha(indice) {
  if (!planilhaAtual) return;
  if (!(await confirmarAcao(t("common.confirmDeleteRow")))) return;

  planilhaAtual.linhas.splice(indice, 1);
  salvar();
  montarTabela();
}

/* ================================================= */
/* NOVO CONFIGURADOR DE CAMPOS */
/* ================================================= */

function adicionarColuna() {
  if (!planilhaAtual || !modalCampo) return;

  document.getElementById("novoCampo").value = "";
  document.getElementById("tipoCampoNovo").value = "info";

  atualizarOpcoesCampo();
  atualizarPosicoesCampo();

  modalCampo.showModal();
}

/*
    preenche as funções disponíveis conforme:
    - modelo atual
    - tipo Informação ou Cálculo
*/
function atualizarOpcoesCampo() {
  if (!planilhaAtual) return;

  const tipo = document.getElementById("tipoCampoNovo")?.value || "info";
  const select = document.getElementById("funcaoCampoNovo");
  if (!select) return;

  select.innerHTML = "";

  const modelo = planilhaAtual.modelo || "vazio";

  if (tipo === "info") {
    const opcoes = papeisPorModelo[modelo] || papeisPorModelo.vazio;

    opcoes.forEach(([valor, chave]) => {
      const option = document.createElement("option");
      option.value = valor;
      option.textContent = t(chave);
      select.appendChild(option);
    });
  } else {
    const especificos = calculosPorModelo[modelo] || [];

    const genericos = [
      ["soma_linha", "field.sum"],
      ["media_linha", "field.average"],
      ["produto_linha", "field.product"],
    ];

    [...especificos, ...genericos].forEach(([valor, chave]) => {
      const option = document.createElement("option");
      option.value = valor;
      option.textContent = t(chave);
      select.appendChild(option);
    });
  }
}

/*
    deixa o usuário escolher a posição exata da nova coluna.
*/
function atualizarPosicoesCampo() {
  if (!planilhaAtual) return;

  const select = document.getElementById("posicaoCampoNovo");
  if (!select) return;

  select.innerHTML = "";

  const colunas = planilhaAtual.colunas;

  const inicio = document.createElement("option");
  inicio.value = "0";
  inicio.textContent = t("field.positionStart");
  select.appendChild(inicio);

  for (let indice = 1; indice < colunas.length; indice++) {
    const option = document.createElement("option");
    option.value = String(indice);
    option.textContent = `${t("field.positionBetween")} ${colunas[indice - 1].nome} / ${colunas[indice].nome}`;
    select.appendChild(option);
  }

  const fim = document.createElement("option");
  fim.value = String(colunas.length);
  fim.textContent = t("field.positionEnd");
  select.appendChild(fim);

  select.value = String(colunas.length);
}

async function salvarNovaColuna(event) {
  event.preventDefault();
  if (!planilhaAtual) return;

  const nome = document.getElementById("novoCampo").value.trim();
  const tipo = document.getElementById("tipoCampoNovo").value;
  const funcao = document.getElementById("funcaoCampoNovo").value;
  const posicao = Number(document.getElementById("posicaoCampoNovo").value);

  if (!nome) return;

  /*
        evita duplicar papéis únicos.
        nota e informação comum podem repetir.
    */
  if (
    tipo === "info" &&
    !papeisRepetiveis.has(funcao) &&
    planilhaAtual.colunas.some(
      (campo) => campo.tipo === "info" && campo.papel === funcao,
    )
  ) {
    await mostrarAviso(t("field.repeatedRole"));
    return;
  }

  const novoCampo = {
    id: criarIdCampo(),
    nome,
    tipo,
    papel: tipo === "info" ? funcao : "geral",
    calculo: tipo === "calculo" ? funcao : null,
  };

  /* insere na posição escolhida */
  planilhaAtual.colunas.splice(posicao, 0, novoCampo);

  /* adiciona a nova célula às linhas existentes */
  planilhaAtual.linhas.forEach((linha) => {
    linha[novoCampo.id] = "";
  });

  /* recalcula tudo usando as funções dos campos */
  atualizarTodosCalculos();

  salvar();
  modalCampo.close();
  montarTabela();
}

/*
    renomear um campo não muda sua função.

    então "Nota 4" pode virar "Trabalho Final"
    e continuar participando da média.
*/
async function renomearColuna(campoId) {
  if (!planilhaAtual) return;

  const campo = planilhaAtual.colunas.find((item) => item.id === campoId);
  if (!campo || campo.tipo === "calculo") return;

  const novo = await pedirTexto(t("editor.newName"), campo.nome);
  if (!novo || !novo.trim()) return;

  campo.nome = novo.trim();
  salvar();
  montarTabela();
}

/* ================================================= */
/* NOME E EXCLUSÃO DA PLANILHA */
/* ================================================= */

function alterarNomePlanilha() {
  if (!planilhaAtual) return;

  const input = document.getElementById("nomePlanilhaEditor");
  planilhaAtual.nome = input.value.trim() || "Sem título";
  input.value = planilhaAtual.nome;
  salvar();
}

async function excluirPlanilha(event, id) {
  event.stopPropagation();

  if (!(await confirmarAcao(t("common.confirmDeleteSheet")))) return;

  planilhas = planilhas.filter((planilha) => planilha.id !== id);
  salvar();
  carregarDashboard();
}

/* ================================================= */
/* PERSONALIZAÇÃO DA PLANILHA */
/* ================================================= */

function carregarPersonalizacao() {
  if (!planilhaAtual) return;

  const p = planilhaAtual.personalizacao || personalizacaoPadrao();

  document.getElementById("corCabecalho").value = p.corCabecalho;
  document.getElementById("corTextoCabecalho").value = p.corTextoCabecalho;
  document.getElementById("corTexto").value = p.corTexto;
  document.getElementById("corCelulas").value = p.corCelulas;
  document.getElementById("corBorda").value = p.corBorda;
  document.getElementById("estiloPlanilha").value = p.estilo;
  document.getElementById("tamanhoFonte").value = p.tamanhoFonte;
  document.getElementById("alinhamento").value = p.alinhamento;
}

function alterarPersonalizacao() {
  if (!planilhaAtual) return;

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

function aplicarPersonalizacao() {
  if (!planilhaAtual || !cabecalhoTabela || !corpoTabela) return;

  const p = planilhaAtual.personalizacao || personalizacaoPadrao();

  cabecalhoTabela.querySelectorAll("th").forEach((th) => {
    th.style.backgroundColor = p.corCabecalho;
    th.style.color = p.corTextoCabecalho;
    th.style.fontSize = `${p.tamanhoFonte}px`;
    th.style.textAlign = p.alinhamento;
    th.style.borderColor = p.corBorda;
  });

  corpoTabela.querySelectorAll("td").forEach((td) => {
    td.style.backgroundColor = p.corCelulas;
    td.style.borderColor = p.corBorda;
  });

  corpoTabela.querySelectorAll("input").forEach((input) => {
    input.style.color = p.corTexto;

    if (!input.classList.contains("campo-calculado")) {
      input.style.backgroundColor = p.corCelulas;
    }

    input.style.fontSize = `${p.tamanhoFonte}px`;
    input.style.textAlign = p.alinhamento;
  });

  tabelaPlanilha.classList.remove("modo-grade", "modo-tabela");
  tabelaPlanilha.classList.add(
    p.estilo === "tabela" ? "modo-tabela" : "modo-grade",
  );
}

async function restaurarPersonalizacao() {
  if (!planilhaAtual) return;
  if (!(await confirmarAcao(t("personalization.restoreConfirm")))) return;

  planilhaAtual.personalizacao = personalizacaoPadrao();
  salvar();
  carregarPersonalizacao();
  aplicarPersonalizacao();
}

/* ================================================= */
/* EXPORTAÇÃO */
/* ================================================= */

async function exportarPlanilha() {
  if (!planilhaAtual) return;

  if (typeof XLSX === "undefined") {
    await mostrarAviso(t("export.libraryError"));
    return;
  }

  atualizarTodosCalculos();
  salvar();

  if (planilhaAtual.tipo === "excel") {
    exportarExcel();
  } else if (planilhaAtual.tipo === "google") {
    exportarGoogleSheets();
  }
}

function obterDadosPlanilha() {
  const cabecalho = planilhaAtual.colunas.map((campo) => campo.nome);

  const linhas = planilhaAtual.linhas.map((linha) => {
    return planilhaAtual.colunas.map((campo) => linha[campo.id] ?? "");
  });

  return [cabecalho, ...linhas];
}

function limparNomeArquivo(nome) {
  return nome.replace(/[<>:"/\\|?*]/g, "").trim() || "planilha";
}

function corExcel(cor) {
  return (cor || "#000000").replace("#", "").toUpperCase();
}

function criarBorda(cor) {
  return {
    top: { style: "thin", color: { rgb: cor } },
    bottom: { style: "thin", color: { rgb: cor } },
    left: { style: "thin", color: { rgb: cor } },
    right: { style: "thin", color: { rgb: cor } },
  };
}

/*
    descobre a letra da coluna no Excel pelo ID.
    se o campo mudar de posição, a fórmula também muda.
*/
function colunaExcelCampo(planilha, campoId) {
  const indice = planilha.colunas.findIndex((campo) => campo.id === campoId);
  return indice < 0 ? null : XLSX.utils.encode_col(indice);
}

function colunaExcelPapel(planilha, papel) {
  const campo = campoPorPapel(planilha, papel);
  return campo ? colunaExcelCampo(planilha, campo.id) : null;
}

function referenciasExcelPapel(planilha, papel, linhaExcel) {
  return camposPorPapel(planilha, papel).map((campo) => {
    return `${colunaExcelCampo(planilha, campo.id)}${linhaExcel}`;
  });
}

/*
    fórmulas exportadas também são dinâmicas.
    isso mantém a lógica funcionando depois de baixar o arquivo.
*/
function formulaExcelCampo(planilha, campo, linhaExcel) {
  const calc = campo.calculo;

  if (calc === "media_notas" || calc === "situacao_notas") {
    const notas = referenciasExcelPapel(planilha, "nota", linhaExcel);
    if (notas.length === 0) return null;

    const lista = notas.join(",");

    if (calc === "media_notas") {
      return `IF(COUNTA(${lista})=${notas.length},AVERAGE(${lista}),"")`;
    }

    return `IF(COUNTA(${lista})=${notas.length},IF(AVERAGE(${lista})>=6,"Aprovado","Reprovado"),"")`;
  }

  const qtd = colunaExcelPapel(planilha, "quantidade");
  const valorUnit = colunaExcelPapel(planilha, "valor_unitario");
  const custo = colunaExcelPapel(planilha, "custo_unitario");
  const precoVenda = colunaExcelPapel(planilha, "preco_venda");
  const comissaoPercentual = colunaExcelPapel(planilha, "comissao_percentual");
  const totalAulas = colunaExcelPapel(planilha, "total_aulas");
  const faltas = colunaExcelPapel(planilha, "faltas");
  const horasPlanejadas = colunaExcelPapel(planilha, "horas_planejadas");
  const horasEstudadas = colunaExcelPapel(planilha, "horas_estudadas");

  if (calc === "total_orcamento" && qtd && valorUnit) {
    return `IF(OR(${qtd}${linhaExcel}="",${valorUnit}${linhaExcel}=""),"",${qtd}${linhaExcel}*${valorUnit}${linhaExcel})`;
  }

  if (calc === "valor_estoque" && qtd && custo) {
    return `IF(OR(${qtd}${linhaExcel}="",${custo}${linhaExcel}=""),"",${qtd}${linhaExcel}*${custo}${linhaExcel})`;
  }

  if (calc === "lucro_unitario" && custo && precoVenda) {
    return `IF(OR(${custo}${linhaExcel}="",${precoVenda}${linhaExcel}=""),"",${precoVenda}${linhaExcel}-${custo}${linhaExcel})`;
  }

  if (calc === "potencial_venda" && qtd && precoVenda) {
    return `IF(OR(${qtd}${linhaExcel}="",${precoVenda}${linhaExcel}=""),"",${qtd}${linhaExcel}*${precoVenda}${linhaExcel})`;
  }

  if (calc === "total_venda" && qtd && valorUnit) {
    return `IF(OR(${qtd}${linhaExcel}="",${valorUnit}${linhaExcel}=""),"",${qtd}${linhaExcel}*${valorUnit}${linhaExcel})`;
  }

  if (calc === "comissao" && qtd && valorUnit && comissaoPercentual) {
    return `IF(OR(${qtd}${linhaExcel}="",${valorUnit}${linhaExcel}="",${comissaoPercentual}${linhaExcel}=""),"",(${qtd}${linhaExcel}*${valorUnit}${linhaExcel})*(${comissaoPercentual}${linhaExcel}/100))`;
  }

  if (calc === "presencas" && totalAulas && faltas) {
    return `IF(OR(${totalAulas}${linhaExcel}="",${faltas}${linhaExcel}=""),"",MAX(${totalAulas}${linhaExcel}-${faltas}${linhaExcel},0))`;
  }

  if (
    (calc === "frequencia_percentual" || calc === "situacao_frequencia") &&
    totalAulas &&
    faltas
  ) {
    const freq = `(MAX(${totalAulas}${linhaExcel}-${faltas}${linhaExcel},0)/${totalAulas}${linhaExcel}*100)`;

    if (calc === "frequencia_percentual") {
      return `IF(${totalAulas}${linhaExcel}>0,${freq},"")`;
    }

    return `IF(${totalAulas}${linhaExcel}>0,IF(${freq}>=75,"Regular","Atenção"),"")`;
  }

  if (calc === "progresso_estudos" && horasPlanejadas && horasEstudadas) {
    return `IF(${horasPlanejadas}${linhaExcel}>0,${horasEstudadas}${linhaExcel}/${horasPlanejadas}${linhaExcel}*100,"")`;
  }

  const referenciasInfo = planilha.colunas
    .filter((outro) => outro.tipo === "info")
    .map((outro) => `${colunaExcelCampo(planilha, outro.id)}${linhaExcel}`);

  if (referenciasInfo.length === 0) return null;

  const listaInfo = referenciasInfo.join(",");

  if (calc === "soma_linha") return `SUM(${listaInfo})`;
  if (calc === "media_linha")
    return `IF(COUNT(${listaInfo})>0,AVERAGE(${listaInfo}),"")`;
  if (calc === "produto_linha")
    return `IF(COUNT(${listaInfo})>0,PRODUCT(${listaInfo}),"")`;

  return null;
}

function criarWorksheet() {
  atualizarTodosCalculos();

  const dados = obterDadosPlanilha();
  const worksheet = XLSX.utils.aoa_to_sheet(dados);
  const p = planilhaAtual.personalizacao || personalizacaoPadrao();

  const corCabecalho = corExcel(p.corCabecalho);
  const corTextoCabecalho = corExcel(p.corTextoCabecalho);
  const corTexto = corExcel(p.corTexto);
  const corCelulas = corExcel(p.corCelulas);
  const corBorda = corExcel(p.corBorda);

  const quantidadeLinhas = planilhaAtual.linhas.length + 1;
  const quantidadeColunas = planilhaAtual.colunas.length;

  for (let linha = 0; linha < quantidadeLinhas; linha++) {
    for (let coluna = 0; coluna < quantidadeColunas; coluna++) {
      const endereco = XLSX.utils.encode_cell({ r: linha, c: coluna });
      let celula = worksheet[endereco];

      if (!celula) {
        celula = { v: "", t: "s" };
        worksheet[endereco] = celula;
      }

      if (linha > 0) {
        const campo = planilhaAtual.colunas[coluna];

        if (campo.tipo === "calculo") {
          const formula = formulaExcelCampo(planilhaAtual, campo, linha + 1);
          if (formula) celula.f = formula;
        }
      }

      if (linha === 0) {
        celula.s = {
          fill: { patternType: "solid", fgColor: { rgb: corCabecalho } },
          font: {
            name: "Arial",
            bold: true,
            sz: Number(p.tamanhoFonte),
            color: { rgb: corTextoCabecalho },
          },
          alignment: {
            horizontal: p.alinhamento,
            vertical: "center",
            wrapText: true,
          },
          border: criarBorda(corBorda),
        };
      } else {
        celula.s = {
          fill: { patternType: "solid", fgColor: { rgb: corCelulas } },
          font: {
            name: "Arial",
            sz: Number(p.tamanhoFonte),
            color: { rgb: corTexto },
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

  worksheet["!cols"] = planilhaAtual.colunas.map((campo) => {
    let maior = String(campo.nome).length;

    planilhaAtual.linhas.forEach((linha) => {
      const valor = String(linha[campo.id] ?? "");
      if (valor.length > maior) maior = valor.length;
    });

    return { wch: Math.min(maior + 4, 50) };
  });

  worksheet["!rows"] = new Array(quantidadeLinhas)
    .fill(null)
    .map((valor, indice) => ({ hpt: indice === 0 ? 28 : 22 }));

  return worksheet;
}

function baixarArquivoExcel() {
  const worksheet = criarWorksheet();
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");

  XLSX.writeFile(workbook, `${limparNomeArquivo(planilhaAtual.nome)}.xlsx`, {
    bookType: "xlsx",
    type: "binary",
    cellStyles: true,
    compression: true,
  });
}

function exportarExcel() {
  baixarArquivoExcel();
}

async function exportarGoogleSheets() {
  baixarArquivoExcel();

  /* espera um pouco para o download começar */
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (await confirmarAcao(t("export.googleMessage"))) {
    window.open("https://sheets.google.com/", "_blank");
  }
}

function nomeTipo(tipo) {
  if (tipo === "excel") return "Microsoft Excel";
  if (tipo === "google") return "Google Sheets";
  return "Planilha";
}

/* ================================================= */
/* INICIALIZAÇÃO */
/* ================================================= */

/*
    1. aplica tema, fonte e idioma
    2. converte planilhas antigas
    3. carrega o dashboard
    4. verifica se a URL pediu criação/configurações
*/
aplicarConfiguracoes();
migrarPlanilhas();
carregarDashboard();

const parametros = new URLSearchParams(window.location.search);

if (parametros.get("nova") === "1" && modalCriacao) {
  abrirCriacao();
}

if (parametros.get("config") === "1" && configuracoesTela) {
  mostrarConfiguracoes();
}
