export interface SummaryResult {
  summary: string;
  actionItems: string[];
  risks: string[];
  followUps: string[];
}

export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface PricingPlan {
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  highlighted: boolean;
  cta: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface UseCase {
  title: string;
  description: string;
  benefits: string[];
  exampleOutput: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
}
