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
const specialEmptyState = document.getElementById("specialEmptyState");
const specialList = document.getElementById("specialList");

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

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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

function truncateWords(text, count) {
  const words = text.split(" ");
  if (words.length <= count) {
    return text;
  }
  return `${words.slice(0, count).join(" ")}…`;
}

// =========================
// shiny text animation
// =========================
function parseBooleanData(value) {
  return value === "true";
}

function createShinyTextInstance(element) {
  const instance = {
    element,
    disabled: parseBooleanData(element.dataset.disabled),
    speed: Math.max(Number(element.dataset.speed || "2"), 0.1),
    delay: Math.max(Number(element.dataset.delay || "0"), 0),
    spread: Number(element.dataset.spread || "120"),
    direction: element.dataset.direction === "right" ? -1 : 1,
    yoyo: parseBooleanData(element.dataset.yoyo),
    pauseOnHover: parseBooleanData(element.dataset.pauseOnHover),
    paused: false,
    progress: 0,
    elapsed: 0,
    lastTime: null
  };

  element.style.setProperty("--shiny-angle", `${instance.spread}deg`);

  if (element.dataset.color) {
    element.style.setProperty("--shiny-base-color", element.dataset.color);
  }

  if (element.dataset.shineColor) {
    element.style.setProperty("--shiny-shine-color", element.dataset.shineColor);
  }

  element.style.setProperty("--shiny-position", `${150 - instance.progress * 2}%`);

  if (instance.pauseOnHover) {
    element.addEventListener("mouseenter", () => {
      instance.paused = true;
      instance.lastTime = null;
    });

    element.addEventListener("mouseleave", () => {
      instance.paused = false;
      instance.lastTime = null;
    });
  }

  return instance;
}

function initializeShinyText() {
  const elements = Array.from(document.querySelectorAll(".shiny-text"));
  if (!elements.length) {
    return;
  }

  const instances = elements.map(createShinyTextInstance);
  if (prefersReducedMotion.matches) {
    instances.forEach((instance) => {
      instance.element.style.setProperty("--shiny-position", "50%");
    });
    return;
  }

  function step(timestamp) {
    instances.forEach((instance) => {
      if (instance.disabled || instance.paused) {
        instance.lastTime = null;
        return;
      }

      if (instance.lastTime === null) {
        instance.lastTime = timestamp;
        return;
      }

      const deltaTime = timestamp - instance.lastTime;
      instance.lastTime = timestamp;
      instance.elapsed += deltaTime;

      const animationDuration = instance.speed * 1000;
      const delayDuration = instance.delay * 1000;
      let progress = 0;

      if (instance.yoyo) {
        const cycleDuration = animationDuration + delayDuration;
        const fullCycle = cycleDuration * 2;
        const cycleTime = instance.elapsed % fullCycle;

        if (cycleTime < animationDuration) {
          progress = (cycleTime / animationDuration) * 100;
        } else if (cycleTime < cycleDuration) {
          progress = 100;
        } else if (cycleTime < cycleDuration + animationDuration) {
          const reverseTime = cycleTime - cycleDuration;
          progress = 100 - (reverseTime / animationDuration) * 100;
        } else {
          progress = 0;
        }
      } else {
        const cycleDuration = animationDuration + delayDuration;
        const cycleTime = instance.elapsed % cycleDuration;

        if (cycleTime < animationDuration) {
          progress = (cycleTime / animationDuration) * 100;
        } else {
          progress = 100;
        }
      }

      instance.progress = instance.direction === 1 ? progress : 100 - progress;
      instance.element.style.setProperty(
        "--shiny-position",
        `${150 - instance.progress * 2}%`
      );
    });

    window.requestAnimationFrame(step);
  }

  window.requestAnimationFrame(step);
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
  renderSpecialIdeas();
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
  renderSpecialIdeas();
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

function getSpecialIdeas() {
  const favorites = getFavorites();
  const history = getHistory();
  const engagementMap = getEngagementMap();
  const candidates = [];
  const seen = new Set();

  function addCandidate(idea, source, engagement = null) {
    if (!idea || seen.has(ideaKey(idea))) {
      return;
    }

    seen.add(ideaKey(idea));
    const engagementScore = engagement
      ? engagement.copied + engagement.shared * 2 + engagement.favorited * 3
      : 0;
    const favoriteBonus = source === "favorite" ? 2.2 : 0;
    const recencyBonus = idea.createdAt
      ? Math.max(0, 1.5 - (Date.now() - new Date(idea.createdAt).getTime()) / 86400000)
      : 0;

    candidates.push({
      ...idea,
      source,
      engagementScore,
      specialScore: Number((idea.potentialScore + engagementScore * 0.45 + favoriteBonus + recencyBonus).toFixed(2))
    });
  }

  favorites.forEach((idea) => addCandidate(idea, "favorite", engagementMap[ideaKey(idea)]));
  Object.values(engagementMap)
    .sort((a, b) => (b.copied + b.shared * 2 + b.favorited * 3) - (a.copied + a.shared * 2 + a.favorited * 3))
    .forEach((entry) => addCandidate(entry.idea, "trending", entry));
  history
    .filter((idea) => idea.potentialScore >= 7.6)
    .forEach((idea) => addCandidate(idea, "high-potential", engagementMap[ideaKey(idea)]));

  if (state.currentIdea) {
    addCandidate(state.currentIdea, "current", engagementMap[ideaKey(state.currentIdea)]);
  }

  return candidates
    .sort((a, b) => b.specialScore - a.specialScore)
    .slice(0, 6);
}

function getSpecialLabel(source, score) {
  if (source === "favorite") {
    return "Saved favorite";
  }
  if (source === "trending") {
    return "Trending pick";
  }
  if (score >= 8.6) {
    return "Top potential";
  }
  return "Special pick";
}

function getFolderColor(idea) {
  if (idea.potentialScore >= 8.5) {
    return "#5227FF";
  }
  if (idea.audience === "Professional niche") {
    return "#0F8CFF";
  }
  if (idea.monetization === "Take rate") {
    return "#FF7A18";
  }
  if (idea.monetization === "Freemium") {
    return "#12B886";
  }
  return "#6C63FF";
}

function renderFolderPaper(text) {
  return `
    <span class="folder-paper__line"></span>
    <span class="folder-paper__text">${escapeHtml(text)}</span>
    <span class="folder-paper__line is-short"></span>
  `;
}

function renderSpecialIdeas() {
  const ideas = getSpecialIdeas();
  specialList.innerHTML = "";
  specialEmptyState.hidden = ideas.length > 0;

  ideas.forEach((idea, index) => {
    const saved = isFavorite(idea);
    const paperSnippets = [
      truncateWords(idea.sentence, 4),
      truncateWords(`${idea.problem} ${idea.industry}`, 4),
      truncateWords(`${idea.technology} ${idea.customerType}`, 4)
    ];
    const article = document.createElement("article");
    article.className = "special-folder-card";
    article.dataset.sentence = idea.sentence;
    article.innerHTML = `
      <div class="special-folder-top">
        <div>
          <span class="special-folder-kicker">${escapeHtml(getSpecialLabel(idea.source, idea.specialScore))}</span>
          <h4 class="special-folder-title">${escapeHtml(idea.technology)} for ${escapeHtml(idea.customerType)}</h4>
        </div>
        <span class="trend-score">${idea.potentialScore.toFixed(1)} / 10</span>
      </div>
      <button
        class="folder-shell"
        type="button"
        data-action="toggle-special"
        data-sentence="${escapeHtml(idea.sentence)}"
        aria-expanded="false"
      >
        <div class="folder-stage">
          <div class="folder-ui" style="--folder-color:${getFolderColor(idea)};--folder-back-color:${getFolderColor(idea)}CC">
            <div class="folder-ui__body">
              <div class="folder-paper" data-sentence="${escapeHtml(idea.sentence)}">${renderFolderPaper(paperSnippets[0])}</div>
              <div class="folder-paper" data-sentence="${escapeHtml(idea.sentence)}">${renderFolderPaper(paperSnippets[1])}</div>
              <div class="folder-paper" data-sentence="${escapeHtml(idea.sentence)}">${renderFolderPaper(paperSnippets[2])}</div>
              <div class="folder-front"></div>
              <div class="folder-front right"></div>
            </div>
          </div>
        </div>
      </button>
      <div class="special-folder-body" hidden>
        <p class="special-folder-sentence">${escapeHtml(idea.sentence)}</p>
        <div class="special-folder-meta">
          <span class="history-meta-chip">${escapeHtml(idea.problem)}</span>
          <span class="history-meta-chip">${escapeHtml(idea.industry)}</span>
          <span class="history-meta-chip">${escapeHtml(idea.monetization)}</span>
          <span class="history-meta-chip">Score ${idea.specialScore.toFixed(1)}</span>
        </div>
        <div class="special-folder-actions">
          <button class="button button-secondary button-small" type="button" data-action="load-special" data-sentence="${escapeHtml(idea.sentence)}">
            <span class="button-icon" aria-hidden="true">↺</span>
            Load
          </button>
          <button class="button button-secondary button-small" type="button" data-action="copy-special" data-sentence="${escapeHtml(idea.sentence)}">
            <span class="button-icon" aria-hidden="true">⧉</span>
            Copy
          </button>
          <button class="button button-secondary button-small" type="button" data-action="save-special" data-sentence="${escapeHtml(idea.sentence)}">
            <span class="button-icon" aria-hidden="true">${saved ? "★" : "☆"}</span>
            ${saved ? "Saved" : "Save"}
          </button>
          <button class="button button-secondary button-small" type="button" data-action="refine-special" data-sentence="${escapeHtml(idea.sentence)}">
            <span class="button-icon" aria-hidden="true">✎</span>
            Refine
          </button>
        </div>
      </div>
    `;

    if (index === 0) {
      article.classList.add("is-open");
      article.querySelector(".special-folder-body").hidden = false;
      article.querySelector(".folder-shell").setAttribute("aria-expanded", "true");
    }

    specialList.appendChild(article);
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
  renderSpecialIdeas();
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
  renderSpecialIdeas();
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

function openSpecialPaperModal(idea) {
  const refinement = buildRefinement(idea);
  modalEyebrow.textContent = "Idea preview";
  modalTitle.textContent = "Special business idea";
  modalBody.innerHTML = `
    <div class="paper-preview-wrap">
      <article class="paper-preview-card">
        <span class="paper-preview-kicker">${escapeHtml(idea.technology)} for ${escapeHtml(idea.customerType)}</span>
        <h3 class="paper-preview-title">${escapeHtml(idea.sentence)}</h3>
        <div class="paper-preview-meta">
          <span class="history-meta-chip">${escapeHtml(idea.problem)}</span>
          <span class="history-meta-chip">${escapeHtml(idea.industry)}</span>
          <span class="history-meta-chip">${escapeHtml(idea.monetization)}</span>
          <span class="history-meta-chip">${idea.potentialScore.toFixed(1)} / 10</span>
        </div>
      </article>

      <div class="modal-actions">
        <button id="paperLearnMoreButton" class="button button-primary" type="button">
          <span class="button-icon" aria-hidden="true">✦</span>
          Learn more
        </button>
      </div>

      <section id="paperLearnMorePanel" class="paper-learn-more" hidden>
        <div class="modal-section">
          <h3>Why this idea stands out</h3>
          <p>${escapeHtml(refinement.productConcept)}</p>
        </div>
        <div class="modal-section">
          <h3>Target market</h3>
          <p>${escapeHtml(refinement.targetMarket)}</p>
        </div>
        <div class="modal-section">
          <h3>Go-to-market angle</h3>
          <p>${escapeHtml(refinement.goToMarketStrategy)}</p>
        </div>
      </section>
    </div>
  `;
  openModal();

  const learnMoreButton = document.getElementById("paperLearnMoreButton");
  const learnMorePanel = document.getElementById("paperLearnMorePanel");

  learnMoreButton.addEventListener("click", () => {
    const isHidden = learnMorePanel.hidden;
    learnMorePanel.hidden = !isHidden;
    learnMoreButton.innerHTML = isHidden
      ? '<span class="button-icon" aria-hidden="true">−</span>Hide details'
      : '<span class="button-icon" aria-hidden="true">✦</span>Learn more';
  });
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
  renderSpecialIdeas();
  setStatus("Removed from favorites.");
}

function findIdeaAcrossSources(sentence) {
  return [
    state.currentIdea,
    ...state.stackIdeas,
    ...getFavorites(),
    ...getHistory(),
    ...Object.values(getEngagementMap()).map((entry) => entry.idea)
  ].find((idea) => idea && idea.sentence === sentence);
}

function handleSpecialClick(event) {
  const paper = event.target.closest(".folder-paper");
  if (paper) {
    const sentence = paper.getAttribute("data-sentence");
    const idea = findIdeaAcrossSources(sentence);
    const card = paper.closest(".special-folder-card");
    if (idea && card && card.classList.contains("is-open")) {
      openSpecialPaperModal(idea);
      return;
    }
  }

  const target = event.target.closest("[data-action]");
  if (!target) {
    return;
  }

  const sentence = target.getAttribute("data-sentence");
  const idea = findIdeaAcrossSources(sentence);
  if (!idea) {
    return;
  }

  const action = target.getAttribute("data-action");

  if (action === "toggle-special") {
    const card = target.closest(".special-folder-card");
    const body = card.querySelector(".special-folder-body");
    const nextOpen = !card.classList.contains("is-open");

    specialList.querySelectorAll(".special-folder-card").forEach((item) => {
      item.classList.remove("is-open");
      item.querySelector(".special-folder-body").hidden = true;
      item.querySelector("[data-action='toggle-special']").setAttribute("aria-expanded", "false");
    });

    card.classList.toggle("is-open", nextOpen);
    body.hidden = !nextOpen;
    target.setAttribute("aria-expanded", String(nextOpen));
    return;
  }

  if (action === "load-special") {
    applyIdeaToUi(idea);
    switchTab("generator");
    setStatus("Loaded special idea into the generator.");
    return;
  }

  if (action === "copy-special") {
    copyText(idea.sentence);
    incrementEngagement(idea, "copied");
    setStatus("Special idea copied.");
    return;
  }

  if (action === "save-special") {
    toggleFavorite(idea);
    return;
  }

  if (action === "refine-special") {
    openRefineModal(idea);
  }
}

function handleSpecialPaperPointerMove(event) {
  const paper = event.target.closest(".folder-paper");
  if (!paper) {
    return;
  }

  const card = paper.closest(".special-folder-card");
  if (!card || !card.classList.contains("is-open")) {
    return;
  }

  const rect = paper.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const offsetX = (event.clientX - centerX) * 0.15;
  const offsetY = (event.clientY - centerY) * 0.15;
  paper.style.setProperty("--magnet-x", `${offsetX}px`);
  paper.style.setProperty("--magnet-y", `${offsetY}px`);
}

function handleSpecialPaperPointerLeave(event) {
  const paper = event.target.closest(".folder-paper");
  if (!paper) {
    return;
  }

  paper.style.setProperty("--magnet-x", "0px");
  paper.style.setProperty("--magnet-y", "0px");
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
  renderSpecialIdeas();
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
specialList.addEventListener("click", handleSpecialClick);
specialList.addEventListener("pointermove", handleSpecialPaperPointerMove);
specialList.addEventListener("pointerleave", handleSpecialPaperPointerLeave, true);

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
renderSpecialIdeas();
updateGeneratedCount();
initializeShinyText();

const storedCurrent = getStorage(STORAGE_KEYS.current, null);
if (storedCurrent) {
  applyIdeaToUi(storedCurrent, false);
  renderSpecialIdeas();
} else {
  createAndDisplayIdea();
}
