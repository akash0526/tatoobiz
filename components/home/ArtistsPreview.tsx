"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, User } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Artist {
	id: string;
	name: string;
	role: string;
	specialties: string[];
	photo_url: string;
}

export default function ArtistsPreview() {
	const [artists, setArtists] = useState<Artist[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchArtists = async () => {
			const { data, error } = await supabase
				.from("artists")
				.select("id, name, role, specialties, photo_url")
				.eq("is_active", true)
				.order("order_index", { ascending: true })
				.limit(3);

			if (error) {
				console.error("Failed to load artists:", error);
			} else {
				setArtists(data || []);
			}
			setLoading(false);
		};

		fetchArtists();
	}, []);

	if (loading) {
		return (
			<section className="section bg-black">
				<div className="container-custom">
					<div className="text-center py-20 text-cream/50">
						Loading artists...
					</div>
				</div>
			</section>
		);
	}

	if (artists.length === 0) return null;

	return (
		<section className="section bg-black">
			<div className="container-custom">
				<div className="flex justify-between items-end mb-10">
					<div>
						<div className="section-label">THE TEAM</div>
						<h2 className="section-title">Meet Our Artists</h2>
					</div>
					<Link
						href="/artists"
						className="hidden md:flex btn-outline-gold items-center gap-2 group"
					>
						MEET THE TEAM{" "}
						<ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
					</Link>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{artists.map((artist) => (
						<div key={artist.id} className="group">
							<div className="aspect-[4/3.3] overflow-hidden rounded-2xl mb-5 relative bg-dark2">
								{artist.photo_url ? (
									<img
										src={artist.photo_url}
										alt={artist.name}
										className="w-full h-full object-cover grayscale-[0.15] group-hover:grayscale-0 transition-all duration-700"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center text-muted">
										<User size={60} strokeWidth={0.5} />
									</div>
								)}
								<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent h-1/3" />
							</div>
							<div>
								<div className="font-heading text-3xl tracking-tight text-cream mb-1">
									{artist.name}
								</div>
								<div className="text-gold text-xs tracking-[2px] mb-4">
									{artist.role}
								</div>
								{artist.specialties && artist.specialties.length > 0 && (
									<div className="flex flex-wrap gap-1.5">
										{artist.specialties.map((spec, i) => (
											<span
												key={i}
												className="px-3 py-px rounded-full border border-gold/30 text-xs tracking-wider text-gold/80"
											>
												{spec}
											</span>
										))}
									</div>
								)}
							</div>
						</div>
					))}
				</div>

				<div className="text-center mt-9 md:hidden">
					<Link href="/artists" className="btn-outline-gold">
						MEET THE TEAM
					</Link>
				</div>
			</div>
		</section>
	);
}
