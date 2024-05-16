const searchInput =document.getElementById('search-input')
const searchButton =document.getElementById('search-button')
const pokemonName =document.getElementById('pokemon-name')
const pokemonId =document.getElementById('pokemon-id')
const pokemonWeight =document.getElementById('weight')
const pokemonHeight =document.getElementById('height')
const imgView =document.getElementById('sprite')
const pokemonType =document.getElementById('types')
const hp =document.getElementById('hp')
const attack =document.getElementById('attack')
const defence =document.getElementById('defence')
const specialAttack =document.getElementById('special-attack')
const specialDefence =document.getElementById('special-defence')
const speed =document.getElementById('speed')
const spinner =document.getElementById('loader')
let isLoading = false;
const fetchApi ='https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/'


const updateStats=(stats)=>{
    const stat_array =[];
    for(let st of stats){
        stat_array.push(st.base_stat)
    }
    hp.textContent=stat_array[0];
    attack.textContent=stat_array[1];
    defence.textContent=stat_array[2];
    specialAttack.textContent=stat_array[3];
    specialDefence.textContent=stat_array[4];
    speed.textContent=stat_array[5];
}

const updateNameAndId=(name,id)=>{
    pokemonName.textContent=name;
    pokemonId.textContent=`${id}#`;
}

const heightAndWeight=(height,weight)=>{
    pokemonWeight.textContent=`Weight: ${weight}`;
    pokemonHeight.textContent=`Height: ${height}`;
}

const updateImageAndTypes=(types,sprites,pokemon)=>{
    imgView.src=sprites.front_default;
    imgView.alt=pokemon;
    for(let num of types){
        const {name}=num.type;
        pokemonType.innerHTML+=`<div class='${name.toLowerCase()} cent'>${name}</div>`
    }
}

const filterInput=input=>{
    return input.replace(/[^a-zA-Z0-9]/g,'');
}

const updateUI=async()=>{
    if(searchInput.value===''){
        return;
    }
    if(Number(searchInput.value)>10277){
        alert('provided id is greater than pokemon count try less than 10277')
        return;
    }
    pokemonType.innerHTML=''
    isLoading =true;
    if(isLoading){
        spinner.style.animation='spin 1s ease-in-out infinite';
        spinner.style.display='block'
    }
    const input = filterInput(searchInput.value);
    if(input===''){
        spinner.style.animation='stop-spin 1s ease-in-out infinite';
        spinner.style.display='none';
        return;
    }
    // console.log(input);
    try{
        const response = await fetch(fetchApi+input);
        const result = await response.json() 
        isLoading=false;
        if(!isLoading){
            spinner.style.animation='stop-spin 1s ease-in-out infinite';
            spinner.style.display='none';
        }
        const {height,id,name,sprites,stats,types,weight}=result;
        updateNameAndId(name,id);
        heightAndWeight(height,weight);
        updateImageAndTypes(types,sprites,name);
        updateStats(stats);
    }catch(e){
        spinner.style.animation='stop-spin 1s ease-in-out infinite';
        spinner.style.display='none';
        alert('error occured or undetermined id')
    }
}

searchButton.addEventListener('click',()=>{
    updateUI();
})
searchInput.addEventListener('keydown',(e)=>{
    if(e.key==='Enter'){
        updateUI();
    }
})