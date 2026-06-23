"use client";

import React, { useState, useEffect } from "react";
import { SOCIAL_LINKS } from "@/lib/constants";
import { MessageCircle, User } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Artist {
	id: string;
	name: string;
	role: string;
	bio: string;
	specialties: string[];
	experience: string;
	photo_url: string;
	instagram_url?: string;
}

export default function ArtistsPage() {
	const [artists, setArtists] = useState<Artist[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchArtists = async () => {
			const { data, error } = await supabase
				.from("artists")
				.select("*")
				.eq("is_active", true)
				.order("order_index", { ascending: true });

			if (error) {
				console.error("Failed to load artists:", error);
			} else {
				setArtists(data || []);
			}
			setLoading(false);
		};

		fetchArtists();
	}, []);

	return (
		<div>
			{/* Header */}
			<div className="bg-dark2 py-20 border-b border-gold/10">
				<div className="container-custom text-center">
					<div className="section-label">THE ARTISTS</div>
					<h1 className="section-title text-6xl md:text-7xl tracking-[-3px] mt-2 mb-3">
						Meet the Team
					</h1>
					<p className="max-w-md mx-auto text-lg text-cream/70">
						Passionate artists dedicated to sacred, meaningful ink.
					</p>
					<div className="gold-divider mx-auto mt-8" />
				</div>
			</div>

			<div className="section bg-black">
				<div className="container-custom">
					{loading ? (
						<div className="text-center py-20 text-cream/50">
							Loading artists...
						</div>
					) : artists.length === 0 ? (
						<div className="text-center py-20 text-muted">
							Our team info is coming soon. Stay tuned!
						</div>
					) : (
						<div className="grid md:grid-cols-3 gap-x-8 gap-y-14">
							{artists.map((artist) => (
								<div key={artist.id} className="group">
									<div className="aspect-[4/4.2] overflow-hidden rounded-3xl mb-6 relative border border-gold/10 bg-dark2">
										{artist.photo_url ? (
											<img
												src={artist.photo_url}
												alt={artist.name}
												className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center text-muted">
												<User size={80} strokeWidth={0.5} />
											</div>
										)}
										<div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent" />
									</div>

									<div>
										<div className="flex items-center justify-between">
											<div>
												<div className="font-heading text-[32px] tracking-[-1px] leading-none">
													{artist.name}
												</div>
												<div className="text-gold text-xs tracking-[3px] mt-1.5">
													{artist.role}
												</div>
											</div>
											{artist.experience && (
												<div className="text-right">
													<div className="text-xs text-muted tracking-widest">
														EXPERIENCE
													</div>
													<div className="text-gold text-xl tracking-tight font-medium">
														{artist.experience}
													</div>
												</div>
											)}
										</div>

										{artist.bio && (
											<div className="mt-6 text-[15px] text-cream/85 leading-snug font-body-serif tracking-tight">
												{artist.bio}
											</div>
										)}

										{artist.specialties && artist.specialties.length > 0 && (
											<div className="mt-6">
												<div className="text-xs tracking-[2.5px] text-gold mb-3">
													SPECIALTIES
												</div>
												<div className="flex flex-wrap gap-1.5">
													{artist.specialties.map((spec, idx) => (
														<span
															key={idx}
															className="px-4 py-1 text-xs tracking-wider border border-gold/30 rounded-full text-cream/80"
														>
															{spec}
														</span>
													))}
												</div>
											</div>
										)}

										{artist.instagram_url && (
											<a
												href={artist.instagram_url}
												target="_blank"
												rel="noopener noreferrer"
												className="mt-8 inline-flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors"
											>
												<MessageCircle size={16} /> FOLLOW ON INSTAGRAM
											</a>
										)}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Join CTA */}
			<div className="bg-dark2 py-16 border-t border-gold/10">
				<div className="container-custom text-center">
					<div className="max-w-xs mx-auto">
						<div className="text-gold text-sm tracking-[3px]">
							LOOKING FOR TALENT?
						</div>
						<div className="text-2xl font-heading tracking-tight mt-2">
							We're always looking for passionate artists.
						</div>
						<a
							href={SOCIAL_LINKS.whatsapp}
							target="_blank"
							rel="noopener noreferrer"
							className="mt-7 inline-block btn-gold"
						>
							MESSAGE US ON WHATSAPP
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
