/*
=============================================================
NEXAGRID - SCRIPT.JS COMENTADO
=============================================================

Este é o arquivo responsável pela LÓGICA do sistema.

PRINCIPAIS RESPONSABILIDADES:
- notificações internas;
- tradução da interface;
- tema claro/escuro e tamanho da fonte;
- localStorage;
- criação e edição das planilhas;
- modelos prontos;
- tipos e validações de campos;
- cálculos automáticos;
- busca, filtro e ordenação;
- desfazer/refazer;
- gráficos;
- importação e exportação;
- backup em JSON;
- menus personalizados;
- painel rápido ao lado da tabela.

IMPORTANTE SOBRE A ESTRUTURA DE DADOS:
Cada coluna possui um ID próprio. Os cálculos não dependem mais da
posição da coluna. Eles procuram a FUNÇÃO do campo.

Exemplo:
    { nome: "Nota 4", papel: "nota" }

Mesmo que "Nota 4" seja movida para outra posição, ela continua
participando da média porque seu papel continua sendo "nota".

OBSERVAÇÃO SOBRE A EVOLUÇÃO DO PROJETO:
O arquivo recebeu melhorias em etapas. Em alguns pontos uma função
aparece novamente mais abaixo com uma versão mais completa. Em
JavaScript, a última declaração com o mesmo nome é a que fica ativa.
Isso foi mantido nesta cópia para não alterar o funcionamento da v8.
=============================================================
*/

/* ================================================= */
/* NEXAGRID - JAVASCRIPT PRINCIPAL */
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
    "editor.autoField": "Calculado automaticamente pelo NexaGrid.",
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
    "settings.subtitle": "Ajuste a aparência e o idioma do NexaGrid.",
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
    "settings.restoreConfirm": "Deseja restaurar as configurações do NexaGrid?",

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
      "Campos de informação guardam dados. Campos de cálculo são preenchidos automaticamente. A função informa ao NexaGrid como aquele campo participa dos cálculos.",
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
    "about.title": "Sobre o NexaGrid",
    "about.subtitle": "Uma forma simples de criar e organizar planilhas.",
    "about.bannerTitle": "Planilhas não precisam ser complicadas.",
    "about.bannerText":
      "O NexaGrid foi criado para tornar a criação de planilhas mais simples, rápida e acessível.",
    "about.creatorTitle": "Quem criou?",
    "about.creatorText":
      "O NexaGrid foi criado por Gabriel como um projeto para facilitar a criação e organização de planilhas.",
    "about.goalTitle": "Qual é o objetivo?",
    "about.goalText":
      "Permitir que qualquer pessoa consiga criar planilhas de forma simples, inclusive utilizando modelos com cálculos automáticos.",
    "about.howTitle": "Como funciona?",
    "about.howText":
      "O usuário pode criar do zero ou escolher um modelo, preencher os dados, personalizar a aparência e exportar o resultado.",
    "about.ideaEyebrow": "Ideia do projeto",
    "about.ideaTitle": "Facilitar o dia a dia",
    "about.ideaText1":
      "O NexaGrid busca facilitar a criação de planilhas usando uma interface clara e fácil de entender.",
    "about.ideaText2":
      "Os modelos continuam calculando corretamente mesmo quando novos campos são inseridos em posições diferentes.",
    "about.ideaText3":
      "O sistema também permite ajustar tema, tamanho da fonte e idioma conforme a preferência do usuário.",
    "about.resourcesTitle": "Principais recursos",
    "about.resourcesText": "O que o NexaGrid consegue fazer atualmente.",
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
    "editor.autoField": "Calculated automatically by NexaGrid.",
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
    "settings.subtitle": "Adjust NexaGrid appearance and language.",
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
    "settings.restoreConfirm": "Restore NexaGrid settings?",

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
      "Information fields store data. Calculation fields are filled automatically. The function tells NexaGrid how that field participates in calculations.",
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
    "about.title": "About NexaGrid",
    "about.subtitle": "A simple way to create and organize spreadsheets.",
    "about.bannerTitle": "Spreadsheets do not have to be complicated.",
    "about.bannerText":
      "NexaGrid was created to make spreadsheet creation simpler, faster and more accessible.",
    "about.creatorTitle": "Who created it?",
    "about.creatorText":
      "NexaGrid was created by Gabriel as a project to simplify spreadsheet creation and organization.",
    "about.goalTitle": "What is the goal?",
    "about.goalText":
      "Allow anyone to create spreadsheets easily, including templates with automatic calculations.",
    "about.howTitle": "How does it work?",
    "about.howText":
      "Users can start from scratch or choose a template, fill in data, customize the look and export the result.",
    "about.ideaEyebrow": "Project idea",
    "about.ideaTitle": "Make everyday work easier",
    "about.ideaText1":
      "NexaGrid aims to simplify spreadsheet creation with a clear and easy-to-understand interface.",
    "about.ideaText2":
      "Templates keep calculating correctly even when new fields are inserted in different positions.",
    "about.ideaText3":
      "The system also lets users adjust theme, font size and language.",
    "about.resourcesTitle": "Main features",
    "about.resourcesText": "What NexaGrid can currently do.",
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

    agora todas as mensagens usam um modal do NexaGrid,
    inclusive no tema escuro.
*/
let resolverNotificacao = null;
let tipoNotificacaoAtual = "aviso";

/* fecha o modal e entrega a resposta para quem chamou */
/*
    FUNÇÃO: concluirNotificacao()
    Finaliza a notificação interna e devolve o resultado para quem abriu o modal.
*/
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
/*
    FUNÇÃO: abrirNotificacao()
    Abre a janela de notificação do próprio NexaGrid, substituindo alert/confirm/prompt do navegador.
*/
function abrirNotificacao({
  titulo = "NexaGrid",
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
/*
    FUNÇÃO: mostrarAviso()
    Mostra uma mensagem informativa dentro do site e aguarda o usuário fechar.
*/
async function mostrarAviso(mensagem, titulo = t("notification.notice")) {
  await abrirNotificacao({
    titulo,
    mensagem,
    tipo: "aviso",
  });
}

/* substitui confirm() */
/*
    FUNÇÃO: confirmarAcao()
    Mostra uma confirmação personalizada e retorna true quando o usuário confirma.
*/
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
/*
    FUNÇÃO: pedirTexto()
    Abre uma caixa personalizada para o usuário digitar ou editar um texto.
*/
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
/*
    FUNÇÃO: confirmarNotificacao()
    Confirma a notificação aberta atualmente.
*/
function confirmarNotificacao() {
  if (tipoNotificacaoAtual === "texto") {
    const input = document.getElementById("inputNotificacao");
    concluirNotificacao(input.value);
    return;
  }

  concluirNotificacao(true);
}

/* botão cancelar do modal */
/*
    FUNÇÃO: cancelarNotificacao()
    Cancela/fecha a notificação aberta atualmente.
*/
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

const CHAVE_CONFIGURACOES = "nexagrid_configuracoes";
const CHAVE_CONFIGURACOES_ANTIGA = "aerogrid_configuracoes";

/*
    tenta carregar primeiro a nova chave.
    se o usuário já usava o AeroGrid, aproveita as preferências antigas.
*/
const configuracoesSalvas = (() => {
  try {
    return (
      JSON.parse(
        localStorage.getItem(CHAVE_CONFIGURACOES) ||
          localStorage.getItem(CHAVE_CONFIGURACOES_ANTIGA) ||
          "{}",
      ) || {}
    );
  } catch (erro) {
    console.warn("Não foi possível ler as configurações salvas.", erro);
    return {};
  }
})();

let configuracoes = {
  ...configuracoesPadrao,
  ...configuracoesSalvas,
};

/* salva na nova chave para concluir a migração do nome */
localStorage.setItem(CHAVE_CONFIGURACOES, JSON.stringify(configuracoes));

/*
    FUNÇÃO: t()
    Retorna o texto traduzido correspondente à chave recebida, usando o idioma atual.
*/
function t(chave) {
  return (
    traducoes[configuracoes.idioma]?.[chave] ??
    traducoes["pt-BR"]?.[chave] ??
    chave
  );
}

/*
    FUNÇÃO: aplicarTraducao()
    Procura elementos com data-i18n e atualiza os textos da interface para o idioma selecionado.
*/
function aplicarTraducao() {
  document.querySelectorAll("[data-i18n]").forEach((elemento) => {
    elemento.textContent = t(elemento.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((elemento) => {
    elemento.placeholder = t(elemento.dataset.i18nPlaceholder);
  });

  document.documentElement.lang = configuracoes.idioma;
}

/*
    FUNÇÃO: aplicarConfiguracoes()
    Aplica no documento o tema, tamanho da fonte, idioma e demais preferências salvas.
*/
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
  sincronizarMenusConfiguracoes();
}

/* ================================================= */
/* MENUS PERSONALIZADOS DA PÁGINA DE CONFIGURAÇÕES */
/* ================================================= */

/*
    o <select> tradicional abre uma lista desenhada pelo navegador/sistema.
    por isso ela podia ficar azul forte e destoar do tema.

    os menus abaixo são feitos inteiramente com HTML + CSS do NexaGrid.
*/
/*
    FUNÇÃO: fecharMenusConfiguracoes()
    Fecha os menus personalizados que estiverem abertos.
*/
function fecharMenusConfiguracoes(excecao = null) {
  document.querySelectorAll(".select-personalizado.aberto").forEach((menu) => {
    if (menu === excecao) return;

    menu.classList.remove("aberto");

    const botao = menu.querySelector(".select-personalizado-botao");
    if (botao) botao.setAttribute("aria-expanded", "false");
  });
}

/*
    FUNÇÃO: alternarMenuConfiguracao()
    Abre ou fecha um menu personalizado da página de configurações.
*/
function alternarMenuConfiguracao(botao) {
  const menu = botao.closest(".select-personalizado");
  if (!menu) return;

  const estavaAberto = menu.classList.contains("aberto");

  fecharMenusConfiguracoes(menu);
  menu.classList.toggle("aberto", !estavaAberto);
  botao.setAttribute("aria-expanded", String(!estavaAberto));
}

/*
    FUNÇÃO: selecionarOpcaoConfiguracao()
    Grava o valor escolhido em um menu personalizado e atualiza as configurações.
*/
function selecionarOpcaoConfiguracao(botao, inputId) {
  const input = document.getElementById(inputId);
  const menu = botao.closest(".select-personalizado");

  if (!input || !menu) return;

  input.value = botao.dataset.value;
  menu.classList.remove("aberto");

  const gatilho = menu.querySelector(".select-personalizado-botao");
  if (gatilho) gatilho.setAttribute("aria-expanded", "false");

  alterarConfiguracoes();
}

/*
    atualiza o texto mostrado no botão e destaca a opção atual.
    também é chamada depois de trocar o idioma.
*/
/*
    FUNÇÃO: sincronizarMenusConfiguracoes()
    Atualiza o texto e o destaque visual dos menus personalizados conforme o valor atual.
*/
function sincronizarMenusConfiguracoes() {
  document.querySelectorAll(".select-personalizado").forEach((menu) => {
    const inputId = menu.dataset.input;
    const input = document.getElementById(inputId);

    if (!input) return;

    const opcoes = menu.querySelectorAll(".select-personalizado-menu button");
    let opcaoAtual = null;

    opcoes.forEach((opcao) => {
      const ativa = opcao.dataset.value === input.value;
      opcao.classList.toggle("ativo", ativa);

      if (ativa) opcaoAtual = opcao;
    });

    const texto = menu.querySelector(".select-personalizado-valor");

    if (texto && opcaoAtual) {
      texto.textContent = opcaoAtual.textContent.trim();
    }
  });
}

/* clicar fora fecha qualquer menu aberto */
document.addEventListener("click", (event) => {
  if (!event.target.closest(".select-personalizado")) {
    fecharMenusConfiguracoes();
  }
});

/* ESC também fecha o menu */
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    fecharMenusConfiguracoes();
  }
});

/*
    FUNÇÃO: alterarConfiguracoes()
    Lê as opções escolhidas na página de configurações, salva no localStorage e reaplica a interface.
*/
function alterarConfiguracoes() {
  const tema = document.getElementById("configTema");
  const fonte = document.getElementById("configFonte");
  const idioma = document.getElementById("configIdioma");

  if (tema) configuracoes.tema = tema.value;
  if (fonte) configuracoes.fonte = fonte.value;
  if (idioma) configuracoes.idioma = idioma.value;

  localStorage.setItem(CHAVE_CONFIGURACOES, JSON.stringify(configuracoes));

  aplicarConfiguracoes();
  carregarDashboard();
  renderizarModelos();

  if (planilhaAtual) {
    atualizarCabecalhoEditor();
    montarTabela();
  }
}

/*
    FUNÇÃO: restaurarConfiguracoes()
    Volta as preferências gerais do NexaGrid para os valores padrão.
*/
async function restaurarConfiguracoes() {
  if (!(await confirmarAcao(t("settings.restoreConfirm")))) return;

  configuracoes = { ...configuracoesPadrao };
  localStorage.setItem(CHAVE_CONFIGURACOES, JSON.stringify(configuracoes));

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

let planilhas = (() => {
  try {
    return JSON.parse(localStorage.getItem("planilhas")) || [];
  } catch (erro) {
    console.warn("Não foi possível ler as planilhas salvas.", erro);
    return [];
  }
})();
let planilhaAtual = null;
let contadorCampos = 0;

/*
    FUNÇÃO: criarIdCampo()
    Gera um identificador único para cada campo. O ID permite mover colunas sem perder os dados.
*/
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

/*
    FUNÇÃO: personalizacaoPadrao()
    Retorna as cores, fonte, alinhamento e estilo usados em uma planilha nova.
*/
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

/*
    FUNÇÃO: salvar()
    Salva o estado atual das planilhas/configurações no localStorage do navegador.
*/
function salvar() {
  localStorage.setItem("planilhas", JSON.stringify(planilhas));
}

/*
    FUNÇÃO: temValor()
    Verifica se um valor realmente foi preenchido, diferenciando vazio de zero.
*/
function temValor(valor) {
  return valor !== "" && valor !== null && valor !== undefined;
}

/*
    FUNÇÃO: numero()
    Converte textos como 10,50 ou R$ 10,50 para um número utilizável nos cálculos.
*/
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

/*
    FUNÇÃO: numeroOuNull()
    Converte para número somente quando o conteúdo é realmente numérico; caso contrário retorna null.
*/
function numeroOuNull(valor) {
  if (!temValor(valor)) return null;

  const texto = String(valor).trim();
  if (!/[0-9]/.test(texto)) return null;

  const resultado = numero(valor);
  return Number.isFinite(resultado) ? resultado : null;
}

/*
    FUNÇÃO: arredondar()
    Arredonda um resultado numérico para duas casas decimais.
*/
function arredondar(valor) {
  return Number(Number(valor).toFixed(2));
}

/*
    FUNÇÃO: dinheiro()
    Formata um número como valor monetário em real (BRL).
*/
function dinheiro(valor) {
  const locale = configuracoes.idioma === "en" ? "en-US" : "pt-BR";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BRL",
  }).format(numero(valor));
}

/*
    FUNÇÃO: normalizarTexto()
    Transforma o texto em minúsculas e remove acentos para facilitar comparações.
*/
function normalizarTexto(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/*
    FUNÇÃO: obterModelo()
    Retorna a configuração de um modelo pronto usando seu identificador.
*/
function obterModelo(id) {
  return modelosPlanilha[id] || null;
}

/*
    FUNÇÃO: nomeModelo()
    Retorna o nome traduzido e amigável de um modelo.
*/
function nomeModelo(id) {
  const modelo = obterModelo(id);
  return modelo ? t(modelo.nomeKey) : t("create.blank");
}

/*
    FUNÇÃO: camposPorPapel()
    Retorna todos os campos que possuem uma função específica, por exemplo todos os campos marcados como nota.
*/
function camposPorPapel(planilha, papel) {
  return (planilha.colunas || []).filter((campo) => {
    return campo.tipo === "info" && campo.papel === papel;
  });
}

/*
    FUNÇÃO: campoPorPapel()
    Retorna o primeiro campo que possui uma determinada função.
*/
function campoPorPapel(planilha, papel) {
  return camposPorPapel(planilha, papel)[0] || null;
}

/*
    FUNÇÃO: valorPorPapel()
    Busca, em uma linha, o valor pertencente a uma função específica do modelo.
*/
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
/*
    FUNÇÃO: migrarPlanilhas()
    Converte planilhas criadas em versões antigas para a estrutura atual sem apagar os dados.
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
/*
    FUNÇÃO: inferirCampoLegado()
    Tenta descobrir automaticamente a função de uma coluna antiga analisando seu nome.
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

/*
    FUNÇÃO: esconderTelasPrincipais()
    Esconde as áreas principais antes de mostrar a tela solicitada.
*/
function esconderTelasPrincipais() {
  if (dashboard) dashboard.classList.add("escondido");
  if (editor) editor.classList.add("escondido");
  if (configuracoesTela) configuracoesTela.classList.add("escondido");
}

/*
    FUNÇÃO: mostrarDashboard()
    Volta para o dashboard e atualiza a lista de planilhas.
*/
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

/*
    FUNÇÃO: mostrarConfiguracoes()
    Abre a página/área de configurações quando disponível.
*/
function mostrarConfiguracoes() {
  /*
      as configurações agora possuem uma página própria.
      mantemos esta função para compatibilidade com código antigo.
  */
  if (!configuracoesTela) {
    window.location.href = "configuracoes.html";
    return;
  }

  aplicarConfiguracoes();
}

/* ================================================= */
/* DASHBOARD */
/* ================================================= */

/*
    FUNÇÃO: carregarDashboard()
    Calcula as estatísticas, aplica busca/ordenação e cria os cards das planilhas salvas.
*/
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

/*
    FUNÇÃO: abrirCriacao()
    Prepara e abre o modal usado para criar uma nova planilha.
*/
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

/*
    FUNÇÃO: fecharCriacao()
    Fecha o modal de criação de planilha.
*/
function fecharCriacao() {
  if (modalCriacao) modalCriacao.close();
}

/*
    FUNÇÃO: renderizarModelos()
    Cria na tela os cards dos modelos de planilha disponíveis.
*/
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

/*
    FUNÇÃO: filtrarModelos()
    Filtra a galeria de modelos entre Todos, Negócios e Educação.
*/
function filtrarModelos(filtro, botao) {
  filtroModelosAtual = filtro;

  document.querySelectorAll(".filtro-modelo").forEach((item) => {
    item.classList.remove("ativo");
  });

  if (botao) botao.classList.add("ativo");
  renderizarModelos();
}

/*
    FUNÇÃO: selecionarModelo()
    Marca o modelo escolhido e mostra suas informações e campos automáticos.
*/
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

/*
    FUNÇÃO: adicionarCampoCriacao()
    Adiciona mais um campo manual ao formulário de uma planilha em branco.
*/
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

/*
    FUNÇÃO: criarCampoModelo()
    Transforma a definição de um campo do modelo em um campo real com ID único.
*/
function criarCampoModelo(campoModelo) {
  return {
    id: criarIdCampo(),
    nome: t(campoModelo.nomeKey),
    tipo: campoModelo.tipo,
    papel: campoModelo.papel || "geral",
    calculo: campoModelo.calculo || null,
  };
}

/*
    FUNÇÃO: criarPlanilha()
    Monta o objeto completo da nova planilha, salva e abre o editor.
*/
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
/*
    FUNÇÃO: calcularMediaNotas()
    Calcula a média usando todos os campos cuja função é nota, independentemente da posição.
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
/*
    FUNÇÃO: calcularCampo()
    Executa o cálculo automático correspondente à função configurada no campo.
*/
function calcularCampo(planilha, linha, campo) {
  const calculo = campo.calculo;

  if (calculo === "media_notas") {
    return calcularMediaNotas(planilha, linha);
  }

  if (calculo === "situacao_notas") {
    const media = calcularMediaNotas(planilha, linha);
    if (!temValor(media)) return "";
    return numero(media) >= Number(configuracoes.mediaAprovacao)
      ? t("status.approved")
      : t("status.failed");
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
    return numero(frequencia) >= Number(configuracoes.frequenciaMinima)
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

/*
    FUNÇÃO: atualizarCalculosLinha()
    Recalcula todos os campos automáticos de uma única linha.
*/
function atualizarCalculosLinha(planilha, linha) {
  planilha.colunas
    .filter((campo) => campo.tipo === "calculo")
    .forEach((campo) => {
      linha[campo.id] = calcularCampo(planilha, linha, campo);
    });
}

/*
    FUNÇÃO: atualizarTodosCalculos()
    Recalcula todas as linhas da planilha aberta.
*/
function atualizarTodosCalculos(planilha = planilhaAtual) {
  if (!planilha) return;
  (planilha.linhas || []).forEach((linha) => {
    atualizarCalculosLinha(planilha, linha);
  });
}

/* ================================================= */
/* ABRIR E MONTAR PLANILHA */
/* ================================================= */

/*
    FUNÇÃO: abrirPlanilha()
    Seleciona uma planilha pelo ID, prepara seus dados e abre o editor.
*/
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

/*
    FUNÇÃO: atualizarCabecalhoEditor()
    Atualiza nome do modelo, formato e demais informações exibidas no topo do editor.
*/
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

/*
    FUNÇÃO: montarTabela()
    Reconstrói cabeçalho, filtros, linhas e controles da tabela usando os dados atuais.
*/
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

/*
    FUNÇÃO: atualizarCelulasCalculadasDaLinha()
    Atualiza visualmente apenas as células automáticas da linha que acabou de ser modificada.
*/
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

/*
    FUNÇÃO: criarCardResumo()
    Gera o HTML de um card de resultado, como Saldo, Média ou Frequência.
*/
function criarCardResumo(titulo, valor) {
  return `
        <article class="card-resumo">
            <small>${titulo}</small>
            <strong>${valor}</strong>
        </article>
    `;
}

/*
    FUNÇÃO: valorCalculo()
    Obtém o resultado de um cálculo automático, mesmo quando a coluna correspondente não está visível.
*/
function valorCalculo(planilha, linha, calculo) {
  const campo = planilha.colunas.find((item) => {
    return item.tipo === "calculo" && item.calculo === calculo;
  });

  if (campo) return linha[campo.id];

  return calcularCampo(planilha, linha, { calculo });
}

/*
    FUNÇÃO: montarResumoModelo()
    Calcula e exibe os indicadores principais do modelo atual.
*/
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

    const aprovados = medias.filter(
      (media) => numero(media) >= Number(configuracoes.mediaAprovacao),
    ).length;
    const reprovados = medias.filter(
      (media) => numero(media) < Number(configuracoes.mediaAprovacao),
    ).length;

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

    const atencao = frequencias.filter(
      (valor) => numero(valor) < Number(configuracoes.frequenciaMinima),
    ).length;

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

/*
    FUNÇÃO: adicionarLinha()
    Adiciona um novo registro vazio à planilha e registra a ação no histórico.
*/
function adicionarLinha() {
  if (!planilhaAtual) return;

  const novaLinha = {};
  planilhaAtual.colunas.forEach((campo) => (novaLinha[campo.id] = ""));

  planilhaAtual.linhas.push(novaLinha);
  atualizarCalculosLinha(planilhaAtual, novaLinha);

  salvar();
  montarTabela();
}

/*
    FUNÇÃO: excluirLinha()
    Pede confirmação e remove um registro da planilha.
*/
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

/*
    FUNÇÃO: adicionarColuna()
    Abre o configurador completo para criar um novo campo.
*/
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
/*
    FUNÇÃO: atualizarOpcoesCampo()
    Atualiza as funções disponíveis no configurador conforme o modelo e o tipo do campo.
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
/*
    FUNÇÃO: atualizarPosicoesCampo()
    Monta as opções de posição para inserir ou mover um campo.
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

/*
    FUNÇÃO: salvarNovaColuna()
    Cria ou atualiza um campo com nome, tipo, função, validação e posição escolhidos.
*/
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
/*
    FUNÇÃO: renomearColuna()
    Mantém compatibilidade com o antigo duplo clique, encaminhando para o editor completo de campo.
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

/*
    FUNÇÃO: alterarNomePlanilha()
    Salva um novo nome digitado para a planilha atual.
*/
function alterarNomePlanilha() {
  if (!planilhaAtual) return;

  const input = document.getElementById("nomePlanilhaEditor");
  planilhaAtual.nome = input.value.trim() || "Sem título";
  input.value = planilhaAtual.nome;
  salvar();
}

/*
    FUNÇÃO: excluirPlanilha()
    Confirma a exclusão e remove a planilha do armazenamento local.
*/
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

/*
    FUNÇÃO: carregarPersonalizacao()
    Carrega nos controles as cores e opções visuais salvas para a planilha.
*/
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

/*
    FUNÇÃO: alterarPersonalizacao()
    Lê os controles de personalização, salva as mudanças e aplica na tabela.
*/
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

/*
    FUNÇÃO: aplicarPersonalizacao()
    Aplica cores, fonte, bordas e alinhamento diretamente na tabela renderizada.
*/
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

/*
    FUNÇÃO: restaurarPersonalizacao()
    Volta a aparência da planilha para o padrão do NexaGrid.
*/
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

/*
    FUNÇÃO: exportarPlanilha()
    Escolhe a forma de exportação e prepara os dados antes de gerar o arquivo.
*/
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

/*
    FUNÇÃO: obterDadosPlanilha()
    Transforma cabeçalho e registros em uma matriz na ordem atual das colunas.
*/
function obterDadosPlanilha() {
  const cabecalho = planilhaAtual.colunas.map((campo) => campo.nome);

  const linhas = planilhaAtual.linhas.map((linha) => {
    return planilhaAtual.colunas.map((campo) => linha[campo.id] ?? "");
  });

  return [cabecalho, ...linhas];
}

/*
    FUNÇÃO: limparNomeArquivo()
    Remove caracteres inválidos do nome usado no arquivo exportado.
*/
function limparNomeArquivo(nome) {
  return nome.replace(/[<>:"/\\|?*]/g, "").trim() || "planilha";
}

/*
    FUNÇÃO: corExcel()
    Converte a cor hexadecimal do CSS para o formato esperado pelo Excel.
*/
function corExcel(cor) {
  return (cor || "#000000").replace("#", "").toUpperCase();
}

/*
    FUNÇÃO: criarBorda()
    Cria o objeto de borda usado pelo xlsx-js-style nas células exportadas.
*/
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
/*
    FUNÇÃO: colunaExcelCampo()
    Descobre a letra da coluna do Excel correspondente a um campo pelo ID.
*/
function colunaExcelCampo(planilha, campoId) {
  const indice = planilha.colunas.findIndex((campo) => campo.id === campoId);
  return indice < 0 ? null : XLSX.utils.encode_col(indice);
}

/*
    FUNÇÃO: colunaExcelPapel()
    Descobre a letra da coluna do Excel correspondente a uma função do modelo.
*/
function colunaExcelPapel(planilha, papel) {
  const campo = campoPorPapel(planilha, papel);
  return campo ? colunaExcelCampo(planilha, campo.id) : null;
}

/*
    FUNÇÃO: referenciasExcelPapel()
    Monta as referências de Excel para todos os campos que possuem determinada função.
*/
function referenciasExcelPapel(planilha, papel, linhaExcel) {
  return camposPorPapel(planilha, papel).map((campo) => {
    return `${colunaExcelCampo(planilha, campo.id)}${linhaExcel}`;
  });
}

/*
    fórmulas exportadas também são dinâmicas.
    isso mantém a lógica funcionando depois de baixar o arquivo.
*/
/*
    FUNÇÃO: formulaExcelCampo()
    Gera uma fórmula de Excel dinâmica conforme a função do campo e sua posição atual.
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

/*
    FUNÇÃO: criarWorksheet()
    Monta a folha do Excel, aplica estilos, fórmulas, largura e altura das células.
*/
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
            /* cabeçalhos devem permanecer em uma linha */
            wrapText: false,
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
            /* textos comuns ficam em uma linha; textos muito longos podem quebrar */
            wrapText: String(celula.v ?? "").length > 38,
          },
          border: criarBorda(corBorda),
        };
      }
    }
  }

  /*
      LARGURA AUTOMÁTICA DAS COLUNAS

      antes a largura era calculada apenas contando caracteres.
      isso podia deixar títulos como "Total de aulas" estreitos demais,
      fazendo o Excel quebrar o cabeçalho em duas linhas.

      agora consideramos:
      - tamanho do título
      - maior valor da coluna
      - tamanho da fonte escolhido
      - um espaço extra para o texto respirar
      - limites para evitar colunas gigantescas
  */
  worksheet["!cols"] = planilhaAtual.colunas.map((campo) => {
    const textos = [
      String(campo.nome ?? ""),
      ...planilhaAtual.linhas.map((linha) => String(linha[campo.id] ?? "")),
    ];

    const maiorTexto = textos.reduce((maior, texto) => {
      return texto.length > maior.length ? texto : maior;
    }, "");

    const tamanhoFonte = Number(p.tamanhoFonte) || 14;

    /*
        fontes maiores precisam de mais espaço.
        14px funciona como base.
    */
    const fatorFonte = Math.max(1, tamanhoFonte / 14);

    /*
        títulos recebem um pouco mais de espaço porque são negrito.
    */
    const larguraTitulo = String(campo.nome ?? "").length * 1.35 + 4;
    const larguraConteudo = maiorTexto.length * 1.12 + 4;

    let largura = Math.max(larguraTitulo, larguraConteudo) * fatorFonte;

    /*
        campos conhecidos recebem um mínimo confortável.
    */
    if (["numero", "moeda", "porcentagem"].includes(campo.tipoDado)) {
      largura = Math.max(largura, 13);
    }

    if (campo.tipoDado === "data") {
      largura = Math.max(largura, 15);
    }

    /*
        mínimo geral de 10 e máximo de 42 caracteres.
        textos enormes ficam limitados para não destruir o layout.
    */
    largura = Math.min(Math.max(largura, 10), 42);

    return { wch: Math.ceil(largura) };
  });

  /*
      cabeçalho fica um pouco mais alto, mas sem quebra de linha.
      linhas normais continuam compactas.
  */
  worksheet["!rows"] = new Array(quantidadeLinhas)
    .fill(null)
    .map((valor, indice) => ({ hpt: indice === 0 ? 26 : 22 }));

  return worksheet;
}

/*
    FUNÇÃO: baixarArquivoExcel()
    Cria o workbook e inicia o download do arquivo .xlsx.
*/
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

/*
    FUNÇÃO: exportarExcel()
    Executa a exportação direta para Microsoft Excel.
*/
function exportarExcel() {
  baixarArquivoExcel();
}

/*
    FUNÇÃO: exportarGoogleSheets()
    Baixa o .xlsx e oferece abrir o Google Sheets para importação.
*/
async function exportarGoogleSheets() {
  baixarArquivoExcel();

  /* espera um pouco para o download começar */
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (await confirmarAcao(t("export.googleMessage"))) {
    window.open("https://sheets.google.com/", "_blank");
  }
}

/*
    FUNÇÃO: nomeTipo()
    Converte o código interno do formato em um nome amigável.
*/
function nomeTipo(tipo) {
  if (tipo === "excel") return "Microsoft Excel";
  if (tipo === "google") return "Google Sheets";
  return "Planilha";
}

/* ================================================= */
/* NEXAGRID V6 - FERRAMENTAS AVANÇADAS */
/* ================================================= */

/*
    A versão V6 mantém as funções anteriores e acrescenta:

    - tipos reais de campos;
    - validação de dados;
    - edição, movimentação e exclusão de colunas;
    - desfazer e refazer;
    - pesquisa, filtros e ordenação;
    - importação de XLSX/CSV;
    - gráficos automáticos;
    - backup e restauração JSON;
    - regras configuráveis para notas e frequência.
*/

Object.assign(traducoes["pt-BR"], {
  "dashboard.import": "↑ Importar",
  "dashboard.searchPlaceholder": "Pesquisar planilhas...",
  "dashboard.sortRecent": "Mais recentes",
  "dashboard.sortOld": "Mais antigas",
  "dashboard.sortAZ": "Nome A–Z",
  "dashboard.sortZA": "Nome Z–A",
  "dashboard.noResults": "Nenhuma planilha encontrada",

  "editor.undo": "↶ Desfazer",
  "editor.redo": "↷ Refazer",

  "table.searchPlaceholder": "Pesquisar nos registros...",
  "table.clearFilters": "Limpar filtros",
  "table.filterPlaceholder": "Filtrar...",

  "chart.eyebrow": "Visualização",
  "chart.title": "Gráfico automático",
  "chart.financial": "Entradas e saídas",
  "chart.budget": "Totais do orçamento",
  "chart.stock": "Potencial de venda por produto",
  "chart.sales": "Vendas por vendedor",
  "chart.grades": "Média dos alunos",
  "chart.attendance": "Frequência dos alunos",
  "chart.study": "Progresso dos estudos",

  "field.dataType": "Formato dos dados",
  "field.dataText": "Texto",
  "field.dataNumber": "Número",
  "field.dataCurrency": "Dinheiro",
  "field.dataPercent": "Porcentagem",
  "field.dataDate": "Data",
  "field.dataList": "Lista de opções",
  "field.dataBoolean": "Sim / Não",
  "field.options": "Opções da lista",
  "field.optionsPlaceholder": "Ex: Pendente, Em andamento, Concluído",
  "field.min": "Valor mínimo",
  "field.max": "Valor máximo",
  "field.edit": "✎ Editar campo",
  "field.moveLeft": "← Mover para esquerda",
  "field.moveRight": "→ Mover para direita",
  "field.delete": "🗑 Excluir campo",
  "field.deleteConfirm":
    "Deseja excluir este campo? Os dados dessa coluna também serão removidos.",
  "field.updated": "Campo atualizado.",
  "field.created": "Campo adicionado.",
  "field.listNeedsOptions":
    "Informe pelo menos uma opção para o campo de lista.",

  "settings.rules": "Regras dos cálculos",
  "settings.rulesText": "Defina os limites usados pelos modelos escolares.",
  "settings.passGrade": "Média para aprovação",
  "settings.minAttendance": "Frequência mínima (%)",
  "settings.backup": "Backup dos dados",
  "settings.backupText":
    "Salve todas as planilhas e configurações em um arquivo JSON ou restaure um backup.",
  "settings.backupExport": "↓ Criar backup",
  "settings.backupImport": "↑ Restaurar backup",
  "settings.backupConfirm":
    "Restaurar este backup substituirá as planilhas e configurações atuais. Deseja continuar?",
  "settings.backupInvalid":
    "O arquivo selecionado não é um backup válido do NexaGrid.",
  "settings.backupRestored": "Backup restaurado com sucesso.",

  "validation.invalidNumber": "Digite um número válido.",
  "validation.minimum": "O valor mínimo permitido é {valor}.",
  "validation.maximum": "O valor máximo permitido é {valor}.",
  "validation.absences":
    "As faltas não podem ser maiores que o total de aulas.",
  "validation.invalidDate": "Digite uma data válida.",

  "import.success": "Planilha importada com sucesso.",
  "import.error": "Não foi possível importar esse arquivo.",
  "import.empty": "O arquivo não possui dados para importar.",
  "import.library": "A biblioteca de planilhas ainda não terminou de carregar.",

  "history.nothingUndo": "Não há alterações para desfazer.",
  "history.nothingRedo": "Não há alterações para refazer.",

  "backup.fileName": "backup-nexagrid",
  "common.yes": "Sim",
  "common.no": "Não",
  "about.resourceImport": "Importar",
  "about.resourceImportText":
    "Abra arquivos XLSX, XLS e CSV dentro do NexaGrid.",
  "about.resourceFilter": "Filtrar",
  "about.resourceFilterText": "Pesquise, ordene e filtre registros por coluna.",
  "about.resourceUndo": "Desfazer",
  "about.resourceUndoText":
    "Volte ou refaça alterações feitas durante a edição.",
  "about.resourceBackup": "Backup",
  "about.resourceBackupText":
    "Salve e restaure todas as planilhas em um arquivo JSON.",
});

Object.assign(traducoes.en, {
  "dashboard.import": "↑ Import",
  "dashboard.searchPlaceholder": "Search spreadsheets...",
  "dashboard.sortRecent": "Newest first",
  "dashboard.sortOld": "Oldest first",
  "dashboard.sortAZ": "Name A–Z",
  "dashboard.sortZA": "Name Z–A",
  "dashboard.noResults": "No spreadsheets found",

  "editor.undo": "↶ Undo",
  "editor.redo": "↷ Redo",

  "table.searchPlaceholder": "Search records...",
  "table.clearFilters": "Clear filters",
  "table.filterPlaceholder": "Filter...",

  "chart.eyebrow": "Visualization",
  "chart.title": "Automatic chart",
  "chart.financial": "Income and expenses",
  "chart.budget": "Budget totals",
  "chart.stock": "Sales potential by product",
  "chart.sales": "Sales by seller",
  "chart.grades": "Student averages",
  "chart.attendance": "Student attendance",
  "chart.study": "Study progress",

  "field.dataType": "Data format",
  "field.dataText": "Text",
  "field.dataNumber": "Number",
  "field.dataCurrency": "Currency",
  "field.dataPercent": "Percentage",
  "field.dataDate": "Date",
  "field.dataList": "Option list",
  "field.dataBoolean": "Yes / No",
  "field.options": "List options",
  "field.optionsPlaceholder": "Ex: Pending, In progress, Done",
  "field.min": "Minimum value",
  "field.max": "Maximum value",
  "field.edit": "✎ Edit field",
  "field.moveLeft": "← Move left",
  "field.moveRight": "→ Move right",
  "field.delete": "🗑 Delete field",
  "field.deleteConfirm":
    "Delete this field? The data in this column will also be removed.",
  "field.updated": "Field updated.",
  "field.created": "Field added.",
  "field.listNeedsOptions": "Add at least one option for this list field.",

  "settings.rules": "Calculation rules",
  "settings.rulesText": "Set the limits used by school templates.",
  "settings.passGrade": "Passing average",
  "settings.minAttendance": "Minimum attendance (%)",
  "settings.backup": "Data backup",
  "settings.backupText":
    "Save all spreadsheets and settings to a JSON file or restore a backup.",
  "settings.backupExport": "↓ Create backup",
  "settings.backupImport": "↑ Restore backup",
  "settings.backupConfirm":
    "Restoring this backup will replace current spreadsheets and settings. Continue?",
  "settings.backupInvalid": "The selected file is not a valid NexaGrid backup.",
  "settings.backupRestored": "Backup restored successfully.",

  "validation.invalidNumber": "Enter a valid number.",
  "validation.minimum": "The minimum allowed value is {valor}.",
  "validation.maximum": "The maximum allowed value is {valor}.",
  "validation.absences": "Absences cannot be greater than total classes.",
  "validation.invalidDate": "Enter a valid date.",

  "import.success": "Spreadsheet imported successfully.",
  "import.error": "This file could not be imported.",
  "import.empty": "The file has no data to import.",
  "import.library": "The spreadsheet library has not finished loading yet.",

  "history.nothingUndo": "There are no changes to undo.",
  "history.nothingRedo": "There are no changes to redo.",

  "backup.fileName": "nexagrid-backup",
  "common.yes": "Yes",
  "common.no": "No",
  "about.resourceImport": "Import",
  "about.resourceImportText": "Open XLSX, XLS and CSV files inside NexaGrid.",
  "about.resourceFilter": "Filter",
  "about.resourceFilterText": "Search, sort and filter records by column.",
  "about.resourceUndo": "Undo",
  "about.resourceUndoText": "Undo or redo changes made while editing.",
  "about.resourceBackup": "Backup",
  "about.resourceBackupText":
    "Save and restore all spreadsheets in a JSON file.",
});

/* regras configuráveis adicionadas às preferências já existentes */
configuracoesPadrao.mediaAprovacao = 6;
configuracoesPadrao.frequenciaMinima = 75;

if (configuracoes.mediaAprovacao === undefined)
  configuracoes.mediaAprovacao = 6;
if (configuracoes.frequenciaMinima === undefined)
  configuracoes.frequenciaMinima = 75;

/* ================================================= */
/* ESTADOS TEMPORÁRIOS DA INTERFACE */
/* ================================================= */

const estadoTabelaV6 = {
  planilhaId: null,
  pesquisa: "",
  filtros: {},
  ordemCampo: null,
  direcao: "asc",
};

const historicoV6 = new Map();
const refazerV6 = new Map();
const LIMITE_HISTORICO_V6 = 40;

let campoSelecionadoIdV6 = null;
let graficoAtualV6 = null;

/* ================================================= */
/* UTILIDADES NOVAS */
/* ================================================= */

/*
    FUNÇÃO: substituirMarcador()
    Auxiliar usado para substituir marcadores/textos em estruturas internas.
*/
function substituirMarcador(texto, valor) {
  return String(texto).replace("{valor}", String(valor));
}

/*
    FUNÇÃO: clonarDados()
    Cria uma cópia profunda dos dados para histórico, backup ou restauração.
*/
function clonarDados(valor) {
  return JSON.parse(JSON.stringify(valor));
}

/*
    FUNÇÃO: valorNaoVazio()
    Verifica se um valor deve ser considerado preenchido ao contar registros.
*/
function valorNaoVazio(valor) {
  return valor !== "" && valor !== null && valor !== undefined;
}

/*
    FUNÇÃO: escaparHTML()
    Escapa caracteres especiais para impedir que texto do usuário seja interpretado como HTML.
*/
function escaparHTML(texto) {
  return String(texto ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/*
    FUNÇÃO: limitarNumero()
    Restringe um valor numérico aos limites mínimo e máximo configurados.
*/
function limitarNumero(valor, minimo, maximo) {
  let resultado = Number(valor);
  if (!Number.isFinite(resultado)) resultado = minimo;
  return Math.min(Math.max(resultado, minimo), maximo);
}

/*
    FUNÇÃO: mostrarToast()
    Exibe uma pequena mensagem temporária dentro da interface.
*/
function mostrarToast(mensagem, tipo = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast-nexagrid ${tipo}`;
  toast.textContent = mensagem;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(.4rem)";
    setTimeout(() => toast.remove(), 220);
  }, 3200);
}

/*
    FUNÇÃO: salvar()
    Salva o estado atual das planilhas/configurações no localStorage do navegador.
*/
function salvar() {
  try {
    localStorage.setItem("planilhas", JSON.stringify(planilhas));
  } catch (erro) {
    console.error(erro);
    mostrarToast("Não foi possível salvar os dados no navegador.", "erro");
  }
}

/* ================================================= */
/* CONFIGURAÇÕES GERAIS + REGRAS DOS MODELOS */
/* ================================================= */

/*
    FUNÇÃO: aplicarConfiguracoes()
    Aplica no documento o tema, tamanho da fonte, idioma e demais preferências salvas.
*/
function aplicarConfiguracoes() {
  document.documentElement.dataset.theme = configuracoes.tema;

  const tamanhos = {
    small: "14px",
    normal: "16px",
    large: "18px",
  };

  document.documentElement.style.fontSize =
    tamanhos[configuracoes.fonte] || tamanhos.normal;

  const tema = document.getElementById("configTema");
  const fonte = document.getElementById("configFonte");
  const idioma = document.getElementById("configIdioma");
  const media = document.getElementById("configMediaAprovacao");
  const frequencia = document.getElementById("configFrequenciaMinima");

  if (tema) tema.value = configuracoes.tema;
  if (fonte) fonte.value = configuracoes.fonte;
  if (idioma) idioma.value = configuracoes.idioma;
  if (media) media.value = configuracoes.mediaAprovacao;
  if (frequencia) frequencia.value = configuracoes.frequenciaMinima;

  aplicarTraducao();
  sincronizarMenusConfiguracoes();

  if (planilhaAtual) montarGraficoModelo();
}

/*
    FUNÇÃO: alterarConfiguracoes()
    Lê as opções escolhidas na página de configurações, salva no localStorage e reaplica a interface.
*/
function alterarConfiguracoes() {
  const tema = document.getElementById("configTema");
  const fonte = document.getElementById("configFonte");
  const idioma = document.getElementById("configIdioma");
  const media = document.getElementById("configMediaAprovacao");
  const frequencia = document.getElementById("configFrequenciaMinima");

  if (tema) configuracoes.tema = tema.value;
  if (fonte) configuracoes.fonte = fonte.value;
  if (idioma) configuracoes.idioma = idioma.value;

  if (media) {
    configuracoes.mediaAprovacao = limitarNumero(media.value, 0, 10);
    media.value = configuracoes.mediaAprovacao;
  }

  if (frequencia) {
    configuracoes.frequenciaMinima = limitarNumero(frequencia.value, 0, 100);
    frequencia.value = configuracoes.frequenciaMinima;
  }

  localStorage.setItem(CHAVE_CONFIGURACOES, JSON.stringify(configuracoes));

  aplicarConfiguracoes();
  carregarDashboard();
  renderizarModelos();

  if (planilhaAtual) {
    atualizarTodosCalculos();
    salvar();
    atualizarCabecalhoEditor();
    montarTabela();
  }
}

/*
    FUNÇÃO: restaurarConfiguracoes()
    Volta as preferências gerais do NexaGrid para os valores padrão.
*/
async function restaurarConfiguracoes() {
  if (!(await confirmarAcao(t("settings.restoreConfirm")))) return;

  configuracoes = { ...configuracoesPadrao };
  localStorage.setItem(CHAVE_CONFIGURACOES, JSON.stringify(configuracoes));

  aplicarConfiguracoes();
  carregarDashboard();
  renderizarModelos();
}

/* ================================================= */
/* TIPOS DE CAMPOS E MIGRAÇÃO */
/* ================================================= */

/*
    FUNÇÃO: tipoDadoAutomaticoCalculo()
    Escolhe automaticamente o tipo de dado ideal para um campo calculado.
*/
function tipoDadoAutomaticoCalculo(calculo) {
  if (["situacao_notas", "situacao_frequencia"].includes(calculo)) {
    return "texto";
  }

  if (["frequencia_percentual", "progresso_estudos"].includes(calculo)) {
    return "porcentagem";
  }

  if (
    [
      "total_orcamento",
      "valor_estoque",
      "lucro_unitario",
      "potencial_venda",
      "total_venda",
      "comissao",
    ].includes(calculo)
  ) {
    return "moeda";
  }

  return "numero";
}

/*
    FUNÇÃO: sugestaoTipoDadoCampo()
    Sugere o tipo de dado mais apropriado para um campo de informação.
*/
function sugestaoTipoDadoCampo(campo) {
  if (campo.tipo === "calculo") {
    return tipoDadoAutomaticoCalculo(campo.calculo);
  }

  if (campo.papel === "data") return "data";
  if (campo.papel === "tipo_movimento") return "lista";
  if (campo.papel === "comissao_percentual") return "porcentagem";

  if (
    ["valor", "valor_unitario", "custo_unitario", "preco_venda"].includes(
      campo.papel,
    )
  ) {
    return "moeda";
  }

  if (
    [
      "nota",
      "quantidade",
      "total_aulas",
      "faltas",
      "horas_planejadas",
      "horas_estudadas",
    ].includes(campo.papel)
  ) {
    return "numero";
  }

  return "texto";
}

/*
    FUNÇÃO: padroesValidacaoPapel()
    Retorna limites e regras padrão conforme a função do campo.
*/
function padroesValidacaoPapel(papel, tipoDado) {
  const padrao = { min: null, max: null, opcoes: [] };

  if (papel === "nota") {
    padrao.min = 0;
    padrao.max = 10;
  }

  if (
    [
      "quantidade",
      "valor",
      "valor_unitario",
      "custo_unitario",
      "preco_venda",
      "total_aulas",
      "faltas",
      "horas_planejadas",
      "horas_estudadas",
    ].includes(papel)
  ) {
    padrao.min = 0;
  }

  if (tipoDado === "porcentagem") {
    padrao.min = 0;
    padrao.max = 100;
  }

  if (papel === "tipo_movimento") {
    padrao.opcoes = [t("summary.income"), t("summary.expenses")];
  }

  return padrao;
}

/*
    FUNÇÃO: normalizarCampoV6()
    Garante que um campo possua todas as propriedades exigidas pela versão atual.
*/
function normalizarCampoV6(campo) {
  const resultado = {
    id: campo.id || criarIdCampo(),
    nome: campo.nome || "Campo",
    tipo: campo.tipo || "info",
    papel: campo.papel || "geral",
    calculo: campo.calculo || null,
    tipoDado: campo.tipoDado || null,
    opcoes: Array.isArray(campo.opcoes) ? [...campo.opcoes] : [],
    min: campo.min ?? null,
    max: campo.max ?? null,
  };

  if (!resultado.tipoDado) {
    resultado.tipoDado = sugestaoTipoDadoCampo(resultado);
  }

  const defaults = padroesValidacaoPapel(resultado.papel, resultado.tipoDado);

  if (resultado.min === null && defaults.min !== null)
    resultado.min = defaults.min;
  if (resultado.max === null && defaults.max !== null)
    resultado.max = defaults.max;

  if (resultado.opcoes.length === 0 && defaults.opcoes.length > 0) {
    resultado.opcoes = defaults.opcoes;
  }

  return resultado;
}

/*
    FUNÇÃO: migrarPlanilhas()
    Converte planilhas criadas em versões antigas para a estrutura atual sem apagar os dados.
*/
function migrarPlanilhas() {
  planilhas = Array.isArray(planilhas) ? planilhas : [];

  planilhas.forEach((planilha) => {
    planilha.id = String(planilha.id || Date.now() + Math.random());
    planilha.nome = planilha.nome || "Sem título";
    planilha.tipo = planilha.tipo || "excel";
    planilha.modelo = planilha.modelo || "vazio";
    planilha.criadaEm = planilha.criadaEm || new Date().toISOString();
    planilha.personalizacao = {
      ...personalizacaoPadrao(),
      ...(planilha.personalizacao || {}),
    };

    const colunasOriginais = Array.isArray(planilha.colunas)
      ? [...planilha.colunas]
      : [];

    const novasColunas = colunasOriginais.map((coluna) => {
      const campoBase =
        typeof coluna === "string"
          ? inferirCampoLegado(coluna, planilha.modelo)
          : coluna;

      return normalizarCampoV6(campoBase);
    });

    planilha.linhas = (
      Array.isArray(planilha.linhas) ? planilha.linhas : []
    ).map((linha) => {
      if (!Array.isArray(linha)) {
        const objeto = linha && typeof linha === "object" ? { ...linha } : {};
        novasColunas.forEach((campo) => {
          if (!(campo.id in objeto)) objeto[campo.id] = "";
        });
        return objeto;
      }

      const objeto = {};
      novasColunas.forEach((campo, indice) => {
        objeto[campo.id] = linha[indice] ?? "";
      });
      return objeto;
    });

    planilha.colunas = novasColunas;
    atualizarTodosCalculos(planilha);
  });

  salvar();
}

/*
    FUNÇÃO: criarCampoModelo()
    Transforma a definição de um campo do modelo em um campo real com ID único.
*/
function criarCampoModelo(campoModelo) {
  return normalizarCampoV6({
    id: criarIdCampo(),
    nome: t(campoModelo.nomeKey),
    tipo: campoModelo.tipo,
    papel: campoModelo.papel || "geral",
    calculo: campoModelo.calculo || null,
  });
}

/* ================================================= */
/* VALIDAÇÃO DOS DADOS */
/* ================================================= */

/*
    FUNÇÃO: campoEhNumerico()
    Informa se o tipo do campo deve ser tratado como número.
*/
function campoEhNumerico(campo) {
  return ["numero", "moeda", "porcentagem"].includes(campo.tipoDado);
}

/*
    FUNÇÃO: validarValorCampo()
    Valida o valor digitado conforme tipo, mínimo, máximo e opções permitidas.
*/
function validarValorCampo(campo, valor, linha, planilha) {
  if (!valorNaoVazio(valor)) return null;

  if (campo.tipoDado === "data") {
    const data = new Date(`${valor}T00:00:00`);
    if (Number.isNaN(data.getTime())) return t("validation.invalidDate");
  }

  if (campoEhNumerico(campo)) {
    const texto = String(valor).trim();
    const convertido = numeroOuNull(texto);

    if (convertido === null) return t("validation.invalidNumber");

    if (campo.min !== null && convertido < Number(campo.min)) {
      return substituirMarcador(t("validation.minimum"), campo.min);
    }

    if (campo.max !== null && convertido > Number(campo.max)) {
      return substituirMarcador(t("validation.maximum"), campo.max);
    }
  }

  if (campo.papel === "faltas") {
    const totalAulasCampo = campoPorPapel(planilha, "total_aulas");
    if (totalAulasCampo && valorNaoVazio(linha[totalAulasCampo.id])) {
      if (numero(valor) > numero(linha[totalAulasCampo.id])) {
        return t("validation.absences");
      }
    }
  }

  return null;
}

/* ================================================= */
/* HISTÓRICO: DESFAZER E REFAZER */
/* ================================================= */

/*
    FUNÇÃO: pilhaHistorico()
    Retorna a pilha de histórico usada pela planilha atual.
*/
function pilhaHistorico(mapa, id) {
  if (!mapa.has(id)) mapa.set(id, []);
  return mapa.get(id);
}

/*
    FUNÇÃO: registrarHistorico()
    Salva um snapshot antes de uma alteração para permitir Desfazer.
*/
function registrarHistorico() {
  if (!planilhaAtual) return;

  const pilha = pilhaHistorico(historicoV6, planilhaAtual.id);
  pilha.push(clonarDados(planilhaAtual));

  if (pilha.length > LIMITE_HISTORICO_V6) pilha.shift();
  refazerV6.set(planilhaAtual.id, []);
  atualizarBotoesHistorico();
}

/*
    FUNÇÃO: atualizarBotoesHistorico()
    Ativa ou desativa os botões Desfazer/Refazer conforme o histórico disponível.
*/
function atualizarBotoesHistorico() {
  const botaoDesfazer = document.getElementById("botaoDesfazer");
  const botaoRefazer = document.getElementById("botaoRefazer");

  if (!planilhaAtual) {
    if (botaoDesfazer) botaoDesfazer.disabled = true;
    if (botaoRefazer) botaoRefazer.disabled = true;
    return;
  }

  if (botaoDesfazer) {
    botaoDesfazer.disabled =
      pilhaHistorico(historicoV6, planilhaAtual.id).length === 0;
  }

  if (botaoRefazer) {
    botaoRefazer.disabled =
      pilhaHistorico(refazerV6, planilhaAtual.id).length === 0;
  }
}

/*
    FUNÇÃO: substituirPlanilhaAtual()
    Substitui o estado da planilha pelo snapshot restaurado do histórico.
*/
function substituirPlanilhaAtual(snapshot) {
  const indice = planilhas.findIndex((item) => item.id === snapshot.id);
  if (indice === -1) return;

  planilhas[indice] = clonarDados(snapshot);
  planilhaAtual = planilhas[indice];
  atualizarTodosCalculos();
  salvar();

  const nome = document.getElementById("nomePlanilhaEditor");
  if (nome) nome.value = planilhaAtual.nome;

  carregarPersonalizacao();
  atualizarCabecalhoEditor();
  montarTabela();
}

/*
    FUNÇÃO: desfazer()
    Restaura o estado anterior da planilha.
*/
function desfazer() {
  if (!planilhaAtual) return;

  const pilha = pilhaHistorico(historicoV6, planilhaAtual.id);
  if (pilha.length === 0) {
    mostrarToast(t("history.nothingUndo"));
    return;
  }

  pilhaHistorico(refazerV6, planilhaAtual.id).push(clonarDados(planilhaAtual));
  substituirPlanilhaAtual(pilha.pop());
  atualizarBotoesHistorico();
}

/*
    FUNÇÃO: refazer()
    Reaplica uma alteração que foi desfeita.
*/
function refazer() {
  if (!planilhaAtual) return;

  const pilha = pilhaHistorico(refazerV6, planilhaAtual.id);
  if (pilha.length === 0) {
    mostrarToast(t("history.nothingRedo"));
    return;
  }

  pilhaHistorico(historicoV6, planilhaAtual.id).push(
    clonarDados(planilhaAtual),
  );
  substituirPlanilhaAtual(pilha.pop());
  atualizarBotoesHistorico();
}

/* ================================================= */
/* DASHBOARD: CONTAGEM, PESQUISA E ORDENAÇÃO */
/* ================================================= */

/*
    FUNÇÃO: linhaTemDados()
    Verifica se uma linha possui algum valor real e não apenas células vazias.
*/
function linhaTemDados(planilha, linha) {
  return (planilha.colunas || [])
    .filter((campo) => campo.tipo === "info")
    .some((campo) => valorNaoVazio(linha?.[campo.id]));
}

/*
    FUNÇÃO: contarRegistrosPlanilha()
    Conta apenas registros realmente preenchidos para as estatísticas.
*/
function contarRegistrosPlanilha(planilha) {
  return (planilha.linhas || []).filter((linha) =>
    linhaTemDados(planilha, linha),
  ).length;
}

/*
    FUNÇÃO: carregarDashboard()
    Calcula as estatísticas, aplica busca/ordenação e cria os cards das planilhas salvas.
*/
function carregarDashboard() {
  if (!listaPlanilhas) return;

  listaPlanilhas.innerHTML = "";

  const totalRegistrosGeral = planilhas.reduce(
    (total, planilha) => total + contarRegistrosPlanilha(planilha),
    0,
  );

  const totalCamposGeral = planilhas.reduce(
    (total, planilha) => total + (planilha.colunas || []).length,
    0,
  );

  const totalPlanilhas = document.getElementById("totalPlanilhas");
  const totalRegistros = document.getElementById("totalRegistros");
  const totalCampos = document.getElementById("totalCampos");

  if (totalPlanilhas) totalPlanilhas.textContent = planilhas.length;
  if (totalRegistros) totalRegistros.textContent = totalRegistrosGeral;
  if (totalCampos) totalCampos.textContent = totalCamposGeral;

  const pesquisa = normalizarTexto(
    document.getElementById("pesquisaPlanilha")?.value || "",
  );
  const ordem =
    document.getElementById("ordenacaoPlanilhas")?.value || "recentes";

  let exibidas = planilhas.filter((planilha) => {
    if (!pesquisa) return true;
    return normalizarTexto(planilha.nome).includes(pesquisa);
  });

  exibidas = [...exibidas].sort((a, b) => {
    if (ordem === "az")
      return a.nome.localeCompare(b.nome, configuracoes.idioma);
    if (ordem === "za")
      return b.nome.localeCompare(a.nome, configuracoes.idioma);

    const dataA = new Date(a.criadaEm || 0).getTime();
    const dataB = new Date(b.criadaEm || 0).getTime();
    return ordem === "antigas" ? dataA - dataB : dataB - dataA;
  });

  if (exibidas.length === 0) {
    const vazio = document.createElement("div");
    vazio.className = "vazio";

    const titulo = document.createElement("h3");
    titulo.textContent =
      planilhas.length === 0
        ? t("dashboard.emptyTitle")
        : t("dashboard.noResults");

    const texto = document.createElement("p");
    texto.textContent =
      planilhas.length === 0
        ? t("dashboard.emptyText")
        : t("dashboard.recentText");

    vazio.append(titulo, texto);
    listaPlanilhas.appendChild(vazio);
    return;
  }

  exibidas.forEach((planilha) => {
    const card = document.createElement("article");
    card.className = "card-planilha";
    card.tabIndex = 0;

    const topo = document.createElement("div");
    topo.className = "topo-card-planilha";

    const titulo = document.createElement("h4");
    titulo.textContent = `▦ ${planilha.nome}`;
    topo.appendChild(titulo);

    if (planilha.modelo && planilha.modelo !== "vazio") {
      const tagModelo = document.createElement("span");
      tagModelo.className = "tag-modelo";
      tagModelo.textContent = nomeModelo(planilha.modelo);
      topo.appendChild(tagModelo);
    }

    const resumo = document.createElement("p");
    resumo.textContent = `${contarRegistrosPlanilha(planilha)} ${t("stats.records").toLowerCase()} · ${(planilha.colunas || []).length} ${t("stats.fields").toLowerCase()}`;

    const rodape = document.createElement("footer");
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = nomeTipo(planilha.tipo);

    const excluir = document.createElement("button");
    excluir.className = "excluir";
    excluir.textContent = t("common.delete");
    excluir.addEventListener("click", (event) =>
      excluirPlanilha(event, planilha.id),
    );

    rodape.append(tag, excluir);
    card.append(topo, resumo, rodape);

    const abrir = () => abrirPlanilha(planilha.id);
    card.addEventListener("click", abrir);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        abrir();
      }
    });

    listaPlanilhas.appendChild(card);
  });
}

/* ================================================= */
/* CRIAÇÃO DE PLANILHA */
/* ================================================= */

/*
    FUNÇÃO: criarPlanilha()
    Monta o objeto completo da nova planilha, salva e abre o editor.
*/
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
    colunas.forEach((campo) => {
      primeiraLinha[campo.id] = "";
    });
    linhas = [primeiraLinha];
  } else {
    document.querySelectorAll(".campoNovo").forEach((campoInput) => {
      const nomeCampo = campoInput.value.trim();
      if (!nomeCampo) return;

      colunas.push(
        normalizarCampoV6({
          id: criarIdCampo(),
          nome: nomeCampo,
          tipo: "info",
          papel: "geral",
          tipoDado: "texto",
        }),
      );
    });

    if (colunas.length === 0) {
      await mostrarAviso(t("create.needField"));
      return;
    }
  }

  const novaPlanilha = {
    id: String(Date.now()),
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

  if (modalCriacao) modalCriacao.close();
  abrirPlanilha(novaPlanilha.id);
}

/* ================================================= */
/* CÁLCULOS DINÂMICOS COM REGRAS CONFIGURÁVEIS */
/* ================================================= */

/*
    FUNÇÃO: calcularMediaNotas()
    Calcula a média usando todos os campos cuja função é nota, independentemente da posição.
*/
function calcularMediaNotas(planilha, linha) {
  const camposNotas = camposPorPapel(planilha, "nota");
  if (camposNotas.length === 0) return "";

  const todasPreenchidas = camposNotas.every((campo) =>
    valorNaoVazio(linha[campo.id]),
  );
  if (!todasPreenchidas) return "";

  const soma = camposNotas.reduce(
    (total, campo) => total + numero(linha[campo.id]),
    0,
  );
  return arredondar(soma / camposNotas.length);
}

/*
    FUNÇÃO: calcularCampo()
    Executa o cálculo automático correspondente à função configurada no campo.
*/
function calcularCampo(planilha, linha, campo) {
  const calculo = campo.calculo;

  if (calculo === "media_notas") return calcularMediaNotas(planilha, linha);

  if (calculo === "situacao_notas") {
    const media = calcularMediaNotas(planilha, linha);
    if (!valorNaoVazio(media)) return "";
    return numero(media) >= Number(configuracoes.mediaAprovacao)
      ? t("status.approved")
      : t("status.failed");
  }

  if (calculo === "total_orcamento") {
    const quantidade = valorPorPapel(planilha, linha, "quantidade");
    const valor = valorPorPapel(planilha, linha, "valor_unitario");
    if (!valorNaoVazio(quantidade) || !valorNaoVazio(valor)) return "";
    return arredondar(numero(quantidade) * numero(valor));
  }

  if (calculo === "valor_estoque") {
    const quantidade = valorPorPapel(planilha, linha, "quantidade");
    const custo = valorPorPapel(planilha, linha, "custo_unitario");
    if (!valorNaoVazio(quantidade) || !valorNaoVazio(custo)) return "";
    return arredondar(numero(quantidade) * numero(custo));
  }

  if (calculo === "lucro_unitario") {
    const custo = valorPorPapel(planilha, linha, "custo_unitario");
    const venda = valorPorPapel(planilha, linha, "preco_venda");
    if (!valorNaoVazio(custo) || !valorNaoVazio(venda)) return "";
    return arredondar(numero(venda) - numero(custo));
  }

  if (calculo === "potencial_venda") {
    const quantidade = valorPorPapel(planilha, linha, "quantidade");
    const venda = valorPorPapel(planilha, linha, "preco_venda");
    if (!valorNaoVazio(quantidade) || !valorNaoVazio(venda)) return "";
    return arredondar(numero(quantidade) * numero(venda));
  }

  if (calculo === "total_venda") {
    const quantidade = valorPorPapel(planilha, linha, "quantidade");
    const valor = valorPorPapel(planilha, linha, "valor_unitario");
    if (!valorNaoVazio(quantidade) || !valorNaoVazio(valor)) return "";
    return arredondar(numero(quantidade) * numero(valor));
  }

  if (calculo === "comissao") {
    const total = calcularCampo(planilha, linha, { calculo: "total_venda" });
    const percentual = valorPorPapel(planilha, linha, "comissao_percentual");
    if (!valorNaoVazio(total) || !valorNaoVazio(percentual)) return "";
    return arredondar(numero(total) * (numero(percentual) / 100));
  }

  if (calculo === "presencas") {
    const aulas = valorPorPapel(planilha, linha, "total_aulas");
    const faltas = valorPorPapel(planilha, linha, "faltas");
    if (!valorNaoVazio(aulas) || !valorNaoVazio(faltas)) return "";
    return arredondar(Math.max(numero(aulas) - numero(faltas), 0));
  }

  if (calculo === "frequencia_percentual") {
    const aulas = numero(valorPorPapel(planilha, linha, "total_aulas"));
    const presencas = calcularCampo(planilha, linha, { calculo: "presencas" });
    if (aulas <= 0 || !valorNaoVazio(presencas)) return "";
    return arredondar((numero(presencas) / aulas) * 100);
  }

  if (calculo === "situacao_frequencia") {
    const frequencia = calcularCampo(planilha, linha, {
      calculo: "frequencia_percentual",
    });
    if (!valorNaoVazio(frequencia)) return "";

    return numero(frequencia) >= Number(configuracoes.frequenciaMinima)
      ? t("status.regular")
      : t("status.attention");
  }

  if (calculo === "progresso_estudos") {
    const planejadas = numero(
      valorPorPapel(planilha, linha, "horas_planejadas"),
    );
    const estudadas = valorPorPapel(planilha, linha, "horas_estudadas");
    if (planejadas <= 0 || !valorNaoVazio(estudadas)) return "";
    return arredondar((numero(estudadas) / planejadas) * 100);
  }

  const valoresNumericos = planilha.colunas
    .filter(
      (outroCampo) => outroCampo.tipo === "info" && campoEhNumerico(outroCampo),
    )
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
    const soma = valoresNumericos.reduce((total, valor) => total + valor, 0);
    return arredondar(soma / valoresNumericos.length);
  }

  if (calculo === "produto_linha") {
    if (valoresNumericos.length === 0) return "";
    return arredondar(
      valoresNumericos.reduce((total, valor) => total * valor, 1),
    );
  }

  return "";
}

/* ================================================= */
/* ABRIR PLANILHA */
/* ================================================= */

/*
    FUNÇÃO: abrirPlanilha()
    Seleciona uma planilha pelo ID, prepara seus dados e abre o editor.
*/
function abrirPlanilha(id) {
  if (!dashboard || !editor) return;

  planilhaAtual = planilhas.find((planilha) => planilha.id === id);
  if (!planilhaAtual) return;

  if (estadoTabelaV6.planilhaId !== id) {
    estadoTabelaV6.planilhaId = id;
    estadoTabelaV6.pesquisa = "";
    estadoTabelaV6.filtros = {};
    estadoTabelaV6.ordemCampo = null;
    estadoTabelaV6.direcao = "asc";

    const pesquisa = document.getElementById("pesquisaRegistros");
    if (pesquisa) pesquisa.value = "";
  }

  atualizarTodosCalculos(planilhaAtual);
  salvar();

  esconderTelasPrincipais();
  editor.classList.remove("escondido");

  const nome = document.getElementById("nomePlanilhaEditor");
  if (nome) nome.value = planilhaAtual.nome;

  atualizarCabecalhoEditor();
  carregarPersonalizacao();
  montarTabela();
  atualizarBotoesHistorico();
}

/* ================================================= */
/* PESQUISA, FILTROS E ORDENAÇÃO DOS REGISTROS */
/* ================================================= */

/*
    FUNÇÃO: atualizarPesquisaRegistros()
    Atualiza o texto de busca e refiltra as linhas exibidas.
*/
function atualizarPesquisaRegistros(valor) {
  estadoTabelaV6.pesquisa = normalizarTexto(valor);
  aplicarFiltrosTabelaDOM();
}

/*
    FUNÇÃO: atualizarFiltroCampo()
    Atualiza o filtro específico de uma coluna.
*/
function atualizarFiltroCampo(campoId, valor) {
  estadoTabelaV6.filtros[campoId] = normalizarTexto(valor);
  aplicarFiltrosTabelaDOM();
}

/*
    FUNÇÃO: limparFiltrosTabela()
    Remove busca e filtros aplicados à tabela.
*/
function limparFiltrosTabela() {
  estadoTabelaV6.pesquisa = "";
  estadoTabelaV6.filtros = {};

  const pesquisa = document.getElementById("pesquisaRegistros");
  if (pesquisa) pesquisa.value = "";

  document.querySelectorAll(".filtro-coluna").forEach((input) => {
    input.value = "";
  });

  aplicarFiltrosTabelaDOM();
}

/*
    FUNÇÃO: linhaPassaNosFiltros()
    Decide se uma linha deve aparecer considerando busca e filtros atuais.
*/
function linhaPassaNosFiltros(linha) {
  const pesquisa = estadoTabelaV6.pesquisa;

  if (pesquisa) {
    const textoLinha = planilhaAtual.colunas
      .map((campo) => normalizarTexto(linha[campo.id]))
      .join(" ");

    if (!textoLinha.includes(pesquisa)) return false;
  }

  for (const [campoId, filtro] of Object.entries(estadoTabelaV6.filtros)) {
    if (!filtro) continue;
    if (!normalizarTexto(linha[campoId]).includes(filtro)) return false;
  }

  return true;
}

/*
    FUNÇÃO: aplicarFiltrosTabelaDOM()
    Aplica visualmente os filtros sem apagar os dados originais.
*/
function aplicarFiltrosTabelaDOM() {
  if (!corpoTabela || !planilhaAtual) return;

  corpoTabela.querySelectorAll("tr[data-linha-index]").forEach((tr) => {
    const indice = Number(tr.dataset.linhaIndex);
    const linha = planilhaAtual.linhas[indice];
    tr.hidden = !linhaPassaNosFiltros(linha);
  });
}

/*
    FUNÇÃO: compararValoresCampo()
    Compara dois valores respeitando o tipo do campo para ordenar corretamente.
*/
function compararValoresCampo(a, b, campo) {
  if (campoEhNumerico(campo)) return numero(a) - numero(b);

  if (campo.tipoDado === "data") {
    return new Date(a || 0).getTime() - new Date(b || 0).getTime();
  }

  return String(a ?? "").localeCompare(String(b ?? ""), configuracoes.idioma, {
    numeric: true,
    sensitivity: "base",
  });
}

/*
    FUNÇÃO: ordenarTabelaPorCampo()
    Alterna a ordenação crescente/decrescente de uma coluna.
*/
function ordenarTabelaPorCampo(campoId) {
  if (estadoTabelaV6.ordemCampo === campoId) {
    estadoTabelaV6.direcao = estadoTabelaV6.direcao === "asc" ? "desc" : "asc";
  } else {
    estadoTabelaV6.ordemCampo = campoId;
    estadoTabelaV6.direcao = "asc";
  }

  montarTabela();
}

/*
    FUNÇÃO: linhasOrdenadasParaTabela()
    Retorna uma cópia das linhas já filtrada e ordenada para exibição.
*/
function linhasOrdenadasParaTabela() {
  const linhas = planilhaAtual.linhas.map((linha, indiceOriginal) => ({
    linha,
    indiceOriginal,
  }));

  if (!estadoTabelaV6.ordemCampo) return linhas;

  const campo = planilhaAtual.colunas.find(
    (item) => item.id === estadoTabelaV6.ordemCampo,
  );
  if (!campo) return linhas;

  const multiplicador = estadoTabelaV6.direcao === "asc" ? 1 : -1;

  return linhas.sort((a, b) => {
    return (
      compararValoresCampo(a.linha[campo.id], b.linha[campo.id], campo) *
      multiplicador
    );
  });
}

/* ================================================= */
/* CONTROLES DE CÉLULAS POR TIPO */
/* ================================================= */

/*
    FUNÇÃO: configurarHistoricoControle()
    Faz um input registrar o estado anterior antes de ser editado.
*/
function configurarHistoricoControle(controle) {
  controle.addEventListener("focus", () => {
    if (controle.dataset.historicoRegistrado === "1") return;
    controle.dataset.historicoRegistrado = "1";
    controle.dataset.valorAnterior = controle.value ?? "";
    registrarHistorico();
  });

  controle.addEventListener("blur", () => {
    controle.dataset.historicoRegistrado = "0";
  });
}

/*
    FUNÇÃO: opcoesBooleanas()
    Retorna as opções usadas em campos Sim/Não.
*/
function opcoesBooleanas() {
  return [
    ["", ""],
    ["sim", t("common.yes")],
    ["nao", t("common.no")],
  ];
}

/*
    FUNÇÃO: criarControleEditavel()
    Cria o input, data, lista ou outro controle adequado ao tipo do campo.
*/
function criarControleEditavel(campo, linha, tr) {
  let controle;

  if (campo.tipoDado === "lista" || campo.tipoDado === "booleano") {
    controle = document.createElement("select");
    controle.className = "celula-selecao";

    const opcoes =
      campo.tipoDado === "booleano"
        ? opcoesBooleanas()
        : [["", ""], ...(campo.opcoes || []).map((opcao) => [opcao, opcao])];

    opcoes.forEach(([valor, texto]) => {
      const option = document.createElement("option");
      option.value = valor;
      option.textContent = texto;
      controle.appendChild(option);
    });

    controle.value = linha[campo.id] ?? "";
  } else {
    controle = document.createElement("input");

    if (campo.tipoDado === "data") {
      controle.type = "date";
    } else {
      controle.type = "text";
      if (campoEhNumerico(campo)) controle.inputMode = "decimal";
    }

    controle.value = linha[campo.id] ?? "";
    controle.placeholder = campo.nome;
  }

  controle.dataset.campoId = campo.id;
  configurarHistoricoControle(controle);

  const atualizar = () => {
    linha[campo.id] = controle.value;
    atualizarCalculosLinha(planilhaAtual, linha);
    atualizarCelulasCalculadasDaLinha(tr, linha);
    salvar();
    montarResumoModelo();
    montarGraficoModelo();
    aplicarFiltrosTabelaDOM();
  };

  controle.addEventListener(
    controle.tagName === "SELECT" ? "change" : "input",
    atualizar,
  );

  controle.addEventListener("blur", () => {
    const erro = validarValorCampo(campo, controle.value, linha, planilhaAtual);

    if (erro) {
      controle.classList.add("celula-invalida");
      linha[campo.id] = controle.dataset.valorAnterior ?? "";
      controle.value = linha[campo.id];
      atualizarCalculosLinha(planilhaAtual, linha);
      atualizarCelulasCalculadasDaLinha(tr, linha);
      salvar();
      montarResumoModelo();
      montarGraficoModelo();
      mostrarToast(erro, "erro");
    } else {
      controle.classList.remove("celula-invalida");
    }
  });

  return controle;
}

/*
    FUNÇÃO: criarControleCalculado()
    Cria um controle somente leitura para um resultado automático.
*/
function criarControleCalculado(campo, linha) {
  const input = document.createElement("input");
  input.readOnly = true;
  input.classList.add("campo-calculado");
  input.dataset.campoId = campo.id;
  input.value = linha[campo.id] ?? "";
  input.title = t("editor.autoField");
  return input;
}

/* ================================================= */
/* TABELA COMPLETA */
/* ================================================= */

/*
    FUNÇÃO: montarTabela()
    Reconstrói cabeçalho, filtros, linhas e controles da tabela usando os dados atuais.
*/
function montarTabela() {
  if (!planilhaAtual || !cabecalhoTabela || !corpoTabela) return;

  atualizarTodosCalculos();
  cabecalhoTabela.innerHTML = "";
  corpoTabela.innerHTML = "";

  const filtrosTabela = document.getElementById("filtrosTabela");
  if (filtrosTabela) filtrosTabela.innerHTML = "";

  planilhaAtual.colunas.forEach((campo) => {
    const th = document.createElement("th");
    const wrapper = document.createElement("div");
    wrapper.className = "cabecalho-campo";

    const ordenar = document.createElement("button");
    ordenar.type = "button";
    ordenar.className = "botao-ordenar-campo";

    const seta =
      estadoTabelaV6.ordemCampo === campo.id
        ? estadoTabelaV6.direcao === "asc"
          ? " ↑"
          : " ↓"
        : "";

    ordenar.textContent = `${campo.tipo === "calculo" ? "∑ " : ""}${campo.nome}${seta}`;
    ordenar.title =
      campo.tipo === "calculo" ? t("editor.autoField") : t("editor.rename");
    ordenar.onclick = () => ordenarTabelaPorCampo(campo.id);

    const menu = document.createElement("button");
    menu.type = "button";
    menu.className = "botao-menu-campo";
    menu.textContent = "⋮";
    menu.title = t("editor.actions");
    menu.onclick = (event) => abrirMenuCampo(event, campo.id);

    wrapper.append(ordenar, menu);
    th.appendChild(wrapper);
    cabecalhoTabela.appendChild(th);

    if (filtrosTabela) {
      const thFiltro = document.createElement("th");
      const filtro = document.createElement("input");
      filtro.className = "filtro-coluna";
      filtro.placeholder = t("table.filterPlaceholder");
      filtro.value = estadoTabelaV6.filtros[campo.id] || "";
      filtro.addEventListener("input", () =>
        atualizarFiltroCampo(campo.id, filtro.value),
      );
      thFiltro.appendChild(filtro);
      filtrosTabela.appendChild(thFiltro);
    }
  });

  const thAcoes = document.createElement("th");
  thAcoes.textContent = t("editor.actions");
  thAcoes.className = "coluna-acoes";
  cabecalhoTabela.appendChild(thAcoes);

  if (filtrosTabela) {
    const vazio = document.createElement("th");
    vazio.className = "coluna-acoes";
    filtrosTabela.appendChild(vazio);
  }

  linhasOrdenadasParaTabela().forEach(({ linha, indiceOriginal }) => {
    const tr = document.createElement("tr");
    tr.dataset.linhaIndex = String(indiceOriginal);

    planilhaAtual.colunas.forEach((campo) => {
      const td = document.createElement("td");
      const controle =
        campo.tipo === "calculo"
          ? criarControleCalculado(campo, linha)
          : criarControleEditavel(campo, linha, tr);

      td.appendChild(controle);
      tr.appendChild(td);
    });

    const tdExcluir = document.createElement("td");
    tdExcluir.className = "coluna-acoes";

    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = "🗑️";
    botao.title = t("common.delete");
    botao.onclick = () => excluirLinha(indiceOriginal);

    tdExcluir.appendChild(botao);
    tr.appendChild(tdExcluir);
    corpoTabela.appendChild(tr);
  });

  aplicarPersonalizacao();
  montarResumoModelo();
  montarGraficoModelo();
  aplicarFiltrosTabelaDOM();
  atualizarBotoesHistorico();
}

/*
    FUNÇÃO: atualizarCelulasCalculadasDaLinha()
    Atualiza visualmente apenas as células automáticas da linha que acabou de ser modificada.
*/
function atualizarCelulasCalculadasDaLinha(tr, linha) {
  if (!planilhaAtual) return;

  planilhaAtual.colunas
    .filter((campo) => campo.tipo === "calculo")
    .forEach((campo) => {
      const controle = tr.querySelector(`[data-campo-id="${campo.id}"]`);
      if (controle) controle.value = linha[campo.id] ?? "";
    });
}

/* ================================================= */
/* GRÁFICOS AUTOMÁTICOS */
/* ================================================= */

/*
    FUNÇÃO: somarPorRotulo()
    Agrupa e soma valores por um rótulo para preparar dados de gráficos.
*/
function somarPorRotulo(pares) {
  const mapa = new Map();

  pares.forEach(([rotulo, valor]) => {
    const chave = String(rotulo || "Sem identificação");
    mapa.set(chave, (mapa.get(chave) || 0) + numero(valor));
  });

  return [...mapa.entries()];
}

/*
    FUNÇÃO: dadosGraficoModelo()
    Monta os rótulos e valores usados no gráfico do modelo atual.
*/
function dadosGraficoModelo() {
  if (!planilhaAtual) return null;

  const modelo = planilhaAtual.modelo;
  const linhas = planilhaAtual.linhas.filter((linha) =>
    linhaTemDados(planilhaAtual, linha),
  );

  if (modelo === "financeiro") {
    let entradas = 0;
    let saidas = 0;

    linhas.forEach((linha) => {
      const tipo = normalizarTexto(
        valorPorPapel(planilhaAtual, linha, "tipo_movimento"),
      );
      const valor = numero(valorPorPapel(planilhaAtual, linha, "valor"));

      if (
        tipo.includes("entrada") ||
        tipo.includes("receita") ||
        tipo.includes("income")
      ) {
        entradas += valor;
      }

      if (
        tipo.includes("saida") ||
        tipo.includes("despesa") ||
        tipo.includes("expense")
      ) {
        saidas += valor;
      }
    });

    return {
      titulo: t("chart.financial"),
      labels: [t("summary.income"), t("summary.expenses")],
      valores: [entradas, saidas],
    };
  }

  if (modelo === "orcamento") {
    const item = campoPorPapel(planilhaAtual, "item");
    if (!item) return null;

    const pares = linhas
      .map((linha) => [
        linha[item.id] || "Item",
        valorCalculo(planilhaAtual, linha, "total_orcamento"),
      ])
      .slice(0, 12);

    return {
      titulo: t("chart.budget"),
      labels: pares.map((p) => p[0]),
      valores: pares.map((p) => numero(p[1])),
    };
  }

  if (modelo === "estoque") {
    const produto = campoPorPapel(planilhaAtual, "produto");
    if (!produto) return null;

    const pares = linhas
      .map((linha) => [
        linha[produto.id] || "Produto",
        valorCalculo(planilhaAtual, linha, "potencial_venda"),
      ])
      .sort((a, b) => numero(b[1]) - numero(a[1]))
      .slice(0, 12);

    return {
      titulo: t("chart.stock"),
      labels: pares.map((p) => p[0]),
      valores: pares.map((p) => numero(p[1])),
    };
  }

  if (modelo === "vendas") {
    const vendedor = campoPorPapel(planilhaAtual, "vendedor");
    if (!vendedor) return null;

    const agregados = somarPorRotulo(
      linhas.map((linha) => [
        linha[vendedor.id] || "Vendedor",
        valorCalculo(planilhaAtual, linha, "total_venda"),
      ]),
    );

    return {
      titulo: t("chart.sales"),
      labels: agregados.map((p) => p[0]),
      valores: agregados.map((p) => p[1]),
    };
  }

  if (modelo === "notas") {
    const aluno = campoPorPapel(planilhaAtual, "aluno");
    if (!aluno) return null;

    const pares = linhas
      .map((linha) => [
        linha[aluno.id] || "Aluno",
        calcularMediaNotas(planilhaAtual, linha),
      ])
      .filter((p) => valorNaoVazio(p[1]))
      .slice(0, 20);

    return {
      titulo: t("chart.grades"),
      labels: pares.map((p) => p[0]),
      valores: pares.map((p) => numero(p[1])),
    };
  }

  if (modelo === "frequencia") {
    const aluno = campoPorPapel(planilhaAtual, "aluno");
    if (!aluno) return null;

    const pares = linhas
      .map((linha) => [
        linha[aluno.id] || "Aluno",
        calcularCampo(planilhaAtual, linha, {
          calculo: "frequencia_percentual",
        }),
      ])
      .filter((p) => valorNaoVazio(p[1]))
      .slice(0, 20);

    return {
      titulo: t("chart.attendance"),
      labels: pares.map((p) => p[0]),
      valores: pares.map((p) => numero(p[1])),
    };
  }

  if (modelo === "estudos") {
    const disciplina = campoPorPapel(planilhaAtual, "disciplina");
    if (!disciplina) return null;

    const pares = linhas
      .map((linha) => [
        linha[disciplina.id] || "Disciplina",
        calcularCampo(planilhaAtual, linha, { calculo: "progresso_estudos" }),
      ])
      .filter((p) => valorNaoVazio(p[1]))
      .slice(0, 20);

    return {
      titulo: t("chart.study"),
      labels: pares.map((p) => p[0]),
      valores: pares.map((p) => numero(p[1])),
    };
  }

  return null;
}

/*
    FUNÇÃO: montarGraficoModelo()
    Cria ou atualiza o gráfico automático usando Chart.js.
*/
function montarGraficoModelo() {
  const area = document.getElementById("areaGrafico");
  const canvas = document.getElementById("graficoModelo");
  const titulo = document.getElementById("tituloGrafico");

  if (!area || !canvas || typeof Chart === "undefined" || !planilhaAtual)
    return;

  const dados = dadosGraficoModelo();

  if (graficoAtualV6) {
    graficoAtualV6.destroy();
    graficoAtualV6 = null;
  }

  if (!dados || dados.labels.length === 0) {
    area.classList.add("escondido");
    return;
  }

  area.classList.remove("escondido");
  if (titulo) titulo.textContent = dados.titulo;

  const estilos = getComputedStyle(document.documentElement);
  const texto = estilos.getPropertyValue("--texto").trim() || "#253746";
  const borda = estilos.getPropertyValue("--borda").trim() || "#d5e0e6";
  const azul = estilos.getPropertyValue("--azul").trim() || "#2788c7";
  const verde = estilos.getPropertyValue("--verde").trim() || "#2d8b82";

  graficoAtualV6 = new Chart(canvas, {
    type: "bar",
    data: {
      labels: dados.labels,
      datasets: [
        {
          label: dados.titulo,
          data: dados.valores,
          backgroundColor: dados.valores.map((_, indice) =>
            indice % 2 === 0 ? azul : verde,
          ),
          borderWidth: 0,
          borderRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 220 },
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          ticks: { color: texto, maxRotation: 45, minRotation: 0 },
          grid: { color: borda },
        },
        y: {
          beginAtZero: true,
          ticks: { color: texto },
          grid: { color: borda },
        },
      },
    },
  });
}

/* ================================================= */
/* LINHAS COM HISTÓRICO */
/* ================================================= */

/*
    FUNÇÃO: adicionarLinha()
    Adiciona um novo registro vazio à planilha e registra a ação no histórico.
*/
function adicionarLinha() {
  if (!planilhaAtual) return;

  registrarHistorico();

  const novaLinha = {};
  planilhaAtual.colunas.forEach((campo) => {
    novaLinha[campo.id] = "";
  });

  planilhaAtual.linhas.push(novaLinha);
  atualizarCalculosLinha(planilhaAtual, novaLinha);
  salvar();
  montarTabela();
}

/*
    FUNÇÃO: excluirLinha()
    Pede confirmação e remove um registro da planilha.
*/
async function excluirLinha(indice) {
  if (!planilhaAtual) return;
  if (!(await confirmarAcao(t("common.confirmDeleteRow")))) return;

  registrarHistorico();
  planilhaAtual.linhas.splice(indice, 1);
  salvar();
  montarTabela();
}

/* ================================================= */
/* CONFIGURADOR / EDITOR DE CAMPOS */
/* ================================================= */

/*
    FUNÇÃO: abrirModalCampoBase()
    Prepara o modal de campo para criação ou edição.
*/
function abrirModalCampoBase(campo = null) {
  if (!planilhaAtual || !modalCampo) return;

  const editando = Boolean(campo);
  document.getElementById("campoEditandoId").value = campo?.id || "";
  document.getElementById("novoCampo").value = campo?.nome || "";
  document.getElementById("tipoCampoNovo").value = campo?.tipo || "info";
  document.getElementById("tipoDadoCampoNovo").value =
    campo?.tipoDado || "texto";
  document.getElementById("opcoesCampoNovo").value = (campo?.opcoes || []).join(
    ", ",
  );
  document.getElementById("minCampoNovo").value = campo?.min ?? "";
  document.getElementById("maxCampoNovo").value = campo?.max ?? "";

  const titulo = modalCampo.querySelector(".titulo-modal h2");
  const salvarBotao = modalCampo.querySelector("footer .principal");
  if (titulo)
    titulo.textContent = editando
      ? t("field.edit").replace("✎ ", "")
      : t("field.title");
  if (salvarBotao)
    salvarBotao.textContent = editando ? t("common.confirm") : t("field.add");

  atualizarOpcoesCampo(campo);
  atualizarPosicoesCampo(campo?.id || null);
  atualizarConfiguracaoTipoDado();

  modalCampo.showModal();
}

/*
    FUNÇÃO: adicionarColuna()
    Abre o configurador completo para criar um novo campo.
*/
function adicionarColuna() {
  abrirModalCampoBase(null);
}

/*
    FUNÇÃO: editarCampo()
    Abre o configurador já preenchido com os dados de um campo existente.
*/
function editarCampo(campoId) {
  if (!planilhaAtual) return;
  const campo = planilhaAtual.colunas.find((item) => item.id === campoId);
  if (!campo) return;
  abrirModalCampoBase(campo);
}

/*
    FUNÇÃO: atualizarOpcoesCampo()
    Atualiza as funções disponíveis no configurador conforme o modelo e o tipo do campo.
*/
function atualizarOpcoesCampo(campoOriginal = null) {
  if (!planilhaAtual) return;

  const tipo = document.getElementById("tipoCampoNovo")?.value || "info";
  const select = document.getElementById("funcaoCampoNovo");
  if (!select) return;

  const valorAnterior = campoOriginal
    ? campoOriginal.tipo === "calculo"
      ? campoOriginal.calculo
      : campoOriginal.papel
    : select.value;

  select.innerHTML = "";

  const modelo = planilhaAtual.modelo || "vazio";
  const opcoes =
    tipo === "info"
      ? papeisPorModelo[modelo] || papeisPorModelo.vazio
      : [
          ...(calculosPorModelo[modelo] || []),
          ["soma_linha", "field.sum"],
          ["media_linha", "field.average"],
          ["produto_linha", "field.product"],
        ];

  opcoes.forEach(([valor, chave]) => {
    const option = document.createElement("option");
    option.value = valor;
    option.textContent = t(chave);
    select.appendChild(option);
  });

  if ([...select.options].some((opcao) => opcao.value === valorAnterior)) {
    select.value = valorAnterior;
  }

  select.onchange = () => {
    sugerirTipoDadoPelaFuncao();
    atualizarConfiguracaoTipoDado();
  };

  const tipoDado = document.getElementById("tipoDadoCampoNovo");
  if (tipoDado) tipoDado.disabled = tipo === "calculo";

  if (!campoOriginal) sugerirTipoDadoPelaFuncao();
  atualizarConfiguracaoTipoDado();
}

/*
    FUNÇÃO: sugerirTipoDadoPelaFuncao()
    Atualiza automaticamente o tipo de dado sugerido quando a função do campo muda.
*/
function sugerirTipoDadoPelaFuncao() {
  const tipo = document.getElementById("tipoCampoNovo")?.value || "info";
  const funcao = document.getElementById("funcaoCampoNovo")?.value || "geral";
  const tipoDado = document.getElementById("tipoDadoCampoNovo");
  if (!tipoDado) return;

  const temporario = normalizarCampoV6({
    id: "temporario",
    nome: "Campo",
    tipo,
    papel: tipo === "info" ? funcao : "geral",
    calculo: tipo === "calculo" ? funcao : null,
  });

  tipoDado.value = temporario.tipoDado;

  const min = document.getElementById("minCampoNovo");
  const max = document.getElementById("maxCampoNovo");
  const opcoes = document.getElementById("opcoesCampoNovo");

  if (min && temporario.min !== null) min.value = temporario.min;
  if (max && temporario.max !== null) max.value = temporario.max;
  if (opcoes && temporario.opcoes.length > 0)
    opcoes.value = temporario.opcoes.join(", ");
}

/*
    FUNÇÃO: atualizarConfiguracaoTipoDado()
    Mostra ou esconde opções específicas, como limites e itens de lista.
*/
function atualizarConfiguracaoTipoDado() {
  const tipo = document.getElementById("tipoCampoNovo")?.value || "info";
  const tipoDadoSelect = document.getElementById("tipoDadoCampoNovo");
  if (!tipoDadoSelect) return;

  if (tipo === "calculo") {
    const calculo = document.getElementById("funcaoCampoNovo")?.value;
    tipoDadoSelect.value = tipoDadoAutomaticoCalculo(calculo);
  }

  const tipoDado = tipoDadoSelect.value;
  const grupoOpcoes = document.getElementById("grupoOpcoesCampo");
  const grupoLimites = document.getElementById("grupoLimitesCampo");

  if (grupoOpcoes)
    grupoOpcoes.classList.toggle("escondido", tipoDado !== "lista");
  if (grupoLimites) {
    grupoLimites.classList.toggle(
      "escondido",
      !["numero", "moeda", "porcentagem"].includes(tipoDado),
    );
  }
}

/*
    FUNÇÃO: atualizarPosicoesCampo()
    Monta as opções de posição para inserir ou mover um campo.
*/
function atualizarPosicoesCampo(campoEditandoId = null) {
  if (!planilhaAtual) return;

  const select = document.getElementById("posicaoCampoNovo");
  if (!select) return;

  const colunas = planilhaAtual.colunas.filter(
    (campo) => campo.id !== campoEditandoId,
  );
  const indiceAtual = campoEditandoId
    ? planilhaAtual.colunas.findIndex((campo) => campo.id === campoEditandoId)
    : colunas.length;

  select.innerHTML = "";

  for (let indice = 0; indice <= colunas.length; indice++) {
    const option = document.createElement("option");
    option.value = String(indice);

    if (indice === 0) {
      option.textContent = t("field.positionStart");
    } else if (indice === colunas.length) {
      option.textContent = t("field.positionEnd");
    } else {
      option.textContent = `${t("field.positionBetween")} ${colunas[indice - 1].nome} / ${colunas[indice].nome}`;
    }

    select.appendChild(option);
  }

  select.value = String(Math.min(Math.max(indiceAtual, 0), colunas.length));
}

/*
    FUNÇÃO: salvarNovaColuna()
    Cria ou atualiza um campo com nome, tipo, função, validação e posição escolhidos.
*/
async function salvarNovaColuna(event) {
  event.preventDefault();
  if (!planilhaAtual) return;

  const idEditando = document.getElementById("campoEditandoId")?.value || "";
  const nome = document.getElementById("novoCampo").value.trim();
  const tipo = document.getElementById("tipoCampoNovo").value;
  const funcao = document.getElementById("funcaoCampoNovo").value;
  const tipoDado = document.getElementById("tipoDadoCampoNovo").value;
  const posicao = Number(document.getElementById("posicaoCampoNovo").value);
  const opcoesTexto = document.getElementById("opcoesCampoNovo").value;
  const minTexto = document.getElementById("minCampoNovo").value;
  const maxTexto = document.getElementById("maxCampoNovo").value;

  if (!nome) return;

  if (
    tipo === "info" &&
    !papeisRepetiveis.has(funcao) &&
    planilhaAtual.colunas.some(
      (campo) =>
        campo.id !== idEditando &&
        campo.tipo === "info" &&
        campo.papel === funcao,
    )
  ) {
    await mostrarAviso(t("field.repeatedRole"));
    return;
  }

  const opcoes = opcoesTexto
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (tipo === "info" && tipoDado === "lista" && opcoes.length === 0) {
    await mostrarAviso(t("field.listNeedsOptions"));
    return;
  }

  registrarHistorico();

  const campoExistente = idEditando
    ? planilhaAtual.colunas.find((campo) => campo.id === idEditando)
    : null;

  const novoCampo = normalizarCampoV6({
    id: campoExistente?.id || criarIdCampo(),
    nome,
    tipo,
    papel: tipo === "info" ? funcao : "geral",
    calculo: tipo === "calculo" ? funcao : null,
    tipoDado: tipo === "calculo" ? tipoDadoAutomaticoCalculo(funcao) : tipoDado,
    opcoes,
    min: minTexto === "" ? null : Number(minTexto),
    max: maxTexto === "" ? null : Number(maxTexto),
  });

  if (campoExistente) {
    const indiceAntigo = planilhaAtual.colunas.findIndex(
      (campo) => campo.id === idEditando,
    );
    planilhaAtual.colunas.splice(indiceAntigo, 1);
    planilhaAtual.colunas.splice(posicao, 0, novoCampo);
  } else {
    planilhaAtual.colunas.splice(posicao, 0, novoCampo);
    planilhaAtual.linhas.forEach((linha) => {
      linha[novoCampo.id] = "";
    });
  }

  if (novoCampo.tipo === "calculo") {
    planilhaAtual.linhas.forEach((linha) => {
      linha[novoCampo.id] = "";
    });
  }

  atualizarTodosCalculos();
  salvar();
  fecharMenuCampo();
  modalCampo.close();
  montarTabela();
  mostrarToast(
    t(campoExistente ? "field.updated" : "field.created"),
    "sucesso",
  );
}

/* ================================================= */
/* MENU DO CABEÇALHO: EDITAR / MOVER / EXCLUIR */
/* ================================================= */

/*
    FUNÇÃO: abrirMenuCampo()
    Abre o menu de ações de uma coluna próximo ao botão clicado.
*/
function abrirMenuCampo(event, campoId) {
  event.stopPropagation();
  const menu = document.getElementById("menuCampo");
  if (!menu) return;

  campoSelecionadoIdV6 = campoId;
  menu.classList.remove("escondido");

  const rect = event.currentTarget.getBoundingClientRect();
  const largura = 216;
  const margem = 10;
  const esquerda = Math.min(rect.left, window.innerWidth - largura - margem);
  const topo = Math.min(
    rect.bottom + 6,
    window.innerHeight - menu.offsetHeight - margem,
  );

  menu.style.left = `${Math.max(margem, esquerda)}px`;
  menu.style.top = `${Math.max(margem, topo)}px`;
}

/*
    FUNÇÃO: fecharMenuCampo()
    Fecha o menu de ações de coluna.
*/
function fecharMenuCampo() {
  const menu = document.getElementById("menuCampo");
  if (menu) menu.classList.add("escondido");
}

/*
    FUNÇÃO: editarCampoSelecionado()
    Abre a edição do campo atualmente selecionado no menu.
*/
function editarCampoSelecionado() {
  if (!campoSelecionadoIdV6) return;
  const id = campoSelecionadoIdV6;
  fecharMenuCampo();
  editarCampo(id);
}

/*
    FUNÇÃO: moverCampoSelecionado()
    Move a coluna selecionada para a esquerda ou direita.
*/
function moverCampoSelecionado(direcao) {
  if (!planilhaAtual || !campoSelecionadoIdV6) return;

  const indice = planilhaAtual.colunas.findIndex(
    (campo) => campo.id === campoSelecionadoIdV6,
  );
  const novoIndice = indice + direcao;

  if (
    indice < 0 ||
    novoIndice < 0 ||
    novoIndice >= planilhaAtual.colunas.length
  ) {
    fecharMenuCampo();
    return;
  }

  registrarHistorico();
  const [campo] = planilhaAtual.colunas.splice(indice, 1);
  planilhaAtual.colunas.splice(novoIndice, 0, campo);
  salvar();
  fecharMenuCampo();
  montarTabela();
}

/*
    FUNÇÃO: excluirCampoSelecionado()
    Confirma e remove a coluna selecionada e seus dados.
*/
async function excluirCampoSelecionado() {
  if (!planilhaAtual || !campoSelecionadoIdV6) return;

  const id = campoSelecionadoIdV6;
  fecharMenuCampo();

  if (!(await confirmarAcao(t("field.deleteConfirm")))) return;

  registrarHistorico();
  planilhaAtual.colunas = planilhaAtual.colunas.filter(
    (campo) => campo.id !== id,
  );
  planilhaAtual.linhas.forEach((linha) => delete linha[id]);
  delete estadoTabelaV6.filtros[id];

  if (estadoTabelaV6.ordemCampo === id) estadoTabelaV6.ordemCampo = null;

  atualizarTodosCalculos();
  salvar();
  montarTabela();
}

/* mantém compatibilidade com o antigo duplo clique */
/*
    FUNÇÃO: renomearColuna()
    Mantém compatibilidade com o antigo duplo clique, encaminhando para o editor completo de campo.
*/
function renomearColuna(campoId) {
  editarCampo(campoId);
}

/* ================================================= */
/* NOME, EXCLUSÃO E PERSONALIZAÇÃO COM HISTÓRICO */
/* ================================================= */

/*
    FUNÇÃO: alterarNomePlanilha()
    Salva um novo nome digitado para a planilha atual.
*/
function alterarNomePlanilha() {
  if (!planilhaAtual) return;

  const input = document.getElementById("nomePlanilhaEditor");
  const novoNome = input.value.trim() || "Sem título";

  if (novoNome !== planilhaAtual.nome) registrarHistorico();
  planilhaAtual.nome = novoNome;
  input.value = planilhaAtual.nome;
  salvar();
}

/*
    FUNÇÃO: alterarPersonalizacao()
    Lê os controles de personalização, salva as mudanças e aplica na tabela.
*/
function alterarPersonalizacao() {
  if (!planilhaAtual) return;

  registrarHistorico();

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
    FUNÇÃO: restaurarPersonalizacao()
    Volta a aparência da planilha para o padrão do NexaGrid.
*/
async function restaurarPersonalizacao() {
  if (!planilhaAtual) return;
  if (!(await confirmarAcao(t("personalization.restoreConfirm")))) return;

  registrarHistorico();
  planilhaAtual.personalizacao = personalizacaoPadrao();
  salvar();
  carregarPersonalizacao();
  aplicarPersonalizacao();
}

/* ================================================= */
/* IMPORTAR XLSX / XLS / CSV */
/* ================================================= */

/*
    FUNÇÃO: selecionarArquivoImportacao()
    Abre o seletor de arquivo usado para importar XLSX, XLS ou CSV.
*/
function selecionarArquivoImportacao() {
  document.getElementById("arquivoImportacao")?.click();
}

/*
    FUNÇÃO: nomeCampoUnico()
    Garante nomes de campos únicos ao importar uma planilha externa.
*/
function nomeCampoUnico(nome, usados, indice) {
  let base = String(nome || "").trim() || `Campo ${indice + 1}`;
  let resultado = base;
  let contador = 2;

  while (usados.has(normalizarTexto(resultado))) {
    resultado = `${base} ${contador}`;
    contador++;
  }

  usados.add(normalizarTexto(resultado));
  return resultado;
}

/*
    FUNÇÃO: inferirTipoDadoValores()
    Analisa os valores importados e tenta identificar se são texto, número ou data.
*/
function inferirTipoDadoValores(valores) {
  const preenchidos = valores.filter((valor) => valorNaoVazio(valor));
  if (preenchidos.length === 0) return "texto";

  const todosNumericos = preenchidos.every(
    (valor) => numeroOuNull(valor) !== null,
  );
  if (todosNumericos) return "numero";

  const padraoData = /^(\d{4}-\d{2}-\d{2}|\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4})$/;
  if (preenchidos.every((valor) => padraoData.test(String(valor).trim())))
    return "data";

  return "texto";
}

/*
    FUNÇÃO: importarPlanilhaArquivo()
    Lê XLSX/XLS/CSV e transforma a primeira folha em uma planilha do NexaGrid.
*/
async function importarPlanilhaArquivo(event) {
  const input = event.target;
  const arquivo = input.files?.[0];
  input.value = "";

  if (!arquivo) return;

  if (typeof XLSX === "undefined") {
    await mostrarAviso(t("import.library"));
    return;
  }

  try {
    const bytes = await arquivo.arrayBuffer();
    const workbook = XLSX.read(bytes, { type: "array", cellDates: true });
    const nomeAba = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[nomeAba];

    let dados = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: "",
      raw: false,
    });

    dados = dados.filter((linha) =>
      linha.some((valor) => valorNaoVazio(valor)),
    );

    if (dados.length === 0) {
      await mostrarAviso(t("import.empty"));
      return;
    }

    const maiorQuantidadeColunas = Math.max(
      ...dados.map((linha) => linha.length),
    );
    const cabecalhoOriginal = dados[0];
    const usados = new Set();

    const colunas = new Array(maiorQuantidadeColunas)
      .fill(null)
      .map((_, indice) => {
        const nome = nomeCampoUnico(cabecalhoOriginal[indice], usados, indice);
        const valores = dados.slice(1).map((linha) => linha[indice] ?? "");

        return normalizarCampoV6({
          id: criarIdCampo(),
          nome,
          tipo: "info",
          papel: "geral",
          tipoDado: inferirTipoDadoValores(valores),
        });
      });

    const linhas = dados.slice(1).map((linhaArray) => {
      const linha = {};
      colunas.forEach((campo, indice) => {
        linha[campo.id] = linhaArray[indice] ?? "";
      });
      return linha;
    });

    const nomeArquivo = arquivo.name.replace(/\.(xlsx|xls|csv)$/i, "");

    const novaPlanilha = {
      id: String(Date.now()),
      nome: nomeArquivo || "Planilha importada",
      tipo: "excel",
      modelo: "vazio",
      colunas,
      linhas,
      criadaEm: new Date().toISOString(),
      personalizacao: personalizacaoPadrao(),
    };

    planilhas.push(novaPlanilha);
    salvar();
    carregarDashboard();
    mostrarToast(t("import.success"), "sucesso");
    abrirPlanilha(novaPlanilha.id);
  } catch (erro) {
    console.error(erro);
    await mostrarAviso(t("import.error"));
  }
}

/* ================================================= */
/* BACKUP E RESTAURAÇÃO JSON */
/* ================================================= */

/*
    FUNÇÃO: exportarBackup()
    Cria um arquivo JSON contendo as planilhas e configurações para backup.
*/
function exportarBackup() {
  const backup = {
    aplicativo: "NexaGrid",
    versao: 9,
    exportadoEm: new Date().toISOString(),
    configuracoes,
    planilhas,
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const data = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `${t("backup.fileName")}-${data}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/*
    FUNÇÃO: selecionarBackup()
    Abre o seletor para escolher um arquivo JSON de backup.
*/
function selecionarBackup() {
  document.getElementById("arquivoBackup")?.click();
}

/*
    FUNÇÃO: importarBackup()
    Valida e restaura as informações existentes em um backup JSON.
*/
async function importarBackup(event) {
  const input = event.target;
  const arquivo = input.files?.[0];
  input.value = "";
  if (!arquivo) return;

  try {
    const texto = await arquivo.text();
    const backup = JSON.parse(texto);

    if (
      backup?.aplicativo !== "NexaGrid" ||
      !Array.isArray(backup.planilhas) ||
      !backup.configuracoes
    ) {
      await mostrarAviso(t("settings.backupInvalid"));
      return;
    }

    if (!(await confirmarAcao(t("settings.backupConfirm")))) return;

    planilhas = backup.planilhas;
    configuracoes = {
      ...configuracoesPadrao,
      ...backup.configuracoes,
    };

    localStorage.setItem(CHAVE_CONFIGURACOES, JSON.stringify(configuracoes));
    migrarPlanilhas();
    salvar();

    await mostrarAviso(t("settings.backupRestored"));
    window.location.href = "index.html";
  } catch (erro) {
    console.error(erro);
    await mostrarAviso(t("settings.backupInvalid"));
  }
}

/* ================================================= */
/* FÓRMULAS DO EXCEL ATUALIZADAS */
/* ================================================= */

/*
    FUNÇÃO: formulaExcelCampo()
    Gera uma fórmula de Excel dinâmica conforme a função do campo e sua posição atual.
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

    return `IF(COUNTA(${lista})=${notas.length},IF(AVERAGE(${lista})>=${Number(configuracoes.mediaAprovacao)},"Aprovado","Reprovado"),"")`;
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
    const frequencia = `(MAX(${totalAulas}${linhaExcel}-${faltas}${linhaExcel},0)/${totalAulas}${linhaExcel}*100)`;

    if (calc === "frequencia_percentual") {
      return `IF(${totalAulas}${linhaExcel}>0,${frequencia},"")`;
    }

    return `IF(${totalAulas}${linhaExcel}>0,IF(${frequencia}>=${Number(configuracoes.frequenciaMinima)},"Regular","Atenção"),"")`;
  }

  if (calc === "progresso_estudos" && horasPlanejadas && horasEstudadas) {
    return `IF(${horasPlanejadas}${linhaExcel}>0,${horasEstudadas}${linhaExcel}/${horasPlanejadas}${linhaExcel}*100,"")`;
  }

  const referenciasInfo = planilha.colunas
    .filter((outro) => outro.tipo === "info" && campoEhNumerico(outro))
    .map((outro) => `${colunaExcelCampo(planilha, outro.id)}${linhaExcel}`);

  if (referenciasInfo.length === 0) return null;
  const lista = referenciasInfo.join(",");

  if (calc === "soma_linha") return `SUM(${lista})`;
  if (calc === "media_linha")
    return `IF(COUNT(${lista})>0,AVERAGE(${lista}),"")`;
  if (calc === "produto_linha")
    return `IF(COUNT(${lista})>0,PRODUCT(${lista}),"")`;

  return null;
}

/* ================================================= */
/* PERSONALIZAÇÃO TAMBÉM NOS NOVOS CONTROLES */
/* ================================================= */

/*
    FUNÇÃO: aplicarPersonalizacao()
    Aplica cores, fonte, bordas e alinhamento diretamente na tabela renderizada.
*/
function aplicarPersonalizacao() {
  if (!planilhaAtual || !cabecalhoTabela || !corpoTabela || !tabelaPlanilha)
    return;

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

  corpoTabela.querySelectorAll("input, select").forEach((controle) => {
    controle.style.color = p.corTexto;
    controle.style.fontSize = `${p.tamanhoFonte}px`;
    controle.style.textAlign = p.alinhamento;

    if (!controle.classList.contains("campo-calculado")) {
      controle.style.backgroundColor = p.corCelulas;
    }
  });

  tabelaPlanilha.classList.remove("modo-grade", "modo-tabela");
  tabelaPlanilha.classList.add(
    p.estilo === "tabela" ? "modo-tabela" : "modo-grade",
  );
}

/* ================================================= */
/* EVENTOS GERAIS DA V6 */
/* ================================================= */

document.addEventListener("click", (event) => {
  if (
    !event.target.closest("#menuCampo") &&
    !event.target.closest(".botao-menu-campo")
  ) {
    fecharMenuCampo();
  }
});

window.addEventListener("resize", fecharMenuCampo);
window.addEventListener("scroll", fecharMenuCampo, true);

/* ================================================= */
/* INICIALIZAÇÃO V6 */
/* ================================================= */

aplicarConfiguracoes();
migrarPlanilhas();
carregarDashboard();

const parametros = new URLSearchParams(window.location.search);

if (parametros.get("nova") === "1" && modalCriacao) {
  abrirCriacao();
}

/* ================================================= */
/* MELHORIAS VISUAIS V7: PAINEL RÁPIDO + SELECTS */
/* ================================================= */

/*
    FUNÇÃO: rolarParaPersonalizacao()
    Rola suavemente até a seção completa de personalização.
*/
function rolarParaPersonalizacao() {
  document.querySelector(".personalizacao")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

/*
    FUNÇÃO: sincronizarPainelRapidoPlanilha()
    Mantém as cores do painel rápido sincronizadas com a personalização principal.
*/
function sincronizarPainelRapidoPlanilha() {
  const pares = [
    ["corRapidaCabecalho", "corCabecalho"],
    ["corRapidaTexto", "corTexto"],
    ["corRapidaCelulas", "corCelulas"],
    ["corRapidaBorda", "corBorda"],
  ];

  pares.forEach(([rapidoId, originalId]) => {
    const rapido = document.getElementById(rapidoId);
    const original = document.getElementById(originalId);
    if (rapido && original) rapido.value = original.value;
  });
}

/*
    FUNÇÃO: alterarPersonalizacaoRapida()
    Copia as cores escolhidas no painel rápido para os controles principais e salva.
*/
function alterarPersonalizacaoRapida() {
  const pares = [
    ["corRapidaCabecalho", "corCabecalho"],
    ["corRapidaTexto", "corTexto"],
    ["corRapidaCelulas", "corCelulas"],
    ["corRapidaBorda", "corBorda"],
  ];

  pares.forEach(([rapidoId, originalId]) => {
    const rapido = document.getElementById(rapidoId);
    const original = document.getElementById(originalId);
    if (rapido && original) original.value = rapido.value;
  });

  alterarPersonalizacao();
}

/*
    FUNÇÃO: construirMenuSelectNexa()
    Transforma um select nativo em um menu visual personalizado com o tema do NexaGrid.
*/
function construirMenuSelectNexa(select) {
  if (!select) return;

  if (!select.id) {
    select.id = `nexaSelect_${Math.random().toString(36).slice(2, 10)}`;
  }

  let wrapper = select.nextElementSibling;
  const precisaCriar =
    !wrapper || !wrapper.classList.contains("select-nativo-nexa");

  if (precisaCriar) {
    wrapper = document.createElement("div");
    wrapper.className = "select-personalizado select-nativo-nexa";
    wrapper.dataset.input = select.id;

    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "select-personalizado-botao";
    botao.setAttribute("aria-expanded", "false");
    botao.innerHTML = `
      <span class="select-personalizado-valor"></span>
      <span class="select-personalizado-seta">⌄</span>
    `;
    botao.addEventListener("click", (event) => {
      event.stopPropagation();
      alternarMenuConfiguracao(botao);
    });

    const menu = document.createElement("div");
    menu.className = "select-personalizado-menu";

    wrapper.appendChild(botao);
    wrapper.appendChild(menu);
    select.insertAdjacentElement("afterend", wrapper);

    select.addEventListener("change", () => sincronizarSelectNexa(select));
    select.classList.add("nexa-select-original");
    select.dataset.nexaCustomizado = "1";
  }

  wrapper.dataset.input = select.id;
  preencherMenuSelectNexa(select, wrapper);
}

/*
    FUNÇÃO: preencherMenuSelectNexa()
    Cria os botões do menu personalizado a partir das opções do select original.
*/
function preencherMenuSelectNexa(select, wrapper) {
  const menu = wrapper.querySelector(".select-personalizado-menu");
  if (!menu) return;

  menu.innerHTML = "";

  Array.from(select.options).forEach((option) => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.dataset.value = option.value;
    botao.textContent = option.textContent;
    botao.classList.toggle("ativo", option.value === select.value);

    botao.addEventListener("click", () => {
      select.value = option.value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      wrapper.classList.remove("aberto");
      const gatilho = wrapper.querySelector(".select-personalizado-botao");
      if (gatilho) gatilho.setAttribute("aria-expanded", "false");
      sincronizarSelectNexa(select);
    });

    menu.appendChild(botao);
  });

  sincronizarSelectNexa(select);
}

/*
    FUNÇÃO: sincronizarSelectNexa()
    Atualiza texto e opção ativa do menu personalizado quando o valor muda.
*/
function sincronizarSelectNexa(select) {
  if (!select) return;
  const wrapper = select.nextElementSibling;
  if (!wrapper || !wrapper.classList.contains("select-nativo-nexa")) return;

  const texto = wrapper.querySelector(".select-personalizado-valor");
  const opcoes = wrapper.querySelectorAll(".select-personalizado-menu button");
  const selecionada = select.options[select.selectedIndex];

  if (texto) {
    texto.textContent = selecionada ? selecionada.textContent : "";
  }

  opcoes.forEach((botao) => {
    botao.classList.toggle("ativo", botao.dataset.value === select.value);
  });
}

/*
    FUNÇÃO: inicializarSelectsNexa()
    Procura selects marcados para personalização e converte todos para o componente visual do NexaGrid.
*/
function inicializarSelectsNexa(raiz = document) {
  raiz.querySelectorAll("select.nexa-select").forEach((select) => {
    construirMenuSelectNexa(select);
  });
}

(function aplicarMelhoriasVisuaisV7() {
  const montarTabelaOriginalV7 =
    typeof montarTabela === "function" ? montarTabela : null;
  if (montarTabelaOriginalV7) {
    montarTabela = function (...args) {
      const resultado = montarTabelaOriginalV7.apply(this, args);
      sincronizarPainelRapidoPlanilha();
      inicializarSelectsNexa(document);
      return resultado;
    };
  }

  const carregarDashboardOriginalV7 =
    typeof carregarDashboard === "function" ? carregarDashboard : null;
  if (carregarDashboardOriginalV7) {
    carregarDashboard = function (...args) {
      const resultado = carregarDashboardOriginalV7.apply(this, args);
      inicializarSelectsNexa(document);
      return resultado;
    };
  }

  const carregarPersonalizacaoOriginalV7 =
    typeof carregarPersonalizacao === "function"
      ? carregarPersonalizacao
      : null;
  if (carregarPersonalizacaoOriginalV7) {
    carregarPersonalizacao = function (...args) {
      const resultado = carregarPersonalizacaoOriginalV7.apply(this, args);
      sincronizarPainelRapidoPlanilha();
      inicializarSelectsNexa(document);
      return resultado;
    };
  }

  const alterarPersonalizacaoOriginalV7 =
    typeof alterarPersonalizacao === "function" ? alterarPersonalizacao : null;
  if (alterarPersonalizacaoOriginalV7) {
    alterarPersonalizacao = function (...args) {
      const resultado = alterarPersonalizacaoOriginalV7.apply(this, args);
      sincronizarPainelRapidoPlanilha();
      inicializarSelectsNexa(document);
      return resultado;
    };
  }

  const restaurarPersonalizacaoOriginalV7 =
    typeof restaurarPersonalizacao === "function"
      ? restaurarPersonalizacao
      : null;
  if (restaurarPersonalizacaoOriginalV7) {
    restaurarPersonalizacao = async function (...args) {
      const resultado = await restaurarPersonalizacaoOriginalV7.apply(
        this,
        args,
      );
      sincronizarPainelRapidoPlanilha();
      inicializarSelectsNexa(document);
      return resultado;
    };
  }

  const atualizarOpcoesCampoOriginalV7 =
    typeof atualizarOpcoesCampo === "function" ? atualizarOpcoesCampo : null;
  if (atualizarOpcoesCampoOriginalV7) {
    atualizarOpcoesCampo = function (...args) {
      const resultado = atualizarOpcoesCampoOriginalV7.apply(this, args);
      inicializarSelectsNexa(document.getElementById("modalCampo") || document);
      return resultado;
    };
  }

  const atualizarPosicoesCampoOriginalV7 =
    typeof atualizarPosicoesCampo === "function"
      ? atualizarPosicoesCampo
      : null;
  if (atualizarPosicoesCampoOriginalV7) {
    atualizarPosicoesCampo = function (...args) {
      const resultado = atualizarPosicoesCampoOriginalV7.apply(this, args);
      inicializarSelectsNexa(document.getElementById("modalCampo") || document);
      return resultado;
    };
  }

  inicializarSelectsNexa(document);
  sincronizarPainelRapidoPlanilha();
})();

/* ================================================= */
/* V9 - IMPORTAÇÃO COM FORMATAÇÃO DO EXCEL */
/* ================================================= */

/*
    OBJETIVO DESTA ÁREA
    ------------------

    Antes, ao importar uma planilha, o NexaGrid copiava apenas os dados.
    Isso fazia uma tabela que tinha cores, fontes, negrito, alinhamento e
    tamanhos de coluna no Excel perder praticamente toda a aparência.

    A partir da V9, cada planilha importada pode guardar também:

    - estilo do cabeçalho;
    - estilo de cada célula;
    - cor de fundo;
    - cor e nome da fonte;
    - tamanho da fonte;
    - negrito, itálico e sublinhado;
    - alinhamento;
    - bordas;
    - largura das colunas;
    - altura das linhas.

    IMPORTANTE:
    arquivos CSV não possuem informações visuais. Nesse caso o NexaGrid
    importa os dados normalmente e usa a aparência padrão do sistema.
*/

/*
    FUNÇÃO: clonarObjetoSeguro()

    Cria uma cópia simples de um objeto.
    É usada para guardar estilos do Excel sem manter referências internas
    da biblioteca XLSX.
*/
function clonarObjetoSeguro(valor) {
  if (valor === null || valor === undefined) return null;

  try {
    return JSON.parse(JSON.stringify(valor));
  } catch (erro) {
    return null;
  }
}

/*
    FUNÇÃO: compactarEstiloExcel()

    Recebe o objeto de estilo de uma célula do XLSX e mantém somente as
    propriedades que o NexaGrid realmente consegue usar.

    Isso evita salvar objetos enormes no localStorage.
*/
function compactarEstiloExcel(estilo) {
  if (!estilo || typeof estilo !== "object" || Array.isArray(estilo)) {
    return null;
  }

  const resultado = {};

  if (estilo.font) {
    resultado.font = clonarObjetoSeguro(estilo.font);
  }

  if (estilo.fill) {
    resultado.fill = clonarObjetoSeguro(estilo.fill);
  }

  if (estilo.alignment) {
    resultado.alignment = clonarObjetoSeguro(estilo.alignment);
  }

  if (estilo.border) {
    resultado.border = clonarObjetoSeguro(estilo.border);
  }

  /*
      numFmt representa formatos como moeda, porcentagem e data.
      Guardamos quando a biblioteca disponibilizar essa informação.
  */
  if (estilo.numFmt !== undefined) {
    resultado.numFmt = clonarObjetoSeguro(estilo.numFmt);
  }

  return Object.keys(resultado).length > 0 ? resultado : null;
}

/*
    FUNÇÃO: registrarEstiloImportado()

    Muitas células usam exatamente o mesmo estilo.
    Em vez de salvar o mesmo objeto dezenas de vezes, criamos uma pequena
    biblioteca de estilos e cada célula guarda apenas o índice dela.

    Isso reduz bastante o tamanho salvo no localStorage.
*/
function registrarEstiloImportado(estilo, biblioteca, mapa) {
  const compacto = compactarEstiloExcel(estilo);
  if (!compacto) return null;

  const chave = JSON.stringify(compacto);

  if (mapa.has(chave)) {
    return mapa.get(chave);
  }

  const indice = biblioteca.length;
  biblioteca.push(compacto);
  mapa.set(chave, indice);
  return indice;
}

/*
    FUNÇÃO: obterCorRgbExcel()

    O Excel pode guardar cores como AARRGGBB ou RRGGBB.
    Para o CSS precisamos somente dos seis últimos caracteres RGB.

    Cores baseadas em "theme" podem depender do tema interno do arquivo.
    Quando a biblioteca não entrega o RGB final, retornamos null e usamos
    a cor padrão do NexaGrid como fallback.
*/
function obterCorRgbExcel(cor) {
  if (!cor || typeof cor !== "object") return null;

  if (cor.rgb) {
    const texto = String(cor.rgb).replace("#", "").toUpperCase();
    return texto.length >= 6 ? texto.slice(-6) : null;
  }

  /* algumas planilhas simples podem usar cores indexadas */
  const coresIndexadas = {
    0: "000000",
    1: "FFFFFF",
    2: "FF0000",
    3: "00FF00",
    4: "0000FF",
    5: "FFFF00",
    6: "FF00FF",
    7: "00FFFF",
    8: "000000",
    9: "FFFFFF",
    10: "FF0000",
    11: "00FF00",
    12: "0000FF",
    13: "FFFF00",
    14: "FF00FF",
    15: "00FFFF",
  };

  if (cor.indexed !== undefined && coresIndexadas[cor.indexed]) {
    return coresIndexadas[cor.indexed];
  }

  return null;
}

/*
    FUNÇÃO: corExcelParaCss()

    Transforma a cor extraída do Excel em uma cor CSS, por exemplo:
    FF0000 -> #FF0000
*/
function corExcelParaCss(cor) {
  const rgb = obterCorRgbExcel(cor);
  return rgb ? `#${rgb}` : null;
}

/*
    FUNÇÃO: estiloBordaExcelParaCss()

    Traduz os nomes de borda usados pelo Excel para uma borda CSS.
*/
function estiloBordaExcelParaCss(lado) {
  if (!lado || !lado.style) return null;

  const cor = corExcelParaCss(lado.color) || "currentColor";

  const mapa = {
    hair: `1px solid ${cor}`,
    thin: `1px solid ${cor}`,
    medium: `2px solid ${cor}`,
    thick: `3px solid ${cor}`,
    dotted: `1px dotted ${cor}`,
    dashed: `1px dashed ${cor}`,
    dashDot: `1px dashed ${cor}`,
    dashDotDot: `1px dashed ${cor}`,
    mediumDashed: `2px dashed ${cor}`,
    double: `3px double ${cor}`,
  };

  return mapa[lado.style] || `1px solid ${cor}`;
}

/*
    FUNÇÃO: aplicarEstiloExcelEmElemento()

    Aplica no HTML as propriedades visuais de uma célula importada.
    A função funciona tanto em cabeçalhos quanto em células comuns.
*/
function aplicarEstiloExcelEmElemento(elemento, estilo, opcoes = {}) {
  if (!elemento || !estilo) return;

  const { aplicarFundo = true, aplicarBorda = true } = opcoes;

  if (estilo.font) {
    const corFonte = corExcelParaCss(estilo.font.color);

    if (corFonte) elemento.style.color = corFonte;
    if (estilo.font.name) {
      elemento.style.fontFamily = `"${estilo.font.name}", Arial, sans-serif`;
    }
    if (estilo.font.sz) elemento.style.fontSize = `${estilo.font.sz}pt`;

    elemento.style.fontWeight = estilo.font.bold ? "700" : "400";
    elemento.style.fontStyle = estilo.font.italic ? "italic" : "normal";

    if (estilo.font.underline) {
      elemento.style.textDecoration = "underline";
    }
  }

  if (aplicarFundo && estilo.fill) {
    const corFundo =
      corExcelParaCss(estilo.fill.fgColor) ||
      corExcelParaCss(estilo.fill.bgColor);

    if (corFundo) elemento.style.backgroundColor = corFundo;
  }

  if (estilo.alignment) {
    const alinhamentos = {
      left: "left",
      center: "center",
      right: "right",
      fill: "left",
      justify: "justify",
      distributed: "justify",
    };

    if (estilo.alignment.horizontal) {
      elemento.style.textAlign =
        alinhamentos[estilo.alignment.horizontal] ||
        estilo.alignment.horizontal;
    }

    if (estilo.alignment.vertical) {
      const verticais = {
        top: "flex-start",
        center: "center",
        bottom: "flex-end",
      };

      elemento.style.verticalAlign = estilo.alignment.vertical;

      if (elemento.tagName === "INPUT" || elemento.tagName === "SELECT") {
        elemento.style.alignItems =
          verticais[estilo.alignment.vertical] || "center";
      }
    }

    if (estilo.alignment.wrapText === false) {
      elemento.style.whiteSpace = "nowrap";
    }
  }

  if (aplicarBorda && estilo.border) {
    const lados = ["top", "right", "bottom", "left"];

    lados.forEach((lado) => {
      const css = estiloBordaExcelParaCss(estilo.border[lado]);
      if (!css) return;

      const propriedade = `border${lado.charAt(0).toUpperCase()}${lado.slice(1)}`;
      elemento.style[propriedade] = css;
    });
  }
}

/*
    FUNÇÃO: obterEstiloDaBiblioteca()

    Converte um índice salvo na planilha novamente no objeto de estilo.
*/
function obterEstiloDaBiblioteca(planilha, indice) {
  if (
    indice === null ||
    indice === undefined ||
    !planilha?.aparenciaImportada?.estilos
  ) {
    return null;
  }

  return planilha.aparenciaImportada.estilos[indice] || null;
}

/*
    FUNÇÃO: aplicarLargurasImportadasNaTabela()

    Cria/atualiza um <colgroup> para que a tabela do navegador respeite,
    aproximadamente, a mesma largura das colunas do Excel.
*/
function aplicarLargurasImportadasNaTabela() {
  if (!planilhaAtual || !tabelaPlanilha) return;

  const aparencia = planilhaAtual.aparenciaImportada;
  if (!aparencia?.largurasColunas) return;

  let colgroup = tabelaPlanilha.querySelector("colgroup[data-importado='1']");

  if (!colgroup) {
    colgroup = document.createElement("colgroup");
    colgroup.dataset.importado = "1";
    tabelaPlanilha.insertBefore(colgroup, tabelaPlanilha.firstChild);
  }

  colgroup.innerHTML = "";

  planilhaAtual.colunas.forEach((campo) => {
    const col = document.createElement("col");
    const wch = aparencia.largurasColunas[campo.id];

    if (Number.isFinite(wch) && wch > 0) {
      /*
          Aproximação comum: um caractere do Excel ocupa cerca de 7 px.
          Adicionamos uma pequena folga para os controles do NexaGrid.
      */
      const pixels = Math.max(70, Math.round(wch * 7 + 16));
      col.style.width = `${pixels}px`;
      col.style.minWidth = `${pixels}px`;
    }

    colgroup.appendChild(col);
  });

  /* coluna extra usada pelos botões de ação */
  const acoes = document.createElement("col");
  acoes.style.width = "82px";
  colgroup.appendChild(acoes);
}

/*
    FUNÇÃO: aplicarEstilosImportadosNaTabela()

    É chamada DEPOIS da personalização padrão.
    Assim, nas planilhas importadas, o estilo original ganha prioridade.

    A função usa o índice original da linha salvo em data-linha-index,
    portanto continua funcionando mesmo depois de ordenar e filtrar.
*/
function aplicarEstilosImportadosNaTabela() {
  if (!planilhaAtual || !planilhaAtual.aparenciaImportada) return;

  const aparencia = planilhaAtual.aparenciaImportada;

  /* -------- cabeçalhos -------- */
  const cabecalhos = cabecalhoTabela?.querySelectorAll("th") || [];

  planilhaAtual.colunas.forEach((campo, indiceColuna) => {
    const th = cabecalhos[indiceColuna];
    if (!th) return;

    const indiceEstilo = aparencia.cabecalho?.[campo.id];
    const estilo = obterEstiloDaBiblioteca(planilhaAtual, indiceEstilo);

    aplicarEstiloExcelEmElemento(th, estilo);

    /* aplica fonte também no botão com o nome do campo */
    const botaoTitulo = th.querySelector(".botao-ordenar-campo");
    if (botaoTitulo && estilo) {
      aplicarEstiloExcelEmElemento(botaoTitulo, estilo, {
        aplicarFundo: false,
        aplicarBorda: false,
      });
    }
  });

  /* -------- células de dados -------- */
  corpoTabela?.querySelectorAll("tr").forEach((tr) => {
    const indiceLinha = Number(tr.dataset.linhaIndex);
    const estilosLinha = aparencia.linhas?.[indiceLinha];

    if (!estilosLinha) return;

    const celulas = tr.querySelectorAll("td");

    planilhaAtual.colunas.forEach((campo, indiceColuna) => {
      const td = celulas[indiceColuna];
      if (!td) return;

      const indiceEstilo = estilosLinha[campo.id];
      const estilo = obterEstiloDaBiblioteca(planilhaAtual, indiceEstilo);
      if (!estilo) return;

      aplicarEstiloExcelEmElemento(td, estilo);

      const controle = td.querySelector("input, select");

      if (controle) {
        aplicarEstiloExcelEmElemento(controle, estilo, {
          aplicarBorda: false,
        });

        /*
            o fundo fica no TD e no controle para não aparecer uma faixa
            branca dentro de uma célula colorida.
        */
        const corFundo =
          corExcelParaCss(estilo.fill?.fgColor) ||
          corExcelParaCss(estilo.fill?.bgColor);

        if (corFundo) controle.style.backgroundColor = corFundo;
      }
    });

    /* altura original da linha */
    const altura = aparencia.alturasLinhas?.[indiceLinha];

    if (Number.isFinite(altura) && altura > 0) {
      tr.style.height = `${Math.max(22, altura * 1.333)}px`;
    }
  });

  aplicarLargurasImportadasNaTabela();
}

/*
    FUNÇÃO: extrairPersonalizacaoBaseDoExcel()

    Além dos estilos individuais, tentamos criar uma personalização geral
    usando o primeiro cabeçalho e a primeira célula de dados.

    Isso serve como fallback para células sem estilo próprio.
*/
function extrairPersonalizacaoBaseDoExcel(worksheet, colunas) {
  const personalizacao = personalizacaoPadrao();

  const celulaCabecalho = worksheet[XLSX.utils.encode_cell({ r: 0, c: 0 })];
  const celulaDados = worksheet[XLSX.utils.encode_cell({ r: 1, c: 0 })];

  const estiloCabecalho = compactarEstiloExcel(celulaCabecalho?.s);
  const estiloDados = compactarEstiloExcel(celulaDados?.s);

  const fundoCabecalho =
    corExcelParaCss(estiloCabecalho?.fill?.fgColor) ||
    corExcelParaCss(estiloCabecalho?.fill?.bgColor);

  const textoCabecalho = corExcelParaCss(estiloCabecalho?.font?.color);
  const fundoDados =
    corExcelParaCss(estiloDados?.fill?.fgColor) ||
    corExcelParaCss(estiloDados?.fill?.bgColor);
  const textoDados = corExcelParaCss(estiloDados?.font?.color);

  if (fundoCabecalho) personalizacao.corCabecalho = fundoCabecalho;
  if (textoCabecalho) personalizacao.corTextoCabecalho = textoCabecalho;
  if (fundoDados) personalizacao.corCelulas = fundoDados;
  if (textoDados) personalizacao.corTexto = textoDados;

  if (estiloCabecalho?.font?.sz) {
    /* converte aproximadamente pontos do Excel para o seletor do NexaGrid */
    const tamanho = Math.round(Number(estiloCabecalho.font.sz));
    personalizacao.tamanhoFonte = String(Math.min(18, Math.max(12, tamanho)));
  }

  if (estiloCabecalho?.alignment?.horizontal) {
    const alinhamento = estiloCabecalho.alignment.horizontal;
    if (["left", "center", "right"].includes(alinhamento)) {
      personalizacao.alinhamento = alinhamento;
    }
  }

  return personalizacao;
}

/*
    FUNÇÃO: extrairAparenciaDoWorksheet()

    Lê a formatação de toda a primeira folha importada e transforma em uma
    estrutura compacta que pode ser salva junto com a planilha.
*/
function extrairAparenciaDoWorksheet(worksheet, colunas, quantidadeLinhas) {
  const estilos = [];
  const mapaEstilos = new Map();

  const cabecalho = {};
  const linhas = [];
  const largurasColunas = {};
  const alturasLinhas = [];

  /* estilo de cada cabeçalho */
  colunas.forEach((campo, indiceColuna) => {
    const endereco = XLSX.utils.encode_cell({ r: 0, c: indiceColuna });
    const celula = worksheet[endereco];
    const indiceEstilo = registrarEstiloImportado(
      celula?.s,
      estilos,
      mapaEstilos,
    );

    if (indiceEstilo !== null) {
      cabecalho[campo.id] = indiceEstilo;
    }

    const colunaOriginal = worksheet["!cols"]?.[indiceColuna];

    if (colunaOriginal) {
      const wch =
        Number(colunaOriginal.wch) ||
        (Number(colunaOriginal.wpx) ? Number(colunaOriginal.wpx) / 7 : null);

      if (Number.isFinite(wch) && wch > 0) {
        largurasColunas[campo.id] = wch;
      }
    }
  });

  /* estilos das linhas de dados */
  for (let indiceLinha = 0; indiceLinha < quantidadeLinhas; indiceLinha++) {
    const estilosLinha = {};
    const linhaExcel = indiceLinha + 1;

    colunas.forEach((campo, indiceColuna) => {
      const endereco = XLSX.utils.encode_cell({
        r: linhaExcel,
        c: indiceColuna,
      });

      const celula = worksheet[endereco];
      const indiceEstilo = registrarEstiloImportado(
        celula?.s,
        estilos,
        mapaEstilos,
      );

      if (indiceEstilo !== null) {
        estilosLinha[campo.id] = indiceEstilo;
      }
    });

    if (Object.keys(estilosLinha).length > 0) {
      linhas[indiceLinha] = estilosLinha;
    }

    const linhaOriginal = worksheet["!rows"]?.[linhaExcel];

    if (linhaOriginal) {
      const altura =
        Number(linhaOriginal.hpt) ||
        (Number(linhaOriginal.hpx) ? Number(linhaOriginal.hpx) * 0.75 : null);

      if (Number.isFinite(altura) && altura > 0) {
        alturasLinhas[indiceLinha] = altura;
      }
    }
  }

  const cabecalhoOriginal = worksheet["!rows"]?.[0];
  const alturaCabecalho =
    Number(cabecalhoOriginal?.hpt) ||
    (Number(cabecalhoOriginal?.hpx)
      ? Number(cabecalhoOriginal.hpx) * 0.75
      : null);

  return {
    versao: 1,
    estilos,
    cabecalho,
    linhas,
    largurasColunas,
    alturasLinhas,
    alturaCabecalho: Number.isFinite(alturaCabecalho) ? alturaCabecalho : null,
  };
}

/*
    FUNÇÃO: combinarEstiloExcel()

    Junta o estilo criado pelo NexaGrid com o estilo original importado.
    O estilo importado tem prioridade nas propriedades que ele possuir.
*/
function combinarEstiloExcel(base, importado) {
  if (!importado) return base;

  const resultado = clonarObjetoSeguro(base) || {};

  ["font", "fill", "alignment", "border"].forEach((chave) => {
    if (!importado[chave]) return;

    resultado[chave] = {
      ...(resultado[chave] || {}),
      ...clonarObjetoSeguro(importado[chave]),
    };
  });

  if (importado.numFmt !== undefined) {
    resultado.numFmt = clonarObjetoSeguro(importado.numFmt);
  }

  return resultado;
}

/*
    FUNÇÃO: aplicarAparenciaImportadaNoWorksheet()

    Depois que o NexaGrid gera o XLSX, reaplicamos os estilos que vieram
    do arquivo original. Dessa forma, abrir e exportar novamente a planilha
    não descarta a aparência importada.
*/
function aplicarAparenciaImportadaNoWorksheet(worksheet, planilha) {
  const aparencia = planilha?.aparenciaImportada;
  if (!worksheet || !aparencia) return worksheet;

  /* cabeçalhos */
  planilha.colunas.forEach((campo, indiceColuna) => {
    const endereco = XLSX.utils.encode_cell({ r: 0, c: indiceColuna });
    const celula = worksheet[endereco];
    if (!celula) return;

    const estilo = obterEstiloDaBiblioteca(
      planilha,
      aparencia.cabecalho?.[campo.id],
    );

    if (estilo) {
      celula.s = combinarEstiloExcel(celula.s, estilo);
    }
  });

  /* células */
  planilha.linhas.forEach((linha, indiceLinha) => {
    const estilosLinha = aparencia.linhas?.[indiceLinha];
    if (!estilosLinha) return;

    planilha.colunas.forEach((campo, indiceColuna) => {
      const estilo = obterEstiloDaBiblioteca(planilha, estilosLinha[campo.id]);
      if (!estilo) return;

      const endereco = XLSX.utils.encode_cell({
        r: indiceLinha + 1,
        c: indiceColuna,
      });

      const celula = worksheet[endereco];
      if (!celula) return;

      celula.s = combinarEstiloExcel(celula.s, estilo);
    });
  });

  /* larguras */
  worksheet["!cols"] = planilha.colunas.map((campo, indice) => {
    const larguraImportada = aparencia.largurasColunas?.[campo.id];

    if (Number.isFinite(larguraImportada) && larguraImportada > 0) {
      return { wch: larguraImportada };
    }

    return worksheet["!cols"]?.[indice] || { wch: 14 };
  });

  /* alturas */
  if (!worksheet["!rows"]) worksheet["!rows"] = [];

  if (Number.isFinite(aparencia.alturaCabecalho)) {
    worksheet["!rows"][0] = { hpt: aparencia.alturaCabecalho };
  }

  planilha.linhas.forEach((linha, indiceLinha) => {
    const altura = aparencia.alturasLinhas?.[indiceLinha];

    if (Number.isFinite(altura) && altura > 0) {
      worksheet["!rows"][indiceLinha + 1] = { hpt: altura };
    }
  });

  return worksheet;
}

/* ================================================= */
/* SUBSTITUIÇÃO DA IMPORTAÇÃO ANTIGA */
/* ================================================= */

/*
    FUNÇÃO: importarPlanilhaArquivo() - V9

    Esta versão substitui a função anterior.

    Diferença principal:
    XLSX.read agora recebe cellStyles: true para pedir à biblioteca as
    informações de estilo que estiverem disponíveis no arquivo.
*/
importarPlanilhaArquivo = async function (event) {
  const input = event.target;
  const arquivo = input.files?.[0];
  input.value = "";

  if (!arquivo) return;

  if (typeof XLSX === "undefined") {
    await mostrarAviso(t("import.library"));
    return;
  }

  try {
    const bytes = await arquivo.arrayBuffer();

    const workbook = XLSX.read(bytes, {
      type: "array",
      cellDates: true,

      /*
          ESSENCIAL PARA A V9:
          solicita estilos, dimensões de colunas e outras informações
          visuais disponíveis no XLSX.
      */
      cellStyles: true,
    });

    const nomeAba = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[nomeAba];

    let dados = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: "",
      raw: false,
    });

    /* remove apenas linhas totalmente vazias */
    dados = dados.filter((linha) =>
      linha.some((valor) => valorNaoVazio(valor)),
    );

    if (dados.length === 0) {
      await mostrarAviso(t("import.empty"));
      return;
    }

    const maiorQuantidadeColunas = Math.max(
      ...dados.map((linha) => linha.length),
    );
    const cabecalhoOriginal = dados[0];
    const usados = new Set();

    /* cria os campos internos do NexaGrid */
    const colunas = new Array(maiorQuantidadeColunas)
      .fill(null)
      .map((_, indice) => {
        const nome = nomeCampoUnico(cabecalhoOriginal[indice], usados, indice);
        const valores = dados.slice(1).map((linha) => linha[indice] ?? "");

        return normalizarCampoV6({
          id: criarIdCampo(),
          nome,
          tipo: "info",
          papel: "geral",
          tipoDado: inferirTipoDadoValores(valores),
        });
      });

    /* converte as linhas para o formato baseado em ID */
    const linhas = dados.slice(1).map((linhaArray) => {
      const linha = {};

      colunas.forEach((campo, indice) => {
        linha[campo.id] = linhaArray[indice] ?? "";
      });

      return linha;
    });

    /*
        Extrai a aparência ANTES de criar a planilha.
        O índice das colunas ainda corresponde exatamente ao arquivo Excel.
    */
    const aparenciaImportada = extrairAparenciaDoWorksheet(
      worksheet,
      colunas,
      linhas.length,
    );

    const personalizacaoImportada = extrairPersonalizacaoBaseDoExcel(
      worksheet,
      colunas,
    );

    const nomeArquivo = arquivo.name.replace(/\.(xlsx|xls|csv)$/i, "");

    const novaPlanilha = {
      id: String(Date.now()),
      nome: nomeArquivo || "Planilha importada",
      tipo: "excel",
      modelo: "vazio",
      colunas,
      linhas,
      criadaEm: new Date().toISOString(),

      /* aparência geral usada como fallback */
      personalizacao: personalizacaoImportada,

      /* aparência detalhada de cada célula */
      aparenciaImportada,
    };

    planilhas.push(novaPlanilha);
    salvar();
    carregarDashboard();
    mostrarToast(t("import.success"), "sucesso");
    abrirPlanilha(novaPlanilha.id);
  } catch (erro) {
    console.error(erro);
    await mostrarAviso(t("import.error"));
  }
};

/* ================================================= */
/* INTEGRAÇÃO DA APARÊNCIA IMPORTADA COM O EDITOR */
/* ================================================= */

/*
    Guardamos a versão atual de montarTabela() e acrescentamos a aplicação
    dos estilos importados logo depois que a tabela normal termina de ser
    criada.
*/
const montarTabelaAntesDosEstilosV9 = montarTabela;

montarTabela = function (...argumentos) {
  const resultado = montarTabelaAntesDosEstilosV9.apply(this, argumentos);
  aplicarEstilosImportadosNaTabela();
  return resultado;
};

/*
    Faz o mesmo após mudanças de personalização.
    A personalização comum é aplicada primeiro e o estilo importado continua
    preservado sobre as células que tinham formatação própria no Excel.
*/
const aplicarPersonalizacaoAntesDosEstilosV9 = aplicarPersonalizacao;

aplicarPersonalizacao = function (...argumentos) {
  const resultado = aplicarPersonalizacaoAntesDosEstilosV9.apply(
    this,
    argumentos,
  );
  aplicarEstilosImportadosNaTabela();
  return resultado;
};

/* ================================================= */
/* INTEGRAÇÃO COM A EXPORTAÇÃO */
/* ================================================= */

/*
    A função criarWorksheet() já cuida das fórmulas e da formatação normal
    do NexaGrid. Aqui apenas acrescentamos novamente a aparência original.
*/
const criarWorksheetAntesDosEstilosV9 = criarWorksheet;

criarWorksheet = function (...argumentos) {
  const worksheet = criarWorksheetAntesDosEstilosV9.apply(this, argumentos);
  return aplicarAparenciaImportadaNoWorksheet(worksheet, planilhaAtual);
};

/* ================================================= */
/* V10 - IMPORTAÇÃO REAL DE ESTILOS + LIXEIRA */
/* ================================================= */

/*
    OBJETIVOS DESTA VERSÃO
    ----------------------

    1. Importar .xlsx preservando muito mais informações visuais.
       Para isso usamos ExcelJS na LEITURA dos arquivos .xlsx.

    2. Ignorar linhas e colunas ocultas do Excel.
       Isso evita importar colunas auxiliares escondidas que faziam a tabela
       parecer "cortada" ou deslocada.

    3. Quando existir uma Tabela do Excel, tentar usar a área da própria tabela
       em vez de importar a folha inteira.

    4. Se o arquivo possuir várias abas visíveis, permitir escolher qual delas
       será importada.

    5. Adicionar uma lixeira. Excluir passa a significar "mover para lixeira".
       O usuário pode restaurar ou excluir definitivamente depois.
*/

/* ================================================= */
/* TRADUÇÕES NOVAS DA V10 */
/* ================================================= */

Object.assign(traducoes["pt-BR"], {
  "nav.trash": "Lixeira",

  "trash.eyebrow": "Recuperação",
  "trash.title": "Lixeira",
  "trash.subtitle":
    "Planilhas excluídas ficam aqui até você restaurar ou apagar definitivamente.",
  "trash.items": "Itens na lixeira",
  "trash.empty": "Esvaziar lixeira",
  "trash.emptyStateTitle": "A lixeira está vazia",
  "trash.emptyStateText": "Nenhuma planilha excluída no momento.",
  "trash.restore": "↶ Restaurar",
  "trash.deletePermanent": "Excluir definitivamente",
  "trash.moved": "Planilha movida para a lixeira.",
  "trash.restored": "Planilha restaurada.",
  "trash.deleted": "Planilha excluída definitivamente.",
  "trash.emptied": "Lixeira esvaziada.",
  "trash.moveConfirm": "Deseja mover esta planilha para a lixeira?",
  "trash.deleteConfirm":
    "Esta ação é permanente. Deseja excluir esta planilha definitivamente?",
  "trash.emptyConfirm":
    "Todas as planilhas da lixeira serão apagadas definitivamente. Deseja continuar?",
  "trash.deletedAt": "Excluída em",

  "import.chooseSheet": "Escolha a aba que deseja importar.",
  "import.excelJsMissing":
    "O leitor avançado de Excel não foi carregado. A importação continuará no modo básico.",
  "import.xlsxFallback":
    "Não foi possível ler todos os estilos deste arquivo. O NexaGrid usará a importação compatível.",
});

Object.assign(traducoes["en"], {
  "nav.trash": "Trash",

  "trash.eyebrow": "Recovery",
  "trash.title": "Trash",
  "trash.subtitle":
    "Deleted spreadsheets stay here until you restore or permanently remove them.",
  "trash.items": "Items in trash",
  "trash.empty": "Empty trash",
  "trash.emptyStateTitle": "Trash is empty",
  "trash.emptyStateText": "There are no deleted spreadsheets right now.",
  "trash.restore": "↶ Restore",
  "trash.deletePermanent": "Delete permanently",
  "trash.moved": "Spreadsheet moved to trash.",
  "trash.restored": "Spreadsheet restored.",
  "trash.deleted": "Spreadsheet permanently deleted.",
  "trash.emptied": "Trash emptied.",
  "trash.moveConfirm": "Move this spreadsheet to trash?",
  "trash.deleteConfirm":
    "This action is permanent. Delete this spreadsheet permanently?",
  "trash.emptyConfirm":
    "Every spreadsheet in trash will be permanently deleted. Continue?",
  "trash.deletedAt": "Deleted at",

  "import.chooseSheet": "Choose the worksheet you want to import.",
  "import.excelJsMissing":
    "The advanced Excel reader was not loaded. Import will continue in basic mode.",
  "import.xlsxFallback":
    "Not all styles could be read. NexaGrid will use the compatible import mode.",
});

/* ================================================= */
/* LIXEIRA */
/* ================================================= */

/*
    As planilhas ativas continuam usando a chave "planilhas".
    A lixeira usa uma chave diferente para que um item excluído não apareça
    no Dashboard, mas continue disponível para recuperação.
*/
const CHAVE_LIXEIRA_V10 = "nexagrid_lixeira";

let lixeiraV10 = [];

try {
  const dadosLixeira = JSON.parse(localStorage.getItem(CHAVE_LIXEIRA_V10));
  lixeiraV10 = Array.isArray(dadosLixeira) ? dadosLixeira : [];
} catch (erro) {
  console.error("Não foi possível carregar a lixeira:", erro);
  lixeiraV10 = [];
}

/*
    FUNÇÃO: salvarLixeiraV10()

    Salva apenas os itens excluídos. Ela é separada de salvar() para não
    misturar planilhas ativas e planilhas que estão aguardando recuperação.
*/
function salvarLixeiraV10() {
  try {
    localStorage.setItem(CHAVE_LIXEIRA_V10, JSON.stringify(lixeiraV10));
  } catch (erro) {
    console.error("Não foi possível salvar a lixeira:", erro);
    mostrarToast("Não foi possível atualizar a lixeira.", "erro");
  }
}

/*
    FUNÇÃO: excluirPlanilha() - V10

    Substitui a exclusão antiga.

    Antes:
      a planilha era removida imediatamente.

    Agora:
      1. encontra a planilha;
      2. remove da lista ativa;
      3. adiciona data de exclusão;
      4. envia para a lixeira;
      5. salva os dois estados.
*/
excluirPlanilha = async function (event, id) {
  event?.stopPropagation?.();

  if (!(await confirmarAcao(t("trash.moveConfirm")))) return;

  const indice = planilhas.findIndex((planilha) => planilha.id === id);
  if (indice < 0) return;

  const [planilhaExcluida] = planilhas.splice(indice, 1);

  lixeiraV10.unshift({
    ...clonarDados(planilhaExcluida),
    excluidaEm: new Date().toISOString(),
  });

  salvar();
  salvarLixeiraV10();
  carregarDashboard();
  mostrarToast(t("trash.moved"), "sucesso");
};

/*
    FUNÇÃO: carregarLixeira()

    Renderiza os cards da página lixeira.html.
    Em outras páginas o elemento #listaLixeira não existe, então a função
    simplesmente termina sem causar erro.
*/
function carregarLixeira() {
  const lista = document.getElementById("listaLixeira");
  if (!lista) return;

  const total = document.getElementById("totalLixeira");
  const botaoEsvaziar = document.getElementById("botaoEsvaziarLixeira");

  if (total) total.textContent = String(lixeiraV10.length);
  if (botaoEsvaziar) botaoEsvaziar.disabled = lixeiraV10.length === 0;

  lista.innerHTML = "";

  if (lixeiraV10.length === 0) {
    lista.innerHTML = `
      <div class="vazio">
        <h3>${escaparHTML(t("trash.emptyStateTitle"))}</h3>
        <p>${escaparHTML(t("trash.emptyStateText"))}</p>
      </div>
    `;
    return;
  }

  lixeiraV10.forEach((planilha) => {
    const card = document.createElement("article");
    card.className = "card-planilha";

    const data = planilha.excluidaEm
      ? new Date(planilha.excluidaEm).toLocaleString(configuracoes.idioma)
      : "";

    card.innerHTML = `
      <div class="topo-card-planilha">
        <h4>🗑 ${escaparHTML(planilha.nome || "Sem título")}</h4>
        ${
          planilha.modelo && planilha.modelo !== "vazio"
            ? `<span class="tag-modelo">${escaparHTML(nomeModelo(planilha.modelo))}</span>`
            : ""
        }
      </div>

      <p>
        ${(planilha.linhas || []).length} ${escaparHTML(t("stats.records").toLowerCase())}
        · ${(planilha.colunas || []).length} ${escaparHTML(t("stats.fields").toLowerCase())}
      </p>

      <span class="data-exclusao">
        ${escaparHTML(t("trash.deletedAt"))}: ${escaparHTML(data)}
      </span>

      <div class="acoes-lixeira-card">
        <button
          type="button"
          class="principal"
          onclick="restaurarPlanilhaLixeira('${planilha.id}')"
        >
          ${escaparHTML(t("trash.restore"))}
        </button>

        <button
          type="button"
          class="acao-perigosa"
          onclick="excluirPlanilhaDefinitivamente('${planilha.id}')"
        >
          ${escaparHTML(t("trash.deletePermanent"))}
        </button>
      </div>
    `;

    lista.appendChild(card);
  });
}

/*
    FUNÇÃO: restaurarPlanilhaLixeira()

    Move a planilha de volta para o Dashboard.
    Se existir outra planilha com o mesmo ID, geramos um novo identificador
    para impedir conflito.
*/
function restaurarPlanilhaLixeira(id) {
  const indice = lixeiraV10.findIndex((planilha) => planilha.id === id);
  if (indice < 0) return;

  const [restaurada] = lixeiraV10.splice(indice, 1);

  if (planilhas.some((planilha) => planilha.id === restaurada.id)) {
    restaurada.id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  delete restaurada.excluidaEm;
  planilhas.push(restaurada);

  salvar();
  salvarLixeiraV10();
  carregarLixeira();
  mostrarToast(t("trash.restored"), "sucesso");
}

/*
    FUNÇÃO: excluirPlanilhaDefinitivamente()

    Remove somente um item da lixeira após uma confirmação forte.
*/
async function excluirPlanilhaDefinitivamente(id) {
  if (!(await confirmarAcao(t("trash.deleteConfirm")))) return;

  lixeiraV10 = lixeiraV10.filter((planilha) => planilha.id !== id);
  salvarLixeiraV10();
  carregarLixeira();
  mostrarToast(t("trash.deleted"), "sucesso");
}

/*
    FUNÇÃO: esvaziarLixeira()

    Apaga todos os itens da lixeira de uma vez.
*/
async function esvaziarLixeira() {
  if (lixeiraV10.length === 0) return;
  if (!(await confirmarAcao(t("trash.emptyConfirm")))) return;

  lixeiraV10 = [];
  salvarLixeiraV10();
  carregarLixeira();
  mostrarToast(t("trash.emptied"), "sucesso");
}

/* ================================================= */
/* BACKUP V10: INCLUI TAMBÉM A LIXEIRA */
/* ================================================= */

/*
    O backup antigo salvava apenas planilhas ativas e configurações.
    A V10 inclui a lixeira para que uma restauração seja realmente completa.
*/
exportarBackup = function () {
  const backup = {
    aplicativo: "NexaGrid",
    versao: 10,
    exportadoEm: new Date().toISOString(),
    configuracoes,
    planilhas,
    lixeira: lixeiraV10,
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const data = new Date().toISOString().slice(0, 10);

  link.href = url;
  link.download = `${t("backup.fileName")}-${data}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

/*
    Também substituímos a restauração para aceitar backups antigos.
    Se o JSON não possuir "lixeira", ela simplesmente começa vazia.
*/
importarBackup = async function (event) {
  const input = event.target;
  const arquivo = input.files?.[0];
  input.value = "";
  if (!arquivo) return;

  try {
    const texto = await arquivo.text();
    const backup = JSON.parse(texto);

    if (
      backup?.aplicativo !== "NexaGrid" ||
      !Array.isArray(backup.planilhas) ||
      !backup.configuracoes
    ) {
      await mostrarAviso(t("settings.backupInvalid"));
      return;
    }

    if (!(await confirmarAcao(t("settings.backupConfirm")))) return;

    planilhas = backup.planilhas;
    lixeiraV10 = Array.isArray(backup.lixeira) ? backup.lixeira : [];

    configuracoes = {
      ...configuracoesPadrao,
      ...backup.configuracoes,
    };

    localStorage.setItem(CHAVE_CONFIGURACOES, JSON.stringify(configuracoes));
    salvarLixeiraV10();
    migrarPlanilhas();
    salvar();

    await mostrarAviso(t("settings.backupRestored"));
    window.location.href = "index.html";
  } catch (erro) {
    console.error(erro);
    await mostrarAviso(t("settings.backupInvalid"));
  }
};

/* ================================================= */
/* EXCELJS - CONVERSÃO DE CORES E ESTILOS */
/* ================================================= */

/*
    O Excel pode guardar uma cor de três formas principais:
    - ARGB explícito: FFEFF1D8
    - índice de uma paleta antiga
    - índice do tema do arquivo + "tint" (clarear/escurecer)

    A V9 dependia principalmente de RGB já resolvido. A V10 também resolve
    cores de tema usando a paleta padrão do Office como fallback.
*/
const CORES_TEMA_OFFICE_V10 = {
  0: "000000", // dark 1
  1: "FFFFFF", // light 1
  2: "44546A", // dark 2
  3: "E7E6E6", // light 2
  4: "4472C4", // accent 1
  5: "ED7D31", // accent 2
  6: "A5A5A5", // accent 3
  7: "FFC000", // accent 4
  8: "5B9BD5", // accent 5
  9: "70AD47", // accent 6
  10: "0563C1", // hyperlink
  11: "954F72", // followed hyperlink
};

function hexadecimalParaRgbV10(hex) {
  const texto = String(hex || "000000")
    .replace("#", "")
    .slice(-6);
  return {
    r: parseInt(texto.slice(0, 2), 16) || 0,
    g: parseInt(texto.slice(2, 4), 16) || 0,
    b: parseInt(texto.slice(4, 6), 16) || 0,
  };
}

function rgbParaHexadecimalV10({ r, g, b }) {
  return [r, g, b]
    .map((valor) =>
      Math.round(Math.min(255, Math.max(0, valor)))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")
    .toUpperCase();
}

/*
    Aplica aproximadamente o mesmo comportamento do atributo tint do Excel.
    tint positivo aproxima da cor branca; tint negativo escurece.
*/
function aplicarTintV10(hex, tint = 0) {
  if (!Number.isFinite(Number(tint)) || Number(tint) === 0) return hex;

  const rgb = hexadecimalParaRgbV10(hex);
  const valorTint = Math.max(-1, Math.min(1, Number(tint)));

  const converter = (canal) => {
    if (valorTint < 0) return canal * (1 + valorTint);
    return canal + (255 - canal) * valorTint;
  };

  return rgbParaHexadecimalV10({
    r: converter(rgb.r),
    g: converter(rgb.g),
    b: converter(rgb.b),
  });
}

/*
    FUNÇÃO: normalizarCorExcelJSV10()

    Transforma uma cor do ExcelJS em { rgb: "RRGGBB" }, que é o formato
    já entendido pelas funções de estilo da V9 e também pelo xlsx-js-style.
*/
function normalizarCorExcelJSV10(cor) {
  if (!cor || typeof cor !== "object") return null;

  let rgb = null;

  if (cor.argb) {
    rgb = String(cor.argb).replace("#", "").slice(-6).toUpperCase();
  } else if (cor.rgb) {
    rgb = String(cor.rgb).replace("#", "").slice(-6).toUpperCase();
  } else if (cor.theme !== undefined) {
    rgb = CORES_TEMA_OFFICE_V10[Number(cor.theme)] || null;
  } else if (cor.indexed !== undefined) {
    rgb = obterCorRgbExcel({ indexed: cor.indexed });
  }

  if (!rgb) return null;

  rgb = aplicarTintV10(rgb, Number(cor.tint || 0));
  return { rgb };
}

/*
    FUNÇÃO: converterEstiloExcelJSV10()

    ExcelJS e xlsx-js-style usam nomes um pouco diferentes para estilos.
    Esta função transforma o objeto do ExcelJS no formato interno que o
    NexaGrid já sabe aplicar no HTML e reaplicar na exportação.
*/
function converterEstiloExcelJSV10(cell) {
  if (!cell) return null;

  const resultado = {};

  const font = cell.font;
  if (font && Object.keys(font).length > 0) {
    resultado.font = {
      name: font.name,
      sz: font.size,
      bold: Boolean(font.bold),
      italic: Boolean(font.italic),
      underline: font.underline || false,
      strike: Boolean(font.strike),
      color: normalizarCorExcelJSV10(font.color),
    };
  }

  const fill = cell.fill;
  if (fill && fill.type && fill.type !== "none") {
    resultado.fill = {
      patternType: fill.pattern || "solid",
      fgColor: normalizarCorExcelJSV10(fill.fgColor),
      bgColor: normalizarCorExcelJSV10(fill.bgColor),
    };
  }

  const alignment = cell.alignment;
  if (alignment && Object.keys(alignment).length > 0) {
    resultado.alignment = {
      horizontal: alignment.horizontal,
      vertical: alignment.vertical,
      wrapText: alignment.wrapText,
      shrinkToFit: alignment.shrinkToFit,
      textRotation: alignment.textRotation,
      indent: alignment.indent,
    };
  }

  const border = cell.border;
  if (border && Object.keys(border).length > 0) {
    resultado.border = {};

    ["top", "right", "bottom", "left"].forEach((lado) => {
      const origem = border[lado];
      if (!origem || !origem.style) return;

      resultado.border[lado] = {
        style: origem.style,
        color: normalizarCorExcelJSV10(origem.color),
      };
    });
  }

  if (cell.numFmt) {
    resultado.numFmt = cell.numFmt;
  }

  /* remove objetos vazios */
  Object.keys(resultado).forEach((chave) => {
    const valor = resultado[chave];
    if (
      valor === null ||
      valor === undefined ||
      (typeof valor === "object" && Object.keys(valor).length === 0)
    ) {
      delete resultado[chave];
    }
  });

  return Object.keys(resultado).length > 0 ? resultado : null;
}

/* ================================================= */
/* TABELAS DO EXCEL - ÁREA E TEMA */
/* ================================================= */

/*
    Alguns arquivos possuem colunas auxiliares, fórmulas de apoio ou dados
    escondidos fora da tabela principal. Se existir uma Tabela oficial do
    Excel, ela normalmente representa exatamente a área que o usuário quer.
*/
function obterTabelasExcelJSV10(worksheet) {
  try {
    if (typeof worksheet.getTables === "function") {
      return worksheet.getTables().filter(Boolean);
    }

    if (worksheet.tables && typeof worksheet.tables === "object") {
      return Object.values(worksheet.tables).filter(Boolean);
    }
  } catch (erro) {
    console.warn("Não foi possível ler as tabelas desta aba:", erro);
  }

  return [];
}

function informacaoTabelaExcelJSV10(table) {
  const info = table?.table || table?.model || table || {};

  return {
    ref: info.tableRef || info.ref || table?.ref || null,
    style: info.style || table?.style || null,
    name: info.name || table?.name || "Tabela",
  };
}

/*
    Converte A1:H20 para coordenadas 1-based do ExcelJS.
*/
function decodificarIntervaloV10(ref) {
  if (!ref || typeof XLSX === "undefined") return null;

  try {
    const faixa = XLSX.utils.decode_range(ref);
    return {
      top: faixa.s.r + 1,
      left: faixa.s.c + 1,
      bottom: faixa.e.r + 1,
      right: faixa.e.c + 1,
    };
  } catch (erro) {
    return null;
  }
}

function areaDaMaiorTabelaExcelJSV10(worksheet) {
  const tabelas = obterTabelasExcelJSV10(worksheet);
  let melhor = null;

  tabelas.forEach((table) => {
    const info = informacaoTabelaExcelJSV10(table);
    const area = decodificarIntervaloV10(info.ref);
    if (!area) return;

    const tamanho = (area.bottom - area.top + 1) * (area.right - area.left + 1);

    if (!melhor || tamanho > melhor.tamanho) {
      melhor = {
        ...area,
        tamanho,
        tabela: info,
      };
    }
  });

  return melhor;
}

/*
    Quando não existe Tabela oficial do Excel, procuramos a área útil usando
    apenas linhas e colunas VISÍVEIS. Colunas e linhas ocultas são ignoradas.
*/
function detectarAreaVisivelExcelJSV10(worksheet) {
  let top = Infinity;
  let left = Infinity;
  let bottom = 0;
  let right = 0;

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (row.hidden) return;

    row.eachCell({ includeEmpty: false }, (cell, columnNumber) => {
      const column = worksheet.getColumn(columnNumber);
      if (column?.hidden) return;

      const texto = String(cell.text ?? "").trim();
      const possuiValor = texto !== "" || cell.value !== null;
      if (!possuiValor) return;

      top = Math.min(top, rowNumber);
      left = Math.min(left, columnNumber);
      bottom = Math.max(bottom, rowNumber);
      right = Math.max(right, columnNumber);
    });
  });

  if (!Number.isFinite(top) || bottom === 0 || right === 0) return null;

  return { top, left, bottom, right, tabela: null };
}

function detectarAreaImportacaoExcelJSV10(worksheet) {
  return (
    areaDaMaiorTabelaExcelJSV10(worksheet) ||
    detectarAreaVisivelExcelJSV10(worksheet)
  );
}

/* ================================================= */
/* TEMA DE TABELA DO EXCEL COMO FALLBACK */
/* ================================================= */

/*
    Uma Tabela do Excel pode guardar apenas o nome do tema, por exemplo:
    TableStyleLight9 ou TableStyleMedium4.

    Nesses casos as cores não ficam necessariamente copiadas em cada célula.
    Então criamos uma paleta aproximada a partir do nome do tema para impedir
    que a planilha volte ao azul padrão do NexaGrid.
*/
const ACENTOS_EXCEL_V10 = [
  "4472C4",
  "ED7D31",
  "A5A5A5",
  "FFC000",
  "5B9BD5",
  "70AD47",
];

function misturarCoresV10(hexA, hexB, proporcaoB) {
  const a = hexadecimalParaRgbV10(hexA);
  const b = hexadecimalParaRgbV10(hexB);
  const p = Math.max(0, Math.min(1, proporcaoB));

  return rgbParaHexadecimalV10({
    r: a.r * (1 - p) + b.r * p,
    g: a.g * (1 - p) + b.g * p,
    b: a.b * (1 - p) + b.b * p,
  });
}

function paletaTemaTabelaExcelV10(nomeTema) {
  const match = String(nomeTema || "").match(
    /TableStyle(Light|Medium|Dark)(\d+)/i,
  );
  if (!match) return null;

  const categoria = match[1].toLowerCase();
  const numero = Math.max(1, Number(match[2]) || 1);
  const acento = ACENTOS_EXCEL_V10[(numero - 1) % ACENTOS_EXCEL_V10.length];

  if (categoria === "light") {
    return {
      cabecalho: misturarCoresV10(acento, "FFFFFF", 0.8),
      textoCabecalho: misturarCoresV10(acento, "000000", 0.45),
      linha1: "FFFFFF",
      linha2: misturarCoresV10(acento, "FFFFFF", 0.9),
      texto: "1F2933",
      borda: misturarCoresV10(acento, "FFFFFF", 0.68),
    };
  }

  if (categoria === "dark") {
    return {
      cabecalho: misturarCoresV10(acento, "000000", 0.32),
      textoCabecalho: "FFFFFF",
      linha1: misturarCoresV10(acento, "FFFFFF", 0.86),
      linha2: misturarCoresV10(acento, "FFFFFF", 0.76),
      texto: "17202A",
      borda: misturarCoresV10(acento, "000000", 0.12),
    };
  }

  return {
    cabecalho: acento,
    textoCabecalho: "FFFFFF",
    linha1: "FFFFFF",
    linha2: misturarCoresV10(acento, "FFFFFF", 0.86),
    texto: "1F2933",
    borda: misturarCoresV10(acento, "FFFFFF", 0.55),
  };
}

/* ================================================= */
/* EXTRAÇÃO DOS DADOS COM EXCELJS */
/* ================================================= */

function valorExibidoExcelJSV10(cell) {
  if (!cell) return "";

  /* cell.text já respeita boa parte da formatação numérica do Excel */
  if (cell.text !== undefined && cell.text !== null) {
    return String(cell.text);
  }

  if (cell.value === null || cell.value === undefined) return "";

  if (cell.value instanceof Date) {
    return cell.value.toLocaleDateString(configuracoes.idioma);
  }

  if (typeof cell.value === "object" && "result" in cell.value) {
    return cell.value.result ?? "";
  }

  return String(cell.value);
}

function valorBrutoExcelJSV10(cell) {
  if (!cell) return "";
  const valor = cell.value;

  if (valor && typeof valor === "object" && "result" in valor) {
    return valor.result ?? "";
  }

  return valor ?? "";
}

/*
    FUNÇÃO: extrairPlanilhaExcelJSV10()

    Retorna dados já preparados para o formato interno do NexaGrid.
*/
function extrairPlanilhaExcelJSV10(worksheet) {
  const area = detectarAreaImportacaoExcelJSV10(worksheet);
  if (!area) return null;

  const headerRow = area.top;

  /* ------------------------------------------------- */
  /* COLUNAS VISÍVEIS */
  /* ------------------------------------------------- */
  const indicesColunas = [];

  for (let coluna = area.left; coluna <= area.right; coluna++) {
    const excelColumn = worksheet.getColumn(coluna);
    if (excelColumn?.hidden) continue;

    /* ignora uma coluna totalmente vazia dentro da área */
    let possuiConteudo = false;

    for (let linha = headerRow; linha <= area.bottom; linha++) {
      const row = worksheet.getRow(linha);
      if (row.hidden) continue;

      const cell = worksheet.getCell(linha, coluna);
      if (String(cell.text ?? "").trim() !== "" || cell.value !== null) {
        possuiConteudo = true;
        break;
      }
    }

    if (possuiConteudo) indicesColunas.push(coluna);
  }

  if (indicesColunas.length === 0) return null;

  /* ------------------------------------------------- */
  /* LINHAS VISÍVEIS DE DADOS */
  /* ------------------------------------------------- */
  const numerosLinhas = [];

  for (let linha = headerRow + 1; linha <= area.bottom; linha++) {
    const excelRow = worksheet.getRow(linha);
    if (excelRow.hidden) continue;

    const possuiConteudo = indicesColunas.some((coluna) => {
      const cell = worksheet.getCell(linha, coluna);
      return String(cell.text ?? "").trim() !== "" || cell.value !== null;
    });

    if (possuiConteudo) numerosLinhas.push(linha);
  }

  /* ------------------------------------------------- */
  /* CAMPOS DO NEXAGRID */
  /* ------------------------------------------------- */
  const usados = new Set();

  const colunas = indicesColunas.map((indiceExcel, indiceVisual) => {
    const celulaCabecalho = worksheet.getCell(headerRow, indiceExcel);
    const nome = nomeCampoUnico(
      valorExibidoExcelJSV10(celulaCabecalho),
      usados,
      indiceVisual,
    );

    const valoresBrutos = numerosLinhas.map((numeroLinha) =>
      valorBrutoExcelJSV10(worksheet.getCell(numeroLinha, indiceExcel)),
    );

    return normalizarCampoV6({
      id: criarIdCampo(),
      nome,
      tipo: "info",
      papel: "geral",
      tipoDado: inferirTipoDadoValores(valoresBrutos),
    });
  });

  /* ------------------------------------------------- */
  /* DADOS DAS LINHAS */
  /* ------------------------------------------------- */
  const linhas = numerosLinhas.map((numeroLinha) => {
    const linha = {};

    colunas.forEach((campo, indice) => {
      const colunaExcel = indicesColunas[indice];
      linha[campo.id] = valorExibidoExcelJSV10(
        worksheet.getCell(numeroLinha, colunaExcel),
      );
    });

    return linha;
  });

  return {
    area,
    headerRow,
    indicesColunas,
    numerosLinhas,
    colunas,
    linhas,
  };
}

/* ================================================= */
/* EXTRAÇÃO DA APARÊNCIA COM EXCELJS */
/* ================================================= */

function registrarEstiloNormalizadoV10(estilo, biblioteca, mapa) {
  if (!estilo) return null;

  const chave = JSON.stringify(estilo);

  if (mapa.has(chave)) return mapa.get(chave);

  const indice = biblioteca.length;
  biblioteca.push(estilo);
  mapa.set(chave, indice);
  return indice;
}

function extrairAparenciaExcelJSV10(worksheet, estrutura) {
  const estilos = [];
  const mapaEstilos = new Map();
  const cabecalho = {};
  const linhas = [];
  const largurasColunas = {};
  const alturasLinhas = [];

  /* estilo e largura do cabeçalho */
  estrutura.colunas.forEach((campo, indice) => {
    const colunaExcel = estrutura.indicesColunas[indice];
    const cell = worksheet.getCell(estrutura.headerRow, colunaExcel);
    const estilo = converterEstiloExcelJSV10(cell);
    const indiceEstilo = registrarEstiloNormalizadoV10(
      estilo,
      estilos,
      mapaEstilos,
    );

    if (indiceEstilo !== null) {
      cabecalho[campo.id] = indiceEstilo;
    }

    const largura = Number(worksheet.getColumn(colunaExcel)?.width);
    if (Number.isFinite(largura) && largura > 0) {
      largurasColunas[campo.id] = largura;
    }
  });

  /* estilo e altura de cada linha de dados */
  estrutura.numerosLinhas.forEach((numeroLinhaExcel, indiceLinha) => {
    const estilosLinha = {};

    estrutura.colunas.forEach((campo, indice) => {
      const colunaExcel = estrutura.indicesColunas[indice];
      const cell = worksheet.getCell(numeroLinhaExcel, colunaExcel);
      const estilo = converterEstiloExcelJSV10(cell);
      const indiceEstilo = registrarEstiloNormalizadoV10(
        estilo,
        estilos,
        mapaEstilos,
      );

      if (indiceEstilo !== null) {
        estilosLinha[campo.id] = indiceEstilo;
      }
    });

    if (Object.keys(estilosLinha).length > 0) {
      linhas[indiceLinha] = estilosLinha;
    }

    const altura = Number(worksheet.getRow(numeroLinhaExcel)?.height);
    if (Number.isFinite(altura) && altura > 0) {
      alturasLinhas[indiceLinha] = altura;
    }
  });

  const alturaCabecalho = Number(worksheet.getRow(estrutura.headerRow)?.height);

  /* metadados da maior tabela oficial encontrada */
  const tabela = estrutura.area.tabela;
  const estiloTabela = tabela?.style || null;

  return {
    versao: 2,
    leitor: "ExcelJS",
    estilos,
    cabecalho,
    linhas,
    largurasColunas,
    alturasLinhas,
    alturaCabecalho:
      Number.isFinite(alturaCabecalho) && alturaCabecalho > 0
        ? alturaCabecalho
        : null,
    estiloTabela: estiloTabela
      ? {
          theme: estiloTabela.theme || null,
          showRowStripes: Boolean(estiloTabela.showRowStripes),
          showColumnStripes: Boolean(estiloTabela.showColumnStripes),
          showFirstColumn: Boolean(estiloTabela.showFirstColumn),
          showLastColumn: Boolean(estiloTabela.showLastColumn),
        }
      : null,
  };
}

/*
    Cria a personalização geral usada como fallback.
    Primeiro tenta o estilo real da célula; se o Excel guardar apenas um
    tema de Tabela, usa a paleta aproximada desse tema.
*/
function extrairPersonalizacaoExcelJSV10(worksheet, estrutura, aparencia) {
  const p = personalizacaoPadrao();

  const primeiraColuna = estrutura.indicesColunas[0];
  const cabecalhoCell = worksheet.getCell(estrutura.headerRow, primeiraColuna);
  const primeiraLinhaDados = estrutura.numerosLinhas[0];
  const dadosCell = primeiraLinhaDados
    ? worksheet.getCell(primeiraLinhaDados, primeiraColuna)
    : null;

  const estiloCabecalho = converterEstiloExcelJSV10(cabecalhoCell);
  const estiloDados = converterEstiloExcelJSV10(dadosCell);

  const tema = paletaTemaTabelaExcelV10(aparencia.estiloTabela?.theme);

  const fundoCabecalho =
    corExcelParaCss(estiloCabecalho?.fill?.fgColor) ||
    corExcelParaCss(estiloCabecalho?.fill?.bgColor) ||
    (tema ? `#${tema.cabecalho}` : null);

  const textoCabecalho =
    corExcelParaCss(estiloCabecalho?.font?.color) ||
    (tema ? `#${tema.textoCabecalho}` : null);

  const fundoDados =
    corExcelParaCss(estiloDados?.fill?.fgColor) ||
    corExcelParaCss(estiloDados?.fill?.bgColor) ||
    (tema ? `#${tema.linha1}` : null);

  const textoDados =
    corExcelParaCss(estiloDados?.font?.color) ||
    (tema ? `#${tema.texto}` : null);

  if (fundoCabecalho) p.corCabecalho = fundoCabecalho;
  if (textoCabecalho) p.corTextoCabecalho = textoCabecalho;
  if (fundoDados) p.corCelulas = fundoDados;
  if (textoDados) p.corTexto = textoDados;
  if (tema) p.corBorda = `#${tema.borda}`;

  p.estilo = aparencia.estiloTabela ? "tabela" : p.estilo;

  const tamanhoFonte = estiloCabecalho?.font?.sz || estiloDados?.font?.sz;

  if (Number.isFinite(Number(tamanhoFonte))) {
    p.tamanhoFonte = String(
      Math.min(18, Math.max(12, Math.round(Number(tamanhoFonte)))),
    );
  }

  const alinhamento =
    estiloCabecalho?.alignment?.horizontal ||
    estiloDados?.alignment?.horizontal;

  if (["left", "center", "right"].includes(alinhamento)) {
    p.alinhamento = alinhamento;
  }

  return p;
}

/* ================================================= */
/* APLICAÇÃO DO TEMA DE TABELA NO NAVEGADOR */
/* ================================================= */

function aplicarTemaTabelaImportadoV10() {
  if (!planilhaAtual?.aparenciaImportada?.estiloTabela) return;

  const tema = paletaTemaTabelaExcelV10(
    planilhaAtual.aparenciaImportada.estiloTabela.theme,
  );

  if (!tema) return;

  const headers = cabecalhoTabela?.querySelectorAll("th") || [];

  headers.forEach((th, indice) => {
    if (indice >= planilhaAtual.colunas.length) return;
    th.style.backgroundColor = `#${tema.cabecalho}`;
    th.style.color = `#${tema.textoCabecalho}`;
    th.style.borderColor = `#${tema.borda}`;
  });

  corpoTabela?.querySelectorAll("tr").forEach((tr, indiceLinhaVisual) => {
    const usarFaixa =
      planilhaAtual.aparenciaImportada.estiloTabela.showRowStripes !== false;

    const fundo =
      usarFaixa && indiceLinhaVisual % 2 === 1 ? tema.linha2 : tema.linha1;

    tr.querySelectorAll("td").forEach((td, indiceColuna) => {
      if (indiceColuna >= planilhaAtual.colunas.length) return;

      td.style.backgroundColor = `#${fundo}`;
      td.style.borderColor = `#${tema.borda}`;

      const controle = td.querySelector("input, select");
      if (controle) {
        controle.style.backgroundColor = `#${fundo}`;
        controle.style.color = `#${tema.texto}`;
      }
    });
  });
}

/* ================================================= */
/* APLICAÇÃO EXATA DOS ESTILOS IMPORTADOS - V10 */
/* ================================================= */

/*
    Esta versão substitui a função da V9.

    Ordem utilizada:
      1. personalização geral;
      2. tema de Tabela do Excel (se existir);
      3. estilo exato da célula (maior prioridade).
*/
aplicarEstilosImportadosNaTabela = function () {
  if (!planilhaAtual || !planilhaAtual.aparenciaImportada) return;

  const aparencia = planilhaAtual.aparenciaImportada;

  const container = tabelaPlanilha?.closest(".tabela-container");
  container?.classList.add("tem-aparencia-importada");

  /* fallback de tema para arquivos com TableStyle */
  aplicarTemaTabelaImportadoV10();

  /* cabeçalhos */
  const cabecalhos = cabecalhoTabela?.querySelectorAll("th") || [];

  planilhaAtual.colunas.forEach((campo, indiceColuna) => {
    const th = cabecalhos[indiceColuna];
    if (!th) return;

    const estilo = obterEstiloDaBiblioteca(
      planilhaAtual,
      aparencia.cabecalho?.[campo.id],
    );

    if (!estilo) return;

    aplicarEstiloExcelEmElemento(th, estilo);

    const botaoTitulo = th.querySelector(".botao-ordenar-campo");
    if (botaoTitulo) {
      aplicarEstiloExcelEmElemento(botaoTitulo, estilo, {
        aplicarFundo: false,
        aplicarBorda: false,
      });
    }
  });

  /* células */
  corpoTabela?.querySelectorAll("tr").forEach((tr) => {
    const indiceLinha = Number(tr.dataset.linhaIndex);
    const estilosLinha = aparencia.linhas?.[indiceLinha];

    if (!estilosLinha) return;

    const celulas = tr.querySelectorAll("td");

    planilhaAtual.colunas.forEach((campo, indiceColuna) => {
      const td = celulas[indiceColuna];
      if (!td) return;

      const estilo = obterEstiloDaBiblioteca(
        planilhaAtual,
        estilosLinha[campo.id],
      );

      if (!estilo) return;

      aplicarEstiloExcelEmElemento(td, estilo);

      const controle = td.querySelector("input, select");
      if (controle) {
        aplicarEstiloExcelEmElemento(controle, estilo, {
          aplicarBorda: false,
        });

        const corFundo =
          corExcelParaCss(estilo.fill?.fgColor) ||
          corExcelParaCss(estilo.fill?.bgColor);

        if (corFundo) controle.style.backgroundColor = corFundo;
      }
    });

    const altura = aparencia.alturasLinhas?.[indiceLinha];
    if (Number.isFinite(altura) && altura > 0) {
      tr.style.height = `${Math.max(22, altura * 1.333)}px`;
    }
  });

  aplicarLargurasImportadasNaTabela();
};

/*
    Melhora a largura importada.
    Se o Excel forneceu uma largura pequena demais para o cabeçalho, usamos
    pelo menos a largura necessária para o nome da coluna. Assim títulos não
    ficam quebrados/cortados mesmo quando o arquivo original tinha AutoFit.
*/
aplicarLargurasImportadasNaTabela = function () {
  if (!planilhaAtual || !tabelaPlanilha) return;

  const aparencia = planilhaAtual.aparenciaImportada;
  if (!aparencia) return;

  let colgroup = tabelaPlanilha.querySelector("colgroup[data-importado='1']");

  if (!colgroup) {
    colgroup = document.createElement("colgroup");
    colgroup.dataset.importado = "1";
    tabelaPlanilha.insertBefore(colgroup, tabelaPlanilha.firstChild);
  }

  colgroup.innerHTML = "";

  planilhaAtual.colunas.forEach((campo) => {
    const col = document.createElement("col");
    const larguraExcel = Number(aparencia.largurasColunas?.[campo.id]);

    /*
        8.2 px por caractere é uma aproximação um pouco mais folgada que a V9.
        Também consideramos o tamanho do cabeçalho para evitar "Total de aulas"
        em duas linhas quando existe espaço suficiente.
    */
    const peloCabecalho = Math.max(
      92,
      String(campo.nome || "").length * 8.2 + 54,
    );
    const pelaPlanilha =
      Number.isFinite(larguraExcel) && larguraExcel > 0
        ? larguraExcel * 8.2 + 22
        : 0;

    const pixels = Math.min(520, Math.max(peloCabecalho, pelaPlanilha, 92));

    col.style.width = `${Math.round(pixels)}px`;
    col.style.minWidth = `${Math.round(pixels)}px`;
    col.style.maxWidth = `${Math.round(pixels)}px`;
    colgroup.appendChild(col);
  });

  const acoes = document.createElement("col");
  acoes.style.width = "86px";
  acoes.style.minWidth = "86px";
  colgroup.appendChild(acoes);
};

/* ================================================= */
/* EXPORTAÇÃO: REAPLICA TEMA E DIMENSÕES */
/* ================================================= */

/*
    Se o arquivo importado usava apenas um TableStyle, não existiam estilos
    individuais para todas as células. Por isso aplicamos também a paleta do
    tema na folha exportada, antes dos estilos exatos de cada célula.
*/
function aplicarTemaTabelaNoWorksheetV10(worksheet, planilha) {
  const estiloTabela = planilha?.aparenciaImportada?.estiloTabela;
  const tema = paletaTemaTabelaExcelV10(estiloTabela?.theme);
  if (!worksheet || !tema) return worksheet;

  const borda = criarBorda(tema.borda);

  planilha.colunas.forEach((campo, coluna) => {
    const endereco = XLSX.utils.encode_cell({ r: 0, c: coluna });
    const cell = worksheet[endereco];
    if (!cell) return;

    cell.s = combinarEstiloExcel(cell.s, {
      fill: {
        patternType: "solid",
        fgColor: { rgb: tema.cabecalho },
      },
      font: {
        color: { rgb: tema.textoCabecalho },
        bold: true,
      },
      border: borda,
    });
  });

  planilha.linhas.forEach((linha, indiceLinha) => {
    const usarFaixa = estiloTabela.showRowStripes !== false;
    const fundo =
      usarFaixa && indiceLinha % 2 === 1 ? tema.linha2 : tema.linha1;

    planilha.colunas.forEach((campo, coluna) => {
      const endereco = XLSX.utils.encode_cell({
        r: indiceLinha + 1,
        c: coluna,
      });

      const cell = worksheet[endereco];
      if (!cell) return;

      cell.s = combinarEstiloExcel(cell.s, {
        fill: {
          patternType: "solid",
          fgColor: { rgb: fundo },
        },
        font: {
          color: { rgb: tema.texto },
        },
        border: borda,
      });
    });
  });

  return worksheet;
}

/*
    A função atual criarWorksheet já passou por wrappers das versões anteriores.
    Guardamos essa versão completa e acrescentamos apenas o fallback de tema.
*/
const criarWorksheetAntesDaV10 = criarWorksheet;

criarWorksheet = function (...argumentos) {
  const worksheet = criarWorksheetAntesDaV10.apply(this, argumentos);

  if (planilhaAtual?.aparenciaImportada?.estiloTabela) {
    aplicarTemaTabelaNoWorksheetV10(worksheet, planilhaAtual);

    /*
        Reaplica estilos individuais por último, pois eles são mais específicos
        que o tema geral da Tabela.
    */
    aplicarAparenciaImportadaNoWorksheet(worksheet, planilhaAtual);
  }

  return worksheet;
};

/* ================================================= */
/* IMPORTAÇÃO AVANÇADA .XLSX */
/* ================================================= */

let importacaoPendenteV10 = null;

/*
    Guardamos a importação da V9 para arquivos CSV/XLS e como fallback caso
    algum .xlsx específico não seja aceito pelo ExcelJS.
*/
const importarPlanilhaArquivoAntesDaV10 = importarPlanilhaArquivo;

/*
    FUNÇÃO: importarPlanilhaArquivo() - V10

    Fluxo:
      .csv / .xls -> importador compatível antigo;
      .xlsx -> ExcelJS;
      várias abas -> pergunta qual importar;
      uma aba -> importa diretamente.
*/
importarPlanilhaArquivo = async function (event) {
  const input = event.target;
  const arquivo = input.files?.[0];
  if (!arquivo) return;

  const extensao = arquivo.name.split(".").pop()?.toLowerCase();

  /* ExcelJS trabalha com XLSX. Para CSV/XLS mantemos o método antigo. */
  if (extensao !== "xlsx") {
    return importarPlanilhaArquivoAntesDaV10(event);
  }

  input.value = "";

  if (typeof ExcelJS === "undefined") {
    mostrarToast(t("import.excelJsMissing"), "erro");

    return importarPlanilhaArquivoAntesDaV10({
      target: {
        files: [arquivo],
        value: "",
      },
    });
  }

  try {
    const bytes = await arquivo.arrayBuffer();
    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.load(bytes);

    let worksheets = workbook.worksheets.filter(
      (worksheet) =>
        worksheet.state !== "hidden" && worksheet.state !== "veryHidden",
    );

    if (worksheets.length === 0) {
      worksheets = workbook.worksheets;
    }

    if (worksheets.length === 0) {
      await mostrarAviso(t("import.empty"));
      return;
    }

    importacaoPendenteV10 = {
      workbook,
      arquivo,
      worksheets,
    };

    if (worksheets.length === 1) {
      await importarAbaExcelJSV10(worksheets[0]);
      return;
    }

    abrirEscolhaAbaImportacaoV10(worksheets);
  } catch (erro) {
    console.error("Falha no leitor avançado de Excel:", erro);
    mostrarToast(t("import.xlsxFallback"), "erro");

    return importarPlanilhaArquivoAntesDaV10({
      target: {
        files: [arquivo],
        value: "",
      },
    });
  }
};

/*
    FUNÇÃO: abrirEscolhaAbaImportacaoV10()

    Cria um botão para cada aba visível do arquivo.
*/
function abrirEscolhaAbaImportacaoV10(worksheets) {
  const modal = document.getElementById("modalEscolherAbaImportacao");
  const lista = document.getElementById("listaAbasImportacao");

  if (!modal || !lista) {
    importarAbaExcelJSV10(worksheets[0]);
    return;
  }

  lista.innerHTML = "";

  worksheets.forEach((worksheet) => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "botao-aba-importacao";

    const area = detectarAreaImportacaoExcelJSV10(worksheet);
    const dimensao = area
      ? `${area.bottom - area.top + 1} × ${area.right - area.left + 1}`
      : "";

    botao.innerHTML = `
      <strong>${escaparHTML(worksheet.name)}</strong>
      <small>${escaparHTML(dimensao)}</small>
    `;

    botao.onclick = async () => {
      modal.close();
      await importarAbaExcelJSV10(worksheet);
    };

    lista.appendChild(botao);
  });

  modal.showModal();
}

function cancelarImportacaoExcelV10() {
  document.getElementById("modalEscolherAbaImportacao")?.close();
  importacaoPendenteV10 = null;
}

/*
    FUNÇÃO: importarAbaExcelJSV10()

    Monta a nova planilha usando:
      - somente área visível / tabela do Excel;
      - estilos reais lidos pelo ExcelJS;
      - largura de coluna;
      - altura de linha;
      - TableStyle como fallback;
      - personalização geral derivada do arquivo.
*/
async function importarAbaExcelJSV10(worksheet) {
  try {
    const estrutura = extrairPlanilhaExcelJSV10(worksheet);

    if (!estrutura || estrutura.colunas.length === 0) {
      await mostrarAviso(t("import.empty"));
      return;
    }

    const aparenciaImportada = extrairAparenciaExcelJSV10(worksheet, estrutura);

    const personalizacao = extrairPersonalizacaoExcelJSV10(
      worksheet,
      estrutura,
      aparenciaImportada,
    );

    const nomeBase =
      importacaoPendenteV10?.arquivo?.name?.replace(/\.xlsx$/i, "") ||
      "Planilha importada";

    /* acrescenta nome da aba quando o arquivo possui várias */
    const variasAbas = (importacaoPendenteV10?.worksheets?.length || 0) > 1;
    const nome = variasAbas ? `${nomeBase} - ${worksheet.name}` : nomeBase;

    const novaPlanilha = {
      id: String(Date.now()),
      nome,
      tipo: "excel",
      modelo: "vazio",
      colunas: estrutura.colunas,
      linhas: estrutura.linhas,
      criadaEm: new Date().toISOString(),

      /* configurações gerais extraídas do arquivo */
      personalizacao,

      /* estilos detalhados de células e dimensões */
      aparenciaImportada,

      /* informações que ajudam a diagnosticar a importação futuramente */
      origemImportacao: {
        leitor: "ExcelJS",
        arquivo: importacaoPendenteV10?.arquivo?.name || null,
        aba: worksheet.name,
      },
    };

    planilhas.push(novaPlanilha);
    salvar();
    carregarDashboard();
    importacaoPendenteV10 = null;

    mostrarToast(t("import.success"), "sucesso");
    abrirPlanilha(novaPlanilha.id);
  } catch (erro) {
    console.error("Erro ao montar a aba importada:", erro);
    await mostrarAviso(t("import.error"));
  }
}

/* ================================================= */
/* INICIALIZAÇÃO DA V10 */
/* ================================================= */

/*
    Atualiza a tradução dos novos elementos e, se estivermos em lixeira.html,
    monta a lista de planilhas excluídas.
*/
aplicarTraducao();
carregarLixeira();

/* ================================================= */
/* V11 - CORREÇÃO DOS CÁLCULOS GENÉRICOS */
/* ================================================= */

/*
    PROBLEMA CORRIGIDO
    ------------------

    Antes, os cálculos genéricos como:

    - Soma da linha
    - Média da linha
    - Produto da linha

    só consideravam colunas previamente classificadas como:

    - número
    - moeda
    - porcentagem

    Isso causava um problema em planilhas importadas.

    Exemplo:

    Catapimbas1 | Catapimbas2 | Catapimbas3 | Soma
    Seila       | 2414142     | 24214       | vazio

    Se Catapimbas2 tivesse sido classificada como "texto" durante a
    importação, o número 2414142 era ignorado, mesmo sendo um número válido.

    A partir da V11, o NexaGrid olha para O VALOR DA CÉLULA.

    Portanto:

    - "Seila"    -> texto -> ignorado
    - 2414142     -> número -> usado
    - "24214"    -> texto numérico -> convertido e usado
    - "IN0001"   -> código com letras -> ignorado

    Essa lógica funciona mesmo quando a coluna importada está marcada como texto.
*/

/*
    FUNÇÃO: numeroOuNull()

    Faz uma conversão NUMÉRICA MAIS SEGURA.

    Diferente da versão antiga, ela não transforma qualquer texto que possua
    algum dígito em número.

    Exemplos:

    2414142       -> 2414142
    "24214"       -> 24214
    "R$ 1.275"    -> 1275
    "R$ 51,00"    -> 51
    "80%"         -> 80

    "IN0001"      -> null
    "Seila2312"   -> null
    "02/09/2026"  -> null

    Isso evita somar códigos, nomes e datas por acidente.
*/
function numeroOuNull(valor) {
  if (valor === null || valor === undefined || valor === "") return null;

  /* se já chegou como número real, basta validar */
  if (typeof valor === "number") {
    return Number.isFinite(valor) ? valor : null;
  }

  /* datas não participam de soma genérica */
  if (valor instanceof Date) return null;

  let texto = String(valor).trim();
  if (!texto) return null;

  /*
      aceita números negativos escritos entre parênteses:
      (150) -> -150
  */
  let negativoPorParenteses = false;

  if (/^\(.*\)$/.test(texto)) {
    negativoPorParenteses = true;
    texto = texto.slice(1, -1).trim();
  }

  /*
      remove apenas símbolos monetários e porcentagem.
      letras comuns continuam no texto e fazem a validação falhar.
  */
  texto = texto
    .replace(/R\$/gi, "")
    .replace(/[€£¥$]/g, "")
    .replace(/%$/, "")
    .replace(/\s+/g, "")
    .trim();

  /*
      depois de remover os símbolos permitidos, só podem existir:
      números, sinal, ponto e vírgula.

      portanto "IN0001" e "ABC123" são rejeitados.
  */
  if (!/^[+-]?[0-9.,]+$/.test(texto)) return null;

  const sinal = texto.startsWith("-") ? -1 : 1;
  texto = texto.replace(/^[+-]/, "");

  if (!texto || !/[0-9]/.test(texto)) return null;

  const quantidadePontos = (texto.match(/\./g) || []).length;
  const quantidadeVirgulas = (texto.match(/,/g) || []).length;

  /*
      CASO 1: possui ponto e vírgula.

      O separador que aparece por último é tratado como decimal.
      O outro é considerado separador de milhar.

      1.234,56 -> 1234.56
      1,234.56 -> 1234.56
  */
  if (quantidadePontos > 0 && quantidadeVirgulas > 0) {
    const ultimoPonto = texto.lastIndexOf(".");
    const ultimaVirgula = texto.lastIndexOf(",");

    if (ultimaVirgula > ultimoPonto) {
      texto = texto.replace(/\./g, "").replace(",", ".");
    } else {
      texto = texto.replace(/,/g, "");
    }
  } else if (quantidadeVirgulas > 0) {

  /*
      CASO 2: somente vírgula.

      No projeto usamos padrão brasileiro, então uma única vírgula é decimal.
      Várias vírgulas com blocos de 3 números são tratadas como milhar.
  */
    const partes = texto.split(",");

    if (
      quantidadeVirgulas > 1 &&
      partes.slice(1).every((parte) => parte.length === 3)
    ) {
      texto = partes.join("");
    } else {
      const ultima = partes.pop();
      texto = `${partes.join("")}.${ultima}`;
    }
  } else if (quantidadePontos > 0) {

  /*
      CASO 3: somente ponto.

      Quando há vários blocos de 3 dígitos, ou um único ponto seguido por
      exatamente 3 dígitos, consideramos o ponto como separador de milhar.

      1.275 -> 1275
      12.500 -> 12500
      1.234.567 -> 1234567

      Já 51.00 permanece decimal.
  */
    const partes = texto.split(".");

    const pareceMilhar =
      partes.length > 2
        ? partes.slice(1).every((parte) => parte.length === 3)
        : partes.length === 2 && partes[1].length === 3;

    if (pareceMilhar) {
      texto = partes.join("");
    }
  }

  const convertido = Number(texto);

  if (!Number.isFinite(convertido)) return null;

  const resultado = convertido * sinal * (negativoPorParenteses ? -1 : 1);
  return resultado;
}

/*
    FUNÇÃO: valoresNumericosDaLinhaV11()

    Percorre TODOS os campos de informação da linha e seleciona somente as
    células cujo conteúdo consegue ser interpretado com segurança como número.

    A classificação da coluna deixa de ser obrigatória para os cálculos
    genéricos. Isso é especialmente importante para planilhas importadas.
*/
function valoresNumericosDaLinhaV11(planilha, linha) {
  if (!planilha || !linha) return [];

  return (planilha.colunas || [])
    .filter((campo) => campo.tipo === "info")
    .map((campo) => numeroOuNull(linha[campo.id]))
    .filter((valor) => valor !== null);
}

/*
    FUNÇÃO: calcularCampo() - V11

    Mantém todos os cálculos específicos já existentes e altera apenas a parte
    dos cálculos genéricos.

    Agora soma, média e produto trabalham com os números encontrados NA LINHA,
    independentemente do tipo definido na coluna.
*/
function calcularCampo(planilha, linha, campo) {
  const calculo = campo.calculo;

  /* ---------- NOTAS ---------- */
  if (calculo === "media_notas") {
    return calcularMediaNotas(planilha, linha);
  }

  if (calculo === "situacao_notas") {
    const media = calcularMediaNotas(planilha, linha);

    if (!valorNaoVazio(media)) return "";

    return numero(media) >= Number(configuracoes.mediaAprovacao)
      ? t("status.approved")
      : t("status.failed");
  }

  /* ---------- ORÇAMENTO ---------- */
  if (calculo === "total_orcamento") {
    const quantidade = valorPorPapel(planilha, linha, "quantidade");
    const valor = valorPorPapel(planilha, linha, "valor_unitario");

    if (!valorNaoVazio(quantidade) || !valorNaoVazio(valor)) return "";

    return arredondar(numero(quantidade) * numero(valor));
  }

  /* ---------- ESTOQUE ---------- */
  if (calculo === "valor_estoque") {
    const quantidade = valorPorPapel(planilha, linha, "quantidade");
    const custo = valorPorPapel(planilha, linha, "custo_unitario");

    if (!valorNaoVazio(quantidade) || !valorNaoVazio(custo)) return "";

    return arredondar(numero(quantidade) * numero(custo));
  }

  if (calculo === "lucro_unitario") {
    const custo = valorPorPapel(planilha, linha, "custo_unitario");
    const venda = valorPorPapel(planilha, linha, "preco_venda");

    if (!valorNaoVazio(custo) || !valorNaoVazio(venda)) return "";

    return arredondar(numero(venda) - numero(custo));
  }

  if (calculo === "potencial_venda") {
    const quantidade = valorPorPapel(planilha, linha, "quantidade");
    const venda = valorPorPapel(planilha, linha, "preco_venda");

    if (!valorNaoVazio(quantidade) || !valorNaoVazio(venda)) return "";

    return arredondar(numero(quantidade) * numero(venda));
  }

  /* ---------- VENDAS ---------- */
  if (calculo === "total_venda") {
    const quantidade = valorPorPapel(planilha, linha, "quantidade");
    const valor = valorPorPapel(planilha, linha, "valor_unitario");

    if (!valorNaoVazio(quantidade) || !valorNaoVazio(valor)) return "";

    return arredondar(numero(quantidade) * numero(valor));
  }

  if (calculo === "comissao") {
    const total = calcularCampo(planilha, linha, {
      calculo: "total_venda",
    });

    const percentual = valorPorPapel(planilha, linha, "comissao_percentual");

    if (!valorNaoVazio(total) || !valorNaoVazio(percentual)) return "";

    return arredondar(numero(total) * (numero(percentual) / 100));
  }

  /* ---------- FREQUÊNCIA ---------- */
  if (calculo === "presencas") {
    const aulas = valorPorPapel(planilha, linha, "total_aulas");
    const faltas = valorPorPapel(planilha, linha, "faltas");

    if (!valorNaoVazio(aulas) || !valorNaoVazio(faltas)) return "";

    return arredondar(Math.max(numero(aulas) - numero(faltas), 0));
  }

  if (calculo === "frequencia_percentual") {
    const aulas = numero(valorPorPapel(planilha, linha, "total_aulas"));
    const presencas = calcularCampo(planilha, linha, {
      calculo: "presencas",
    });

    if (aulas <= 0 || !valorNaoVazio(presencas)) return "";

    return arredondar((numero(presencas) / aulas) * 100);
  }

  if (calculo === "situacao_frequencia") {
    const frequencia = calcularCampo(planilha, linha, {
      calculo: "frequencia_percentual",
    });

    if (!valorNaoVazio(frequencia)) return "";

    return numero(frequencia) >= Number(configuracoes.frequenciaMinima)
      ? t("status.regular")
      : t("status.attention");
  }

  /* ---------- ESTUDOS ---------- */
  if (calculo === "progresso_estudos") {
    const planejadas = numero(
      valorPorPapel(planilha, linha, "horas_planejadas"),
    );

    const estudadas = valorPorPapel(planilha, linha, "horas_estudadas");

    if (planejadas <= 0 || !valorNaoVazio(estudadas)) return "";

    return arredondar((numero(estudadas) / planejadas) * 100);
  }

  /* ================================================= */
  /* CÁLCULOS GENÉRICOS CORRIGIDOS */
  /* ================================================= */

  const valoresNumericos = valoresNumericosDaLinhaV11(planilha, linha);

  /*
      SOMA DA LINHA

      Exemplo:
      "Seila" + 2414142 + "24214"

      Resultado:
      2438356
  */
  if (calculo === "soma_linha") {
    if (valoresNumericos.length === 0) return "";

    return arredondar(
      valoresNumericos.reduce((total, valor) => total + valor, 0),
    );
  }

  /*
      MÉDIA DA LINHA

      Só divide pela quantidade de células realmente numéricas.
  */
  if (calculo === "media_linha") {
    if (valoresNumericos.length === 0) return "";

    const soma = valoresNumericos.reduce((total, valor) => total + valor, 0);

    return arredondar(soma / valoresNumericos.length);
  }

  /*
      PRODUTO DA LINHA

      Multiplica somente os valores que são realmente números.
  */
  if (calculo === "produto_linha") {
    if (valoresNumericos.length === 0) return "";

    return arredondar(
      valoresNumericos.reduce((total, valor) => total * valor, 1),
    );
  }

  return "";
}

/*
    FUNÇÃO: campoPossuiNumeroEmAlgumaLinhaV11()

    Usada na exportação.

    Uma coluna importada pode estar marcada como texto, mas conter números em
    algumas linhas. Nesse caso ela também precisa participar da fórmula do Excel.
*/
function campoPossuiNumeroEmAlgumaLinhaV11(planilha, campo) {
  if (!planilha || !campo || campo.tipo !== "info") return false;

  return (planilha.linhas || []).some(
    (linha) => numeroOuNull(linha[campo.id]) !== null,
  );
}

/*
    FUNÇÃO: referenciasGenericasExcelV11()

    Seleciona as colunas que podem possuir números para os cálculos genéricos
    exportados para Excel.

    Assim uma coluna importada como texto, mas contendo 2414142, entra na soma.
*/
function referenciasGenericasExcelV11(planilha, linhaExcel) {
  return (planilha.colunas || [])
    .filter(
      (outroCampo) =>
        outroCampo.tipo === "info" &&
        campoPossuiNumeroEmAlgumaLinhaV11(planilha, outroCampo),
    )
    .map(
      (outroCampo) =>
        `${colunaExcelCampo(planilha, outroCampo.id)}${linhaExcel}`,
    );
}

/*
    FUNÇÃO: formulaExcelCampo() - V11

    Mantém as fórmulas dos modelos e corrige as fórmulas genéricas exportadas.

    Para soma/média/produto usamos VALUE + IFERROR.

    Isso permite que o Excel trate "24214" como 24214, mas ignore textos como
    "Seila" ou "IN0001".
*/
function formulaExcelCampo(planilha, campo, linhaExcel) {
  const calc = campo.calculo;

  /* ---------- NOTAS ---------- */
  if (calc === "media_notas" || calc === "situacao_notas") {
    const notas = referenciasExcelPapel(planilha, "nota", linhaExcel);

    if (notas.length === 0) return null;

    const lista = notas.join(",");

    if (calc === "media_notas") {
      return `IF(COUNTA(${lista})=${notas.length},AVERAGE(${lista}),"")`;
    }

    return `IF(COUNTA(${lista})=${notas.length},IF(AVERAGE(${lista})>=${Number(configuracoes.mediaAprovacao)},"Aprovado","Reprovado"),"")`;
  }

  /* ---------- REFERÊNCIAS DOS MODELOS ---------- */
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
    const frequencia = `(MAX(${totalAulas}${linhaExcel}-${faltas}${linhaExcel},0)/${totalAulas}${linhaExcel}*100)`;

    if (calc === "frequencia_percentual") {
      return `IF(${totalAulas}${linhaExcel}>0,${frequencia},"")`;
    }

    return `IF(${totalAulas}${linhaExcel}>0,IF(${frequencia}>=${Number(configuracoes.frequenciaMinima)},"Regular","Atenção"),"")`;
  }

  if (calc === "progresso_estudos" && horasPlanejadas && horasEstudadas) {
    return `IF(${horasPlanejadas}${linhaExcel}>0,${horasEstudadas}${linhaExcel}/${horasPlanejadas}${linhaExcel}*100,"")`;
  }

  /* ================================================= */
  /* FÓRMULAS GENÉRICAS V11 */
  /* ================================================= */

  const referencias = referenciasGenericasExcelV11(planilha, linhaExcel);

  if (referencias.length === 0) return null;

  /*
      Cada referência é convertida com VALUE().
      Se não for número, IFERROR devolve vazio ou zero.
  */
  const valoresConvertidos = referencias.map(
    (ref) => `IFERROR(VALUE(${ref}),"")`,
  );

  const argumentos = valoresConvertidos.join(",");

  if (calc === "soma_linha") {
    return `SUM(${argumentos})`;
  }

  if (calc === "media_linha") {
    return `IFERROR(AVERAGE(${argumentos}),"")`;
  }

  if (calc === "produto_linha") {
    return `IF(COUNT(${argumentos})>0,PRODUCT(${argumentos}),"")`;
  }

  return null;
}

/* ================================================= */
/* EXPORTAÇÃO: CONVERTE TEXTOS NUMÉRICOS PARA NÚMEROS */
/* ================================================= */

/*
    O NexaGrid preserva a aparência original da planilha importada.
    Por isso alguns números podem ficar guardados internamente como texto
    formatado, por exemplo "2414142" ou "R$ 1.275".

    Antes de finalizar o XLSX, esta camada converte novamente essas células para
    números reais sempre que a conversão for segura.

    Isso ajuda as fórmulas do Excel a funcionarem normalmente depois do download.
*/
const criarWorksheetAntesDaV11 = criarWorksheet;

criarWorksheet = function (...argumentos) {
  const worksheet = criarWorksheetAntesDaV11.apply(this, argumentos);

  if (!planilhaAtual || !worksheet) return worksheet;

  planilhaAtual.linhas.forEach((linha, indiceLinha) => {
    planilhaAtual.colunas.forEach((campo, indiceColuna) => {
      /* campos calculados já recebem fórmula e não devem ser sobrescritos */
      if (campo.tipo !== "info") return;

      const valorOriginal = linha[campo.id];
      const numeroConvertido = numeroOuNull(valorOriginal);

      if (numeroConvertido === null) return;

      const endereco = XLSX.utils.encode_cell({
        r: indiceLinha + 1,
        c: indiceColuna,
      });

      const celula = worksheet[endereco];
      if (!celula || celula.f) return;

      /*
          Mantemos o objeto de estilo já aplicado e trocamos apenas o valor e
          o tipo interno da célula.
      */
      celula.v = numeroConvertido;
      celula.t = "n";
    });
  });

  return worksheet;
};
