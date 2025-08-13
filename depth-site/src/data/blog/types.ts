export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  featured: boolean;
  image: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}
