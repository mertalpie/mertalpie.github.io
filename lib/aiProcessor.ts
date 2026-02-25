import type { SummaryResult } from './types';

/** Extract sentences mentioning responsibilities / ownership (client-side AI simulation) */
function extractActionItems(text: string): string[] {
  const items: string[] = [];
  const lines = text.split(/[\n.!?]+/).map((l) => l.trim()).filter(Boolean);

  const ownershipPatterns = [
    /\b(will|should|needs? to|must|going to|can you|please|action:|todo:?)\b/i,
    /\b(assigned?|owner|responsible|follow.?up|deliverable)\b/i,
    /\b(by\s+(?:monday|tuesday|wednesday|thursday|friday|eod|end of day|next week))\b/i,
    /\b(PR\s*#\d+|ticket|jira|task)\b/i,
  ];

  for (const line of lines) {
    if (line.length < 10) continue;
    if (ownershipPatterns.some((p) => p.test(line))) {
      const clean = line.replace(/^[-*•]\s*/, '').trim();
      if (clean.length > 10 && clean.length < 200) {
        items.push(capitalise(clean));
      }
    }
  }

  // Deduplicate and limit
  return Array.from(new Set(items)).slice(0, 6);
}

function extractRisks(text: string): string[] {
  const risks: string[] = [];
  const lower = text.toLowerCase();

  const riskKeywords = [
    'risk', 'blocker', 'issue', 'concern', 'delay', 'behind', 'at risk',
    'critical', 'urgent', 'deadline', 'overdue', 'problem', 'bug', 'P0', 'P1',
  ];

  const lines = text.split(/[\n.!?]+/).map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    const lineLower = line.toLowerCase();
    if (riskKeywords.some((k) => lineLower.includes(k)) && line.length > 15) {
      const clean = line.replace(/^[-*•]\s*/, '').trim();
      if (clean.length < 200) risks.push(capitalise(clean));
    }
  }

  if (risks.length === 0 && lower.includes('deadline')) {
    risks.push('One or more deadlines may be at risk based on current progress.');
  }

  return Array.from(new Set(risks)).slice(0, 4);
}

function extractFollowUps(text: string): string[] {
  const followUps: string[] = [];
  const lines = text.split(/[\n.!?]+/).map((l) => l.trim()).filter(Boolean);

  const followUpPatterns = [
    /\b(schedule|calendar|invite|meeting|sync|call|demo|review)\b/i,
    /\b(share|send|email|slack|notify|update|check.in)\b/i,
    /\b(next\s+steps?|follow.?up|confirm|verify|validate)\b/i,
  ];

  for (const line of lines) {
    if (followUpPatterns.some((p) => p.test(line)) && line.length > 10) {
      const clean = line.replace(/^[-*•]\s*/, '').trim();
      if (clean.length < 200 && clean.length > 10) {
        followUps.push(capitalise(clean));
      }
    }
  }

  return Array.from(new Set(followUps)).slice(0, 5);
}

function generateSummary(text: string): string {
  const words = text.trim().split(/\s+/);
  const wordCount = words.length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 20);

  // Pick first and a middle sentence as the basis for a summary
  const first = sentences[0]?.trim() ?? '';
  const middle = sentences[Math.floor(sentences.length / 2)]?.trim() ?? '';

  if (wordCount < 30) {
    return 'Brief meeting note captured. Key items extracted below.';
  }

  const names = extractNames(text);
  const nameStr = names.length > 0 ? ` Participants included ${names.slice(0, 3).join(', ')}.` : '';

  const topicHint = first.length > 20 ? ` Key topics discussed: ${first.slice(0, 80)}…` : '';
  const contextHint = middle.length > 20 ? ` Additional context: ${middle.slice(0, 80)}…` : '';

  return `Meeting covered ${sentences.length} discussion points across ${Math.ceil(wordCount / 100)} minutes of content.${nameStr}${topicHint}${contextHint}`.trim();
}

function extractNames(text: string): string[] {
  const pattern = /\b([A-Z][a-z]+(?: [A-Z][a-z]+)?)\s*(?:\(.*?\))?:/g;
  const names: string[] = [];
  let match;
  while ((match = pattern.exec(text)) !== null) {
    names.push(match[1]);
  }
  return Array.from(new Set(names));
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Main client-side processor — simulates an AI summarisation API */
export async function processMeetingNotes(text: string): Promise<SummaryResult> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1200 + Math.random() * 800));

  const trimmed = text.trim();
  if (trimmed.length < 20) {
    throw new Error('Please provide at least a few sentences of meeting notes.');
  }

  const summary = generateSummary(trimmed);
  let actionItems = extractActionItems(trimmed);
  let risks = extractRisks(trimmed);
  let followUps = extractFollowUps(trimmed);

  // Ensure we always return at least one item per category for a good demo
  if (actionItems.length === 0) {
    actionItems = ['Review and update project documentation', 'Schedule team alignment session'];
  }
  if (risks.length === 0) {
    risks = ['Monitor timeline closely to avoid scope creep'];
  }
  if (followUps.length === 0) {
    followUps = ['Share meeting notes with all attendees', 'Confirm next meeting time'];
  }

  return { summary, actionItems, risks, followUps };
}
