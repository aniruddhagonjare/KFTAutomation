import React from 'react';
import { Globe, Smartphone, BarChart2, Cpu, LayoutDashboard, Layers } from 'lucide-react';

export const API_BASE = 'http://localhost:3001';

export function encodeCredentials(username, password) {
  return btoa(JSON.stringify({ username, password }));
}

export function classifyLog(line) {
  const l = line.toLowerCase();
  if (l.includes('✗') || l.includes('error') || l.includes('failed') || l.includes('exception')) return 'error';
  if (l.includes('✓') || l.includes('passed') || l.includes('success')) return 'success';
  if (l.includes('warn') || l.includes('warning')) return 'warn';
  return '';
}

// Store component references (not elements) so consumers can do <Icon />
export const CATEGORY_ICONS = {
  'Web UI': Globe,
  'Mobile': Smartphone,
  'Performance': BarChart2,
  'Utilities': Cpu,
  'All': LayoutDashboard,
  'Misc': Layers,
};

export const CATEGORY_CLASS = {
  'Web UI': 'web-ui',
  'Mobile': 'mobile',
  'Performance': 'performance',
  'Utilities': 'utilities',
  'Misc': 'misc',
};

export const SCRIPT_CATEGORIES = ['All', 'Web UI', 'Mobile', 'Performance', 'Utilities', 'Misc'];
