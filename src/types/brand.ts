export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  logo?: string;
  coverImage?: string;
  website?: string;
  heritage?: string;
  category: string;
  featured: boolean;
  color?: string;
  products?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BrandCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  brands: Brand[];
}
