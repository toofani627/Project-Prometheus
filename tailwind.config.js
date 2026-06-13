/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neo-cream':       '#F4E7D5',
        'neo-warm-white':  '#FEF9F2',
        'neo-black':       '#101010',
        'neo-dark':        '#010101',
        'neo-surface':     '#111111',
        'neo-surface-2':   '#1a1a1a',
        'neo-green-dark':  '#157A26',
        'neo-green-light': '#E0F5DC',
      },
      fontFamily: {
        'heading':    ['"Alfa Slab One"', 'cursive'],
        'subheading': ['"Outfit"', 'sans-serif'],
        'body':       ['"Syne"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
