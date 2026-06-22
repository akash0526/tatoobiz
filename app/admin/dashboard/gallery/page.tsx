"use client";

import React, { useState, useEffect } from "react";
import { Upload, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { STYLES } from "@/lib/constants";

interface GalleryItem {
	id: string;
	title: string;
	style: string;
	artist_name: string;
	image_url: string;
	imagekit_file_id?: string;
	is_featured: boolean;
}

export default function GalleryManager() {
	const [gallery, setGallery] = useState<GalleryItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [showUpload, setShowUpload] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [newPhoto, setNewPhoto] = useState({
		title: "",
		style: "",
		artist_name: "",
	});
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const fetchGallery = async () => {
		const { data, error } = await supabase
			.from("gallery_items")
			.select("*")
			.order("created_at", { ascending: false });

		if (error) toast.error("Failed to load gallery");
		else setGallery(data || []);
		setLoading(false);
	};

	useEffect(() => {
		fetchGallery();
	}, []);

	// Handle file selection
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
		}
	};

	// Upload to ImageKit + Supabase
	const handleUpload = async (e: React.FormEvent) => {
		e.preventDefault();

		if (
			!newPhoto.title ||
			!newPhoto.style ||
			!newPhoto.artist_name ||
			!selectedFile
		) {
			toast.error("Please fill all fields and select a file");
			return;
		}

		setUploading(true);

		try {
			// 1. Get ImageKit auth params from our API route
			const authRes = await fetch("/api/imagekit/auth");
			if (!authRes.ok) {
				const errData = await authRes.json().catch(() => ({}));
				throw new Error(errData.error || "Failed to get ImageKit auth params");
			}
			const authParams = await authRes.json();

			// 2. Upload to ImageKit (publicKey is REQUIRED for client-side uploads)
			const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
			if (!publicKey) {
				throw new Error("ImageKit public key is not configured");
			}

			const formData = new FormData();
			formData.append("file", selectedFile);
			formData.append("publicKey", publicKey);
			formData.append("fileName", `${Date.now()}-${selectedFile.name}`);
			formData.append("folder", "/gallery/");
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
				throw new Error(`ImageKit upload failed: ${uploadRes.status}`);
			}

			const uploadData = await uploadRes.json();

			// 3. Save to Supabase
			const { error } = await supabase.from("gallery_items").insert([
				{
					title: newPhoto.title,
					style: newPhoto.style,
					artist_name: newPhoto.artist_name,
					image_url: uploadData.url,
					imagekit_file_id: uploadData.fileId,
					is_featured: false,
				},
			]);

			if (error) {
				console.error("Supabase insert error:", error);
				throw new Error(`Database save failed: ${error.message}`);
			}

			toast.success("Photo uploaded successfully!");
			setNewPhoto({ title: "", style: "", artist_name: "" });
			setSelectedFile(null);
			setShowUpload(false);
			fetchGallery();
		} catch (error: any) {
			console.error("Upload error:", error);
			toast.error(error.message || "Upload failed. Please try again.");
		} finally {
			setUploading(false);
		}
	};

	const toggleFeatured = async (id: string, current: boolean) => {
		const { error } = await supabase
			.from("gallery_items")
			.update({ is_featured: !current })
			.eq("id", id);

		if (!error) {
			toast.success("Updated successfully");
			fetchGallery();
		}
	};

	const deletePhoto = async (id: string, fileId?: string) => {
		if (!confirm("Delete this photo?")) return;

		try {
			// Delete from Supabase
			await supabase.from("gallery_items").delete().eq("id", id);

			// Optionally delete from ImageKit (if fileId exists)
			if (fileId) {
				await fetch("/api/imagekit/delete", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ fileId }),
				});
			}

			toast.success("Photo deleted");
			fetchGallery();
		} catch (error) {
			toast.error("Failed to delete");
		}
	};

	if (loading)
		return <div className="text-center py-20">Loading gallery...</div>;

	return (
		<div>
			<div className="flex justify-between items-end mb-8">
				<div>
					<div className="section-label">PORTFOLIO</div>
					<h1 className="font-heading text-5xl tracking-[-2px]">
						Gallery Manager
					</h1>
				</div>
				<button
					onClick={() => setShowUpload(!showUpload)}
					className="btn-gold flex items-center gap-2"
				>
					<Upload size={18} /> UPLOAD PHOTO
				</button>
			</div>

			{showUpload && (
				<div className="card-dark p-8 mb-8">
					<form onSubmit={handleUpload} className="space-y-6">
						<div className="grid md:grid-cols-2 gap-6">
							<div>
								<label className="text-xs tracking-widest text-gold mb-2 block">
									PHOTO TITLE
								</label>
								<input
									type="text"
									value={newPhoto.title}
									onChange={(e) =>
										setNewPhoto({ ...newPhoto, title: e.target.value })
									}
									className="input-dark"
									required
								/>
							</div>
							<div>
								<label className="text-xs tracking-widest text-gold mb-2 block">
									STYLE
								</label>
								<select
									value={newPhoto.style}
									onChange={(e) =>
										setNewPhoto({ ...newPhoto, style: e.target.value })
									}
									className="input-dark"
									required
								>
									<option value="">Select style</option>
									{STYLES.map((s) => (
										<option key={s} value={s}>
											{s}
										</option>
									))}
								</select>
							</div>
							<div>
								<label className="text-xs tracking-widest text-gold mb-2 block">
									ARTIST
								</label>
								<input
									type="text"
									value={newPhoto.artist_name}
									onChange={(e) =>
										setNewPhoto({ ...newPhoto, artist_name: e.target.value })
									}
									className="input-dark"
									required
								/>
							</div>
							<div>
								<label className="text-xs tracking-widest text-gold mb-2 block">
									SELECT IMAGE
								</label>
								<input
									type="file"
									accept="image/*"
									onChange={handleFileSelect}
									className="input-dark"
									required
								/>
								{selectedFile && (
									<div className="text-xs text-gold mt-1">
										{selectedFile.name}
									</div>
								)}
							</div>
						</div>

						<div className="flex gap-3">
							<button
								type="submit"
								disabled={uploading}
								className="btn-gold disabled:opacity-70"
							>
								{uploading ? "UPLOADING..." : "UPLOAD TO GALLERY"}
							</button>
							<button
								type="button"
								onClick={() => {
									setShowUpload(false);
									setSelectedFile(null);
								}}
								className="btn-outline-gold"
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
				{gallery.map((item) => (
					<div key={item.id} className="card-dark overflow-hidden group">
						<div className="relative aspect-[4/3]">
							<img
								src={item.image_url}
								alt={item.title}
								className="w-full h-full object-cover"
							/>
							{item.is_featured && (
								<div className="absolute top-3 left-3 bg-gold text-black px-3 py-1 text-xs tracking-wider rounded-full flex items-center gap-1">
									<Star size={12} /> FEATURED
								</div>
							)}
						</div>
						<div className="p-5">
							<div className="font-medium text-lg tracking-tight">
								{item.title}
							</div>
							<div className="text-sm text-gold mt-0.5">
								{item.style} • {item.artist_name}
							</div>
							<div className="flex items-center gap-2 mt-4">
								<button
									onClick={() => toggleFeatured(item.id, item.is_featured)}
									className="flex-1 btn-outline-gold text-xs py-2 flex items-center justify-center gap-1.5"
								>
									<Star size={14} />{" "}
									{item.is_featured ? "Unfeature" : "Feature"}
								</button>
								<button
									onClick={() => deletePhoto(item.id, item.imagekit_file_id)}
									className="px-4 py-2 text-red-400 hover:bg-red-950/30 rounded-xl transition"
								>
									<Trash2 size={16} />
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
