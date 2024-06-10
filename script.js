const searchInput =document.getElementById('search-input');
const container=document.getElementById('container');
const searchButton =document.getElementById('search-button');
const pokemonName =document.getElementById('pokemon-name');
const pokemonId =document.getElementById('pokemon-id');
const pokemonWeight =document.getElementById('weight');
const pokemonHeight =document.getElementById('height');
const imgView =document.getElementById('sprite');
const pokemonType =document.getElementById('types');
const hp =document.getElementById('hp');
const attack =document.getElementById('attack');
const defense =document.getElementById('defense');
const specialAttack =document.getElementById('special-attack');
const specialDefense =document.getElementById('special-defense');
const speed =document.getElementById('speed');
const spinner =document.getElementById('loader');
const bulb=document.getElementById('bulb');
const info=document.getElementById('info');
const animationBtn=document.getElementById('gif-btn');
const normalBtn=document.getElementById('normal-btn');
const dropDownCont =document.getElementById('drop-down-cont');
const maxBtn=document.getElementById('maximize');
const minBtn=document.getElementById('manimize');
const t_loader=document.getElementById('t-loader');
const noAnimationMsg=document.getElementById('no-anim');
const pokemonSoundElement=document.getElementById('music');
const toolTip=document.getElementById('tooltip');
const dialogElement=document.getElementById('dialog-ele');
const acceptDialogBtn=document.getElementById('dialog-ele').children[1].children[0];
const rejectDialogBtn=document.getElementById('dialog-ele').children[1].children[1];
let isLoading = false;
let isGlowing=false;
let globalInput;
let globalPokemonName;
let input;
let animatedGifLink;
let normalImgLink;
let globalPokemonId;
const evolExitBtn=document.getElementById('exit-btn-cont').children[1];
const evolCont =document.getElementById('evolution-cont');
const evolChainCont=document.getElementById('evolution-chain-cont');
const errImageContainer=document.getElementById('err');
let isNewImageLoaded=false;
const fetchApi ='https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/';
const fetchApi2='https://pokeapi.co/api/v2/pokemon/';
const fetchApi3='https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1302';
let data=[];
let idData=[];
const cacheEvolData={};
const fetchData=async()=>{
    try{
        t_loader.hidden=false;
        const response =await fetch(fetchApi3);
        const result =await response.json();
        data=result.results;
        idData=data.map(pokemon=>pokemon.url.slice(34).replace('/',''));
        t_loader.hidden=true;
        container.hidden=false;
    showToolTip();
    }catch(e){
        t_loader.hidden=true;
        container.hidden=true;
        errImageContainer.classList.replace('evol-hide','evol-show');
        return;
    }
}

const showToolTip=()=>{
    setTimeout(()=>{
        toolTip.style.visibility='hidden';
        toolTip.style.opacity='0';
        setTimeout(()=>{
            toolTip.style.visibility='visible';
            toolTip.style.opacity='1';
            setTimeout(()=>{
                toolTip.style.visibility='hidden';
                toolTip.style.opacity='0';
            },1800)
        },1800)
    },1800)
}

window.onload=()=>{
    fetchData();
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
    isGlowing ? info.style.display='block' : info.style.display='none';
})

const updateStats=(stats)=>{
    const stat_array =[];
    for(let st of stats){
        stat_array.push(st.base_stat)
    }
    const avail_stats=[hp,attack,defense,specialAttack,specialDefense,speed];
    avail_stats.forEach((stat,index)=>{
        stat.textContent=stat_array[index];
    })
    isNewImageLoaded=true;
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
    noAnimationMsg.hidden=true;
    normalize();
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
     dropDownCont.classList.replace('show','dd-hide');
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
        globalPokemonName=name;
        globalPokemonId=id;
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
        alert('error with animation try after some time');
        return;
    }
    if(!animatedGifLink){
        isLoading=false;
        spinnerOnandOff();
        noAnimationMsg.hidden=false;
        return;
    }
    imgView.style.width='107px';
    imgView.src='';
    imgView.src=animatedGifLink;
    btnAdjusterWithImageLoad();
    isLoading=false;
    spinnerOnandOff();
    animationBtn.hidden=true;
    normalBtn.hidden=false;
})

const playPokemonSound=()=>{
    if(globalPokemonName=='pikachu'){
        pokemonSoundElement.src='./sounds-beta/pikachu-c.mp3';
        pokemonSoundElement.autoplay=true;
    }else{
        return;
    }
}

const normalize=()=>{
    imgView.style.width='170px';
}

const btnAdjusterWithImageLoad=()=>{
    imgView.onload = () => {
        const currentWidth = parseInt(window.getComputedStyle(imgView).width);
        currentWidth >= 200 ? maxBtn.disabled=true : maxBtn.disabled=false;
        currentWidth <=50 ? minBtn.disabled=true : minBtn.disabled=false;
    };
}

normalBtn.addEventListener('click',()=>{
    noAnimationMsg.hidden=true;
    imgView.style.width='170px';
    isLoading=true;
    spinnerOnandOff();
    imgView.src='';
    imgView.src=normalImgLink;
    btnAdjusterWithImageLoad();
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
        dropDownCont.classList.replace('show','dd-hide');
    }else{
    dropDownCont.classList.replace('dd-hide','show');
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
    handleSuggestions(filterData,true);
}
const showSuggestionsForId=(query)=>{
    const filteredId=idData.filter(pokemonId=>pokemonId.startsWith(query.toString()));
    handleSuggestions(filteredId,false);
}

const handleSuggestions=(filteredArray,isName)=>{
    dropDownCont.innerHTML='';
    if(filteredArray.length===0){
        isName ? dropDownCont.innerHTML=`<p id='no-match'>NO MATCHES</p>` : dropDownCont.innerHTML=`<p id='no-match-num'>NO MATCHES</p>`;
    }
    filteredArray.forEach(pokemon=>{
        const div=document.createElement('div');
        div.classList.add('dd-btns');
        const regex=new RegExp(`^(${searchInput.value})`,'i');
        if(isName){
            div.innerHTML=pokemon.name.replace(regex,`<span class='high'>${searchInput.value}</span>`);
        }else{
            div.innerHTML=pokemon.replace(regex,`<span class='high'>${searchInput.value}</span>`);
        }
        div.addEventListener('click',()=>{
            searchInput.value = isName ? pokemon.name : pokemon;
            searchInput.focus();
        });
        dropDownCont.appendChild(div);
    })
}

maxBtn.addEventListener('click',()=>{
    const currentWidth =parseInt(window.getComputedStyle(imgView).width);
    imgView.style.width=(currentWidth+20)+'px';
    currentWidth>=180 ? maxBtn.disabled=true : maxBtn.disabled=false;
    if(currentWidth>50){
        minBtn.disabled=false;
    }
})

minBtn.addEventListener('click',()=>{
    const currentWidth =parseInt(window.getComputedStyle(imgView).width);
    imgView.style.width=(currentWidth-20)+'px';
    currentWidth<=75 ? minBtn.disabled=true : minBtn.disabled=false;
    if(currentWidth<200){
        maxBtn.disabled=false;
    }
})

imgView.addEventListener('click',playPokemonSound);

evolExitBtn.addEventListener('click',()=>{
    evolCont.classList.remove('evol-show');
    evolCont.classList.add('evol-hide');
    container.style.opacity='1'
})

imgView.addEventListener('click',()=>{
    if(isNewImageLoaded){
        dialogElement.show();
    }
})

acceptDialogBtn.addEventListener('click',()=>{
    dialogElement.close();
    evolCont.classList.remove('evol-hide');
    evolCont.classList.add('evol-show');
    updateEvolContUI();
    container.style.opacity='0.8';
})

rejectDialogBtn.addEventListener('click',()=>[
    dialogElement.close()
])

const findPokemonEvolArr=(id)=>{
    for(let arr of Object.values(pokemonEvolMap)){
        if(arr.includes(id)){
            return arr;
        }
    }
}

const evolImgFetcher=async(evolutionArrElement)=>{
    const cacheKey=evolutionArrElement;
    if(cacheEvolData[cacheKey]){
        // console.log(roughSizeOfCacheObject(cacheEvolData)/1000+'kb');
        return cacheEvolData[cacheKey];
    }
    try{
        const response=await fetch(fetchApi+evolutionArrElement.toString());
        const result=await response.json();
        cacheEvolData[cacheKey]=result;
        return result;
    }catch(e){
        console.log(e);
        const h2=document.createElement('h2');
        h2.textContent='No Evolution Data Available at this Moment.';
        h2.className='no-form-data';
        evolChainCont.appendChild(h2);
        return;
    }
}

const evolContUiUpdateHandler=(result)=>{
    const img=document.createElement('img');
    const p=document.createElement('p');
    const loader=document.createElement('div');
    img.src=result.sprites.front_default;
    img.alt=result.name;
    img.className='scaler';
    p.textContent=result.name;
    p.style.fontFamily=' "Orbitron", sans-serif';
    loader.className='img-loader';
    const div=document.createElement('div');
    div.className='evol-img-cont';
    div.appendChild(loader);
    div.appendChild(img);
    div.appendChild(p);
    evolChainCont.appendChild(div);
    img.onload=()=>{
        loader.remove();
    }
    img.onerror=()=>{
        loader.remove();
        p.textContent='Image Not available';
    }
    img.classList.add('animate__animated');
    img.classList.add('animate__flip');
}

const updateEvolContUI=async()=>{
    evolChainCont.innerHTML='';
    let evolutionArr=findPokemonEvolArr(globalPokemonId);
    if(evolutionArr){
        for(let i=0;i<evolutionArr.length;i++){
            let result;
            result= await evolImgFetcher(evolutionArr[i]);
            evolContUiUpdateHandler(result);
        }
        }else{
            const h2=document.createElement('h2');
            h2.textContent='No Evolution Data Available For This Pokemon';
            h2.className='no-form-data';
            evolChainCont.appendChild(h2);
        }
    }

// function roughSizeOfCacheObject(object) {
//     const objectList = [];
//     const stack = [object];
//     let bytes = 0;
//     while (stack.length) {
//         const value = stack.pop();    
//         if (typeof value === 'boolean') {
//             bytes += 4;
//         } else if (typeof value === 'string') {
//             bytes += value.length * 2;
//         } else if (typeof value === 'number') {
//             bytes += 8;
//         } else if (typeof value === 'object' && value !== null && !objectList.includes(value)) {
//             objectList.push(value);
//             for (const i in value) {
//                 if (value.hasOwnProperty(i)) {
//                     stack.push(value[i]);
//                 }
//             }
//         }
//     }
//     return bytes;
// }