export const dynamic = "force-dynamic";

import Hero from "@/components/sections/Hero";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Packages from "@/components/sections/Packages";
import Testimonials from "@/components/sections/Testimonials";
import ClientsMarquee from "@/components/sections/ClientsMarquee";
import Stats from "@/components/sections/Stats";
import FAQ from "@/components/sections/FAQ";

export const revalidate = 3600;

export default function Home() {
  return (
    <div className="font-sans">
      <Header />
      <Hero />
      <ClientsMarquee />
      <Stats />
      <Packages />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}
