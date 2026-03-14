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

// =========================
// generator logic
// =========================
function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function generateIdea() {
  const opener = randomItem(openers);
  const technology = randomItem(technologies);
  const customerType = randomItem(customerTypes);
  const problem = randomItem(problems);
  const industry = randomItem(industries);

  return `${opener} ${technology} platform that helps ${customerType} ${problem} in the ${industry} industry.`;
}

function updateIdea() {
  const nextIdea = generateIdea();

  ideaText.classList.remove("is-animating");
  void ideaText.offsetWidth;
  ideaText.textContent = nextIdea;
  ideaText.classList.add("is-animating");

  shareButton.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `${nextIdea} — generated on mertalp.me`
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
