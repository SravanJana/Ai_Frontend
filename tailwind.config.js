/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				// ABML Brand Colors - Aditya Birla Capital
				primary: {
					50: "#fef2f2",
					100: "#fee2e2",
					200: "#fecaca",
					300: "#fca5a5",
					400: "#f87171",
					500: "#ED1C24",
					600: "#dc2626",
					700: "#b91c1c",
					800: "#991b1b",
					900: "#7f1d1d",
				},
				abml: {
					red: "#ED1C24",
					darkRed: "#A51C30",
					maroon: "#8B1538",
					gold: "#FFB81C",
					lightGold: "#FFD700",
				},
				success: {
					400: "#4ade80",
					500: "#22c55e",
					600: "#16a34a",
				},
				danger: {
					400: "#f87171",
					500: "#ef4444",
					600: "#dc2626",
				},
				warning: {
					400: "#fbbf24",
					500: "#f59e0b",
					600: "#d97706",
				},
				dark: {
					50: "#f8fafc",
					100: "#f1f5f9",
					200: "#e2e8f0",
					300: "#cbd5e1",
					400: "#94a3b8",
					500: "#64748b",
					600: "#475569",
					700: "#334155",
					800: "#1e293b",
					900: "#0f172a",
					950: "#020617",
				},
			},
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
				glass: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
			},
			boxShadow: {
				glass: "0 8px 32px rgba(0, 0, 0, 0.3)",
				glow: "0 0 20px rgba(59, 130, 246, 0.5)",
				"glow-success": "0 0 20px rgba(34, 197, 94, 0.5)",
				"glow-danger": "0 0 20px rgba(239, 68, 68, 0.5)",
			},
			animation: {
				"fade-in": "fadeIn 0.5s ease-out",
				"slide-up": "slideUp 0.5s ease-out",
				"slide-down": "slideDown 0.3s ease-out",
				"pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
				"bounce-light": "bounce 2s infinite",
			},
			keyframes: {
				fadeIn: {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				slideUp: {
					"0%": { opacity: "0", transform: "translateY(20px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				slideDown: {
					"0%": { opacity: "0", transform: "translateY(-10px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
			},
			backdropBlur: {
				xs: "2px",
			},
		},
	},
	plugins: [],
};
