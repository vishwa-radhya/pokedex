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
const defense =document.getElementById('defense')
const specialAttack =document.getElementById('special-attack')
const specialDefense =document.getElementById('special-defense')
const speed =document.getElementById('speed')
const spinner =document.getElementById('loader')
const bulb=document.getElementById('bulb')
const info=document.getElementById('info')
const dropDownCont =document.getElementById('drop-down-cont')
let isLoading = false;
let isGlowing=false;
let input;
const fetchApi ='https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/'
let data=[]

const fetchData=async()=>{
    try{
        const response =await fetch(fetchApi);
        const result =await response.json();
        data=result.results
        console.log('Fetched Data:', data);
    }catch(e){
        console.log('error coocured while calling fetchData',err);
    }
}
window.onload=()=>{
    fetchData();
}


bulb.addEventListener('click',()=>{
    isGlowing=!isGlowing;
    if(isGlowing){
        info.style.display='block'
    }else{
        info.style.display='none'
    }
})

const updateStats=(stats)=>{
    const stat_array =[];
    for(let st of stats){
        stat_array.push(st.base_stat)
    }
    hp.textContent=stat_array[0];
    attack.textContent=stat_array[1];
    defense.textContent=stat_array[2];
    specialAttack.textContent=stat_array[3];
    specialDefense.textContent=stat_array[4];
    speed.textContent=stat_array[5];
}

const updateNameAndId=(name,id)=>{
    pokemonName.textContent=name.toUpperCase();
    pokemonId.textContent=`#${id}`;
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
        pokemonType.innerHTML+=`<div class='${name.toLowerCase()} cent'>${name.toUpperCase()}</div>`
    }
}

const filterInput=input=>{
    return input.replace(/[^a-zA-Z0-9-]/g,'').toLowerCase();
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
     input = filterInput(searchInput.value);
     console.log('Updating UI with:', searchInput.value);
     dropDownCont.classList.remove('show')
        dropDownCont.classList.add('dd-hide')
    if(input===''){
        spinner.style.animation='stop-spin 1s ease-in-out infinite';
        spinner.style.display='none';
        return;
    }
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
searchInput.addEventListener('keyup',(e)=>{
    if (!data.length) {
        console.log('Data not loaded yet');
        return;
    }
    if(e.key==='Enter'){
        updateUI();
    }
    if(searchInput.value===''){
        dropDownCont.classList.remove('show');
        dropDownCont.classList.add('dd-hide');
        console.log('Dropdown hidden');
    }else{
        
        // showSuggestions(searchInput.value);
    //     const filterData = data.filter(pokemon=>pokemon.name.startsWith(searchInput.value));
    // console.log('Filtered data:', filterData);
    // for(let obj of filterData){
    //     const {name}=obj;
    //     // const btn =document.createElement('button');
    //     // btn.classList.add('dd-btns');
    //     // btn.textContent=name;
    //     // btn.addEventListener('click',()=>{searchInput.value=name});
    //     // dropDownCont.appendChild(btn);
    //     dropDownCont.innerHTML+=`<button class='dd-btns' onclick='()=>{searchInput.value=${name}}'>${name}</button>`
    // }
    dropDownCont.classList.remove('dd-hide');
        dropDownCont.classList.add('show');
        console.log('Dropdown shown'); 
        showSuggestions(searchInput.value)
    }
})
const showSuggestions=(input)=>{
    console.log('Input for suggestions:', input);
    console.log('Current data:', data); 
    const filterData = data.filter(pokemon=>pokemon.name.startsWith(input));
    console.log('Filtered data:', filterData);
    dropDownCont.innerHTML='';
    for(let obj of filterData){
        const {name}=obj;
        const btn =document.createElement('button');
        btn.classList.add('dd-btns');
        btn.textContent=name;
        btn.addEventListener('click',()=>{searchInput.value=name});
        dropDownCont.appendChild(btn);
    }
}
// console.log('Data:', data);