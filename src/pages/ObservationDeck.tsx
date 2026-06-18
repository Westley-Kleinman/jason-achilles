import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Activity, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TerminalAccordion } from '../components/TerminalAccordion';

type ChannelFeed = {
  id: number;
  shortLabel: string;
  label: string;
  videoId: string;
};

type YouTubePlayerInstance = {
  destroy: () => void;
  setVolume: (volume: number) => void;
  unMute: () => void;
  playVideo: () => void;
};

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement,
        config: {
          videoId: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: (event: { target: YouTubePlayerInstance }) => void;
            onStateChange?: (event: { data: number; target: YouTubePlayerInstance }) => void;
          };
        },
      ) => YouTubePlayerInstance;
      PlayerState: { PLAYING: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

const YOUTUBE_VOLUME = 50;
const YOUTUBE_API_SCRIPT_ID = 'youtube-iframe-api';

const channelFeeds: ChannelFeed[] = [
  { id: 1, shortLabel: 'LIVE', label: 'Band Broadcast', videoId: '5aQwvTKT--g' },
  { id: 2, shortLabel: 'NEW', label: 'Most Recent Post', videoId: 'SRsKBrzp_3s' },
  { id: 3, shortLabel: 'EURO', label: 'Euro Trash', videoId: 'XL-mLllkLIU' },
];

const applyYouTubeVolume = (player: YouTubePlayerInstance) => {
  player.setVolume(YOUTUBE_VOLUME);
  player.unMute();
};

function YouTubeFeed({ videoId }: { videoId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayerInstance | null>(null);

  useEffect(() => {
    let cancelled = false;

    const initPlayer = () => {
      if (cancelled || !containerRef.current || !window.YT?.Player) return;

      playerRef.current?.destroy();
      playerRef.current = null;

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: 1,
          loop: 1,
          playlist: videoId,
          controls: 0,
          modestbranding: 1,
          enablejsapi: 1,
        },
        events: {
          onReady: (event) => {
            applyYouTubeVolume(event.target);
            event.target.playVideo();
          },
          onStateChange: (event) => {
            if (event.data === window.YT?.PlayerState.PLAYING) {
              applyYouTubeVolume(event.target);
            }
          },
        },
      });
    };

    if (window.YT?.Player) {
      initPlayer();
    } else {
      if (!document.getElementById(YOUTUBE_API_SCRIPT_ID)) {
        const tag = document.createElement('script');
        tag.id = YOUTUBE_API_SCRIPT_ID;
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }

      const previousReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        initPlayer();
      };
    }

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [videoId]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full grayscale contrast-150 brightness-75 sepia-[.5] hue-rotate-[-30deg] saturate-[2]"
    />
  );
}

const channelButtonClass = (isActive: boolean) =>
  `relative min-w-[4.5rem] md:min-w-[5rem] h-9 md:h-10 px-2 border-2 flex items-center justify-center font-share text-sm md:text-base tracking-wider transition-all duration-75 active:scale-95 active:translate-y-1 ${
    isActive
      ? 'border-amber bg-amber/20 text-amber-bright shadow-[0_0_10px_rgba(255,106,0,0.5)]'
      : 'border-amber-dim bg-black text-amber-dim hover:border-amber hover:text-amber'
  }`;

const channelButtonDepthClass = (isActive: boolean) =>
  `absolute bottom-0 left-0 right-0 h-0.5 ${isActive ? 'bg-amber/50' : 'bg-amber-dim/30'}`;

export function ObservationDeck() {
  const [activeChannel, setActiveChannel] = useState(1);
  const [glitching, setGlitching] = useState(false);
  const [audioEngaged, setAudioEngaged] = useState(false);

  const handleChannelSwitch = (channel: number) => {
    if (channel === activeChannel) return;

    setAudioEngaged(true);
    setGlitching(true);

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

  const activeFeed = channelFeeds.find((feed) => feed.id === activeChannel) ?? channelFeeds[0];

  const renderChannelButtons = () =>
    channelFeeds.map((feed) => (
      <button
        key={feed.id}
        onClick={() => handleChannelSwitch(feed.id)}
        aria-pressed={activeChannel === feed.id}
        aria-label={`Switch to ${feed.label}`}
        className={channelButtonClass(activeChannel === feed.id)}
      >
        {feed.shortLabel}
        <div className={channelButtonDepthClass(activeChannel === feed.id)}></div>
      </button>
    ));

  return (
    <div className="flex flex-col gap-5 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-amber-dim pb-2">
        <div>
          <h2 className="font-share text-2xl uppercase tracking-widest bg-gradient-to-r from-[#ff7a1a] via-[#ffb067] to-[#ffd3a8] bg-clip-text text-transparent">
            Band Overview
          </h2>
          <p className="font-vt323 text-sm text-amber-dim tracking-wider mt-0.5">Signal Broadcast</p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-1 text-sm font-vt323">
          <div className="flex gap-2">
            <span className="animate-pulse text-red-500">● REC</span>
            <span className="text-amber-bright tracking-wider">{activeFeed.label.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {!audioEngaged ? (
        <div className="border border-amber-dim/50 bg-amber/5 px-3 py-2 font-vt323 text-sm text-amber text-center tracking-wider">
          [ AUDIO MUTED // CLICK ANY CHANNEL TO ENGAGE ]
        </div>
      ) : null}

      <div className="relative w-full aspect-video rounded-lg overflow-hidden p-[2px] bg-gradient-to-r from-[#ff5a00] via-[#ff9d4d] to-[#ff6f1a] shadow-[0_0_24px_rgba(255,122,26,0.35)]">
        <div className="relative w-full h-full bg-black rounded-[7px] overflow-hidden">
          <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%] opacity-50 mix-blend-overlay"></div>

          {glitching ? (
            <div
              className="absolute inset-0 z-20 bg-black flex flex-col items-center justify-center"
              data-testid="glitch-screen"
            >
              <motion.div
                animate={{
                  x: [-10, 10, -5, 5, 0],
                  y: [5, -5, 10, -10, 0],
                  opacity: [1, 0.5, 1, 0.2, 1],
                }}
                transition={{ duration: 0.2, repeat: Infinity }}
                className="text-red-500 font-share text-2xl md:text-4xl tracking-widest text-center px-3"
              >
                SIGNAL LOST
              </motion.div>
              <div className="w-full h-1 bg-white/20 mt-4 animate-pulse"></div>
              <div className="w-full h-1 bg-white/20 mt-1 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            </div>
          ) : (
            <YouTubeFeed videoId={activeFeed.videoId} />
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        {renderChannelButtons()}
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          to="/logistics"
          className="flex-1 sm:flex-none border border-amber px-4 py-2.5 font-share text-sm tracking-wider text-center text-amber-bright hover:bg-amber hover:text-black transition-colors"
        >
          NEXT SHOW → TICKETS
        </Link>
        <Link
          to="/discography"
          className="flex-1 sm:flex-none border border-amber-dim px-4 py-2.5 font-share text-sm tracking-wider text-center text-amber hover:border-amber hover:bg-amber/10 transition-colors"
        >
          NERD SH!T
        </Link>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        <TerminalAccordion
          title="Personnel File"
          subtitle="Band roster + capabilities"
          icon={<Info className="w-4 h-4 text-cyan" />}
          accentClass="text-cyan"
          borderClass="border-cyan-dim/50"
        >
          <div className="font-vt323 text-gray-300 space-y-2 text-base md:text-lg pt-3">
            <p>
              <span className="text-cyan-dim">NAME:</span> Jason Achilles
            </p>
            <p>
              <span className="text-cyan-dim">PROJECT:</span> Analog Rock Research Program
            </p>
            <p>
              <span className="text-cyan-dim">ROLE:</span> Multi-instrumentalist / Audio Engineer
            </p>
            <p>
              <span className="text-cyan-dim">CAPABILITIES:</span> Simultaneous Guitar, Bass, Keys
            </p>
            <p>
              <span className="text-cyan-dim">ACCOMPANIMENT:</span> Forrest Mitchell (Percussion and Operations)
            </p>
            <div className="mt-2 p-2 border border-cyan-dim/30 bg-cyan-dim/10 text-cyan-bright text-sm leading-relaxed">
              &gt; WARNING: Subject exhibits high levels of analog friction. Performances are tactile, loud, and
              intentionally unsequenced.
            </div>
          </div>
        </TerminalAccordion>

        <TerminalAccordion
          title="Mission Statement"
          subtitle="What we're doing out here"
          icon={<Activity className="w-4 h-4 text-green" />}
          accentClass="text-green"
          borderClass="border-green-dim/50"
        >
          <div className="font-vt323 text-gray-300 space-y-2 text-base md:text-lg pt-3">
            <p>Play it loud enough to rattle the rig. No apologies.</p>
            <p>Break songs apart in live rooms and rebuild them on stage.</p>
            <p>Not here to sell you anything. Show up and deal with it.</p>
            <div className="mt-2 p-2 border border-green-dim/30 bg-green-dim/10 text-green-bright text-sm leading-relaxed">
              &gt; STATUS: Locked and loaded. Find a show or keep scrolling.
            </div>
          </div>
        </TerminalAccordion>
      </div>
    </div>
  );
}
