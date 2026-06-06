module.exports = {
  theme: {
    extend: {
      spacing: {
        "25vh": "25vh",
        "50vh": "50vh",
        "75vh": "75vh",
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '48px',
      },
      borderRadius: {
        xl: "1.5rem"
      },
      minHeight: {
        "50vh": "50vh",
        "75vh": "75vh"
      },
      screens: {
        'sm': '300px',
        // => @media (min-width: 300px) { ... }
  
        'md': '640px',
        // => @media (min-width: 640px) { ... }
  
        'lg': '1024px',
        // => @media (min-width: 1024px) { ... }
  
        'xl': '1280px',
        // => @media (min-width: 1280px) { ... }
      }
    }
  },
  variants: {},
  plugins: []
};
