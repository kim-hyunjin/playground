import React from 'react';

export interface Section {
  id: string;
  title: string;
  content: string;
}

export interface SummaryItem {
  label: string;
  value: React.ReactNode;
  rowSpan?: number;
}

export interface SplashConfig {
  text: string[];
  buttonText: string;
}

export interface WikiArticle {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  summary: SummaryItem[];
  sections: Section[];
  hasSplash?: boolean;
  splashConfig?: SplashConfig;
}

// Registry to export all wikis. Using a simple array for now.
// Later we can use import.meta.glob to dynamically load.
import { sampleWiki } from './articles/sample';

export const allWikis: WikiArticle[] = [
  sampleWiki,
];
