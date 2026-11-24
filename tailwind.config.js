/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        // Palet Forest Green WarisMu (refinement: tenang, mendalam, berwibawa, Islami modern)
        forest: {
          50: '#f2f8f5',
          100: '#e3efe9',
          200: '#c5dfd3',
          300: '#9ecab6',
          400: '#72b095',
          500: '#4f9578',
          600: '#3c7a61',
          700: '#2f614e',
          800: '#264e3f',
          900: '#1d3e32',
          950: '#0d231b',
        },
        // Alias waris-* agar seluruh kode yang ada tetap 100% kompatibel dan semakin indah
        waris: {
          50: '#f2f8f5',
          100: '#e3efe9',
          200: '#c5dfd3',
          300: '#9ecab6',
          400: '#72b095',
          500: '#4f9578',
          600: '#3c7a61',
          700: '#2f614e',
          800: '#264e3f',
          900: '#1d3e32',
          950: '#0d231b',
        },
        // Palet Sage (aksen sekunder yang menenangkan)
        sage: {
          50: '#f5f7f5',
          100: '#e7ece6',
          200: '#cfdacd',
          300: '#b0c2ad',
          400: '#8ea68b',
          500: '#728b6f',
          600: '#596e57',
          700: '#465644',
          800: '#394638',
          900: '#303a2f',
        },
        // Backgrounds: nuansa kertas hangat (warm linen / canvas)
        canvas: '#fbfcf9',
        paper: '#f7faf7',
        cream: '#fdfdfb',
        surface: '#ffffff',
        // Teks & Typographic Ink: Charcoal bersubstansi hijau tua
        ink: {
          DEFAULT: '#13251c',
          950: '#0a1610',
          900: '#13251c',
          800: '#213a2d',
          700: '#334e40',
          600: '#486454',
          500: '#627e6e',
          400: '#869e90',
          300: '#b4c5bc',
        },
        // Dalil / Ayat Qur'an / Syariat accent (Ochre gold hangat)
        dalil: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          500: '#b47a18',
          600: '#925f0e',
          700: '#71460a',
        },
        // Status Bahaya / Peringatan
        danger: {
          DEFAULT: '#b91c1c',
          soft: '#fef2f2',
          light: '#f87171',
          dark: '#991b1b',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        arabic: ['Amiri', 'serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px rgba(13, 35, 27, 0.05)',
        card: '0 2px 10px rgba(13, 35, 27, 0.04), 0 1px 2px rgba(13, 35, 27, 0.02)',
        'card-hover': '0 12px 28px -4px rgba(13, 35, 27, 0.08), 0 4px 10px -2px rgba(13, 35, 27, 0.03)',
        soft: '0 4px 20px -2px rgba(29, 62, 50, 0.09)',
        float: '0 16px 36px -8px rgba(13, 35, 27, 0.16)',
      },
    },
  },
  plugins: [],
}