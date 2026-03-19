export const typography = {
  fontFamily: {
    sans: "'Satoshi', system-ui, sans-serif",
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  scale: {
    display: {
      fontSize: 56,
      lineHeight: 1,
      fontWeight: 900,
      letterSpacing: '-0.04em',
      usage: 'Numero principal de streak e momentos hero.',
    },
    h1: {
      fontSize: 22,
      lineHeight: 1.1,
      fontWeight: 800,
      letterSpacing: '-0.03em',
      usage: 'Titulos de tela.',
    },
    h2: {
      fontSize: 19,
      lineHeight: 1.18,
      fontWeight: 800,
      letterSpacing: '-0.03em',
      usage: 'Titulos de card de destaque.',
    },
    h3: {
      fontSize: 15,
      lineHeight: 1.3,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      usage: 'Titulos internos de componente.',
    },
    body: {
      fontSize: 14,
      lineHeight: 1.55,
      fontWeight: 400,
      letterSpacing: '0',
      usage: 'Texto corrido principal.',
    },
    bodyStrong: {
      fontSize: 14,
      lineHeight: 1.5,
      fontWeight: 600,
      letterSpacing: '0',
      usage: 'Labels e chamadas intermediarias.',
    },
    caption: {
      fontSize: 12,
      lineHeight: 1.4,
      fontWeight: 500,
      letterSpacing: '0.01em',
      usage: 'Meta informacional e subtitulos.',
    },
    label: {
      fontSize: 11,
      lineHeight: 1.35,
      fontWeight: 700,
      letterSpacing: '0.02em',
      usage: 'Status, apoio e pequenas tags.',
    },
    overline: {
      fontSize: 10,
      lineHeight: 1.2,
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      usage: 'Eyebrow, labels de secao e navegacao compacta.',
    },
  },
} as const

export type Typography = typeof typography
