//INICIAMOS EL TABLERO
const $tablero=document.querySelector(".tablero");
const fragment=document.createDocumentFragment();
//COTA, VALORES LIMITES SUPERIORES O INFERIORES
const cota={
    fila:[-1,10],
    col:[-1,20]
}
//MANZANA
const apple={
    fila:0,
    col:0
}
//MOVIMIENTO INICIAL
let newevent=new Event("keypress");
newevent.key="ArrowUp";
newevent.speed=500;
let running=true;
//INTERVALO DE MOVIMIENTO
let interval;
//CREAMOS EL TABLERO
for (let fila = 0; fila < cota.fila[1]; fila++) {
    for (let col = 0; col < cota.col[1]; col++) {
        const div=document.createElement("div");
        div.classList.add("celda");
        div.dataset.fila=fila;
        div.dataset.col=col;
        fragment.appendChild(div)
    }
}
$tablero.appendChild(fragment);

//CREAMOS EL GUSANO
const pintarGusano=(e)=>{
    const celda=document.querySelector(`[data-fila='${e.fila}'][data-col='${e.col}']`);
    celda.dataset.value="1";
}

const despintarGusano=(e)=>{
    let celda=document.querySelector(`[data-fila='${e.fila}'][data-col='${e.col}']`);
    celda.dataset.value="0";
}
const pintarCabeza=(arrow)=>{
    const cabeza=document.querySelector(`[data-fila='${gusano[0].fila}'][data-col='${gusano[0].col}']`);
    cabeza.classList.add("cabeza");
    cabeza.dataset.arrow=arrow;
}
const despintarCabeza=()=>{
    const cabeza=document.querySelector(`[data-fila='${gusano[0].fila}'][data-col='${gusano[0].col}']`);
    cabeza.classList.remove("cabeza");
    cabeza.dataset.arrow="";
}
const gusano=[{fila:cota.fila[1]/2,col:cota.col[1]/2},{fila:(cota.fila[1]/2)+1,col:cota.col[1]/2}];
gusano.forEach(pintarGusano);
pintarCabeza(newevent.key);
//CREAMOS EL MOVIMIENTO
const movimiento={
    ArrowUp:{fila:-1,col:0},
    ArrowLeft:{fila:0,col:-1},
    ArrowDown:{fila:1,col:0},
    ArrowRight:{fila:0,col:1}
}
//CREAMOS LA FUNCION PRINCIPAL
const gusanoMain=(e)=>{
    if(e.key==="ArrowUp" || e.key==="ArrowLeft" || e.key==="ArrowDown" || e.key==="ArrowRight"){
        
        const newFila=gusano[0].fila+movimiento[e.key].fila;
        const newCol=gusano[0].col+movimiento[e.key].col;
        //cotas
        if(newFila<=cota.fila[0]||newFila>=cota.fila[1]||newCol<=cota.col[0]||newCol>=cota.col[1]){
            endGame();
            return
        }
        //evitamos que pase encima de su cuerpo
        if(newFila==gusano[1].fila && newCol==gusano[1].col) return;

        //actualizamos el eventkey
        newevent.key=e.key;

        //despintamos
        gusano.forEach(despintarGusano);
        despintarCabeza();
        //insertamos una casilla porque se desplazo el gusano
        gusano.unshift({fila:newFila,col:newCol});
        //quitamos la cola del gusano porque se desplazo, pero si come la manzana no la quitamos
        if(gusano[0].fila===apple.fila && gusano[0].col===apple.col){
            //si la come generamos otra manzana
            createApple();
            //aumentamos velocidad
            newevent.speed*=0.95;
            console.log(newevent.speed);
        }else{
            gusano.pop();
        }
        //repintados
        gusano.forEach(pintarGusano);
        pintarCabeza(e.key);
        //observamos manzana
        if(gusano[0].fila===apple.fila && gusano[0].col===apple.col){
            gusano.push({fila:gusano[gusano.length].fila+1})
        }
        //observamos colision
        if(colisioned()) {
            endGame();
            return
        }
    }
}
//BOTON START
document.querySelector(".start").addEventListener("click",()=>{
    //EVENTO TECLADO DE ESCUCHA
    window.addEventListener("keydown",gusanoMain);
    //INTERVALO DE MOVIMIENTO DE SNAKE
    //SE CAMBIO EL SETINTERVAL A SETTIMEOUT, YA QUE PARECE QUE ESTE TIENE UN PROBLEMA AL CAMBIAR EL TIEMPO DEL INTERVALO POR CADA BUCLE
    //EDIT. PARA CAMBIAR EL TIEMPO DE EJECUCION DE UN SETINTERVAL, ESTE PRIMERO DEBE SER DETENIDO.

    // interval=setInterval(()=>{
    //     gusanoMain(newevent)
    // },Math.round(newevent.speed));
    (function loop(){
        if(!running) return;
        interval=setTimeout(()=>{
            gusanoMain(newevent);
    
            loop();
        },Math.round(newevent.speed))
    })();
})
//BOTON PAUSE
document.querySelector(".pause").addEventListener("click",()=>{
    window.removeEventListener("keydown",gusanoMain);
    // clearInterval(interval);
    clearTimeout(interval);
})

//OBSERVAR COLISION
const colisioned=()=>{
    const colisionados=gusano.filter(g=>g.fila===gusano[0].fila && g.col===gusano[0].col);
    return colisionados.length>1?true:false;
}
//CREAMOS LA MANZANA A COMER
const createApple=()=>{
    let fila=Math.floor(Math.random()*cota.fila[1]);
    let col=Math.floor(Math.random()*cota.col[1]);
    while(gusano.some(cell=>cell.fila===fila && cell.col===col)){
        fila=Math.floor(Math.random()*cota.fila[1]);
        col=Math.floor(Math.random()*cota.col[1]);
    }
    let celda=document.querySelector(`[data-fila='${fila}'][data-col='${col}']`);
    celda.dataset.value="apple";
    //ENVIAMOS LA DIRECCION
    apple.fila=fila;
    apple.col=col;
}
createApple();
//SISTEMA DE COLISION
const endGame=()=>{
    const resp=confirm("PERDISTE :'(, quieres reiniciar?");
    if(resp){
        window.location.href="\."
    }else{
        window.removeEventListener("keydown",gusanoMain);
        running=false;
        document.querySelector(".start").style.visibility="hidden";
        document.querySelector(".pause").style.visibility="hidden";


    }
}
