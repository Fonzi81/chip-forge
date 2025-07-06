
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
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
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Professional slate scale
				slate: {
					50: 'hsl(var(--slate-50))',
					100: 'hsl(var(--slate-100))',
					200: 'hsl(var(--slate-200))',
					300: 'hsl(var(--slate-300))',
					400: 'hsl(var(--slate-400))',
					500: 'hsl(var(--slate-500))',
					600: 'hsl(var(--slate-600))',
					700: 'hsl(var(--slate-700))',
					800: 'hsl(var(--slate-800))',
					900: 'hsl(var(--slate-900))',
					950: 'hsl(var(--slate-950))'
				},
				// Technical accent colors
				cyan: {
					400: 'hsl(var(--cyan-400))',
					500: 'hsl(var(--cyan-500))',
					600: 'hsl(var(--cyan-600))'
				},
				blue: {
					400: 'hsl(var(--blue-400))',
					500: 'hsl(var(--blue-500))',
					600: 'hsl(var(--blue-600))'
				},
				emerald: {
					400: 'hsl(var(--emerald-400))',
					500: 'hsl(var(--emerald-500))',
					600: 'hsl(var(--emerald-600))',
					800: 'hsl(var(--emerald-800))'
				},
				amber: {
					400: 'hsl(var(--amber-400))',
					500: 'hsl(var(--amber-500))'
				},
				red: {
					400: 'hsl(var(--red-400))',
					500: 'hsl(var(--red-500))'
				},
				// ChipForge simulation colors
				chipforge: {
					bg: 'hsl(var(--chipforge-bg))',
					accent: 'hsl(var(--chipforge-accent))',
					waveform: 'hsl(var(--chipforge-waveform))',
					signal: {
						high: 'hsl(var(--chipforge-signal-high))',
						low: 'hsl(var(--chipforge-signal-low))',
						x: 'hsl(var(--chipforge-signal-x))',
						z: 'hsl(var(--chipforge-signal-z))'
					},
					console: 'hsl(var(--chipforge-console))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: ['Inter', 'ui-sans-serif', 'system-ui'],
				mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular'],
				display: ['Geist Sans', 'Inter', 'ui-sans-serif']
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				// Professional animations
				'trace-flow': {
					'0%': { 
						strokeDashoffset: '100',
						opacity: '0.3'
					},
					'50%': { 
						opacity: '1'
					},
					'100%': { 
						strokeDashoffset: '0',
						opacity: '0.3'
					}
				},
				'data-pulse': {
					'0%, 100%': { 
						opacity: '0.4',
						transform: 'scale(1)'
					},
					'50%': { 
						opacity: '1',
						transform: 'scale(1.05)'
					}
				},
				'silicon-etch': {
					'0%': { 
						backgroundPosition: '0% 0%',
						opacity: '0.5'
					},
					'50%': { 
						opacity: '0.8'
					},
					'100%': { 
						backgroundPosition: '100% 100%',
						opacity: '0.5'
					}
				},
				'code-compile': {
					'0%': { 
						transform: 'translateX(-100%)',
						opacity: '0'
					},
					'20%': { 
						opacity: '1'
					},
					'80%': { 
						opacity: '1'
					},
					'100%': { 
						transform: 'translateX(100%)',
						opacity: '0'
					}
				},
				'metric-update': {
					'0%': { 
						transform: 'translateY(10px)',
						opacity: '0'
					},
					'100%': { 
						transform: 'translateY(0)',
						opacity: '1'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'trace-flow': 'trace-flow 3s ease-in-out infinite',
				'data-pulse': 'data-pulse 2s ease-in-out infinite',
				'silicon-etch': 'silicon-etch 8s linear infinite',
				'code-compile': 'code-compile 4s ease-in-out infinite',
				'metric-update': 'metric-update 0.5s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
