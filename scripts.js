// Selecionar os elementos do formulário. 
const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category"); 

// Seleciona os elementos da lista 
const expenseList = document.querySelector("ul")
const expensesQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")


//captura o evento de input para formatar o valor
amount.oninput = () => {
// obtém o valor atual do input e remove os caracteres não numericos. 
    let value = amount.value.replace(/\D/g, "");

    //Transformar o valor em centavos
    value = Number(value) / 100 ;

    // Atualiza o valor do input
    amount.value = FormatCurrencyBRL(value) ; 
}

// Captura o evento de submit do formulário para obter os valores
function FormatCurrencyBRL(value){
    // Formata o valor no padrão BRL (Real Brasileiro)
    value = value.toLocaleString("pt-BR", {
        style : "currency",
        currency:"BRL",
    })

    // retorna com o valor já formatado.
    return value 
}

form.onsubmit = (event) => {
    //Previne o comportamento padrão de recaregar a página
    event.preventDefault()
    // Cria um objeto com os detalhes da nova despesa
    const newExpense = {
        id : new Date().getTime(),
        expense : expense.value, 
        category_id: category.value,
        category_name : category.options[category.selectedIndex].text,
        amount : amount.value,
        created_at: new Date(), 
    } 
    
    expenseAdd(newExpense)
}


// Adiciona um novo item na lista
function expenseAdd(newExpense) {
    try {
        // Cria o elemento para adicionar o item (li) na lista (ul).
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        // Cria o ícone da categoria
        const expenseIcon=document.createElement("img")
        expenseIcon.setAttribute("src",`img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)

        // Criar a info da despesa 
        const expenseInfo= document.createElement("div")
        expenseInfo.classList.add("expense-info")

        // criar o nome da despesa 
        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense

        // Criar a categoria da despesa 
        const expenseCategory = document.createElement("span")
        expenseCategory.textContent=newExpense.category_name

        // Adiciona nome e categoria na div das informações da despesa
        expenseInfo.append(expenseName, expenseCategory)

        // Criar o valor da despesa 
        const expenseAmount=document.createElement("span")
        expenseAmount.classList.add("expense-amount")

        // Adicionar uma coisa dentro da outra. (small dentro da span) e tirar o R$ do resultado amount. 
        expenseAmount.innerHTML= `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$","")}`


        // Criar o icone de remover 
        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src","img/remove.svg")
        removeIcon.setAttribute("alt","remover")


        // Adiconar as informações no item. 
        expenseItem.append(expenseIcon, expenseInfo,expenseAmount,removeIcon)

        // Adicionar o item na lista 
        expenseList.append(expenseItem)

        // limpa o formulario para adicionar um novo item 
        formClear(); 

        // Atualiza os totais
        updateTotals()

    } catch (error) {
        alert("Não foi possivel atualizar a lista de dispesa")
        console.log(error)
    }
}

// Atualiza os totais 
function updateTotals(){
    try {
        // Recupera todos os itens (li) da lista (ul)
        const items = expenseList.children

        // Atualiza a quantidade dee itens da lista 
        expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

        // Variavel para incrementar o total 
        let total = 0 
        
        //Percorrer cada item (li) da lista (ul)
        for(let item = 0; item < items.length; item++ ) {
            const itemAmount= items[item].querySelector(".expense-amount")

            // Organizar o retorno do itemAmount
            // Remove caracteres não numericos e substitui a virgula pelo ponto. 
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",",".")

            // Converte o valor para float 
            value = parseFloat(value)

            // Verificar se é um numero valido
            if (isNaN(value)){
               return alert("Não foi possível calcular o total. O valor não parece ser um número")
            }


            // Incrementando o valor total 
            total +=Number(value)
        } 

    
        // Criar a span para adicionar a R$ formatado
        const symbolBRL = document.createElement("small")
        symbolBRL.textContent="R$"

        //Formata o valor e remove o R$ que será exibido pela small com um estilo customizado
        total = FormatCurrencyBRL(total).toUpperCase().replace("R$","")

        console.log(total)

        // Limpa o conteudo do elemento
        expensesTotal.innerHTML = ""

        // Adiciona o simbolo da moeda e o valot total formatado.
        expensesTotal.append(symbolBRL,total)



    } catch (error) {
      console.log(error)
      alert("Não foi possível atualizar os totais.")
        
    }
}


// evento que captura o clique nos itens da lista 
expenseList.addEventListener("click",function (event){
    // verificar se elemento clicado é o ícone de remover. 

    if (event.target.classList.contains("remove-icon")){

        //obtem o li pai do elemento clicado
        const item =  event.target.closest(".expense")

        // remove o item da lista
        item.remove();

    }

    //atualiza a quantidade total
    updateTotals();
});

function formClear(){
    expense.value=""
    category.value=""
    amount.value=""


    // foco no input do amount.
    expense.focus();
}