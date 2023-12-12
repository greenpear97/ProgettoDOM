let navbar = document.querySelector("#navbar")

window.addEventListener("scroll", ()=>{
   if (window.scrollY > 0){
      navbar.classList.add("navbar-custom")      
   }else{
      navbar.classList.remove("navbar-custom")
   }
})

fetch("./annunci.json").then((response)=> response.json()).then((data)=> {


 let cardsWrapper = document.querySelector("#cardsWrapper")

//CREAZIONE ANNUNCI

function createCards(array){
    cardsWrapper.innerHTML = "";
    array.forEach((card, i) => {
        let div = document.createElement("div")
        div.classList.add("col-12", "col-md-6", "col-lg-4", "mb-5" )
        div.innerHTML = `
            <div class="card">
                <div class="overflow-hidden">
                  <img src="https://picsum.photos/20${i}" class="card-img-top transition" alt="...">
                </div>
                <div class="card-body shadow">
                <h5 class="card-title text-truncate">${card.name}</h5>
                <p class="card-text">${card.categoria}</p>
                <p class="card-text fw-bold">Prezzo: ${card.prezzo}$</p>
                <div class="d-flex justify-content-between">
                    <a href="#" class="btn btn-outline color-S">Aggiungi al carrello</a>
                    <i class="bi bi-heart fs-4"></i>
                </div>
                <p class="card-text mt-3 text-end"><small class="text-body-secondary">Last updated 3 mins ago</small></p>
                </div>
            </div>
        `
    cardsWrapper.appendChild(div);
});

}
createCards(data);

//FILTRO PER CATEGORIA

let categoryButtons = document.querySelector("#categoryButtons")

function setCategories(){
    let categories = data.map( (el)=> el.categoria)
 

    let uniqueCategories = [];

    categories.forEach((categoria)=>{
        if(!uniqueCategories.includes(categoria)){
            uniqueCategories.push(categoria)            
        }
    })

    uniqueCategories.forEach((uniqueCategory)=>{
        let div = document.createElement("div")
        div.classList.add("form-check")
        div.innerHTML = `
            <input class="form-check-input" type="radio" name="flexRadioDefault" id="${uniqueCategory}">
            <label class="form-check-label" for="${uniqueCategory}">
            ${uniqueCategory}
            </label>
        `
        categoryButtons.appendChild(div)
    })

    }
    setCategories();

    let inputChecks = document.querySelectorAll(".form-check-input");

    function filterByCategory(array){
        let arrayButtons = Array.from(inputChecks)
        let checked = arrayButtons.find((el)=> el.checked)

        if(checked.id == "All"){
           return array

        }else {
            let filtered = array.filter((el)=> el.categoria == checked.id ) 
            return filtered
        }
    }

    inputChecks.forEach((radioButton)=>{
        radioButton.addEventListener("click", ()=>{
            globalFilter();
        })
    })

// FILTRO PER PREZZO
let inputPrice = document.querySelector("#inputPrice");
let price = document.querySelector("#price");

function minMaxPrices(){
    let prices = data.map((el)=> el.prezzo)
    let max = Math.max(...prices)
    let min = Math.min(...prices)
    inputPrice.max = max;
    inputPrice.value = max;
    inputPrice.min = min;
    price.innerHTML = max;
}
minMaxPrices()

function filterByPrice(array){
    let filtered = array.filter((el)=> el.prezzo <= inputPrice.value).sort((a, b)=> b.prezzo - a.prezzo)
    price.innerHTML = inputPrice.value;
    return filtered
}

inputPrice.addEventListener("input",()=>{
    globalFilter();
})

// FILTRO PER PAROLA

function globalFilter(){
    let filteredByCategory = filterByCategory(data)
    let filteredByPrice = filterByPrice(filteredByCategory)
    createCards(filteredByPrice);
}


})

