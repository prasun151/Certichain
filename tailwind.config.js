/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#6C63FF',
        primary2: '#5B5BFF',
        primary3: '#4F8CFF',
        accent: '#C7F36B',
        success: '#22C55E',
        error: '#EF4444',
        dark: '#0F172A',
        light: '#F8FAFC',
        border: '#E2E8F0',
        muted: '#64748B',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0,0,0,0.08)',
        'card': '0 2px 8px rgba(0,0,0,0.06)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
      },
    },
  },
  plugins: [],
}
