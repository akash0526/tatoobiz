import Hero from '@/components/home/Hero';
import MarqueeBanner from '@/components/home/MarqueeBanner';
import StatsBar from '@/components/home/StatsBar';
import AboutPreview from '@/components/home/AboutPreview';
import FeaturedGallery from '@/components/home/FeaturedGallery';
import ServicesPreview from '@/components/home/ServicesPreview';
import ArtistsPreview from '@/components/home/ArtistsPreview';
import WhatsAppFAB from '@/components/layout/WhatsAppFAB';

export default function Home() {
  return (
    <>
      <Hero />
      <MarqueeBanner />
      <StatsBar />
      <AboutPreview />
      <FeaturedGallery />
      <ServicesPreview />
      <ArtistsPreview />
      <WhatsAppFAB />
    </>
  );
}
