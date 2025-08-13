import { Container } from "@/components/ui/Container";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--elev)] py-10 text-sm text-[var(--slate-600)]">
      <Container>
        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-5 mb-8">
          <Link href="/plans" className="hover:text-[var(--text)] transition-colors">الخطط</Link>
          <Link href="/services" className="hover:text-[var(--text)] transition-colors">الخدمات</Link>
          <Link href="/work" className="hover:text-[var(--text)] transition-colors">الأعمال</Link>
          <Link href="/about" className="hover:text-[var(--text)] transition-colors">من نحن</Link>
          <Link href="/blog" className="hover:text-[var(--text)] transition-colors">المدونة</Link>
          <Link href="/contact" className="hover:text-[var(--text)] transition-colors">تواصل</Link>
          <Link href="/book" className="hover:text-[var(--text)] transition-colors">حجز</Link>
          <Link href="/portal" className="hover:text-[var(--text)] transition-colors">بوابة العميل</Link>
          <Link href="/legal" className="hover:text-[var(--text)] transition-colors">الشروط</Link>
        </nav>

        {/* Social Media Icons - Centered */}
        <div className="flex justify-center items-center gap-6 mb-8">
          {/* Instagram */}
          <a 
            href="https://www.instagram.com/depth_agency/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[var(--slate-600)] hover:text-[var(--primary)] transition-colors duration-200"
            aria-label="Instagram"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>

          {/* Facebook */}
          <a 
            href="https://www.facebook.com/depthagency" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[var(--slate-600)] hover:text-[var(--primary)] transition-colors duration-200"
            aria-label="Facebook"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>

          {/* LinkedIn */}
          <a 
            href="https://www.linkedin.com/company/depth-agency/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[var(--slate-600)] hover:text-[var(--primary)] transition-colors duration-200"
            aria-label="LinkedIn"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>

          {/* TikTok */}
          <a 
            href="https://www.tiktok.com/@depth_agency" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[var(--slate-600)] hover:text-[var(--primary)] transition-colors duration-200"
            aria-label="TikTok"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
            </svg>
          </a>

          {/* Snapchat */}
          <a 
            href="https://www.snapchat.com/add/depth_agency" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[var(--slate-600)] hover:text-[var(--primary)] transition-colors duration-200"
            aria-label="Snapchat"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.121,0.025C5.568,0.025 0.25,5.343 0.25,11.896c0,3.127 1.212,5.963 3.188,8.062l-2.1,7.8l7.958-2.158 c1.96,1.094 4.238,1.721 6.675,1.721c6.553,0 11.871-5.318 11.871-11.871C27.842,5.368 18.674,0.025 12.121,0.025z M12.121,21.753c-2.052,0-3.94-0.631-5.507-1.709l-0.394-0.235l-4.089,1.107l1.092-4.058l-0.258-0.408 c-1.181-1.881-1.862-4.098-1.862-6.47c0-5.426 4.415-9.841 9.841-9.841c2.627,0 5.098,1.024 6.956,2.882 c1.859,1.859 2.882,4.329 2.882,6.956C21.782,17.377 17.467,21.753 12.121,21.753z M17.494,14.382 c-0.297-0.149-1.758-0.867-2.03-0.967c-0.273-0.099-0.471-0.148-0.67,0.15c-0.197,0.297-0.767,0.966-0.94,1.164 c-0.173,0.199-0.347,0.223-0.644,0.075c-0.297-0.15-1.255-0.463-2.39-1.475c-0.883-0.788-1.48-1.761-1.653-2.059 c-0.173-0.297-0.018-0.458,0.13-0.606c0.134-0.133,0.298-0.347,0.446-0.52c0.149-0.174,0.198-0.298,0.298-0.497 c0.099-0.198,0.05-0.371-0.025-0.52c-0.075-0.149-0.669-1.612-0.916-2.207c-0.242-0.579-0.487-0.5-0.669-0.51 c-0.173-0.008-0.371-0.01-0.57-0.01c-0.198,0-0.52,0.074-0.792,0.372c-0.272,0.297-1.04,1.016-1.04,2.479 c0,1.462 1.065,2.875 1.213,3.074c0.149,0.198 2.096,3.2 5.077,4.487c0.709,0.306 1.262,0.489 1.694,0.625 c0.712,0.227 1.36,0.195 1.871,0.118c0.571-0.085 1.758-0.719 2.006-1.413c0.248-0.694 0.248-1.289 0.173-1.413 C17.967,14.651 17.769,14.532 17.494,14.382"/>
            </svg>
          </a>

          {/* WhatsApp */}
          <a 
            href="https://wa.me/9647779761547?text=مرحباً! أريد الاستفسار عن خدماتكم" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[var(--slate-600)] hover:text-[var(--primary)] transition-colors duration-200"
            aria-label="WhatsApp"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.064 3.488"/>
            </svg>
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="font-semibold text-[var(--text)]">Depth</span>
            <span suppressHydrationWarning>© {new Date().getFullYear()}</span>
          </div>
          <div className="mt-2 text-xs">
            <a href="mailto:hello@depth-agency.com" className="hover:text-[var(--text)] transition-colors">hello@depth-agency.com</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}



