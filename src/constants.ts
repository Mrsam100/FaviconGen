
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { JournalArticle } from './types';

export const BRAND_NAME = 'FaviconGen';
export const COMPANY_NAME = 'FaviconGen';
export const DESIGN_STUDIO = 'FaviconGen Studio';

export const FAVICON_SIZES = [16, 32, 48, 64, 128, 256];
export const APPLE_SIZES = [120, 152, 167, 180];
export const ANDROID_SIZES = [192, 512];
export const MS_SIZES = [144, 150, 310];

export const CATEGORIES = [
  { name: "Favicons", icon: "🌐" },
  { name: "Apple Touch", icon: "🍎" },
  { name: "Android/PWA", icon: "🤖" },
  { name: "Microsoft", icon: "🪟" }
];

// Added missing JOURNAL_ARTICLES for the insights section
export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: '1',
    title: 'The Future of Digital Iconography',
    date: 'March 10, 2025',
    excerpt: 'How AI is reshaping the way we think about cross-platform brand assets.',
    content: 'In the modern web ecosystem, icons are the first point of interaction. Standardizing these assets across iOS, Android, and Web is no longer optional for high-fidelity brands.'
  },
  {
    id: '2',
    title: 'Minimalism and Clarity in UI',
    date: 'February 24, 2025',
    excerpt: 'Exploring the FaviconGen design philosophy of simplicity and precision.',
    content: 'Our philosophy focuses on clean design and AI-powered optimization. Every icon is generated with pixel-perfect precision for each platform.'
  }
];

// Added missing getPublisherInfo helper for card branding
export const getPublisherInfo = (publisher: string) => {
  const brandMap: Record<string, { logo: string, color: string }> = {
    'FaviconGen': { logo: 'F', color: '#8b5cf6' },
    'Oxford': { logo: 'O', color: '#1e3a8a' },
    'Nexus': { logo: 'N', color: '#000000' }
  };
  return brandMap[publisher] || { logo: publisher.charAt(0).toUpperCase(), color: '#6366f1' };
};

// Added missing GLOSSARY for terminology tooltips
export const GLOSSARY: Record<string, string> = {
  'Favicon': 'A small icon displayed in browser tabs and bookmark bars.',
  'Manifest': 'A web app manifest is a JSON file that tells the browser about your Progressive Web App.',
  'PWA': 'Progressive Web Application: a website that looks and behaves like a native app.',
  'OCR': 'Optical Character Recognition: technology to extract text from images.'
};

// Added missing INDUSTRIES for the network exchange section
export const INDUSTRIES = [
  { name: "Technology", icon: "💻" },
  { name: "Finance", icon: "🏦" },
  { name: "Creative", icon: "🎨" },
  { name: "Logistics", icon: "🚚" }
];

// Added missing FEATURES for the educational modules
export const FEATURES = [
  { title: 'Inventory Control', desc: 'Track every asset with automated precision.', icon: '📦', color: '#6A4FBF' },
  { title: 'Identity Hub', desc: 'Sync professional contacts to global APIs.', icon: '🌐', color: '#2AB9A9' },
  { title: 'Asset Distiller', desc: 'Summarize complex docs with Gemini AI.', icon: '🧪', color: '#FFB673' },
  { title: 'Clarity Engine', desc: 'High-fidelity asset generation.', icon: '🎯', color: '#E6007A' }
];
