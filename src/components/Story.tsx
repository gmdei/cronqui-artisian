import React, { useState, useEffect } from 'react';
import { HEIDI_PHOTO_URL, HEIDI_PHOTO_BACKUP } from '../data/spoonables';
import { useLanguage } from '../context/LanguageContext';

interface StoryProps {
  customPhotoUrl?: string;
  onUpdatePhotoUrl?: (url: string) => void;
}

export const Story: React.FC<StoryProps> = ({ customPhotoUrl, onUpdatePhotoUrl }) => {
  const [activeTab, setActiveTab] = useState<'philosophy' | 'sourcing'>('philosophy');
  const [imgSrc, setImgSrc] = useState<string>(customPhotoUrl || HEIDI_PHOTO_URL);
  const { language, t } = useLanguage();

  useEffect(() => {
    if (customPhotoUrl) {
      setImgSrc(customPhotoUrl);
    }
  }, [customPhotoUrl]);

  const handleImgError = () => {
    if (imgSrc !== HEIDI_PHOTO_BACKUP) {
      setImgSrc(HEIDI_PHOTO_BACKUP);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setImgSrc(result);
          if (onUpdatePhotoUrl) {
            onUpdatePhotoUrl(result);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section id="story" className="py-20 md:py-28 bg-[#e6e2dc]/40 border-y border-[#39c0d3]/10 relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Photo & Badge Column */}
        <div className="lg:col-span-5 relative group">
          <div className="rounded-3xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.01] border-4 border-[#39c0d3]/20 bg-[#fdf9f3] min-h-[380px] flex items-center justify-center relative">
            <img 
              src={imgSrc} 
              onError={handleImgError}
              alt={language === 'es' ? "Heidi Saratxaga - Fundadora y Maestra Repostera de CRUNQI" : "Heidi Saratxaga - Founder & Master Pastry Chef of CRUNQI"}
              className="w-full h-auto object-cover max-h-[520px] rounded-2xl"
              loading="lazy"
              referrerPolicy="no-referrer"
            />

            {/* Quick Replace Photo Button Overlay */}
            <label 
              title={language === 'es' ? 'Subir/Cambiar foto de Heidi desde tu dispositivo' : 'Upload/Change Heidi photo from your device'}
              className="absolute top-4 left-4 bg-black/60 hover:bg-black text-white px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md cursor-pointer transition-all flex items-center gap-1.5 z-20 shadow-md hover:scale-105"
            >
              <span className="material-symbols-outlined text-[16px]">photo_camera</span>
              <span>{language === 'es' ? 'Cambiar Foto' : 'Change Photo'}</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </label>

            {/* Image Overlay Label */}
            <div className="absolute bottom-4 left-4 right-4 bg-[#26170c]/85 backdrop-blur-md text-white p-3 rounded-2xl text-center shadow-lg border border-white/20">
              <span className="font-serif font-bold text-sm block">Heidi Saratxaga</span>
              <span className="text-[10px] text-[#39c0d3] uppercase tracking-widest font-semibold block">
                {t('story.chefTitle')}
              </span>
            </div>
          </div>

          {/* 100% Artisan Crafted Floating Badge */}
          <div className="absolute -top-4 -right-4 sm:-right-6 w-32 sm:w-40 h-32 sm:h-40 bg-[#d61219] p-4 rounded-3xl flex flex-col justify-center items-center text-center text-white shadow-2xl transition-transform duration-300 group-hover:translate-y-[-4px] border-2 border-white/30">
            <span className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">100%</span>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider leading-tight mt-1">
              Artisan<br />Crafted
            </span>
          </div>
        </div>

        {/* Text Content Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#39c0d3] bg-[#39c0d3]/10 px-3.5 py-1.5 rounded-full border border-[#39c0d3]/20">
              {t('story.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#26170c] pt-2">
              {t('story.title')}
            </h2>
            <h3 className="text-xl sm:text-2xl font-serif font-medium text-[#39c0d3]">
              {language === 'es' ? 'Creado con Pasión por Heidi Saratxaga' : 'Crafted with Passion by Heidi Saratxaga'}
            </h3>
          </div>

          <div className="space-y-4 text-base sm:text-lg text-[#4f453f] leading-relaxed">
            <p>{t('story.p1')}</p>
            <p>{t('story.p2')}</p>
          </div>

          {/* Interactive Philosophy / Sourcing Switcher */}
          <div className="pt-2">
            <div className="flex gap-4 border-b border-[#39c0d3]/20 pb-3 mb-4">
              <button
                onClick={() => setActiveTab('philosophy')}
                className={`text-xs font-bold uppercase tracking-wider pb-1 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'philosophy' 
                    ? 'text-[#39c0d3] border-b-2 border-[#39c0d3]' 
                    : 'text-[#81756e] hover:text-[#26170c]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                <span>{t('story.philosophy')}</span>
              </button>
              <button
                onClick={() => setActiveTab('sourcing')}
                className={`text-xs font-bold uppercase tracking-wider pb-1 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'sourcing' 
                    ? 'text-[#39c0d3] border-b-2 border-[#39c0d3]' 
                    : 'text-[#81756e] hover:text-[#26170c]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">eco</span>
                <span>{t('story.sourcing')}</span>
              </button>
            </div>

            {activeTab === 'philosophy' ? (
              <p className="text-sm text-[#4f453f] italic bg-[#fdf9f3] p-4 rounded-2xl border-l-4 border-[#39c0d3] shadow-xs leading-relaxed">
                {t('story.quote')}
              </p>
            ) : (
              <p className="text-sm text-[#4f453f] italic bg-[#fdf9f3] p-4 rounded-2xl border-l-4 border-[#d61219] shadow-xs leading-relaxed">
                {t('story.sourcingText')}
              </p>
            )}
          </div>

          {/* Key Value Badges */}
          <div className="flex items-center gap-8 pt-4">
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="material-symbols-outlined text-[#39c0d3] text-4xl">cake</span>
              <span className="text-[10px] font-bold text-[#26170c] uppercase tracking-wider">
                {language === 'es' ? 'Alta Repostería' : 'Fine Pastry'}
              </span>
            </div>
            
            <div className="w-px h-12 bg-[#39c0d3]/30" />

            <div className="flex flex-col items-center gap-1 text-center">
              <span className="material-symbols-outlined text-[#39c0d3] text-4xl">favorite</span>
              <span className="text-[10px] font-bold text-[#26170c] uppercase tracking-wider">
                {language === 'es' ? 'Alma Artesanal' : 'Artisanal Heart'}
              </span>
            </div>

            <div className="w-px h-12 bg-[#39c0d3]/30 hidden sm:block" />

            <div className="flex-col items-center gap-1 text-center hidden sm:flex">
              <span className="material-symbols-outlined text-[#d61219] text-4xl">verified</span>
              <span className="text-[10px] font-bold text-[#26170c] uppercase tracking-wider">
                {language === 'es' ? 'Calidad Garantizada' : 'Guaranteed Quality'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
