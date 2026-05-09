import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';

type TrajectoryStop = {
  date: string;
  city: string;
  venue: string;
  status: 'CONFIRMED' | 'PENDING';
  ticketUrl: string;
  venueUrl: string;
  note: string;
};

const BIT_ARTIST_ID = 'id_15307403';
const BIT_APP_ID = '14465519612d514499d35a76c971c904';

const fallbackTrajectoryData: TrajectoryStop[] = [
  {
    date: '2026-04-11',
    city: 'LOS ANGELES, CA',
    venue: "YURI'S NIGHT (LA)",
    status: 'CONFIRMED',
    ticketUrl: 'https://yurisnight.net/',
    venueUrl: 'https://yurisnight.net/',
    note: 'Launch appearance at Yuri\'s Night in Los Angeles.',
  },
  {
    date: '2026-04-25',
    city: 'BOULDER, CO',
    venue: 'DOME FEST WEST',
    status: 'CONFIRMED',
    ticketUrl: 'https://domfestwest.com/',
    venueUrl: 'https://domfestwest.com/',
    note: 'Feature slot: "ROVERS, ROCKETS & ROCK N\' ROLL".',
  },
  {
    date: '2026-08-12',
    city: 'HELLISSANDUR, ICELAND',
    venue: 'ICELAND ECLIPSE FESTIVAL',
    status: 'CONFIRMED',
    ticketUrl: 'https://icelandeclipse.is/',
    venueUrl: 'https://icelandeclipse.is/',
    note: 'Festival deployment window: AUG 12-15, 2026.',
  },
];

const getDaysUntil = (date: string) => {
  const now = new Date();
  const target = new Date(`${date}T20:00:00`);
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return 0;
  }

  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const normalizeLocation = (venue: { city?: string; region?: string; country?: string }) => {
  const parts = [venue.city, venue.region || venue.country]
    .map((value) => (value ? String(value).trim() : ''))
    .filter(Boolean);

  if (parts.length === 0) {
    return 'LOCATION TBA';
  }

  return parts.join(', ').toUpperCase();
};

const mapBandsintownEvent = (event: any): TrajectoryStop => {
  const datetime = typeof event?.datetime === 'string' ? event.datetime : '';
  const date = datetime ? datetime.slice(0, 10) : 'TBD';
  const venue = String(event?.venue?.name || event?.title || 'UNKNOWN VENUE').toUpperCase();
  const city = normalizeLocation(event?.venue || {});
  const offers = Array.isArray(event?.offers) ? event.offers : [];
  const ticketOffer =
    offers.find((offer: any) => String(offer?.type || '').toLowerCase().includes('ticket')) ||
    offers[0] ||
    null;
  const ticketUrl = ticketOffer?.url || event?.url || 'https://www.bandsintown.com/a/15307403';
  const venueUrl = event?.venue?.url || ticketUrl;

  return {
    date,
    city,
    venue,
    status: 'CONFIRMED',
    ticketUrl,
    venueUrl,
    note: 'Synced from Bandsintown event feed.',
  };
};


const SplitFlapText = ({ text, length }: { text: string; length: number }) => {
  const padded = text.toUpperCase().padEnd(length, ' ').slice(0, length);

  return (
    <div className="flex gap-[3px]">
      {padded.split('').map((char, index) => {
        const glyph = char === ' ' ? '\u00A0' : char;
        return (
          <div
            key={`${index}-${char}`}
            className="relative inline-flex w-6 h-8 md:w-7 md:h-10 items-center justify-center bg-[#0b0f14] border border-[#4a4a4a] font-vt323 text-[#fff1dc] text-base md:text-xl tracking-[0.08em] shadow-[inset_0_0_8px_rgba(0,0,0,0.85)] overflow-hidden"
          >
            <span className="absolute left-0 right-0 top-1/2 h-px bg-black/80"></span>
            <span className="relative z-10">{glyph}</span>
          </div>
        );
      })}
    </div>
  );
};

export function LogisticsHub({
  initialTab = 'TRAJECTORY',
}: {
  initialTab?: 'SURPLUS' | 'TRAJECTORY';
}) {
  const [activeTab, setActiveTab] = useState<'SURPLUS' | 'TRAJECTORY'>(initialTab);
  const [trajectoryData, setTrajectoryData] = useState<TrajectoryStop[]>(fallbackTrajectoryData);
  const [loadingTrajectory, setLoadingTrajectory] = useState(true);
  const [trajectorySource, setTrajectorySource] = useState<'bandsintown' | 'fallback'>('fallback');
  const [rotationIndex, setRotationIndex] = useState(0);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadTrajectoryFromBandsintown = async () => {
      setLoadingTrajectory(true);
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
          .map(mapBandsintownEvent)
          .filter((event) => {
            const parsedDate = new Date(`${event.date}T00:00:00`);
            return !Number.isNaN(parsedDate.getTime()) && parsedDate.getTime() >= todayStart.getTime();
          })
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        if (!isMounted) return;

        if (mapped.length > 0) {
          setTrajectoryData(mapped);
          setTrajectorySource('bandsintown');
        } else {
          setTrajectoryData(fallbackTrajectoryData);
          setTrajectorySource('fallback');
        }
      } catch (error) {
        if (!isMounted || controller.signal.aborted) return;
        setTrajectoryData(fallbackTrajectoryData);
        setTrajectorySource('fallback');
      } finally {
        if (isMounted) {
          setLoadingTrajectory(false);
        }
      }
    };

    loadTrajectoryFromBandsintown();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    setRotationIndex(0);
  }, [trajectoryData]);

  const boardData = trajectoryData.slice(0, 8);
  const nextDeployment = boardData.find((stop) => stop.status === 'CONFIRMED') ?? boardData[0];
  const daysUntilDeployment = getDaysUntil(nextDeployment.date);
  const rotationSafeIndex = boardData.length > 0 ? rotationIndex % boardData.length : 0;
  const rotatingStop = boardData[rotationSafeIndex];

  useEffect(() => {
    if (activeTab !== 'TRAJECTORY' || boardData.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setRotationIndex((prev) => (prev + 1) % boardData.length);
    }, 5200);

    return () => clearInterval(interval);
  }, [activeTab, boardData.length]);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b border-amber-dim pb-2">
        <h2 className="font-share text-2xl uppercase tracking-widest bg-gradient-to-r from-[#ff7a1a] via-[#ffb067] to-[#ffd3a8] bg-clip-text text-transparent">
          Logistics Hub
        </h2>
        <div className="flex gap-2 w-full sm:w-auto justify-start sm:justify-end">
          <button
            onClick={() => setActiveTab('TRAJECTORY')}
            className={`px-3 py-1 font-vt323 text-sm border ${activeTab === 'TRAJECTORY' ? 'border-[#ff7a1a] bg-[#ff7a1a]/20 text-[#ffd4ad]' : 'border-amber-dim text-amber-dim hover:border-[#ff7a1a] hover:text-[#ffb067]'}`}
          >
            TRAJECTORY
          </button>
          <button
            onClick={() => setActiveTab('SURPLUS')}
            className={`px-3 py-1 font-vt323 text-sm border ${activeTab === 'SURPLUS' ? 'border-[#ff4fc3] bg-[#ff4fc3]/20 text-[#ffd8f2]' : 'border-amber-dim text-amber-dim hover:border-[#ff4fc3] hover:text-[#ffb5e5]'}`}
          >
            SURPLUS
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-visible md:overflow-y-auto custom-scrollbar bg-black border-2 border-amber-dim p-4 rounded box-glow relative">
        {activeTab === 'TRAJECTORY' ? (
          <div className="flex flex-col gap-6">
            <div className="font-share text-[#ffc08e] border-b border-[#ff7a1a]/35 pb-2">
              UPCOMING TRAJECTORY // LIVE_PROMOTION_ACTIVE
            </div>

            <div className="rounded p-[1px] bg-gradient-to-r from-[#ff5a00] via-[#ff9d4d] to-[#ff6f1a] shadow-[0_0_18px_rgba(255,122,26,0.25)]">
              <div className="border border-[#ff7a1a]/45 bg-terminal-panel p-4 rounded-[7px]">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <h3 className="font-share text-lg tracking-wider text-[#ffd4ad] uppercase">
                    Primary Broadcast Window Loaded
                  </h3>
                  <span className="font-vt323 text-sm text-[#ffb57c]">T-MINUS {daysUntilDeployment} DAYS</span>
                </div>
                <p className="font-vt323 text-lg text-[#ffd1a3] mt-2">
                  {nextDeployment.date} // {nextDeployment.city} // {nextDeployment.venue}
                </p>
                <p className="font-vt323 text-sm text-[#ffb57c] mt-1">{nextDeployment.note}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={nextDeployment.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-[#ff7a1a] px-3 py-2 font-share text-sm tracking-wider text-[#ffd4ad] hover:bg-[#ff7a1a] hover:text-black transition-colors"
                  >
                    ACCESS TICKET LISTINGS
                  </a>
                  <a
                    href={nextDeployment.venueUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-[#ff7a1a]/60 px-3 py-2 font-share text-sm tracking-wider text-[#ffc18f] hover:border-[#ff7a1a] hover:bg-[#ff7a1a]/15 transition-colors"
                  >
                    VENUE INTEL
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded p-[1px] bg-gradient-to-r from-[#ff5a00] via-[#ff9d4d] to-[#ff6f1a] shadow-[0_0_18px_rgba(255,122,26,0.25)]">
              <div className="border border-[#ff7a1a]/45 bg-terminal-panel p-4 rounded-[7px]">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-amber-dim/25 pb-2">
                  <div className="font-share text-[#ffc08e] text-base md:text-lg tracking-wider uppercase">
                    Split-Flap Ticker // Live Event Feed
                  </div>
                  <div className="font-vt323 text-sm text-[#ffb57c] uppercase tracking-wider">
                    {loadingTrajectory
                      ? 'SYNCING BANDSINTOWN FEED...'
                      : trajectorySource === 'bandsintown'
                        ? 'SOURCE: BANDSINTOWN (EXTRACODE SETTINGS)'
                        : 'SOURCE: FALLBACK DATA'}
                  </div>
                </div>

                {rotatingStop ? (
                  <div className="mt-4 border border-[#ff7a1a]/45 bg-[#100804] rounded p-3 md:p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 font-vt323 text-xs uppercase tracking-[0.2em] text-[#ffc18f]">
                      <span>Rotating Launch Feed</span>
                      <span className="text-[#ffb57c]">AUTO-ROTATE ACTIVE</span>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${rotatingStop.date}-${rotatingStop.venue}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35 }}
                        className="mt-3 flex flex-col gap-2"
                      >
                        <div className="font-share text-lg md:text-2xl text-[#ffd4ad] uppercase tracking-wide">
                          {rotatingStop.date} // {rotatingStop.venue}
                        </div>
                        <div className="font-vt323 text-base md:text-lg text-[#ffb57c]">
                          {rotatingStop.city}
                        </div>
                        <div className="font-vt323 text-sm md:text-base text-amber-dim">
                          {rotatingStop.note}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <a
                            href={rotatingStop.ticketUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border border-[#ff7a1a] px-3 py-1.5 font-share text-xs md:text-sm tracking-wider text-[#ffd4ad] hover:bg-[#ff7a1a] hover:text-black transition-colors"
                          >
                            TICKETS
                          </a>
                          <a
                            href={rotatingStop.venueUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border border-[#ff7a1a]/60 px-3 py-1.5 font-share text-xs md:text-sm tracking-wider text-[#ffc18f] hover:border-[#ff7a1a] hover:bg-[#ff7a1a]/15 transition-colors"
                          >
                            VENUE
                          </a>
                          <span className="ml-auto font-vt323 text-xs md:text-sm text-amber-dim">
                            T-{getDaysUntil(rotatingStop.date)}D
                          </span>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                ) : null}

                <div className="mt-4 hidden md:flex flex-col gap-3 overflow-x-auto custom-scrollbar pb-2">
                  <div className="flex gap-6 min-w-[1180px] font-vt323 text-[#ffdcb8] text-base tracking-[0.16em] px-2">
                    <div className="w-[130px]">DATE</div>
                    <div className="w-[230px]">CITY</div>
                    <div className="w-[320px]">VENUE</div>
                    <div>STATUS</div>
                    <div className="ml-auto">ACTION</div>
                  </div>

                  {rotatingStop ? (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${rotatingStop.date}-${rotatingStop.venue}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35 }}
                        className="bg-[#0a0a0a] p-3 border border-[#222] min-w-[1180px]"
                      >
                        <div className="flex gap-4 items-center text-base">
                          <div className="relative overflow-hidden w-[720px]">
                            <div className="marquee-track-row">
                              <div className="flex gap-4 items-center">
                                <div className="w-[130px]">
                                  <SplitFlapText text={rotatingStop.date} length={10} />
                                </div>
                                <div className="w-[230px]">
                                  <SplitFlapText text={rotatingStop.city} length={18} />
                                </div>
                                <div className="w-[320px]">
                                  <SplitFlapText text={rotatingStop.venue} length={24} />
                                </div>
                              </div>
                              <div className="flex gap-4 items-center" aria-hidden="true">
                                <div className="w-[130px]">
                                  <SplitFlapText text={rotatingStop.date} length={10} />
                                </div>
                                <div className="w-[230px]">
                                  <SplitFlapText text={rotatingStop.city} length={18} />
                                </div>
                                <div className="w-[320px]">
                                  <SplitFlapText text={rotatingStop.venue} length={24} />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="font-vt323 text-xl px-2 text-[#0f0]">[{rotatingStop.status}]</div>
                          <div className="ml-auto flex items-center gap-2">
                            <span className="font-vt323 text-sm text-amber-dim">T-{getDaysUntil(rotatingStop.date)}D</span>
                            <a
                              href={rotatingStop.ticketUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="border border-amber-dim px-2 py-1.5 font-vt323 text-sm text-amber hover:border-amber hover:bg-amber hover:text-black transition-colors"
                            >
                              TICKETS
                            </a>
                            <a
                              href={rotatingStop.venueUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="border border-amber-dim px-2 py-1.5 font-vt323 text-sm text-amber hover:border-amber hover:bg-amber hover:text-black transition-colors"
                            >
                              VENUE
                            </a>
                          </div>
                        </div>
                        <p className="font-vt323 text-base text-amber-dim mt-2 px-1">{rotatingStop.note}</p>
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <div className="bg-[#0a0a0a] p-3 border border-[#222] min-w-[1180px] font-vt323 text-amber-dim">
                      No upcoming events found.
                    </div>
                  )}
                </div>

                <div className="mt-3 md:hidden flex flex-col gap-3">
                  {boardData.map((gig, index) => (
                    <article key={`${gig.date}-${gig.venue}-${index}`} className="border border-[#222] bg-[#0a0a0a] p-3 rounded">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-share text-base text-[#ffd3a8]">{gig.date}</p>
                          <p className="font-share text-lg text-[#ffdcb8] uppercase leading-tight mt-1 break-words">{gig.venue}</p>
                          <p className="font-vt323 text-lg text-[#ffb57c] mt-1">{gig.city}</p>
                        </div>
                        <span className="shrink-0 font-vt323 text-sm text-[#0f0] border border-[#0f0]/40 px-2 py-0.5">[{gig.status}]</span>
                      </div>

                      <p className="font-vt323 text-base text-amber-dim mt-2">{gig.note}</p>

                      <div className="mt-3 flex flex-wrap gap-2 items-center">
                        <a
                          href={gig.ticketUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border border-amber-dim px-2 py-1.5 font-vt323 text-sm text-amber hover:border-amber hover:bg-amber hover:text-black transition-colors"
                        >
                          TICKETS
                        </a>
                        <a
                          href={gig.venueUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border border-amber-dim px-2 py-1.5 font-vt323 text-sm text-amber hover:border-amber hover:bg-amber hover:text-black transition-colors"
                        >
                          VENUE
                        </a>
                        <span className="font-vt323 text-sm text-amber-dim ml-auto">T-{getDaysUntil(gig.date)}D</span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="font-share text-[#ffc8ec] border-b border-[#ff4fc3]/35 pb-2">
              SUPPLY VAULT // STAGING_CHANNEL
            </div>

            <div className="rounded p-[1px] bg-gradient-to-r from-[#a61b77] via-[#ff4fc3] to-[#ff96dd] shadow-[0_0_18px_rgba(255,79,195,0.25)]">
              <div className="border border-[#ff4fc3]/45 bg-terminal-panel p-5 rounded-[7px] flex flex-col gap-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <h3 className="font-share text-lg tracking-wider text-[#ffd8f2] uppercase">
                    SUPPLY VAULT COMING SOON
                  </h3>
                  <span className="font-vt323 text-sm text-[#ffb5e5]">DROP CHANNEL: CALIBRATING</span>
                </div>

                <p className="font-vt323 text-lg text-[#ffd8f2] leading-snug">
                  The vault is being pressurized for future merch deployments. Inventory manifests, limited runs, and
                  alert signups will appear here soon.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="border border-[#ff4fc3]/40 bg-black/40 px-3 py-2 font-vt323 text-[#ffc8ec] text-base">
                    [01] LIMITED BATCH APPAREL
                  </div>
                  <div className="border border-[#ff4fc3]/40 bg-black/40 px-3 py-2 font-vt323 text-[#ffc8ec] text-base">
                    [02] PHYSICAL AUDIO RELEASES
                  </div>
                  <div className="border border-[#ff4fc3]/40 bg-black/40 px-3 py-2 font-vt323 text-[#ffc8ec] text-base">
                    [03] TOUR-ONLY ARTIFACTS
                  </div>
                </div>

                <div className="border border-[#ff4fc3]/30 bg-[#ff4fc3]/10 px-3 py-2 font-vt323 text-sm text-[#ffd8f2] leading-relaxed">
                  &gt; STATUS: COMING SOON. Supply Vault systems are offline while upcoming drops are staged.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
