// Business Idea Generator for mertalp.me
// Lightweight product-style generator built with vanilla JavaScript only.

// =========================
// word banks
// =========================
const technologies = [
  "AI",
  "automation",
  "SaaS",
  "marketplace",
  "blockchain",
  "mobile app",
  "API platform",
  "data analytics",
  "workflow software",
  "B2B platform",
  "no-code tool",
  "subscription service"
];

const customerTypes = [
  "small businesses",
  "freelancers",
  "remote teams",
  "parents",
  "creators",
  "restaurants",
  "startups",
  "dentists",
  "real estate agents",
  "online stores",
  "coaches",
  "HR teams"
];

const problems = [
  "manage inventory",
  "generate leads",
  "schedule appointments",
  "automate workflows",
  "reduce costs",
  "improve productivity",
  "track customer communication",
  "handle invoicing",
  "improve team collaboration",
  "analyze performance",
  "speed up onboarding",
  "increase retention"
];

const industries = [
  "healthcare",
  "education",
  "real estate",
  "finance",
  "logistics",
  "ecommerce",
  "travel",
  "hospitality",
  "legal",
  "fitness",
  "construction",
  "marketing"
];

const openers = [
  "A",
  "A modern",
  "A simple",
  "A powerful",
  "A niche",
  "A scalable"
];

// =========================
// storage keys
// =========================
const STORAGE_KEYS = {
  current: "mertalp_business_idea_current_v2",
  history: "mertalp_business_idea_history_v2",
  favorites: "mertalp_business_idea_favorites_v2",
  engagement: "mertalp_business_idea_engagement_v2",
  theme: "mertalp_theme",
  totalGenerated: "mertalp_idea_count_v2"
};

const MAX_HISTORY_ITEMS = 30;
const STACK_COUNT = 5;

// =========================
// DOM references
// =========================
const ideaCard = document.getElementById("mainIdeaCard");
const generatedCount = document.getElementById("generatedCount");
const themeToggle = document.getElementById("themeToggle");
const themeToggleText = document.getElementById("themeToggleText");

const technologyFilter = document.getElementById("technologyFilter");
const industryFilter = document.getElementById("industryFilter");
const customerFilter = document.getElementById("customerFilter");
const resetFiltersButton = document.getElementById("resetFiltersButton");

const ideaText = document.getElementById("ideaText");
const generateButton = document.getElementById("generateButton");
const generateFiveButton = document.getElementById("generateFiveButton");
const saveButton = document.getElementById("saveButton");
const copyButton = document.getElementById("copyButton");
const shareButton = document.getElementById("shareButton");
const shareCardButton = document.getElementById("shareCardButton");
const refineButton = document.getElementById("refineButton");
const statusText = document.getElementById("statusText");

const technologyChip = document.getElementById("technologyChip");
const customerChip = document.getElementById("customerChip");
const problemChip = document.getElementById("problemChip");
const industryChip = document.getElementById("industryChip");
const productAngleText = document.getElementById("productAngleText");
const whyNowText = document.getElementById("whyNowText");
const goToMarketText = document.getElementById("goToMarketText");
const monetizationText = document.getElementById("monetizationText");
const complexityText = document.getElementById("complexityText");
const audienceText = document.getElementById("audienceText");
const potentialScoreText = document.getElementById("potentialScoreText");
const potentialScoreBadge = document.getElementById("potentialScoreBadge");
const potentialScoreFill = document.getElementById("potentialScoreFill");

const generatorTab = document.getElementById("generatorTab");
const historyTab = document.getElementById("historyTab");
const favoritesTab = document.getElementById("favoritesTab");
const trendingTab = document.getElementById("trendingTab");
const generatorPanel = document.getElementById("generatorPanel");
const historyPanel = document.getElementById("historyPanel");
const favoritesPanel = document.getElementById("favoritesPanel");
const trendingPanel = document.getElementById("trendingPanel");

const clearHistoryButton = document.getElementById("clearHistoryButton");
const historyEmptyState = document.getElementById("historyEmptyState");
const historyList = document.getElementById("historyList");
const favoritesEmptyState = document.getElementById("favoritesEmptyState");
const favoritesList = document.getElementById("favoritesList");
const trendingEmptyState = document.getElementById("trendingEmptyState");
const trendingList = document.getElementById("trendingList");

const stackSection = document.getElementById("stackSection");
const stackList = document.getElementById("stackList");

const modalOverlay = document.getElementById("modalOverlay");
const modalEyebrow = document.getElementById("modalEyebrow");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const closeModalButton = document.getElementById("closeModalButton");

// =========================
// app state
// =========================
const state = {
  currentIdea: null,
  stackIdeas: [],
  filters: {
    technology: "",
    industry: "",
    customerType: ""
  },
  activeTab: "generator",
  theme: document.documentElement.dataset.theme || "light"
};

// =========================
// helpers
// =========================
function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function incrementStoredNumber(key, amount = 1) {
  const current = Number(localStorage.getItem(key) || "0");
  const next = current + amount;
  localStorage.setItem(key, String(next));
  return next;
}

function setStatus(message) {
  statusText.textContent = message;
}

function ideaKey(idea) {
  return idea.sentence;
}

function filterItems(items, selectedValue) {
  return selectedValue ? items.filter((item) => item === selectedValue) : items;
}

function formatDate(isoString) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(isoString));
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// =========================
// business logic
// =========================
function pickMonetization(technology, customerType) {
  if (technology === "marketplace") {
    return "Take rate";
  }
  if (technology === "mobile app" || customerType === "parents" || customerType === "creators") {
    return "Freemium";
  }
  if (technology === "API platform" || technology === "data analytics") {
    return "Usage-based";
  }
  return "Subscription";
}

function pickComplexity(technology, problem) {
  const highComplexityTech = ["AI", "blockchain", "data analytics", "API platform"];
  const highComplexityProblem = ["analyze performance", "automate workflows", "track customer communication"];

  if (highComplexityTech.includes(technology) || highComplexityProblem.includes(problem)) {
    return "High";
  }
  if (technology === "marketplace" || technology === "mobile app" || problem === "generate leads") {
    return "Medium";
  }
  return "Low";
}

function pickAudience(customerType, industry) {
  if (customerType === "small businesses" || customerType === "startups") {
    return "Broad SMB";
  }
  if (industry === "healthcare" || industry === "finance" || industry === "legal") {
    return "Professional niche";
  }
  if (customerType === "parents" || customerType === "creators") {
    return "Consumer-led";
  }
  return "Focused B2B";
}

function calculatePotentialScore(monetization, complexity, audience) {
  const monetizationScores = {
    Subscription: 3.6,
    "Usage-based": 3.3,
    "Take rate": 3,
    Freemium: 2.5
  };

  const complexityScores = {
    Low: 3.3,
    Medium: 2.7,
    High: 1.9
  };

  const audienceScores = {
    "Focused B2B": 3.2,
    "Professional niche": 3.1,
    "Broad SMB": 2.9,
    "Consumer-led": 2.3
  };

  const total =
    (monetizationScores[monetization] || 2.8) +
    (complexityScores[complexity] || 2.5) +
    (audienceScores[audience] || 2.5);

  return Math.min(10, Number(total.toFixed(1)));
}

function getPotentialBadge(score) {
  if (score >= 8) {
    return { text: "Strong", className: "" };
  }
  if (score >= 6.5) {
    return { text: "Promising", className: "is-medium" };
  }
  return { text: "Speculative", className: "is-low" };
}

function generateIdeaData() {
  const opener = randomItem(openers);
  const technology = randomItem(filterItems(technologies, state.filters.technology));
  const customerType = randomItem(filterItems(customerTypes, state.filters.customerType));
  const problem = randomItem(problems);
  const industry = randomItem(filterItems(industries, state.filters.industry));
  const monetization = pickMonetization(technology, customerType);
  const complexity = pickComplexity(technology, problem);
  const audience = pickAudience(customerType, industry);
  const potentialScore = calculatePotentialScore(monetization, complexity, audience);

  return {
    sentence: `${opener} ${technology} platform that helps ${customerType} ${problem} in the ${industry} industry.`,
    technology,
    customerType,
    problem,
    industry,
    monetization,
    complexity,
    audience,
    potentialScore,
    productAngle: `A ${technology.toLowerCase()}-driven product aimed at ${customerType} with a clear focus on ${problem}.`,
    whyNow: `${capitalize(customerType)} in ${industry} are under pressure to move faster and reduce manual work around ${problem}.`,
    goToMarket: `Launch with a focused ${industry} niche, prove ROI early, and use founder-led outreach to validate demand.`,
    createdAt: new Date().toISOString()
  };
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function buildRefinement(idea) {
  return {
    productConcept: `${idea.sentence} The core product would provide a clean dashboard, guided workflows, and lightweight automation so ${idea.customerType} can get value quickly without heavy setup.`,
    targetMarket: `Primary target: ${idea.customerType} operating in ${idea.industry}. Start with a narrow segment that feels the pain of ${idea.problem} most intensely, then expand into adjacent categories once messaging is proven.`,
    monetizationModel: `${idea.monetization} fits this idea because the value can be tied to repeat usage and measurable operational outcomes. A simple entry plan plus a premium tier would create a clear upgrade path.`,
    mvpIdea: `An MVP could focus on one core workflow: helping ${idea.customerType} ${idea.problem} with a compact interface, basic analytics, and one or two integrations. Keep the first version opinionated and narrow.`,
    goToMarketStrategy: `Position the product around speed, clarity, and ROI. Reach early users through direct outreach, founder-led demos, niche communities, and content tailored to ${idea.industry} pain points.`
  };
}

// =========================
// persistence
// =========================
function getHistory() {
  return getStorage(STORAGE_KEYS.history, []);
}

function saveHistory(history) {
  setStorage(STORAGE_KEYS.history, history);
}

function addIdeaToHistory(idea) {
  const history = getHistory();
  const entry = {
    ...idea,
    historyId: `${Date.now()}-${Math.random().toString(16).slice(2)}`
  };
  const next = [entry, ...history].slice(0, MAX_HISTORY_ITEMS);
  saveHistory(next);
  renderHistory();
  return entry;
}

function getFavorites() {
  return getStorage(STORAGE_KEYS.favorites, []);
}

function saveFavorites(favorites) {
  setStorage(STORAGE_KEYS.favorites, favorites);
}

function getEngagementMap() {
  return getStorage(STORAGE_KEYS.engagement, {});
}

function saveEngagementMap(map) {
  setStorage(STORAGE_KEYS.engagement, map);
}

function incrementEngagement(idea, type) {
  const map = getEngagementMap();
  const key = ideaKey(idea);
  const current = map[key] || {
    idea,
    copied: 0,
    shared: 0,
    favorited: 0
  };

  current[type] += 1;
  current.idea = idea;
  map[key] = current;
  saveEngagementMap(map);
  renderTrending();
}

function isFavorite(idea) {
  return getFavorites().some((item) => ideaKey(item) === ideaKey(idea));
}

function toggleFavorite(idea) {
  const favorites = getFavorites();
  const exists = favorites.some((item) => ideaKey(item) === ideaKey(idea));

  if (exists) {
    const next = favorites.filter((item) => ideaKey(item) !== ideaKey(idea));
    saveFavorites(next);
    setStatus("Removed from favorites.");
  } else {
    saveFavorites([{ ...idea }, ...favorites]);
    incrementEngagement(idea, "favorited");
    setStatus("Saved to favorites.");
  }

  updateSaveButtons();
  renderFavorites();
  renderTrending();
}

// =========================
// rendering
// =========================
function updateGeneratedCount() {
  generatedCount.textContent = Number(localStorage.getItem(STORAGE_KEYS.totalGenerated) || "0").toLocaleString("en");
}

function populateFilterOptions(select, items, placeholder) {
  select.innerHTML = `<option value="">${placeholder}</option>`;
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });
}

function updateSaveButtons() {
  const currentIsFavorite = state.currentIdea ? isFavorite(state.currentIdea) : false;
  saveButton.classList.toggle("is-saved", currentIsFavorite);
  saveButton.innerHTML = currentIsFavorite
    ? '<span class="button-icon" aria-hidden="true">★</span>Saved'
    : '<span class="button-icon" aria-hidden="true">☆</span>Save idea';

  const stackButtons = stackList.querySelectorAll("[data-action='save-stack']");
  stackButtons.forEach((button) => {
    const sentence = button.getAttribute("data-sentence");
    const idea = state.stackIdeas.find((item) => item.sentence === sentence);
    const saved = idea ? isFavorite(idea) : false;
    button.classList.toggle("is-saved", saved);
    button.innerHTML = saved
      ? '<span class="button-icon" aria-hidden="true">★</span>Saved'
      : '<span class="button-icon" aria-hidden="true">☆</span>Save';
  });
}

function applyIdeaToUi(idea, animate = true) {
  state.currentIdea = idea;
  setStorage(STORAGE_KEYS.current, idea);

  if (animate) {
    ideaCard.classList.remove("is-updating");
    void ideaCard.offsetWidth;
    ideaCard.classList.add("is-updating");
    ideaText.classList.remove("is-animating");
    void ideaText.offsetWidth;
    ideaText.classList.add("is-animating");
  }

  ideaText.textContent = idea.sentence;
  technologyChip.textContent = idea.technology;
  customerChip.textContent = idea.customerType;
  problemChip.textContent = idea.problem;
  industryChip.textContent = idea.industry;
  productAngleText.textContent = idea.productAngle;
  whyNowText.textContent = idea.whyNow;
  goToMarketText.textContent = idea.goToMarket;
  monetizationText.textContent = idea.monetization;
  complexityText.textContent = idea.complexity;
  audienceText.textContent = idea.audience;
  potentialScoreText.textContent = `${idea.potentialScore.toFixed(1)} / 10`;
  potentialScoreFill.style.width = `${idea.potentialScore * 10}%`;

  const badge = getPotentialBadge(idea.potentialScore);
  potentialScoreBadge.textContent = badge.text;
  potentialScoreBadge.className = `score-badge ${badge.className}`.trim();

  shareButton.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `${idea.sentence} — generated on mertalp.me ${window.location.href}`
  )}`;

  updateSaveButtons();
}

function renderHistory() {
  const history = getHistory();
  historyList.innerHTML = "";
  historyEmptyState.hidden = history.length > 0;

  history.forEach((idea) => {
    const item = document.createElement("article");
    item.className = "history-item";
    item.innerHTML = `
      <div class="history-item-header">
        <strong>${escapeHtml(idea.technology)} for ${escapeHtml(idea.customerType)}</strong>
        <span class="history-item-time">${formatDate(idea.createdAt)}</span>
      </div>
      <p class="history-item-text">${escapeHtml(idea.sentence)}</p>
      <div class="history-meta">
        <span class="history-meta-chip">${escapeHtml(idea.problem)}</span>
        <span class="history-meta-chip">${escapeHtml(idea.industry)}</span>
        <span class="history-meta-chip">${escapeHtml(idea.monetization)}</span>
      </div>
    `;
    historyList.appendChild(item);
  });
}

function renderFavorites() {
  const favorites = getFavorites();
  favoritesList.innerHTML = "";
  favoritesEmptyState.hidden = favorites.length > 0;

  favorites.forEach((idea) => {
    const item = document.createElement("article");
    item.className = "history-item";
    item.innerHTML = `
      <div class="history-item-header">
        <strong>${escapeHtml(idea.technology)} for ${escapeHtml(idea.customerType)}</strong>
        <button class="button button-ghost button-small" type="button" data-action="remove-favorite" data-sentence="${escapeHtml(idea.sentence)}">
          <span class="button-icon" aria-hidden="true">×</span>
          Remove
        </button>
      </div>
      <p class="history-item-text">${escapeHtml(idea.sentence)}</p>
      <div class="history-meta">
        <span class="history-meta-chip">${escapeHtml(idea.technology)}</span>
        <span class="history-meta-chip">${escapeHtml(idea.customerType)}</span>
        <span class="history-meta-chip">${escapeHtml(idea.problem)}</span>
        <span class="history-meta-chip">${escapeHtml(idea.industry)}</span>
        <span class="history-meta-chip">${escapeHtml(idea.monetization)}</span>
      </div>
    `;
    favoritesList.appendChild(item);
  });
}

function renderTrending() {
  const map = Object.values(getEngagementMap())
    .map((entry) => ({
      ...entry,
      score: entry.copied + entry.shared * 2 + entry.favorited * 3
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  trendingList.innerHTML = "";
  trendingEmptyState.hidden = map.length > 0;

  map.forEach((entry) => {
    const item = document.createElement("article");
    item.className = "history-item";
    item.innerHTML = `
      <div class="history-item-header">
        <strong>${escapeHtml(entry.idea.sentence)}</strong>
        <span class="trend-score">Score ${entry.score}</span>
      </div>
      <div class="trend-metrics">
        <span>Copied: ${entry.copied}</span>
        <span>Shared: ${entry.shared}</span>
        <span>Favorited: ${entry.favorited}</span>
      </div>
    `;
    trendingList.appendChild(item);
  });
}

function renderStackIdeas() {
  stackList.innerHTML = "";
  stackSection.hidden = state.stackIdeas.length === 0;

  state.stackIdeas.forEach((idea) => {
    const card = document.createElement("article");
    card.className = "stack-card";
    card.innerHTML = `
      <div class="stack-card-header">
        <strong>${escapeHtml(idea.technology)} for ${escapeHtml(idea.customerType)}</strong>
        <span class="trend-score">${idea.potentialScore.toFixed(1)} / 10</span>
      </div>
      <p class="stack-card-sentence">${escapeHtml(idea.sentence)}</p>
      <div class="stack-meta">
        <span class="tag">${escapeHtml(idea.problem)}</span>
        <span class="tag">${escapeHtml(idea.industry)}</span>
        <span class="tag">${escapeHtml(idea.monetization)}</span>
      </div>
      <div class="stack-actions">
        <button class="button button-secondary button-small" type="button" data-action="copy-stack" data-sentence="${escapeHtml(idea.sentence)}">
          <span class="button-icon" aria-hidden="true">⧉</span>
          Copy
        </button>
        <button class="button button-secondary button-small" type="button" data-action="save-stack" data-sentence="${escapeHtml(idea.sentence)}">
          <span class="button-icon" aria-hidden="true">☆</span>
          Save
        </button>
        <button class="button button-secondary button-small" type="button" data-action="refine-stack" data-sentence="${escapeHtml(idea.sentence)}">
          <span class="button-icon" aria-hidden="true">✎</span>
          Refine
        </button>
      </div>
    `;
    stackList.appendChild(card);
  });

  updateSaveButtons();
}

function renderThemeLabel() {
  themeToggleText.textContent = state.theme === "dark" ? "Light mode" : "Dark mode";
}

function switchTab(name) {
  state.activeTab = name;
  const tabs = [
    { button: generatorTab, panel: generatorPanel, name: "generator" },
    { button: historyTab, panel: historyPanel, name: "history" },
    { button: favoritesTab, panel: favoritesPanel, name: "favorites" },
    { button: trendingTab, panel: trendingPanel, name: "trending" }
  ];

  tabs.forEach((tab) => {
    const active = tab.name === name;
    tab.button.classList.toggle("is-active", active);
    tab.button.setAttribute("aria-selected", String(active));
    tab.panel.hidden = !active;
  });
}

// =========================
// generation flows
// =========================
function createAndDisplayIdea() {
  const idea = generateIdeaData();
  const historyIdea = addIdeaToHistory(idea);
  applyIdeaToUi(historyIdea);
  incrementStoredNumber(STORAGE_KEYS.totalGenerated, 1);
  updateGeneratedCount();
  setStatus("New idea generated.");
}

function createIdeaStack() {
  const seen = new Set();
  state.stackIdeas = [];

  let attempts = 0;
  while (state.stackIdeas.length < STACK_COUNT && attempts < 30) {
    const idea = generateIdeaData();
    attempts += 1;
    if (!seen.has(idea.sentence)) {
      seen.add(idea.sentence);
      state.stackIdeas.push(idea);
    }
  }

  incrementStoredNumber(STORAGE_KEYS.totalGenerated, state.stackIdeas.length);
  updateGeneratedCount();
  renderStackIdeas();
  setStatus("Generated a stack of ideas.");
}

// =========================
// copy / share
// =========================
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }
}

async function copyCurrentIdea() {
  if (!state.currentIdea) {
    return;
  }
  await copyText(state.currentIdea.sentence);
  incrementEngagement(state.currentIdea, "copied");
  setStatus("Idea copied to clipboard.");
}

// =========================
// shareable card
// =========================
function wrapText(context, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    if (context.measureText(nextLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = nextLine;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function buildShareCardCanvas(idea) {
  const shareCanvas = document.createElement("canvas");
  shareCanvas.width = 1400;
  shareCanvas.height = 900;
  shareCanvas.className = "share-canvas";
  const shareCtx = shareCanvas.getContext("2d");

  const background = shareCtx.createLinearGradient(0, 0, 1400, 900);
  background.addColorStop(0, "#0f172f");
  background.addColorStop(0.55, "#11244a");
  background.addColorStop(1, "#1a1453");
  shareCtx.fillStyle = background;
  shareCtx.fillRect(0, 0, 1400, 900);

  shareCtx.fillStyle = "rgba(110, 168, 255, 0.14)";
  shareCtx.beginPath();
  shareCtx.arc(1150, 180, 220, 0, Math.PI * 2);
  shareCtx.fill();

  shareCtx.fillStyle = "rgba(91, 224, 200, 0.16)";
  shareCtx.beginPath();
  shareCtx.arc(240, 740, 240, 0, Math.PI * 2);
  shareCtx.fill();

  shareCtx.fillStyle = "rgba(255, 255, 255, 0.9)";
  shareCtx.font = "700 34px Inter, Arial, sans-serif";
  shareCtx.fillText("Business Idea Generator", 90, 100);

  shareCtx.fillStyle = "rgba(255, 255, 255, 0.64)";
  shareCtx.font = "500 22px Inter, Arial, sans-serif";
  shareCtx.fillText("mertalp.me", 90, 136);

  shareCtx.fillStyle = "#ffffff";
  shareCtx.font = "700 58px Inter, Arial, sans-serif";
  const lines = wrapText(shareCtx, idea.sentence, 1040);
  lines.forEach((line, index) => {
    shareCtx.fillText(line, 90, 250 + index * 76);
  });

  const infoCards = [
    { label: "Technology", value: idea.technology },
    { label: "Customer", value: idea.customerType },
    { label: "Problem", value: idea.problem },
    { label: "Industry", value: idea.industry }
  ];

  infoCards.forEach((card, index) => {
    const x = 90 + (index % 2) * 360;
    const y = 520 + Math.floor(index / 2) * 140;
    shareCtx.fillStyle = "rgba(255, 255, 255, 0.08)";
    roundRect(shareCtx, x, y, 310, 104, 26);
    shareCtx.fill();
    shareCtx.fillStyle = "rgba(255, 255, 255, 0.6)";
    shareCtx.font = "600 20px Inter, Arial, sans-serif";
    shareCtx.fillText(card.label, x + 26, y + 34);
    shareCtx.fillStyle = "#ffffff";
    shareCtx.font = "700 28px Inter, Arial, sans-serif";
    const wrapped = wrapText(shareCtx, card.value, 250);
    wrapped.slice(0, 2).forEach((line, lineIndex) => {
      shareCtx.fillText(line, x + 26, y + 68 + lineIndex * 28);
    });
  });

  shareCtx.fillStyle = "rgba(255, 255, 255, 0.08)";
  roundRect(shareCtx, 840, 520, 470, 244, 30);
  shareCtx.fill();
  shareCtx.fillStyle = "rgba(255, 255, 255, 0.64)";
  shareCtx.font = "600 20px Inter, Arial, sans-serif";
  shareCtx.fillText("Business potential", 870, 560);
  shareCtx.fillStyle = "#ffffff";
  shareCtx.font = "700 46px Inter, Arial, sans-serif";
  shareCtx.fillText(`${idea.potentialScore.toFixed(1)} / 10`, 870, 620);

  shareCtx.fillStyle = "rgba(255, 255, 255, 0.82)";
  shareCtx.font = "600 24px Inter, Arial, sans-serif";
  shareCtx.fillText(`${idea.monetization} • ${idea.audience}`, 870, 680);
  shareCtx.fillText(`${idea.complexity} complexity`, 870, 722);

  return shareCanvas;
}

function roundRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}

function openShareCardModal(idea) {
  const canvas = buildShareCardCanvas(idea);
  const dataUrl = canvas.toDataURL("image/png");

  modalEyebrow.textContent = "Share card";
  modalTitle.textContent = "Shareable PNG card";
  modalBody.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "share-card-wrap";
  wrapper.appendChild(canvas);

  const actionRow = document.createElement("div");
  actionRow.className = "modal-actions";
  actionRow.innerHTML = `
    <a class="button button-primary" href="${dataUrl}" download="business-idea-card.png">
      <span class="button-icon" aria-hidden="true">↓</span>
      Download PNG
    </a>
    <button id="modalShareLinkButton" class="button button-secondary" type="button">
      <span class="button-icon" aria-hidden="true">↗</span>
      Share link
    </button>
  `;
  wrapper.appendChild(actionRow);
  modalBody.appendChild(wrapper);
  openModal();

  document.getElementById("modalShareLinkButton").addEventListener("click", async () => {
    const shareText = `${idea.sentence} — generated on mertalp.me ${window.location.href}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Business Idea Generator",
          text: shareText,
          url: window.location.href
        });
      } catch (error) {}
    } else {
      await copyText(shareText);
      setStatus("Share link copied.");
    }
    incrementEngagement(idea, "shared");
  });
}

// =========================
// modal / refinement
// =========================
function openModal() {
  modalOverlay.hidden = false;
}

function closeModal() {
  modalOverlay.hidden = true;
  modalBody.innerHTML = "";
}

function openRefineModal(idea) {
  const refinement = buildRefinement(idea);
  modalEyebrow.textContent = "Local refinement";
  modalTitle.textContent = "Expanded startup concept";
  modalBody.innerHTML = `
    <section class="modal-section">
      <h3>Product concept</h3>
      <p>${escapeHtml(refinement.productConcept)}</p>
    </section>
    <section class="modal-section">
      <h3>Target market</h3>
      <p>${escapeHtml(refinement.targetMarket)}</p>
    </section>
    <section class="modal-section">
      <h3>Monetization model</h3>
      <p>${escapeHtml(refinement.monetizationModel)}</p>
    </section>
    <section class="modal-section">
      <h3>MVP idea</h3>
      <p>${escapeHtml(refinement.mvpIdea)}</p>
    </section>
    <section class="modal-section">
      <h3>Go-to-market strategy</h3>
      <p>${escapeHtml(refinement.goToMarketStrategy)}</p>
    </section>
  `;
  openModal();
}

// =========================
// tabs and lists
// =========================
function findStackIdea(sentence) {
  return state.stackIdeas.find((idea) => idea.sentence === sentence);
}

function handleStackClick(event) {
  const button = event.target.closest("[data-action]");
  if (!button) {
    return;
  }

  const sentence = button.getAttribute("data-sentence");
  const idea = findStackIdea(sentence);
  if (!idea) {
    return;
  }

  const action = button.getAttribute("data-action");

  if (action === "copy-stack") {
    copyText(idea.sentence).then(() => {
      incrementEngagement(idea, "copied");
      setStatus("Stack idea copied.");
    });
  } else if (action === "save-stack") {
    toggleFavorite(idea);
  } else if (action === "refine-stack") {
    openRefineModal(idea);
  }
}

function handleFavoritesClick(event) {
  const button = event.target.closest("[data-action='remove-favorite']");
  if (!button) {
    return;
  }

  const sentence = button.getAttribute("data-sentence");
  const favorites = getFavorites().filter((item) => item.sentence !== sentence);
  saveFavorites(favorites);
  renderFavorites();
  updateSaveButtons();
  setStatus("Removed from favorites.");
}

// =========================
// theme
// =========================
function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(STORAGE_KEYS.theme, theme);
  renderThemeLabel();
}

function toggleTheme() {
  applyTheme(state.theme === "dark" ? "light" : "dark");
}

// =========================
// filters
// =========================
function syncFiltersFromUi() {
  state.filters.technology = technologyFilter.value;
  state.filters.industry = industryFilter.value;
  state.filters.customerType = customerFilter.value;
}

function resetFilters() {
  technologyFilter.value = "";
  industryFilter.value = "";
  customerFilter.value = "";
  syncFiltersFromUi();
  setStatus("Filters reset.");
}

// =========================
// events
// =========================
generateButton.addEventListener("click", createAndDisplayIdea);
generateFiveButton.addEventListener("click", createIdeaStack);
saveButton.addEventListener("click", () => {
  if (state.currentIdea) {
    toggleFavorite(state.currentIdea);
  }
});
copyButton.addEventListener("click", () => {
  copyCurrentIdea();
});
shareButton.addEventListener("click", () => {
  if (state.currentIdea) {
    incrementEngagement(state.currentIdea, "shared");
  }
});
shareCardButton.addEventListener("click", () => {
  if (state.currentIdea) {
    openShareCardModal(state.currentIdea);
  }
});
refineButton.addEventListener("click", () => {
  if (state.currentIdea) {
    openRefineModal(state.currentIdea);
  }
});

generatorTab.addEventListener("click", () => switchTab("generator"));
historyTab.addEventListener("click", () => switchTab("history"));
favoritesTab.addEventListener("click", () => switchTab("favorites"));
trendingTab.addEventListener("click", () => switchTab("trending"));

clearHistoryButton.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEYS.history);
  renderHistory();
  setStatus("History cleared.");
});

technologyFilter.addEventListener("change", () => {
  syncFiltersFromUi();
  setStatus("Technology filter updated.");
});
industryFilter.addEventListener("change", () => {
  syncFiltersFromUi();
  setStatus("Industry filter updated.");
});
customerFilter.addEventListener("change", () => {
  syncFiltersFromUi();
  setStatus("Customer filter updated.");
});
resetFiltersButton.addEventListener("click", resetFilters);

themeToggle.addEventListener("click", toggleTheme);

window.addEventListener("keydown", (event) => {
  const target = event.target;
  const isTypingField =
    target instanceof HTMLElement &&
    (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);

  if (isTypingField) {
    return;
  }

  if (event.code === "Space") {
    event.preventDefault();
    createAndDisplayIdea();
  }

  if (event.code === "Escape" && !modalOverlay.hidden) {
    closeModal();
  }
});

stackList.addEventListener("click", handleStackClick);
favoritesList.addEventListener("click", handleFavoritesClick);

modalOverlay.addEventListener("click", (event) => {
  if (event.target === modalOverlay) {
    closeModal();
  }
});
closeModalButton.addEventListener("click", closeModal);

// =========================
// init
// =========================
populateFilterOptions(technologyFilter, technologies, "All technologies");
populateFilterOptions(industryFilter, industries, "All industries");
populateFilterOptions(customerFilter, customerTypes, "All customers");
renderThemeLabel();
renderHistory();
renderFavorites();
renderTrending();
updateGeneratedCount();

const storedCurrent = getStorage(STORAGE_KEYS.current, null);
if (storedCurrent) {
  applyIdeaToUi(storedCurrent, false);
} else {
  createAndDisplayIdea();
}
