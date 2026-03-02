import type { NavItem, PricingPlan, FAQ, UseCase, Feature, Testimonial } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Demo', href: '#demo' },
  { label: 'Data Panel', href: '#datapanel' },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: 'Starter',
    description: 'Perfect for individuals and small teams getting started.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      '5 meetings per month',
      'Basic AI summaries',
      'Action item extraction',
      'Email export',
      '7-day history',
    ],
    highlighted: false,
    cta: 'Get Started Free',
  },
  {
    name: 'Pro',
    description: 'Everything you need to run effective meetings at scale.',
    monthlyPrice: 29,
    yearlyPrice: 23,
    features: [
      'Unlimited meetings',
      'Advanced AI summaries',
      'Action item tracking',
      'Risk & follow-up detection',
      'Slack & Notion integration',
      'Priority support',
      '1-year history',
    ],
    highlighted: true,
    cta: 'Start Free Trial',
  },
  {
    name: 'Enterprise',
    description: 'Advanced features for large organizations with custom needs.',
    monthlyPrice: 99,
    yearlyPrice: 79,
    features: [
      'Everything in Pro',
      'Custom AI models',
      'SSO & SAML',
      'Advanced analytics',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee',
      'Unlimited history',
    ],
    highlighted: false,
    cta: 'Contact Sales',
  },
];

export const FAQ_DATA: FAQ[] = [
  {
    question: 'How does PulseMind AI process my meetings?',
    answer:
      'PulseMind AI uses state-of-the-art speech recognition and large language models to transcribe your meeting audio in real time, then applies our proprietary summarization engine to extract key points, action items, risks, and follow-ups.',
  },
  {
    question: 'Is my meeting data secure and private?',
    answer:
      'Absolutely. All data is encrypted in transit and at rest using AES-256 encryption. We are SOC 2 Type II certified and GDPR compliant. Your meeting data is never used to train our models without explicit consent.',
  },
  {
    question: 'Which meeting platforms are supported?',
    answer:
      'PulseMind AI integrates seamlessly with Zoom, Google Meet, Microsoft Teams, and Webex. You can also upload audio or video files directly for processing.',
  },
  {
    question: 'How accurate are the AI summaries?',
    answer:
      'Our models achieve over 95% accuracy on action item extraction and produce human-quality summaries. Accuracy improves over time as the model learns your team\'s terminology and meeting patterns.',
  },
  {
    question: 'Can I customize the output format?',
    answer:
      'Yes! Pro and Enterprise users can create custom templates to define exactly how summaries, action items, and reports are formatted. You can also brand exports with your company logo.',
  },
  {
    question: 'What integrations are available?',
    answer:
      'We offer native integrations with Slack, Notion, Jira, Asana, HubSpot, Salesforce, and more. Our REST API and webhooks allow you to connect PulseMind AI to any tool in your workflow.',
  },
  {
    question: 'Is there a free trial for Pro?',
    answer:
      'Yes! All new users get a 14-day free trial of our Pro plan — no credit card required. After the trial, you can choose to upgrade or continue with the free Starter plan.',
  },
];

export const USE_CASES: UseCase[] = [
  {
    title: 'Product Teams',
    description:
      'Never lose track of sprint decisions, feature discussions, or stakeholder feedback again.',
    benefits: [
      'Auto-capture feature requirements from discovery calls',
      'Track decisions and their rationale over time',
      'Generate sprint summaries and roadmap updates',
      'Link action items directly to Jira tickets',
    ],
    exampleOutput:
      'Sprint planning summary: 3 new features approved, 2 bugs escalated to P0, next demo scheduled for Friday 3pm.',
  },
  {
    title: 'Sales Calls',
    description:
      'Focus on building rapport while PulseMind captures every buying signal and commitment.',
    benefits: [
      'Extract pain points and objections automatically',
      'Track competitor mentions and pricing discussions',
      'Auto-log call notes to Salesforce or HubSpot',
      'Generate personalized follow-up email drafts',
    ],
    exampleOutput:
      'Deal stage: Evaluation. Budget confirmed: $50k. Key concern: integration timeline. Next step: technical demo with CTO.',
  },
  {
    title: 'Board Meetings',
    description:
      'Produce board-ready minutes and action registries from executive meetings instantly.',
    benefits: [
      'Structured minutes with vote records',
      'Action item ownership and deadlines',
      'Confidential data handling with enterprise security',
      'PDF export with your brand template',
    ],
    exampleOutput:
      'Board resolution: Q2 budget approved at $4.2M. Action: CFO to present updated forecast by March 15. Risk flagged: supply chain delays.',
  },
  {
    title: 'Engineering Standups',
    description:
      'Keep async and sync standups aligned with AI-powered blockers and progress tracking.',
    benefits: [
      'Identify blockers across team standups',
      'Track WIP and velocity trends over time',
      'Generate Slack digests for the entire team',
      'Spot at-risk deliverables before they slip',
    ],
    exampleOutput:
      "Today's blockers: 2 engineers waiting on design sign-off, 1 PR pending review. On track for milestone: 4/6 stories complete.",
  },
];

export const FEATURES: Feature[] = [
  {
    title: 'Real-Time Transcription',
    description:
      'Industry-leading speech-to-text with speaker diarization identifies who said what with 95%+ accuracy across accents and languages.',
    icon: 'mic',
  },
  {
    title: 'AI-Powered Summaries',
    description:
      'Our LLM condenses hours of discussion into concise, structured summaries that capture decisions, context, and nuance.',
    icon: 'brain',
  },
  {
    title: 'Action Item Extraction',
    description:
      'Automatically identifies commitments, assigns ownership, and sets deadlines — then pushes them to your project management tool.',
    icon: 'check-square',
  },
  {
    title: 'Risk Detection',
    description:
      'Surface hidden risks and blockers mentioned in passing. PulseMind flags them so nothing falls through the cracks.',
    icon: 'shield-alert',
  },
  {
    title: 'Seamless Integrations',
    description:
      'Connect to Slack, Notion, Jira, Salesforce, and 50+ tools. Your meeting insights flow directly into your existing workflow.',
    icon: 'plug',
  },
  {
    title: 'Enterprise Security',
    description:
      'SOC 2 Type II certified, GDPR compliant, and HIPAA ready. Your data is encrypted end-to-end and never used for model training.',
    icon: 'lock',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Sarah Chen',
    role: 'VP of Product',
    company: 'NovaTech',
    content:
      'PulseMind has completely transformed how our product team operates. We went from spending 2 hours writing meeting notes to having perfect summaries in seconds. Our velocity increased by 30% in the first month.',
    avatar: 'SC',
  },
  {
    name: 'Marcus Williams',
    role: 'Enterprise Account Executive',
    company: 'ScaleForce',
    content:
      'I close 40% more deals since using PulseMind. It captures every detail from discovery calls so I can write perfectly personalized follow-ups. My manager thinks I have a photographic memory now.',
    avatar: 'MW',
  },
  {
    name: 'Dr. Priya Nair',
    role: 'CTO',
    company: 'MedBridge',
    content:
      'Security was our biggest concern, but PulseMind\'s enterprise tier gave us the compliance certifications we needed. The AI accuracy for technical discussions is remarkable — it even understands our domain vocabulary.',
    avatar: 'PN',
  },
];

export const SAMPLE_MEETING_NOTES = `Weekly Product Sync — February 24, 2026
Attendees: Sarah (PM), Marcus (Engineering Lead), Priya (Design), Tom (QA)

Sarah: Let's kick off. First topic is the dashboard redesign. Priya, where are we?

Priya: We finished the high-fidelity mockups last night. Main change is we're moving the analytics panel to the left sidebar. I'll share the Figma link after this call.

Marcus: That affects the component architecture. I need to refactor the layout system. Tom, can you update the test suite once Marcus pushes the branch?

Tom: Sure, I'll block time Thursday afternoon for that.

Sarah: Great. Next up — the API rate limiting bug that's been affecting enterprise customers. Marcus?

Marcus: We identified the root cause yesterday. It's a race condition in the token refresh logic. Fix is ready, just needs code review. Can someone review PR #847 by end of day?

Sarah: I'll assign it to Raj. Let's flag this as P0 since it's blocking two enterprise accounts.

Marcus: Agreed. We should also consider adding monitoring alerts for this type of error going forward.

Sarah: Good call. Marcus, can you file a ticket for that?

Marcus: Will do.

Sarah: Last item — Q1 roadmap review. We need to present to the board on March 5th. I'll draft the slides this week. Anyone have concerns about current commitments?

Tom: The mobile app beta is at risk. We have 3 open P1 bugs and the deadline is March 1st.

Sarah: Let's schedule a focused bug bash session. I'll send a calendar invite for tomorrow 2pm.`;
