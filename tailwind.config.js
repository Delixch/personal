/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink:           'var(--ink)',
        'ink-soft':    'var(--ink-soft)',
        'ink-muted':   'var(--ink-muted)',

        ground:        'var(--ground)',
        surface:       'var(--surface)',
        subtle:        'var(--subtle)',

        line:          'var(--line)',
        'line-soft':   'var(--line-soft)',

        brand:         'var(--brand)',
        'brand-hover': 'var(--brand-hover)',
        'brand-deep':  'var(--brand-deep)',
        'brand-light': 'var(--brand-light)',
        'brand-border':'var(--brand-border)',

        'icon-bg':     'var(--icon-bg)',
        'icon-color':  'var(--icon-color)',

        dark:          'var(--dark)',
      },

      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
