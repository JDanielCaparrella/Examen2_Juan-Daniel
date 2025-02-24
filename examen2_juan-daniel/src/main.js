// Funcions per mostrar les pantalles
function startGame() {
    // Ocultar el menú
    document.getElementById('menu').classList.add('hidden');

    // Mostrar el canvas amb el joc
    document.getElementById('gameCanvas').style.display = 'block';

    // Sonido de inicio
    const startSound = new Audio('so/pacman_beginning.wav');
    startSound.play();

    // Aquí cridem a la funció per iniciar el joc
    alert("Iniciant el joc...");
    // Això es pot substituir amb la funció per iniciar el joc realment
}

function showHelp() {
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('help').classList.remove('hidden');
}

function showInfo() {
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('info').classList.remove('hidden');
    
    // Mostrar informació del navegador
    document.getElementById('browser-name').textContent = navigator.userAgent;
    document.getElementById('browser-version').textContent = navigator.appVersion;
    document.getElementById('os-info').textContent = navigator.platform;
    document.getElementById('last-modified').textContent = document.lastModified;
    document.getElementById('language').textContent = navigator.language;
    document.getElementById('hostname').textContent = window.location.hostname;
}

function showCredits() {
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('credits').classList.remove('hidden');
}

function goBack() {
    document.getElementById('help').classList.add('hidden');
    document.getElementById('info').classList.add('hidden');
    document.getElementById('credits').classList.add('hidden');
    document.getElementById('menu').classList.remove('hidden');

    // Amagar el canvas en tornar al menú
    document.getElementById('gameCanvas').style.display = 'none';
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Carregar les imatges
const foodImage = new Image();
foodImage.src = 'sprites/food.png'; // Canvia aquesta ruta per la correcta
const rockImage = new Image();
rockImage.src = 'sprites/roca.png'; // Canvia aquesta ruta per la correcta

// Imatges de Pac-Man per a cada direcció
const pacManUp = new Image();
pacManUp.src = 'sprites/pacup.png'; // Imatge de Pac-Man mirant amunt

const pacManDown = new Image();
pacManDown.src = 'sprites/pacdown.png'; // Imatge de Pac-Man mirant avall

const pacManLeft = new Image();
pacManLeft.src = 'sprites/pacleft.png'; // Imatge de Pac-Man mirant a l'esquerra

const pacManRight = new Image();
pacManRight.src = 'sprites/pacright.png'; // Imatge de Pac-Man mirant a la dreta

// Definir el mapa: 0 = espai buit, 1 = mur, 2 = pilota
const mapa = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 1],
    [1, 2, 1, 2, 1, 0, 1, 2, 1, 1, 2, 1, 1, 2, 1],
    [1, 2, 0, 2, 0, 0, 1, 2, 1, 1, 2, 2, 2, 0, 1],
    [1, 2, 1, 1, 1, 0, 1, 2, 1, 2, 2, 2, 1, 2, 1],
    [1, 2, 0, 2, 0, 0, 0, 2, 1, 2, 1, 2, 0, 0, 1],
    [1, 2, 1, 1, 1, 0, 1, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const tileSize = 40; // Tamany de cada tile del mapa
let pacMan = { x: 1, y: 1, dx: 0, dy: 0, currentImage: pacManRight }; // Posició inicial de Pac-Man i la imatge
let score = 0;
let foodLeft = 0; // Comptador de menjar restant
let gameRunning = true; // Variable per controlar si el joc està en curs

// Funció per dibuixar el mapa
function drawMap() {
    foodLeft = 0; // Reiniciar comptador de menjar
    for (let y = 0; y < mapa.length; y++) {
        for (let x = 0; x < mapa[y].length; x++) {
            if (mapa[y][x] === 1) {
                // Dibuixar mur (roca)
                ctx.drawImage(rockImage, x * tileSize, y * tileSize, tileSize, tileSize);
            } else if (mapa[y][x] === 2) {
                // Dibuixar pilota (menjar)
                ctx.drawImage(foodImage, x * tileSize, y * tileSize, tileSize, tileSize);
                foodLeft++; // Comptar el menjar restant
            }
        }
    }
}

// Funció per dibuixar Pac-Man (utilitzant la imatge)
function drawPacMan() {
    // Dibuixar la imatge de Pac-Man en funció de la direcció
    ctx.drawImage(pacMan.currentImage, pacMan.x * tileSize, pacMan.y * tileSize, tileSize, tileSize);
}

// Funció per moure Pac-Man fins a tocar un mur
function movePacMan() {
    let newX = pacMan.x + pacMan.dx;
    let newY = pacMan.y + pacMan.dy;

    // Comprovar si el moviment és vàlid
    if (mapa[newY] && mapa[newY][newX] !== 1) {
        pacMan.x = newX;
        pacMan.y = newY;

        // Comprovar si ha recollit una pilota
        if (mapa[newY][newX] === 2) {
            mapa[newY][newX] = 0; // Treure la pilota del mapa
            score++; // Afegir al marcador
        }
    }
}

// Funció per dibuixar el joc
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Netejar la pantalla
    drawMap();
    drawPacMan();
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Puntuació: ' + score, 10, 20); // Mostrar la puntuació

    // Comprovar si el joc ha acabat
    if (foodLeft === 0) {
        gameRunning = false;
        const endSound = new Audio('so/pacman_intermission.wav');
        endSound.play(); // Sonido de finalització
        ctx.fillText('Joc Finalitzat!', canvas.width / 2 - 80, canvas.height / 2); // Mostrar missatge de finalització
    }
}

// Funció per actualitzar el moviment
function updateMovement() {
    if (gameRunning) {
        movePacMan();
        drawGame();
    }
}

// Gestió de les tecles per moure Pac-Man
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        pacMan.dx = 0;
        pacMan.dy = -1;
        pacMan.currentImage = pacManUp; // Imatge de Pac-Man mirant amunt
    } else if (e.key === 'ArrowDown') {
        pacMan.dx = 0;
        pacMan.dy = 1;
        pacMan.currentImage = pacManDown; // Imatge de Pac-Man mirant avall
    } else if (e.key === 'ArrowLeft') {
        pacMan.dx = -1;
        pacMan.dy = 0;
        pacMan.currentImage = pacManLeft; // Imatge de Pac-Man mirant a l'esquerra
    } else if (e.key === 'ArrowRight') {
        pacMan.dx = 1;
        pacMan.dy = 0;
        pacMan.currentImage = pacManRight; // Imatge de Pac-Man mirant a la dreta
    }
    updateMovement();
});

// Inicialitzar el joc
drawGame();
