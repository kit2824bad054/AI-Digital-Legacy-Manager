/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme specific custom color tokens requested for AI Digital Legacy Manager
        legacy: {
          bg: "#0a0a0f",        // Deep cosmic black background
          primary: "#6b21a8",   // Deep royal purple
          accent: "#a855f7",    // Vibrant amethyst accent
          glow: "#7c3aed",      // Electric violet neon glow
          text: "#e2e8f0",      // Crisp readable light slate text
          card: "#13131f",      // Frosted dark glassmorphism card surface
          cardHover: "#181829", // Elevated glass card hover state
          muted: "#94a3b8",     // Secondary text muted slate
          border: "#232338",    // Subtle card border
        },
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(124, 58, 237, 0.35)',
        'glow-md': '0 0 30px -4px rgba(124, 58, 237, 0.45)',
        'glow-lg': '0 0 50px -5px rgba(124, 58, 237, 0.6)',
        'glow-accent': '0 0 25px -3px rgba(168, 85, 247, 0.5)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.04)' },
        },
      },
      animation: {
        'float-slow': 'float 5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
