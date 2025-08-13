import { notFound } from 'next/navigation';
import { Container } from "@/components/ui/Container";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Link from "next/link";
import { blogPosts, getPostBySlug, getRecentPosts, type BlogPost } from "@/data/blog";
import type { Metadata } from 'next';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post: BlogPost) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'مقال غير موجود',
    };
  }

  return {
    title: post.seo.metaTitle,
    description: post.seo.metaDescription,
    keywords: post.seo.keywords.join(', '),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

function TableOfContents({ content }: { content: string }) {
  // Extract headings from markdown content
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings = [];
  let match;
  
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2];
    const id = text.toLowerCase().replace(/[^\u0600-\u06FF\w\s]/g, '').replace(/\s+/g, '-');
    headings.push({ level, text, id });
  }

  if (headings.length === 0) return null;

  return (
    <div className="bg-[var(--card)] border border-[var(--elev)] rounded-[var(--radius-lg)] p-6 mb-8">
      <h3 className="font-bold text-[var(--text)] mb-4">محتويات المقال</h3>
      <nav className="space-y-2">
        {headings.map((heading, index) => (
          <a
            key={index}
            href={`#${heading.id}`}
            className={`block text-sm hover:text-[var(--primary)] transition-colors ${
              heading.level === 1 ? 'font-medium text-[var(--text)]' :
              heading.level === 2 ? 'pr-4 text-[var(--slate-600)]' :
              'pr-8 text-[var(--slate-500)]'
            }`}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  );
}

function MarkdownRenderer({ content }: { content: string }) {
  // Simple markdown to HTML conversion for our content
  const processedContent = content
    // Headers
    .replace(/^### (.+)$/gm, '<h3 id="$1" class="text-xl font-bold text-[var(--text)] mt-8 mb-4">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 id="$1" class="text-2xl font-bold text-[var(--text)] mt-10 mb-6">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold text-[var(--text)] mb-6">$1</h1>')
    
    // Bold and italic
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-[var(--text)]">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[var(--primary)] hover:text-[var(--accent-700)] underline transition-colors">$1</a>')
    
    // Code blocks
    .replace(/```([^`]+)```/g, '<pre class="bg-[var(--bg)] border border-[var(--elev)] rounded p-4 my-4 overflow-x-auto"><code class="text-sm font-mono">$1</code></pre>')
    
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-[var(--bg)] px-2 py-1 rounded text-sm font-mono border">$1</code>')
    
    // Lists
    .replace(/^- (.+)$/gm, '<li class="mb-2">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="mb-2">$2</li>')
    
    // Paragraphs
    .replace(/^(?!<[h|l|p|d|u]|```)(.+)$/gm, '<p class="mb-4 leading-relaxed text-[var(--slate-600)]">$1</p>')
    
    // Line breaks
    .replace(/\n/g, '<br />');

  return (
    <div 
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
}

function RelatedPosts({ currentSlug }: { currentSlug: string }) {
  const relatedPosts = getRecentPosts(3).filter((post: BlogPost) => post.slug !== currentSlug);
  
  if (relatedPosts.length === 0) return null;

  return (
    <div className="mt-16 p-8 bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)]">
      <h3 className="text-2xl font-bold text-[var(--text)] mb-6">مقالات ذات صلة</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post: BlogPost) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="block p-4 bg-[var(--bg)] rounded-[var(--radius)] border hover:border-[var(--primary)] transition-colors"
          >
            <div className="text-sm text-[var(--slate-600)] mb-2">{post.category}</div>
            <h4 className="font-semibold text-[var(--text)] mb-2 line-clamp-2">{post.title}</h4>
            <p className="text-sm text-[var(--slate-600)] line-clamp-2">{post.excerpt}</p>
            <div className="text-xs text-[var(--slate-500)] mt-2">
              {post.readTime} دقائق قراءة
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Header />
      
      <main className="py-16">
        <Container>
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-[var(--slate-600)] mb-8">
            <Link href="/" className="hover:text-[var(--primary)]">الرئيسية</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[var(--primary)]">المدونة</Link>
            <span>/</span>
            <span className="text-[var(--text)]">{post.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Article Header */}
              <header className="mb-8">
                {post.featured && (
                  <div className="inline-block bg-[var(--primary)] text-white px-3 py-1 text-sm font-medium rounded mb-4">
                    مقال مميز
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm text-[var(--slate-600)] mb-4">
                  <span className="bg-[var(--bg)] px-3 py-1 rounded-full border font-medium">
                    {post.category}
                  </span>
                  <span>•</span>
                  <span>{post.readTime} دقائق قراءة</span>
                  <span>•</span>
                  <span>{new Date(post.publishedAt).toLocaleDateString('ar-SA')}</span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-[var(--text)] mb-6 leading-tight">
                  {post.title}
                </h1>

                <p className="text-xl text-[var(--slate-600)] leading-relaxed mb-8">
                  {post.excerpt}
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4 p-4 bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)]">
                  <div className="w-12 h-12 bg-[var(--primary)] rounded-full flex items-center justify-center text-white font-bold">
                    {post.author.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--text)]">{post.author.name}</div>
                    <div className="text-sm text-[var(--slate-600)]">{post.author.role}</div>
                  </div>
                </div>
              </header>

              {/* Article Content */}
              <article className="prose prose-lg max-w-none">
                <MarkdownRenderer content={post.content} />
              </article>

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-[var(--elev)]">
                <h4 className="font-semibold text-[var(--text)] mb-4">الكلمات المفتاحية:</h4>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string, index: number) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-[var(--bg)] text-[var(--slate-600)] rounded-full text-sm border hover:border-[var(--primary)] transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Section */}
              <div className="mt-12 p-8 bg-gradient-to-r from-[var(--primary)]/10 to-[var(--accent-500)]/10 rounded-[var(--radius-lg)] border border-[var(--primary)]/20">
                <h3 className="text-2xl font-bold text-[var(--text)] mb-4">
                  هل أعجبك هذا المقال؟
                </h3>
                <p className="text-[var(--slate-600)] mb-6">
                  احجز استشارة مجانية مع فريقنا لنساعدك في تطبيق هذه الاستراتيجيات على مشروعك.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/book"
                    className="inline-flex items-center justify-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-[var(--radius)] font-medium hover:bg-[var(--accent-700)] transition-colors"
                  >
                    احجز استشارة مجانية
                  </Link>
                  <Link 
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 border border-[var(--primary)] text-[var(--primary)] px-6 py-3 rounded-[var(--radius)] font-medium hover:bg-[var(--primary)] hover:text-white transition-colors"
                  >
                    تواصل معنا
                  </Link>
                </div>
              </div>

              {/* Related Posts */}
              <RelatedPosts currentSlug={post.slug} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {/* Table of Contents */}
                <TableOfContents content={post.content} />

                {/* Newsletter/Contact Card */}
                <div className="bg-[var(--card)] border border-[var(--elev)] rounded-[var(--radius-lg)] p-6">
                  <h4 className="font-bold text-[var(--text)] mb-4">تريد المزيد من النصائح؟</h4>
                  <p className="text-sm text-[var(--slate-600)] mb-4">
                    احجز جلسة مع خبراء Depth واحصل على استراتيجية مخصصة لنشاطك.
                  </p>
                  <Link 
                    href="/book"
                    className="block text-center bg-[var(--primary)] text-white px-4 py-2 rounded-[var(--radius)] text-sm font-medium hover:bg-[var(--accent-700)] transition-colors"
                  >
                    احجز جلسة
                  </Link>
                </div>

                {/* Social Share */}
                <div className="bg-[var(--card)] border border-[var(--elev)] rounded-[var(--radius-lg)] p-6">
                  <h4 className="font-bold text-[var(--text)] mb-4">شارك المقال</h4>
                  <div className="space-y-3">
                    <a 
                      href={`https://wa.me/?text=${encodeURIComponent(post.title + ' - https://depth-agency.com/blog/' + post.slug)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-[var(--slate-600)] hover:text-green-600 transition-colors"
                    >
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                        <span className="text-xs">W</span>
                      </div>
                      شارك عبر الواتساب
                    </a>
                    <a 
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://depth-agency.com/blog/' + post.slug)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-[var(--slate-600)] hover:text-blue-600 transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                        <span className="text-xs">f</span>
                      </div>
                      شارك عبر فيسبوك
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
