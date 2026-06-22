"use client";

import React, { useState, useEffect } from "react";
import { STYLES } from "@/lib/constants";
import { supabase } from "@/lib/supabase";

interface GalleryItem {
	id: string;
	title: string;
	style: string;
	artist_name: string;
	image_url: string;
}

export default function GalleryPage() {
	const [gallery, setGallery] = useState<GalleryItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [activeFilter, setActiveFilter] = useState<string>("All");
	const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

	useEffect(() => {
		const fetchGallery = async () => {
			const { data, error } = await supabase
				.from("gallery_items")
				.select("*")
				.order("created_at", { ascending: false });

			if (error) {
				console.error("Failed to load gallery:", error);
			} else {
				setGallery(data || []);
			}
			setLoading(false);
		};

		fetchGallery();
	}, []);

	const filteredItems =
		activeFilter === "All"
			? gallery
			: gallery.filter((item) => item.style === activeFilter);

	return (
		<div>
			{/* Header */}
			<div className="bg-dark2 py-20 border-b border-gold/10">
				<div className="container-custom text-center">
					<div className="section-label">PORTFOLIO</div>
					<h1 className="section-title text-6xl md:text-7xl tracking-[-3px] mt-2 mb-3">
						Our Work
					</h1>
					<p className="max-w-md mx-auto text-lg text-cream/70">
						A glimpse into the sacred art we create — each piece tells a story.
					</p>
					<div className="gold-divider mx-auto mt-8" />
				</div>
			</div>

			{/* Filters */}
			<div className="sticky top-20 z-40 bg-black/95 border-b border-gold/10 py-4 backdrop-blur-md">
				<div className="container-custom">
					<div className="flex flex-wrap gap-2 justify-center md:justify-start">
						<button
							onClick={() => setActiveFilter("All")}
							className={`px-5 py-1.5 text-xs tracking-wider rounded-full transition-all border ${
								activeFilter === "All"
									? "bg-gold text-black border-gold"
									: "border-gold/30 hover:border-gold/60 text-cream"
							}`}
						>
							ALL
						</button>
						{STYLES.map((style) => (
							<button
								key={style}
								onClick={() => setActiveFilter(style)}
								className={`px-5 py-1.5 text-xs tracking-wider rounded-full transition-all border ${
									activeFilter === style
										? "bg-gold text-black border-gold"
										: "border-gold/30 hover:border-gold/60 text-cream"
								}`}
							>
								{style.toUpperCase()}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Gallery Grid */}
			<div className="section bg-black">
				<div className="container-custom">
					{loading ? (
						<div className="text-center py-20 text-cream/50">
							Loading gallery...
						</div>
					) : (
						<>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
								{filteredItems.map((item) => (
									<div
										key={item.id}
										onClick={() => setSelectedImage(item)}
										className="gallery-item group cursor-pointer"
									>
										<img
											src={item.image_url}
											alt={item.title}
											className="absolute inset-0 w-full h-full object-cover"
										/>
										<div className="gallery-overlay">
											<div>
												<div className="font-heading text-2xl tracking-[-0.5px] text-cream mb-1">
													{item.title}
												</div>
												<div className="flex items-center justify-between text-sm">
													<div>
														<span className="text-gold tracking-wider">
															{item.style}
														</span>
														<div className="text-xs text-cream/70 mt-px">
															by {item.artist_name}
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>

							{filteredItems.length === 0 && (
								<div className="text-center py-20 text-muted">
									{gallery.length === 0
										? "No photos uploaded yet. Check back soon!"
										: "No pieces found in this style."}
								</div>
							)}
						</>
					)}
				</div>
			</div>

			{/* Lightbox Modal */}
			{selectedImage && (
				<div
					className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4"
					onClick={() => setSelectedImage(null)}
				>
					<div
						className="max-w-6xl w-full relative"
						onClick={(e) => e.stopPropagation()}
					>
						<button
							onClick={() => setSelectedImage(null)}
							className="absolute -top-3 -right-3 bg-black border border-gold/30 text-gold px-4 py-1 text-xs tracking-widest rounded-full z-10"
						>
							CLOSE
						</button>

						<img
							src={selectedImage.image_url}
							alt={selectedImage.title}
							className="w-full max-h-[90vh] object-contain rounded-2xl"
						/>

						<div className="mt-6 text-center">
							<div className="font-heading text-4xl tracking-tight">
								{selectedImage.title}
							</div>
							<div className="text-gold mt-1 tracking-wider">
								{selectedImage.style} • {selectedImage.artist_name}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
