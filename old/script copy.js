const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// const spaceship = new Image();
// spaceship.src = 'spaceship.webp';

// Tamaño del canvas
canvas.width = 400;
canvas.height = 600;

// Variables
let rounds = 1;
let words = [];
let wordSpeed = 0.5;
let score = 0;
let userInput = '';
let gameOver = false;
let currentWordIndex = -1; // Índice de la palabra que el jugador está escribiendo
let bullets = []; // Lista de balas
let currentWord = ''; // Palabra que el usuario está ingresando

const spaceship2 = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 50,
    width: 50,
    height: 50
};

// Palabras clave en Python
let pythonKeywords = ['def', 'print', 'import', 'from', 'class', 'return', 'if',
     'else', 'elif', 'for', 'while', 'break', 'continue', 'try', 'except', 
     'finally', 'with', 'as', 'lambda', 'pass', 'yield', 'true', 'false', 'none',
      'and', 'or', 'not', 'in', 'is', 'global', 'nonlocal', 'assert', 'del', 
      'raise', 'async', 'await'];

// Generar palabras enemigas aleatoriamente
function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * pythonKeywords.length);
    return pythonKeywords[randomIndex];
}

function generateWord() {
    const randomWord = getRandomWord();
    const xPosition = Math.random() * (canvas.width - 60);
    words.push({ word: randomWord, x: xPosition, y: 0 });
}
// Dibujar la nave, palabras y balas en el canvas
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar la nave espacial
    ctx.fillStyle = 'white';
    ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);

    // Dibujar las palabras enemigas
    words.forEach((wordObj, index) => {
        ctx.font = '20px Arial';
        ctx.fillStyle = index === currentWordIndex ? 'green' : 'red'; // Resaltar la palabra activa
        ctx.fillText(wordObj.word, wordObj.x, wordObj.y);
    });

    // Dibujar las balas
    bullets.forEach(bullet => {
        ctx.fillStyle = bullet.correct ? 'blue' : 'yellow';
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2);
        ctx.fill();
    });

    // Mostrar el puntaje del jugador
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, 10, 20);
    ctx.fillText(`Round: ${rounds}`, 10, 40);
}

// Actualizar la posición de las palabras, balas y verificar colisiones
function updateGame() {
    if (gameOver) return;

    words.forEach(wordObj => {
        wordObj.y += wordSpeed;

        // Verificar si la palabra ha llegado al final
        if (wordObj.y > canvas.height) {
            gameOver = true;
            displayGameOver();
        }
    });

    // Actualizar la posición de las balas
    bullets.forEach(bullet => {
        if (bullet.correct && currentWordIndex !== -1) {
            const targetWord = words[currentWordIndex];
            if (targetWord) {
                bullet.x += (targetWord.x - bullet.x) * 0.05;
                bullet.y += (targetWord.y - bullet.y) * 0.05;
            }
        } else {
            bullet.y -= 3;
        }
    });

    bullets = bullets.filter(bullet => bullet.y > 0); // Eliminar balas que salen del canvas

    drawGame();
}

// Mostrar mensaje de fin del juego
function displayGameOver() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over!', canvas.width / 2 - 70, canvas.height / 2);
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2 - 70, canvas.height / 2 + 40);
}

// Manejar el input del usuario
window.addEventListener('keydown', (e) => {
    if (gameOver) return; // No aceptar input si el juego ha terminado

    const key = e.key.toLowerCase(); // Aceptar letras minúsculas también

    // Asegurarnos de que solo se consideren letras
    if (/^[a-z]$/.test(key)) {
        if (currentWordIndex === -1) {
            // Buscar la palabra que comienza con la letra ingresada
            currentWordIndex = words.findIndex(wordObj => wordObj.word.startsWith(key));
        }

        if (currentWordIndex !== -1) {
            const wordObj = words[currentWordIndex];
            if (wordObj.word[0] === key) {
                wordObj.word = wordObj.word.substring(1); // Eliminar la primera letra de la palabra
                bullets.push({ x: spaceship.x + spaceship.width / 2, y: spaceship.y, correct: true });

                if (wordObj.word.length === 0) {
                    score += 10; // Sumar puntos
                    wordObj.toDelete = true; // Marcar la palabra para eliminarla
                    currentWordIndex = -1;
                }
            }
        } else {
            bullets.push({ x: spaceship.x + spaceship.width / 2, y: spaceship.y, correct: false });
        }

        // Eliminar las palabras completadas
        words = words.filter(wordObj => !wordObj.toDelete);
    }
});

// Bucle principal del juego
function gameLoop() {
    updateGame();
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

// Iniciar el juego generando palabras cada 2 segundos
setInterval(generateWord, 2000);
gameLoop();
