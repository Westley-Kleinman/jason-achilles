import { ReactNode, useState, useEffect } from 'react';
import { Navigation } from './Navigation';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, Music, Headphones } from 'lucide-react';

const logoSources = ['logo.png', 'logo.webp', 'logo.svg', 'logo.jpg', 'logo.jpeg'];

const toPublicAsset = (relativePath: string) => `${import.meta.env.BASE_URL}${relativePath}`;

const socialLinks = [
  {
    href: 'https://open.spotify.com/artist/6ZmdI39EPLuZ7tcnaCIMnQ',
    label: 'SPOTIFY',
    icon: Headphones,
  },
  {
    href: 'https://music.apple.com/us/artist/jason-achilles/1484407411',
    label: 'APPLE',
    icon: Music,
  },
  {
    href: 'https://www.youtube.com/c/JasonAchilles',
    label: 'YOUTUBE',
    icon: Youtube,
  },
  {
    href: 'https://www.instagram.com/jasonachillesmezilis/',
    label: 'INSTAGRAM',
    icon: Instagram,
  },
];

export function Layout({ children }: { children: ReactNode }) {
  const [booting, setBooting] = useState(true);
  const [logoIndex, setLogoIndex] = useState(0);
  const [showLogoFallback, setShowLogoFallback] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  const handleLogoError = () => {
    if (logoIndex < logoSources.length - 1) {
      setLogoIndex((prev) => prev + 1);
      return;
    }

    setShowLogoFallback(true);
  };

  return (
    <div className="relative w-full min-h-screen md:h-dvh bg-black overflow-x-hidden overflow-y-auto md:overflow-hidden">
      {/* CRT Overlay */}
      <div className="crt-overlay pointer-events-none"></div>
      
      {/* Main Terminal Container */}
      <div className={`relative w-full min-h-screen md:h-full bg-[linear-gradient(180deg,#171a1f_0%,#111318_100%)] p-4 md:p-6 flex flex-col gap-4 md:gap-6 ${booting ? 'fishbowl' : 'crt-flicker box-glow-amber'}`}>
        
        {/* Header */}
        <header className="border-b-2 border-amber-dim pb-3 shrink-0">
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(340px,1fr)_auto_minmax(340px,1fr)] items-center gap-3 md:gap-4">
            <div className="order-2 xl:order-1 min-w-0 xl:justify-self-start xl:pr-3">
              <p className="font-share text-amber-bright text-lg md:text-xl tracking-[0.08em] leading-tight">
                Sonic Research Terminal v2.4 // Online
              </p>
              <p className="mt-0.5 font-vt323 text-base md:text-lg text-amber-dim leading-tight tracking-wide">
                EXPERIMENTAL HEAVY ROCK // BROADCAST IN REAL TIME
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 md:gap-3 font-vt323 text-base md:text-lg leading-tight">
                <span className="text-amber-dim">NEXT DEPLOYMENT:</span>
                <span className="text-[#95ff7a] drop-shadow-[0_0_6px_rgba(149,255,122,0.45)]">04.11 // YURI'S NIGHT (LA) // LOS ANGELES</span>
              </div>
            </div>

            {/* Centered Logo */}
            <div className="order-1 xl:order-2 flex items-center justify-center xl:justify-self-center">
              <Link
                to="/"
                className="flex items-center justify-center w-60 h-24 sm:w-72 sm:h-24 md:w-[430px] md:h-28 px-1 shrink-0"
              >
                {showLogoFallback ? (
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    <span className="font-orbitron text-amber font-bold text-xl leading-none">JA</span>
                    <span className="font-vt323 text-amber-dim text-xs mt-1">UPLOAD LOGO</span>
                  </div>
                ) : (
                  <img
                    src={toPublicAsset(logoSources[logoIndex])}
                    alt="Jason Achilles Logo"
                    className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(199,183,157,0.9)]"
                    onError={handleLogoError}
                  />
                )}
              </Link>
            </div>

            <div className="order-3 xl:order-3 w-full max-w-none xl:max-w-[260px] xl:justify-self-end">
              <span className="hidden xl:block font-vt323 text-xs tracking-[0.2em] text-amber-dim uppercase text-left xl:text-right">
                Stream // Follow
              </span>

              <div className="mt-2 grid grid-cols-2 gap-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group border border-transparent h-12 px-1 flex flex-col items-center justify-center gap-0.5 text-white bg-[linear-gradient(rgba(0,0,0,0.25),rgba(0,0,0,0.25)),linear-gradient(90deg,#ff7a1a,#ffb067,#ffd3a8)] [background-origin:border-box] [background-clip:padding-box,border-box] hover:bg-[linear-gradient(rgba(24,14,8,0.78),rgba(24,14,8,0.78)),linear-gradient(90deg,#ff7a1a,#ffb067,#ffd3a8)] hover:text-white transition-colors duration-200"
                      aria-label={`Open ${social.label}`}
                    >
                      <Icon className="w-4 h-4 md:w-5 md:h-5 stroke-[1.8] text-white" />
                      <span className="font-vt323 text-[10px] tracking-widest leading-none">
                        {social.label}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex flex-col md:flex-row gap-5 md:gap-6 md:min-h-0">
          {/* Navigation Sidebar */}
          <aside className="w-full md:w-80 xl:w-[23rem] shrink-0 flex flex-col gap-4 overflow-visible md:overflow-y-auto custom-scrollbar">
            <Navigation />
          </aside>

          {/* Main Display */}
          <main className="flex-1 bg-[linear-gradient(180deg,#000_0%,#05070a_100%)] border-2 border-amber-dim rounded-xl p-5 md:p-6 overflow-visible md:overflow-hidden relative box-glow-amber flex flex-col">
            {booting ? (
              <div className="w-full h-full flex items-center justify-center">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0, 1] }}
                  transition={{ duration: 0.5, times: [0, 0.2, 0.5, 1] }}
                  className="font-share text-2xl text-amber text-glow-amber"
                >
                  INITIALIZING SYSTEM...
                </motion.div>
              </div>
            ) : (
              <div className="flex-1 overflow-visible md:overflow-y-auto overflow-x-hidden md:pr-2 custom-scrollbar">
                {children}
              </div>
            )}
          </main>
        </div>
        
        {/* Footer */}
        <footer className="shrink-0 border-t-2 border-amber-dim pt-2 flex flex-wrap gap-2 justify-between font-share text-xs md:text-sm text-amber-dim">
          <span>SYS.OP: F. MITCHELL</span>
          <span>LAT: 34.0522 N // LON: 118.2437 W</span>
        </footer>
      </div>
    </div>
  );
}
