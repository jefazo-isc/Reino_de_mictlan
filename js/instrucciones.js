function dibujar() {
    const canvas = document.getElementById('canva-container');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Texto de título
    ctx.font = '60px Viva_Mexico_cabrones';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#d97f29';   
    ctx.strokeStyle = '#661b06'; 
    ctx.lineWidth = 2;           
    ctx.fillText('Instrucciones', canvas.width / 2, 100);
    ctx.strokeText('Instrucciones', canvas.width / 2, 100);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#e9bb4f';    
    ctx.strokeStyle = '#e9bb4f'; 
    ctx.lineWidth = 5; 

    ctx.font = '30px Mayan';

    ctx.fillText('Como jugar?', canvas.width / 2, 150);
    ctx.strokeText('Como jugar?', canvas.width / 2, 150);

    ctx.fillText('Usa las flechas del teclado para moverte', canvas.width / 2, 200);
    ctx.strokeText('Usa las flechas del teclado para moverte', canvas.width / 2, 200);

    ctx.fillText('Usa la flecha hacia arriba para saltar', canvas.width / 2, 250);
    ctx.strokeText('Usa la flecha hacia arriba para saltar', canvas.width / 2, 250);

    ctx.fillText('Evita a los en enemigos o perderas, tambien las flechas', canvas.width / 2, 300);
    ctx.strokeText('Evita a los en enemigos o perderas, tambien las flechas', canvas.width / 2, 300);

    ctx.fillText('Trata de conseguir la puntuacion mas alta', canvas.width / 2, 350);
    ctx.strokeText('Trata de conseguir la puntuacion mas alta', canvas.width / 2, 350);

    ctx.fillText('Obtienes puntos al recoger las flores, las flechas y hongos', canvas.width / 2, 400);
    ctx.strokeText('Obtienes puntos al recoger las flores, las flechas y hongos ', canvas.width / 2, 400);

    ctx.fillText('En el nivel final disapara al enemigo con la tecla espaciadora', canvas.width / 2, 450);
    ctx.strokeText('En el nivel final disapara al enemigo con la tecla espaciadora ', canvas.width / 2, 450);

    ctx.fillText('Buena suerte!', canvas.width / 2, 500);
    ctx.strokeText('Buena suerte!', canvas.width / 2, 500);

    ctx.fillStyle = '#c0a13a00';    
    ctx.strokeStyle = '#661b06'; 
    ctx.lineWidth = 1.5; 


    ctx.font = '30px Mayan';

    ctx.fillText('Como jugar?', canvas.width / 2, 150);
    ctx.strokeText('Como jugar?', canvas.width / 2, 150);

    ctx.fillText('Usa las flechas del teclado para moverte', canvas.width / 2, 200);
    ctx.strokeText('Usa las flechas del teclado para moverte', canvas.width / 2, 200);

    ctx.fillText('Usa la flecha hacia arriba para saltar', canvas.width / 2, 250);
    ctx.strokeText('Usa la flecha hacia arriba para saltar', canvas.width / 2, 250);

    ctx.fillText('Evita a los en enemigos o perderas, tambien las flechas', canvas.width / 2, 300);
    ctx.strokeText('Evita a los en enemigos o perderas, tambien las flechas', canvas.width / 2, 300);

    ctx.fillText('Trata de conseguir la puntuacion mas alta', canvas.width / 2, 350);
    ctx.strokeText('Trata de conseguir la puntuacion mas alta', canvas.width / 2, 350);

    ctx.fillText('Obtienes puntos al recoger las flores, las flechas y hongos', canvas.width / 2, 400);
    ctx.strokeText('Obtienes puntos al recoger las flores, las flechas y hongos ', canvas.width / 2, 400);
    
    ctx.fillText('En el nivel final disapara al enemigo con la tecla espaciadora', canvas.width / 2, 450);
    ctx.strokeText('En el nivel final disapara al enemigo con la tecla espaciadora ', canvas.width / 2, 450);

    ctx.fillText('Buena suerte!', canvas.width / 2, 500);
    ctx.strokeText('Buena suerte!', canvas.width / 2, 500);
}
const canvas = document.getElementById('canva-container');

dibujar();
const musica = new Audio('../assets/sonido/menuMusica.mp3'); // Ajusta la ruta
    musica.play();
    musica.pause();

const volverButton = document.createElement('button');
volverButton.textContent = 'Volver';
volverButton.style.position = 'absolute';

const canvasRect = canvas.getBoundingClientRect();
const scale = canvasRect.height / canvas.height;

const offsetY = canvasRect.top + (500 * scale) + 20;
volverButton.style.top = offsetY + 'px';

// estilos del botón
volverButton.style.left = '50%';
volverButton.style.transform = 'translateX(-50%)';
volverButton.style.fontSize = '20px';
volverButton.style.padding = '10px 20px';
volverButton.style.cursor = 'pointer';
volverButton.style.backgroundColor = '#d97f29';
volverButton.style.color = '#661b06';
volverButton.style.border = '2px solid #661b06';
volverButton.style.borderRadius = '5px';
volverButton.style.fontFamily = 'Mayan';
volverButton.style.fontWeight = 'bold';

volverButton.addEventListener('click', () => {
    window.location.href = '../../index.html';
});
document.body.appendChild(volverButton);

// Botón de música
const musicaButton = document.createElement('button');
musicaButton.textContent = 'Musica';
musicaButton.style.position = 'absolute';
musicaButton.style.top = offsetY + 'px';
musicaButton.style.left = 'calc(50% + 80px)';  // Ajusta según necesites
musicaButton.style.fontSize = '20px';
musicaButton.style.padding = '10px 20px';
musicaButton.style.cursor = 'pointer';
musicaButton.style.backgroundColor = '#d97f29';
musicaButton.style.color = '#661b06';
musicaButton.style.border = '2px solid #661b06';
musicaButton.style.borderRadius = '5px';
musicaButton.style.fontFamily = 'Mayan';
musicaButton.style.fontWeight = 'bold';
document.body.appendChild(musicaButton);

// Al hacer clic, pausar/reanudar
musicaButton.addEventListener('click', () => {
    if (musica.paused) {
        musica.play();
    } else {
        musica.pause();
    }
});

// Para pocionar el boton
function posicionarBoton() {
    const canvasRect = canvas.getBoundingClientRect();
    const scale = canvasRect.height / canvas.height;
    const offsetY = canvasRect.top + (500 * scale) + 20;
    volverButton.style.top = offsetY + 'px';
    //Centrar 
    volverButton.style.left = '50%';
    volverButton.style.transform = 'translateX(-50%)';
}

posicionarBoton();

// El boton se acomoda de nuevo
window.addEventListener('resize', posicionarBoton);

// Ajuste de posición al redimensionar la ventana
function reubicarBotones() {
    posicionarBoton(); // reposiciona botón Volver
    const canvasRect = canvas.getBoundingClientRect();
    const scale = canvasRect.height / canvas.height;
    const offsetY = canvasRect.top + (500 * scale) + 20;
    musicaButton.style.top = offsetY + 'px';
    musicaButton.style.left = 'calc(50% + 80px)';
}
window.addEventListener('resize', reubicarBotones);
