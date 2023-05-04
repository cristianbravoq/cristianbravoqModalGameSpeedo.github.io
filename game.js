//****** GAME LOOP ********//
var time = new Date();
var deltaTime = 0;
var element = document.getElementById("GameContenedor");
var labelGanador = document.getElementById("LabelGanador");
var cantidadGanador = document.getElementById("CantidadGanador");

function ResetGame() {
  time = new Date();
  deltaTime = 0;
  score = 0;
  parado = false;

  for (var i = obstaculos.length - 1; i >= 0; i--) {
    obstaculos[i].parentNode.removeChild(obstaculos[i]);
    obstaculos.splice(i, 1);
  }
  for (var i = nubes.length - 1; i >= 0; i--) {
    nubes[i].parentNode.removeChild(nubes[i]);
    nubes.splice(i, 1);
  }

  element.classList.remove("tarde");
  element.classList.remove("noche");

  gameOver.style.display = "none";
  gameOverLoser.style.display = "none";
  dino.classList.add("dino-corriendo");
  dino.classList.remove("dino-estrellado");
  textoScore.innerText = score;

  gameVel = 1;

  tiempoHastaObstaculo = 2;
  tiempoObstaculoMin = 0.7;
  tiempoObstaculoMax = 1.8;
  obstaculoPosY = 16;

  tiempoHastaNube = 0.5;
  tiempoNubeMin = 0.7;
  tiempoNubeMax = 2.7;
  maxNubeY = 270;
  minNubeY = 100;
  velNube = 0.5;

  Init();
}

function Init() {
  time = new Date();
  Start();
  Loop();
}

function Loop() {
  deltaTime = (new Date() - time) / 1000;
  time = new Date();
  Update();
  requestAnimationFrame(Loop);
}

//****** GAME LOGIC ********//

var sueloY = 16;
var velY = 0;
var impulso = 900;
var gravedad = 2500;

var dinoPosX = 42;
var dinoPosY = sueloY;

var sueloX = 0;
var velEscenario = 1280 / 3;
let gameVel = 1;
var score = 0;

var parado = false;
var saltando = false;

var tiempoHastaObstaculo = 2;
var tiempoObstaculoMin = 0.7;
var tiempoObstaculoMax = 1.8;
var obstaculoPosY = 16;
var obstaculos = [];

var tiempoHastaNube = 0.5;
var tiempoNubeMin = 0.7;
var tiempoNubeMax = 2.7;
var maxNubeY = 270;
var minNubeY = 100;
var nubes = [];
var velNube = 0.5;

var contenedor;
var dino;
var textoScore;
var suelo;
var gameOver;

function Start() {
  gameOver = document.querySelector(".game-over");
  gameOverLoser = document.querySelector(".loser");
  suelo = document.querySelector(".suelo");
  contenedor = document.querySelector(".contenedor");
  textoScore = document.querySelector(".score");
  dino = document.querySelector(".dino");
  document.addEventListener("keydown", HandleKeyDown);
  document.addEventListener("click", HandleKeyDown);
}

function Update() {
  if (parado) return;

  MoverDinosaurio();
  MoverSuelo();
  DecidirCrearObstaculos();
  DecidirCrearNubes();
  MoverObstaculos();
  MoverNubes();
  DetectarColision();

  velY -= gravedad * deltaTime;
}

function HandleKeyDown(ev) {
  Saltar();
}

function Saltar() {
  if (dinoPosY === sueloY) {
    saltando = true;
    velY = impulso;
    dino.classList.remove("dino-corriendo");
  }
}

function MoverDinosaurio() {
  dinoPosY += velY * deltaTime;
  if (dinoPosY < sueloY) {
    TocarSuelo();
  }
  dino.style.bottom = dinoPosY + "px";
}

function TocarSuelo() {
  dinoPosY = sueloY;
  velY = 0;
  if (saltando) {
    dino.classList.add("dino-corriendo");
  }
  saltando = false;
}

function MoverSuelo() {
  sueloX += CalcularDesplazamiento();
  suelo.style.left = -(sueloX % contenedor.clientWidth) + "px";
}

function CalcularDesplazamiento() {
  return velEscenario * deltaTime * gameVel;
}

function Estrellarse() {
  dino.classList.remove("dino-corriendo");
  dino.classList.add("dino-estrellado");
  parado = true;
}

function DecidirCrearObstaculos() {
  tiempoHastaObstaculo -= deltaTime;
  if (tiempoHastaObstaculo <= 0) {
    CrearObstaculo();
  }
}

function DecidirCrearNubes() {
  tiempoHastaNube -= deltaTime;
  if (tiempoHastaNube <= 0) {
    CrearNube();
  }
}

function CrearObstaculo() {
  var obstaculo = document.createElement("div");
  contenedor.appendChild(obstaculo);
  obstaculo.classList.add("cactus");
  if (Math.random() > 0.5) obstaculo.classList.add("cactus2");
  obstaculo.posX = contenedor.clientWidth;
  obstaculo.style.left = contenedor.clientWidth + "px";

  obstaculos.push(obstaculo);
  tiempoHastaObstaculo =
    tiempoObstaculoMin +
    (Math.random() * (tiempoObstaculoMax - tiempoObstaculoMin)) / gameVel;
}

function CrearNube() {
  var nube = document.createElement("div");
  contenedor.appendChild(nube);
  nube.classList.add("nube");
  nube.posX = contenedor.clientWidth;
  nube.style.left = contenedor.clientWidth + "px";
  nube.style.bottom =
    minNubeY + Math.random() * (maxNubeY - minNubeY) + "px";

  nubes.push(nube);
  tiempoHastaNube =
    tiempoNubeMin +
    (Math.random() * (tiempoNubeMax - tiempoNubeMin)) / gameVel;
}

function MoverObstaculos() {
  for (var i = obstaculos.length - 1; i >= 0; i--) {
    if (obstaculos[i].posX < -obstaculos[i].clientWidth) {
      obstaculos[i].parentNode.removeChild(obstaculos[i]);
      obstaculos.splice(i, 1);
      GanarPuntos();
    } else {
      obstaculos[i].posX -= CalcularDesplazamiento();
      obstaculos[i].style.left = obstaculos[i].posX + "px";
    }
  }
}

function MoverNubes() {
  for (var i = nubes.length - 1; i >= 0; i--) {
    if (nubes[i].posX < -nubes[i].clientWidth) {
      nubes[i].parentNode.removeChild(nubes[i]);
      nubes.splice(i, 1);
    } else {
      nubes[i].posX -= CalcularDesplazamiento() * velNube;
      nubes[i].style.left = nubes[i].posX + "px";
    }
  }
}

function GanarPuntos() {
  score++;
  textoScore.innerText = score;
  if (score == 5) gameVel = 1.2;
  else if (score == 15) {
    gameVel = 1.4;
    contenedor.classList.add("tarde");
  } else if (score == 35) gameVel = 1.6;
  else if (score == 50) {
    gameVel = 1.8;
    contenedor.classList.add("noche");
  } else if (score == 60) gameVel = 2;
  else if (score == 80) gameVel = 2.2;
  suelo.style.animationDuration = 3 / gameVel + "s";
}

function GameOver() {
  Estrellarse();
  var codigoDescuento = "";
  var cantidaDescuento = "";
  if (score < 10) {
    codigoDescuento = "No lograste ganar, intentalo de nuevo";
    gameOver.style.display = "none";
    gameOverLoser.style.display = "flex";
  }
  if (score > 10) {
    codigoDescuento = "JNADADOR10";
    cantidaDescuento = "10% Dcto";
    gameOverLoser.style.display = "none";
    gameOver.style.display = "flex";
  }
  if (score > 15) {
    codigoDescuento = "JNADADOR15";
    cantidaDescuento = "15% Dcto";
    gameOverLoser.style.display = "none";
    gameOver.style.display = "flex";
  }
  if (score > 20) {
    codigoDescuento = "JNADADOR20";
    cantidaDescuento = "20% Dcto";
    gameOverLoser.style.display = "none";
    gameOver.style.display = "flex";
  }
  if (score > 25) {
    codigoDescuento = "JNADADOR25";
    cantidaDescuento = "25% Dcto";
    gameOverLoser.style.display = "none";
    gameOver.style.display = "flex";
  }
  if (score > 30) {
    codigoDescuento = "JNADADOR30";
    cantidaDescuento = "30% Dcto";
    gameOverLoser.style.display = "none";
    gameOver.style.display = "flex";
  }
  labelGanador.innerText = codigoDescuento;
  cantidadGanador.innerText = cantidaDescuento;
}

function DetectarColision() {
  for (var i = 0; i < obstaculos.length; i++) {
    if (obstaculos[i].posX > dinoPosX + dino.clientWidth) {
      //EVADE
      break; //al estar en orden, no puede chocar con más
    } else {
      if (IsCollision(dino, obstaculos[i], 10, 30, 15, 20)) {
        GameOver();
      }
    }
  }
}

function IsCollision(
  a,
  b,
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft
) {
  var aRect = a.getBoundingClientRect();
  var bRect = b.getBoundingClientRect();

  return !(
    aRect.top + aRect.height - paddingBottom < bRect.top ||
    aRect.top + paddingTop > bRect.top + bRect.height ||
    aRect.left + aRect.width - paddingRight < bRect.left ||
    aRect.left + paddingLeft > bRect.left + bRect.width
  );
}