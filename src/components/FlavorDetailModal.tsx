import React, { useState } from 'react';
import { SpoonableFlavor } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface FlavorDetailModalProps {
  flavor: SpoonableFlavor | null;
  onClose: () => void;
  onAddToCart: (flavor: SpoonableFlavor, quantity: number, size: 'Mini (200ml)' | 'Standard (350ml)' | 'Grand (750ml)') => void;
  whatsappNumber?: string;
}

export const FlavorDetailModal: React.FC<FlavorDetailModalProps> = ({
  flavor,
  onClose,
  onAddToCart,
  whatsappNumber = "+15551234567"
}) => {
  const { language, t } = useLanguage();

  if (!flavor) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<'Mini (200ml)' | 'Standard (350ml)' | 'Grand (750ml)'>('Standard (350ml)');

  const sizeMultiplier = selectedSize === 'Mini (200ml)' ? 0.75 : selectedSize === 'Grand (750ml)' ? 1.8 : 1.0;
  const currentPrice = flavor.price * sizeMultiplier * quantity;

  const handleWhatsAppOrder = () => {
    const msg = encodeURIComponent(
      language === 'es'
        ? `¡Hola equipo CRUNQI! Quisiera ordenar ${quantity}x ${flavor.name} [Tamaño: ${selectedSize}] - Total: $${currentPrice.toFixed(2)}`
        : `Hi CRUNQI team! I would like to order ${quantity}x ${flavor.name} [Size: ${selectedSize}] - Total: $${currentPrice.toFixed(2)}`
    );
    window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-[#fdf9f3] w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-[#39c0d3]/30 max-h-[90vh] flex flex-col md:flex-row relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/40 hover:bg-black text-white p-2 rounded-full transition-colors backdrop-blur-md"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Left Side: Product Image & Badges */}
        <div className="md:w-1/2 relative bg-[#e6e2dc] min-h-[260px] md:min-h-full">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${flavor.image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
            <div className="flex items-center gap-2 mb-1">
              {flavor.badge && (
                <span className="bg-[#d61219] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {flavor.badge}
                </span>
              )}
              {flavor.isGlutenFree && (
                <span className="bg-[#39c0d3] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Gluten Free
                </span>
              )}
            </div>
            <h2 className="text-3xl font-serif font-bold text-white leading-tight">
              {flavor.name}
            </h2>
            <div className="flex items-center gap-2 text-xs font-medium text-white/90 mt-1">
              <span className="flex items-center text-amber-300">
                ★ {flavor.rating.toFixed(1)}
              </span>
              <span>•</span>
              <span>{flavor.reviewsCount} {language === 'es' ? 'reseñas verificadas' : 'verified reviews'}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Details & Layer Architecture */}
        <div className="md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#39c0d3]">
                {language === 'es' ? 'Arquitectura de Capas' : 'Layer Architecture'}
              </span>
              <p className="text-sm text-[#4f453f] mt-1 leading-relaxed">
                {flavor.description}
              </p>
            </div>

            {/* Layers Breakdown List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#26170c] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#39c0d3] text-[18px]">layers</span>
                {language === 'es' ? 'Composición del Frasco (Arriba hacia Abajo)' : 'Jar Composition (Top to Bottom)'}
              </h4>
              <ul className="space-y-1.5 text-xs text-[#4f453f]">
                {flavor.layers.map((layer, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-[#f7f3ed] p-2.5 rounded-xl border border-[#39c0d3]/10">
                    <span className="bg-[#39c0d3] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-[#26170c]">{layer}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Size Picker */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#26170c] block mb-2">
                {language === 'es' ? 'Selecciona el Tamaño' : 'Select Jar Size'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Mini (200ml)', 'Standard (350ml)', 'Grand (750ml)'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                      selectedSize === s
                        ? 'bg-[#26170c] text-white border-[#26170c] shadow-xs'
                        : 'bg-white text-[#4f453f] border-[#39c0d3]/30 hover:border-[#39c0d3]'
                    }`}
                  >
                    {s.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-[#39c0d3]/20 space-y-4">
            <div className="flex items-center justify-between">
              {/* Quantity Selector */}
              <div className="flex items-center border border-[#39c0d3]/30 rounded-full bg-white px-3 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-sm font-bold text-[#26170c] hover:text-[#39c0d3] px-1"
                >
                  -
                </button>
                <span className="text-sm font-semibold px-3 text-[#26170c]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-sm font-bold text-[#26170c] hover:text-[#39c0d3] px-1"
                >
                  +
                </button>
              </div>

              {/* Total Price */}
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-[#81756e] block">{t('cart.total')}</span>
                <span className="text-2xl font-serif font-bold text-[#d61219]">${currentPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  onAddToCart(flavor, quantity, selectedSize);
                  onClose();
                }}
                className="bg-[#26170c] text-white py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#39c0d3] hover:text-[#26170c] active:scale-95 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                <span>{t('products.btnAdd')}</span>
              </button>

              <button
                onClick={handleWhatsAppOrder}
                className="bg-[#d61219] text-white py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#b00e14] active:scale-95 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
