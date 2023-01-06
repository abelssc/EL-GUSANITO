//INICIAMOS EL TABLERO
const $tablero=document.querySelector(".tablero");
const fragment=document.createDocumentFragment();

for (let fila = 0; fila < 30; fila++) {
    for (let col = 0; col < 60; col++) {
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

const gusano=[{fila:15,col:30},{fila:16,col:30},{fila:17,col:30},{fila:18,col:30},{fila:19,col:30}];
gusano.forEach(pintarGusano);

//CREAMOS EL MOVIMIENTO
const movimiento={
    ArrowUp:{fila:-1,col:0},
    ArrowLeft:{fila:0,col:-1},
    ArrowDown:{fila:1,col:0},
    ArrowRight:{fila:0,col:1}
}
window.addEventListener("keydown",(e)=>{
    if(e.key==="ArrowUp" || e.key==="ArrowLeft" || e.key==="ArrowDown" || e.key==="ArrowRight"){

        const newFila=gusano[0].fila+movimiento[e.key].fila;
        const newCol=gusano[0].col+movimiento[e.key].col;

        //evitamos que pase encima de su cuerpo
        if(newFila==gusano[1].fila && newCol==gusano[1].col) return;
        //despintamos
        gusano.forEach(despintarGusano);
        //insertamos una casilla porque se desplazo el gusano
        gusano.unshift({fila:newFila,col:newCol});
        //quitamos la ultima casilla del gusano porque se desplazo
        gusano.pop();
        //repintados
        gusano.forEach(pintarGusano);
        console.log(gusano);
    }
})