import type { SummaryResult } from './types';

export async function simulateSummarize(text: string): Promise<SummaryResult> {
  if (text.trim().length < 20) {
    throw new Error('Please provide more text (at least 20 characters)');
  }

  await new Promise((resolve) => setTimeout(resolve, 1500));

  const lower = text.toLowerCase();

  // Extract action items
  const actionPatterns = [
    /(?:will|i'll|we'll|i will|we will)\s+([^.!?\n]{10,80})/gi,
    /(?:needs? to|need to)\s+([^.!?\n]{10,80})/gi,
    /(?:can you|could you|please)\s+([^.!?\n]{10,80})/gi,
    /(?:schedule|review|update|send|fix|file|share|create|prepare|draft)\s+([^.!?\n]{10,80})/gi,
  ];

  const rawActions: string[] = [];
  for (const pattern of actionPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const action = match[1].trim().replace(/[,;]$/, '');
      if (action.length > 8 && rawActions.length < 10) {
        rawActions.push(action.charAt(0).toUpperCase() + action.slice(1));
      }
    }
  }

  // Deduplicate and limit
  const seen = new Set<string>();
  const actionItems: string[] = [];
  for (const a of rawActions) {
    const key = a.slice(0, 30).toLowerCase();
    if (!seen.has(key) && actionItems.length < 6) {
      seen.add(key);
      actionItems.push(a);
    }
  }

  // Fallbacks
  if (actionItems.length < 3) {
    actionItems.push(
      'Follow up on open items from this meeting',
      'Share meeting notes with all attendees',
      'Schedule next sync to review progress',
    );
  }

  // Extract risks
  const riskPatterns = [
    /(?:risk|concern|issue|problem|blocker|blocking|delay|delayed|at risk)\s*[:\-–]?\s*([^.!?\n]{10,100})/gi,
    /(?:P0|P1|critical|urgent|deadline)\s*[:\-–]?\s*([^.!?\n]{10,100})/gi,
    /(?:bug|regression|broken|failing|outage)\s+([^.!?\n]{10,80})/gi,
  ];

  const rawRisks: string[] = [];
  for (const pattern of riskPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const risk = match[1].trim().replace(/[,;]$/, '');
      if (risk.length > 8 && rawRisks.length < 8) {
        rawRisks.push(risk.charAt(0).toUpperCase() + risk.slice(1));
      }
    }
  }

  const seenR = new Set<string>();
  const risks: string[] = [];
  for (const r of rawRisks) {
    const key = r.slice(0, 30).toLowerCase();
    if (!seenR.has(key) && risks.length < 4) {
      seenR.add(key);
      risks.push(r);
    }
  }

  if (risks.length < 2) {
    risks.push(
      'Timeline pressure may impact delivery quality',
      'Dependencies on external teams not yet confirmed',
    );
  }

  // Extract follow-ups
  const followUpPatterns = [
    /(?:next|follow.?up|follow up|following up)\s+([^.!?\n]{10,100})/gi,
    /(?:schedule|send invite|share|send)\s+([^.!?\n]{10,80})/gi,
    /(?:by|before|on|this|next)\s+(?:monday|tuesday|wednesday|thursday|friday|week|month|eod|tomorrow|march|april|may|june|january|february)\s*[^.!?\n]{0,60}/gi,
  ];

  const rawFollowUps: string[] = [];
  for (const pattern of followUpPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const fu = (match[1] ?? match[0]).trim().replace(/[,;]$/, '');
      if (fu.length > 8 && rawFollowUps.length < 8) {
        rawFollowUps.push(fu.charAt(0).toUpperCase() + fu.slice(1));
      }
    }
  }

  const seenF = new Set<string>();
  const followUps: string[] = [];
  for (const f of rawFollowUps) {
    const key = f.slice(0, 30).toLowerCase();
    if (!seenF.has(key) && followUps.length < 4) {
      seenF.add(key);
      followUps.push(f);
    }
  }

  if (followUps.length < 2) {
    followUps.push(
      'Circulate meeting notes and action items to all attendees',
      'Check in on progress before next scheduled meeting',
    );
  }

  // Build summary
  const topics: string[] = [];
  if (lower.includes('sprint') || lower.includes('product')) topics.push('product planning');
  if (lower.includes('sales') || lower.includes('deal') || lower.includes('budget')) topics.push('sales updates');
  if (lower.includes('design') || lower.includes('figma') || lower.includes('mockup')) topics.push('design progress');
  if (lower.includes('bug') || lower.includes('fix') || lower.includes('issue')) topics.push('technical issues');
  if (lower.includes('roadmap') || lower.includes('board') || lower.includes('q1') || lower.includes('q2')) topics.push('roadmap review');
  if (lower.includes('standup') || lower.includes('blocker')) topics.push('team blockers');

  const topicStr = topics.length > 0 ? topics.join(', ') : 'key team priorities';
  const actionCount = actionItems.length;
  const riskCount = risks.length;

  const summary = `This meeting covered ${topicStr}, with ${actionCount} action items assigned across team members. ${riskCount > 1 ? `${riskCount} risks were flagged that require prompt attention.` : 'One risk was flagged requiring attention.'} Key decisions were made and next steps have been clearly defined with ownership.`;

  return { summary, actionItems, risks, followUps };
}
