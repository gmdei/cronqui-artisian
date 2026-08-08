import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface NewsletterProps {
  apiUrl?: string;
}

export const Newsletter: React.FC<NewsletterProps> = ({ apiUrl }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { language, t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);

    const finalApiUrl = apiUrl || import.meta.env.VITE_NEWSLETTER_API_URL;

    if (finalApiUrl) {
      try {
        const isGoogleScript = finalApiUrl.includes('script.google.com');

        if (isGoogleScript) {
          // Google Apps Script doesn't return CORS headers on redirect (302) easily unless sent via text/plain to avoid preflight OPTIONS.
          await fetch(finalApiUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'text/plain',
            },
            body: JSON.stringify({ email: email.trim() }),
          });
        } else {
          const response = await fetch(finalApiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email.trim() }),
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
        }

        setSubmitted(true);
        setEmail('');
      } catch (err) {
        console.error('Error subscribing email:', err);
        setError(
          language === 'es'
            ? 'Hubo un error al suscribirte. Inténtalo de nuevo.'
            : 'There was an error subscribing. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    } else {
      // Simulation for development
      console.warn('Newsletter API URL is not defined. Simulating submission.');
      setTimeout(() => {
        setSubmitted(true);
        setLoading(false);
        setEmail('');
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      }, 1000);
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
            <span>{language === 'es' ? '¡Te has suscrito con éxito! Tu correo ha sido registrado.' : 'You have successfully subscribed! Your email has been registered.'}</span>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder={t('newsletter.placeholder')}
                className="flex-1 bg-[#3d2b1f] border border-[#39c0d3]/30 text-white px-6 py-4 rounded-2xl text-sm placeholder-[#d2c4bc] focus:outline-none focus:ring-2 focus:ring-[#39c0d3] focus:border-transparent transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[#39c0d3] text-[#26170c] px-8 py-4 rounded-2xl font-bold text-sm hover:bg-white active:scale-95 transition-all shadow-md shrink-0 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-[#26170c] border-t-transparent" />
                    <span>{language === 'es' ? 'Enviando...' : 'Sending...'}</span>
                  </>
                ) : (
                  t('newsletter.subscribe')
                )}
              </button>
            </form>
            {error && (
              <p className="text-red-400 text-xs mt-3 text-left pl-2 animate-fade-in">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
