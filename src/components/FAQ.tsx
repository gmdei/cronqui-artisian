import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import templateConfig from '../config/template.config.json';

export const FAQ: React.FC = () => {
  const { language } = useLanguage();
  const lang = (language === 'es' || language === 'en') ? language : 'es';
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const sectionTitle = templateConfig.sectionTexts.faq.title[lang];
  const sectionSubtitle = templateConfig.sectionTexts.faq.subtitle[lang];
  const faqs = templateConfig.faqs;

  return (
    <section id="faq" className="py-20 md:py-24 bg-[#f7f3ed] scroll-mt-16">
      <div className="max-w-[800px] mx-auto px-5 w-full">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-serif font-bold text-[#26170c] tracking-tight">
            {sectionTitle}
          </h2>
          <div className="w-20 h-1 bg-[#39c0d3] mx-auto rounded-full" />
          <p className="text-sm text-[#81756e] max-w-xl mx-auto leading-relaxed">
            {sectionSubtitle}
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const question = faq.question[lang];
            const answer = faq.answer[lang];

            return (
              <div 
                key={index}
                className="bg-white rounded-2xl border border-[#39c0d3]/15 overflow-hidden transition-all duration-300 shadow-xs hover:border-[#39c0d3]/35"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-5 text-left font-serif font-bold text-[#26170c] hover:text-[#39c0d3] transition-colors cursor-pointer text-sm sm:text-base gap-4"
                >
                  <span>{question}</span>
                  <span className={`material-symbols-outlined transition-transform duration-300 text-[#39c0d3] shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>

                <div 
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-[500px] opacity-100 border-t border-[#f7f3ed]' : 'max-h-0 opacity-0 pointer-events-none'
                  }`}
                >
                  <p className="p-5 text-xs sm:text-sm text-[#4f453f] leading-relaxed bg-[#fdf9f3]/40">
                    {answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
