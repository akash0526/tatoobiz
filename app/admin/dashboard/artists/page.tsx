"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Upload, X, User } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface Artist {
	id: string;
	name: string;
	role: string;
	bio: string;
	specialties: string[];
	experience: string;
	instagram_url: string;
	is_active: boolean;
	photo_url: string;
	imagekit_file_id?: string;
}

export default function ArtistsManager() {
	const [artists, setArtists] = useState<Artist[]>([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		name: "",
		role: "",
		bio: "",
		experience: "",
		instagram_url: "",
		specialties: "",
	});

	const fetchArtists = async () => {
		const { data, error } = await supabase
			.from("artists")
			.select("*")
			.order("order_index");
		if (!error) setArtists(data || []);
		setLoading(false);
	};

	useEffect(() => {
		fetchArtists();
	}, []);

	const resetForm = () => {
		setFormData({
			name: "",
			role: "",
			bio: "",
			experience: "",
			instagram_url: "",
			specialties: "",
		});
		setEditingArtist(null);
		setSelectedFile(null);
		setImagePreview(null);
		setShowForm(false);
	};

	// Handle file selection with preview
	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			if (!file.type.startsWith("image/")) {
				toast.error("Please select an image file");
				return;
			}
			if (file.size > 10 * 1024 * 1024) {
				toast.error("File size must be less than 10MB");
				return;
			}
			setSelectedFile(file);
			// Create preview
			const reader = new FileReader();
			reader.onloadend = () => setImagePreview(reader.result as string);
			reader.readAsDataURL(file);
		}
	};

	const removeSelectedFile = () => {
		setSelectedFile(null);
		setImagePreview(null);
	};

	// Upload image to ImageKit
	const uploadToImageKit = async (
		file: File,
	): Promise<{ url: string; fileId: string }> => {
		// 1. Get auth params
		const authRes = await fetch("/api/imagekit/auth");
		if (!authRes.ok) {
			const errData = await authRes.json().catch(() => ({}));
			throw new Error(errData.error || "Failed to get ImageKit auth params");
		}
		const authParams = await authRes.json();

		// 2. Upload
		const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
		if (!publicKey) throw new Error("ImageKit public key is not configured");

		const formData = new FormData();
		formData.append("file", file);
		formData.append("publicKey", publicKey);
		formData.append("fileName", `artist-${Date.now()}-${file.name}`);
		formData.append("folder", "/artists/");
		formData.append("token", authParams.token);
		formData.append("signature", authParams.signature);
		formData.append("expire", authParams.expire.toString());

		const uploadRes = await fetch(
			"https://upload.imagekit.io/api/v1/files/upload",
			{
				method: "POST",
				body: formData,
			},
		);

		if (!uploadRes.ok) {
			const errBody = await uploadRes.text();
			console.error("ImageKit upload error:", uploadRes.status, errBody);
			throw new Error(`Image upload failed: ${uploadRes.status}`);
		}

		const uploadData = await uploadRes.json();
		return { url: uploadData.url, fileId: uploadData.fileId };
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Require image for new artists
		if (!editingArtist && !selectedFile) {
			toast.error("Please select a photo for the artist");
			return;
		}

		setUploading(true);

		try {
			let photo_url = editingArtist?.photo_url || "";
			let imagekit_file_id = editingArtist?.imagekit_file_id || "";

			// Upload new image if selected
			if (selectedFile) {
				const uploaded = await uploadToImageKit(selectedFile);
				photo_url = uploaded.url;
				imagekit_file_id = uploaded.fileId;

				// Delete old image from ImageKit if replacing
				if (editingArtist?.imagekit_file_id) {
					fetch("/api/imagekit/delete", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ fileId: editingArtist.imagekit_file_id }),
					}).catch((err) => console.error("Failed to delete old image:", err));
				}
			}

			const artistData = {
				name: formData.name,
				role: formData.role,
				bio: formData.bio,
				specialties: formData.specialties
					.split(",")
					.map((s) => s.trim())
					.filter(Boolean),
				experience: formData.experience,
				instagram_url: formData.instagram_url,
				photo_url,
				imagekit_file_id,
				is_active: true,
			};

			if (editingArtist) {
				const { error } = await supabase
					.from("artists")
					.update(artistData)
					.eq("id", editingArtist.id);
				if (error) throw new Error(`Update failed: ${error.message}`);
				toast.success("Artist updated successfully!");
			} else {
				const { error } = await supabase.from("artists").insert([artistData]);
				if (error) throw new Error(`Insert failed: ${error.message}`);
				toast.success("Artist added successfully!");
			}

			fetchArtists();
			resetForm();
		} catch (error: any) {
			console.error("Artist save error:", error);
			toast.error(error.message || "Failed to save artist");
		} finally {
			setUploading(false);
		}
	};

	const editArtist = (artist: Artist) => {
		setEditingArtist(artist);
		setFormData({
			name: artist.name,
			role: artist.role,
			bio: artist.bio || "",
			experience: artist.experience || "",
			instagram_url: artist.instagram_url || "",
			specialties: artist.specialties?.join(", ") || "",
		});
		setSelectedFile(null);
		setImagePreview(artist.photo_url || null);
		setShowForm(true);
	};

	const deleteArtist = async (artist: Artist) => {
		if (!confirm(`Delete ${artist.name}? This cannot be undone.`)) return;

		try {
			await supabase.from("artists").delete().eq("id", artist.id);

			// Delete image from ImageKit
			if (artist.imagekit_file_id) {
				fetch("/api/imagekit/delete", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ fileId: artist.imagekit_file_id }),
				}).catch((err) => console.error("Failed to delete image:", err));
			}

			toast.success("Artist deleted");
			fetchArtists();
		} catch (error) {
			toast.error("Failed to delete artist");
		}
	};

	const toggleActive = async (artist: Artist) => {
		const { error } = await supabase
			.from("artists")
			.update({ is_active: !artist.is_active })
			.eq("id", artist.id);

		if (!error) {
			toast.success(
				artist.is_active ? "Artist hidden from site" : "Artist visible on site",
			);
			fetchArtists();
		}
	};

	if (loading) return <div className="py-20 text-center">Loading...</div>;

	return (
		<div>
			<div className="flex justify-between items-end mb-8">
				<div>
					<div className="section-label">TEAM</div>
					<h1 className="font-heading text-5xl tracking-[-2px]">
						Manage Artists
					</h1>
				</div>
				<button
					onClick={() => {
						resetForm();
						setShowForm(true);
					}}
					className="btn-gold flex items-center gap-2"
				>
					<Plus size={18} /> ADD ARTIST
				</button>
			</div>

			{showForm && (
				<div className="card-dark p-8 mb-8">
					<div className="flex items-center justify-between mb-6">
						<h2 className="font-heading text-2xl tracking-tight">
							{editingArtist ? "Edit Artist" : "Add New Artist"}
						</h2>
						<button
							onClick={resetForm}
							className="text-muted hover:text-cream transition-colors"
						>
							<X size={20} />
						</button>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Photo Upload */}
						<div>
							<label className="text-xs tracking-widest text-gold mb-3 block">
								ARTIST PHOTO
							</label>
							<div className="flex items-start gap-6">
								{/* Preview */}
								<div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 border border-gold/20 bg-dark2">
									{imagePreview ? (
										<img
											src={imagePreview}
											alt="Preview"
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center text-muted">
											<User size={40} strokeWidth={1} />
										</div>
									)}
								</div>

								<div className="flex-1 space-y-3">
									<div className="flex items-center gap-3">
										<label className="btn-outline-gold text-xs cursor-pointer inline-flex items-center gap-2">
											<Upload size={14} />
											{selectedFile ? "CHANGE PHOTO" : "SELECT PHOTO"}
											<input
												type="file"
												accept="image/*"
												onChange={handleFileSelect}
												className="hidden"
											/>
										</label>
										{selectedFile && (
											<button
												type="button"
												onClick={removeSelectedFile}
												className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1"
											>
												<X size={14} /> Remove
											</button>
										)}
									</div>
									{selectedFile && (
										<div className="text-xs text-gold/70">
											{selectedFile.name}
										</div>
									)}
									<p className="text-xs text-muted">
										Recommended: Square photo, at least 500×500px. Max 10MB.
									</p>
									{editingArtist && !selectedFile && imagePreview && (
										<p className="text-xs text-cream/50">
											Current photo will be kept unless you select a new one.
										</p>
									)}
								</div>
							</div>
						</div>

						{/* Name & Role */}
						<div className="grid md:grid-cols-2 gap-5">
							<div>
								<label className="text-xs tracking-widest text-gold mb-2 block">
									NAME
								</label>
								<input
									type="text"
									placeholder="Artist name"
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									className="input-dark"
									required
								/>
							</div>
							<div>
								<label className="text-xs tracking-widest text-gold mb-2 block">
									ROLE
								</label>
								<input
									type="text"
									placeholder="e.g. Lead Artist, Senior Artist"
									value={formData.role}
									onChange={(e) =>
										setFormData({ ...formData, role: e.target.value })
									}
									className="input-dark"
									required
								/>
							</div>
						</div>

						{/* Bio */}
						<div>
							<label className="text-xs tracking-widest text-gold mb-2 block">
								BIO
							</label>
							<textarea
								placeholder="Brief description about the artist..."
								value={formData.bio}
								onChange={(e) =>
									setFormData({ ...formData, bio: e.target.value })
								}
								className="input-dark"
								rows={3}
								required
							/>
						</div>

						{/* Experience, Specialties, Instagram */}
						<div className="grid md:grid-cols-2 gap-5">
							<div>
								<label className="text-xs tracking-widest text-gold mb-2 block">
									EXPERIENCE
								</label>
								<input
									type="text"
									placeholder="e.g. 5+ years"
									value={formData.experience}
									onChange={(e) =>
										setFormData({ ...formData, experience: e.target.value })
									}
									className="input-dark"
								/>
							</div>
							<div>
								<label className="text-xs tracking-widest text-gold mb-2 block">
									SPECIALTIES
								</label>
								<input
									type="text"
									placeholder="Mandala, Fine Line, Black & Gray"
									value={formData.specialties}
									onChange={(e) =>
										setFormData({ ...formData, specialties: e.target.value })
									}
									className="input-dark"
								/>
								<p className="text-xs text-muted mt-1">Separate with commas</p>
							</div>
						</div>

						<div>
							<label className="text-xs tracking-widest text-gold mb-2 block">
								INSTAGRAM URL
							</label>
							<input
								type="text"
								placeholder="https://instagram.com/username"
								value={formData.instagram_url}
								onChange={(e) =>
									setFormData({ ...formData, instagram_url: e.target.value })
								}
								className="input-dark"
							/>
						</div>

						{/* Buttons */}
						<div className="flex gap-3 pt-2">
							<button
								type="submit"
								disabled={uploading}
								className="btn-gold disabled:opacity-70"
							>
								{uploading
									? "UPLOADING..."
									: editingArtist
										? "UPDATE ARTIST"
										: "ADD ARTIST"}
							</button>
							<button
								type="button"
								onClick={resetForm}
								className="btn-outline-gold"
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			)}

			{/* Artists List */}
			<div className="space-y-4">
				{artists.length === 0 && (
					<div className="text-center py-16 text-muted">
						No artists added yet. Click "Add Artist" to get started.
					</div>
				)}

				{artists.map((artist) => (
					<div
						key={artist.id}
						className={`card-dark p-6 flex flex-col sm:flex-row gap-5 ${!artist.is_active ? "opacity-50" : ""}`}
					>
						{/* Photo */}
						<div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-dark2 border border-gold/10">
							{artist.photo_url ? (
								<img
									src={artist.photo_url}
									alt={artist.name}
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center text-muted">
									<User size={32} strokeWidth={1} />
								</div>
							)}
						</div>

						{/* Info */}
						<div className="flex-1 min-w-0">
							<div className="flex items-start justify-between gap-4">
								<div>
									<div className="font-heading text-2xl tracking-tight">
										{artist.name}
									</div>
									<div className="text-gold text-sm tracking-wider">
										{artist.role}
									</div>
								</div>
								{!artist.is_active && (
									<span className="text-xs px-3 py-1 rounded-full border border-red-400/30 text-red-400 flex-shrink-0">
										HIDDEN
									</span>
								)}
							</div>
							<p className="text-sm mt-2 text-cream/80 line-clamp-2">
								{artist.bio}
							</p>
							{artist.specialties && artist.specialties.length > 0 && (
								<div className="flex flex-wrap gap-1.5 mt-3">
									{artist.specialties.map((spec, idx) => (
										<span
											key={idx}
											className="px-3 py-0.5 text-xs border border-gold/20 rounded-full text-cream/70"
										>
											{spec}
										</span>
									))}
								</div>
							)}
						</div>

						{/* Actions */}
						<div className="flex sm:flex-col gap-2 flex-shrink-0">
							<button
								onClick={() => editArtist(artist)}
								className="px-4 py-2 hover:bg-dark rounded-xl flex items-center gap-2 text-sm transition-colors"
							>
								<Edit2 size={16} /> Edit
							</button>
							<button
								onClick={() => toggleActive(artist)}
								className="px-4 py-2 hover:bg-dark rounded-xl flex items-center gap-2 text-sm transition-colors"
							>
								{artist.is_active ? "🙈 Hide" : "👁️ Show"}
							</button>
							<button
								onClick={() => deleteArtist(artist)}
								className="px-4 py-2 text-sm text-red-400 hover:bg-red-950/30 rounded-xl flex items-center gap-2 transition-colors"
							>
								<Trash2 size={16} /> Delete
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
