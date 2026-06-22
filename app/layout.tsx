import type { Metadata } from "next";
import {
	Cinzel,
	Cinzel_Decorative,
	Cormorant_Garamond,
	Raleway,
} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";

const cinzel = Cinzel({
	variable: "--font-cinzel",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

const cinzelDecorative = Cinzel_Decorative({
	variable: "--font-cinzel-decorative",
	subsets: ["latin"],
	weight: ["400", "700", "900"],
});

const cormorant = Cormorant_Garamond({
	variable: "--font-cormorant",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

const raleway = Raleway({
	variable: "--font-raleway",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
	metadataBase: new URL("https://tattoobizbutwal.com"),
	title: {
		default: "Tattoo Biz Butwal | Premium Tattoo & Piercing Studio — Nepal",
		template: "%s | Tattoo Biz Butwal",
	},
	description:
		"Nepal's premier tattoo studio in Butwal. Specializing in Hindu mythology art, mandalas, sacred geometry, black & gray realism, fine line & piercing.",
	icons: {
		icon: "/favicon.ico",
	},
	openGraph: {
		images: [{ url: "/og-image.jpg" }],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${cinzel.variable} ${cinzelDecorative.variable} ${cormorant.variable} ${raleway.variable} antialiased`}
		>
			<body className="min-h-screen bg-black text-cream font-ui flex flex-col">
				<Navbar />
				<main className="flex-1 pt-20">{children}</main>
				<Footer />
				<Toaster position="top-center" richColors closeButton />
			</body>
		</html>
	);
}
