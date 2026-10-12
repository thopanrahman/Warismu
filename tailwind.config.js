/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      // Palet hijau WarisMu — turunan tint dari warna utama #1d8757
      // 900 = warna utama (paling pekat) → 50 = paling muda → putih
      // 950 = forest pekat turunan untuk section gelap/footer
      colors: {
        waris: {
          50: '#e8f3ee',
          100: '#d2e7dd',
          200: '#bbdbcd',
          300: '#a5cfbc',
          400: '#8ec3ab',
          500: '#77b79a',
          600: '#61ab89',
          700: '#4a9f79',
          800: '#349368',
          900: '#1d8757',
          950: '#0e3d27',
        },
        paper: '#F7FBF8',
        cream: '#FEFEFA',
        ink: '#122A20',
      },
      fontFamily: {
        sans: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(29, 135, 87, 0.15)',
        float: '0 10px 40px -10px rgba(29, 135, 87, 0.22)',
      },
    },
  },
  plugins: [],
}
