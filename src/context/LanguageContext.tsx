import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
  updateTranslation: (lang: Language, key: string, value: string) => void;
  resetTranslations: () => void;
  customTranslations: Record<Language, Record<string, string>>;
}

const translations: Record<Language, Record<string, string>> = {
  es: {
    // Header & Nav
    'nav.home': 'Inicio',
    'nav.products': 'Productos',
    'nav.spoonables': 'Spoonables™',
    'nav.story': 'Nuestra Historia',
    'nav.customizer': 'Armar Frasco',
    'nav.contact': 'Contacto',
    'nav.admin': 'Panel Admin',
    'nav.cart': 'Tu Bolsa',

    // Hero Section
    'hero.badge': 'Repostería Artesanal Premium',
    'hero.titlePart1': 'Spoonable Jars:',
    'hero.titlePart2': 'Capas de Pura Indulgencia',
    'hero.desc': 'Delicias artesanales en frascos de cristal. Capas de crema mascarpone, bizcocho esponjoso y crocantes irresistibles listos para disfrutar con cuchara.',
    'hero.btnCatalog': 'Ver Catálogo Completo',
    'hero.btnCustomizer': 'Armar Frasco Personalizado',
    'hero.btnWhatsapp': 'Pedir por WhatsApp',
    'hero.batchTag': 'Lote de Cocina Hoy:',
    'hero.batchAvailable': 'frascos disponibles',

    // Products Section
    'products.badge': 'Catálogo Completo de Postres',
    'products.title': 'Nuestros Productos Exclusivos',
    'products.subtitle': 'Explora la variedad completa de creaciones artesanales. Realiza tu pedido directo por WhatsApp o agrégalos a tu carrito.',
    'products.search': 'Buscar sabor o ingrediente...',
    'products.catAll': 'Todos los Productos',
    'products.catBestseller': 'Favoritos (Bestsellers)',
    'products.catFruit': 'Frutales y Berries',
    'products.catCitrus': 'Cítricos y Zesty',
    'products.catRich': 'Chocolates y Ricos',
    'products.catSpecial': 'Ediciones Especiales',
    'products.noResults': 'No se encontraron productos',
    'products.resetFilter': 'Ver Todo el Catálogo',
    'products.featuredLayer': 'Capa Destacada:',
    'products.btnWhatsapp': 'WhatsApp',
    'products.btnAdd': 'Agregar',
    'products.viewLayers': 'Ver capas ➔',

    // Spoonables Section
    'spoonables.title': 'Catálogo Spoonables™',
    'spoonables.subtitle': 'Capas de indulgencia, textura y sorpresa. Cada frasco es una sinfonía entre crema aterciopelada y toppings crujientes.',

    // Story Section
    'story.badge': 'Detrás de la Marca',
    'story.title': 'La Historia de CRUNQI™',
    'story.p1': 'Fundada por la Maestra Repostera Heidi Saratxaga, CRUNQI nació del deseo de redefinir la alta repostería en un formato portátil, visualmente deslumbrante y profundamente delicioso.',
    'story.p2': 'Cada frasco de cristal "Spoonable" es ensamblado manualmente en lotes pequeños, utilizando únicamente ingredientes naturales, frutas seleccionadas, mantequillas puras y chocolate de origen.',
    'story.philosophy': 'Filosofía de Sabor',
    'story.sourcing': 'Origen de Ingredientes',
    'story.philosophyText': 'Creemos en el equilibrio perfecto entre la cremosidad suave y la textura crujiente. Menos azúcar refinada, más sabor auténtico.',
    'story.sourcingText': 'Frutas locales frescas, cacao de finca seleccionada y lácteos artesanales. Sin conservantes artificiales.',
    'story.quote': '"Un postre no es solo dulce; es una pausa para consentirte y conectar con los momentos felices."',
    'story.chefTitle': 'Maestra Repostera y Fundadora',

    // Customizer Modal
    'customizer.badge': 'Atelier CRUNQI™',
    'customizer.title': 'Estación de Creación Artesanal',
    'customizer.subtitle': 'Diseña tu propio Spoonable Jar paso a paso. Elige el tamaño, cremas, crujientes y coulis.',
    'customizer.step1': '1. Tamaño del Frasco',
    'customizer.step2': '2. Base de Crema',
    'customizer.step3': '3. Capa Crujiente',
    'customizer.step4': '4. Coulis o Topping',
    'customizer.summaryTitle': 'Resumen de tu Creación',
    'customizer.btnAddToCart': 'Agregar Frasco Personalizado',

    // Cart Drawer
    'cart.title': 'Tu Bolsa de Postres',
    'cart.empty': 'Tu bolsa está vacía',
    'cart.emptyDesc': 'Añade frascos Spoonables™ para comenzar tu pedido.',
    'cart.total': 'Total Estimado:',
    'cart.checkoutWhatsapp': 'Finalizar Pedido por WhatsApp',
    'cart.clear': 'Vaciar Bolsa',

    // Newsletter
    'newsletter.title': 'Únete a la Familia CRUNQI™',
    'newsletter.subtitle': 'Recibe alertas de lotes recién preparados, nuevos sabores de temporada y sorpresas exclusivas.',
    'newsletter.placeholder': 'Ingresa tu correo electrónico...',
    'newsletter.subscribe': 'Suscribirme',

    // Footer
    'footer.desc': 'Postres artesanales en frascos de cristal. Sabor, elegancia y crujido en cada cucharada.',
    'footer.store': 'Tienda y Catálogo',
    'footer.brand': 'Marca & Contacto',
    'footer.wholesale': 'Pedidos Mayoristas',
    'footer.gifting': 'Regalos Artesanales',
    'footer.rights': 'Todos los derechos reservados.'
  },
  en: {
    // Header & Nav
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.spoonables': 'Spoonables™',
    'nav.story': 'Our Story',
    'nav.customizer': 'Build Jar',
    'nav.contact': 'Contact',
    'nav.admin': 'Admin Panel',
    'nav.cart': 'Your Cart',

    // Hero Section
    'hero.badge': 'Premium Artisanal Bakery',
    'hero.titlePart1': 'Spoonable Jars:',
    'hero.titlePart2': 'Layers of Pure Indulgence',
    'hero.desc': 'Handcrafted glass jar desserts. Layers of mascarpone cream, fluffy sponge cake, and irresistible crunchies ready to spoon.',
    'hero.btnCatalog': 'View Full Catalog',
    'hero.btnCustomizer': 'Build Custom Jar',
    'hero.btnWhatsapp': 'Order via WhatsApp',
    'hero.batchTag': "Today's Fresh Batch:",
    'hero.batchAvailable': 'jars available',

    // Products Section
    'products.badge': 'Full Dessert Catalog',
    'products.title': 'Our Exclusive Products',
    'products.subtitle': 'Explore our full line of handcrafted creations. Order directly via WhatsApp or add them to your cart.',
    'products.search': 'Search flavor or ingredient...',
    'products.catAll': 'All Products',
    'products.catBestseller': 'Bestsellers',
    'products.catFruit': 'Fruity & Berries',
    'products.catCitrus': 'Citrus & Zesty',
    'products.catRich': 'Chocolate & Rich',
    'products.catSpecial': 'Special Editions',
    'products.noResults': 'No products found',
    'products.resetFilter': 'View Full Catalog',
    'products.featuredLayer': 'Featured Layer:',
    'products.btnWhatsapp': 'WhatsApp',
    'products.btnAdd': 'Add to Cart',
    'products.viewLayers': 'View layers ➔',

    // Spoonables Section
    'spoonables.title': 'Spoonables™ Catalog',
    'spoonables.subtitle': 'Layers of indulgence, texture, and surprise. Each jar is a symphony of velvety cream and crunchy toppings.',

    // Story Section
    'story.badge': 'Behind the Brand',
    'story.title': 'The CRUNQI™ Story',
    'story.p1': 'Founded by Master Pastry Chef Heidi Saratxaga, CRUNQI was born from the desire to redefine fine pastry in a portable, visually stunning, and deeply delicious format.',
    'story.p2': 'Each "Spoonable" glass jar is hand-assembled in small batches using only natural ingredients, selected fruits, pure butter, and single-origin chocolate.',
    'story.philosophy': 'Flavor Philosophy',
    'story.sourcing': 'Ingredient Sourcing',
    'story.philosophyText': 'We believe in the perfect balance between smooth creaminess and satisfying crunch. Less refined sugar, more authentic flavor.',
    'story.sourcingText': 'Fresh local fruits, estate cocoa, and artisanal dairy. No artificial preservatives.',
    'story.quote': '"A dessert is not just sweet; it is a pause to pamper yourself and connect with happy moments."',
    'story.chefTitle': 'Master Pastry Chef & Founder',

    // Customizer Modal
    'customizer.badge': 'CRUNQI™ Atelier',
    'customizer.title': 'Artisanal Creation Station',
    'customizer.subtitle': 'Design your own Spoonable Jar step by step. Choose jar size, cream base, crunchies, and coulis.',
    'customizer.step1': '1. Jar Size',
    'customizer.step2': '2. Cream Base',
    'customizer.step3': '3. Crunchy Layer',
    'customizer.step4': '4. Coulis or Topping',
    'customizer.summaryTitle': 'Your Custom Creation',
    'customizer.btnAddToCart': 'Add Custom Jar to Cart',

    // Cart Drawer
    'cart.title': 'Your Dessert Cart',
    'cart.empty': 'Your cart is empty',
    'cart.emptyDesc': 'Add Spoonables™ jars to start your order.',
    'cart.total': 'Estimated Total:',
    'cart.checkoutWhatsapp': 'Checkout via WhatsApp',
    'cart.clear': 'Clear Cart',

    // Newsletter
    'newsletter.title': 'Join the CRUNQI™ Family',
    'newsletter.subtitle': 'Receive alerts for freshly prepared batches, new seasonal flavors, and exclusive treats.',
    'newsletter.placeholder': 'Enter your email address...',
    'newsletter.subscribe': 'Subscribe',

    // Footer
    'footer.desc': 'Artisanal glass jar desserts. Flavor, elegance, and crunch in every spoon.',
    'footer.store': 'Store & Catalog',
    'footer.brand': 'Brand & Contact',
    'footer.wholesale': 'Wholesale Orders',
    'footer.gifting': 'Artisanal Gifting',
    'footer.rights': 'All rights reserved.'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('crunqi_lang');
      return (saved === 'en' || saved === 'es') ? saved : 'es';
    } catch {
      return 'es';
    }
  });

  const [customTranslations, setCustomTranslations] = useState<Record<Language, Record<string, string>>>(() => {
    try {
      const saved = localStorage.getItem('crunqi_custom_translations');
      return saved ? JSON.parse(saved) : { es: {}, en: {} };
    } catch {
      return { es: {}, en: {} };
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('crunqi_lang', lang);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  const updateTranslation = (lang: Language, key: string, value: string) => {
    setCustomTranslations(prev => {
      const updated = {
        ...prev,
        [lang]: {
          ...prev[lang],
          [key]: value
        }
      };
      try {
        localStorage.setItem('crunqi_custom_translations', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const resetTranslations = () => {
    const empty = { es: {}, en: {} };
    setCustomTranslations(empty);
    try {
      localStorage.removeItem('crunqi_custom_translations');
    } catch (e) {
      console.error(e);
    }
  };

  const t = (key: string): string => {
    return customTranslations[language]?.[key] || translations[language]?.[key] || translations['es']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, updateTranslation, resetTranslations, customTranslations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
