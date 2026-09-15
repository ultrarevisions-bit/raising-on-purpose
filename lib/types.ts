export interface PostMeta {
  title: string;
  slug: string;
  description: string;
  featuredImage: string;
  category: string;
  stage?: string;
  date: string;
  updated?: string;
  download?: string;
  downloadTitle?: string;
  excerpt: string;
  keywords?: string[];
  featured?: boolean;
  author?: string;
}

export interface Post extends PostMeta {
  content: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}