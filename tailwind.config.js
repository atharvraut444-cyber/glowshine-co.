/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#F7F4EF',
          50: '#FDFBF9',
          100: '#F7F4EF',
          200: '#EFE9DE',
          300: '#E7DDCC',
        },
        ink: {
          DEFAULT: '#111111',
          light: '#242424',
          muted: '#4A4A4A',
        },
        sand: {
          DEFAULT: '#E8DED4',
          light: '#F4EFEB',
          dark: '#D8C9BC',
        },
        champagne: {
          DEFAULT: '#CDBBA8',
          light: '#DDD0C0',
          dark: '#BBA48F',
        },
        taupe: {
          DEFAULT: '#74685E',
          light: '#918479',
          dark: '#594F47',
        },
        rose: {
          clay: '#B87568',
          light: '#F7EBE8',
          subtle: '#E8C5BE',
          DEFAULT: '#B87568',
          dark: '#96584C',
        },
        status: {
          success: '#2E7D32',
          warning: '#D97706',
          error: '#C53030',
          info: '#2563EB',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['"DM Serif Display"', 'Cormorant Garamond', 'Georgia', 'serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(17, 17, 17, 0.04)',
        'card': '0 4px 20px rgba(17, 17, 17, 0.06)',
        'elevated': '0 10px 30px rgba(17, 17, 17, 0.08)',
        'modal': '0 20px 50px rgba(17, 17, 17, 0.15)',
      },
      borderRadius: {
        'luxury': '2px',
        'subtle': '4px',
        'card': '8px',
        'pill': '9999px',
      }
    },
  },
  plugins: [],
};
