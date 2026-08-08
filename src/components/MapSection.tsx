import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import templateConfig from '../config/template.config.json';

export const MapSection: React.FC = () => {
  const { language } = useLanguage();
  const lang = (language === 'es' || language === 'en') ? language : 'es';

  const sectionTitle = templateConfig.sectionTexts.location.title[lang];
  const sectionSubtitle = templateConfig.sectionTexts.location.subtitle[lang];
  
  const addressLabel = lang === 'es' ? 'Dirección' : 'Address';
  const hoursLabel = lang === 'es' ? 'Horario de Atención' : 'Opening Hours';
  
  const addressVal = templateConfig.locationInfo.address[lang];
  const hoursVal = templateConfig.locationInfo.hours[lang];
  const mapUrl = templateConfig.locationInfo.mapEmbedUrl;

  return (
    <section id="location" className="py-20 md:py-24 bg-[#fdf9f3] scroll-mt-16">
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 w-full">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#26170c] tracking-tight">
            {sectionTitle}
          </h2>
          <div className="w-24 h-1.5 bg-[#39c0d3] mx-auto rounded-full" />
          <p className="text-base sm:text-lg text-[#4f453f] max-w-2xl mx-auto leading-relaxed">
            {sectionSubtitle}
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Map info Card */}
          <div className="lg:col-span-4 bg-[#26170c] text-white p-8 sm:p-10 rounded-3xl flex flex-col justify-between relative overflow-hidden shadow-xl min-h-[350px]">
            {/* Background pattern decoration */}
            <div className="absolute inset-0 dot-bg-dark opacity-10 pointer-events-none" />
            
            <div className="space-y-8 relative z-10">
              <div className="space-y-2">
                <span className="material-symbols-outlined text-[#39c0d3] text-4xl">location_on</span>
                <h4 className="text-xl font-serif font-bold">{addressLabel}</h4>
                <p className="text-sm text-gray-300 font-medium leading-relaxed">{addressVal}</p>
              </div>

              <div className="space-y-2">
                <span className="material-symbols-outlined text-[#39c0d3] text-4xl">schedule</span>
                <h4 className="text-xl font-serif font-bold">{hoursLabel}</h4>
                <p className="text-sm text-gray-300 font-medium leading-relaxed">{hoursVal}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 relative z-10 text-[11px] text-gray-400 font-semibold uppercase tracking-widest">
              {templateConfig.businessName} © 2026
            </div>
          </div>

          {/* Interactive Map Embed */}
          <div className="lg:col-span-8 rounded-3xl overflow-hidden border border-[#39c0d3]/20 shadow-md min-h-[350px] bg-white relative">
            <iframe 
              src={mapUrl}
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen={false}
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Shop location map"
            />
          </div>

        </div>

      </div>
    </section>
  );
};
