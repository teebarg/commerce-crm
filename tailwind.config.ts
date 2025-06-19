import { type Config } from "tailwindcss";

const generateColorScale = (baseName: string) => {
    const scale: { [key: number]: string; DEFAULT?: string; foreground?: string } = {};
    const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

    // Dynamically generate color scales
    steps.forEach((step) => {
        scale[step] = `hsl(var(--${baseName}-${step}))`;
    });

    // Add the default and foreground variants
    scale.DEFAULT = `hsl(var(--${baseName}))`;
    scale.foreground = `hsl(var(--${baseName}-foreground))`;

    return scale;
};

export default {
    darkMode: ["class"],
    content: ["./src/**/*.tsx"],
    theme: {
    	extend: {
    		backgroundColor: {
    			content1: 'hsl(var( --content1))',
    			content2: 'hsl(var( --content2))',
    			content3: 'hsl(var( --content3))',
    			content4: 'hsl(var( --content4))',
    			'content1-foreground': 'hsl(var( --content1-foreground))',
    			'content2-foreground': 'hsl(var( --content2-foreground))',
    			'content3-foreground': 'hsl(var( --content3-foreground))',
    			'content4-foreground': 'hsl(var( --content4-foreground))',
    			divider: 'hsl(var(--divider) / var(--divider-opacity, 1))'
    		},
    		borderColor: {
    			divider: 'hsl(var(--divider))',
    			content1: 'hsl(var(--content1))',
    			content2: 'hsl(var(--content2))',
    			content3: 'hsl(var(--content3))',
    			content4: 'hsl(var(--content4))'
    		},
    		borderRadius: {
    			'50': '50%',
    			'1xl': '0.875rem',
    			'top-corners': '5px 5px 0 0',
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		borderWidth: {
    			'1': '1px',
    			'3': '3px'
    		},
    		boxShadow: {
    			small: 'var(--box-shadow-small)',
    			medium: 'var(--box-shadow-medium)',
    			large: 'var(--box-shadow-large)'
    		},
    		fontSize: {
    			xxs: [
    				'0.625rem',
    				{
    					lineHeight: '0.875'
    				}
    			]
    		},
    		fontFamily: {
    			sans: 'var(--font-inter)',
    			display: 'var(--font-lexend)'
    		},
    		transitionTimingFunction: {
    			'custom-ease': 'cubic-bezier(0.6, 0.05, 0.15, 0.95)'
    		},
    		colors: {
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			default: 'generateColorScale("default")',
    			danger: 'generateColorScale("danger")',
    			success: 'generateColorScale("success")',
    			warning: 'generateColorScale("warning")',
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			divider: 'hsl(var(--divider))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
    		},
    		keyframes: {
    			blob: {
    				'0%': {
    					transform: 'translate(0, 0) scale(1)'
    				},
    				'33%': {
    					transform: 'translate(30px, -50px) scale(1.1)'
    				},
    				'66%': {
    					transform: 'translate(-20px, 20px) scale(0.9)'
    				},
    				'100%': {
    					transform: 'translate(0, 0) scale(1)'
    				}
    			},
    			'spinner-spin': {
    				'0%': {
    					transform: 'rotate(0deg)'
    				},
    				'100%': {
    					transform: 'rotate(360deg)'
    				}
    			},
    			shimmer: {
    				'100%': {
    					content: 'var(--tw-content)',
    					transform: 'translateX(100%)'
    				}
    			}
    		},
    		animation: {
    			blob: 'blob 15s infinite',
    			'blob-delayed': 'blob 15s infinite 2s',
    			'spinner-ease-spin': 'spinner-spin 0.8s ease infinite',
    			'spinner-linear-spin': 'spinner-spin 0.8s linear infinite'
    		},
    		maxWidth: {
    			'8xl': '88rem',
    			'9xl': '96rem'
    		}
    	}
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config;
