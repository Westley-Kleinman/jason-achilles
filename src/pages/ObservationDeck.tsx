import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Activity, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

type IssTelemetry = {
  latitude: number;
  longitude: number;
  timestamp: number;
};

type ChannelFeed = {
  label: string;
  type: 'video' | 'iss';
  videoId?: string;
};

const ISS_ENDPOINT = 'https://api.wheretheiss.at/v1/satellites/25544';

const formatIssCoord = (value?: number) => {
  if (value === undefined || value === null) return '--';
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return '--';
  return parsed.toFixed(2);
};

const formatIssTimestamp = (timestamp?: number) => {
  if (!timestamp) return '--';
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export function ObservationDeck() {
  const [activeChannel, setActiveChannel] = useState(1);
  const [glitching, setGlitching] = useState(false);
  const [issTelemetry, setIssTelemetry] = useState<IssTelemetry | null>(null);
  const [issStatus, setIssStatus] = useState<'loading' | 'online' | 'error'>('loading');
  const [issError, setIssError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadIssTelemetry = async () => {
      try {
        setIssStatus((prev) => (prev === 'online' ? 'online' : 'loading'));
        setIssError(null);
        const response = await fetch(ISS_ENDPOINT, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`ISS telemetry request failed: ${response.status}`);
        }

        const payload = await response.json();
        const latitude = Number(payload?.latitude);
        const longitude = Number(payload?.longitude);
        const timestamp = Number(payload?.timestamp);

        if (Number.isNaN(latitude) || Number.isNaN(longitude) || Number.isNaN(timestamp)) {
          throw new Error('ISS telemetry payload was invalid.');
        }

        if (!isMounted) return;

        setIssTelemetry({
          latitude,
          longitude,
          timestamp,
        });
        setIssStatus('online');
      } catch (error) {
        if (!isMounted || controller.signal.aborted) return;
        setIssStatus('error');
        setIssError('Telemetry offline.');
      }
    };

    loadIssTelemetry();
    const interval = setInterval(loadIssTelemetry, 10000);

    return () => {
      isMounted = false;
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  const channelFeeds: Record<number, ChannelFeed> = {
    1: { videoId: '5aQwvTKT--g', label: 'Band Broadcast', type: 'video' },
    2: { label: 'ISS Tracker', type: 'iss' },
    3: { videoId: '2X8CMTNe8f4', label: 'Rocket Launch Feed B', type: 'video' },
  };

  const handleChannelSwitch = (channel: number) => {
    if (channel === activeChannel) return;
    
    // Trigger glitch effect
    setGlitching(true);
    
    // Play mechanical switch sound
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {}

    setTimeout(() => {
      setActiveChannel(channel);
      setGlitching(false);
    }, 800);
  };

  const activeFeed = channelFeeds[activeChannel] ?? channelFeeds[1];
  const videoId = activeFeed.type === 'video' ? activeFeed.videoId : undefined;
  const issLat = formatIssCoord(issTelemetry?.latitude);
  const issLon = formatIssCoord(issTelemetry?.longitude);
  const issLastUpdated = formatIssTimestamp(issTelemetry?.timestamp);
  const issMapUrl = issTelemetry
    ? `https://www.google.com/maps?q=${issTelemetry.latitude},${issTelemetry.longitude}`
    : 'https://www.google.com/maps?q=International+Space+Station';
  const issStatusLabel = issStatus === 'online' ? 'LOCKED' : issStatus === 'error' ? 'OFFLINE' : 'SYNCING';

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-amber-dim pb-2">
        <h2 className="font-share text-2xl uppercase tracking-widest bg-gradient-to-r from-[#ff7a1a] via-[#ffb067] to-[#ffd3a8] bg-clip-text text-transparent">
          Signal Broadcast
        </h2>
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3">
          <div className="flex flex-col items-end gap-1 text-sm font-vt323">
            <div className="flex gap-2">
              <span className="animate-pulse text-red-500">● REC</span>
              <span className="text-amber-dim">CH-{activeChannel.toString().padStart(2, '0')}</span>
            </div>
            <span className="text-amber-dim/80 tracking-wider">{activeFeed.label.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((channel) => (
              <button
                key={channel}
                onClick={() => handleChannelSwitch(channel)}
                aria-pressed={activeChannel === channel}
                aria-label={`Switch to channel ${channel}`}
                className={`relative w-12 md:w-14 h-9 md:h-10 border-2 flex items-center justify-center font-share text-base md:text-lg transition-all duration-75 active:scale-95 active:translate-y-1 ${
                  activeChannel === channel
                    ? 'border-amber bg-amber/20 text-amber-bright shadow-[0_0_10px_rgba(255,106,0,0.5)]'
                    : 'border-amber-dim bg-black text-amber-dim hover:border-amber hover:text-amber'
                }`}
              >
                CH{channel}
                {/* Physical button depth effect */}
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${activeChannel === channel ? 'bg-amber/50' : 'bg-amber-dim/30'}`}></div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Video Feed Container */}
      <div className="relative w-full aspect-video rounded-lg overflow-hidden p-[2px] bg-gradient-to-r from-[#ff5a00] via-[#ff9d4d] to-[#ff6f1a] shadow-[0_0_24px_rgba(255,122,26,0.35)]">
        <div className="relative w-full h-full bg-black rounded-[7px] overflow-hidden">
          {/* Scanline overlay specific to video */}
          <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%] opacity-50 mix-blend-overlay"></div>

          {glitching ? (
            <div className="absolute inset-0 z-20 bg-black flex flex-col items-center justify-center" data-testid="glitch-screen">
              <motion.div
                animate={{
                  x: [-10, 10, -5, 5, 0],
                  y: [5, -5, 10, -10, 0],
                  opacity: [1, 0.5, 1, 0.2, 1]
                }}
                transition={{ duration: 0.2, repeat: Infinity }}
                className="text-red-500 font-share text-2xl md:text-4xl tracking-widest text-center px-3"
              >
                SIGNAL LOST
              </motion.div>
              <div className="w-full h-1 bg-white/20 mt-4 animate-pulse"></div>
              <div className="w-full h-1 bg-white/20 mt-1 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            </div>
          ) : activeFeed.type === 'iss' ? (
            <div className="relative z-20 w-full h-full flex items-center justify-center p-4 md:p-6">
              <div className="w-full max-w-3xl border border-[#26f6fd]/45 bg-[#020a0b]/90 p-4 md:p-5 rounded-[7px]">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-[#26f6fd]/25 pb-2">
                  <h3 className="font-share text-lg md:text-xl tracking-wider text-[#c8feff] uppercase">
                    ISS Orbital Tracker
                  </h3>
                  <span className="font-vt323 text-sm text-[#8feaf0] uppercase tracking-wider">
                    ISS-LOCATION-NOW
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-3">
                  <div className="border border-[#26f6fd]/30 bg-black/70 p-3">
                    <div className="font-vt323 text-xs uppercase tracking-wider text-[#8feaf0]">Current Position</div>
                    <div className="mt-2 font-share text-lg md:text-xl text-[#c8feff]">
                      LAT {issLat} // LON {issLon}
                    </div>
                    <div className="mt-1 font-vt323 text-sm text-[#8feaf0]">
                      LAST PING: {issLastUpdated}
                    </div>
                  </div>

                  <div className="border border-[#26f6fd]/30 bg-black/70 p-3">
                    <div className="font-vt323 text-xs uppercase tracking-wider text-[#8feaf0]">Status</div>
                    <div className="mt-2 font-share text-lg md:text-xl text-[#c8feff]">{issStatusLabel}</div>
                    <div className="mt-1 font-vt323 text-sm text-[#8feaf0]">
                      {issError ?? 'Telemetry nominal.'}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={ISS_ENDPOINT}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-[#26f6fd]/60 px-3 py-1.5 font-share text-xs md:text-sm tracking-wider text-[#c8feff] hover:border-[#26f6fd] hover:bg-[#26f6fd]/10 transition-colors"
                  >
                    OPEN DATA FEED
                  </a>
                  <a
                    href={issMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-[#26f6fd]/40 px-3 py-1.5 font-share text-xs md:text-sm tracking-wider text-[#8feaf0] hover:border-[#26f6fd] hover:bg-[#26f6fd]/10 transition-colors"
                  >
                    OPEN MAP
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <iframe
              className="w-full h-full grayscale contrast-150 brightness-75 sepia-[.5] hue-rotate-[-30deg] saturate-[2]"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1`}
              title={`Jason Achilles ${activeFeed.label}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </div>
      </div>

      <div className="border border-[#ff8b3d]/50 bg-terminal-panel rounded p-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="font-vt323 text-[#ffc18f] text-lg md:text-xl leading-tight">
            EXPERIMENTAL HEAVY ROCK // ANALOG PERFORMANCE BROADCAST
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/logistics"
              className="border border-amber px-3 py-1.5 font-share text-sm tracking-wider text-center text-amber-bright hover:bg-amber hover:text-black transition-colors"
            >
              VIEW LAUNCH VECTOR + TICKETS
            </Link>
            <Link
              to="/discography"
              className="border border-amber-dim px-3 py-1.5 font-share text-sm tracking-wider text-center text-amber hover:border-amber hover:bg-amber/10 transition-colors"
            >
              MARS ACOUSTIC RESEARCH
            </Link>
            <a
              href="https://www.youtube.com/c/JasonAchilles"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-amber-dim px-3 py-1.5 font-share text-sm tracking-wider text-center text-amber hover:border-amber hover:bg-amber/10 transition-colors"
            >
              YOUTUBE FEED
            </a>
          </div>
        </div>
      </div>

      {/* Information Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Module 1: Subject Profile */}
        <div className="border border-cyan-dim/50 bg-black/50 p-4 rounded relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-dim to-transparent"></div>
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-cyan" />
            <h3 className="font-share text-cyan tracking-widest uppercase">Subject Profile</h3>
          </div>
          <div className="font-vt323 text-gray-300 space-y-2 text-base md:text-lg">
            <p><span className="text-cyan-dim">NAME:</span> Jason Achilles</p>
            <p><span className="text-cyan-dim">PROJECT:</span> Analog Rock Research Program</p>
            <p><span className="text-cyan-dim">ROLE:</span> Multi-instrumentalist / Sonic Researcher</p>
            <p><span className="text-cyan-dim">CAPABILITIES:</span> Simultaneous Guitar, Bass, Keys</p>
            <p><span className="text-cyan-dim">ACCOMPANIMENT:</span> Forrest Mitchell (Drums / Operations)</p>
            <div className="mt-4 p-2 border border-cyan-dim/30 bg-cyan-dim/10 text-cyan-bright text-sm leading-relaxed">
              &gt; WARNING: Subject exhibits high levels of analog friction. Performances are tactile, loud, and intentionally unsequenced.
            </div>
          </div>
        </div>

        {/* Module 2: Current Objective */}
        <div className="border border-green-dim/50 bg-black/50 p-4 rounded relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-dim to-transparent"></div>
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-green" />
            <h3 className="font-share text-green tracking-widest uppercase">Current Objective</h3>
          </div>
          <div className="font-vt323 text-gray-300 space-y-2 text-base md:text-lg">
            <p>Broadcast the next live chapter of the Jason Achilles band in rooms built for raw impact.</p>
            <p>Stress-test songs in real venues, then feed results back into the lab.</p>
            <p>Convert first-time viewers into repeat attendees through immersive story + performance.</p>
            <div className="mt-4 p-2 border border-green-dim/30 bg-green-dim/10 text-green-bright text-sm leading-relaxed">
              &gt; STATUS: Operational. Next deployment vector is loaded. Open Launch Vector for show coordinates.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
