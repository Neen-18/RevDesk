import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
			colors: {
				revDeskBlue: "#1194e4",
				revDeskGreen: "#39b972",
				revDeskOrange: "#FFA500",
				revDeskYellow: "#f5c518",
				revDeskRed: "#e53e3e",
				revDeskBlack: {
					DEFAULT: "#1d2124",
					dark: "#181818",
					light: "#212121",
				},
				appBlue: "#1194e4",
				appGreen: "#39b972",
				appOrange: "#FFA500",
				appBlack: {
					DEFAULT: "#1d2124",
					dark: "#181818",
					light: "#212121",
				},
			},
		},
		screens: {
			sm: "640px",
			md: "768px",
			lg: "1024px",
			xl: "1280px",
			"2xl": "1536px",
		},
	},
	plugins: [],
};
export default config;
