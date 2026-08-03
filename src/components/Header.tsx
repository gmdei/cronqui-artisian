import React, { useState, useEffect } from 'react';
import { LOGO_URL } from '../data/spoonables';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  whatsappNumber?: string;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenAdmin,
  whatsappNumber = "+15551234567"
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    language === 'es' 
      ? "¡Hola equipo CRUNQI! Quisiera consultar sobre los postres artesanales."
      : "Hello CRUNQI team! I would like to inquire about your handcrafted desserts."
  )}`;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#fdf9f3]/95 backdrop-blur-md shadow-md border-b border-[#39c0d3]/20 py-2.5' 
        : 'bg-[#fdf9f3]/80 backdrop-blur-sm border-b border-[#39c0d3]/10 py-3.5'
    }`}>
      <nav className="max-w-[1280px] mx-auto px-5 md:px-16 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#hero" className="flex items-center group">
          <img 
            src={LOGO_URL} 
            alt="CRUNQI Logo" 
            className="h-[48px] md:h-[54px] w-auto transition-transform duration-300 group-hover:scale-105"
          />
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <a 
            href="#hero" 
            className="text-sm font-medium text-[#4f453f] hover:text-[#39c0d3] transition-colors"
          >
            {t('nav.home')}
          </a>
          <a 
            href="#spoonables" 
            className="text-sm font-semibold text-[#d61219] hover:text-[#39c0d3] transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">grid_view</span>
            {t('nav.spoonables')}
          </a>
          <a 
            href="#story" 
            className="text-sm font-medium text-[#4f453f] hover:text-[#39c0d3] transition-colors"
          >
            {t('nav.story')}
          </a>
          <a 
            href="#contact" 
            className="text-sm font-medium text-[#4f453f] hover:text-[#39c0d3] transition-colors"
          >
            {t('nav.contact')}
          </a>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5">
          {/* Language Switcher Toggle */}
          <div className="flex items-center bg-[#f7f3ed] p-1 rounded-full border border-[#39c0d3]/30 text-xs font-bold shadow-xs">
            <button
              onClick={() => setLanguage('es')}
              className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1 ${
                language === 'es'
                  ? 'bg-[#26170c] text-white shadow-xs'
                  : 'text-[#4f453f] hover:text-[#39c0d3]'
              }`}
              title="Español"
            >
              <span>ES</span>
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1 ${
                language === 'en'
                  ? 'bg-[#26170c] text-white shadow-xs'
                  : 'text-[#4f453f] hover:text-[#39c0d3]'
              }`}
              title="English"
            >
              <span>EN</span>
            </button>
          </div>



          {/* Cart Icon Button */}
          <button
            onClick={onOpenCart}
            className="relative p-2 text-[#26170c] hover:text-[#39c0d3] hover:bg-[#39c0d3]/10 rounded-full transition-colors flex items-center justify-center"
            aria-label="View Order Cart"
            id="cartButton"
          >
            <span className="material-symbols-outlined text-2xl">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#d61219] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* WhatsApp Order Button */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center gap-2 bg-[#d61219] text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-[#b00e14] active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">chat</span>
            <span>{language === 'es' ? 'Pedir WhatsApp' : 'WhatsApp Order'}</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#26170c] hover:bg-[#39c0d3]/10 rounded-lg transition-colors"
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#fdf9f3] border-b border-[#39c0d3]/20 px-6 py-5 space-y-4 animate-fade-in shadow-xl">
          <a
            href="#hero"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#1c1c18] hover:text-[#39c0d3]"
          >
            {t('nav.home')}
          </a>
          <a
            href="#spoonables"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-semibold text-[#d61219] hover:text-[#39c0d3]"
          >
            {t('nav.spoonables')}
          </a>
          <a
            href="#story"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#1c1c18] hover:text-[#39c0d3]"
          >
            {t('nav.story')}
          </a>
        </div>
      )}
    </header>
  );
};
