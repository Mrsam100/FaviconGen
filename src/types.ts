
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface IconResult {
  size: number;
  label: string;
  dataUrl: string;
  type: 'favicon' | 'apple' | 'android' | 'ms';
  editedDataUrl?: string;     // Stores edited version if user customized
  editorState?: EditorState;  // Stores last edit settings
}

// Editor state for per-icon customization
export interface EditorState {
  // Transform properties
  scale: number;           // 0.1 to 2.0 (10% to 200%)
  padding: number;         // 0 to 50 (pixels)
  rotation: number;        // 0 to 360 (degrees)
  positionX: number;       // -100 to 100 (offset in pixels)
  positionY: number;       // -100 to 100 (offset in pixels)

  // Visual properties
  backgroundColor: string; // Hex color or 'transparent'
  borderRadius: number;    // 0 to 50 (percentage)

  // Color (only for SVG)
  logoColor?: string;      // Hex color for SVG fill

  // Metadata
  originalDataUrl: string; // Original icon data URL
  iconSize: number;        // e.g., 180
  iconType: 'favicon' | 'apple' | 'android' | 'ms';
}

// Default editor state
export const DEFAULT_EDITOR_STATE: Partial<EditorState> = {
  scale: 1.0,
  padding: 0,
  rotation: 0,
  positionX: 0,
  positionY: 0,
  backgroundColor: 'transparent',
  borderRadius: 0,
};

export interface FaviconSet {
  id: string;
  originalFileName: string;
  icons: IconResult[];
  htmlSnippet: string;
  manifestJson: string;
  timestamp: number;
}

export type AppView = 'landing' | 'generator' | 'archives';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface JournalArticle {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

// Added missing Paper interface
export interface Paper {
  id: string;
  title: string;
  publisher: string;
  authors: string[];
  abstract: string;
  abstractPreview: string;
  publicationDate: string;
  category: string;
  doi: string;
  whyMatters: string;
  upvotes: number;
  timestamp: number;
  aiInsights?: string[];
  publisherLogo?: string;
  readTime: string;
  fileUrl?: string;
  description?: string;
}

// Added missing Contact interface
export interface Contact {
  id: string;
  name: string;
  jobTitle: string;
  company: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  address: string;
  fax: string;
  telex: string;
  aiInsights?: string;
  status: 'active' | 'archived';
  timestamp: number;
}

// Added missing IntegrationLog interface
export interface IntegrationLog {
  id: string;
  contactId: string;
  platform: string;
  message: string;
  timestamp: number;
}

// Added missing AppSettings interface
export interface AppSettings {
  businessType: string;
  language: 'en' | 'ar' | 'hi' | 'es' | 'fr';
  currency: string;
  darkMode: boolean;
  taxRate: number;
}

// Added missing SummaryRecord interface
export interface SummaryRecord {
  id: string;
  fileName: string;
  fileType: string;
  originalSize: string;
  title: string;
  distillation: string;
  keyPoints: string[];
  context: string;
  timestamp: number;
  shareUrl: string;
}
