

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {

      fontSize: {
        'xxs': '.65rem',
        
      }, 
      colors: {
        'dark-100': '#0F2027',
        'dark-50': '#203A43',
        'dark-10': '#2C5364',
        'gradient-1':'#a8ff78',
        'gradient-2':'#78ffd6',
        'blue-1':'#0974f1',
        'blue-2':'#9fccfa',
        'color-1':'#00F260',
        'color-2':'#0575E6',
      },
      spacing: {
        '192': '48rem',
        '200': '62rem',
        '196' : '52rem',
        
      },
      gridTemplateColumns: {
        '1_3': 'repeat(2, minmax(2fr, 3fr))',
      },
      screens: {
        'sm': '640px',
        // => @media (min-width: 640px) { ... }
  
        'md': '768px',
        // => @media (min-width: 768px) { ... }
  
        'lg': '1024px',
        // => @media (min-width: 1024px) { ... }
  
        'xl': '1280px',
        // => @media (min-width: 1280px) { ... }
  
        '2xl': '1536px',
        // => @media (min-width: 1536px) { ... }
      },

    },
  },
  plugins: [],
}