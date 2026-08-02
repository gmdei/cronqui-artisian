export interface SpoonableFlavor {
  id: string;
  name: string;
  badge?: string;
  isBestseller?: boolean;
  isGlutenFree?: boolean;
  description: string;
  shortDescription?: string;
  tags: string[];
  category: 'fruit' | 'citrus' | 'rich' | 'special';
  layers: string[];
  ingredients: string[];
  price: number;
  image: string;
  calories?: number;
  rating: number;
  reviewsCount: number;
  stock?: number; // Stock/inventory available
}

export interface CartItem {
  flavor: SpoonableFlavor;
  quantity: number;
  customization?: {
    size: 'Mini (200ml)' | 'Standard (350ml)' | 'Grand (750ml)';
    extraTopping?: string;
    giftNote?: string;
  };
}

export interface CustomJarBuild {
  size: 'Mini (200ml)' | 'Standard (350ml)' | 'Grand (750ml)';
  baseCream: string;
  cakeLayer: string;
  fruitCoulis: string;
  crunchTopping: string;
  quantity: number;
  giftMessage: string;
}

export interface BatchInfo {
  batchNumber: string;
  datePrepared: string;
  masterPastryChef: string;
  status: 'In Production' | 'Ready for Delivery' | 'Sold Out';
  jarsAvailable: number;
}

export interface ThemeSettings {
  primaryPalette: 'chocolate' | 'cream' | 'berry' | 'turquoise';
  titleFont: 'Playfair Display' | 'Cormorant Garamond' | 'Cinzel';
  heroBannerImage?: string;
  heidiPhotoUrl?: string;
  whatsappNumber: string;
  whatsappMessageTemplate: string;
  instagramUrl?: string;
  facebookUrl?: string;
}

