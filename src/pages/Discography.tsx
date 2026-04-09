import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

type TapeTrack = {
  id: string;
  title: string;
  duration: string;
  layer: string;
};

type TapeArchive = {
  id: string;
  title: string;
  year: string;
  codename: string;
  profile: string;
  signal: string;
  tracks: TapeTrack[];
};

const archiveData: TapeArchive[] = [
  {
    id: 'comedown',
    title: 'COMEDOWN',
    year: '2016',
    codename: 'CRATE_A.16',
    profile: 'Raw analog impact, low-floor noise, high transient response.',
    signal: 'SATURATED',
    tracks: [
      { id: 'rust', title: 'RUST', duration: '03:42', layer: 'MAGNETIC' },
      { id: 'eurotrash', title: 'EUROTRASH', duration: '04:11', layer: 'GRIT BUS' },
      { id: 'soft-landing', title: 'SOFT LANDING', duration: '05:02', layer: 'LOW ORBIT' },
    ],
  },
  {
    id: 'disco',
    title: 'DISCØ',
    year: '2020',
    codename: 'CRATE_B.20',
    profile: 'Nocturnal synth bleed, rhythm-heavy stacks, cinematic decay.',
    signal: 'PHASED',
    tracks: [
      { id: 'tape-loop', title: 'TAPE LOOP', duration: '04:29', layer: 'REPEAT CHAIN' },
      { id: 'analog-dream', title: 'ANALOG DREAM', duration: '03:58', layer: 'SYNTH BED' },
      { id: 'magnetic', title: 'MAGNETIC', duration: '04:44', layer: 'OUTER BAND' },
    ],
  },
];

const launchTransmissions = [
  {
    id: 'launch-01',
    title: 'Live Launch Capture // Feed 01',
    url: 'https://youtu.be/5aQwvTKT--g?si=vmk0RQItGhXi1b7S',
  },
  {
    id: 'launch-02',
    title: 'Live Launch Capture // Feed 02',
    url: 'https://youtu.be/5aQwvTKT--g?si=aXrLWFdAYK1B93EN',
  },
  {
    id: 'launch-03',
    title: 'Live Launch Capture // Feed 03',
    url: 'https://youtu.be/jPyH2JnwLS4?si=AJSIJvwyJwW7a79f',
  },
  {
    id: 'launch-04',
    title: 'Live Launch Capture // Feed 04',
    url: 'https://youtu.be/XxcI8M_EQZQ?si=ZQCQ8P4DiN4ENChs',
  },
];

const photoFiles = [
  '000081500011.jpg',
  '251212_Jason_024_sm-scaled.jpg',
  '251212_Jason_037_sm-scaled.jpg',
  '424764000_1038473987223268_7624493267708722516_n.jpg',
  '502402288_18397867654112779_2678498780782849733_n-1.jpg',
  '508613405_18396869887112779_1355505480329991567_n.jpg',
  'asas.jpg',
  'JasonAndForrest-1.jpg',
  'JA_Web_Pix_03.jpg',
];

const formatPhotoLabel = (fileName: string) =>
  fileName
    .replace(/\.jpg$/i, '')
    .replace(/[_-]+/g, ' ')
    .trim();

const getPhotoTileClass = (index: number) => {
  if (index % 7 === 0) {
    return 'md:col-span-2 md:row-span-2';
  }

  if (index % 4 === 0) {
    return 'md:row-span-2';
  }

  return '';
};

const toPublicAsset = (relativePath: string) => `${import.meta.env.BASE_URL}${relativePath}`;

export function Discography() {
  const [loading, setLoading] = useState(false);
  const [activeTape, setActiveTape] = useState<string | null>(archiveData[0].id);
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);

  const loadTape = (id: string) => {
    if (activeTape === id || loading) return;

    setLoading(true);
    setPlayingTrack(null);

    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(50, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.45);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch (e) {}

    setTimeout(() => {
      setActiveTape(id);
      setLoading(false);
    }, 1200);
  };

  const togglePlay = (trackId: string) => {
    if (playingTrack === trackId) {
      setPlayingTrack(null);
      return;
    }

    setPlayingTrack(trackId);
  };

  const activeData = archiveData.find((tape) => tape.id === activeTape);
  const activeTrack = activeData?.tracks.find((track) => track.id === playingTrack) ?? null;

  return (
    <div className="flex flex-col gap-5 pb-8">
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-amber-dim pb-2">
        <h2 className="font-share text-2xl md:text-3xl uppercase tracking-[0.2em] bg-gradient-to-r from-[#8556ff] via-[#c59cff] to-[#f3ebff] bg-clip-text text-transparent">
          Tape Archive
        </h2>
        <div className="flex items-center gap-3">
          <span className="font-vt323 text-amber-dim text-base md:text-lg">DATA_BANK_A // REEL_MATRIX</span>
          <Link
            to="/logistics"
            className="border border-amber-dim px-2 py-1 font-vt323 text-xs text-amber hover:border-amber hover:bg-amber hover:text-black transition-colors"
          >
            NEXT SHOW ROUTE
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-5 min-h-0">
        <div className="rounded p-[1px] bg-gradient-to-b from-[#8d63ff] via-[#5b35b8] to-[#22104b] shadow-[0_0_20px_rgba(142,104,255,0.35)]">
          <section className="h-full rounded-[7px] border border-[#8f66ff]/45 bg-[#0b0714] p-4">
            <div className="flex items-center justify-between border-b border-[#8f66ff]/25 pb-2">
              <h3 className="font-share text-lg uppercase tracking-[0.15em] text-[#e5d6ff]">Archive Capsules</h3>
              <span className="font-vt323 text-sm text-[#c7b1ff]">SELECT REEL</span>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {archiveData.map((tape) => (
                <button
                  key={tape.id}
                  onClick={() => loadTape(tape.id)}
                  disabled={loading}
                  className={`relative overflow-hidden text-left border rounded p-3 transition-all duration-150 ${
                    activeTape === tape.id
                      ? 'border-[#d7c2ff] bg-[#6f4ac2]/20 shadow-[0_0_16px_rgba(162,121,255,0.38)]'
                      : 'border-[#7c5bc6]/45 bg-black/60 hover:border-[#a884ff] hover:bg-[#3d2678]/25'
                  }`}
                >
                  <div className="absolute inset-0 pointer-events-none opacity-30 bg-[linear-gradient(130deg,transparent_0%,transparent_35%,rgba(255,255,255,0.25)_45%,transparent_55%,transparent_100%)]"></div>

                  <div className="relative flex items-center justify-between">
                    <span className="font-vt323 text-sm text-[#bca4f5]">{tape.codename}</span>
                    <span className="font-share text-xs tracking-wider text-[#dcc9ff]">{tape.year}</span>
                  </div>

                  <div className="relative mt-2 font-share text-2xl text-[#f3ebff] tracking-wide">{tape.title}</div>

                  <p className="relative mt-1 font-vt323 text-base text-[#c7b1ff] leading-snug">{tape.profile}</p>

                  <div className="relative mt-3 flex items-center justify-between">
                    <span className="font-vt323 text-sm text-[#e0d0ff]">SIGNAL: {tape.signal}</span>
                    <div className="flex gap-1">
                      {[0, 1, 2].map((dot) => (
                        <div key={`${tape.id}-${dot}`} className="w-2 h-2 rounded-full bg-[#b999ff]/60"></div>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="rounded p-[1px] bg-gradient-to-r from-[#6330d0] via-[#9a71ff] to-[#d8c1ff] shadow-[0_0_22px_rgba(154,113,255,0.35)]">
          <section className="rounded-[7px] border border-[#9a71ff]/45 bg-[#090512] p-4 md:p-5 min-h-[460px]">
            {loading ? (
              <div className="h-full min-h-[420px] flex flex-col items-center justify-center font-vt323 text-xl text-[#ddcaff]">
                <motion.div
                  animate={{ opacity: [1, 0.35, 1] }}
                  transition={{ duration: 0.7, repeat: Infinity }}
                  className="tracking-widest uppercase"
                >
                  Decompressing Reel Data...
                </motion.div>

                <div className="mt-5 w-full max-w-md border border-[#8f66ff]/55 p-1">
                  <motion.div
                    className="h-4 bg-gradient-to-r from-[#6f3ce0] via-[#a37aff] to-[#d9c4ff]"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.2, ease: 'linear' }}
                  />
                </div>

                <div className="mt-3 font-vt323 text-base text-[#bca4f5] uppercase tracking-wider">
                  Verifying analog checksum...
                </div>
              </div>
            ) : activeData ? (
              <div className="flex flex-col gap-4">
                <div className="border-b border-[#9a71ff]/30 pb-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-share text-3xl md:text-4xl text-[#f3ebff] tracking-[0.1em]">{activeData.title}</h3>
                    <div className="font-vt323 text-base md:text-lg text-[#cbb5ff] uppercase">
                      {activeData.codename} // {activeData.year}
                    </div>
                  </div>

                  <p className="mt-2 font-vt323 text-lg text-[#d8c6ff] leading-snug">{activeData.profile}</p>

                  <div className="mt-2 font-vt323 text-sm text-[#b395f0] uppercase tracking-wider">
                    Signal Condition: {activeData.signal}
                  </div>
                </div>

                <div className="grid grid-cols-1 2xl:grid-cols-[1fr_320px] gap-4 min-h-0">
                  <div className="border border-[#8f66ff]/35 bg-black/55 rounded p-3 md:p-4">
                    <div className="flex items-center justify-between border-b border-[#8f66ff]/25 pb-2">
                      <div className="font-share text-lg tracking-wider uppercase text-[#eadbff]">Track Matrix</div>
                      <div className="font-vt323 text-sm text-[#c0a8fa]">{activeData.tracks.length} channels</div>
                    </div>

                    <div className="mt-2 flex flex-col">
                      {activeData.tracks.map((track, idx) => (
                        <div
                          key={track.id}
                          className={`grid grid-cols-[44px_1fr_84px_82px] items-center gap-2 py-2 border-b border-[#8f66ff]/15 ${
                            playingTrack === track.id ? 'bg-[#8f66ff]/12' : ''
                          }`}
                        >
                          <span className="font-vt323 text-[#b99cff] text-base">{(idx + 1).toString().padStart(2, '0')}</span>
                          <div className="min-w-0">
                            <div className={`font-share text-sm md:text-base truncate ${playingTrack === track.id ? 'text-[#f2eaff]' : 'text-[#d6c0ff]'}`}>
                              {track.title}
                            </div>
                            <div className="font-vt323 text-xs text-[#a98be8] truncate">{track.layer}</div>
                          </div>
                          <span className="font-vt323 text-sm text-[#c8b2fb] text-right">{track.duration}</span>
                          <button
                            onClick={() => togglePlay(track.id)}
                            className={`border px-2 py-1 font-vt323 text-xs tracking-wider transition-colors ${
                              playingTrack === track.id
                                ? 'border-[#f0e6ff] bg-[#f0e6ff] text-black'
                                : 'border-[#8f66ff]/55 text-[#d8c6ff] hover:border-[#c7adff] hover:bg-[#8f66ff]/14'
                            }`}
                          >
                            {playingTrack === track.id ? 'STOP' : 'PLAY'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border border-[#8f66ff]/35 bg-black/55 rounded p-3 md:p-4 flex flex-col">
                    <div className="font-share text-lg tracking-wider uppercase text-[#eadbff] border-b border-[#8f66ff]/25 pb-2">
                      Signal Monitor
                    </div>

                    <div className="mt-3 font-vt323 text-sm text-[#d6c0ff] uppercase">
                      STATUS:{' '}
                      <span className={playingTrack ? 'text-[#f2eaff] animate-pulse' : 'text-[#b395f0]'}>
                        {playingTrack ? 'Reading Data Stream' : 'Idle'}
                      </span>
                    </div>

                    <div className="mt-3 font-vt323 text-sm text-[#c2a9f8] uppercase min-h-[20px]">
                      {activeTrack ? `ACTIVE TRACK: ${activeTrack.title}` : 'ACTIVE TRACK: NONE'}
                    </div>

                    <div className="mt-3 h-24 border border-[#8f66ff]/35 bg-[#130b25] px-2 flex items-end gap-1">
                      {[...Array(18)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 bg-gradient-to-t from-[#6f3ce0] via-[#9f77ff] to-[#e6dbff]"
                          animate={playingTrack ? { height: [10, 24 + (i % 6) * 7, 12] } : { height: [8, 10, 8] }}
                          transition={{ duration: 0.35 + (i % 4) * 0.08, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      ))}
                    </div>

                    <div className="mt-3 border border-[#8f66ff]/30 bg-[#120a20] p-2 font-vt323 text-sm text-[#c9b3fb] leading-snug">
                      Playback is archive preview only. Full signal impact is tuned for the live room.
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link
                        to="/logistics"
                        className="border border-[#8f66ff]/60 px-2 py-1 font-share text-xs tracking-wider text-[#eadbff] hover:bg-[#8f66ff]/15 transition-colors"
                      >
                        SHOW ROUTE
                      </Link>
                      <a
                        href="https://www.youtube.com/c/JasonAchilles"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-[#8f66ff]/60 px-2 py-1 font-share text-xs tracking-wider text-[#eadbff] hover:bg-[#8f66ff]/15 transition-colors"
                      >
                        TRANSMISSIONS
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[420px] flex items-center justify-center border border-dashed border-[#8f66ff]/45 rounded font-vt323 text-xl text-[#b395f0]">
                Select an archive capsule to initialize the reel matrix.
              </div>
            )}
          </section>
        </div>
      </div>

      <div className="rounded p-[1px] bg-gradient-to-r from-[#4f2ea3] via-[#8f66ff] to-[#d8c2ff] shadow-[0_0_20px_rgba(143,102,255,0.34)]">
        <section className="border border-[#a97bff]/45 bg-[#07050f] rounded-[7px] p-4 md:p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-[#a97bff]/25 pb-2">
            <h3 className="font-share text-xl md:text-2xl tracking-wider uppercase text-[#eadbff]">
              Mission Visual + Launch Archive
            </h3>
            <span className="font-vt323 text-sm md:text-base uppercase tracking-wider text-[#c9adff]">
              External Transmissions + Field Photos
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-5">
            <div className="border border-[#a97bff]/35 bg-black/60 rounded p-3 md:p-4">
              <div className="font-share text-lg text-[#eadbff] uppercase tracking-wider">Launch Video Links</div>
              <div className="mt-3 flex flex-col gap-2">
                {launchTransmissions.map((video) => (
                  <a
                    key={video.id}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative overflow-hidden border border-[#a97bff]/50 px-3 py-2 font-vt323 text-base text-[#d6c0ff] hover:border-[#d9c8ff] hover:bg-[#a97bff]/14 transition-colors"
                  >
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#a97bff]/60"></span>
                    <span className="pl-2 inline-block">{video.title}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="border border-[#a97bff]/35 bg-black/60 rounded p-3 md:p-4">
              <div className="font-share text-lg text-[#eadbff] uppercase tracking-wider">Jason Photo Archive</div>
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 auto-rows-[110px] md:auto-rows-[88px]">
                {photoFiles.map((photo, index) => {
                  const photoUrl = toPublicAsset(`jason-photos/${photo}`);
                  return (
                    <a
                      key={photo}
                      href={photoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative overflow-hidden border border-[#a97bff]/35 bg-black/70 hover:border-[#e1d3ff] transition-colors ${getPhotoTileClass(index)}`}
                    >
                      <img src={photoUrl} alt={formatPhotoLabel(photo)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-x-0 bottom-0 px-2 py-1 bg-black/65 font-vt323 text-xs text-[#c9adff] truncate group-hover:text-[#eadbff]">
                        {formatPhotoLabel(photo).toUpperCase()}
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}