import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Layout from "@/components/Layout";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "AI Trading Copilot - Smart Investment Decisions",
	description:
		"AI-powered trading intelligence system for smart investment decisions",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="dark">
			<body className={inter.className}>
				<Providers>
					<Layout>{children}</Layout>
				</Providers>
			</body>
		</html>
	);
}
