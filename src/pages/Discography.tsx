import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';
import { IssTrackerPanel } from '../components/IssTrackerPanel';

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

const marsRecordings = [
  {
    id: 'sol-0002',
    title: 'Sol 0002 - First Sounds of Mars [1 min]',
    subtitle: 'First Martian Wind Capture',
    file: 'audio/sound-2.wav',
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
    file: 'audio/sound-16.wav',
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

const credentialsProfile = [
  { label: 'SUBJECT', value: 'Jason Achilles Mezilis' },
  { label: 'MISSION', value: 'Mars 2020 Perseverance Rover Microphone (EDLCAM)' },
  { label: 'ROLE', value: 'Audio Engineer / Microphone Design' },
  { label: 'INTEGRATION', value: 'NASA/JPL Entry, Descent, and Landing Camera system' },
  { label: 'POST-PROCESSING', value: 'Zandef Deksit Inc. / Mike Houge and Jason Achilles Mezilis' },
];

const signalIndicators = [
  { label: 'ARCHIVE ONLINE', color: 'bg-[#26f6fd]' },
  { label: 'EDLCAM AUDIO', color: 'bg-[#80ffff]' },
  { label: 'ISS TRACKER', color: 'bg-[#a97bff]' },
  { label: 'NASA SOURCE', color: 'bg-[#ff5f85]' },
];

const quickAccessLinks = [
  { id: 'iss-tracker', label: 'ISS Tracker', href: '#iss-tracker', type: 'anchor' },
  { id: 'audio-archive', label: 'Mars Audio Archive', href: '#audio-archive', type: 'anchor' },
  { id: 'press-archive', label: 'Press Archive', href: '/research', type: 'internal' },
  { id: 'nasa-portal', label: 'NASA Data Portal', href: 'https://pds-imaging.jpl.nasa.gov/data/', type: 'external' },
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
  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-amber-dim pb-2">
        <div>
          <h2 className="font-share text-2xl md:text-3xl uppercase tracking-[0.22em] bg-gradient-to-r from-[#26f6fd] via-[#7cfaff] to-[#f3feff] bg-clip-text text-transparent">
            Nerd Sh!t
          </h2>
          <p className="font-vt323 text-sm md:text-base text-[#8feaf0] tracking-wider mt-0.5">
            Mars Acoustic Research · ISS Tracker · NASA Archive
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/research"
            className="border border-amber-dim px-2 py-1 font-vt323 text-xs text-amber hover:border-amber hover:bg-amber hover:text-black transition-colors"
          >
            PRESS ARCHIVE
          </Link>
        </div>
      </div>

      <div className="rounded p-[1px] bg-gradient-to-r from-[#00595f] via-[#26f6fd] to-[#00828c] shadow-[0_0_22px_rgba(38,246,253,0.24)]">
        <section className="border border-[#26f6fd]/45 bg-[#020a0b] rounded-[7px] p-4 md:p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-[#26f6fd]/25 pb-2">
            <h3 className="font-share text-lg md:text-xl tracking-wider uppercase text-[#c8feff]">
              Credentials // Verified
            </h3>
            <span className="font-vt323 text-sm text-[#8feaf0] uppercase tracking-wider">NASA/JPL · EDLCAM</span>
          </div>
          <p className="mt-3 font-vt323 text-lg md:text-xl text-[#d8feff] leading-relaxed">
            Designed the microphone on the Mars Perseverance rover. Same ears, different planet. Now making loud rock
            on Earth.
          </p>
        </section>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {signalIndicators.map((signal) => (
          <span
            key={signal.label}
            className="inline-flex items-center gap-2 border border-[#26f6fd]/30 bg-[#071517]/80 px-2 py-1 font-vt323 text-xs md:text-sm tracking-widest text-[#c8feff] uppercase"
          >
            <span className={`h-2 w-2 rounded-full ${signal.color} animate-pulse`}></span>
            {signal.label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-4">
        <section className="border border-cyan-dim/50 bg-black/70 p-4 md:p-5 rounded relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-dim to-transparent"></div>
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-cyan" />
            <h3 className="font-share text-cyan tracking-widest uppercase">Engineering Dossier</h3>
          </div>
          <div className="font-vt323 text-[#e7dfd1] space-y-2 text-base md:text-lg">
            {credentialsProfile.map((item) => (
              <p key={item.label}>
                <span className="text-cyan-dim">{item.label}:</span> {item.value}
              </p>
            ))}
            <div className="mt-4 p-2 border border-cyan-dim/30 bg-cyan-dim/10 text-cyan-bright text-sm leading-relaxed">
              &gt; NOTE: Real audio research — not costume sci-fi branding.
            </div>
          </div>
        </section>

        <section className="border border-cyan-dim/50 bg-black/70 p-4 md:p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-cyan-dim/40 pb-2">
            <h3 className="font-share text-cyan tracking-widest uppercase">Quick Access</h3>
            <span className="font-vt323 text-cyan-dim text-xs md:text-sm tracking-[0.2em] uppercase">NAV GRID</span>
          </div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {quickAccessLinks.map((link) => {
              const isExternal = link.type === 'external';
              if (link.type === 'internal') {
                return (
                  <Link
                    key={link.id}
                    to={link.href}
                    className="border border-[#26f6fd]/50 px-3 py-2 font-vt323 text-sm tracking-widest text-[#c8feff] hover:border-[#26f6fd] hover:bg-[#26f6fd]/10 transition-colors"
                  >
                    {link.label}
                  </Link>
                );
              }

              return (
                <a
                  key={link.id}
                  href={link.href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="border border-[#26f6fd]/50 px-3 py-2 font-vt323 text-sm tracking-widest text-[#c8feff] hover:border-[#26f6fd] hover:bg-[#26f6fd]/10 transition-colors"
                >
                  {link.label}
                </a>
              );
            })}
          </div>
        </section>
      </div>

      <div className="rounded p-[1px] bg-gradient-to-r from-[#00595f] via-[#26f6fd] to-[#00828c] shadow-[0_0_22px_rgba(38,246,253,0.24)]">
        <section id="iss-tracker" className="border border-[#26f6fd]/45 bg-[#020a0b] rounded-[7px] p-4 md:p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-[#26f6fd]/25 pb-2 mb-4">
            <h3 className="font-share text-xl md:text-2xl tracking-wider uppercase text-[#c8feff]">ISS Tracker</h3>
            <span className="font-vt323 text-sm md:text-base uppercase tracking-wider text-[#8feaf0]">
              Live Orbital Feed
            </span>
          </div>
          <IssTrackerPanel compact />
        </section>
      </div>

      <div className="rounded p-[1px] bg-gradient-to-r from-[#00595f] via-[#26f6fd] to-[#00828c] shadow-[0_0_22px_rgba(38,246,253,0.24)]">
        <section id="audio-archive" className="border border-[#26f6fd]/45 bg-[#020a0b] rounded-[7px] p-4 md:p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-[#26f6fd]/25 pb-2">
            <h3 className="font-share text-xl md:text-2xl tracking-wider uppercase text-[#c8feff]">
              Mars Acoustic Archive
            </h3>
            <span className="font-vt323 text-sm md:text-base uppercase tracking-wider text-[#8feaf0]">
              Sol 0002 + Sol 0016 // EDLCAM Capsule Data
            </span>
          </div>

          <p className="mt-3 font-vt323 text-lg md:text-xl text-[#d8feff] leading-snug">
            Authentic Martian atmosphere recordings captured by the Perseverance rover microphone system and
            post-processed for public listening clarity.
          </p>

          <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
            {marsRecordings.map((recording) => (
              <article key={recording.id} className="border border-[#26f6fd]/30 bg-black/80 rounded p-3 md:p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <h4 className="font-share text-base md:text-lg tracking-wide uppercase text-[#ccfeff] leading-tight">
                      {recording.title}
                    </h4>
                    <p className="font-vt323 text-base md:text-lg text-[#bffcff] mt-0.5">{recording.subtitle}</p>
                  </div>
                  <span className="inline-block border border-[#26f6fd]/45 px-2 py-0.5 font-vt323 text-xs text-[#bffcff] uppercase tracking-wider">
                    NASA/JPL Source
                  </span>
                </div>

                <audio controls preload="none" className="mt-3 w-full">
                  <source src={toPublicAsset(recording.file)} type="audio/wav" />
                  Your browser does not support WAV playback.
                </audio>

                <div className="mt-3 space-y-2 font-vt323 text-base md:text-lg text-[#d8feff] leading-snug">
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
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={toPublicAsset(recording.file)}
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

      <div className="border border-red-dim/60 bg-black/80 p-4 md:p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-red-dim/40 pb-2">
          <h3 className="font-share text-red-bright uppercase tracking-wider">Press Archive</h3>
          <span className="font-vt323 text-red-dim text-sm md:text-base">WIRED · KTLA · CBC · TMJ4</span>
        </div>
        <p className="font-vt323 text-[#ffd6e2] mt-3 text-lg md:text-xl leading-relaxed">
          Press coverage lives on its own page — outlet names up front, headlines below.
        </p>
        <Link
          to="/research"
          className="inline-block mt-4 border border-red px-3 py-2 font-share text-sm tracking-wider text-red-bright hover:bg-red hover:text-black transition-colors"
        >
          OPEN PRESS ARCHIVE
        </Link>
      </div>

      <div className="rounded p-[1px] bg-gradient-to-r from-[#4f2ea3] via-[#8f66ff] to-[#d8c2ff] shadow-[0_0_20px_rgba(143,102,255,0.34)]">
        <section className="border border-[#a97bff]/45 bg-[#07050f] rounded-[7px] p-4 md:p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-[#a97bff]/25 pb-2">
            <h3 className="font-share text-xl md:text-2xl tracking-wider uppercase text-[#f3ebff]">
              Mission Visual Archive
            </h3>
            <span className="font-vt323 text-sm md:text-base uppercase tracking-wider text-[#eadbff]">
              Field Photos + Transmissions
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-5">
            <div className="border border-[#a97bff]/35 bg-black/70 rounded p-3 md:p-4">
              <div className="font-share text-lg md:text-xl text-[#f3ebff] uppercase tracking-wider">
                Launch Video Links
              </div>
              <div className="mt-3 flex flex-col gap-2">
                {launchTransmissions.map((video) => (
                  <a
                    key={video.id}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative overflow-hidden border border-[#a97bff]/50 px-3 py-2 font-vt323 text-base md:text-lg text-[#f3ebff] hover:border-[#d9c8ff] hover:bg-[#a97bff]/14 transition-colors"
                  >
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#a97bff]/60"></span>
                    <span className="pl-2 inline-block">{video.title}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="border border-[#a97bff]/35 bg-black/70 rounded p-3 md:p-4">
              <div className="font-share text-lg md:text-xl text-[#f3ebff] uppercase tracking-wider">
                Jason Photo Archive
              </div>
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
                      <img
                        src={photoUrl}
                        alt={formatPhotoLabel(photo)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
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
