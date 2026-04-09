import { useState } from 'react';
import { motion } from 'motion/react';
import { Activity, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ObservationDeck() {
  const [activeChannel, setActiveChannel] = useState(1);
  const [glitching, setGlitching] = useState(false);

  const toPublicAsset = (relativePath: string) => `${import.meta.env.BASE_URL}${relativePath}`;

  const channelFeeds: Record<number, { videoId: string; label: string }> = {
    1: { videoId: 'XL-mLllkLIU', label: 'Band Broadcast' },
    2: { videoId: 'RJBoyK2_iaE', label: 'Rocket Launch Feed A' },
    3: { videoId: '2X8CMTNe8f4', label: 'Rocket Launch Feed B' },
  };

  const marsRecordings = [
    {
      id: 'sol-0002',
      title: 'Sol 0002 - First Sounds of Mars [1 min]',
      subtitle: 'First Martian Wind Capture',
      file: toPublicAsset('audio/sound-2.wav'),
      release: 'Released to the public during a NASA/JPL press conference on Feb. 22, 2021.',
      capture:
        'First sounds of wind blowing on the Martian surface, captured on Sol 02 by the DPA 4006 capsule onboard the Mars Perseverance rover EDLCAM system.',
      processing:
        'Audio has been processed to filter out electrical interference caused by internal systems while preserving clarity of sounds moving through the Martian atmosphere.',
      credits: 'Post-processing by Zandef Deksit Inc. / Mike Houge and Jason Achilles Mezilis.',
      integration:
        'Microphone is integrated with the Entry, Descent, and Landing Camera (EDLCAM) system, under direction of David Gruel, NASA/JPL.',
      sourcePath: 'pds-imaging.jpl.nasa.gov/data/mars202.../data_audio/',
      license: 'Licensed under Creative Commons.',
    },
    {
      id: 'sol-0016',
      title: 'Sol 0016 - Drive Sequence Capture [16 min]',
      subtitle: 'Extended Rover Drive Sequence',
      file: toPublicAsset('audio/sound-16.wav'),
      release: 'Released by NASA/JPL to the public on Mar. 17, 2021.',
      capture:
        'Full 16-minute audio captured during a drive sequence on Sol 16 by the DPA 4006 capsule onboard the Mars Perseverance rover.',
      processing:
        'Audio has been processed to filter out electrical interference caused by internal systems while preserving clarity of sounds moving through the Martian atmosphere.',
      credits: 'Post-processing by Zandef Deksit Inc. / Mike Houge and Jason Achilles Mezilis.',
      integration:
        'Microphone is integrated with the Entry, Descent, and Landing Camera (EDLCAM) system, under direction of David Gruel, NASA/JPL.',
      sourcePath: 'pds-imaging.jpl.nasa.gov/data/mars202.../data_audio/',
      license: 'Public release available through NASA/JPL archives.',
    },
  ];

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
  const videoId = activeFeed.videoId;

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-amber-dim pb-2">
        <h2 className="font-share text-2xl uppercase tracking-widest bg-gradient-to-r from-[#ff7a1a] via-[#ffb067] to-[#ffd3a8] bg-clip-text text-transparent">
          Signal Broadcast
        </h2>
        <div className="flex flex-col items-end gap-1 text-sm font-vt323">
          <div className="flex gap-2">
            <span className="animate-pulse text-red-500">● REC</span>
            <span className="text-amber-dim">CH-{activeChannel.toString().padStart(2, '0')}</span>
          </div>
          <span className="text-amber-dim/80 tracking-wider">{activeFeed.label.toUpperCase()}</span>
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
                className="text-red-500 font-share text-4xl tracking-widest"
              >
                SIGNAL LOST
              </motion.div>
              <div className="w-full h-1 bg-white/20 mt-4 animate-pulse"></div>
              <div className="w-full h-1 bg-white/20 mt-1 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
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

      {/* Control Panel */}
      <div className="min-h-28 bg-terminal-panel border-2 border-[#ff7a1a]/45 rounded p-4 md:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col">
          <span className="font-share text-lg text-amber-dim">FEED SELECTOR</span>
          <span className="font-vt323 text-base text-amber-dim">MANUAL OVERRIDE</span>
        </div>
        
        <div className="flex gap-3 md:gap-4 w-full sm:w-auto justify-end flex-wrap">
          {[1, 2, 3].map((channel) => (
            <button
              key={channel}
              onClick={() => handleChannelSwitch(channel)}
              aria-pressed={activeChannel === channel}
              aria-label={`Switch to channel ${channel}`}
              className={`relative w-16 md:w-20 h-12 md:h-14 border-2 flex items-center justify-center font-share text-xl md:text-2xl transition-all duration-75 active:scale-95 active:translate-y-1 ${
                activeChannel === channel
                  ? 'border-amber bg-amber/20 text-amber-bright shadow-[0_0_10px_rgba(255,106,0,0.5)]'
                  : 'border-amber-dim bg-black text-amber-dim hover:border-amber hover:text-amber'
              }`}
            >
              CH{channel}
              {/* Physical button depth effect */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 ${activeChannel === channel ? 'bg-amber/50' : 'bg-amber-dim/30'}`}></div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded p-[1px] bg-gradient-to-r from-[#00595f] via-[#26f6fd] to-[#00828c] shadow-[0_0_22px_rgba(38,246,253,0.24)]">
        <section className="border border-[#26f6fd]/45 bg-[#020a0b] rounded-[7px] p-4 md:p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-[#26f6fd]/25 pb-2">
            <h3 className="font-share text-xl md:text-2xl tracking-wider uppercase text-[#c8feff]">
              Featured Mars Audio Archive
            </h3>
            <span className="font-vt323 text-sm md:text-base uppercase tracking-wider text-[#8feaf0]">
              Sol 0002 + Sol 0016 // EDLCAM Capsule Data
            </span>
          </div>

          <p className="mt-3 font-vt323 text-lg text-[#bffcff] leading-snug">
            These two files are a major part of the Jason Achilles story: authentic Martian atmosphere recordings
            captured by the Perseverance rover microphone system and post-processed for public listening clarity.
          </p>

          <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
            {marsRecordings.map((recording) => (
              <article key={recording.id} className="border border-[#26f6fd]/30 bg-black/70 rounded p-3 md:p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <h4 className="font-share text-base md:text-lg tracking-wide uppercase text-[#ccfeff] leading-tight">
                      {recording.title}
                    </h4>
                    <p className="font-vt323 text-sm md:text-base text-[#8feaf0] mt-0.5">
                      {recording.subtitle}
                    </p>
                  </div>
                  <span className="inline-block border border-[#26f6fd]/45 px-2 py-0.5 font-vt323 text-xs text-[#bffcff] uppercase tracking-wider">
                    NASA/JPL Source
                  </span>
                </div>

                <audio controls preload="none" className="mt-3 w-full">
                  <source src={recording.file} type="audio/wav" />
                  Your browser does not support WAV playback.
                </audio>

                <div className="mt-3 space-y-2 font-vt323 text-sm md:text-base text-[#bffcff] leading-snug">
                  <p>
                    <span className="text-[#d8feff]">Capture:</span> {recording.capture}
                  </p>
                  <p>
                    <span className="text-[#d8feff]">Release:</span> {recording.release}
                  </p>
                  <p>
                    <span className="text-[#d8feff]">Processing:</span> {recording.processing}
                  </p>
                  <p>
                    <span className="text-[#d8feff]">Post-processing:</span> {recording.credits}
                  </p>
                  <p>
                    <span className="text-[#d8feff]">System Integration:</span> {recording.integration}
                  </p>
                  <p>
                    <span className="text-[#d8feff]">NASA Reference Path:</span> {recording.sourcePath}
                  </p>
                  <p>
                    <span className="text-[#d8feff]">License:</span> {recording.license}
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={recording.file}
                    download
                    className="inline-block border border-[#26f6fd]/60 px-3 py-1.5 font-share text-xs md:text-sm tracking-wider text-[#c8feff] hover:bg-[#26f6fd]/15 transition-colors"
                  >
                    DOWNLOAD AUDIO
                  </a>
                  <a
                    href="https://pds-imaging.jpl.nasa.gov/data/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block border border-[#26f6fd]/40 px-3 py-1.5 font-share text-xs md:text-sm tracking-wider text-[#8feaf0] hover:border-[#26f6fd] hover:bg-[#26f6fd]/10 transition-colors"
                  >
                    OPEN NASA DATA PORTAL
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
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
              VIEW TRAJECTORY + TICKETS
            </Link>
            <Link
              to="/discography"
              className="border border-amber-dim px-3 py-1.5 font-share text-sm tracking-wider text-center text-amber hover:border-amber hover:bg-amber/10 transition-colors"
            >
              TAPE ARCHIVE
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
              &gt; STATUS: Operational. Next deployment vector is loaded. Open Trajectory Board for show coordinates.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
