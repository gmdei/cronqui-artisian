import React from 'react';
import { SpoonableFlavor } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ProductGridProps {
  flavors: SpoonableFlavor[];
  onSelectFlavor: (flavor: SpoonableFlavor) => void;
  onAddToCart: (flavor: SpoonableFlavor) => void;
  whatsappNumber?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  flavors,
  onSelectFlavor,
  onAddToCart,
  whatsappNumber = "+15551234567"
}) => {
  const { language, t } = useLanguage();

  if (flavors.length === 0) {
    return (
      <div className="text-center py-16 bg-white/60 rounded-3xl border border-[#39c0d3]/20 p-8 max-w-lg mx-auto">
        <span className="material-symbols-outlined text-4xl text-[#39c0d3] mb-3">search_off</span>
        <h3 className="text-xl font-serif font-medium text-[#26170c]">
          {language === 'es' ? 'No se encontraron Spoonables' : 'No Spoonables Found'}
        </h3>
        <p className="text-sm text-[#81756e] mt-1">
          {language === 'es' 
            ? 'Intenta reiniciar la búsqueda o elegir otra categoría.' 
            : 'Try resetting your search query or choosing another category filter.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {flavors.map((flavor) => {
        const whatsappMsg = encodeURIComponent(
          language === 'es'
            ? `¡Hola equipo CRUNQI! Quisiera ordenar el frasco Spoonable ${flavor.name} ($${flavor.price.toFixed(2)}).`
            : `Hi CRUNQI team! I would like to order the ${flavor.name} ($${flavor.price.toFixed(2)}) spoonable jar.`
        );
        const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${whatsappMsg}`;

        return (
          <div
            key={flavor.id}
            className="bg-[#f7f3ed] rounded-3xl overflow-hidden flex flex-col group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-[#d2c4bc]/40"
          >
            {/* Image Container */}
            <div className="aspect-square relative overflow-hidden bg-[#e6e2dc]">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${flavor.image}')` }}
              />

              {flavor.stock !== undefined && flavor.stock <= 0 && (
                <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] flex items-center justify-center z-10">
                  <span className="text-white text-lg font-serif font-bold uppercase tracking-widest border-2 border-white px-4 py-1.5 rounded-lg shadow-lg">
                    {language === 'es' ? 'Agotado' : 'Sold Out'}
                  </span>
                </div>
              )}

              {/* Badges Overlay */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none z-10">
                {flavor.badge ? (
                  <span className="bg-[#d61219] text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm">
                    {flavor.badge}
                  </span>
                ) : <span />}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectFlavor(flavor);
                  }}
                  className="pointer-events-auto bg-[#fdf9f3]/90 hover:bg-white text-[#26170c] p-2 rounded-full shadow-md transition-transform hover:scale-110"
                  title={language === 'es' ? 'Ver Capas del Frasco' : 'Quick View Layer Breakdown'}
                >
                  <span className="material-symbols-outlined text-[20px]">visibility</span>
                </button>
              </div>

              {/* Price Tag */}
              <div className="absolute bottom-4 right-4 bg-[#26170c]/90 text-white backdrop-blur-md px-3.5 py-1 rounded-full font-serif font-bold text-sm shadow-md z-10">
                ${flavor.price.toFixed(2)}
              </div>
            </div>

            {/* Content Container */}
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <h3 
                  onClick={() => onSelectFlavor(flavor)}
                  className="text-2xl font-serif font-semibold text-[#26170c] cursor-pointer hover:text-[#39c0d3] transition-colors"
                >
                  {flavor.name}
                </h3>
                {flavor.isGlutenFree && (
                  <span className="bg-[#39c0d3]/20 text-[#39c0d3] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                    GF
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-[#4f453f] mb-6 flex-1 leading-relaxed">
                {flavor.description}
              </p>

              {/* Tag Pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                {flavor.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-[#e6e2dc] px-3 py-1 rounded-full text-xs font-medium text-[#4f453f] border border-[#39c0d3]/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
                <a
                  href={flavor.stock !== undefined && flavor.stock <= 0 ? '#' : whatsappUrl}
                  onClick={(e) => flavor.stock !== undefined && flavor.stock <= 0 && e.preventDefault()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3.5 rounded-2xl font-semibold text-xs text-center flex items-center justify-center gap-1.5 shadow-sm transition-colors ${
                    flavor.stock !== undefined && flavor.stock <= 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none'
                      : 'bg-[#26170c] text-white hover:bg-[#d61219]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>{language === 'es' ? 'Pedir por WhatsApp' : 'Order This Flavor'}</span>
                </a>

                <button
                  onClick={() => onAddToCart(flavor)}
                  disabled={flavor.stock !== undefined && flavor.stock <= 0}
                  className={`w-full py-3.5 rounded-2xl font-semibold text-xs text-center flex items-center justify-center gap-1.5 shadow-xs transition-colors ${
                    flavor.stock !== undefined && flavor.stock <= 0
                      ? 'bg-gray-150 text-gray-400 border border-gray-200 cursor-not-allowed'
                      : 'bg-white text-[#26170c] border border-[#39c0d3]/40 hover:bg-[#39c0d3] hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {flavor.stock !== undefined && flavor.stock <= 0 ? 'block' : 'add_shopping_cart'}
                  </span>
                  <span>{flavor.stock !== undefined && flavor.stock <= 0 ? (language === 'es' ? 'Agotado' : 'Sold Out') : t('products.btnAdd')}</span>
                </button>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};
