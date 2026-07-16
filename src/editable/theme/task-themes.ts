import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY_FONT = "'Cormorant Garamond', Georgia, serif"
const BODY_FONT = "'Manrope', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"

const base = {
  dark: false,
  fontDisplay: DISPLAY_FONT,
  fontBody: BODY_FONT,
  bg: '#fbf5ec',
  surface: '#fffdf8',
  raised: '#f6ebdd',
  text: '#2a1b14',
  muted: '#7d6556',
  line: '#e8d7c3',
  accent: '#e96f42',
  accentSoft: '#ffe4d7',
  onAccent: '#ffffff',
  glow: 'rgba(233,111,66,0.16)',
  radius: '1.75rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Journal', note: 'Long-form stories, sharper visuals, and calmer reading flow.' },
  listing: { ...base, kicker: 'Directory', note: 'Business pages arranged for easier comparison and stronger first impressions.' },
  classified: { ...base, kicker: 'Notices', note: 'Fast-scanning offers and updates with cleaner product-style merchandising.' },
  image: { ...base, kicker: 'Gallery', note: 'Image-led browsing with room for detail, motion, and atmosphere.' },
  sbm: { ...base, kicker: 'Collections', note: 'Useful references, neatly grouped and easy to revisit.' },
  pdf: { ...base, kicker: 'Library', note: 'Documents presented with clearer archive structure and softer reading surfaces.' },
  profile: { ...base, kicker: 'Profiles', note: 'Identity-first pages for people, brands, and public-facing presence.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
