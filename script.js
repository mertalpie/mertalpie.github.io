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

function updateIdea() {
  const nextIdea = generateIdeaData();

  ideaText.classList.remove("is-animating");
  void ideaText.offsetWidth;
  ideaText.textContent = nextIdea.sentence;
  ideaText.classList.add("is-animating");

  technologyChip.textContent = nextIdea.technology;
  customerChip.textContent = nextIdea.customerType;
  problemChip.textContent = nextIdea.problem;
  industryChip.textContent = nextIdea.industry;
  productAngleText.textContent = nextIdea.productAngle;
  whyNowText.textContent = nextIdea.whyNow;
  goToMarketText.textContent = nextIdea.goToMarket;
  monetizationText.textContent = nextIdea.monetization;
  complexityText.textContent = nextIdea.complexity;
  audienceText.textContent = nextIdea.audience;

  shareButton.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `${nextIdea.sentence} — generated on mertalp.me`
  )}`;

  statusText.textContent = "";
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

// =========================
// init
// =========================
updateIdea();
