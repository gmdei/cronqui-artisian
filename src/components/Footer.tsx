import React from 'react';
import { FOOTER_LOGO_URL } from '../data/spoonables';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onOpenAdmin: () => void;
  whatsappNumber?: string;
  instagramUrl?: string;
  facebookUrl?: string;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  whatsappNumber = "+15551234567",
  instagramUrl = "https://instagram.com/crunqi",
  facebookUrl = "https://facebook.com/crunqi"
}) => {
  const { language, t } = useLanguage();
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    language === 'es' ? "¡Hola equipo CRUNQI! Quisiera ponerme en contacto." : "Hi CRUNQI team! I would like to contact you."
  )}`;

  return (
    <footer id="contact" className="w-full bg-[#e6e2dc] border-t border-[#39c0d3]/20 pt-16 pb-12 text-[#1c1c18]">
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        
        {/* Brand Column */}
        <div className="md:col-span-5 space-y-4 text-center md:text-left">
          <a href="#" className="inline-block">
            <img 
              src={FOOTER_LOGO_URL} 
              alt="CRUNQI Logo" 
              className="h-16 w-auto mx-auto md:mx-0 transition-transform hover:scale-105"
            />
          </a>
          <p className="text-sm text-[#4f453f] max-w-sm mx-auto md:mx-0 leading-relaxed">
            {t('footer.desc')}
          </p>

          {/* Social Links */}
          <div className="flex justify-center md:justify-start gap-4 pt-2">
            <a 
              href={whatsappUrl} 
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Chat"
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#4f453f] hover:text-[#39c0d3] shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">chat</span>
            </a>
            {instagramUrl && (
              <a 
                href={instagramUrl} 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#4f453f] hover:text-[#39c0d3] shadow-xs transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">photo_camera</span>
              </a>
            )}
            {facebookUrl && (
              <a 
                href={facebookUrl} 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#4f453f] hover:text-[#39c0d3] shadow-xs transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">public</span>
              </a>
            )}
            <a 
              href="#share" 
              onClick={(e) => {
                e.preventDefault();
                if (navigator.share) {
                  navigator.share({
                    title: 'CRUNQI Spoonables',
                    text: 'Handcrafted artisan desserts layered to perfection.',
                    url: window.location.href
                  });
                }
              }}
              aria-label="Share CRUNQI"
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#4f453f] hover:text-[#39c0d3] shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">share</span>
            </a>
          </div>
        </div>

        {/* Links Navigation */}
        <div className="md:col-span-4 grid grid-cols-2 gap-8 text-center sm:text-left">
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-bold uppercase text-[#26170c] tracking-wider mb-1">
              {t('footer.store')}
            </span>
            <a href="#hero" className="text-xs font-medium text-[#4f453f] hover:text-[#39c0d3] transition-colors">
              {t('nav.home')}
            </a>
            <a href="#spoonables" className="text-xs font-bold text-[#d61219] hover:underline">
              {t('nav.spoonables')}
            </a>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-bold uppercase text-[#26170c] tracking-wider mb-1">
              {t('footer.brand')}
            </span>
            <a href="#story" className="text-xs font-medium text-[#4f453f] hover:text-[#39c0d3] transition-colors">
              {t('nav.story')}
            </a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-[#4f453f] hover:text-[#39c0d3] transition-colors">
              {t('footer.wholesale')}
            </a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-[#4f453f] hover:text-[#39c0d3] transition-colors">
              {t('footer.gifting')}
            </a>
            <button 
              onClick={onOpenAdmin}
              className="text-left text-xs font-medium text-[#81756e] hover:text-[#26170c] flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">lock</span>
              <span>{t('nav.admin')}</span>
            </button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="md:col-span-3 space-y-3 text-center md:text-left">
          <span className="text-xs font-bold uppercase text-[#26170c] tracking-wider block">
            {language === 'es' ? 'Atención al Cliente' : 'Customer Service'}
          </span>
          <p className="text-xs text-[#4f453f]">
            📍 {language === 'es' ? 'Atelier & Cocina Central' : 'Central Atelier & Bakery'}
          </p>
          <p className="text-xs text-[#4f453f]">
            💬 WhatsApp: {whatsappNumber}
          </p>
          <p className="text-xs text-[#4f453f]">
            ✉️ hola@crunqi.com
          </p>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 pt-8 mt-12 border-t border-[#39c0d3]/15 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#81756e] gap-4">
        <p>© {new Date().getFullYear()} CRUNQI™. {t('footer.rights')}</p>
        <p className="font-serif italic text-[#39c0d3]">One Bite. Endless Smiles.™</p>
      </div>
    </footer>
  );
};
