/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        cursive: ['Comic Neue', 'cursive'],
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
        floatSlow: 'floatSlow 6s ease-in-out infinite',
        'bounce-slow': 'bounce 2.5s infinite',
      
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
      },
    },
  },

  
  plugins: [],
};
