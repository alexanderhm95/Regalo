const { createCanvas } = require('canvas');
const fs = require('fs');

// Tamaño del lienzo
const canvasWidth = 400;
const canvasHeight = 400;

// Crear un lienzo
const canvas = createCanvas(canvasWidth, canvasHeight);
const ctx = canvas.getContext('2d');

// Fondo blanco
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvasWidth, canvasHeight);

// Color amarillo para los pétalos
ctx.fillStyle = 'yellow';

// Dibujar pétalos (círculos amarillos)
const numPetals = 6; // Cambia este número para más o menos pétalos
const petalRadius = 60;

for (let i = 0; i < numPetals; i++) {
    const angle = (i * 2 * Math.PI) / numPetals;
    const x = canvasWidth / 2 + Math.cos(angle) * petalRadius;
    const y = canvasHeight / 2 + Math.sin(angle) * petalRadius;
    
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();
}

// Guardar la imagen en un archivo
const output = fs.createWriteStream('flower.png');
const stream = canvas.createPNGStream();
stream.pipe(output);
output.on('finish', () => console.log('Flor amarilla creada en flower.png'));
