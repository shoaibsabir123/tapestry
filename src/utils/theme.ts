import { MemoryCategory } from '../types';

export const CATEGORY_COLORS: Record<MemoryCategory, {
  accent: string;
  badgeBg: string;
  badgeText: string;
  glow: string;
  border: string;
}> = {
  'Act of Kindness': {
    accent: '#D97762', // warm coral-rose / kindness glow
    badgeBg: 'rgba(217, 119, 98, 0.12)',
    badgeText: '#AC4834',
    glow: 'rgba(217, 119, 98, 0.5)',
    border: 'rgba(217, 119, 98, 0.25)'
  },
  'Acts That Matter': {
    accent: '#2E8B75', // radiant deep teal / enduring grace
    badgeBg: 'rgba(46, 139, 117, 0.12)',
    badgeText: '#1E6857',
    glow: 'rgba(46, 139, 117, 0.5)',
    border: 'rgba(46, 139, 117, 0.25)'
  },
  Achievement: {
    accent: '#C89D3C', // muted gold
    badgeBg: 'rgba(200, 157, 60, 0.12)',
    badgeText: '#A17A22',
    glow: 'rgba(200, 157, 60, 0.45)',
    border: 'rgba(200, 157, 60, 0.25)'
  },
  Adventure: {
    accent: '#4A7C9B', // muted blue
    badgeBg: 'rgba(74, 124, 155, 0.12)',
    badgeText: '#355C75',
    glow: 'rgba(74, 124, 155, 0.45)',
    border: 'rgba(74, 124, 155, 0.25)'
  },
  Connection: {
    accent: '#B66E6F', // warm rose
    badgeBg: 'rgba(182, 110, 111, 0.12)',
    badgeText: '#944E50',
    glow: 'rgba(182, 110, 111, 0.45)',
    border: 'rgba(182, 110, 111, 0.25)'
  },
  Transition: {
    accent: '#7D6B91', // muted violet
    badgeBg: 'rgba(125, 107, 145, 0.12)',
    badgeText: '#625075',
    glow: 'rgba(125, 107, 145, 0.45)',
    border: 'rgba(125, 107, 145, 0.25)'
  },
  Discovery: {
    accent: '#557A60', // muted green
    badgeBg: 'rgba(85, 122, 96, 0.12)',
    badgeText: '#3D5E46',
    glow: 'rgba(85, 122, 96, 0.45)',
    border: 'rgba(85, 122, 96, 0.25)'
  },
  Creativity: {
    accent: '#C07D53', // muted terracotta / amber
    badgeBg: 'rgba(192, 125, 83, 0.12)',
    badgeText: '#9A5D37',
    glow: 'rgba(192, 125, 83, 0.45)',
    border: 'rgba(192, 125, 83, 0.25)'
  },
  Family: {
    accent: '#A06E58', // warm sienna
    badgeBg: 'rgba(160, 110, 88, 0.12)',
    badgeText: '#82523D',
    glow: 'rgba(160, 110, 88, 0.45)',
    border: 'rgba(160, 110, 88, 0.25)'
  },
  Other: {
    accent: '#8C827A', // muted stone
    badgeBg: 'rgba(140, 130, 122, 0.12)',
    badgeText: '#6B625B',
    glow: 'rgba(140, 130, 122, 0.45)',
    border: 'rgba(140, 130, 122, 0.25)'
  }
};

export function formatDate(dateString: string): string {
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    if (!year || !month || !day) return dateString;
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function formatYearMonth(yearMonth: string): string {
  try {
    const [year, month] = yearMonth.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  } catch {
    return yearMonth;
  }
}
