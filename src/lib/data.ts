import type { Webinar, UserProfile } from '@/ai/flows/recommend-webinars';

export const USER_PROFILE: UserProfile = {
  userId: 'user-123',
  interests: ['AI', 'Marketing'],
  jobTitle: 'Marketing Manager',
  industry: 'Tech',
  skillLevel: 'intermediate',
};

export const ALL_WEBINARS: Webinar[] = [
  {
    webinarId: 'web-001',
    title: 'Introduction to Generative AI',
    description: 'Explore the fundamentals of generative AI and its applications in modern technology.',
    topics: ['AI', 'Tech'],
    industry: 'Tech',
    isFree: true,
    skillLevel: 'beginner',
    registrants: 125,
  },
  {
    webinarId: 'web-002',
    title: 'Advanced SEO Strategies for 2024',
    description: 'Learn cutting-edge SEO techniques to boost your website ranking and organic traffic.',
    topics: ['Marketing'],
    industry: 'Marketing',
    isFree: false,
    skillLevel: 'advanced',
    registrants: 88,
  },
  {
    webinarId: 'web-003',
    title: 'Financial Planning for Startups',
    description: 'A comprehensive guide to managing finances and securing funding for your new venture.',
    topics: ['Finance', 'Business'],
    industry: 'Finance',
    isFree: true,
    skillLevel: 'intermediate',
    registrants: 210,
  },
  {
    webinarId: 'web-004',
    title: 'The Future of Digital Health',
    description: 'Discover how technology is transforming the healthcare industry and patient care.',
    topics: ['Healthcare', 'Tech'],
    industry: 'Healthcare',
    isFree: false,
    skillLevel: 'intermediate',
    registrants: 75,
  },
  {
    webinarId: 'web-005',
    title: 'AI-Powered Content Marketing',
    description: 'Leverage AI tools to create compelling content that engages and converts.',
    topics: ['AI', 'Marketing'],
    industry: 'Marketing',
    isFree: true,
    skillLevel: 'intermediate',
    registrants: 305,
  },
  {
    webinarId: 'web-006',
    title: 'Mastering Public Speaking',
    description: 'Build confidence and deliver powerful presentations that captivate any audience.',
    topics: ['Personal Growth', 'Business'],
    industry: 'General',
    isFree: true,
    skillLevel: 'beginner',
    registrants: 45,
  },
  {
    webinarId: 'web-007',
    title: 'Deep Dive into Neural Networks',
    description: 'An advanced session for developers and data scientists on the architecture of neural networks.',
    topics: ['AI', 'Tech'],
    industry: 'Tech',
    isFree: false,
    skillLevel: 'advanced',
    registrants: 150,
  },
  {
    webinarId: 'web-008',
    title: 'Investment Strategies for a Volatile Market',
    description: 'Navigate market uncertainty with expert advice on portfolio diversification and risk management.',
    topics: ['Finance'],
    industry: 'Finance',
    isFree: false,
    skillLevel: 'advanced',
    registrants: 92,
  },
];

const topics = [...new Set(ALL_WEBINARS.flatMap(w => w.topics))];
const industries = [...new Set(ALL_WEBINARS.map(w => w.industry))];
const skillLevels = ['beginner', 'intermediate', 'advanced'];

export const AVAILABLE_FILTERS = {
  topics,
  industries,
  skillLevels,
};
