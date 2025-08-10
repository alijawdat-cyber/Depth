"use client";

import { Container } from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { Carousel } from "@/components/ui/Carousel";
import { testimonials } from "@/data/testimonials";
// نستخدم <img> للـ SVGs المحلية لتقليل overhead

const items: never[] = [];

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-[var(--card)]">
      <Container>
        <SectionHeading title="قالوا عنّا" align="center" className="mb-8" />
        <Carousel options={{ loop: true, duration: 20 }}>
          {testimonials.map((t) => (
            <figure key={t.id} className="min-w-0 shrink-0 basis-full md:basis-[58%] lg:basis-[42%] rounded-[var(--radius)] border border-[var(--elev)] p-6 bg-[var(--card)]">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <img src={t.client.logo} alt={t.client.name} className={`${t.client.slug === "blo" ? "h-16 md:h-20" : "h-20 md:h-24"} w-auto object-contain min-w-24 logo-enhanced`} loading="lazy" decoding="async" />
                  <div className="flex items-center gap-1 text-[var(--accent-500)]" aria-label={`تقييم ${t.rating} من 5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`inline-block w-3 h-3 rounded-full ${i < t.rating ? 'bg-[var(--accent-500)]' : 'bg-[var(--elev)]'}`} />
                    ))}
                  </div>
                </div>
                <div className="text-xs text-[var(--slate-600)]">{t.dateISO?.slice(0,10)}</div>
              </div>
              <blockquote className="text-sm text-[var(--slate-600)] leading-7">{t.quote}</blockquote>
              {t.results?.length ? (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {t.results.map((r) => (
                    <li key={r} className="px-2 py-1 text-xs rounded-full border border-[var(--elev)] bg-[var(--card)]">{r}</li>
                  ))}
                </ul>
              ) : null}
              <figcaption className="mt-4 font-medium flex items-center gap-3">
                <span>{t.person.name} — <span className="text-[var(--slate-600)]">{t.person.role}</span></span>
              </figcaption>
            </figure>
          ))}
        </Carousel>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              itemListElement: testimonials.map((t, i) => ({
                '@type': 'Review',
                position: i + 1,
                reviewBody: t.quote,
                author: { '@type': 'Person', name: t.person.name },
                itemReviewed: { '@type': 'Organization', name: t.client.name },
                reviewRating: { '@type': 'Rating', ratingValue: t.rating, bestRating: 5 },
                datePublished: t.dateISO,
              })),
            }),
          }}
        />
      </Container>
    </section>
  );
}


