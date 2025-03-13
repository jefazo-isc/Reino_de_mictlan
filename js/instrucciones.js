function dibujar() {
    const canvas = document.getElementById('canva-container');
    const ctx = canvas.getContext('2d');

    

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.font = '40px Roboto';
        ctx.textAlign = 'center';
        ctx.fillText('Instrucciones', canvas.width / 2, 100);
        ctx.font = '20px Roboto';
        ctx.fillText('Como jugar?', canvas.width / 2, 150);
        ctx.fillText('Usa las flechas del teclado para moverte', canvas.width / 2, 200);
        ctx.fillText('Usa la flecha hacia arriba para saltar', canvas.width / 2, 250);
        ctx.fillText('Evita a los en enemigos o perderas', canvas.width / 2, 300);
        ctx.fillText('Trata de conseguir la puntuacion mas alta', canvas.width / 2, 350);
        ctx.fillText('Obtienes punto al recoger las estrellas', canvas.width / 2, 400);
        ctx.fillText('Buena suerte!', canvas.width / 2, 500);

        
    
}
dibujar();

//el botón
const volverButton = document.createElement('button');
volverButton.textContent = 'Volver al inicio';

// estilos
volverButton.style.position = 'absolute';
volverButton.style.top = '700px'; 
volverButton.style.left = '50%';
volverButton.style.transform = 'translateX(-50%)';
volverButton.style.fontSize = '20px';
volverButton.style.padding = '10px 20px';
volverButton.style.cursor = 'pointer';

// redirigimos al index.html
volverButton.addEventListener('click', () => {
    window.location.href = '../../index.html';
});

// agregamos el botón al body para poder volver al inicio
document.body.appendChild(volverButton);