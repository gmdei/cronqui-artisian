import { SpoonableFlavor, BatchInfo, ThemeSettings } from '../types';

export const LOGO_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuCh8tg73y5qFpdWDR2JwYbzAtHy0Lq7WXwjeprICXyg1rNhxyo-HujVQazgoNXHup3RsxGKGVyEAurTNBmJ77bE3LXFPKZ5BM8TGet6t6lHxSXbgc-dw_dCKWrkZOvA7pCtCnwXx3UIQexww9EGdc8Be034htLA0E5_ezZxO5ZrfIiApWSwEA2-f6aMfPCsqxpKvArJ0kTROVNWGo7zFhjm3EXxBbvOYQMwlnXc6IPMsi7XeSuKKkhHhEmXUQFGbFrp1Q";

export const FOOTER_LOGO_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuDaUfm6Sn_qHwKQV3Un7pCCIO0KfEhkzx9UYFHWiTcdhRdnWKMTpgDoT7bF426KKl2mfaSVutEnfzTbqeTAH9hLr8gk6AUI8wZ_tFpJbKbZOj5kHljsy-_t9xy80-2FeF-mYhWFIHdDRkjS3SpDZlVFvcLHLtok3qlqa_Wq3LFYDqAFeXFBG0qBzKO1pd664AnMRaS89jI2Aaxy4LtcIZhqv_2m1wWhDHRG3Sftj4W4eFjK2tf5eFAVrhonyDZ4C32qwQ";

import heidiPhoto from '../../assets/heidi.jpg';

export const HEIDI_PHOTO_URL = heidiPhoto;
export const HEIDI_PHOTO_BACKUP = "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80";

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  primaryPalette: 'turquoise',
  titleFont: 'Playfair Display',
  heidiPhotoUrl: HEIDI_PHOTO_URL,
  whatsappNumber: '+15551234567',
  whatsappMessageTemplate: '¡Hola equipo CRUNQI! Me gustaría realizar un pedido de los siguientes postres artesanales:\n\n{items}\n\nTotal: ${total}',
  instagramUrl: 'https://instagram.com/crunqi',
  facebookUrl: 'https://facebook.com/crunqi'
};


export const HERO_IMAGES = {
  pistachioRaspberry: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0wTbdLWQwnllGRPSV1YSbXrK4m12tun4pYaNDSKFMunG2HwEV1vDlS3x08mYyajhpFDmwGcTRQ_GmbifvSLx1j-17iZBurG_o6y7L2BSHDaFJavytcF6Xp1rJquzOTYW--TiGBEv5RQj_9lbgf826NB-OxCllDOnONE37X31hW7JZOKI1quYfwgzzWBXH2MbAjtgnYTri9YsfBGnn1UUrvwrQB7PQwwc2Ik0IqchVh5N5hfMLZKNz",
  assortmentJars: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpNK_J-uP7UB2UkzoXJC6tswQaCiglbzBqqk9WljU1kLolobI1aKlx_g-szL4-frVabCAtC6roFFTUltbyqk90Ljg4vNXICtLf7ldKQlxXm8pEF8vOe1Ypv6viyhvHpPwHgtqvQRqv91XhV_Wxq1xg0qCaXPSJEjUeFxUfiojdBwjztR3S9vIAxnjxjNfxFqSZsh6qjxTlyv2fQb1EVzZdcHDHlZHv5uNvFisfx2J8jRWTZR46iDf3",
  chocolateTopView: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvAWDycRsGkAhLIVWdEiZNMd_IkoH0WcLS3pKHh0wI9DkiDrHOjo3MkqFaSrIRB5FNoEDotx9M63aY6Omy1oAzwE85fH5x1qxew484W9N5L7ulkp9HNsyxnujukScwKtRKwpsqNLWu4GcN84Xbbr8G4WOwJPeJ10N4NfeVm6W7NDYHyOy97SwORIBtVsis7hg2rqPOGGgTvuUlu4CYPO3_e9llzPc30P0RpHwcjLv_BvRLQBvdgq4d",
  spoonBite: "https://lh3.googleusercontent.com/aida-public/AB6AXuDG1wykRCS4Xv0awEtA1lwezxU9Lcz36qwvL_U3ZiYG4ABYkkiFyvnDyYxPbYAqtA1yYIFbFyL0lNV9Ry8_w2HdY519g8oqEj82OV3g5kr5TUh1lIHzqf3yz5nbbR1bmDZFbJD_m5yET92ppBSxUjOV4NxkjrOO20HAPNmzQUv5-jVDTouDRRWJXrSOA_PCS_jiafo9GfkcFDhsSTotKyT-ZMZX0JOipuRVQ9ZH4Oq2PyvvKoA8_Sqa"
};

export const SPOONABLES_FLAVORS: SpoonableFlavor[] = [
  {
    id: 'berry-velvet',
    name: 'Berry Velvet™',
    badge: 'Bestseller',
    isBestseller: true,
    isGlutenFree: true,
    category: 'fruit',
    description: 'A reimagined Strawberry Tiramisu with layers of ladyfinger-style cake, rich mascarpone cream, and fresh strawberry coulis.',
    shortDescription: 'Strawberry Tiramisu with mascarpone cream & strawberry coulis.',
    tags: ['Strawberry', 'Mascarpone', 'Gluten Free'],
    layers: [
      'Fresh Strawberry Coulis Infusion',
      'Velvety Mascarpone & Vanilla Bean Cream',
      'Gluten-Free Ladyfinger Sponge',
      'Artisanal Strawberry Glaze & Freeze-Dried Berries'
    ],
    ingredients: [
      'Fresh Strawberries', 'Mascarpone Cheese', 'Gluten-Free Flour', 'Organic Cane Sugar', 'Pure Vanilla Extract', 'Heavy Cream', 'Lemon Juice'
    ],
    price: 9.50,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxo3zAuTOcfsSataHEVO0imunoM6gQyPsJ9Xn-EDC2vYI7NTXsaQKK4Eeir1na7O2HxrUF8jO5Y90uAMg2Au0WqEZjJ6rPacu4YiX-urVrqO1tgpNcBwf6E4KvVQVcRxR9T2saMtYYbxPA0u-fLNWX1cLZtzqW4NcEe30doKjYyJ_CCfOsZgTD9KVGaQ_Mlk3SboLJCNuwtG79GlzDkEA0GoBLSThxgQXYbRI0NGLxxE4b5xoSUPHh',
    calories: 340,
    rating: 4.9,
    reviewsCount: 128,
    stock: 12
  },
  {
    id: 'sunshine-bliss',
    name: 'Sunshine Bliss™',
    badge: 'Zesty Delight',
    category: 'citrus',
    description: 'Lemon Poppy Seed Cheesecake. Bright, zesty, and perfectly balanced with a buttery poppy seed crunch.',
    shortDescription: 'Lemon Poppy Seed Cheesecake with buttery crunch.',
    tags: ['Lemon Curd', 'Poppy Seed'],
    layers: [
      'Slow-Simmered Sicilian Lemon Curd',
      'Silk Cheesecake Cream Base',
      'Buttery Poppy Seed Shortbread Crunch',
      'Candied Lemon Zest Top'
    ],
    ingredients: [
      'Sicilian Lemons', 'Cream Cheese', 'Butter', 'Blue Poppy Seeds', 'Organic Eggs', 'Graham Biscuit Crumbs', 'Vanilla'
    ],
    price: 9.25,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvtb_Km--Kh2TM1tr12hrGxYH9Yu-e7Ic1uOBz3yoeA9mvjw-9In-z8-Q6uI7mP3d7LAAOt0_cEtojlXcT282ItnmVtxKEaMa7W5IwMXHRlNsl-LJYoHEEv5iaQz9A39q0fgpRugyPigb6VEKzkVnkdD3nT3RqrqTEtg7M1qB-0kmLadWY_85ZG11I6m9JRkeXv7l6oq7KhDB5ISMESqowiSSK0yj8rkguXzy0L2BIB70exQkpJ_dv',
    calories: 320,
    rating: 4.8,
    reviewsCount: 94,
    stock: 12
  },
  {
    id: 'autumn-caramel',
    name: 'Autumn Caramel™',
    badge: 'Seasonal Specialty',
    category: 'rich',
    description: 'Signature Carrot Cake layers meets salted caramel infusion and our thick, artisanal cream cheese frosting.',
    shortDescription: 'Carrot Cake layers with salted caramel & cream cheese frosting.',
    tags: ['Carrot Cake', 'Salted Caramel'],
    layers: [
      'House-Made Fleur de Sel Salted Caramel',
      'Spiced Heirloom Carrot Sponge',
      'Tangy Cream Cheese Frosting',
      'Toasted Pecan & Cinnamon Crumble'
    ],
    ingredients: [
      'Organic Carrots', 'Fleur de Sel Caramel', 'Pecans', 'Cinnamon', 'Nutmeg', 'Cream Cheese', 'Brown Sugar'
    ],
    price: 9.75,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmcsU5LRLm0PUWoFzvBmXXIOy9JF9LOH-iWRfUE7Kb22ti9CLyQ03ZtPENrrhiiHEudLJXpaXwf2XBYWCTcGWs35wcYzMUSejDlBIrGyF2EqDcJd0S1paZBYtaTBd7vKwUAELQB3ysohrp5jbb17z3I9RdlvJ8z9VHx5essj0LdQiUFTks2wBgfADxTj6zgHpEp5MMwIb-jafOPkyCXc-XNuJVqi2pbzwUVUkB50XU0Mj3F9m7hdG5',
    calories: 380,
    rating: 4.9,
    reviewsCount: 112,
    stock: 12
  },
  {
    id: 'pistachio-raspberry-royale',
    name: 'Pistachio Raspberry Royale™',
    badge: 'Artisan Choice',
    isBestseller: true,
    category: 'special',
    description: '100% Bronte Pistachio cream blended with rich white chocolate mousse, tart wild raspberry compote, and crunchy toasted pistachio bits.',
    shortDescription: 'Sicilian Pistachio cream with wild raspberry compote.',
    tags: ['Bronte Pistachio', 'Wild Raspberry'],
    layers: [
      'Wild Raspberry & Hibiscus Reduction',
      'Bronte Pistachio Mousse Layer',
      'Vanilla-Soaked Gluten-Free Biscuit',
      'Crushed Roasted Pistachio Crown'
    ],
    ingredients: [
      'Bronte Pistachios', 'Raspberries', 'White Chocolate', 'Cream', 'Vanilla Bean', 'Sea Salt'
    ],
    price: 10.50,
    image: HERO_IMAGES.pistachioRaspberry,
    calories: 390,
    rating: 5.0,
    reviewsCount: 165,
    stock: 12
  },
  {
    id: 'midnight-praline',
    name: 'Midnight Chocolate Praline™',
    badge: 'Decadent',
    category: 'rich',
    description: '70% Valrhona Dark Chocolate ganache layered with caramelized hazelnut praline, cocoa-dusted velvet cream, and crisp cookie pearls.',
    shortDescription: '70% Dark Chocolate ganache with hazelnut praline.',
    tags: ['Dark Chocolate', 'Hazelnut Praline'],
    layers: [
      '70% Dark Chocolate Ganache',
      'Hazelnut Praline Feuilletine',
      'Cocoa Mascarpone Cream',
      'Valrhona Cocoa Nib Topping'
    ],
    ingredients: [
      '70% Valrhona Dark Chocolate', 'Hazelnuts', 'Caramel', 'Butter', 'Cream', 'Cocoa Powder'
    ],
    price: 9.80,
    image: HERO_IMAGES.chocolateTopView,
    calories: 410,
    rating: 4.9,
    reviewsCount: 88,
    stock: 12
  }
];

export const CURRENT_BATCH: BatchInfo = {
  batchNumber: 'CRN-2026-08A',
  datePrepared: 'August 2, 2026',
  masterPastryChef: 'Heidi Saratxaga',
  status: 'In Production',
  jarsAvailable: 42
};
