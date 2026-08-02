import React, { useState } from 'react';
import { CustomJarBuild, SpoonableFlavor } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (customFlavor: SpoonableFlavor) => void;
  whatsappNumber?: string;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  isOpen,
  onClose,
  onAddToCart,
  whatsappNumber = "+15551234567"
}) => {
  const { language, t } = useLanguage();

  if (!isOpen) return null;

  const [build, setBuild] = useState<CustomJarBuild>({
    size: 'Standard (350ml)',
    baseCream: 'Mascarpone Vanilla Bean',
    cakeLayer: 'Ladyfinger Sponge',
    fruitCoulis: 'Fresh Strawberry Coulis',
    crunchTopping: 'Toasted Bronte Pistachio Crumble',
    quantity: 1,
    giftMessage: ''
  });

  const basePrice = build.size === 'Mini (200ml)' ? 8.00 : build.size === 'Grand (750ml)' ? 18.00 : 10.50;
  const totalPrice = basePrice * build.quantity;

  const handleOrderWhatsApp = () => {
    const msg = encodeURIComponent(
      language === 'es'
        ? `¡Hola equipo CRUNQI! Quisiera ordenar un Frasco Personalizado:\n` +
          `• Tamaño: ${build.size}\n` +
          `• Crema Base: ${build.baseCream}\n` +
          `• Bizcocho: ${build.cakeLayer}\n` +
          `• Coulis/Salsa: ${build.fruitCoulis}\n` +
          `• Topping Crujiente: ${build.crunchTopping}\n` +
          (build.giftMessage ? `• Nota/Mensaje: "${build.giftMessage}"\n` : '') +
          `• Cantidad: ${build.quantity}\n` +
          `• Total: $${totalPrice.toFixed(2)}`
        : `Hi CRUNQI team! I would like to order a Custom Spoonable Jar:\n` +
          `• Size: ${build.size}\n` +
          `• Base Cream: ${build.baseCream}\n` +
          `• Cake Layer: ${build.cakeLayer}\n` +
          `• Coulis/Sauce: ${build.fruitCoulis}\n` +
          `• Crunch Topping: ${build.crunchTopping}\n` +
          (build.giftMessage ? `• Jar Label Note: "${build.giftMessage}"\n` : '') +
          `• Quantity: ${build.quantity}\n` +
          `• Total: $${totalPrice.toFixed(2)}`
    );
    window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
  };

  const handleAddCustomToBag = () => {
    const customFlavor: SpoonableFlavor = {
      id: `custom-${Date.now()}`,
      name: language === 'es' ? `Frasco Personalizado (${build.baseCream.split(' ')[0]})` : `Custom Artisan Jar (${build.baseCream.split(' ')[0]})`,
      badge: 'Receta Propia',
      description: `Frasco personalizado con ${build.baseCream}, ${build.cakeLayer}, ${build.fruitCoulis} y ${build.crunchTopping}.`,
      tags: ['Personalizado', build.baseCream.split(' ')[0], build.crunchTopping.split(' ')[0]],
      category: 'special',
      layers: [build.crunchTopping, build.fruitCoulis, build.baseCream, build.cakeLayer],
      ingredients: ['Ingredientes Artesanales Seleccionados'],
      price: basePrice,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0wTbdLWQwnllGRPSV1YSbXrK4m12tun4pYaNDSKFMunG2HwEV1vDlS3x08mYyajhpFDmwGcTRQ_GmbifvSLx1j-17iZBurG_o6y7L2BSHDaFJavytcF6Xp1rJquzOTYW--TiGBEv5RQj_9lbgf826NB-OxCllDOnONE37X31hW7JZOKI1quYfwgzzWBXH2MbAjtgnYTri9YsfBGnn1UUrvwrQB7PQwwc2Ik0IqchVh5N5hfMLZKNz',
      rating: 5.0,
      reviewsCount: 1
    };
    onAddToCart(customFlavor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-[#fdf9f3] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-[#39c0d3]/30 max-h-[90vh] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-4 bg-[#39c0d3] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl">auto_awesome</span>
            <h3 className="font-serif font-bold text-xl">{t('customizer.title')}</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Customization Options Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* 1. Jar Size */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#26170c] block mb-2">
              {t('customizer.step1')}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { size: 'Mini (200ml)', price: '$8.00' },
                { size: 'Standard (350ml)', price: '$10.50' },
                { size: 'Grand (750ml)', price: '$18.00' }
              ].map((item) => (
                <button
                  key={item.size}
                  onClick={() => setBuild({ ...build, size: item.size as any })}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    build.size === item.size
                      ? 'bg-[#26170c] text-white border-[#26170c] shadow-sm'
                      : 'bg-white text-[#4f453f] border-[#39c0d3]/30 hover:border-[#39c0d3]'
                  }`}
                >
                  <div className="text-xs font-bold">{item.size}</div>
                  <div className="text-[11px] opacity-80 mt-1">{item.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Base Cream */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#26170c] block mb-2">
              {t('customizer.step2')}
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                'Mascarpone Vanilla Bean',
                'Pistachio Velvet Cream',
                'Dark Chocolate Ganache',
                'Lemon Zest Curd',
                'Dulce de Leche Mousse',
                'Espresso Tiramisú Cream'
              ].map((cream) => (
                <button
                  key={cream}
                  onClick={() => setBuild({ ...build, baseCream: cream })}
                  className={`p-3 rounded-xl border text-xs text-left font-medium transition-all ${
                    build.baseCream === cream
                      ? 'bg-[#39c0d3] text-[#26170c] border-[#39c0d3] font-bold shadow-xs'
                      : 'bg-white text-[#4f453f] border-[#39c0d3]/20 hover:bg-[#39c0d3]/10'
                  }`}
                >
                  ✓ {cream}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Crunch Layer */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#26170c] block mb-2">
              {t('customizer.step3')}
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                'Toasted Bronte Pistachio Crumble',
                'Caramelized Cookie Butter Crunch',
                'Roasted Hazelnut Praline',
                'Butter Sablé Biscuit Crumbs',
                'Dark Cocoa Nib Granola',
                'Meringue Kisses & Almond Flakes'
              ].map((crunch) => (
                <button
                  key={crunch}
                  onClick={() => setBuild({ ...build, crunchTopping: crunch })}
                  className={`p-3 rounded-xl border text-xs text-left font-medium transition-all ${
                    build.crunchTopping === crunch
                      ? 'bg-[#39c0d3] text-[#26170c] border-[#39c0d3] font-bold shadow-xs'
                      : 'bg-white text-[#4f453f] border-[#39c0d3]/20 hover:bg-[#39c0d3]/10'
                  }`}
                >
                  ✓ {crunch}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Fruit Coulis */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#26170c] block mb-2">
              {t('customizer.step4')}
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                'Fresh Strawberry Coulis',
                'Wild Raspberry Compote',
                'Passion Fruit & Mango Drizzle',
                'Spiced Blackberry Reduction',
                'Warm Salted Caramel',
                'Pure Belgian Chocolate Fudge'
              ].map((coulis) => (
                <button
                  key={coulis}
                  onClick={() => setBuild({ ...build, fruitCoulis: coulis })}
                  className={`p-3 rounded-xl border text-xs text-left font-medium transition-all ${
                    build.fruitCoulis === coulis
                      ? 'bg-[#d61219] text-white border-[#d61219] font-bold shadow-xs'
                      : 'bg-white text-[#4f453f] border-[#39c0d3]/20 hover:bg-[#39c0d3]/10'
                  }`}
                >
                  ✓ {coulis}
                </button>
              ))}
            </div>
          </div>

          {/* Gift Note Input */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#26170c] block mb-2">
              {language === 'es' ? 'Mensaje o Nombre Personalizado para el Frasco (Opcional)' : 'Custom Jar Tag / Gift Note (Optional)'}
            </label>
            <input
              type="text"
              value={build.giftMessage}
              onChange={(e) => setBuild({ ...build, giftMessage: e.target.value })}
              placeholder={language === 'es' ? 'Ej. ¡Feliz Cumpleaños Maria!' : 'E.g., "Happy Birthday Sophia!"'}
              className="w-full bg-white border border-[#39c0d3]/30 rounded-2xl p-3 text-xs text-[#26170c] focus:ring-2 focus:ring-[#39c0d3] outline-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#f7f3ed] border-t border-[#39c0d3]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-[#81756e] font-semibold block">{t('cart.total')}</span>
            <span className="text-2xl font-serif font-bold text-[#d61219]">${totalPrice.toFixed(2)}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleAddCustomToBag}
              className="flex-1 sm:flex-initial bg-[#26170c] text-white px-5 py-3 rounded-2xl font-bold text-xs hover:bg-[#39c0d3] hover:text-[#26170c] transition-colors"
            >
              {t('customizer.btnAddToCart')}
            </button>
            <button
              onClick={handleOrderWhatsApp}
              className="flex-1 sm:flex-initial bg-[#d61219] text-white px-5 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#b00e14] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
