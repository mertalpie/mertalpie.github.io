/*
  Neon Rift: Eclipse Run
  Premium self-contained HTML5 Canvas survival game.
*/

// =========================
// configuration
// =========================
const CONFIG = {
  WORLD_WIDTH: 2400,
  WORLD_HEIGHT: 1350,
  PLAYER_RADIUS: 16,
  PLAYER_ACCEL: 980,
  PLAYER_DRAG: 0.86,
  PLAYER_MAX_SPEED: 320,
  DASH_SPEED: 840,
  DASH_TIME: 0.16,
  DASH_COOLDOWN: 1.35,
  BULLET_SPEED: 780,
  BULLET_LIFE: 0.7,
  FIRE_COOLDOWN: 0.16,
  ENEMY_BASE_SPEED: 86,
  ENEMY_SPAWN_BASE: 1.2,
  HAZARD_SPAWN_BASE: 3.8,
  PARTICLE_LIMIT: 520,
  SHARDS_TO_WIN: 12,
  SURVIVAL_TARGET: 90,
  MAX_HEALTH: 100
};

// =========================
// DOM / UI
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
const scoreText = document.getElementById("scoreText");
const shardText = document.getElementById("shardText");
const timeText = document.getElementById("timeText");
const objectiveText = document.getElementById("objectiveText");
const hintText = document.getElementById("hintText");
const endBadge = document.getElementById("endBadge");
const endTitle = document.getElementById("endTitle");
const endMessage = document.getElementById("endMessage");
const endStats = document.getElementById("endStats");

// =========================
// game state
// =========================
const keys = Object.create(null);

const game = {
  running: false,
  ended: false,
  won: false,
  time: 0,
  score: 0,
  difficulty: 1,
  enemySpawnTimer: 0,
  hazardSpawnTimer: 0,
  lastTimestamp: 0,
  camera: { x: 0, y: 0, shake: 0 },
  flash: 0,
  backgroundPulse: 0,
  messageCooldown: 0
};

const player = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  radius: CONFIG.PLAYER_RADIUS,
  health: CONFIG.MAX_HEALTH,
  dashTimer: 0,
  dashCooldown: 0,
  fireCooldown: 0,
  invuln: 0,
  facingX: 1,
  facingY: 0,
  trail: [],
  shards: 0
};

const bullets = [];
const enemies = [];
const hazards = [];
const shards = [];
const particles = [];
const rings = [];
const stars = [];
const columns = [];

// =========================
// input handling
// =========================
window.addEventListener("keydown", (event) => {
  keys[event.code] = true;
  if (event.code === "Space") {
    event.preventDefault();
    triggerDash();
  }
});

window.addEventListener("keyup", (event) => {
  keys[event.code] = false;
});

// =========================
// setup
// =========================
function setupBackground() {
  stars.length = 0;
  columns.length = 0;

  for (let i = 0; i < 180; i += 1) {
    stars.push({
      x: Math.random() * CONFIG.WORLD_WIDTH,
      y: Math.random() * CONFIG.WORLD_HEIGHT,
      size: Math.random() * 2.4 + 0.5,
      speed: 6 + Math.random() * 18,
      alpha: 0.2 + Math.random() * 0.7
    });
  }

  for (let i = 0; i < 28; i += 1) {
    columns.push({
      x: 60 + i * 90,
      y: 220 + (i % 5) * 80,
      w: 28 + (i % 3) * 20,
      h: 420 + (i % 4) * 120,
      alpha: 0.05 + (i % 4) * 0.03
    });
  }
}

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
setupBackground();

// =========================
// utility
// =========================
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function distance(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}

function normalized(x, y) {
  const len = Math.hypot(x, y) || 1;
  return { x: x / len, y: y / len };
}

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function pushParticle(options) {
  if (particles.length >= CONFIG.PARTICLE_LIMIT) {
    particles.shift();
  }
  particles.push({
    x: options.x,
    y: options.y,
    vx: options.vx || 0,
    vy: options.vy || 0,
    life: options.life || 0.4,
    maxLife: options.life || 0.4,
    size: options.size || 4,
    color: options.color || "#7cecff",
    glow: options.glow || options.color || "#7cecff"
  });
}

function pushRing(options) {
  rings.push({
    x: options.x,
    y: options.y,
    radius: options.radius || 10,
    life: options.life || 0.5,
    maxLife: options.life || 0.5,
    color: options.color || "#73efff",
    lineWidth: options.lineWidth || 3
  });
}

function setHint(text) {
  if (game.messageCooldown <= 0) {
    hintText.textContent = text;
    game.messageCooldown = 1.2;
  }
}

// =========================
// player
// =========================
function resetPlayer() {
  player.x = CONFIG.WORLD_WIDTH * 0.5;
  player.y = CONFIG.WORLD_HEIGHT * 0.55;
  player.vx = 0;
  player.vy = 0;
  player.health = CONFIG.MAX_HEALTH;
  player.dashTimer = 0;
  player.dashCooldown = 0;
  player.fireCooldown = 0;
  player.invuln = 0;
  player.facingX = 1;
  player.facingY = 0;
  player.trail.length = 0;
  player.shards = 0;
}

function triggerDash() {
  if (!game.running || game.ended || player.dashCooldown > 0) {
    return;
  }

  let moveX = (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0);
  let moveY = (keys.KeyS ? 1 : 0) - (keys.KeyW ? 1 : 0);

  if (moveX === 0 && moveY === 0) {
    moveX = player.facingX;
    moveY = player.facingY;
  }

  const dir = normalized(moveX, moveY);
  player.vx = dir.x * CONFIG.DASH_SPEED;
  player.vy = dir.y * CONFIG.DASH_SPEED;
  player.dashTimer = CONFIG.DASH_TIME;
  player.dashCooldown = CONFIG.DASH_COOLDOWN;
  player.invuln = 0.18;
  game.camera.shake = 14;
  pushRing({ x: player.x, y: player.y, radius: 18, life: 0.38, color: "#1fffd4", lineWidth: 4 });

  for (let i = 0; i < 16; i += 1) {
    const angle = (Math.PI * 2 * i) / 16;
    pushParticle({
      x: player.x,
      y: player.y,
      vx: Math.cos(angle) * randomRange(60, 180),
      vy: Math.sin(angle) * randomRange(60, 180),
      size: randomRange(3, 7),
      life: randomRange(0.25, 0.55),
      color: "#1fffd4"
    });
  }
}

function fireBullet(dx, dy) {
  if (player.fireCooldown > 0 || game.ended) {
    return;
  }

  const dir = normalized(dx, dy);
  player.facingX = dir.x;
  player.facingY = dir.y;
  player.fireCooldown = CONFIG.FIRE_COOLDOWN;

  bullets.push({
    x: player.x + dir.x * (player.radius + 10),
    y: player.y + dir.y * (player.radius + 10),
    vx: dir.x * CONFIG.BULLET_SPEED,
    vy: dir.y * CONFIG.BULLET_SPEED,
    life: CONFIG.BULLET_LIFE,
    trail: []
  });

  for (let i = 0; i < 4; i += 1) {
    pushParticle({
      x: player.x + dir.x * player.radius,
      y: player.y + dir.y * player.radius,
      vx: dir.x * randomRange(140, 220) + randomRange(-40, 40),
      vy: dir.y * randomRange(140, 220) + randomRange(-40, 40),
      size: randomRange(2, 4),
      life: randomRange(0.12, 0.2),
      color: "#7cecff"
    });
  }
}

function handleShooting() {
  const shootX = (keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0);
  const shootY = (keys.ArrowDown ? 1 : 0) - (keys.ArrowUp ? 1 : 0);

  if (shootX !== 0 || shootY !== 0) {
    fireBullet(shootX, shootY);
  }
}

function updatePlayer(delta) {
  const moveX = (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0);
  const moveY = (keys.KeyS ? 1 : 0) - (keys.KeyW ? 1 : 0);
  const dir = normalized(moveX, moveY);

  if (moveX !== 0 || moveY !== 0) {
    const accel = player.dashTimer > 0 ? 0.25 : 1;
    player.vx += dir.x * CONFIG.PLAYER_ACCEL * accel * delta;
    player.vy += dir.y * CONFIG.PLAYER_ACCEL * accel * delta;
    player.facingX = dir.x || player.facingX;
    player.facingY = dir.y || player.facingY;
  }

  const maxSpeed = player.dashTimer > 0 ? CONFIG.DASH_SPEED : CONFIG.PLAYER_MAX_SPEED;
  const speed = Math.hypot(player.vx, player.vy);
  if (speed > maxSpeed) {
    const damp = maxSpeed / speed;
    player.vx *= damp;
    player.vy *= damp;
  }

  const drag = player.dashTimer > 0 ? 0.94 : CONFIG.PLAYER_DRAG;
  player.vx *= drag;
  player.vy *= drag;

  player.x = clamp(player.x + player.vx * delta, 32, CONFIG.WORLD_WIDTH - 32);
  player.y = clamp(player.y + player.vy * delta, 32, CONFIG.WORLD_HEIGHT - 32);

  player.dashTimer = Math.max(0, player.dashTimer - delta);
  player.dashCooldown = Math.max(0, player.dashCooldown - delta);
  player.fireCooldown = Math.max(0, player.fireCooldown - delta);
  player.invuln = Math.max(0, player.invuln - delta);

  player.trail.push({ x: player.x, y: player.y, life: 0.35 });
  if (player.trail.length > 16) {
    player.trail.shift();
  }
}

function damagePlayer(amount, reason) {
  if (player.invuln > 0 || game.ended) {
    return;
  }

  player.health = Math.max(0, player.health - amount);
  player.invuln = 0.42;
  game.camera.shake = Math.max(game.camera.shake, 12);
  game.flash = Math.max(game.flash, 0.22);
  setHint(reason);
  updateHud();

  for (let i = 0; i < 12; i += 1) {
    pushParticle({
      x: player.x,
      y: player.y,
      vx: randomRange(-180, 180),
      vy: randomRange(-180, 180),
      size: randomRange(3, 6),
      life: randomRange(0.2, 0.45),
      color: "#ff4d78"
    });
  }

  if (player.health <= 0) {
    finishRun(false, "Your hull fractured inside the eclipse.");
  }
}

// =========================
// enemies / hazards
// =========================
function spawnEnemy() {
  const edge = Math.floor(Math.random() * 4);
  let x = 0;
  let y = 0;

  if (edge === 0) {
    x = randomRange(0, CONFIG.WORLD_WIDTH);
    y = -40;
  } else if (edge === 1) {
    x = CONFIG.WORLD_WIDTH + 40;
    y = randomRange(0, CONFIG.WORLD_HEIGHT);
  } else if (edge === 2) {
    x = randomRange(0, CONFIG.WORLD_WIDTH);
    y = CONFIG.WORLD_HEIGHT + 40;
  } else {
    x = -40;
    y = randomRange(0, CONFIG.WORLD_HEIGHT);
  }

  const variant = Math.random() < 0.26 ? "heavy" : "hunter";
  enemies.push({
    x,
    y,
    radius: variant === "heavy" ? 22 : 15,
    speed: (variant === "heavy" ? 58 : 94) + game.difficulty * CONFIG.ENEMY_BASE_SPEED * 0.2,
    hp: variant === "heavy" ? 4 : 2,
    value: variant === "heavy" ? 220 : 100,
    color: variant === "heavy" ? "#ffd66b" : "#ff4d78",
    pulse: Math.random() * Math.PI * 2,
    variant
  });
}

function spawnHazard() {
  const horizontal = Math.random() < 0.5;
  const life = 3.8 + Math.random() * 1.6;
  hazards.push({
    x: horizontal ? randomRange(180, CONFIG.WORLD_WIDTH - 180) : Math.random() < 0.5 ? -80 : CONFIG.WORLD_WIDTH + 80,
    y: horizontal ? (Math.random() < 0.5 ? -80 : CONFIG.WORLD_HEIGHT + 80) : randomRange(180, CONFIG.WORLD_HEIGHT - 180),
    vx: horizontal ? randomRange(-40, 40) : (Math.random() < 0.5 ? 180 : -180) * (1 + game.difficulty * 0.08),
    vy: horizontal ? (Math.random() < 0.5 ? 180 : -180) * (1 + game.difficulty * 0.08) : randomRange(-40, 40),
    radius: randomRange(28, 40),
    life,
    maxLife: life,
    angle: Math.random() * Math.PI * 2
  });
}

function updateEnemies(delta) {
  for (let i = enemies.length - 1; i >= 0; i -= 1) {
    const enemy = enemies[i];
    const toPlayer = normalized(player.x - enemy.x, player.y - enemy.y);
    enemy.x += toPlayer.x * enemy.speed * delta;
    enemy.y += toPlayer.y * enemy.speed * delta;
    enemy.pulse += delta * 5;

    if (distance(enemy.x, enemy.y, player.x, player.y) < enemy.radius + player.radius) {
      damagePlayer(enemy.variant === "heavy" ? 22 : 14, "A rift drone carved into your hull.");
      enemies.splice(i, 1);
      pushRing({ x: enemy.x, y: enemy.y, radius: enemy.radius, life: 0.28, color: "#ff4d78" });
      continue;
    }
  }
}

function updateHazards(delta) {
  for (let i = hazards.length - 1; i >= 0; i -= 1) {
    const hazard = hazards[i];
    hazard.x += hazard.vx * delta;
    hazard.y += hazard.vy * delta;
    hazard.life -= delta;
    hazard.angle += delta * 4;

    if (distance(hazard.x, hazard.y, player.x, player.y) < hazard.radius + player.radius + 8) {
      damagePlayer(18, "A pulse sphere overloaded your shields.");
    }

    if (hazard.life <= 0) {
      hazards.splice(i, 1);
    }
  }
}

// =========================
// collectibles
// =========================
function spawnShard(x, y, count = 1) {
  for (let i = 0; i < count; i += 1) {
    shards.push({
      x: x + randomRange(-8, 8),
      y: y + randomRange(-8, 8),
      radius: 10,
      life: 10,
      bob: Math.random() * Math.PI * 2
    });
  }
}

function updateShards(delta) {
  for (let i = shards.length - 1; i >= 0; i -= 1) {
    const shard = shards[i];
    shard.life -= delta;
    shard.bob += delta * 3;

    if (distance(shard.x, shard.y, player.x, player.y) < shard.radius + player.radius + 8) {
      shards.splice(i, 1);
      player.shards += 1;
      game.score += 150;
      updateHud();
      pushRing({ x: shard.x, y: shard.y, radius: 14, life: 0.3, color: "#1fffd4" });

      for (let p = 0; p < 10; p += 1) {
        pushParticle({
          x: shard.x,
          y: shard.y,
          vx: randomRange(-130, 130),
          vy: randomRange(-130, 130),
          size: randomRange(2, 5),
          life: randomRange(0.18, 0.36),
          color: "#1fffd4"
        });
      }

      if (player.shards >= CONFIG.SHARDS_TO_WIN) {
        objectiveText.textContent = "Hold on until the eclipse timer reaches 90 seconds.";
        setHint("Shard quota complete. Survive the final eclipse surge.");
      }
      continue;
    }

    if (shard.life <= 0) {
      shards.splice(i, 1);
    }
  }
}

// =========================
// particles / effects
// =========================
function updateEffects(delta) {
  for (let i = particles.length - 1; i >= 0; i -= 1) {
    const particle = particles[i];
    particle.life -= delta;
    particle.x += particle.vx * delta;
    particle.y += particle.vy * delta;
    particle.vx *= 0.97;
    particle.vy *= 0.97;
    if (particle.life <= 0) {
      particles.splice(i, 1);
    }
  }

  for (let i = rings.length - 1; i >= 0; i -= 1) {
    const ring = rings[i];
    ring.life -= delta;
    ring.radius += 160 * delta;
    if (ring.life <= 0) {
      rings.splice(i, 1);
    }
  }

  for (let i = player.trail.length - 1; i >= 0; i -= 1) {
    player.trail[i].life -= delta;
    if (player.trail[i].life <= 0) {
      player.trail.splice(i, 1);
    }
  }

  game.camera.shake *= 0.9;
  game.flash = Math.max(0, game.flash - delta * 1.4);
  game.backgroundPulse += delta * 0.8;
  game.messageCooldown = Math.max(0, game.messageCooldown - delta);
}

// =========================
// collision logic
// =========================
function updateBullets(delta) {
  for (let i = bullets.length - 1; i >= 0; i -= 1) {
    const bullet = bullets[i];
    bullet.life -= delta;
    bullet.x += bullet.vx * delta;
    bullet.y += bullet.vy * delta;
    bullet.trail.push({ x: bullet.x, y: bullet.y, life: 0.14 });
    if (bullet.trail.length > 6) {
      bullet.trail.shift();
    }

    let destroyed = bullet.life <= 0;

    for (let e = enemies.length - 1; e >= 0 && !destroyed; e -= 1) {
      const enemy = enemies[e];
      if (distance(bullet.x, bullet.y, enemy.x, enemy.y) < enemy.radius + 5) {
        enemy.hp -= 1;
        destroyed = true;
        pushRing({ x: bullet.x, y: bullet.y, radius: 8, life: 0.18, color: "#7cecff", lineWidth: 2 });

        for (let p = 0; p < 7; p += 1) {
          pushParticle({
            x: bullet.x,
            y: bullet.y,
            vx: randomRange(-150, 150),
            vy: randomRange(-150, 150),
            size: randomRange(2, 4),
            life: randomRange(0.12, 0.28),
            color: enemy.color
          });
        }

        if (enemy.hp <= 0) {
          game.score += enemy.value;
          if (Math.random() < 0.75) {
            spawnShard(enemy.x, enemy.y, enemy.variant === "heavy" ? 2 : 1);
          }
          if (Math.random() < 0.18) {
            player.health = clamp(player.health + 8, 0, CONFIG.MAX_HEALTH);
          }
          pushRing({ x: enemy.x, y: enemy.y, radius: enemy.radius, life: 0.28, color: enemy.color });
          enemies.splice(e, 1);
          updateHud();
        }
      }
    }

    if (
      bullet.x < -40 ||
      bullet.x > CONFIG.WORLD_WIDTH + 40 ||
      bullet.y < -40 ||
      bullet.y > CONFIG.WORLD_HEIGHT + 40
    ) {
      destroyed = true;
    }

    if (destroyed) {
      bullets.splice(i, 1);
    }
  }

  for (const bullet of bullets) {
    for (let t = bullet.trail.length - 1; t >= 0; t -= 1) {
      bullet.trail[t].life -= delta;
      if (bullet.trail[t].life <= 0) {
        bullet.trail.splice(t, 1);
      }
    }
  }
}

// =========================
// UI / overlays
// =========================
function updateHud() {
  const hp = Math.round(player.health);
  healthFill.style.width = `${player.health}%`;
  healthFill.style.background =
    player.health > 55
      ? "linear-gradient(90deg, #34ffbe 0%, #73efff 100%)"
      : player.health > 25
        ? "linear-gradient(90deg, #ffd66b 0%, #ff9a4c 100%)"
        : "linear-gradient(90deg, #ff7584 0%, #ff2e63 100%)";
  healthText.textContent = `${hp}%`;
  scoreText.textContent = String(game.score);
  shardText.textContent = `${player.shards} / ${CONFIG.SHARDS_TO_WIN}`;
}

function updateTimer() {
  const total = Math.floor(game.time);
  const minutes = String(Math.floor(total / 60)).padStart(2, "0");
  const seconds = String(total % 60).padStart(2, "0");
  timeText.textContent = `${minutes}:${seconds}`;
}

function finishRun(won, message) {
  game.running = false;
  game.ended = true;
  game.won = won;
  endScreen.classList.add("visible");
  endBadge.textContent = won ? "Rift Closed" : "Signal Lost";
  endTitle.textContent = won ? "Eclipse Survived" : "Run Failed";
  endMessage.textContent = message;
  endStats.textContent = `Score: ${game.score}  |  Shards: ${player.shards}/${CONFIG.SHARDS_TO_WIN}  |  Time: ${timeText.textContent}`;
}

function startRun() {
  game.running = true;
  game.ended = false;
  game.won = false;
  game.time = 0;
  game.score = 0;
  game.difficulty = 1;
  game.enemySpawnTimer = 0.35;
  game.hazardSpawnTimer = 2.4;
  game.camera.shake = 0;
  game.flash = 0;
  game.backgroundPulse = 0;
  game.messageCooldown = 0;

  bullets.length = 0;
  enemies.length = 0;
  hazards.length = 0;
  shards.length = 0;
  particles.length = 0;
  rings.length = 0;

  resetPlayer();
  updateHud();
  updateTimer();
  objectiveText.textContent = "Survive the eclipse and harvest 12 shards.";
  hintText.textContent = "Destroy drones, collect shards, and endure the eclipse storm.";
  startScreen.classList.remove("visible");
  endScreen.classList.remove("visible");
  hud.classList.remove("hidden");

  for (let i = 0; i < 4; i += 1) {
    spawnEnemy();
  }
}

startButton.addEventListener("click", startRun);
restartButton.addEventListener("click", startRun);

// =========================
// rendering
// =========================
function getCamera() {
  const targetX = clamp(player.x - window.innerWidth / 2, 0, CONFIG.WORLD_WIDTH - window.innerWidth);
  const targetY = clamp(player.y - window.innerHeight / 2, 0, CONFIG.WORLD_HEIGHT - window.innerHeight);
  game.camera.x = lerp(game.camera.x, targetX, 0.08);
  game.camera.y = lerp(game.camera.y, targetY, 0.08);

  return {
    x: game.camera.x + (Math.random() - 0.5) * game.camera.shake,
    y: game.camera.y + (Math.random() - 0.5) * game.camera.shake
  };
}

function drawBackground(camera) {
  const gradient = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
  gradient.addColorStop(0, "#05121f");
  gradient.addColorStop(0.55, "#06101c");
  gradient.addColorStop(1, "#02050a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  const pulseAlpha = 0.08 + Math.sin(game.backgroundPulse) * 0.04;
  ctx.fillStyle = `rgba(23, 255, 210, ${pulseAlpha})`;
  ctx.beginPath();
  ctx.arc(window.innerWidth * 0.78, window.innerHeight * 0.14, 180, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = `rgba(87, 175, 255, ${0.09 + pulseAlpha * 0.8})`;
  ctx.beginPath();
  ctx.arc(window.innerWidth * 0.18, window.innerHeight * 0.2, 220, 0, Math.PI * 2);
  ctx.fill();

  for (const column of columns) {
    ctx.fillStyle = `rgba(105, 220, 255, ${column.alpha})`;
    ctx.fillRect(column.x - camera.x * 0.18, column.y - camera.y * 0.1, column.w, column.h);
  }

  for (const star of stars) {
    const sx = star.x - camera.x * 0.35;
    const sy = ((star.y + game.time * star.speed) % CONFIG.WORLD_HEIGHT) - camera.y * 0.2;
    ctx.fillStyle = `rgba(140, 235, 255, ${star.alpha})`;
    ctx.fillRect(sx, sy, star.size, star.size);
  }
}

function drawArena(camera) {
  ctx.save();
  ctx.translate(-camera.x, -camera.y);

  ctx.strokeStyle = "rgba(124, 236, 255, 0.12)";
  ctx.lineWidth = 2;
  for (let x = 0; x <= CONFIG.WORLD_WIDTH; x += 120) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, CONFIG.WORLD_HEIGHT);
    ctx.stroke();
  }
  for (let y = 0; y <= CONFIG.WORLD_HEIGHT; y += 120) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CONFIG.WORLD_WIDTH, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(124, 236, 255, 0.2)";
  ctx.lineWidth = 6;
  ctx.strokeRect(16, 16, CONFIG.WORLD_WIDTH - 32, CONFIG.WORLD_HEIGHT - 32);

  ctx.restore();
}

function drawHazards(camera) {
  ctx.save();
  ctx.translate(-camera.x, -camera.y);

  for (const hazard of hazards) {
    const alpha = Math.max(0.16, hazard.life / hazard.maxLife);
    const gradient = ctx.createRadialGradient(hazard.x, hazard.y, 6, hazard.x, hazard.y, hazard.radius);
    gradient.addColorStop(0, `rgba(255, 118, 166, ${0.45 * alpha})`);
    gradient.addColorStop(1, "rgba(255, 60, 120, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(hazard.x, hazard.y, hazard.radius * 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(hazard.x, hazard.y);
    ctx.rotate(hazard.angle);
    ctx.shadowColor = "#ff4d78";
    ctx.shadowBlur = 28;
    ctx.strokeStyle = `rgba(255, 92, 138, ${0.76 * alpha})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, hazard.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-hazard.radius * 1.25, 0);
    ctx.lineTo(hazard.radius * 1.25, 0);
    ctx.moveTo(0, -hazard.radius * 1.25);
    ctx.lineTo(0, hazard.radius * 1.25);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

function drawShards(camera) {
  ctx.save();
  ctx.translate(-camera.x, -camera.y);

  for (const shard of shards) {
    const y = shard.y + Math.sin(shard.bob) * 6;
    ctx.save();
    ctx.translate(shard.x, y);
    ctx.rotate(game.time * 1.8 + shard.bob);
    ctx.shadowColor = "#1fffd4";
    ctx.shadowBlur = 24;
    ctx.fillStyle = "#8ffff0";
    ctx.beginPath();
    ctx.moveTo(0, -shard.radius);
    ctx.lineTo(shard.radius * 0.75, 0);
    ctx.lineTo(0, shard.radius);
    ctx.lineTo(-shard.radius * 0.75, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

function drawBullets(camera) {
  ctx.save();
  ctx.translate(-camera.x, -camera.y);

  for (const bullet of bullets) {
    for (const trail of bullet.trail) {
      ctx.fillStyle = `rgba(124, 236, 255, ${trail.life / 0.14})`;
      ctx.beginPath();
      ctx.arc(trail.x, trail.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.shadowColor = "#7cecff";
    ctx.shadowBlur = 16;
    ctx.fillStyle = "#baf5ff";
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  ctx.restore();
}

function drawEnemies(camera) {
  ctx.save();
  ctx.translate(-camera.x, -camera.y);

  for (const enemy of enemies) {
    const pulse = 0.5 + 0.5 * Math.sin(enemy.pulse);
    ctx.save();
    ctx.translate(enemy.x, enemy.y);
    ctx.shadowColor = enemy.color;
    ctx.shadowBlur = enemy.variant === "heavy" ? 28 : 22;
    ctx.fillStyle = enemy.color;
    ctx.beginPath();
    ctx.arc(0, 0, enemy.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.strokeStyle = `rgba(255,255,255,${0.35 + pulse * 0.25})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, enemy.radius + 6 * pulse, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#031018";
    ctx.beginPath();
    ctx.arc(0, 0, enemy.radius * 0.48, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

function drawPlayer(camera) {
  ctx.save();
  ctx.translate(-camera.x, -camera.y);

  for (const ghost of player.trail) {
    ctx.fillStyle = `rgba(31, 255, 212, ${ghost.life * 0.6})`;
    ctx.beginPath();
    ctx.arc(ghost.x, ghost.y, player.radius * 0.85, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(Math.atan2(player.facingY, player.facingX));
  ctx.shadowColor = player.invuln > 0 ? "#ffffff" : "#1fffd4";
  ctx.shadowBlur = player.invuln > 0 ? 30 : 24;
  ctx.fillStyle = player.invuln > 0 ? "#ffffff" : "#d9fbff";
  ctx.beginPath();
  ctx.moveTo(player.radius + 8, 0);
  ctx.lineTo(-player.radius + 2, -player.radius + 4);
  ctx.lineTo(-player.radius + 8, 0);
  ctx.lineTo(-player.radius + 2, player.radius - 4);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = "#1fffd4";
  ctx.beginPath();
  ctx.arc(-2, 0, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

function drawEffects(camera) {
  ctx.save();
  ctx.translate(-camera.x, -camera.y);

  for (const particle of particles) {
    const alpha = particle.life / particle.maxLife;
    ctx.shadowColor = particle.glow;
    ctx.shadowBlur = 18;
    ctx.fillStyle = hexToRgba(particle.color, alpha);
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const ring of rings) {
    ctx.strokeStyle = hexToRgba(ring.color, ring.life / ring.maxLife);
    ctx.lineWidth = ring.lineWidth;
    ctx.beginPath();
    ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();

  if (game.flash > 0) {
    ctx.fillStyle = `rgba(255, 90, 120, ${game.flash * 0.35})`;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

function hexToRgba(hex, alpha) {
  const value = hex.replace("#", "");
  const size = value.length === 3 ? 1 : 2;
  const parts = value.length === 3
    ? value.split("").map((char) => parseInt(char + char, 16))
    : [
        parseInt(value.slice(0, 2), 16),
        parseInt(value.slice(2, 4), 16),
        parseInt(value.slice(4, 6), 16)
      ];
  return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
}

// =========================
// game loop
// =========================
function update(delta) {
  if (!game.running || game.ended) {
    updateEffects(delta);
    return;
  }

  game.time += delta;
  game.difficulty = 1 + game.time / 26;
  game.enemySpawnTimer -= delta;
  game.hazardSpawnTimer -= delta;

  if (game.enemySpawnTimer <= 0) {
    spawnEnemy();
    game.enemySpawnTimer = Math.max(0.32, CONFIG.ENEMY_SPAWN_BASE - game.difficulty * 0.06);
  }

  if (game.hazardSpawnTimer <= 0) {
    spawnHazard();
    game.hazardSpawnTimer = Math.max(1.55, CONFIG.HAZARD_SPAWN_BASE - game.difficulty * 0.08);
  }

  handleShooting();
  updatePlayer(delta);
  updateBullets(delta);
  updateEnemies(delta);
  updateHazards(delta);
  updateShards(delta);
  updateEffects(delta);
  updateTimer();
  updateHud();

  if (player.shards >= CONFIG.SHARDS_TO_WIN && game.time >= CONFIG.SURVIVAL_TARGET) {
    finishRun(true, "You harvested enough shards and survived the full eclipse.");
  } else if (game.time >= CONFIG.SURVIVAL_TARGET && player.shards < CONFIG.SHARDS_TO_WIN) {
    objectiveText.textContent = "Final chance: gather the remaining shards.";
  }
}

function render() {
  const camera = getCamera();
  drawBackground(camera);
  drawArena(camera);
  drawHazards(camera);
  drawShards(camera);
  drawBullets(camera);
  drawEnemies(camera);
  drawPlayer(camera);
  drawEffects(camera);
}

function loop(timestamp) {
  if (!game.lastTimestamp) {
    game.lastTimestamp = timestamp;
  }

  const delta = Math.min((timestamp - game.lastTimestamp) / 1000, 0.033);
  game.lastTimestamp = timestamp;

  update(delta);
  render();
  requestAnimationFrame(loop);
}

updateHud();
updateTimer();
requestAnimationFrame(loop);
