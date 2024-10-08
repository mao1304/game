const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

//tamaño del canvas
canvas.width = 400;
canvas.height = 800;

//variablesr
let rounds = 1;
let words = [];
let wordSpeed = 0.5;
let score = 0;
let userInput = '';

// nave
const spaceship = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 50,
    width: 50,
    height: 50
};


// Palabras clave en Python
pythonKeywords = ['def', 'print', 'import', 'from', 'class', 'return', 'if', 'else', 'elif', 'for', 'while',
    'break', 'continue', 'try', 'except', 'finally', 'with', 'as', 'lambda', 'pass', 'yield',
    'True', 'False', 'None', 'and', 'or', 'not', 'in', 'is', 'global', 'nonlocal', 'assert',
    'del', 'raise', 'async', 'await'];

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



// Dibujar la nave y las palabras en el canvas
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar la nave espacial
    ctx.fillStyle = 'white';
    ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);

    // Dibujar las palabras enemigas
    ctx.fillStyle = 'red';
    words.forEach(wordObj => {
        ctx.font = '20px Arial';
        ctx.fillText(wordObj.word, wordObj.x, wordObj.y);
    });

    // Mostrar el puntaje del jugador
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, 10, 20);
    ctx.fillText(`Round: ${rounds}`, 10, 40);
}

// Actualizar la posición de las palabras y verificar colisiones
function updateGame() {
    words.forEach(wordObj => {
        wordObj.y += wordSpeed;

        // Verificar si la palabra ha llegado al final
        if (wordObj.y > canvas.height) {
            alert('¡Perdiste! La palabra llegó al final.');
            words = [];
            score = 0;
        }
    });

    drawGame();
}

// Manejar el input del usuario
window.addEventListener('keydown', (e) => {
    const key = e.key.toUpperCase();

    // Asegurarnos de que solo se consideren letras
    if (key.length === 1 && key.match(/[A-Z]/)) {
        userInput += key;

        // Verificar si el input del usuario coincide con el inicio de alguna palabra
        words.forEach(wordObj => {
            if (wordObj.word.startsWith(userInput)) {
                // Si el input actual es correcto pero la palabra no se ha completado
                if (wordObj.word === userInput) {
                    score += 10;
                    userInput = '';
                    wordObj.toDelete = true; // Marcar la palabra para eliminarla
                }
            } else {
                // Si el usuario se equivoca, reiniciar el input
                userInput = '';
            }
        });

        // Eliminar las palabras que se marcaron como completadas
        words = words.filter(wordObj => !wordObj.toDelete);
    }
});

// Bucle principal del juego
function gameLoop() {
    updateGame();
    requestAnimationFrame(gameLoop);
}

// Iniciar el juego generando palabras cada 2 segundos
setInterval(generateWord, 2000);
gameLoop();
