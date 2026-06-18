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
    label: 'Spotify',
    icon: Headphones,
  },
  {
    href: 'https://music.apple.com/us/artist/jason-achilles/1484407411',
    label: 'Apple Music',
    icon: Music,
  },
  {
    href: 'https://www.youtube.com/c/JasonAchilles',
    label: 'YouTube',
    icon: Youtube,
  },
  {
    href: 'https://www.instagram.com/jasonachillesmezilis/',
    label: 'Instagram',
    icon: Instagram,
  },
];

type BandsintownEvent = {
  datetime?: string;
  url?: string;
  offers?: Array<{ url?: string; type?: string }>;
  venue?: {
    name?: string;
    city?: string;
    region?: string;
    country?: string;
    url?: string;
  };
  title?: string;
};

const BIT_ARTIST_ID = 'id_15307403';
const BIT_APP_ID = '14465519612d514499d35a76c971c904';
const DEFAULT_TICKET_URL = 'https://www.bandsintown.com/a/15307403';

const fallbackShows = [
  {
    date: '2026-04-11',
    text: "04.11 // YURI'S NIGHT (LA) // LOS ANGELES",
    ticketUrl: 'https://yurisnight.net/',
  },
  {
    date: '2026-04-25',
    text: '04.25 // DOME FEST WEST // BOULDER',
    ticketUrl: 'https://domfestwest.com/',
  },
  {
    date: '2026-08-12',
    text: '08.12 // ICELAND ECLIPSE FESTIVAL // HELLISSANDUR',
    ticketUrl: 'https://icelandeclipse.is/',
  },
];

const formatTickerDate = (date: string) => {
  const parts = date.split('-');
  if (parts.length !== 3) return date;
  const [, month, day] = parts;
  if (!month || !day) return date;
  return `${month}.${day}`;
};

const normalizeTickerLocation = (venue?: BandsintownEvent['venue']) => {
  const parts = [venue?.city, venue?.region || venue?.country]
    .map((value) => (value ? String(value).trim() : ''))
    .filter(Boolean);

  if (parts.length === 0) {
    return 'LOCATION TBA';
  }

  return parts.join(', ').toUpperCase();
};

const mapEventTicketUrl = (event: BandsintownEvent) => {
  const offers = Array.isArray(event.offers) ? event.offers : [];
  const ticketOffer =
    offers.find((offer) => String(offer?.type || '').toLowerCase().includes('ticket')) || offers[0];
  return ticketOffer?.url || event.url || event.venue?.url || DEFAULT_TICKET_URL;
};

export function Layout({ children }: { children: ReactNode }) {
  const [booting, setBooting] = useState(true);
  const [logoIndex, setLogoIndex] = useState(0);
  const [showLogoFallback, setShowLogoFallback] = useState(false);
  const [showItems, setShowItems] = useState(fallbackShows);

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadShows = async () => {
      try {
        const response = await fetch(
          `https://rest.bandsintown.com/artists/${encodeURIComponent(BIT_ARTIST_ID)}/events?app_id=${BIT_APP_ID}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error(`Bandsintown request failed: ${response.status}`);
        }

        const payload = await response.json();
        if (!Array.isArray(payload)) {
          throw new Error('Bandsintown payload was not an array.');
        }

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const mapped = payload
          .map((event: BandsintownEvent) => {
            const datetime = typeof event.datetime === 'string' ? event.datetime : '';
            const date = datetime ? datetime.slice(0, 10) : 'TBD';
            const venue = String(event.venue?.name || event.title || 'UNKNOWN VENUE').toUpperCase();
            const city = normalizeTickerLocation(event.venue);
            return {
              date,
              text: `${formatTickerDate(date)} // ${venue} // ${city}`,
              ticketUrl: mapEventTicketUrl(event),
            };
          })
          .filter((event) => {
            const parsedDate = new Date(`${event.date}T00:00:00`);
            return !Number.isNaN(parsedDate.getTime()) && parsedDate.getTime() >= todayStart.getTime();
          })
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 6);

        if (!isMounted) return;

        if (mapped.length > 0) {
          setShowItems(mapped);
        } else {
          setShowItems(fallbackShows);
        }
      } catch (error) {
        if (!isMounted || controller.signal.aborted) return;
        setShowItems(fallbackShows);
      }
    };

    loadShows();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const handleLogoError = () => {
    if (logoIndex < logoSources.length - 1) {
      setLogoIndex((prev) => prev + 1);
      return;
    }

    setShowLogoFallback(true);
  };

  const nextShow = showItems[0];
  const nextShowText = showItems.map((show) => show.text).join('   //   ');

  return (
    <div className="relative w-full min-h-screen md:h-dvh bg-black overflow-x-hidden overflow-y-auto md:overflow-hidden">
      <div className="crt-overlay pointer-events-none"></div>

      <div
        className={`relative w-full min-h-screen md:h-full bg-[linear-gradient(180deg,#171a1f_0%,#111318_100%)] p-4 md:p-6 flex flex-col gap-4 md:gap-6 pb-24 md:pb-6 ${booting ? 'fishbowl' : 'crt-flicker box-glow-amber'}`}
      >
        <header className="border-b-2 border-amber-dim pb-3 shrink-0">
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(340px,1fr)_auto_minmax(340px,1fr)] items-center gap-3 md:gap-4">
            <div className="order-2 xl:order-1 min-w-0 xl:justify-self-start xl:pr-12">
              <p className="font-share text-amber-bright text-lg md:text-xl tracking-[0.08em] leading-tight">
                Jason Achilles // Live Terminal
              </p>
              <p className="mt-0.5 font-vt323 text-base md:text-lg text-amber-dim leading-tight tracking-wide">
                EXPERIMENTAL HEAVY ROCK // BROADCAST IN REAL TIME
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 md:gap-3 font-vt323 text-lg md:text-xl leading-tight">
                <span className="text-amber-dim text-sm md:text-base tracking-[0.14em] uppercase">
                  Next Show:
                </span>
                <div className="relative flex-1 min-w-[220px] max-w-full xl:max-w-[360px] overflow-hidden">
                  <div className="marquee-track">
                    <span className="text-[#95ff7a] drop-shadow-[0_0_8px_rgba(149,255,122,0.55)]">
                      {nextShowText}
                    </span>
                    <span
                      className="text-[#95ff7a] drop-shadow-[0_0_8px_rgba(149,255,122,0.55)]"
                      aria-hidden="true"
                    >
                      {nextShowText}
                    </span>
                  </div>
                </div>
              </div>
            </div>

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
              <span className="font-vt323 text-xs tracking-[0.2em] text-amber-dim uppercase text-center xl:text-right">
                Stream // Follow
              </span>

              <div className="mt-2 flex xl:hidden items-center justify-center xl:justify-end gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-[4px] border border-[#ff7a1a]/60 bg-black/85 text-[#ffd3a8] hover:bg-[#ff7a1a]/20 transition-colors duration-200"
                    aria-label={`Open ${social.label}`}
                  >
                    <social.icon className="w-5 h-5 md:w-6 md:h-6" />
                  </a>
                ))}
              </div>

              <div className="hidden xl:grid mt-2 grid-cols-2 gap-2">
                {socialLinks.map((social) => (
                  <div
                    key={`${social.label}-label`}
                    className="rounded-[4px] p-[1px] bg-gradient-to-r from-[#ff7a1a] via-[#ffb067] to-[#ffd3a8]"
                  >
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group h-12 px-2 flex flex-col items-center justify-center gap-1 rounded-[3px] bg-black/85 text-[#ffd3a8] hover:bg-black/70 transition-colors duration-200"
                      aria-label={`Open ${social.label}`}
                    >
                      <span className="font-share text-base lg:text-xl tracking-[0.1em] leading-none whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                        {social.label.toUpperCase()}
                      </span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col md:flex-row gap-5 md:gap-6 md:min-h-0">
          <aside className="w-full md:w-80 xl:w-[23rem] shrink-0 flex flex-col gap-4 overflow-visible md:overflow-y-auto custom-scrollbar">
            <Navigation />
          </aside>

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

        <footer className="shrink-0 border-t-2 border-amber-dim pt-3 flex flex-col gap-2 font-share text-xs md:text-sm text-amber-dim">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <a href="mailto:jmezilis@gmail.com" className="hover:text-amber transition-colors">
              CONTACT
            </a>
            <Link to="/schematics" className="hover:text-amber transition-colors">
              LIVE RIG LAB (EPK)
            </Link>
            <Link to="/merch" className="hover:text-amber transition-colors">
              MERCH LOCKER
            </Link>
            <Link to="/logistics" className="hover:text-amber transition-colors">
              SHOWS
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 justify-between">
            <span>SYS.OP: F. MITCHELL</span>
            <span>LAT: 34.0522 N // LON: 118.2437 W</span>
          </div>
        </footer>
      </div>

      {!booting && nextShow ? (
        <div className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t-2 border-[#84ff6a]/60 bg-[#0b0f0a]/95 backdrop-blur-sm px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-vt323 text-xs text-[#84ff6a] uppercase tracking-wider">Next Show</p>
              <p className="font-share text-sm text-[#ebffe4] truncate">{nextShow.text}</p>
            </div>
            <a
              href={nextShow.ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 border border-[#84ff6a] px-3 py-2 font-share text-xs tracking-wider text-[#ebffe4] hover:bg-[#84ff6a] hover:text-black transition-colors"
            >
              TICKETS
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
