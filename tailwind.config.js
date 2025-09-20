/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './stories/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Base Colors
        dark: '#11001c',
        light: '#ffffff',
        
        // Brand Colors (Purple gradient)
        brand: {
          DEFAULT: '#b428fa',
          50: '#e5a9ff',
          40: '#dc93fe', 
          30: '#d37dfe',
          20: '#ca65fd',
          10: '#bf4bfb',
          0: '#b428fa',
        },
        
        // Accent Colors
        accent: {
          // Primary accent (simplified)
          primary: {
            DEFAULT: '#8f5dff',
            hover: '#c7a4ff',
          },
          // Accent 1 (Cyan/Teal)
          cyan: {
            0: '#5cffe1',
            10: '#73ffea',
            20: '#86fff0',
            30: '#98fff4',
            40: '#abfff8',
            50: '#c3fff2',
          },
          // Accent 2 (Green/Yellow)
          green: {
            0: '#cbff5c',
            10: '#d3ff73',
            20: '#daff86',
            30: '#e0ff98',
            40: '#e6ffab',
            50: '#ebffba',
            chip: '#d9ff85', // Specific chip color
          },
          // Accent 3 (Red/Pink)  
          red: {
            0: '#ff5c7a',
            10: '#ff7390',
            20: '#ff86a1',
            30: '#ff98b1',
            40: '#ffabc0',
            50: '#ffbbc1',
            chip: '#ff8596', // Specific chip color
          },
        },
        
        // Surface Colors (Background variations)
        surface: {
          0: '#0d0038',  // primary background
          10: '#251c4c', // secondary background  
          20: '#3e3460', // tertiary background
          30: '#584e76',
          40: '#72698b', 
          50: '#8d85a2',
        },
        
        // Semantic color mappings
        bg: {
          primary: '#0d0038',
          secondary: '#251c4c', 
          tertiary: '#3e3460',
        },
        text: {
          primary: '#ffffff',
          secondary: '#ffffffe5', // white with opacity
        },
        button: {
          label: '#030016',
        },
        
        // Ghost/transparent
        ghost: '#8f5dff00',
      },
      
      fontSize: {
        // Custom typography scale matching Figma
        'label': ['13px', { lineHeight: '1', fontWeight: '500' }],
        'body': ['16px', { lineHeight: '1.4', fontWeight: '400' }], 
        'h2': ['26px', { lineHeight: '1.2', fontWeight: '600' }],
        'h3': ['23px', { lineHeight: '1.25', fontWeight: '500' }],
        'chip': ['12px', { lineHeight: '100%', fontWeight: '400' }],
        'chip-bold': ['12px', { lineHeight: '100%', fontWeight: '600' }],
      },
      
      fontWeight: {
        'regular': '400',
        'medium': '500', 
        'semibold': '600',
      },
      
      borderRadius: {
        'xs': '4px',
        'sm': '8px', 
        'lg': '16px',
        'xl': '24px',
        'full': '9999px',
      },
      
      spacing: {
        'xs': '8px',
        '300': '12px',
        // Standard Tailwind spacing is already good, but adding custom ones
        '30': '30px', // For button horizontal padding
      },
      
      letterSpacing: {
        'button': '0.26px', // For button labels
      },
      
      opacity: {
        'disabled': '0.5',
      },
      
      // Component-specific configurations
      backdropBlur: {
        'card': '10px', // For potential glassmorphism effects
      },
    },
  },
  plugins: [
    // Add any additional plugins if needed
  ],
}