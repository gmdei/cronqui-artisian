import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { language, t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail('');
      }, 4000);
    }
  };

  return (
    <section className="bg-[#26170c] py-20 relative overflow-hidden text-white">
      {/* Dark Dot Background Overlay */}
      <div className="absolute inset-0 dot-bg-dark opacity-20 pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-5 md:px-16 text-center relative z-10">
        <span 
          className="material-symbols-outlined text-[#39c0d3] text-5xl mb-6 inline-block animate-pulse" 
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          restaurant_menu
        </span>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-4 tracking-tight">
          {t('newsletter.title')}
        </h2>

        <p className="text-base sm:text-lg text-[#e6e2dc] max-w-xl mx-auto mb-10 leading-relaxed font-light">
          {t('newsletter.subtitle')}
        </p>

        {submitted ? (
          <div className="bg-[#39c0d3]/20 border border-[#39c0d3] text-[#39c0d3] p-4 rounded-2xl max-w-md mx-auto font-medium text-sm flex items-center justify-center gap-2 animate-fade-in">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>{language === 'es' ? '¡Bienvenido a la familia CRUNQI! Revisa tu correo pronto.' : 'Welcome to the CRUNQI inner circle! Check your inbox soon.'}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={t('newsletter.placeholder')}
              className="flex-1 bg-[#3d2b1f] border border-[#39c0d3]/30 text-white px-6 py-4 rounded-2xl text-sm placeholder-[#d2c4bc] focus:outline-none focus:ring-2 focus:ring-[#39c0d3] focus:border-transparent transition-all"
            />
            <button
              type="submit"
              className="bg-[#39c0d3] text-[#26170c] px-8 py-4 rounded-2xl font-bold text-sm hover:bg-white active:scale-95 transition-all shadow-md shrink-0"
            >
              {t('newsletter.subscribe')}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
