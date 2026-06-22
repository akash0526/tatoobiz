export const STUDIO_INFO = {
  name: "Tattoo Biz Butwal",
  tagline: "Where Art Meets Skin — Sacred Stories Inked for Eternity",
  location: "B.P. Chowk, Butwal, Nepal",
  phone: "071-590044",
  whatsapp: "+977 9857089950",
  whatsappNumber: "9779857089950",
  email: "tattoobizbutwal@gmail.com",
  instagram: "@tattoobizbutwal",
  facebook: "/tattoobizbutwal",
  tiktok: "@tattoobizbutwal",
  googleRating: 4.5,
  founded: 2016,
  artists: 3,
  clients: "500+",
  years: "8+",
};

export const SOCIAL_LINKS = {
  whatsapp: `https://wa.me/${STUDIO_INFO.whatsappNumber}`,
  instagram: `https://www.instagram.com/${STUDIO_INFO.instagram.replace('@', '')}`,
  facebook: `https://www.facebook.com/${STUDIO_INFO.facebook.replace('/', '')}`,
  tiktok: `https://www.tiktok.com/${STUDIO_INFO.tiktok}`,
};

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/artists", label: "Artists" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const STYLES = [
  "Hindu Mythology",
  "Mandala",
  "Sacred Geometry",
  "Black & Gray",
  "Fine Line",
  "Color",
  "Cover-Up",
] as const;

export const ARTISTS_LIST = ["Bijay", "Samir", "Sunita Magar", "No preference"] as const;
