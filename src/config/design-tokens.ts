export const designTokens = {
  colors: {
    background: '#081111',
    surface: '#101a1a',
    surfaceRaised: '#162222',
    border: '#243333',
    text: '#f3fbf9',
    mutedText: '#9fb1ad',
    primary: '#4dd8bd',
    primaryDeep: '#0f766e',
    success: '#55d68c',
    warning: '#f5b84b',
    danger: '#f27272',
  },
  spacing: {
    pageX: 'clamp(1rem, 3vw, 2rem)',
    sectionY: 'clamp(3rem, 8vw, 7rem)',
    mobileTapTarget: '44px',
  },
  radii: {
    sm: '0.75rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.75rem',
    pill: '999px',
  },
  shadows: {
    soft: '0 18px 60px rgba(0, 0, 0, 0.28)',
    panel: '0 24px 80px rgba(0, 0, 0, 0.34)',
    glow: '0 0 48px rgba(77, 216, 189, 0.18)',
  },
  containers: {
    content: '72rem',
    wide: '88rem',
    narrow: '42rem',
  },
  motion: {
    fast: '140ms',
    base: '220ms',
    slow: '420ms',
    ease: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  },
  typography: {
    display: 'clamp(2.8rem, 8vw, 6.5rem)',
    h1: 'clamp(2.3rem, 6vw, 5rem)',
    h2: 'clamp(1.8rem, 4vw, 3rem)',
    body: '1rem',
  },
} as const;
