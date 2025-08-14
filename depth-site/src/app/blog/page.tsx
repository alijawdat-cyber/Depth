export const metadata = {
  title: "المدونة - نصائح وخبرات تسويقية",
  description: "مقالات عملية حول التسويق الرقمي، استراتيجيات المحتوى، والتصوير التجاري. خبرات حقيقية من السوق العراقي.",
};

// تصدير ثابت
export const dynamic = "force-static";

import { Container } from "@/components/ui/Container";

import PageLayout from "@/components/layout/PageLayout";
import Link from "next/link";
import { blogPosts, getFeaturedPosts, getAllCategories, type BlogPost } from "@/data/blog";

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)] overflow-hidden hover:shadow-lg transition-shadow">
      {/* Featured Badge */}
      {post.featured && (
        <div className="bg-[var(--primary)] text-white px-3 py-1 text-xs font-medium inline-block">
          مميز
        </div>
      )}
      
      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-[var(--slate-600)] mb-3">
          <span className="bg-[var(--bg)] px-2 py-1 rounded text-xs font-medium">
            {post.category}
          </span>
          <span>•</span>
          <span>{post.readTime} دقائق قراءة</span>
          <span>•</span>
          <span>{new Date(post.publishedAt).toLocaleDateString('ar-SA')}</span>
        </div>
        
        <h3 className="text-xl font-bold text-[var(--text)] mb-3 line-clamp-2">
          {post.title}
        </h3>
        
        <p className="text-[var(--slate-600)] mb-4 line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[var(--primary)] rounded-full flex items-center justify-center text-white text-sm font-medium">
              {post.author.name.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-medium text-[var(--text)]">{post.author.name}</div>
              <div className="text-xs text-[var(--slate-600)]">{post.author.role}</div>
            </div>
          </div>
          
          <Link 
            href={`/blog/${post.slug}`}
            className="text-[var(--primary)] hover:text-[var(--accent-700)] font-medium text-sm transition-colors"
          >
            اقرأ المقال ←
          </Link>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.slice(0, 3).map((tag: string, index: number) => (
            <span 
              key={index}
              className="text-xs bg-[var(--bg)] text-[var(--slate-600)] px-2 py-1 rounded border"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}



export default function BlogPage() {
  const featuredPosts = getFeaturedPosts();
  const categories = getAllCategories();


  return (
    <PageLayout>
      <div className="py-16">
        <Container>
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--text)] mb-6">
              المدونة
            </h1>
            <p className="text-xl text-[var(--slate-600)] max-w-3xl mx-auto leading-relaxed">
              نصائح عملية، استراتيجيات مثبتة، وخبرات حقيقية من عالم التسويق الرقمي والمحتوى. 
              كل مقال مبني على تجربة عملية مع عملائنا.
            </p>
          </div>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-[var(--text)] mb-8">المقالات المميزة</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredPosts.map((post: BlogPost) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}

          {/* Category Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16 p-6 bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)]">
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--primary)] mb-2">{blogPosts.length}</div>
              <div className="text-sm text-[var(--slate-600)]">مقال منشور</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--primary)] mb-2">{categories.length}</div>
              <div className="text-sm text-[var(--slate-600)]">فئة مختلفة</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--primary)] mb-2">40+</div>
              <div className="text-sm text-[var(--slate-600)]">مشروع مدروس</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--primary)] mb-2">100%</div>
              <div className="text-sm text-[var(--slate-600)]">خبرة عملية</div>
            </div>
          </div>

          {/* All Posts */}
          <div>
            <h2 className="text-2xl font-bold text-[var(--text)] mb-8">جميع المقالات</h2>
            
            {/* Categories Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category: string) => (
                <span 
                  key={category}
                  className="px-3 py-1 bg-[var(--bg)] text-[var(--slate-600)] rounded-full text-sm border"
                >
                  {category}
                </span>
              ))}
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post: BlogPost) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center p-8 bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--elev)]">
            <h3 className="text-2xl font-bold text-[var(--text)] mb-4">
              هل تريد تطبيق هذه الاستراتيجيات على مشروعك؟
            </h3>
            <p className="text-[var(--slate-600)] mb-6 max-w-2xl mx-auto">
              احجز استشارة مجانية مع فريقنا لنساعدك في وضع استراتيجية تسويقية مخصصة لنشاطك التجاري.
            </p>
            <Link 
              href="/book"
              className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-[var(--radius)] font-medium hover:bg-[var(--accent-700)] transition-colors"
            >
              احجز استشارة مجانية
            </Link>
          </div>
        </Container>
      </div>
    </PageLayout>
  );
}


