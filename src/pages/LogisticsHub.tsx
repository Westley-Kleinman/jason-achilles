import { useState, useEffect } from 'react';

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
    <div className="flex">
      {padded.split('').map((char, index) => {
        const glyph = char === ' ' ? '\u00A0' : char;
        return (
          <div
            key={`${index}-${char}`}
            className="relative inline-flex w-4 h-6 md:w-5 md:h-8 mx-[1px] items-center justify-center bg-[#111] border border-[#333] font-share text-[#ffd3a8] text-[11px] md:text-sm shadow-inner overflow-hidden"
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

  const boardData = trajectoryData.slice(0, 8);
  const nextDeployment = boardData.find((stop) => stop.status === 'CONFIRMED') ?? boardData[0];
  const daysUntilDeployment = getDaysUntil(nextDeployment.date);

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

                <div className="mt-3 hidden md:flex flex-col gap-3 overflow-x-auto custom-scrollbar pb-2">
                  <div className="flex gap-4 min-w-[1040px] font-vt323 text-amber-dim text-sm px-2">
                    <div className="w-[118px]">DATE</div>
                    <div className="w-[205px]">CITY</div>
                    <div className="w-[248px]">VENUE</div>
                    <div>STATUS</div>
                    <div className="ml-auto">ACTION</div>
                  </div>

                  {boardData.map((gig, index) => (
                    <div key={`${gig.date}-${gig.venue}-${index}`} className="bg-[#0a0a0a] p-2 border border-[#222] min-w-[1040px]">
                      <div className="flex gap-4 items-center">
                        <SplitFlapText text={gig.date} length={10} />
                        <SplitFlapText text={gig.city} length={17} />
                        <SplitFlapText text={gig.venue} length={21} />
                        <div className="font-vt323 text-lg px-2 text-[#0f0]">[{gig.status}]</div>
                        <div className="ml-auto flex items-center gap-2">
                          <span className="font-vt323 text-xs text-amber-dim">T-{getDaysUntil(gig.date)}D</span>
                          <a
                            href={gig.ticketUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border border-amber-dim px-2 py-1 font-vt323 text-xs text-amber hover:border-amber hover:bg-amber hover:text-black transition-colors"
                          >
                            TICKETS
                          </a>
                          <a
                            href={gig.venueUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border border-amber-dim px-2 py-1 font-vt323 text-xs text-amber hover:border-amber hover:bg-amber hover:text-black transition-colors"
                          >
                            VENUE
                          </a>
                        </div>
                      </div>
                      <p className="font-vt323 text-sm text-amber-dim mt-2 px-1">{gig.note}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 md:hidden flex flex-col gap-3">
                  {boardData.map((gig, index) => (
                    <article key={`${gig.date}-${gig.venue}-${index}`} className="border border-[#222] bg-[#0a0a0a] p-3 rounded">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-share text-sm text-[#ffd3a8]">{gig.date}</p>
                          <p className="font-share text-base text-[#ffdcb8] uppercase leading-tight mt-1 break-words">{gig.venue}</p>
                          <p className="font-vt323 text-base text-[#ffb57c] mt-1">{gig.city}</p>
                        </div>
                        <span className="shrink-0 font-vt323 text-sm text-[#0f0] border border-[#0f0]/40 px-2 py-0.5">[{gig.status}]</span>
                      </div>

                      <p className="font-vt323 text-sm text-amber-dim mt-2">{gig.note}</p>

                      <div className="mt-3 flex flex-wrap gap-2 items-center">
                        <a
                          href={gig.ticketUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border border-amber-dim px-2 py-1 font-vt323 text-xs text-amber hover:border-amber hover:bg-amber hover:text-black transition-colors"
                        >
                          TICKETS
                        </a>
                        <a
                          href={gig.venueUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border border-amber-dim px-2 py-1 font-vt323 text-xs text-amber hover:border-amber hover:bg-amber hover:text-black transition-colors"
                        >
                          VENUE
                        </a>
                        <span className="font-vt323 text-xs text-amber-dim ml-auto">T-{getDaysUntil(gig.date)}D</span>
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
