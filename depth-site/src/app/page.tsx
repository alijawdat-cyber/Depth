export const dynamic = "force-static";

import Hero from "@/components/sections/Hero";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Packages from "@/components/sections/Packages";
import Testimonials from "@/components/sections/Testimonials";
import ClientsMarquee from "@/components/sections/ClientsMarquee";
import Stats from "@/components/sections/Stats";
import FAQ from "@/components/sections/FAQ";
import FounderSpotlight from "@/components/sections/FounderSpotlight";
import Link from "next/link";
import TrustSection from "@/components/sections/TrustSection";

export const revalidate = 3600;

export default function Home() {
  return (
    <div className="font-sans min-h-screen w-full overflow-x-hidden">
      <Header />
      <Hero />
      <div className="my-4 sm:my-6" />
      <TrustSection />
      <div className="my-4 sm:my-6" />
      <ClientsMarquee />
      <Stats />
      <Packages />
      <div className="flex justify-center mt-4 px-3">
        <Link href="/plans" className="underline decoration-dotted underline-offset-4 text-sm sm:text-base">قارن الخطط بالتفصيل</Link>
      </div>
      <FounderSpotlight />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}
