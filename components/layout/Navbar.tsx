"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, MapPin } from "lucide-react";
import { NAV_LINKS, STUDIO_INFO, SOCIAL_LINKS } from "@/lib/constants";

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const pathname = usePathname();

	// Detect scroll to add solid background
	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		handleScroll(); // check on mount
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Lock body scroll when mobile menu is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	// Close mobile menu on route change
	useEffect(() => {
		setIsOpen(false);
	}, [pathname]);

	return (
		<>
			<nav
				className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
					scrolled || isOpen ? "nav-scrolled" : "nav-top"
				}`}
			>
				<div className="container-custom">
					<div className="flex items-center justify-between h-16 sm:h-20">
						{/* Logo */}
						<Link
							href="/"
							className="flex items-center gap-2 sm:gap-3 group relative z-[60]"
						>
							<div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center flex-shrink-0">
								<span className="text-black font-heading text-lg sm:text-xl font-bold tracking-tighter">
									TB
								</span>
							</div>
							<div className="min-w-0">
								<div className="font-heading text-base sm:text-xl tracking-[-1px] text-cream leading-tight">
									TATTOO BIZ
								</div>
								<div className="text-[9px] sm:text-[10px] text-gold/70 -mt-0.5 tracking-[2px]">
									BUTWAL
								</div>
							</div>
						</Link>

						{/* Desktop Navigation */}
						<div className="hidden lg:flex items-center gap-8 xl:gap-10">
							{NAV_LINKS.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className={`nav-link ${
										pathname === link.href ? "text-gold" : ""
									}`}
								>
									{link.label}
								</Link>
							))}
						</div>

						{/* Desktop CTA */}
						<div className="hidden lg:flex items-center gap-4">
							<a
								href={SOCIAL_LINKS.whatsapp}
								target="_blank"
								rel="noopener noreferrer"
								className="btn-whatsapp text-sm px-6 py-2.5"
							>
								<Phone className="w-4 h-4" /> Book Now
							</a>
						</div>

						{/* Mobile Menu Button */}
						<button
							onClick={() => setIsOpen(!isOpen)}
							className="lg:hidden relative z-[60] p-2 text-cream hover:text-gold transition-colors"
							aria-label={isOpen ? "Close menu" : "Open menu"}
						>
							{isOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
				</div>
			</nav>

			{/* Mobile Menu Overlay — rendered outside <nav> to avoid z-index conflicts */}
			<div
				className={`fixed inset-0 z-[55] lg:hidden transition-all duration-300 ${
					isOpen
						? "opacity-100 visible"
						: "opacity-0 invisible pointer-events-none"
				}`}
			>
				{/* Backdrop */}
				<div
					className="absolute inset-0 bg-black/60 backdrop-blur-sm"
					onClick={() => setIsOpen(false)}
				/>

				{/* Menu Panel — slides in from right */}
				<div
					className={`absolute top-0 right-0 h-full w-full max-w-sm mobile-menu-panel transition-transform duration-300 ease-out ${
						isOpen ? "translate-x-0" : "translate-x-full"
					}`}
				>
					<div className="flex flex-col h-full overflow-y-auto pt-20 sm:pt-24 pb-8 px-6 sm:px-8">
						{/* Nav Links */}
						<div className="flex flex-col gap-1">
							{NAV_LINKS.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className={`mobile-nav-link ${
										pathname === link.href
											? "text-gold border-gold/30"
											: "text-cream border-gold/10"
									}`}
									onClick={() => setIsOpen(false)}
								>
									{link.label}
								</Link>
							))}
						</div>

						{/* CTA Button */}
						<div className="mt-8">
							<a
								href={SOCIAL_LINKS.whatsapp}
								target="_blank"
								rel="noopener noreferrer"
								className="btn-whatsapp w-full justify-center"
								onClick={() => setIsOpen(false)}
							>
								<Phone className="w-4 h-4" /> Book on WhatsApp
							</a>
						</div>

						{/* Contact Info */}
						<div className="mt-auto pt-8">
							<div className="border-t border-gold/10 pt-6 space-y-3">
								<a
									href={`tel:${STUDIO_INFO.phone}`}
									className="flex items-center gap-3 text-sm text-muted hover:text-gold transition-colors"
								>
									<Phone size={14} className="text-gold/50" />
									{STUDIO_INFO.phone}
								</a>
								<div className="flex items-center gap-3 text-sm text-muted">
									<MapPin size={14} className="text-gold/50 flex-shrink-0" />
									{STUDIO_INFO.location}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
