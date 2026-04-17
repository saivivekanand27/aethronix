/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ss-bg-base': '#0A0C10',
        'ss-bg-surface': '#111318',
        'ss-bg-elevated': '#1A1D24',
        'ss-border': '#232730',
        'ss-border-muted': '#1C1F26',
        'ss-text-primary': '#F1F3F5',
        'ss-text-secondary': '#8B90A0',
        'ss-text-muted': '#555A6A',
        'ss-accent-blue': '#3B82F6',
        'ss-accent-green': '#22C55E',
        'ss-accent-amber': '#F59E0B',
        'ss-accent-red': '#EF4444',
        'ss-accent-purple': '#A78BFA',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'h1': ['28px', { lineHeight: '1.3', fontWeight: '500' }],
        'h2': ['22px', { lineHeight: '1.3', fontWeight: '500' }],
        'h3': ['18px', { lineHeight: '1.4', fontWeight: '500' }],
        'h4': ['15px', { lineHeight: '1.4', fontWeight: '500' }],
        'body': ['14px', { lineHeight: '1.6' }],
        'caption': ['12px', { lineHeight: '1.5' }],
        'mono-sm': ['13px', { lineHeight: '1.5' }],
      },
      borderRadius: {
        'ss-sm': '6px',
        'ss-md': '8px',
        'ss-lg': '12px',
        'ss-xl': '16px',
      },
      boxShadow: {
        'ss-sm': '0 1px 3px rgba(0,0,0,0.4)',
        'ss-lg': '0 8px 32px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}
