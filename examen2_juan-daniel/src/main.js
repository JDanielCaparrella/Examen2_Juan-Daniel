function startGame() {
    // Ocultar el menú
    document.getElementById('menu').classList.add('hidden');

    // Mostrar el canvas amb el joc
    document.getElementById('gameCanvas').style.display = 'block';


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
const allimage = new Image();
allimage.src = 'sprites/all.png'; 
const murimage = new Image();
murimage.src = 'sprites/roca.png'; 
const terraImage = new Image();
terraImage.src = 'sprites/terra.png'; 
const zombieImage = new Image();
zombieImage.src = 'sprites/zombie.png'; 
const draculaImage = new Image();
draculaImage.src = 'sprites/dracula.png'; 
const aiguaImage = new Image();
aiguaImage.src = 'sprites/aigua.png'; 


// Imatges per a cada direcció del don simon
const simonup = new Image();
simonup.src = 'sprites/simonup.png'; 

const simondown = new Image();
simondown.src = 'sprites/simondown.png'; 

const simonleft = new Image();
simonleft.src = 'sprites/simonleft.png'; 

const simonright = new Image();
simonright.src = 'sprites/simonright.png'; 

// Definir el mapa: 0 = espai buit, 1 = mur, 2 = pilota, 3 = zombi, 4 = draCULa, 5 = aigua
const mapa = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 5, 1, 3, 2, 1, 4, 1],
    [1, 0, 1, 0, 1, 0, 2, 0, 1, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 3, 0, 0, 3, 0, 2, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 2, 0, 0, 0, 2, 1, 1, 0, 1],
    [1, 0, 0, 0, 2, 0, 0, 1, 0, 2, 2, 1, 1, 0, 1],
    [1, 0, 0, 3, 2, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1],
    [1, 2, 1, 1, 2, 0, 0, 0, 5, 1, 1, 1, 3, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

//IMPORTANT
const tileSize = 32; // Tamany de cada tile del mapa
let pacMan = { x: 1, y: 1, dx: 0, dy: 0, currentImage: simonright }; // Posició inicial de Pac-Man i la imatge
let score = 0; 
let timeLeft = 90; // Temps restant 
let gameStartTime = Date.now(); // Emmagatzemar el temps en què es va iniciar el joc
let gameRunning = true; // Variable per controlar si el joc està en curs
//IMPORTANT


// Funció per dibuixar el mapa
function drawMap() {
    foodLeft = 0; // Reiniciar comptador de menjar
    for (let y = 0; y < mapa.length; y++) {
        for (let x = 0; x < mapa[y].length; x++) {
            if (mapa[y][x] === 1) {
                // Dibuixar mur (roca)
                ctx.drawImage(murimage, x * tileSize, y * tileSize, tileSize, tileSize);
            } else if (mapa[y][x] === 2) {
                // Dibuixar pilota (menjar)
                ctx.drawImage(allimage, x * tileSize, y * tileSize, tileSize, tileSize);
                foodLeft++; // Comptar el menjar restant
            } else if (mapa[y][x] === 0) {
                // Dibuixar terra (espai buit)
                ctx.drawImage(terraImage, x * tileSize, y * tileSize, tileSize, tileSize);
            } else if (mapa[y][x] === 3) {
                // Dibuixar zombi
                ctx.drawImage(zombieImage, x * tileSize, y * tileSize, tileSize, tileSize);
            } else if (mapa[y][x] === 4) {
                // Dibuixar dracula
                ctx.drawImage(draculaImage, x * tileSize, y * tileSize, tileSize, tileSize);
            } else if (mapa[y][x] === 5) {
                // Dibuixar aguita
                ctx.drawImage(aiguaImage, x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
    }
}


// Funció per dibuixar Pac-Man (utilitzant la imatge)
function drawPacMan() {
    // Dibuixar la imatge de Pac-Man en funció de la direcció
    ctx.drawImage(pacMan.currentImage, pacMan.x * tileSize, pacMan.y * tileSize, tileSize, tileSize);
}

function movePacMan() {
    if (!gameRunning) return; // No moure Pac-Man si el joc ha acabat

    let newX = pacMan.x + pacMan.dx;
    let newY = pacMan.y + pacMan.dy;

    // Comprovar si el moviment és vàlid
    if (mapa[newY] && mapa[newY][newX] !== 1) {
        pacMan.x = newX;
        pacMan.y = newY;

        // Comprovar si ha recollit una pilota
        if (mapa[newY][newX] === 2) {
            mapa[newY][newX] = 0; // Treure la pilota del mapa
            score += 5; // Afegir 5 punts a la puntuació
        }

        // Comprovar si ha tocat un zombi
        if (mapa[newY][newX] === 3) {
            gameRunning = false; // Finalitzar el joc
            ctx.fillText('Joc Perdut! Has tocat un zombi!', canvas.width / 2 - 150, canvas.height / 2); // Mostrar missatge de fi de joc
        }
           // Comprovar si ha tocat al dracula aquest
           if (mapa[newY][newX] === 4) {
            gameRunning = false; // Finalitzar el joc
            ctx.fillText('Joc Perdut! Has tocat al dracula sense powerup!', canvas.width / 2 - 150, canvas.height / 2); // Mostrar missatge de fi de joc
        }
    }
}



// Funció per dibuixar el joc
function drawGame() {
    if (!gameRunning) return; // No dibuixar si el joc ha acabat

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Netejar la pantalla
    drawMap();
    drawPacMan();
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    
    // Calcular el temps restant
    let elapsedTime = (Date.now() - gameStartTime) / 1000; // Temps en segons
    timeLeft = Math.max(0, 90 - Math.floor(elapsedTime)); // Calcular el temps restant

    // Mostrar el temps restant
    ctx.fillText('Temps restant: ' + timeLeft + 's', 10, 40); // Mostrar el temps

    // Comprovar si el temps ha arribat a 0
    if (timeLeft <= 0) {
        gameRunning = false; // Finalitzar el joc
        ctx.fillText('Temps finaliztat! Joc Finalitzat!', canvas.width / 2 - 150, canvas.height / 2); 
    }

    // Mostrar la puntuació
    ctx.fillText('Puntuació: ' + score, 10, 20);
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
        pacMan.currentImage = simonup; // Imatge de Pac-Man mirant amunt
    } else if (e.key === 'ArrowDown') {
        pacMan.dx = 0;
        pacMan.dy = 1;
        pacMan.currentImage = simondown; // Imatge de Pac-Man mirant avall
    } else if (e.key === 'ArrowLeft') {
        pacMan.dx = -1;
        pacMan.dy = 0;
        pacMan.currentImage = simonleft; // Imatge de Pac-Man mirant a l'esquerra
    } else if (e.key === 'ArrowRight') {
        pacMan.dx = 1;
        pacMan.dy = 0;
        pacMan.currentImage = simonright; // Imatge de Pac-Man mirant a la dreta
    }
    updateMovement();
});

// Inicialitzar el joc
drawGame();
