/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'neo-cream':       'var(--color-neo-cream)',
        'neo-warm-white':  'var(--color-neo-warm-white)',
        'neo-black':       'var(--color-neo-black)',
        'neo-dark':        'var(--color-neo-dark)',
        'neo-surface':     'var(--color-neo-surface)',
        'neo-surface-2':   'var(--color-neo-surface-2)',
        'neo-green-dark':  'var(--color-neo-green-dark)',
        'neo-green-light': 'var(--color-neo-green-light)',
      },
      fontFamily: {
        'heading':    ['var(--font-heading)'],
        'subheading': ['var(--font-subheading)'],
        'body':       ['var(--font-body)'],
      },
    },
  },
  plugins: [],
}
