// Business Idea Generator for mertalp.me
// Simple, static, and fast: vanilla JavaScript only.

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
// DOM references
// =========================
const ideaText = document.getElementById("ideaText");
const generateButton = document.getElementById("generateButton");
const copyButton = document.getElementById("copyButton");
const shareButton = document.getElementById("shareButton");
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
const generatorTab = document.getElementById("generatorTab");
const historyTab = document.getElementById("historyTab");
const generatorPanel = document.getElementById("generatorPanel");
const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");
const historyEmptyState = document.getElementById("historyEmptyState");
const clearHistoryButton = document.getElementById("clearHistoryButton");

const STORAGE_KEYS = {
  history: "mertalp_business_idea_history_v1",
  current: "mertalp_business_idea_current_v1"
};

const MAX_HISTORY_ITEMS = 24;

// =========================
// generator logic
// =========================
function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

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

function generateIdeaData() {
  const opener = randomItem(openers);
  const technology = randomItem(technologies);
  const customerType = randomItem(customerTypes);
  const problem = randomItem(problems);
  const industry = randomItem(industries);

  return {
    opener,
    technology,
    customerType,
    problem,
    industry,
    sentence: `${opener} ${technology} platform that helps ${customerType} ${problem} in the ${industry} industry.`,
    productAngle: `A ${technology.toLowerCase()}-driven product aimed at ${customerType} with a direct focus on ${problem}.`,
    whyNow: `${customerType.charAt(0).toUpperCase() + customerType.slice(1)} in ${industry} are actively looking for faster ways to ${problem}.`,
    goToMarket: `Launch with a narrow ${industry} niche, lead with ROI messaging, and validate demand through direct outreach.`,
    monetization: pickMonetization(technology, customerType),
    complexity: pickComplexity(technology, problem),
    audience: pickAudience(customerType, industry)
  };
}

function applyIdeaToUi(idea) {
  ideaText.classList.remove("is-animating");
  void ideaText.offsetWidth;
  ideaText.textContent = idea.sentence;
  ideaText.classList.add("is-animating");

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

  shareButton.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `${idea.sentence} — generated on mertalp.me`
  )}`;
}

function getStoredHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEYS.history) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveCurrentIdea(idea) {
  localStorage.setItem(STORAGE_KEYS.current, JSON.stringify(idea));
}

function storeIdeaInHistory(idea) {
  const history = getStoredHistory();
  const entry = {
    ...idea,
    id: idea.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: idea.createdAt || new Date().toISOString()
  };
  const nextHistory = [entry, ...history].slice(0, MAX_HISTORY_ITEMS);
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(nextHistory));
  renderHistory(nextHistory);
  saveCurrentIdea(entry);
  return entry;
}

function formatHistoryTime(isoString) {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function renderHistory(history = getStoredHistory()) {
  historyList.innerHTML = "";
  historyEmptyState.hidden = history.length > 0;

  history.forEach((idea) => {
    const item = document.createElement("article");
    item.className = "history-item";
    item.innerHTML = `
      <div class="history-item-header">
        <strong>${idea.technology} for ${idea.customerType}</strong>
        <span class="history-item-time">${formatHistoryTime(idea.createdAt)}</span>
      </div>
      <p class="history-item-text">${idea.sentence}</p>
      <div class="history-meta">
        <span class="history-meta-chip">${idea.problem}</span>
        <span class="history-meta-chip">${idea.industry}</span>
        <span class="history-meta-chip">${idea.monetization}</span>
      </div>
    `;
    historyList.appendChild(item);
  });
}

function getStoredCurrentIdea() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEYS.current) || "null");
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (error) {
    return null;
  }
}

function updateIdea() {
  const nextIdea = storeIdeaInHistory(generateIdeaData());
  applyIdeaToUi(nextIdea);

  statusText.textContent = "";
}

function switchTab(tabName) {
  const showHistory = tabName === "history";
  generatorTab.classList.toggle("is-active", !showHistory);
  historyTab.classList.toggle("is-active", showHistory);
  generatorTab.setAttribute("aria-selected", String(!showHistory));
  historyTab.setAttribute("aria-selected", String(showHistory));
  generatorPanel.hidden = showHistory;
  historyPanel.hidden = !showHistory;
  generatorPanel.classList.toggle("is-active", !showHistory);
  historyPanel.classList.toggle("is-active", showHistory);
}

// =========================
// actions
// =========================
async function copyIdea() {
  const text = ideaText.textContent.trim();

  try {
    await navigator.clipboard.writeText(text);
    statusText.textContent = "Idea copied to clipboard.";
  } catch (error) {
    // Fallback for older browsers or restricted clipboard permissions.
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    statusText.textContent = "Idea copied to clipboard.";
  }
}

function handleKeyboardShortcut(event) {
  const target = event.target;
  const isTypingField =
    target instanceof HTMLElement &&
    (target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable);

  if (isTypingField) {
    return;
  }

  if (event.code === "Space") {
    event.preventDefault();
    updateIdea();
  }
}

// =========================
// event bindings
// =========================
generateButton.addEventListener("click", updateIdea);
copyButton.addEventListener("click", copyIdea);
window.addEventListener("keydown", handleKeyboardShortcut);
generatorTab.addEventListener("click", () => switchTab("generator"));
historyTab.addEventListener("click", () => switchTab("history"));
clearHistoryButton.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEYS.history);
  renderHistory([]);
  statusText.textContent = "Idea history cleared.";
});

// =========================
// init
// =========================
renderHistory();

const currentIdea = getStoredCurrentIdea();
if (currentIdea) {
  applyIdeaToUi(currentIdea);
} else {
  const firstIdea = storeIdeaInHistory(generateIdeaData());
  applyIdeaToUi(firstIdea);
}
