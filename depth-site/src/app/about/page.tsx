export const metadata = {
  title: "من نحن | Depth",
  description: "تعرف على فريق Depth - استوديو المحتوى المبدع الذي يحول أفكارك إلى نتائج قابلة للقياس.",
};

import TeamSection from "@/components/about/TeamSection";
import AboutHero from "@/components/sections/AboutHero";
import AboutStory from "@/components/sections/AboutStory";

export default function AboutPage() {
  return (
    <main className="min-h-screen" dir="rtl">
      <AboutHero />
      <AboutStory />
      <TeamSection />
    </main>
  );
}


