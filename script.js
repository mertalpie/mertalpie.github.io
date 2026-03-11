/*
  Neon Ruins: Corefall
  A static Three.js action-adventure prototype with no build step.
  Customize the tuning constants below to quickly change movement, hazards, and mission length.
*/

if (!window.THREE) {
  const startButton = document.getElementById("startButton");
  const startScreen = document.getElementById("startScreen");

  if (startButton) {
    startButton.disabled = true;
    startButton.textContent = "Three.js kon niet laden";
    startButton.style.opacity = "0.6";
    startButton.style.cursor = "not-allowed";
  }

  if (startScreen) {
    const note = document.createElement("div");
    note.className = "small-note";
    note.innerHTML = "Lokale start mislukt: de <strong>Three.js CDN</strong> is niet geladen. Open het bestand met internetverbinding of zet <code>three.min.js</code> lokaal naast <code>index.html</code>.";
    startScreen.querySelector(".hero-card")?.appendChild(note);
  }
} else {

// =========================
// tuning constants
// =========================
const CONFIG = {
  PLAYER_SPEED: 8.5,
  SPRINT_MULTIPLIER: 1.7,
  JUMP_FORCE: 10.5,
  GRAVITY: 28,
  AIR_CONTROL: 0.42,
  CAMERA_DISTANCE: 8.8,
  CAMERA_HEIGHT: 3.8,
  MOUSE_SENSITIVITY: 0.0024,
  ENEMY_SPEED: 3.2,
  ENEMY_CHASE_RANGE: 13,
  ENEMY_DAMAGE: 18,
  HAZARD_DAMAGE: 24,
  COLLECTIBLE_COUNT: 5,
  MAX_HEALTH: 100,
  INTERACT_DISTANCE: 2.8,
  FALL_LIMIT: -18,
  WIN_PAD_RADIUS: 3.2
};

// =========================
// DOM / UI logic
// =========================
const canvas = document.getElementById("gameCanvas");
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
// scene setup
// =========================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050a12);
scene.fog = new THREE.FogExp2(0x07111a, 0.035);

// =========================
// renderer
// =========================
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

// =========================
// camera
// =========================
const camera = new THREE.PerspectiveCamera(68, window.innerWidth / window.innerHeight, 0.1, 300);
camera.position.set(0, 4, 10);

let yaw = 0;
let pitch = -0.2;
const cameraTarget = new THREE.Vector3();
const desiredCameraPosition = new THREE.Vector3();
const lookAtTarget = new THREE.Vector3();

// =========================
// global state
// =========================
const clock = new THREE.Clock();
const keys = Object.create(null);
let pointerLocked = false;
let gameStarted = false;
let gameEnded = false;
let elapsedTime = 0;
let lastDamageTime = 0;
let nextPulseTime = 0;

const world = {
  solids: [],
  collectibles: [],
  enemies: [],
  hazards: [],
  particles: [],
  decor: []
};

const player = {
  group: null,
  velocity: new THREE.Vector3(),
  moveDirection: new THREE.Vector3(),
  facing: new THREE.Vector3(0, 0, 1),
  onGround: false,
  health: CONFIG.MAX_HEALTH,
  collected: 0,
  canWin: false,
  spawn: new THREE.Vector3(0, 4, 0)
};

const tempVecA = new THREE.Vector3();
const tempVecB = new THREE.Vector3();

// =========================
// materials
// =========================
const materials = {
  stone: new THREE.MeshStandardMaterial({
    color: 0x172433,
    roughness: 0.9,
    metalness: 0.08
  }),
  stoneDark: new THREE.MeshStandardMaterial({
    color: 0x0d1521,
    roughness: 0.95,
    metalness: 0.02
  }),
  metal: new THREE.MeshStandardMaterial({
    color: 0x5a7c95,
    roughness: 0.34,
    metalness: 0.84
  }),
  neonCyan: new THREE.MeshStandardMaterial({
    color: 0x8eefff,
    emissive: 0x3fe7ff,
    emissiveIntensity: 2.6,
    roughness: 0.18,
    metalness: 0.88
  }),
  neonAqua: new THREE.MeshStandardMaterial({
    color: 0x85ffe8,
    emissive: 0x1fffd5,
    emissiveIntensity: 2.2,
    roughness: 0.2,
    metalness: 0.75
  }),
  neonDanger: new THREE.MeshStandardMaterial({
    color: 0xff7aa0,
    emissive: 0xff346c,
    emissiveIntensity: 2.5,
    roughness: 0.16,
    metalness: 0.68
  }),
  playerBody: new THREE.MeshStandardMaterial({
    color: 0xd7e9ff,
    emissive: 0x1d3856,
    emissiveIntensity: 0.9,
    roughness: 0.22,
    metalness: 0.7
  }),
  playerAccent: new THREE.MeshStandardMaterial({
    color: 0xa8fff2,
    emissive: 0x2af9d3,
    emissiveIntensity: 2.2,
    roughness: 0.2,
    metalness: 0.95
  }),
  glass: new THREE.MeshStandardMaterial({
    color: 0x86dfff,
    emissive: 0x1a3f5f,
    emissiveIntensity: 0.6,
    transparent: true,
    opacity: 0.38,
    roughness: 0.08,
    metalness: 0.55
  })
};

// =========================
// lighting
// =========================
function setupLighting() {
  const hemi = new THREE.HemisphereLight(0x6fd3ff, 0x05080e, 0.9);
  scene.add(hemi);

  const moon = new THREE.DirectionalLight(0x8fc9ff, 1.7);
  moon.position.set(10, 22, 8);
  moon.castShadow = true;
  moon.shadow.mapSize.set(2048, 2048);
  moon.shadow.camera.near = 1;
  moon.shadow.camera.far = 80;
  moon.shadow.camera.left = -28;
  moon.shadow.camera.right = 28;
  moon.shadow.camera.top = 28;
  moon.shadow.camera.bottom = -28;
  scene.add(moon);

  const rim = new THREE.PointLight(0x1fffd5, 16, 34, 2);
  rim.position.set(0, 8, -8);
  scene.add(rim);

  const distantGlow = new THREE.PointLight(0xff5c84, 12, 40, 2);
  distantGlow.position.set(-16, 6, -18);
  scene.add(distantGlow);
}

// =========================
// world generation
// =========================
const platforms = [
  { x: 0, y: 0, z: 0, w: 11, h: 2, d: 11 },
  { x: 16, y: 2, z: -5, w: 10, h: 2, d: 10 },
  { x: -16, y: 3, z: -10, w: 9, h: 2, d: 9 },
  { x: 0, y: 5, z: -18, w: 14, h: 2, d: 11 },
  { x: 0, y: 7, z: -34, w: 12, h: 2, d: 10 },
  { x: -12, y: 8, z: -27, w: 8, h: 2, d: 8 },
  { x: 14, y: 8, z: -27, w: 8, h: 2, d: 8 },
  { x: 0, y: 10, z: -48, w: 16, h: 2, d: 12 }
];

const bridges = [
  { x: 8, y: 1.2, z: -2.5, w: 8, h: 0.8, d: 2.5 },
  { x: -8, y: 2.2, z: -5.5, w: 8, h: 0.8, d: 2.5 },
  { x: 0, y: 4.2, z: -10, w: 2.6, h: 0.8, d: 10 },
  { x: 0, y: 6.2, z: -26, w: 2.6, h: 0.8, d: 8 },
  { x: -6, y: 7.2, z: -30, w: 4.8, h: 0.8, d: 2.2 },
  { x: 6, y: 7.2, z: -30, w: 4.8, h: 0.8, d: 2.2 },
  { x: 0, y: 9.2, z: -41, w: 2.6, h: 0.8, d: 8 }
];

function addGlowOrb(position, color, scale) {
  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(scale, 16, 16),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.18
    })
  );
  glow.position.copy(position);
  scene.add(glow);
  world.decor.push(glow);
}

function createPlatform(definition, material = materials.stone) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(definition.w, definition.h, definition.d),
    material
  );
  mesh.position.set(definition.x, definition.y, definition.z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);

  world.solids.push({
    mesh,
    min: new THREE.Vector3(
      definition.x - definition.w / 2,
      definition.y - definition.h / 2,
      definition.z - definition.d / 2
    ),
    max: new THREE.Vector3(
      definition.x + definition.w / 2,
      definition.y + definition.h / 2,
      definition.z + definition.d / 2
    )
  });

  const trim = new THREE.Mesh(
    new THREE.BoxGeometry(definition.w * 0.96, 0.18, definition.d * 0.96),
    materials.neonCyan
  );
  trim.position.set(definition.x, definition.y + definition.h / 2 + 0.08, definition.z);
  trim.receiveShadow = true;
  scene.add(trim);
  world.decor.push(trim);
}

function createRuins() {
  const skyDome = new THREE.Mesh(
    new THREE.SphereGeometry(140, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0x07111a,
      side: THREE.BackSide
    })
  );
  scene.add(skyDome);

  const starsGeometry = new THREE.BufferGeometry();
  const stars = [];
  for (let i = 0; i < 900; i += 1) {
    const radius = 80 + Math.random() * 45;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    stars.push(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi) * 0.55,
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }
  starsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(stars, 3));
  const starField = new THREE.Points(
    starsGeometry,
    new THREE.PointsMaterial({
      color: 0xb7e6ff,
      size: 0.3,
      transparent: true,
      opacity: 0.85
    })
  );
  scene.add(starField);

  platforms.forEach((platform, index) => {
    createPlatform(platform, index % 2 === 0 ? materials.stone : materials.stoneDark);
    createPillars(platform);
  });

  bridges.forEach((bridge) => createPlatform(bridge, materials.metal));

  const extractionBase = new THREE.Mesh(
    new THREE.CylinderGeometry(3.4, 4.4, 1.2, 32),
    materials.metal
  );
  extractionBase.position.set(0, 11, -48);
  extractionBase.castShadow = true;
  extractionBase.receiveShadow = true;
  scene.add(extractionBase);

  const extractionRing = new THREE.Mesh(
    new THREE.TorusGeometry(3.2, 0.25, 12, 60),
    materials.neonAqua
  );
  extractionRing.rotation.x = Math.PI / 2;
  extractionRing.position.set(0, 11.76, -48);
  scene.add(extractionRing);
  world.decor.push(extractionRing);

  addGlowOrb(new THREE.Vector3(0, 12.4, -48), 0x1fffd5, 2.8);
  addCrystalClusters();
  createParticles();
  createCollectibles();
  createEnemies();
  createHazards();
}

function createPillars(platform) {
  const offsets = [
    [-platform.w * 0.32, 0, -platform.d * 0.32],
    [platform.w * 0.32, 0, -platform.d * 0.32],
    [-platform.w * 0.32, 0, platform.d * 0.32],
    [platform.w * 0.32, 0, platform.d * 0.32]
  ];

  offsets.forEach(([x, , z], index) => {
    if (Math.random() < 0.35) {
      return;
    }

    const height = 2.8 + Math.random() * 5;
    const pillar = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, height, 0.9),
      index % 2 === 0 ? materials.stoneDark : materials.stone
    );
    pillar.position.set(platform.x + x, platform.y + platform.h / 2 + height / 2, platform.z + z);
    pillar.castShadow = true;
    pillar.receiveShadow = true;
    scene.add(pillar);
    world.decor.push(pillar);

    const cap = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.25, 1.2), materials.neonCyan);
    cap.position.set(pillar.position.x, pillar.position.y + height / 2 + 0.08, pillar.position.z);
    scene.add(cap);
    world.decor.push(cap);
  });
}

function addCrystalClusters() {
  const positions = [
    new THREE.Vector3(4, 1.4, 3),
    new THREE.Vector3(-4, 1.4, -2),
    new THREE.Vector3(16, 3.2, -1),
    new THREE.Vector3(-17, 4.2, -9),
    new THREE.Vector3(13, 9.2, -24),
    new THREE.Vector3(-11, 9.2, -26),
    new THREE.Vector3(3, 11.2, -45)
  ];

  positions.forEach((position, index) => {
    for (let i = 0; i < 4; i += 1) {
      const crystal = new THREE.Mesh(
        new THREE.ConeGeometry(0.32 + Math.random() * 0.32, 1.4 + Math.random() * 1.4, 6),
        index % 2 === 0 ? materials.neonAqua : materials.neonCyan
      );
      crystal.position.copy(position);
      crystal.position.x += (Math.random() - 0.5) * 2.4;
      crystal.position.z += (Math.random() - 0.5) * 2.4;
      crystal.position.y += Math.random() * 0.8;
      crystal.rotation.y = Math.random() * Math.PI;
      crystal.castShadow = true;
      scene.add(crystal);
      world.decor.push(crystal);
    }
    addGlowOrb(position.clone().add(new THREE.Vector3(0, 0.8, 0)), 0x58dfff, 1.2);
  });
}

function createParticles() {
  const particleGeometry = new THREE.BufferGeometry();
  const positions = [];
  for (let i = 0; i < 320; i += 1) {
    positions.push(
      (Math.random() - 0.5) * 80,
      Math.random() * 18 + 1,
      -Math.random() * 68 + 8
    );
  }
  particleGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  const particleMaterial = new THREE.PointsMaterial({
    color: 0x98f5ff,
    size: 0.14,
    transparent: true,
    opacity: 0.75
  });
  const points = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(points);
  world.particles.push(points);
}

function createCollectibles() {
  const collectibleSpots = [
    new THREE.Vector3(3, 2, -1),
    new THREE.Vector3(15, 4, -5),
    new THREE.Vector3(-17, 5, -10),
    new THREE.Vector3(14, 10, -27),
    new THREE.Vector3(-11, 10, -27),
    new THREE.Vector3(0, 12, -34)
  ];

  for (let i = 0; i < CONFIG.COLLECTIBLE_COUNT; i += 1) {
    const root = new THREE.Group();
    const shell = new THREE.Mesh(new THREE.OctahedronGeometry(0.8, 0), materials.neonAqua);
    const inner = new THREE.Mesh(new THREE.OctahedronGeometry(0.38, 0), materials.neonCyan);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.08, 10, 40), materials.neonCyan);
    ring.rotation.x = Math.PI / 2;
    root.add(shell, inner, ring);
    root.position.copy(collectibleSpots[i]);
    scene.add(root);

    const light = new THREE.PointLight(0x1fffd5, 8, 10, 2);
    light.position.copy(root.position);
    scene.add(light);

    world.collectibles.push({
      group: root,
      light,
      collected: false,
      baseY: root.position.y,
      bobOffset: Math.random() * Math.PI * 2
    });
  }
}

function createEnemies() {
  const enemySpawns = [
    new THREE.Vector3(0, 6.5, -18),
    new THREE.Vector3(14, 9.5, -27),
    new THREE.Vector3(0, 11.5, -48)
  ];

  enemySpawns.forEach((spawn, index) => {
    const root = new THREE.Group();
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.8, 20, 20), materials.neonDanger);
    const shell = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.16, 8, 30), materials.metal);
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), materials.neonCyan);
    shell.rotation.x = Math.PI / 2;
    eye.position.z = 0.74;
    root.add(body, shell, eye);
    root.position.copy(spawn);
    scene.add(root);

    const light = new THREE.PointLight(index === 2 ? 0xff7aa0 : 0xff346c, 9, 14, 2);
    light.position.copy(spawn);
    scene.add(light);

    world.enemies.push({
      group: root,
      light,
      home: spawn.clone(),
      velocity: new THREE.Vector3(),
      bobOffset: Math.random() * Math.PI * 2,
      radius: 1.4
    });
  });
}

function createHazards() {
  const hazardDefs = [
    { center: new THREE.Vector3(0, 6.2, -26), radius: 2.2, speed: 1.4 },
    { center: new THREE.Vector3(0, 10.2, -41), radius: 2.1, speed: -1.7 }
  ];

  hazardDefs.forEach((definition) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(definition.radius, 0.18, 8, 48),
      materials.neonDanger
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.copy(definition.center);
    scene.add(ring);

    const light = new THREE.PointLight(0xff346c, 7, 8, 2);
    light.position.copy(definition.center);
    scene.add(light);

    world.hazards.push({
      type: "pulseRing",
      mesh: ring,
      light,
      center: definition.center.clone(),
      radius: definition.radius,
      speed: definition.speed,
      activeRadius: definition.radius + 0.55
    });
  });
}

// =========================
// player controller
// =========================
function createPlayer() {
  const root = new THREE.Group();

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.65, 1.5, 8, 16), materials.playerBody);
  torso.castShadow = true;
  torso.receiveShadow = true;
  root.add(torso);

  const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 0), materials.playerAccent);
  core.position.set(0, 0.3, 0);
  root.add(core);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.38, 18, 18), materials.glass);
  head.position.y = 1.15;
  root.add(head);

  const shoulderLeft = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.6, 0.15), materials.playerAccent);
  shoulderLeft.position.set(-0.48, 0.4, 0);
  const shoulderRight = shoulderLeft.clone();
  shoulderRight.position.x = 0.48;
  root.add(shoulderLeft, shoulderRight);

  root.position.copy(player.spawn);
  scene.add(root);
  player.group = root;
}

// =========================
// collisions
// =========================
function resolvePlatformCollisions() {
  player.onGround = false;
  const radius = 0.55;
  const footHeight = player.group.position.y - 1.2;

  for (const solid of world.solids) {
    const withinX =
      player.group.position.x + radius > solid.min.x &&
      player.group.position.x - radius < solid.max.x;
    const withinZ =
      player.group.position.z + radius > solid.min.z &&
      player.group.position.z - radius < solid.max.z;

    if (!withinX || !withinZ) {
      continue;
    }

    const top = solid.max.y;
    const bottom = solid.min.y;
    const playerBottom = footHeight;
    const playerTop = player.group.position.y + 1;

    if (player.velocity.y <= 0 && playerBottom <= top + 0.2 && playerBottom >= top - 1.4) {
      player.group.position.y = top + 1.2;
      player.velocity.y = 0;
      player.onGround = true;
    } else if (player.velocity.y > 0 && playerTop >= bottom && playerTop < bottom + 0.9) {
      player.group.position.y = bottom - 1.02;
      player.velocity.y = Math.min(player.velocity.y, -1);
    }
  }
}

function keepPlayerOnCourse(previousPosition) {
  const radius = 0.58;
  for (const solid of world.solids) {
    const playerBottom = player.group.position.y - 1.15;
    const playerTop = player.group.position.y + 1.05;
    const withinY = playerBottom < solid.max.y - 0.08 && playerTop > solid.min.y + 0.08;
    const overlapsX =
      player.group.position.x + radius > solid.min.x &&
      player.group.position.x - radius < solid.max.x;
    const overlapsZ =
      player.group.position.z + radius > solid.min.z &&
      player.group.position.z - radius < solid.max.z;

    if (!withinY || !overlapsX || !overlapsZ) {
      continue;
    }

    const pushX1 = solid.max.x - (player.group.position.x - radius);
    const pushX2 = (player.group.position.x + radius) - solid.min.x;
    const pushZ1 = solid.max.z - (player.group.position.z - radius);
    const pushZ2 = (player.group.position.z + radius) - solid.min.z;
    const minPush = Math.min(pushX1, pushX2, pushZ1, pushZ2);

    if (minPush === pushX1) {
      player.group.position.x = solid.max.x + radius;
    } else if (minPush === pushX2) {
      player.group.position.x = solid.min.x - radius;
    } else if (minPush === pushZ1) {
      player.group.position.z = solid.max.z + radius;
    } else {
      player.group.position.z = solid.min.z - radius;
    }

    if (!Number.isFinite(player.group.position.x) || !Number.isFinite(player.group.position.z)) {
      player.group.position.copy(previousPosition);
    }
  }
}

// =========================
// gameplay logic
// =========================
function updatePlayer(delta) {
  const previousPosition = player.group.position.clone();

  const inputX = (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0);
  const inputZ = (keys.KeyS ? 1 : 0) - (keys.KeyW ? 1 : 0);
  const moveInput = new THREE.Vector2(inputX, inputZ);
  const sprinting = keys.ShiftLeft || keys.ShiftRight;

  player.moveDirection.set(0, 0, 0);
  if (moveInput.lengthSq() > 0) {
    moveInput.normalize();
    const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
    const right = new THREE.Vector3(forward.z, 0, -forward.x);
    player.moveDirection.addScaledVector(forward, -moveInput.y);
    player.moveDirection.addScaledVector(right, moveInput.x);
    player.moveDirection.normalize();
  }

  const desiredSpeed =
    CONFIG.PLAYER_SPEED * (sprinting ? CONFIG.SPRINT_MULTIPLIER : 1) * (player.onGround ? 1 : CONFIG.AIR_CONTROL);
  const horizontalVelocity = tempVecA.set(player.velocity.x, 0, player.velocity.z);
  const desiredVelocity = tempVecB.copy(player.moveDirection).multiplyScalar(desiredSpeed);
  horizontalVelocity.lerp(desiredVelocity, player.onGround ? 0.14 : 0.06);

  player.velocity.x = horizontalVelocity.x;
  player.velocity.z = horizontalVelocity.z;

  if (player.moveDirection.lengthSq() > 0.01) {
    player.facing.lerp(player.moveDirection, 0.16).normalize();
    player.group.rotation.y = Math.atan2(player.facing.x, player.facing.z);
  }

  player.velocity.y -= CONFIG.GRAVITY * delta;
  player.group.position.addScaledVector(player.velocity, delta);

  resolvePlatformCollisions();
  keepPlayerOnCourse(previousPosition);

  if (player.group.position.y < CONFIG.FALL_LIMIT) {
    applyDamage(CONFIG.MAX_HEALTH, "You vanished into the abyss.");
  }
}

function tryJump() {
  if (!gameStarted || gameEnded) {
    return;
  }
  if (player.onGround) {
    player.velocity.y = CONFIG.JUMP_FORCE;
    player.onGround = false;
  }
}

function updateCamera(delta) {
  const pivot = player.group.position.clone();
  pivot.y += CONFIG.CAMERA_HEIGHT;

  const offset = new THREE.Vector3(
    Math.sin(yaw) * Math.cos(pitch),
    Math.sin(pitch),
    Math.cos(yaw) * Math.cos(pitch)
  ).multiplyScalar(CONFIG.CAMERA_DISTANCE);

  desiredCameraPosition.copy(pivot).add(offset);
  camera.position.lerp(desiredCameraPosition, 1 - Math.exp(-delta * 8));
  lookAtTarget.copy(player.group.position).add(new THREE.Vector3(0, 2, 0));
  camera.lookAt(lookAtTarget);
}

function updateCollectibles(delta) {
  let nearbyCore = null;
  let closestDistance = Infinity;

  for (const core of world.collectibles) {
    if (core.collected) {
      continue;
    }

    core.group.rotation.y += delta * 0.9;
    core.group.position.y = core.baseY + Math.sin(elapsedTime * 2.4 + core.bobOffset) * 0.18;
    core.light.intensity = 6 + Math.sin(elapsedTime * 3 + core.bobOffset) * 2;

    const distance = core.group.position.distanceTo(player.group.position);
    if (distance < closestDistance) {
      closestDistance = distance;
      nearbyCore = core;
    }
  }

  if (nearbyCore && closestDistance < CONFIG.INTERACT_DISTANCE) {
    hintText.textContent = "Press E to collect the nearby energy core.";
    if (keys.KeyE) {
      collectCore(nearbyCore);
      keys.KeyE = false;
    }
  } else if (player.canWin) {
    hintText.textContent = "All cores secured. Reach the extraction platform.";
  } else {
    hintText.textContent = "Approach a core and press E to stabilize it.";
  }
}

function collectCore(core) {
  core.collected = true;
  core.group.visible = false;
  core.light.visible = false;
  player.collected += 1;
  player.canWin = player.collected >= CONFIG.COLLECTIBLE_COUNT;
  objectiveText.textContent = player.canWin
    ? "Return to the extraction platform"
    : "Collect the scattered energy cores";
  updateHud();
}

function updateEnemies(delta) {
  for (const enemy of world.enemies) {
    const toPlayer = tempVecA.copy(player.group.position).sub(enemy.group.position);
    const distance = toPlayer.length();
    const chasing = distance < CONFIG.ENEMY_CHASE_RANGE;

    if (chasing) {
      toPlayer.normalize();
      enemy.velocity.lerp(toPlayer.multiplyScalar(CONFIG.ENEMY_SPEED), 0.04);
    } else {
      const patrol = tempVecB
        .copy(enemy.home)
        .add(
          new THREE.Vector3(
            Math.cos(elapsedTime * 0.7 + enemy.bobOffset) * 2,
            0,
            Math.sin(elapsedTime * 0.7 + enemy.bobOffset) * 2
          )
        )
        .sub(enemy.group.position)
        .multiplyScalar(0.18);
      enemy.velocity.lerp(patrol, 0.04);
    }

    enemy.group.position.addScaledVector(enemy.velocity, delta);
    enemy.group.position.y = enemy.home.y + Math.sin(elapsedTime * 2.4 + enemy.bobOffset) * 0.5;
    enemy.group.rotation.y += delta * 1.6;
    enemy.light.position.copy(enemy.group.position);

    if (distance < enemy.radius + 0.8) {
      applyDamage(CONFIG.ENEMY_DAMAGE * delta, "A sentinel drained your suit.");
      const knockback = tempVecB.copy(player.group.position).sub(enemy.group.position).normalize();
      player.velocity.addScaledVector(knockback, 10 * delta);
    }
  }
}

function updateHazards(delta) {
  for (const hazard of world.hazards) {
    hazard.mesh.rotation.z += delta * hazard.speed;
    hazard.light.intensity = 5 + Math.sin(elapsedTime * 6) * 2;
    const horizontalDistance = new THREE.Vector2(
      player.group.position.x - hazard.center.x,
      player.group.position.z - hazard.center.z
    ).length();
    const verticalDistance = Math.abs(player.group.position.y - hazard.center.y);

    if (horizontalDistance < hazard.activeRadius && verticalDistance < 1.1) {
      applyDamage(CONFIG.HAZARD_DAMAGE * delta, "A pulse ring overloaded your armor.");
    }
  }
}

function applyDamage(amount, reason) {
  if (gameEnded) {
    return;
  }

  const now = elapsedTime;
  if (amount > 2 && now - lastDamageTime < 0.4) {
    return;
  }

  lastDamageTime = now;
  player.health = Math.max(0, player.health - amount);
  hintText.textContent = reason;
  updateHud();

  if (player.health <= 0) {
    endGame(false, reason);
  }
}

function checkWinCondition() {
  if (!player.canWin || gameEnded) {
    return;
  }

  const distanceToPad = new THREE.Vector2(
    player.group.position.x,
    player.group.position.z + 48
  ).length();

  if (player.group.position.y > 10.2 && distanceToPad < CONFIG.WIN_PAD_RADIUS) {
    endGame(true, "The extraction gate stabilized and carried you clear.");
  }
}

function updateHud() {
  const healthPercent = Math.max(0, Math.round(player.health));
  healthFill.style.width = `${player.health}%`;
  healthFill.style.background =
    player.health > 55
      ? "linear-gradient(90deg, #35ffbf 0%, #7cecff 100%)"
      : player.health > 25
        ? "linear-gradient(90deg, #ffd36e 0%, #ff8c4b 100%)"
        : "linear-gradient(90deg, #ff6f75 0%, #ff2e63 100%)";
  healthText.textContent = `${healthPercent}%`;
  coreCounter.textContent = `${player.collected} / ${CONFIG.COLLECTIBLE_COUNT}`;
}

function updateTimer() {
  const total = Math.floor(elapsedTime);
  const minutes = String(Math.floor(total / 60)).padStart(2, "0");
  const seconds = String(total % 60).padStart(2, "0");
  timerText.textContent = `${minutes}:${seconds}`;
}

function endGame(won, reason) {
  gameEnded = true;
  pointerLocked = false;
  document.exitPointerLock?.();
  endScreen.classList.add("visible");
  endBadge.textContent = won ? "Mission Complete" : "Signal Lost";
  endTitle.textContent = won ? "Extraction Successful" : "Run Failed";
  endMessage.textContent = reason;
  endStats.textContent = `Cores recovered: ${player.collected}/${CONFIG.COLLECTIBLE_COUNT}  |  Time: ${timerText.textContent}`;
}

function startGame() {
  startScreen.classList.remove("visible");
  endScreen.classList.remove("visible");
  hud.classList.remove("hidden");
  gameStarted = true;
  gameEnded = false;
  canvas.requestPointerLock?.();
}

function resetGame() {
  elapsedTime = 0;
  lastDamageTime = 0;
  player.health = CONFIG.MAX_HEALTH;
  player.collected = 0;
  player.canWin = false;
  player.velocity.set(0, 0, 0);
  player.group.position.copy(player.spawn);
  player.group.rotation.set(0, 0, 0);
  yaw = 0;
  pitch = -0.2;

  for (const core of world.collectibles) {
    core.collected = false;
    core.group.visible = true;
    core.light.visible = true;
  }

  for (const enemy of world.enemies) {
    enemy.group.position.copy(enemy.home);
    enemy.velocity.set(0, 0, 0);
  }

  hintText.textContent = "Approach a core and press E to stabilize it.";
  objectiveText.textContent = "Collect the scattered energy cores";
  updateHud();
  updateTimer();
  startGame();
}

// =========================
// animation / ambience
// =========================
function animateEnvironment(delta) {
  world.particles.forEach((points, index) => {
    points.rotation.y += delta * (0.02 + index * 0.003);
    points.position.y = Math.sin(elapsedTime * 0.25) * 0.4;
  });

  world.decor.forEach((item, index) => {
    if (item.geometry?.type === "TorusGeometry") {
      item.rotation.z += delta * (0.12 + index * 0.001);
    }
  });

  if (elapsedTime > nextPulseTime) {
    nextPulseTime = elapsedTime + 2.6;
    scene.fog.density = 0.032 + Math.random() * 0.009;
  }
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
  if (!pointerLocked || !gameStarted || gameEnded) {
    return;
  }
  yaw -= event.movementX * CONFIG.MOUSE_SENSITIVITY;
  pitch -= event.movementY * CONFIG.MOUSE_SENSITIVITY;
  pitch = Math.max(-0.95, Math.min(0.45, pitch));
});

document.addEventListener("pointerlockchange", () => {
  pointerLocked = document.pointerLockElement === canvas;
});

canvas.addEventListener("click", () => {
  if (gameStarted && !gameEnded && !pointerLocked) {
    canvas.requestPointerLock?.();
  }
});

startButton.addEventListener("click", resetGame);
restartButton.addEventListener("click", resetGame);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// =========================
// bootstrapping
// =========================
setupLighting();
createPlayer();
createRuins();
updateHud();
updateTimer();

// =========================
// animation loop
// =========================
function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.033);

  if (gameStarted && !gameEnded) {
    elapsedTime += delta;
    updatePlayer(delta);
    updateCamera(delta);
    updateCollectibles(delta);
    updateEnemies(delta);
    updateHazards(delta);
    animateEnvironment(delta);
    checkWinCondition();
    updateTimer();
  } else if (player.group) {
    const idleDelta = Math.min(delta, 0.016);
    player.group.rotation.y += idleDelta * 0.3;
    updateCamera(idleDelta);
    animateEnvironment(idleDelta);
    updateCollectibles(idleDelta);
  }

  renderer.render(scene, camera);
}

animate();
}
