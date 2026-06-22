export interface GalleryItem {
  id: string;
  title: string;
  style: string;
  artist_name: string;
  image_url: string;
  imagekit_file_id?: string;
  is_featured: boolean;
  created_at: string;
}

export interface Artist {
  id: string;
  name: string;
  role: string;
  bio: string;
  specialties: string[];
  photo_url?: string;
  imagekit_file_id?: string;
  experience: string;
  instagram_url?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  is_active: boolean;
  order_index: number;
  created_at: string;
}

export interface Booking {
  id: string;
  name: string;
  phone: string;
  email?: string;
  design_idea?: string;
  style?: string;
  body_part?: string;
  preferred_date?: string;
  preferred_artist?: string;
  message?: string;
  status: 'new' | 'contacted' | 'booked' | 'completed' | 'cancelled';
  created_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  rating: number;
  review_text: string;
  tattoo_type?: string;
  is_approved: boolean;
  created_at: string;
}

export interface BookingFormData {
  name: string;
  phone: string;
  email?: string;
  style?: string;
  preferred_artist?: string;
  body_part?: string;
  design_idea?: string;
  preferred_date?: string;
  message?: string;
}
