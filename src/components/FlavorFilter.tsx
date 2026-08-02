import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface FlavorFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const FlavorFilter: React.FC<FlavorFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange
}) => {
  const { language } = useLanguage();

  const categories = [
    { id: 'all', label: language === 'es' ? 'Todos los Spoonables' : 'All Spoonables', icon: 'grid_view' },
    { id: 'bestseller', label: language === 'es' ? 'Favoritos' : 'Bestsellers', icon: 'star' },
    { id: 'fruit', label: language === 'es' ? 'Frutas & Berries' : 'Fruit & Berries', icon: 'nutrition' },
    { id: 'citrus', label: language === 'es' ? 'Cítricos Frescos' : 'Zesty Citrus', icon: 'lemon' },
    { id: 'rich', label: language === 'es' ? 'Chocolates & Ricos' : 'Rich & Chocolate', icon: 'cookie' },
    { id: 'gf', label: language === 'es' ? 'Sin Gluten' : 'Gluten-Free', icon: 'energy_savings_leaf' }
  ];

  return (
    <div className="space-y-6 mb-12">
      {/* Category Pills Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-[#39c0d3] text-white shadow-md scale-105'
                  : 'bg-white/80 text-[#4f453f] hover:bg-white hover:text-[#26170c] border border-[#39c0d3]/20'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {cat.icon}
              </span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Input Bar */}
      <div className="max-w-md mx-auto relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={
            language === 'es'
              ? "Buscar sabor o ingrediente (ej. Mascarpone, Limón, Caramelo)..."
              : "Search flavor or ingredient (e.g. Mascarpone, Lemon, Caramel)..."
          }
          className="w-full bg-white border border-[#39c0d3]/30 rounded-full pl-11 pr-10 py-3 text-sm text-[#1c1c18] placeholder-[#81756e] focus:outline-none focus:ring-2 focus:ring-[#39c0d3] focus:border-transparent shadow-xs transition-all"
        />
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#81756e]">
          search
        </span>
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#81756e] hover:text-[#26170c] p-1"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>
    </div>
  );
};
