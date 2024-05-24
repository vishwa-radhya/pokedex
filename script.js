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
const animationBtn=document.getElementById('gif-btn');
const normalBtn=document.getElementById('normal-btn');
const dropDownCont =document.getElementById('drop-down-cont')
let isLoading = false;
let isGlowing=false;
let globalInput;
let input;
let animatedGifLink;
let normalImgLink;
const fetchApi ='https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/'
const fetchApi2='https://pokeapi.co/api/v2/pokemon/';
let data=[]

const fetchData=async()=>{
    try{
        const response =await fetch(fetchApi);
        const result =await response.json();
        data=result.results
    }catch(e){
        console.log('error coocured while calling fetchData',err);
    }
}
window.onload=()=>{
    fetchData();
    animationBtn.hidden=true;
}

const spinnerOnandOff=()=>{
    if(isLoading){
        spinner.style.animation='spin 1s ease-in-out infinite';
        spinner.style.display='block';
    }else{
        spinner.style.animation='stop-spin 1s ease-in-out infinite';
        spinner.style.display='none';
    }
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
    spinnerOnandOff();
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
    normalImgLink=sprites.front_default;
    imgView.src=sprites.front_default;
    imgView.alt=pokemon;
    for(let num of types){
        const {name}=num.type;
        pokemonType.innerHTML+=`<div class='${name.toLowerCase()} cent'>${name.toUpperCase()}</div>`
    }
}

const filterInput=(input)=>input.replace(/[^a-zA-Z0-9-]/ig,'').toLowerCase();

const updateUI=async()=>{
    animationBtn.hidden=true;
    if(searchInput.value===''){
        return;
    }
    if(Number(searchInput.value)>10277){
        alert('provided id is greater than pokemon count try less than 10277')
        return;
    }
    pokemonType.innerHTML=''
    isLoading =true;
    spinnerOnandOff();
     input = filterInput(searchInput.value);
     globalInput=input;
     dropDownCont.classList.remove('show')
        dropDownCont.classList.add('dd-hide')
    if(input===''){
        spinner.style.animation='stop-spin 1s ease-in-out infinite';
        spinner.style.display='none';
        return;
    }
    try{
        const response = await fetch(fetchApi+input);
        const result = await response.json();
        isLoading=false;
        const {height,id,name,sprites,stats,types,weight}=result;
        updateNameAndId(name,id);
        heightAndWeight(height,weight);
        updateImageAndTypes(types,sprites,name);
        updateStats(stats);
        normalBtn.hidden=true;
        animationBtn.hidden=false;
    }catch(e){
        spinner.style.animation='stop-spin 1s ease-in-out infinite';
        spinner.style.display='none';
        alert('error occured or undetermined id')
    }
}

animationBtn.addEventListener('click',async ()=>{
    isLoading=true;
    spinnerOnandOff();
    try{
        const response2 =await fetch(fetchApi2+globalInput);
        const result2=await response2.json();
        const link=result2.sprites.versions['generation-v']['black-white'].animated.front_default;
            animatedGifLink=link;
    }catch(e){
        console.log(e);
    }
    if(!animatedGifLink){
        alert('no animation available');
        isLoading=false;
        spinnerOnandOff();
        return;
    }
    imgView.style.width='95px';
    imgView.src='';
    imgView.src=animatedGifLink;
    isLoading=false;
    spinnerOnandOff();
    animationBtn.hidden=true;
    normalBtn.hidden=false;
})

normalBtn.addEventListener('click',()=>{
    imgView.style.width='170px';
    isLoading=true;
    spinnerOnandOff();
    imgView.src='';
    imgView.src=normalImgLink;
    normalBtn.hidden=true;
    animationBtn.hidden=false;
    isLoading=false;
    spinnerOnandOff();
})

searchButton.addEventListener('click',()=>{
    updateUI();
})
searchInput.addEventListener('input',(e)=>{
    const query = searchInput.value.toLowerCase();
    if (!data.length) {
        console.log('Data not loaded yet');
        return;
    }
    if(searchInput.value===''){
        dropDownCont.classList.remove('show');
        dropDownCont.classList.add('dd-hide');
    }else{
    dropDownCont.classList.remove('dd-hide');
        dropDownCont.classList.add('show');
        if(/^[a-zA-Z]/.test(query)){
            showSuggestions(query)
        }else{
            showSuggestionsForId(query);
        }
    }
})

searchInput.addEventListener('keyup',(e)=>{
    if(e.key==='Enter'){
        updateUI();
    }
})

const showSuggestions=(query)=>{
    const filterData = data.filter(pokemon => pokemon.name.toLowerCase().startsWith(query));
    dropDownCont.innerHTML='';
    if(filterData.length===0){
        dropDownCont.innerHTML=`<p id='no-match'>NO MATCHES</p>`
    }
    filterData.forEach(pokemon=>{
        const div =document.createElement('div');
        div.classList.add('dd-btns');
        div.textContent = pokemon.name;
        div.addEventListener('click', () => {
            searchInput.value = pokemon.name;
            searchInput.focus();
        });
        dropDownCont.appendChild(div);
    })
}
const showSuggestionsForId=(query)=>{
    const filteredId=data.filter(pokemon=>pokemon.id.toString().startsWith(query.toString()));
    dropDownCont.innerHTML='';
    if(filteredId.length===0){
    dropDownCont.innerHTML=`<p id='no-match-num'>NO MATCHES</p>`;
    }
    filteredId.forEach(pokemon=>{
        const div =document.createElement('div');
        div.classList.add('dd-btns');
        div.textContent = pokemon.id;
        div.addEventListener('click', () => {
            searchInput.value = pokemon.id;
        });
        dropDownCont.appendChild(div);
    })
}