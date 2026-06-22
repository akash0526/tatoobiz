"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface GalleryItem {
	id: string;
	title: string;
	style: string;
	artist_name: string;
	image_url: string;
	is_featured: boolean;
}

export default function FeaturedGallery() {
	const [featuredItems, setFeaturedItems] = useState<GalleryItem[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchFeatured = async () => {
			// First try to get featured items
			let { data, error } = await supabase
				.from("gallery_items")
				.select("*")
				.eq("is_featured", true)
				.order("created_at", { ascending: false })
				.limit(6);

			// If no featured items, fall back to latest 6 uploads
			if (!error && (!data || data.length === 0)) {
				const result = await supabase
					.from("gallery_items")
					.select("*")
					.order("created_at", { ascending: false })
					.limit(6);
				data = result.data;
				error = result.error;
			}

			if (error) {
				console.error("Failed to load featured gallery:", error);
			} else {
				setFeaturedItems(data || []);
			}
			setLoading(false);
		};

		fetchFeatured();
	}, []);

	// Don't render the section if there's nothing to show
	if (loading) {
		return (
			<section className="section bg-black">
				<div className="container-custom">
					<div className="text-center py-20 text-cream/50">
						Loading gallery...
					</div>
				</div>
			</section>
		);
	}

	if (featuredItems.length === 0) {
		return null;
	}

	return (
		<section className="section bg-black">
			<div className="container-custom">
				<div className="flex justify-between items-end mb-10">
					<div>
						<div className="section-label">PORTFOLIO</div>
						<h2 className="section-title text-5xl md:text-6xl">
							Featured Work
						</h2>
					</div>
					<Link
						href="/gallery"
						className="hidden md:flex btn-outline-gold items-center gap-2 group"
					>
						VIEW FULL GALLERY{" "}
						<ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
					</Link>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
					{featuredItems.map((item) => (
						<div key={item.id} className="gallery-item group">
							<img
								src={item.image_url}
								alt={item.title}
								className="absolute inset-0 w-full h-full object-cover"
							/>
							<div className="gallery-overlay">
								<div>
									<div className="font-heading text-xl tracking-tight text-cream mb-1">
										{item.title}
									</div>
									<div className="flex justify-between items-end">
										<div>
											<div className="text-gold text-sm tracking-wider">
												{item.style}
											</div>
											<div className="text-xs text-cream/60 mt-0.5">
												by {item.artist_name}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>

				<div className="flex justify-center mt-9 md:hidden">
					<Link href="/gallery" className="btn-outline-gold">
						VIEW FULL GALLERY
					</Link>
				</div>
			</div>
		</section>
	);
}
