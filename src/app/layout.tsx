import type { Metadata } from "next";
import { Geist, Geist_Mono, Averia_Serif_Libre } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Footer from "@/components/footer";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const averia = Averia_Serif_Libre({
	variable: "--font-averia",
	subsets: ["latin"],
	weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
	title: "Showerglade",
	description: "Reserve Showers for Hack Clubs Overglade Event!",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${averia.variable} antialiased font-averia`}
			>
				{children}
				<Toaster />
				<Footer />
			</body>
		</html>
	);
}
