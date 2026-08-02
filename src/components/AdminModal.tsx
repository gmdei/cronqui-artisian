import React, { useState, useEffect } from 'react';
import { SpoonableFlavor, BatchInfo, ThemeSettings } from '../types';
import { CURRENT_BATCH } from '../data/spoonables';
import { verifyTOTP } from '../utils/totp';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  flavors: SpoonableFlavor[];
  onUpdateFlavors: (flavors: SpoonableFlavor[]) => void;
  themeSettings: ThemeSettings;
  onUpdateThemeSettings: (settings: ThemeSettings) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  flavors,
  onUpdateFlavors,
  themeSettings,
  onUpdateThemeSettings
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>(() => {
    return localStorage.getItem('crunqi_admin_email') || '';
  });
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [totpSecret, setTotpSecret] = useState<string>(() => {
    let secret = localStorage.getItem('crunqi_totp_secret');
    if (!secret) {
      secret = 'CRUNQI2FASECRETX'; // 16 chars (valid base32 without padding)
      localStorage.setItem('crunqi_totp_secret', secret);
    }
    return secret;
  });
  const [is2FAEnabled, setIs2FAEnabled] = useState<boolean>(() => {
    return localStorage.getItem('crunqi_2fa_enabled') === 'true';
  });
  const [loginStep, setLoginStep] = useState<'google' | '2fa_setup' | '2fa_verify'>('google');

  const [authorizedEmails, setAuthorizedEmails] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('crunqi_authorized_emails');
      return saved ? JSON.parse(saved) : ['heidy.saratxaga@gmail.com', 'admin.crunqi@gmail.com'];
    } catch {
      return ['heidy.saratxaga@gmail.com', 'admin.crunqi@gmail.com'];
    }
  });

  useEffect(() => {
    localStorage.setItem('crunqi_authorized_emails', JSON.stringify(authorizedEmails));
  }, [authorizedEmails]);

  const [activeTab, setActiveTab] = useState<'theme' | 'products' | 'whatsapp' | 'batch'>('theme');
  const [batch, setBatch] = useState<BatchInfo>(CURRENT_BATCH);

  // New product form state
  const [newProduct, setNewProduct] = useState<Partial<SpoonableFlavor>>({
    name: '',
    price: 9.50,
    category: 'fruit',
    description: '',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxo3zAuTOcfsSataHEVO0imunoM6gQyPsJ9Xn-EDC2vYI7NTXsaQKK4Eeir1na7O2HxrUF8jO5Y90uAMg2Au0WqEZjJ6rPacu4YiX-urVrqO1tgpNcBwf6E4KvVQVcRxR9T2saMtYYbxPA0u-fLNWX1cLZtzqW4NcEe30doKjYyJ_CCfOsZgTD9KVGaQ_Mlk3SboLJCNuwtG79GlzDkEA0GoBLSThxgQXYbRI0NGLxxE4b5xoSUPHh',
    badge: 'Nuevo Postre',
    tags: ['Artisanal', 'Fresh'],
    layers: ['Crema Terciopelo', 'Capa de Bizcocho', 'Crujiente Topping'],
    ingredients: ['Crema Mascarpone', 'Azúcar Orgánica'],
    rating: 5.0,
    reviewsCount: 1
  });

  // Editing product state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editProductState, setEditProductState] = useState<Partial<SpoonableFlavor>>({});

  const handleStartEdit = (flavor: SpoonableFlavor) => {
    setEditingId(flavor.id);
    setEditProductState(flavor);
  };

  const handleSaveEdit = (id: string) => {
    if (!editProductState.name || !editProductState.price) return;
    const updated = flavors.map(f => f.id === id ? { ...f, ...editProductState } : f);
    onUpdateFlavors(updated);
    setEditingId(null);
    setEditProductState({});
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const handleGoogleSignIn = (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      setError('Por favor, ingresa un correo de Gmail válido.');
      return;
    }
    
    // Check if the email is in the authorized list
    if (!authorizedEmails.includes(normalizedEmail)) {
      setError('Acceso denegado: Esta cuenta de correo no está autorizada para administrar el sitio.');
      return;
    }

    setUserEmail(normalizedEmail);
    localStorage.setItem('crunqi_admin_email', normalizedEmail);
    setError(null);
    if (!is2FAEnabled) {
      setLoginStep('2fa_setup');
    } else {
      setLoginStep('2fa_verify');
    }
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = verifyTOTP(totpSecret, twoFactorCode);
    if (isValid) {
      setIsAuthenticated(true);
      setError(null);
      setTwoFactorCode('');
    } else {
      setError('Código 2FA incorrecto. Verifica tu Google Authenticator.');
    }
  };

  const handleSetup2FA = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = verifyTOTP(totpSecret, twoFactorCode);
    if (isValid) {
      setIs2FAEnabled(true);
      localStorage.setItem('crunqi_2fa_enabled', 'true');
      setIsAuthenticated(true);
      setError(null);
      setTwoFactorCode('');
    } else {
      setError('Código 2FA incorrecto. Asegúrate de escanear el QR e ingresar el código actual de 6 dígitos.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setTwoFactorCode('');
    setLoginStep('google');
    setError(null);
  };

  const handleToggleBestseller = (id: string) => {
    const updated = flavors.map(f => f.id === id ? { ...f, isBestseller: !f.isBestseller } : f);
    onUpdateFlavors(updated);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este producto del catálogo?')) {
      const updated = flavors.filter(f => f.id !== id);
      onUpdateFlavors(updated);
    }
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    const createdItem: SpoonableFlavor = {
      id: `custom-prod-${Date.now()}`,
      name: newProduct.name || 'Postre Artesanal',
      price: Number(newProduct.price) || 9.50,
      category: (newProduct.category as any) || 'fruit',
      description: newProduct.description || 'Delicioso postre en frasco en capas de crema y crujiente.',
      shortDescription: newProduct.description?.slice(0, 60),
      image: newProduct.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxo3zAuTOcfsSataHEVO0imunoM6gQyPsJ9Xn-EDC2vYI7NTXsaQKK4Eeir1na7O2HxrUF8jO5Y90uAMg2Au0WqEZjJ6rPacu4YiX-urVrqO1tgpNcBwf6E4KvVQVcRxR9T2saMtYYbxPA0u-fLNWX1cLZtzqW4NcEe30doKjYyJ_CCfOsZgTD9KVGaQ_Mlk3SboLJCNuwtG79GlzDkEA0GoBLSThxgQXYbRI0NGLxxE4b5xoSUPHh',
      badge: newProduct.badge || 'Nuevo',
      tags: newProduct.tags || ['Artisanal'],
      layers: newProduct.layers || ['Capa de Crema', 'Sponge', 'Crumble'],
      ingredients: newProduct.ingredients || ['Ingredientes Selectos'],
      rating: 5.0,
      reviewsCount: 1
    };

    onUpdateFlavors([createdItem, ...flavors]);
    setNewProduct({
      name: '',
      price: 9.50,
      category: 'fruit',
      description: '',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxo3zAuTOcfsSataHEVO0imunoM6gQyPsJ9Xn-EDC2vYI7NTXsaQKK4Eeir1na7O2HxrUF8jO5Y90uAMg2Au0WqEZjJ6rPacu4YiX-urVrqO1tgpNcBwf6E4KvVQVcRxR9T2saMtYYbxPA0u-fLNWX1cLZtzqW4NcEe30doKjYyJ_CCfOsZgTD9KVGaQ_Mlk3SboLJCNuwtG79GlzDkEA0GoBLSThxgQXYbRI0NGLxxE4b5xoSUPHh',
      badge: 'Nuevo Postre'
    });
    alert('¡Producto añadido con éxito al catálogo!');
  };

  return (
    <div id="adminPanel" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-[#fdf9f3] w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-[#39c0d3]/40 max-h-[90vh] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-4 bg-[#26170c] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#39c0d3] text-2xl">admin_panel_settings</span>
            <div>
              <h3 className="font-serif font-bold text-lg">CRUNQI™ Panel de Control Administrable</h3>
              <p className="text-[10px] text-[#e6e2dc] uppercase tracking-widest">CRUD Catálogo & Theme Engine Interactivo</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Auth or Portal Tabs Body */}
        {!isAuthenticated ? (
          <div className="p-8 overflow-y-auto text-[#1c1c18] flex flex-col items-center justify-center min-h-[420px]">
            {loginStep === 'google' && (
              <div className="space-y-6 max-w-sm w-full text-center animate-fade-in">
                <div className="flex justify-center">
                  <svg className="w-12 h-12" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.99 5.99 0 0 1 8 12.527a5.99 5.99 0 0 1 5.99-5.99c2.476 0 4.545 1.488 5.437 3.613l3.665-2.846C20.841 3.513 16.85 1 12.24 1 5.866 1 12.24s4.866 11.24 11.24 11.24c5.895 0 10.87-4.223 11.21-10.155H12.24v-3.04z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-serif font-bold text-[#26170c]">Iniciar sesión con Google</h4>
                  <p className="text-xs text-[#81756e] mt-1">Elige una cuenta de Google para acceder al panel administrativo de CRUNQI</p>
                </div>

                <div className="space-y-2.5 text-left">
                  <button
                    onClick={() => handleGoogleSignIn('heidy.saratxaga@gmail.com')}
                    className="w-full bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl p-3.5 flex items-center gap-3 transition-all hover:border-[#39c0d3] shadow-xs cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#d61219]/10 text-[#d61219] flex items-center justify-center font-bold text-sm">
                      H
                    </div>
                    <div className="flex-1">
                      <span className="font-bold text-xs text-[#26170c] block">Heidy Saratxaga</span>
                      <span className="text-[10px] text-[#81756e] block">heidy.saratxaga@gmail.com</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleGoogleSignIn('admin.crunqi@gmail.com')}
                    className="w-full bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl p-3.5 flex items-center gap-3 transition-all hover:border-[#39c0d3] shadow-xs cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#39c0d3]/10 text-[#39c0d3] flex items-center justify-center font-bold text-sm">
                      A
                    </div>
                    <div className="flex-1">
                      <span className="font-bold text-xs text-[#26170c] block">Administrador General</span>
                      <span className="text-[10px] text-[#81756e] block">admin.crunqi@gmail.com</span>
                    </div>
                  </button>

                  <div className="pt-3 border-t border-gray-150 mt-3">
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const input = form.elements.namedItem('customEmail') as HTMLInputElement;
                      handleGoogleSignIn(input.value);
                    }} className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-[#81756e]">O introduce una cuenta personalizada</label>
                      <div className="flex gap-2">
                        <input
                          name="customEmail"
                          type="email"
                          required
                          placeholder="ejemplo@gmail.com"
                          className="flex-1 bg-white border border-[#39c0d3]/30 rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-[#39c0d3]"
                        />
                        <button
                          type="submit"
                          className="bg-[#26170c] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#39c0d3] hover:text-[#26170c] transition-colors cursor-pointer"
                        >
                          Siguiente
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-[#d61219] font-medium">{error}</p>
                )}
              </div>
            )}

            {loginStep === '2fa_setup' && (
              <div className="space-y-5 max-w-sm w-full text-center animate-fade-in">
                <span className="material-symbols-outlined text-5xl text-[#d61219] animate-pulse">security</span>
                <div>
                  <h4 className="text-xl font-serif font-bold text-[#26170c]">Configurar Google Authenticator</h4>
                  <p className="text-xs text-[#81756e] mt-1">Escanea este código con tu aplicación de autenticación para vincular el acceso de <b>{userEmail}</b></p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-300 inline-block shadow-md">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=10&data=${encodeURIComponent(`otpauth://totp/CRUNQI:${userEmail}?secret=${totpSecret}&issuer=CRUNQI`)}`}
                    alt="Código QR"
                    className="w-[220px] h-[220px] block mx-auto"
                  />
                </div>

                <div className="bg-[#f7f3ed] p-3 rounded-xl border border-gray-200 text-left">
                  <span className="text-[10px] font-bold text-[#81756e] uppercase block">Clave de Configuración Manual</span>
                  <code className="text-xs font-mono font-bold text-[#26170c] select-all block mt-0.5">{totpSecret}</code>
                </div>

                <form onSubmit={handleSetup2FA} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#81756e] block mb-1">Código de 6 dígitos del Autenticador</label>
                    <input
                      type="text"
                      pattern="[0-9]*"
                      inputMode="numeric"
                      maxLength={6}
                      required
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="000000"
                      className="w-full bg-white border border-[#39c0d3]/40 rounded-2xl p-3.5 text-center font-mono text-lg tracking-[0.5em] focus:ring-2 focus:ring-[#39c0d3] outline-none shadow-inner"
                    />
                  </div>

                  {error && (
                    <p className="text-xs text-[#d61219] font-medium">{error}</p>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setLoginStep('google')}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-[#4f453f] py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Atrás
                    </button>
                    <button
                      type="submit"
                      className="flex-[2] bg-[#39c0d3] text-[#26170c] py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-[#26170c] hover:text-white transition-colors shadow-md cursor-pointer"
                    >
                      Activar y Entrar
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loginStep === '2fa_verify' && (
              <form onSubmit={handleVerify2FA} className="space-y-5 max-w-sm w-full text-center animate-fade-in">
                <span className="material-symbols-outlined text-5xl text-[#39c0d3]">gpp_good</span>
                <div>
                  <h4 className="text-xl font-serif font-bold text-[#26170c]">Verificación de Seguridad (2FA)</h4>
                  <p className="text-xs text-[#81756e] mt-1">Ingresa el código de 6 dígitos que muestra Google Authenticator para la cuenta <b>{userEmail}</b></p>
                </div>

                <div>
                  <input
                    type="text"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="000000"
                    className="w-full bg-white border border-[#39c0d3]/40 rounded-2xl p-3.5 text-center font-mono text-lg tracking-[0.5em] focus:ring-2 focus:ring-[#39c0d3] outline-none shadow-inner"
                  />
                </div>

                {error && (
                  <p className="text-xs text-[#d61219] font-medium">{error}</p>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginStep('google');
                      setError(null);
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-[#4f453f] py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Atrás
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] bg-[#39c0d3] text-[#26170c] py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-[#26170c] hover:text-white transition-colors shadow-md cursor-pointer"
                  >
                    Verificar y Entrar
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            
            {/* Top Module Navigation Bar */}
            <div className="bg-[#f7f3ed] border-b border-[#39c0d3]/20 px-6 py-2.5 flex items-center gap-2 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('theme')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'theme' 
                    ? 'bg-[#39c0d3] text-[#26170c] shadow-xs' 
                    : 'text-[#4f453f] hover:bg-white'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">palette</span>
                <span>1. Personalización Estética (Theme)</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'products' 
                    ? 'bg-[#39c0d3] text-[#26170c] shadow-xs' 
                    : 'text-[#4f453f] hover:bg-white'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                <span>2. Catálogo (CRUD Productos)</span>
              </button>

              <button
                onClick={() => setActiveTab('whatsapp')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'whatsapp' 
                    ? 'bg-[#39c0d3] text-[#26170c] shadow-xs' 
                    : 'text-[#4f453f] hover:bg-white'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>3. WhatsApp y Redes</span>
              </button>

              <button
                onClick={() => setActiveTab('batch')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'batch' 
                    ? 'bg-[#39c0d3] text-[#26170c] shadow-xs' 
                    : 'text-[#4f453f] hover:bg-white'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">cooking</span>
                <span>4. Lote de Cocina</span>
              </button>
            </div>

            {/* Tab Contents Area */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[#1c1c18]">
              
              {/* TAB 1: Theme Engine Customizer */}
              {activeTab === 'theme' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-[#39c0d3]/20 pb-3">
                    <h4 className="text-base font-serif font-bold text-[#26170c]">Módulo 1: Theme Engine (Personalización Estética)</h4>
                    <p className="text-xs text-[#81756e]">Cambia los colores de acento, fuentes de títulos y banner en tiempo real.</p>
                  </div>

                  {/* Palette Accent Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#26170c] block">
                      1. Paleta de Colores Principal
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { id: 'turquoise', name: 'Turquoise / Teal', color: '#39c0d3' },
                        { id: 'chocolate', name: 'Rich Chocolate', color: '#26170c' },
                        { id: 'berry', name: 'Berry Velvet Red', color: '#d61219' },
                        { id: 'cream', name: 'Artisan Warm Cream', color: '#e6e2dc' }
                      ].map((p) => (
                        <button
                          key={p.id}
                          onClick={() => onUpdateThemeSettings({ ...themeSettings, primaryPalette: p.id as any })}
                          className={`p-3 rounded-2xl border text-left flex items-center gap-2 transition-all ${
                            themeSettings.primaryPalette === p.id 
                              ? 'bg-white border-[#39c0d3] ring-2 ring-[#39c0d3]' 
                              : 'bg-white/60 border-gray-200 hover:border-[#39c0d3]'
                          }`}
                        >
                          <span className="w-5 h-5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: p.color }} />
                          <span className="text-xs font-semibold text-[#26170c]">{p.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title Typography Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#26170c] block">
                      2. Tipografía de Títulos Principal
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { name: 'Playfair Display', fontClass: 'font-serif' },
                        { name: 'Cormorant Garamond', fontClass: 'font-serif' },
                        { name: 'Cinzel', fontClass: 'font-serif uppercase' }
                      ].map((f) => (
                        <button
                          key={f.name}
                          onClick={() => onUpdateThemeSettings({ ...themeSettings, titleFont: f.name as any })}
                          className={`p-4 rounded-2xl border text-center transition-all ${
                            themeSettings.titleFont === f.name 
                              ? 'bg-[#26170c] text-white border-[#26170c]' 
                              : 'bg-white text-[#4f453f] border-gray-200 hover:border-[#39c0d3]'
                          }`}
                        >
                          <span className={`block text-base font-bold mb-1`} style={{ fontFamily: `'${f.name}', serif` }}>
                            CRUNQI
                          </span>
                          <span className="text-[10px] opacity-80 block">{f.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hero Banner Manager */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#26170c] block">
                      3. Imagen de Banner / Portada (URL o Subir)
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={themeSettings.heroBannerImage || ''}
                        onChange={(e) => onUpdateThemeSettings({ ...themeSettings, heroBannerImage: e.target.value })}
                        placeholder="Ej. https://images.unsplash.com/photo-1579372786545-d24232daf58c"
                        className="flex-1 bg-white border border-[#39c0d3]/30 rounded-xl p-3 text-xs text-[#1c1c18] focus:ring-2 focus:ring-[#39c0d3] outline-none"
                      />
                      <label className="bg-[#26170c] hover:bg-[#39c0d3] hover:text-[#26170c] text-white px-4 py-3 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shrink-0">
                        <span className="material-symbols-outlined text-[16px]">upload</span>
                        <span>Subir Banner</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const dataUrl = event.target?.result as string;
                                onUpdateThemeSettings({ ...themeSettings, heroBannerImage: dataUrl });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Heidi Saratxaga Photo Manager */}
                  <div className="space-y-2 pt-2 border-t border-[#39c0d3]/15">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#26170c] block">
                      4. Foto de Heidi Saratxaga (Nuestra Historia)
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={themeSettings.heidiPhotoUrl || ''}
                        onChange={(e) => onUpdateThemeSettings({ ...themeSettings, heidiPhotoUrl: e.target.value })}
                        placeholder="URL de la imagen o selecciona un archivo..."
                        className="flex-1 bg-white border border-[#39c0d3]/30 rounded-xl p-3 text-xs text-[#1c1c18] focus:ring-2 focus:ring-[#39c0d3] outline-none"
                      />
                      <label className="bg-[#26170c] hover:bg-[#39c0d3] hover:text-[#26170c] text-white px-4 py-3 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shrink-0">
                        <span className="material-symbols-outlined text-[16px]">upload</span>
                        <span>Subir Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const dataUrl = event.target?.result as string;
                                onUpdateThemeSettings({ ...themeSettings, heidiPhotoUrl: dataUrl });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="bg-[#39c0d3]/10 p-3 rounded-xl border border-[#39c0d3]/30 text-xs text-[#26170c] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#39c0d3]">check_circle</span>
                    <span>Los cambios estéticos se aplican instantáneamente en todo el entorno web.</span>
                  </div>
                </div>
              )}

              {/* TAB 2: Product Catalog CRUD */}
              {activeTab === 'products' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-[#39c0d3]/20 pb-3 flex justify-between items-center">
                    <div>
                      <h4 className="text-base font-serif font-bold text-[#26170c]">Módulo 2: Gestión de Catálogo (CRUD)</h4>
                      <p className="text-xs text-[#81756e]">Añade, edita, destaca o elimina productos de la línea Spoonables™.</p>
                    </div>
                  </div>

                  {/* Add Product Form */}
                  <form onSubmit={handleAddProductSubmit} className="bg-white p-5 rounded-2xl border border-[#39c0d3]/30 space-y-4 shadow-xs">
                    <h5 className="text-xs font-bold uppercase text-[#39c0d3] tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">add_circle</span>
                      Añadir Nuevo Producto al Catálogo
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#81756e]">Nombre del Producto</label>
                        <input
                          type="text"
                          required
                          value={newProduct.name || ''}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          placeholder="Ej. Pistachio Silk Jar"
                          className="w-full bg-[#fdf9f3] border border-[#39c0d3]/20 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#39c0d3] outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#81756e]">Precio ($ USD)</label>
                        <input
                          type="number"
                          step="0.05"
                          required
                          value={newProduct.price || 9.50}
                          onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                          className="w-full bg-[#fdf9f3] border border-[#39c0d3]/20 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#39c0d3] outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#81756e]">Categoría</label>
                        <select
                          value={newProduct.category || 'fruit'}
                          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as any })}
                          className="w-full bg-[#fdf9f3] border border-[#39c0d3]/20 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#39c0d3] outline-none"
                        >
                          <option value="fruit">Frutales (fruit)</option>
                          <option value="citrus">Cítricos (citrus)</option>
                          <option value="rich">Chocolates / Ricos (rich)</option>
                          <option value="special">Edición Especial (special)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#81756e]">Descripción Corta</label>
                      <input
                        type="text"
                        value={newProduct.description || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        placeholder="Ej. Tiramisú de pistacho con crema mascarpone y coulis de frambuesa."
                        className="w-full bg-[#fdf9f3] border border-[#39c0d3]/20 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#39c0d3] outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#81756e] block mb-1">Etiqueta Destacada (Badge)</label>
                        <div className="flex gap-2">
                          <select
                            onChange={(e) => {
                              if (e.target.value !== 'custom') {
                                setNewProduct({ ...newProduct, badge: e.target.value });
                              }
                            }}
                            className="bg-[#fdf9f3] border border-[#39c0d3]/20 rounded-xl p-2 text-xs focus:ring-2 focus:ring-[#39c0d3] outline-none"
                          >
                            <option value="">Sin etiqueta</option>
                            <option value="Bestseller">Bestseller</option>
                            <option value="En Oferta">En Oferta</option>
                            <option value="Nuevo">Nuevo</option>
                            <option value="Edición Especial">Edición Especial</option>
                            <option value="custom">-- Personalizada --</option>
                          </select>
                          <input
                            type="text"
                            value={newProduct.badge || ''}
                            onChange={(e) => setNewProduct({ ...newProduct, badge: e.target.value })}
                            placeholder="Etiqueta..."
                            className="flex-1 bg-[#fdf9f3] border border-[#39c0d3]/20 rounded-xl p-2 text-xs focus:ring-2 focus:ring-[#39c0d3] outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#81756e] block mb-1">Inventario / Stock Inicial</label>
                        <input
                          type="number"
                          min="0"
                          value={newProduct.stock || 12}
                          onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                          className="w-full bg-[#fdf9f3] border border-[#39c0d3]/20 rounded-xl p-2 text-xs focus:ring-2 focus:ring-[#39c0d3] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#81756e] block mb-1">Fotografía del Producto</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={newProduct.image || ''}
                          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                          placeholder="URL de la imagen o sube un archivo..."
                          className="flex-1 bg-[#fdf9f3] border border-[#39c0d3]/20 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-[#39c0d3] outline-none"
                        />
                        <label className="bg-[#26170c] hover:bg-[#39c0d3] hover:text-[#26170c] text-white px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shrink-0">
                          <span className="material-symbols-outlined text-[16px]">upload</span>
                          <span>Subir Imagen</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  const dataUrl = event.target?.result as string;
                                  setNewProduct({ ...newProduct, image: dataUrl });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-[#26170c] text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-[#39c0d3] hover:text-[#26170c] transition-colors flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      <span>Guardar Nuevo Producto</span>
                    </button>
                  </form>

                  {/* List of Existing Products */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold uppercase text-[#26170c] tracking-wider">
                      Lista de Productos Activos ({flavors.length})
                    </h5>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {flavors.map((flavor) => (
                        editingId === flavor.id ? (
                          <div 
                            key={flavor.id}
                            className="p-3.5 bg-white rounded-2xl border border-[#39c0d3] text-xs shadow-md space-y-3"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] font-bold uppercase text-[#81756e] block mb-0.5">Nombre del Producto</label>
                                <input 
                                  type="text"
                                  value={editProductState.name || ''}
                                  onChange={(e) => setEditProductState({ ...editProductState, name: e.target.value })}
                                  className="w-full bg-[#fdf9f3] border border-[#39c0d3]/20 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-[#39c0d3]"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold uppercase text-[#81756e] block mb-0.5">Precio ($ USD)</label>
                                <input 
                                  type="number"
                                  step="0.05"
                                  value={editProductState.price || 0}
                                  onChange={(e) => setEditProductState({ ...editProductState, price: parseFloat(e.target.value) || 0 })}
                                  className="w-full bg-[#fdf9f3] border border-[#39c0d3]/20 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-[#39c0d3]"
                                />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] font-bold uppercase text-[#81756e] block mb-0.5">Etiqueta Destacada (Badge)</label>
                                <div className="flex gap-2">
                                  <select
                                    value={['Bestseller', 'En Oferta', 'Nuevo', 'Edición Especial', ''].includes(editProductState.badge || '') ? editProductState.badge || '' : 'custom'}
                                    onChange={(e) => {
                                      if (e.target.value !== 'custom') {
                                        setEditProductState({ ...editProductState, badge: e.target.value });
                                      }
                                    }}
                                    className="bg-[#fdf9f3] border border-[#39c0d3]/20 rounded-lg p-1.5 text-xs outline-none focus:ring-1 focus:ring-[#39c0d3]"
                                  >
                                    <option value="">Sin etiqueta</option>
                                    <option value="Bestseller">Bestseller</option>
                                    <option value="En Oferta">En Oferta</option>
                                    <option value="Nuevo">Nuevo</option>
                                    <option value="Edición Especial">Edición Especial</option>
                                    <option value="custom">-- Personalizada --</option>
                                  </select>
                                  <input 
                                    type="text"
                                    value={editProductState.badge || ''}
                                    onChange={(e) => setEditProductState({ ...editProductState, badge: e.target.value })}
                                    placeholder="Etiqueta..."
                                    className="flex-1 bg-[#fdf9f3] border border-[#39c0d3]/20 rounded-lg p-1.5 text-xs outline-none focus:ring-1 focus:ring-[#39c0d3]"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-[10px] font-bold uppercase text-[#81756e] block mb-0.5">Inventario / Stock</label>
                                <input 
                                  type="number"
                                  min="0"
                                  value={editProductState.stock || 0}
                                  onChange={(e) => setEditProductState({ ...editProductState, stock: parseInt(e.target.value) || 0 })}
                                  className="w-full bg-[#fdf9f3] border border-[#39c0d3]/20 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-[#39c0d3]"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] font-bold uppercase text-[#81756e] block mb-0.5">Fotografía del Producto</label>
                              <div className="flex gap-2 items-center">
                                <input 
                                  type="text"
                                  value={editProductState.image || ''}
                                  onChange={(e) => setEditProductState({ ...editProductState, image: e.target.value })}
                                  placeholder="URL o sube un archivo..."
                                  className="flex-1 bg-[#fdf9f3] border border-[#39c0d3]/20 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-[#39c0d3]"
                                />
                                <label className="bg-[#26170c] hover:bg-[#39c0d3] hover:text-[#26170c] text-white px-3 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-1 shrink-0">
                                  <span className="material-symbols-outlined text-[16px]">upload</span>
                                  <span>Subir</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                          const dataUrl = event.target?.result as string;
                                          setEditProductState({ ...editProductState, image: dataUrl });
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] font-bold uppercase text-[#81756e] block mb-0.5">Descripción</label>
                              <input 
                                type="text"
                                value={editProductState.description || ''}
                                onChange={(e) => setEditProductState({ ...editProductState, description: e.target.value })}
                                className="w-full bg-[#fdf9f3] border border-[#39c0d3]/20 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-[#39c0d3]"
                              />
                            </div>
                            <div className="flex justify-end gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => { setEditingId(null); setEditProductState({}); }}
                                className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-[#4f453f] font-bold rounded-lg uppercase text-[10px] transition-colors"
                              >
                                Cancelar
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveEdit(flavor.id)}
                                className="px-3 py-1.5 bg-[#39c0d3] hover:bg-[#26170c] hover:text-white text-[#26170c] font-bold rounded-lg uppercase text-[10px] transition-colors"
                              >
                                Guardar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div 
                            key={flavor.id}
                            className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-[#39c0d3]/20 text-xs shadow-xs"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <img src={flavor.image} alt={flavor.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-serif font-bold text-[#26170c] text-sm truncate">{flavor.name}</span>
                                  {flavor.isBestseller && (
                                    <span className="bg-[#d61219] text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase shrink-0">
                                      ★ Bestseller
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] font-bold text-[#39c0d3]">${flavor.price.toFixed(2)}</span>
                                <span className="text-[10px] text-[#81756e] block truncate">{flavor.description}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 ml-3">
                              <button
                                onClick={() => handleToggleBestseller(flavor.id)}
                                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-colors ${
                                  flavor.isBestseller 
                                    ? 'bg-[#d61219] text-white' 
                                    : 'bg-[#f7f3ed] text-[#4f453f] hover:bg-[#39c0d3] hover:text-white'
                                }`}
                              >
                                {flavor.isBestseller ? '★ Bestseller' : '+ Destacar'}
                              </button>

                              <button
                                onClick={() => handleStartEdit(flavor)}
                                className="p-1.5 text-[#81756e] hover:text-[#39c0d3] hover:bg-[#39c0d3]/10 rounded-lg transition-colors"
                                title="Editar producto"
                              >
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                              </button>

                              <button
                                onClick={() => handleDeleteProduct(flavor.id)}
                                className="p-1.5 text-[#81756e] hover:text-[#d61219] hover:bg-[#d61219]/10 rounded-lg transition-colors"
                                title="Eliminar producto"
                              >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: WhatsApp Configurator */}
              {activeTab === 'whatsapp' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-[#39c0d3]/20 pb-3">
                    <h4 className="text-base font-serif font-bold text-[#26170c]">Módulo 3: Canales y Redes Sociales</h4>
                    <p className="text-xs text-[#81756e]">Configura el WhatsApp receptor de pedidos y las redes sociales de la pastelería.</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-[#39c0d3]/30 space-y-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#26170c] block mb-1">
                        Número Receptor de WhatsApp
                      </label>
                      <input
                        type="text"
                        value={themeSettings.whatsappNumber}
                        onChange={(e) => onUpdateThemeSettings({ ...themeSettings, whatsappNumber: e.target.value })}
                        placeholder="+15551234567"
                        className="w-full bg-[#fdf9f3] border border-[#39c0d3]/30 rounded-xl p-3 text-xs font-mono font-bold text-[#26170c] focus:ring-2 focus:ring-[#39c0d3] outline-none"
                      />
                      <p className="text-[10px] text-[#81756e] mt-1">
                        Formato internacional con código de país (ej. +15551234567 o +34612345678).
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#26170c] block mb-1">
                        Enlace de Instagram
                      </label>
                      <input
                        type="text"
                        value={themeSettings.instagramUrl || ''}
                        onChange={(e) => onUpdateThemeSettings({ ...themeSettings, instagramUrl: e.target.value })}
                        placeholder="https://instagram.com/tu-usuario"
                        className="w-full bg-[#fdf9f3] border border-[#39c0d3]/30 rounded-xl p-3 text-xs text-[#26170c] focus:ring-2 focus:ring-[#39c0d3] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#26170c] block mb-1">
                        Enlace de Facebook
                      </label>
                      <input
                        type="text"
                        value={themeSettings.facebookUrl || ''}
                        onChange={(e) => onUpdateThemeSettings({ ...themeSettings, facebookUrl: e.target.value })}
                        placeholder="https://facebook.com/tu-pagina"
                        className="w-full bg-[#fdf9f3] border border-[#39c0d3]/30 rounded-xl p-3 text-xs text-[#26170c] focus:ring-2 focus:ring-[#39c0d3] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#26170c] block mb-1">
                        Plantilla de Mensaje Predeterminado
                      </label>
                      <textarea
                        rows={4}
                        value={themeSettings.whatsappMessageTemplate}
                        onChange={(e) => onUpdateThemeSettings({ ...themeSettings, whatsappMessageTemplate: e.target.value })}
                        className="w-full bg-[#fdf9f3] border border-[#39c0d3]/30 rounded-xl p-3 text-xs text-[#1c1c18] focus:ring-2 focus:ring-[#39c0d3] outline-none leading-relaxed font-sans"
                      />
                      <p className="text-[10px] text-[#81756e] mt-1">
                        Usa las variables <code className="bg-[#e6e2dc] px-1 font-mono">{'{items}'}</code> y <code className="bg-[#e6e2dc] px-1 font-mono">{'{total}'}</code> para sustituir los productos del carrito automáticamente.
                      </p>
                    </div>

                    <div className="pt-2 flex flex-wrap gap-2">
                      <a
                        href={`https://wa.me/${themeSettings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Prueba de mensaje desde el Panel Admin CRUNQI")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#d61219] text-white px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-[#b00e14] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">chat</span>
                        <span>Probar Enlace de WhatsApp</span>
                      </a>
                    </div>

                    {/* Authorized Emails List */}
                    <div className="pt-5 border-t border-[#39c0d3]/20 mt-4 space-y-3">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-[#26170c] block">
                          Gestión de Accesos (Emails Autorizados)
                        </label>
                        <p className="text-[10px] text-[#81756e]">Solo las cuentas de Gmail en esta lista podrán configurar el 2FA e ingresar al panel.</p>
                      </div>

                      <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
                        {authorizedEmails.map(email => (
                          <div key={email} className="flex items-center justify-between bg-[#fdf9f3] px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold">
                            <span className="font-mono text-[#26170c]">{email}</span>
                            {email !== 'admin.crunqi@gmail.com' && email !== userEmail && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`¿Estás seguro de revocar la autorización para ${email}?`)) {
                                    setAuthorizedEmails(prev => prev.filter(e => e !== email));
                                  }
                                }}
                                className="text-[#d61219] hover:underline font-bold text-[10px] uppercase"
                              >
                                Revocar
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.currentTarget;
                        const input = form.elements.namedItem('newAuthEmail') as HTMLInputElement;
                        const newEmail = input.value.trim().toLowerCase();
                        if (newEmail && !authorizedEmails.includes(newEmail)) {
                          setAuthorizedEmails(prev => [...prev, newEmail]);
                          input.value = '';
                          alert(`¡${newEmail} ahora está autorizado para acceder!`);
                        }
                      }} className="flex gap-2">
                        <input
                          name="newAuthEmail"
                          type="email"
                          required
                          placeholder="correo-cliente@gmail.com"
                          className="flex-1 bg-[#fdf9f3] border border-[#39c0d3]/30 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-1 focus:ring-[#39c0d3]"
                        />
                        <button
                          type="submit"
                          className="bg-[#26170c] hover:bg-[#39c0d3] hover:text-[#26170c] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
                        >
                          Autorizar
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Batch Info */}
              {activeTab === 'batch' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-[#39c0d3]/20 pb-3">
                    <h4 className="text-base font-serif font-bold text-[#26170c]">Módulo 4: Lote de Cocina & Inventario</h4>
                    <p className="text-xs text-[#81756e]">Monitorea los lotes de producción y administra la existencia disponible (stock) de cada sabor.</p>
                  </div>

                  {/* Batch Details Card */}
                  <div className="bg-[#f7f3ed] p-5 rounded-2xl border border-[#39c0d3]/30 space-y-4">
                    <h5 className="text-xs font-bold uppercase text-[#26170c] tracking-wider mb-2">Información del Lote Activo</h5>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-[#81756e] block text-[10px] font-bold uppercase">ID Lote:</span>
                        <input
                          type="text"
                          value={batch.batchNumber}
                          onChange={(e) => setBatch({ ...batch, batchNumber: e.target.value })}
                          className="w-full bg-white border border-[#39c0d3]/20 rounded-lg p-2 font-mono font-bold"
                        />
                      </div>
                      <div>
                        <span className="text-[#81756e] block text-[10px] font-bold uppercase">Fecha Preparado:</span>
                        <input
                          type="text"
                          value={batch.datePrepared}
                          onChange={(e) => setBatch({ ...batch, datePrepared: e.target.value })}
                          className="w-full bg-white border border-[#39c0d3]/20 rounded-lg p-2 font-semibold"
                        />
                      </div>
                      <div>
                        <span className="text-[#81756e] block text-[10px] font-bold uppercase">Maestra Repostera:</span>
                        <input
                          type="text"
                          value={batch.masterPastryChef}
                          onChange={(e) => setBatch({ ...batch, masterPastryChef: e.target.value })}
                          className="w-full bg-white border border-[#39c0d3]/20 rounded-lg p-2 font-semibold"
                        />
                      </div>
                      <div>
                        <span className="text-[#81756e] block text-[10px] font-bold uppercase">Stock Total Frascos:</span>
                        <input
                          type="number"
                          value={batch.jarsAvailable}
                          onChange={(e) => setBatch({ ...batch, jarsAvailable: parseInt(e.target.value) || 0 })}
                          className="w-full bg-white border border-[#39c0d3]/20 rounded-lg p-2 font-bold text-[#d61219]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stock Management Table */}
                  <div className="bg-white p-5 rounded-2xl border border-[#39c0d3]/30 space-y-4">
                    <div className="flex justify-between items-center">
                      <h5 className="text-xs font-bold uppercase text-[#26170c] tracking-wider">Control de Stock por Sabor</h5>
                      <span className="text-[10px] bg-[#39c0d3]/20 text-[#26170c] font-bold px-2.5 py-1 rounded-full uppercase">
                        Inventario Activo
                      </span>
                    </div>

                    <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
                      {flavors.map((flavor) => (
                        <div key={flavor.id} className="flex items-center justify-between p-3 bg-[#fdf9f3] rounded-xl border border-gray-150 text-xs">
                          <div className="flex items-center gap-3">
                            <img src={flavor.image} alt={flavor.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                            <div>
                              <span className="font-serif font-bold text-[#26170c] text-sm block">{flavor.name}</span>
                              <span className="text-[10px] text-[#81756e] uppercase font-semibold">Categoría: {flavor.category}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-[#81756e] uppercase">Cantidad:</span>
                            <input
                              type="number"
                              min="0"
                              value={flavor.stock !== undefined ? flavor.stock : 12}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                const updated = flavors.map(f => f.id === flavor.id ? { ...f, stock: isNaN(val) ? 0 : val } : f);
                                onUpdateFlavors(updated);
                              }}
                              className="w-20 bg-white border border-[#39c0d3]/30 rounded-lg p-1.5 font-bold text-center text-[#26170c] outline-none focus:ring-1 focus:ring-[#39c0d3]"
                            />
                            {(flavor.stock !== undefined ? flavor.stock : 12) <= 0 ? (
                              <span className="bg-[#d61219]/10 text-[#d61219] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                                Agotado
                              </span>
                            ) : (
                              <span className="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                                En Stock
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#f7f3ed] border-t border-[#39c0d3]/20 flex items-center justify-between shrink-0">
              <span className="text-[10px] text-[#81756e] flex items-center gap-1 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Persistencia local activa (localStorage)</span>
              </span>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    if (confirm('¿Estás seguro de restablecer el inicio de sesión con Google y desactivar el Doble Factor (2FA)?')) {
                      localStorage.removeItem('crunqi_admin_email');
                      localStorage.removeItem('crunqi_2fa_enabled');
                      setIs2FAEnabled(false);
                      setUserEmail('');
                      handleLogout();
                      alert('Vínculo de Google y 2FA restablecidos.');
                    }
                  }}
                  className="text-[10px] font-bold text-[#81756e] hover:text-[#d61219] underline cursor-pointer"
                >
                  Restablecer 2FA y Google
                </button>
                
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold text-[#26170c] hover:text-[#d61219] underline cursor-pointer"
                >
                  Bloquear Portal y Salir
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
