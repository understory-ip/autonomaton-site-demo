/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      colors: {
        // Zone governance colors — used throughout for consistent visual language
        zone: {
          green: '#22c55e',   // Autonomous: execute without asking
          yellow: '#eab308',  // Supervised: propose, human approves
          red: '#ef4444',     // Human-only: surface info, wait
        },
        // Tier colors — cognitive routing visualization
        tier: {
          0: '#a855f7',  // Purple: cached skill (local, free)
          1: '#3b82f6',  // Blue: cheap cognition
          2: '#f97316',  // Orange: premium cognition
          3: '#dc2626',  // Red: apex cognition
        },
        // Pipeline stage colors
        pipeline: {
          idle: '#475569',     // slate-600
          active: '#3b82f6',   // blue-500
          complete: '#22c55e', // green-500
          error: '#ef4444',    // red-500
        }
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ripple': 'ripple 0.6s ease-out forwards',
        'evaporate': 'evaporate 0.8s ease-out forwards',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        evaporate: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
