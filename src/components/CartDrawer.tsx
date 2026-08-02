import React from 'react';
import { CartItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  whatsappNumber?: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  whatsappNumber = "+15551234567"
}) => {
  const { language, t } = useLanguage();

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => {
    const sizeMultiplier = item.customization?.size === 'Mini (200ml)' ? 0.75 : item.customization?.size === 'Grand (750ml)' ? 1.8 : 1.0;
    return sum + (item.flavor.price * sizeMultiplier * item.quantity);
  }, 0);

  const handleSendWhatsAppOrder = () => {
    if (items.length === 0) return;

    let text = language === 'es'
      ? `¡Hola equipo CRUNQI! Quisiera realizar un pedido de los siguientes postres artesanales:\n\n`
      : `Hi CRUNQI team! I would like to place an order for the following artisan spoonables:\n\n`;

    items.forEach((item, i) => {
      const sizeStr = item.customization?.size ? ` [${item.customization.size}]` : '';
      const sizeMultiplier = item.customization?.size === 'Mini (200ml)' ? 0.75 : item.customization?.size === 'Grand (750ml)' ? 1.8 : 1.0;
      const itemTotal = (item.flavor.price * sizeMultiplier * item.quantity).toFixed(2);
      text += `${i + 1}. ${item.quantity}x ${item.flavor.name}${sizeStr} - $${itemTotal}\n`;
    });

    text += language === 'es' 
      ? `\nTotal Estimado: $${subtotal.toFixed(2)}\n\n¡Por favor infórmenme sobre los detalles de entrega/retiro!`
      : `\nTotal Estimated: $${subtotal.toFixed(2)}\n\nPlease let me know pickup/delivery details!`;

    const url = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-[#fdf9f3] w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-[#39c0d3]/30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cart Header */}
        <div className="px-6 py-5 bg-[#26170c] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#39c0d3] text-2xl">shopping_bag</span>
            <h3 className="font-serif font-bold text-lg">{t('cart.title')}</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Cart Items List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <span className="material-symbols-outlined text-5xl text-[#39c0d3]">cookie</span>
              <h4 className="font-serif font-medium text-lg text-[#26170c]">{t('cart.empty')}</h4>
              <p className="text-xs text-[#81756e] max-w-xs mx-auto leading-relaxed">
                {t('cart.emptyDesc')}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, idx) => {
                const sizeMultiplier = item.customization?.size === 'Mini (200ml)' ? 0.75 : item.customization?.size === 'Grand (750ml)' ? 1.8 : 1.0;
                const price = item.flavor.price * sizeMultiplier * item.quantity;

                return (
                  <div key={idx} className="bg-[#f7f3ed] p-4 rounded-2xl border border-[#39c0d3]/20 flex gap-3 relative">
                    <img src={item.flavor.image} alt={item.flavor.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                    
                    <div className="flex-1 space-y-1">
                      <h5 className="font-serif font-bold text-sm text-[#26170c]">{item.flavor.name}</h5>
                      {item.customization?.size && (
                        <span className="inline-block bg-[#39c0d3]/15 text-[#39c0d3] px-2 py-0.5 rounded text-[10px] font-bold">
                          {item.customization.size}
                        </span>
                      )}
                      <div className="text-xs font-bold text-[#d61219]">${price.toFixed(2)}</div>

                      {/* Quantity Control */}
                      <div className="flex items-center gap-2 pt-1">
                        <div className="flex items-center border border-[#39c0d3]/30 rounded-full bg-white px-2 py-0.5">
                          <button 
                            onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                            className="text-xs font-bold px-1 hover:text-[#39c0d3]"
                          >
                            -
                          </button>
                          <span className="text-xs font-semibold px-2">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                            className="text-xs font-bold px-1 hover:text-[#39c0d3]"
                          >
                            +
                          </button>
                        </div>

                        <button 
                          onClick={() => onRemoveItem(idx)}
                          className="text-[11px] text-[#81756e] hover:text-[#d61219] underline ml-auto"
                        >
                          {language === 'es' ? 'Eliminar' : 'Remove'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Checkout CTA */}
        {items.length > 0 && (
          <div className="p-6 bg-[#f7f3ed] border-t border-[#39c0d3]/20 space-y-4">
            <div className="flex items-center justify-between font-serif font-bold text-base text-[#26170c]">
              <span>{t('cart.total')}</span>
              <span className="text-[#d61219] text-xl">${subtotal.toFixed(2)}</span>
            </div>

            <button
              onClick={handleSendWhatsAppOrder}
              className="w-full bg-[#d61219] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#b00e14] active:scale-95 transition-all shadow-md"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>{t('cart.checkoutWhatsapp')}</span>
            </button>

            <button
              onClick={onClearCart}
              className="w-full text-center text-xs text-[#81756e] hover:text-[#d61219] underline"
            >
              {t('cart.clear')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
