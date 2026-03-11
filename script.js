/*
  Neon Ruins: Corefall
  Self-contained 2D action-adventure prototype.
  No external libraries required.
*/

// =========================
// tuning constants
// =========================
const CONFIG = {
  PLAYER_SPEED: 260,
  SPRINT_MULTIPLIER: 1.55,
  JUMP_FORCE: 620,
  GRAVITY: 1600,
  ENEMY_SPEED: 120,
  COLLECTIBLE_COUNT: 5,
  MAX_HEALTH: 100,
  HAZARD_DAMAGE: 28,
  ENEMY_DAMAGE: 16,
  INTERACT_DISTANCE: 64,
  WORLD_WIDTH: 3200,
  WORLD_HEIGHT: 1800,
  GROUND_Y: 1450
};

// =========================
// DOM / UI logic
// =========================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const hud = document.getElementById("hud");
const startScreen = document.getElementById("startScreen");
const endScreen = document.getElementById("endScreen");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const healthFill = document.getElementById("healthFill");
const healthText = document.getElementById("healthText");
const coreCounter = document.getElementById("coreCounter");
const timerText = document.getElementById("timerText");
const hintText = document.getElementById("hintText");
const objectiveText = document.getElementById("objectiveText");
const endBadge = document.getElementById("endBadge");
const endTitle = document.getElementById("endTitle");
const endMessage = document.getElementById("endMessage");
const endStats = document.getElementById("endStats");

// =========================
// global state
// =========================
const keys = Object.create(null);
let gameStarted = false;
let gameEnded = false;
let elapsedTime = 0;
let lastFrame = 0;
let cameraShake = 0;
let mouse = { x: 0, y: 0 };

const player = {
  x: 240,
  y: 1000,
  w: 54,
  h: 84,
  vx: 0,
  vy: 0,
  facing: 1,
  onGround: false,
  health: CONFIG.MAX_HEALTH,
  collected: 0,
  canWin: false
};

const world = {
  platforms: [],
  hazards: [],
  collectibles: [],
  enemies: [],
  particles: [],
  parallax: [],
  gate: { x: 2920, y: 1220, w: 130, h: 180, active: false }
};

// =========================
// world generation
// =========================
function buildWorld() {
  world.platforms = [
    { x: 0, y: CONFIG.GROUND_Y, w: 680, h: 220, glow: "#0ff0fc" },
    { x: 760, y: 1320, w: 280, h: 48, glow: "#55f7ff" },
    { x: 1120, y: 1210, w: 260, h: 44, glow: "#1fffd5" },
    { x: 1480, y: 1080, w: 340, h: 52, glow: "#7cecff" },
    { x: 1910, y: 1250, w: 220, h: 44, glow: "#57d1ff" },
    { x: 2230, y: 1120, w: 260, h: 46, glow: "#1fffd5" },
    { x: 2590, y: 980, w: 220, h: 42, glow: "#7cecff" },
    { x: 2860, y: 1360, w: 240, h: 90, glow: "#ffe06e" }
  ];

  world.hazards = [
    { x: 640, y: 1510, w: 110, h: 24, phase: 0.4 },
    { x: 1040, y: 1510, w: 180, h: 24, phase: 1.3 },
    { x: 1810, y: 1510, w: 150, h: 24, phase: 0.9 },
    { x: 2460, y: 1510, w: 120, h: 24, phase: 1.9 }
  ];

  world.collectibles = [
    { x: 900, y: 1240, r: 20, bob: 0.2, collected: false },
    { x: 1260, y: 1130, r: 20, bob: 1.1, collected: false },
    { x: 1640, y: 1000, r: 20, bob: 2.2, collected: false },
    { x: 2320, y: 1040, r: 20, bob: 0.7, collected: false },
    { x: 2670, y: 900, r: 20, bob: 1.8, collected: false }
  ];

  world.enemies = [
    { x: 1550, y: 1000, w: 52, h: 52, left: 1500, right: 1780, dir: 1, pulse: 0.6 },
    { x: 2280, y: 1040, w: 52, h: 52, left: 2230, right: 2470, dir: -1, pulse: 1.3 }
  ];

  world.parallax = Array.from({ length: 18 }, (_, index) => ({
    x: 140 + index * 180,
    y: 190 + (index % 5) * 110,
    w: 80 + (index % 3) * 40,
    h: 260 + (index % 4) * 90,
    alpha: 0.08 + (index % 4) * 0.03
  }));

  world.particles = Array.from({ length: 110 }, () => ({
    x: Math.random() * CONFIG.WORLD_WIDTH,
    y: Math.random() * CONFIG.WORLD_HEIGHT,
    size: 1 + Math.random() * 3,
    speed: 12 + Math.random() * 28,
    drift: (Math.random() - 0.5) * 20
  }));
}

// =========================
// collisions
// =========================
function intersects(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function resolvePlatformCollisions(previousY) {
  player.onGround = false;

  for (const platform of world.platforms) {
    const overlapX = player.x + player.w > platform.x && player.x < platform.x + platform.w;
    const landed =
      overlapX &&
      previousY + player.h <= platform.y &&
      player.y + player.h >= platform.y &&
      player.vy >= 0;

    if (landed) {
      player.y = platform.y - player.h;
      player.vy = 0;
      player.onGround = true;
    }
  }
}

// =========================
// gameplay logic
// =========================
function resetGame() {
  elapsedTime = 0;
  cameraShake = 0;
  gameEnded = false;
  gameStarted = true;

  player.x = 240;
  player.y = 1000;
  player.vx = 0;
  player.vy = 0;
  player.facing = 1;
  player.onGround = false;
  player.health = CONFIG.MAX_HEALTH;
  player.collected = 0;
  player.canWin = false;

  buildWorld();
  endScreen.classList.remove("visible");
  startScreen.classList.remove("visible");
  hud.classList.remove("hidden");
  objectiveText.textContent = "Collect the scattered energy cores";
  hintText.textContent = "Approach a core and press E to stabilize it.";
  updateHud();
  updateTimer();
}

function startGame() {
  resetGame();
}

function updatePlayer(delta) {
  const left = keys.KeyA || keys.ArrowLeft;
  const right = keys.KeyD || keys.ArrowRight;
  const sprint = keys.ShiftLeft || keys.ShiftRight;
  const move = (right ? 1 : 0) - (left ? 1 : 0);
  const maxSpeed = CONFIG.PLAYER_SPEED * (sprint ? CONFIG.SPRINT_MULTIPLIER : 1);

  if (move !== 0) {
    player.facing = move;
    player.vx += move * maxSpeed * delta * 6;
  } else {
    player.vx *= player.onGround ? 0.82 : 0.96;
  }

  player.vx = Math.max(-maxSpeed, Math.min(maxSpeed, player.vx));
  player.vy += CONFIG.GRAVITY * delta;

  const previousY = player.y;
  player.x += player.vx * delta;
  player.y += player.vy * delta;

  player.x = Math.max(0, Math.min(CONFIG.WORLD_WIDTH - player.w, player.x));

  resolvePlatformCollisions(previousY);

  if (player.y > CONFIG.WORLD_HEIGHT + 200) {
    endGame(false, "You fell into the abyss below the ruins.");
  }
}

function tryJump() {
  if (!gameStarted || gameEnded || !player.onGround) {
    return;
  }
  player.vy = -CONFIG.JUMP_FORCE;
  player.onGround = false;
}

function updateCollectibles() {
  let nearby = null;
  let closest = Infinity;

  for (const collectible of world.collectibles) {
    if (collectible.collected) {
      continue;
    }

    const dx = collectible.x - (player.x + player.w / 2);
    const dy = collectible.y - (player.y + player.h / 2);
    const distance = Math.hypot(dx, dy);

    if (distance < closest) {
      closest = distance;
      nearby = collectible;
    }
  }

  if (nearby && closest < CONFIG.INTERACT_DISTANCE) {
    hintText.textContent = "Press E to collect the nearby energy core.";
    if (keys.KeyE) {
      nearby.collected = true;
      player.collected += 1;
      player.canWin = player.collected >= CONFIG.COLLECTIBLE_COUNT;
      world.gate.active = player.canWin;
      objectiveText.textContent = player.canWin
        ? "Return to the extraction gate"
        : "Collect the scattered energy cores";
      hintText.textContent = player.canWin
        ? "All cores secured. Reach the glowing extraction gate."
        : "Core stabilized. Find the next one.";
      updateHud();
      keys.KeyE = false;
    }
  } else if (player.canWin) {
    hintText.textContent = "All cores secured. Reach the glowing extraction gate.";
  } else {
    hintText.textContent = "Approach a core and press E to stabilize it.";
  }
}

function updateEnemies(delta) {
  for (const enemy of world.enemies) {
    enemy.x += enemy.dir * CONFIG.ENEMY_SPEED * delta;
    if (enemy.x < enemy.left || enemy.x > enemy.right) {
      enemy.dir *= -1;
    }

    if (
      intersects(
        { x: player.x, y: player.y, w: player.w, h: player.h },
        { x: enemy.x, y: enemy.y, w: enemy.w, h: enemy.h }
      )
    ) {
      damagePlayer(CONFIG.ENEMY_DAMAGE * delta, "A sentinel drone hit your suit.");
      player.vx += enemy.dir * 240 * delta;
    }
  }
}

function updateHazards(delta) {
  for (const hazard of world.hazards) {
    const activeHeight = hazard.h + Math.sin(elapsedTime * 3 + hazard.phase) * 8;
    if (
      intersects(
        { x: player.x, y: player.y, w: player.w, h: player.h },
        { x: hazard.x, y: hazard.y, w: hazard.w, h: activeHeight }
      )
    ) {
      damagePlayer(CONFIG.HAZARD_DAMAGE * delta, "A plasma fissure scorched your armor.");
    }
  }
}

function checkWinCondition() {
  if (!player.canWin) {
    return;
  }

  if (
    intersects(
      { x: player.x, y: player.y, w: player.w, h: player.h },
      world.gate
    )
  ) {
    endGame(true, "You stabilized the ruins and escaped through the gate.");
  }
}

function damagePlayer(amount, reason) {
  if (gameEnded) {
    return;
  }

  player.health = Math.max(0, player.health - amount);
  hintText.textContent = reason;
  cameraShake = Math.min(16, cameraShake + amount * 0.08);
  updateHud();

  if (player.health <= 0) {
    endGame(false, reason);
  }
}

function endGame(won, reason) {
  gameEnded = true;
  endScreen.classList.add("visible");
  endBadge.textContent = won ? "Mission Complete" : "Signal Lost";
  endTitle.textContent = won ? "Extraction Successful" : "Run Failed";
  endMessage.textContent = reason;
  endStats.textContent = `Cores recovered: ${player.collected}/${CONFIG.COLLECTIBLE_COUNT}  |  Time: ${timerText.textContent}`;
}

function updateHud() {
  const value = Math.round(player.health);
  healthFill.style.width = `${player.health}%`;
  healthFill.style.background =
    player.health > 55
      ? "linear-gradient(90deg, #35ffbf 0%, #7cecff 100%)"
      : player.health > 25
        ? "linear-gradient(90deg, #ffd36e 0%, #ff8c4b 100%)"
        : "linear-gradient(90deg, #ff6f75 0%, #ff2e63 100%)";
  healthText.textContent = `${value}%`;
  coreCounter.textContent = `${player.collected} / ${CONFIG.COLLECTIBLE_COUNT}`;
}

function updateTimer() {
  const total = Math.floor(elapsedTime);
  const minutes = String(Math.floor(total / 60)).padStart(2, "0");
  const seconds = String(total % 60).padStart(2, "0");
  timerText.textContent = `${minutes}:${seconds}`;
}

// =========================
// camera
// =========================
function getCamera() {
  const targetX = player.x + player.w / 2 - canvas.width / 2;
  const targetY = player.y + player.h / 2 - canvas.height / 2;
  const shakeX = cameraShake > 0 ? (Math.random() - 0.5) * cameraShake : 0;
  const shakeY = cameraShake > 0 ? (Math.random() - 0.5) * cameraShake : 0;

  return {
    x: Math.max(0, Math.min(CONFIG.WORLD_WIDTH - canvas.width, targetX)) + shakeX,
    y: Math.max(0, Math.min(CONFIG.WORLD_HEIGHT - canvas.height, targetY)) + shakeY
  };
}

// =========================
// renderer
// =========================
function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function drawBackground(camera) {
  const gradient = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
  gradient.addColorStop(0, "#041120");
  gradient.addColorStop(0.55, "#07172d");
  gradient.addColorStop(1, "#02050a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  for (const block of world.parallax) {
    const x = block.x - camera.x * 0.18;
    const y = block.y - camera.y * 0.1;
    ctx.fillStyle = `rgba(90, 200, 255, ${block.alpha})`;
    ctx.fillRect(x, y, block.w, block.h);
  }

  for (const particle of world.particles) {
    const px = particle.x - camera.x * 0.5;
    const py = ((particle.y + elapsedTime * particle.speed) % CONFIG.WORLD_HEIGHT) - camera.y * 0.3;
    ctx.fillStyle = "rgba(133, 245, 255, 0.6)";
    ctx.fillRect(px, py, particle.size, particle.size);
  }
}

function drawWorld(camera) {
  ctx.save();
  ctx.translate(-camera.x, -camera.y);

  drawStructures();
  drawHazards();
  drawCollectibles();
  drawGate();
  drawEnemies();
  drawPlayer();

  ctx.restore();
}

function drawStructures() {
  for (const platform of world.platforms) {
    const glow = ctx.createLinearGradient(platform.x, platform.y, platform.x, platform.y + platform.h);
    glow.addColorStop(0, "rgba(124,236,255,0.34)");
    glow.addColorStop(1, "rgba(9,20,34,0.98)");
    ctx.fillStyle = glow;
    ctx.fillRect(platform.x, platform.y, platform.w, platform.h);

    ctx.fillStyle = platform.glow;
    ctx.fillRect(platform.x, platform.y, platform.w, 5);

    ctx.strokeStyle = "rgba(180, 240, 255, 0.16)";
    ctx.strokeRect(platform.x, platform.y, platform.w, platform.h);
  }
}

function drawHazards() {
  for (const hazard of world.hazards) {
    const pulse = 0.4 + 0.6 * Math.sin(elapsedTime * 3 + hazard.phase) ** 2;
    ctx.fillStyle = `rgba(255, 68, 120, ${0.32 + pulse * 0.25})`;
    ctx.fillRect(hazard.x, hazard.y, hazard.w, hazard.h);
    ctx.shadowColor = "#ff4f8a";
    ctx.shadowBlur = 24;
    ctx.fillStyle = `rgba(255, 100, 140, ${0.5 + pulse * 0.3})`;
    ctx.fillRect(hazard.x, hazard.y + 3, hazard.w, 8);
    ctx.shadowBlur = 0;
  }
}

function drawCollectibles() {
  for (const collectible of world.collectibles) {
    if (collectible.collected) {
      continue;
    }

    const y = collectible.y + Math.sin(elapsedTime * 2.8 + collectible.bob) * 10;
    ctx.save();
    ctx.translate(collectible.x, y);
    ctx.rotate(elapsedTime * 1.6);
    ctx.shadowColor = "#4fffe1";
    ctx.shadowBlur = 28;
    ctx.fillStyle = "#85ffe8";
    ctx.beginPath();
    ctx.moveTo(0, -collectible.r);
    ctx.lineTo(collectible.r * 0.7, 0);
    ctx.lineTo(0, collectible.r);
    ctx.lineTo(-collectible.r * 0.7, 0);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(140, 240, 255, 0.9)";
    ctx.stroke();
    ctx.restore();
  }
}

function drawEnemies() {
  for (const enemy of world.enemies) {
    const pulse = 0.5 + 0.5 * Math.sin(elapsedTime * 5 + enemy.pulse);
    ctx.save();
    ctx.translate(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2);
    ctx.shadowColor = "#ff5f8d";
    ctx.shadowBlur = 26;
    ctx.fillStyle = `rgba(255, 90, 140, ${0.85})`;
    ctx.beginPath();
    ctx.arc(0, 0, enemy.w / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.beginPath();
    ctx.arc(0, 0, enemy.w / 2 + 8 * pulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#d5ffff";
    ctx.beginPath();
    ctx.arc(enemy.dir * 8, -3, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawGate() {
  const gate = world.gate;
  const active = world.gate.active;
  ctx.save();
  ctx.translate(gate.x, gate.y);
  ctx.fillStyle = "rgba(18, 30, 52, 0.92)";
  ctx.fillRect(0, 0, gate.w, gate.h);
  ctx.strokeStyle = active ? "#7cffeb" : "rgba(140, 180, 210, 0.4)";
  ctx.lineWidth = 4;
  ctx.strokeRect(0, 0, gate.w, gate.h);
  if (active) {
    ctx.shadowColor = "#7cffeb";
    ctx.shadowBlur = 32;
    ctx.fillStyle = "rgba(124, 255, 235, 0.18)";
    ctx.fillRect(10, 10, gate.w - 20, gate.h - 20);
    ctx.shadowBlur = 0;
  }
  ctx.restore();
}

function drawPlayer() {
  const aimX = mouse.x - window.innerWidth / 2;
  player.facing = aimX >= 0 ? 1 : -1;

  ctx.save();
  ctx.translate(player.x + player.w / 2, player.y + player.h / 2);

  ctx.shadowColor = "rgba(124,236,255,0.35)";
  ctx.shadowBlur = 22;
  ctx.fillStyle = "#d8ebff";
  roundRect(ctx, -22, -30, 44, 62, 14, true, false);
  ctx.shadowBlur = 0;

  ctx.fillStyle = "#1fffd5";
  roundRect(ctx, -8, -8, 16, 18, 6, true, false);

  ctx.fillStyle = "rgba(20, 50, 70, 0.92)";
  roundRect(ctx, -16, -42, 32, 18, 8, true, false);

  ctx.strokeStyle = "#86f2ff";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(8 * player.facing, -4);
  ctx.lineTo(34 * player.facing, -12);
  ctx.stroke();

  ctx.restore();
}

function roundRect(context, x, y, width, height, radius, fill, stroke) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
  if (fill) {
    context.fill();
  }
  if (stroke) {
    context.stroke();
  }
}

// =========================
// animation loop
// =========================
function update(delta) {
  if (!gameStarted || gameEnded) {
    cameraShake *= 0.9;
    return;
  }

  elapsedTime += delta;
  cameraShake *= 0.88;

  updatePlayer(delta);
  updateCollectibles();
  updateEnemies(delta);
  updateHazards(delta);
  checkWinCondition();
  updateTimer();
}

function render() {
  const camera = getCamera();
  drawBackground(camera);
  drawWorld(camera);
}

function frame(timestamp) {
  if (!lastFrame) {
    lastFrame = timestamp;
  }

  const delta = Math.min((timestamp - lastFrame) / 1000, 0.033);
  lastFrame = timestamp;

  update(delta);
  render();
  requestAnimationFrame(frame);
}

// =========================
// input
// =========================
window.addEventListener("keydown", (event) => {
  keys[event.code] = true;
  if (event.code === "Space") {
    event.preventDefault();
    tryJump();
  }
});

window.addEventListener("keyup", (event) => {
  keys[event.code] = false;
});

window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

window.addEventListener("resize", resizeCanvas);
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", resetGame);

// =========================
// bootstrapping
// =========================
resizeCanvas();
buildWorld();
updateHud();
updateTimer();
requestAnimationFrame(frame);
