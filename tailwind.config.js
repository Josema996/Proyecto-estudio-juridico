/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
      },
      boxShadow: {
        'card':       '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-hover': '0 4px 12px 0 rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)',
        'modal':      '0 20px 60px -10px rgb(0 0 0 / 0.3)',
        'tab':        '0 -1px 0 0 rgb(0 0 0 / 0.06)',
      },
      animation: {
        'fade-in':      'fadeIn 0.15s ease-out',
        'slide-up':     'slideUp 0.28s cubic-bezier(0.32, 0.72, 0, 1)',
        'scale-in':     'scaleIn 0.15s ease-out',
        'toast-bar':    'toastBar 4s linear forwards',
        'enter-left':   'enterLeft 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'enter-bottom': 'enterBottom 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'enter-right':  'enterRight 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'glow-line':    'glowLine 2.5s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn:      { from: { opacity: '0' },                                         to: { opacity: '1' } },
        slideUp:     { from: { opacity: '0', transform: 'translateY(100%)' },           to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn:     { from: { opacity: '0', transform: 'scale(0.95)' },               to: { opacity: '1', transform: 'scale(1)' } },
        toastBar:    { from: { width: '100%' },                                        to: { width: '0%' } },
        enterLeft:   { from: { opacity: '0', transform: 'translateX(-32px)' },         to: { opacity: '1', transform: 'translateX(0)' } },
        enterBottom: { from: { opacity: '0', transform: 'translateY(24px)' },          to: { opacity: '1', transform: 'translateY(0)' } },
        enterRight:  { from: { opacity: '0', transform: 'translateX(32px)' },          to: { opacity: '1', transform: 'translateX(0)' } },
        glowLine:    { from: { opacity: '0.4', boxShadow: '0 0 8px 1px #6366f1' },    to: { opacity: '1',  boxShadow: '0 0 20px 4px #6366f1' } },
      },
      // Espaciado basado en 8pt grid (HIG)
      spacing: {
        '4.5': '18px',
        '13':  '52px',
        '15':  '60px',
        '18':  '72px',
      },
      // HIG: font sizes
      fontSize: {
        'ios-caption2':   ['11px', { lineHeight: '13px', letterSpacing: '0.06px' }],
        'ios-caption1':   ['12px', { lineHeight: '16px' }],
        'ios-footnote':   ['13px', { lineHeight: '18px' }],
        'ios-subhead':    ['15px', { lineHeight: '20px' }],
        'ios-body':       ['17px', { lineHeight: '22px' }],
        'ios-headline':   ['17px', { lineHeight: '22px', fontWeight: '600' }],
        'ios-title3':     ['20px', { lineHeight: '25px' }],
        'ios-title2':     ['22px', { lineHeight: '28px' }],
        'ios-title1':     ['28px', { lineHeight: '34px' }],
        'ios-largetitle': ['34px', { lineHeight: '41px' }],
      },
      borderRadius: {
        'ios': '10px',
        'ios-lg': '16px',
        'ios-xl': '20px',
      },
    },
  },
  plugins: [],
}
