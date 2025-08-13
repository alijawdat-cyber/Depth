// Main blog data exports
export type { BlogPost } from './types';

// Individual post imports
import { socialMediaStrategiesPost } from './social-media-strategies';
import { packageSelectionGuidePost } from './package-selection-guide';
import { photographyMistakesPost } from './photography-mistakes';
import { marketingMetricsPost } from './marketing-metrics';

// Combined blog posts array
export const blogPosts = [
  socialMediaStrategiesPost,
  packageSelectionGuidePost,
  photographyMistakesPost,
  marketingMetricsPost
];

// Helper functions (preserved from original)
export const getFeaturedPosts = () => {
  return blogPosts.filter(post => post.featured);
};

export const getPostsByCategory = (category: string) => {
  return blogPosts.filter(post => post.category === category);
};

export const getPostBySlug = (slug: string) => {
  return blogPosts.find(post => post.slug === slug);
};

export const getAllCategories = () => {
  const categories = blogPosts.map(post => post.category);
  return [...new Set(categories)];
};

export const getRecentPosts = (limit: number = 3) => {
  return blogPosts
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
};
