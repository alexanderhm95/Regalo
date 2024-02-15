const express = require('express');
const http = require('http');
const { createCanvas } = require('canvas');
const fs = require('fs');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 3000;

// Función para dibujar la flor en un lienzo
function drawFlower() {
    const canvasWidth = 400;
    const canvasHeight = 400;
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
    const output = fs.createWriteStream('public/flower.png');
    const stream = canvas.createPNGStream();
    stream.pipe(output);
    output.on('finish', () => console.log('Flor amarilla creada en public/flower.png'));

    // Emitir evento a todos los clientes cuando la imagen esté lista
    io.emit('flowerCreated', '/flower.png');
}

// Ruta para mostrar la flor en la web
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); // Servir la página HTML
});

// Iniciar el servidor
server.listen(port, () => {
    console.log(`Servidor web en funcionamiento en http://localhost:${port}`);
});

// Cuando un cliente se conecta, enviar la flor y el mensaje
io.on('connection', (socket) => {
    drawFlower(); // Generar la imagen de la flor
    socket.emit('flowerCreated', '/flower.png'); // Enviar la imagen al cliente
    socket.emit('message', 'Te Amo ciela'); // Enviar el mensaje al cliente
});
