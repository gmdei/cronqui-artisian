import React from 'react';
import { HERO_IMAGES } from '../data/spoonables';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  onExploreClick: () => void;
  onCustomizerClick: () => void;
  whatsappNumber?: string;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onCustomizerClick,
  whatsappNumber = "+15551234567"
}) => {
  const { language, t } = useLanguage();

  const whatsappMsg = language === 'es'
    ? "¡Hola! Quisiera realizar un pedido de los postres artesanos CRUNQI Spoonable Jars."
    : "Hello! I'd like to place an order for CRUNQI Spoonable Jars.";

  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <section id="hero" className="relative min-h-[85vh] flex items-center pt-8 pb-16 overflow-hidden bg-[#f7f3ed] dot-bg">
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column: Copy & Actions */}
        <div className="lg:col-span-6 space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#39c0d3]/10 rounded-full text-[#39c0d3] border border-[#39c0d3]/20 shadow-xs">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span className="text-xs font-semibold uppercase tracking-widest">{t('hero.badge')}</span>
          </div>

          {/* Main Display Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-semibold leading-[1.08] text-[#26170c] tracking-tight">
            {t('hero.titlePart1')}<br />
            <span className="text-[#39c0d3] italic font-normal">{t('hero.titlePart2')}</span>
          </h1>

          {/* Body Description */}
          <p className="text-lg text-[#4f453f] max-w-lg leading-relaxed">
            {t('hero.desc')}
          </p>

          {/* CTA Button Group */}
          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#d61219] text-white px-7 py-3.5 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-[#b00e14] hover:shadow-lg active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>{t('hero.btnWhatsapp')}</span>
            </a>

            <button
              onClick={onExploreClick}
              className="border-2 border-[#39c0d3] text-[#39c0d3] px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-[#39c0d3] hover:text-white active:scale-95 transition-all"
            >
              {t('hero.btnCatalog')}
            </button>

            <button
              onClick={onCustomizerClick}
              className="bg-white/80 border border-[#39c0d3]/30 text-[#26170c] px-6 py-3.5 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-white hover:border-[#39c0d3] shadow-xs active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[#d61219] text-[18px]">tune</span>
              <span>{t('hero.btnCustomizer')}</span>
            </button>
          </div>

          {/* Guarantee Pill */}
          <div className="flex items-center gap-6 pt-4 text-xs font-medium text-[#4f453f]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#39c0d3] text-[18px]">workspace_premium</span>
              <span>{language === 'es' ? '100% Ingredientes Artesanales' : '100% Artisanal Ingredients'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#d61219] text-[18px]">local_shipping</span>
              <span>{language === 'es' ? 'Lotes Frescos Diarios' : 'Fresh Daily Batches'}</span>
            </div>
          </div>
        </div>

        {/* Right Column: 4-Photo Masonry Grid Layout */}
        <div className="lg:col-span-6 relative">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-8">
              {/* Image 1: Pistachio Raspberry Jar */}
              <div 
                className="aspect-[4/5] rounded-3xl overflow-hidden soft-shadow bg-cover bg-center transition-transform duration-500 hover:scale-[1.02] border border-[#39c0d3]/10"
                style={{ backgroundImage: `url('${HERO_IMAGES.pistachioRaspberry}')` }}
              >
                <div className="w-full h-full bg-gradient-to-t from-black/30 via-transparent to-transparent flex items-end p-4">
                  <span className="text-white text-xs font-semibold bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                    Pistachio Royale
                  </span>
                </div>
              </div>

              {/* Image 2: Assortment Jars */}
              <div 
                className="aspect-square rounded-3xl overflow-hidden soft-shadow bg-cover bg-center transition-transform duration-500 hover:scale-[1.02] border border-[#39c0d3]/10"
                style={{ backgroundImage: `url('${HERO_IMAGES.assortmentJars}')` }}
              >
                <div className="w-full h-full bg-gradient-to-t from-black/30 via-transparent to-transparent flex items-end p-4">
                  <span className="text-white text-xs font-semibold bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                    Spoonables Collection
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Image 3: Special Jar */}
              <div 
                className="aspect-square rounded-3xl overflow-hidden soft-shadow bg-cover bg-center transition-transform duration-500 hover:scale-[1.02] border border-[#39c0d3]/10"
                style={{ backgroundImage: `url('${HERO_IMAGES.assortmentJars}')` }}
              >
                <div className="w-full h-full bg-gradient-to-t from-black/30 via-transparent to-transparent flex items-end p-4">
                  <span className="text-white text-xs font-semibold bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                    Berry Velvet
                  </span>
                </div>
              </div>

              {/* Image 4: Jar Detail */}
              <div 
                className="aspect-[4/5] rounded-3xl overflow-hidden soft-shadow bg-cover bg-center transition-transform duration-500 hover:scale-[1.02] border border-[#39c0d3]/10"
                style={{ backgroundImage: `url('${HERO_IMAGES.pistachioRaspberry}')` }}
              >
                <div className="w-full h-full bg-gradient-to-t from-black/30 via-transparent to-transparent flex items-end p-4">
                  <span className="text-white text-xs font-semibold bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                    Mango Passion
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
