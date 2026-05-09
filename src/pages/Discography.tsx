import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Activity, ExternalLink, Info } from 'lucide-react';

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

const subjectProfile = [
  { label: 'NAME', value: 'Jason Achilles' },
  { label: 'PROJECT', value: 'Analog Rock Research Program' },
  { label: 'ROLE', value: 'Multi-instrumentalist / Sonic Researcher' },
  { label: 'CAPABILITIES', value: 'Simultaneous Guitar, Bass, Keys' },
  { label: 'ACCOMPANIMENT', value: 'Forrest Mitchell (Drums / Operations)' },
];

const currentObjective = [
  'Broadcast the next live chapter of the Jason Achilles band in rooms built for raw impact.',
  'Stress-test songs in real venues, then feed results back into the lab.',
  'Convert first-time viewers into repeat attendees through immersive story + performance.',
];

const researchLogs = [
  {
    id: 'LOG-01',
    title: 'Musician Who Designed Microphone for Mars',
    source: 'WIRED',
    url: 'https://www.wired.com/story/musician-who-designed-microphone-mars/',
    date: '2021',
    status: 'DECRYPTED',
  },
  {
    id: 'LOG-02',
    title: 'Perseverance Rover Musician Microphone',
    source: 'KTLA',
    url: 'https://ktla.com/news/technology/jason-achilles-mezilis-mars-2020-perseverance-rover-musician-microphone/',
    date: '2021',
    status: 'DECRYPTED',
  },
  {
    id: 'LOG-03',
    title: 'Martian Mic Drop',
    source: 'Planetary Radio',
    url: 'https://www.planetary.org/planetary-radio/2023-martian-mic-drop',
    date: '2023',
    status: 'DECRYPTED',
  },
  {
    id: 'LOG-04',
    title: 'Music on Mars: If you thought space was silent, take a closer listen',
    source: 'CBC Radio',
    url: 'https://www.cbc.ca/radio/ideas/music-on-mars-if-you-thought-space-was-silent-take-a-closer-listen-1.6029648',
    date: '2021',
    status: 'DECRYPTED',
  },
  {
    id: 'LOG-05',
    title: 'Rock guitarist shows students how music can take you to Mars',
    source: 'TMJ4',
    url: 'https://www.tmj4.com/news/local-news/los-angeles-rock-guitarist-shows-students-how-music-can-take-you-to-mars',
    date: '2024',
    status: 'DECRYPTED',
  },
];

const signalIndicators = [
  { label: 'ARCHIVE ONLINE', color: 'bg-[#26f6fd]' },
  { label: 'EDLCAM AUDIO', color: 'bg-[#80ffff]' },
  { label: 'PRESS LOGS', color: 'bg-[#ff5f85]' },
  { label: 'VISUAL FEED', color: 'bg-[#a97bff]' },
];

const quickAccessLinks = [
  { id: 'launch-vector', label: 'Launch Vector', href: '/logistics', type: 'internal' },
  { id: 'audio-archive', label: 'Mars Audio Archive', href: '#audio-archive', type: 'anchor' },
  { id: 'research-logs', label: 'Research Logs', href: '#research-logs', type: 'anchor' },
  { id: 'nasa-portal', label: 'NASA Data Portal', href: 'https://pds-imaging.jpl.nasa.gov/data/', type: 'external' },
  { id: 'youtube', label: 'YouTube Feed', href: 'https://www.youtube.com/c/JasonAchilles', type: 'external' },
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
        <h2 className="font-share text-2xl md:text-3xl uppercase tracking-[0.22em] bg-gradient-to-r from-[#26f6fd] via-[#7cfaff] to-[#f3feff] bg-clip-text text-transparent">
          Mars Acoustic Research
        </h2>
        <div className="flex items-center gap-3">
          <span className="font-vt323 text-amber-bright text-base md:text-lg">MISSION CRITICAL // AUDIO + PRESS DOSSIER</span>
          <Link
            to="/logistics"
            className="border border-amber-dim px-2 py-1 font-vt323 text-xs text-amber hover:border-amber hover:bg-amber hover:text-black transition-colors"
          >
            NEXT SHOW ROUTE
          </Link>
        </div>
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
        <section className="border border-amber-dim/60 bg-black/70 p-4 md:p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-amber-dim/40 pb-2">
            <h3 className="font-share text-amber-bright uppercase tracking-wider">Mission Brief</h3>
            <span className="font-vt323 text-amber-dim text-xs md:text-sm tracking-[0.2em] uppercase">
              STATUS: ONLINE
            </span>
          </div>
          <p className="mt-3 font-vt323 text-amber text-lg md:text-xl leading-relaxed">
            The same engineering discipline used on the Mars microphone now drives the stage experiment. This is not
            costume sci-fi branding, it is real audio research translated into live heavy rock.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              to="/logistics"
              className="border border-amber px-3 py-1.5 font-share text-sm tracking-wider text-amber-bright hover:bg-amber hover:text-black transition-colors"
            >
              OPEN LAUNCH VECTOR
            </Link>
            <a
              href="https://www.youtube.com/c/JasonAchilles"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-amber-dim px-3 py-1.5 font-share text-sm tracking-wider text-amber hover:border-amber hover:bg-amber/10 transition-colors"
            >
              YOUTUBE FEED
            </a>
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
          <div className="mt-4 flex flex-wrap gap-2">
            {signalIndicators.map((signal) => (
              <span
                key={`quick-${signal.label}`}
                className="inline-flex items-center gap-2 border border-[#26f6fd]/20 bg-[#041014]/80 px-2 py-1 font-vt323 text-xs tracking-widest text-[#c8feff] uppercase"
              >
                <span className={`h-2 w-2 rounded-full ${signal.color} animate-pulse`}></span>
                {signal.label}
              </span>
            ))}
          </div>
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
            These two files are a major part of the Jason Achilles story: authentic Martian atmosphere recordings
            captured by the Perseverance rover microphone system and post-processed for public listening clarity.
          </p>

          <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
            {marsRecordings.map((recording) => (
              <article key={recording.id} className="border border-[#26f6fd]/30 bg-black/80 rounded p-3 md:p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <h4 className="font-share text-base md:text-lg tracking-wide uppercase text-[#ccfeff] leading-tight">
                      {recording.title}
                    </h4>
                    <p className="font-vt323 text-base md:text-lg text-[#bffcff] mt-0.5">
                      {recording.subtitle}
                    </p>
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

      <div id="research-logs" className="border border-red-dim/60 bg-black/80 p-4 md:p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-red-dim/40 pb-2">
          <h3 className="font-share text-red-bright uppercase tracking-wider">Mission Critical // Research Logs</h3>
          <span className="font-vt323 text-red-dim text-sm md:text-base">CLASSIFIED_ACCESS_GRANTED</span>
        </div>
        <p className="font-vt323 text-[#ffd6e2] mt-3 text-lg md:text-xl leading-relaxed">
          Documented sources covering the Mars microphone work and public research trail tied to the Jason Achilles story.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3">
          {researchLogs.map((log, index) => (
            <motion.a
              key={log.id}
              href={log.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="group relative border border-red-dim/55 bg-black/90 p-3 md:p-4 hover:border-red hover:bg-red/8 transition-all duration-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-vt323 text-red-dim bg-red-dim/20 px-1">{log.id}</span>
                  <span className="font-share text-xs text-red-bright">{log.source} // {log.date}</span>
                </div>
                <h4 className="font-share text-lg md:text-xl text-[#ffd6e2] group-hover:text-red-bright transition-colors">
                  {log.title}
                </h4>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                <span className="font-vt323 text-red-dim">[{log.status}]</span>
                <ExternalLink className="w-5 h-5 text-red-dim group-hover:text-red transition-colors" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="border border-cyan-dim/50 bg-black/70 p-4 rounded relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-dim to-transparent"></div>
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-cyan" />
            <h3 className="font-share text-cyan tracking-widest uppercase">Subject Profile</h3>
          </div>
          <div className="font-vt323 text-[#e7dfd1] space-y-2 text-base md:text-lg">
            {subjectProfile.map((item) => (
              <p key={item.label}>
                <span className="text-cyan-dim">{item.label}:</span> {item.value}
              </p>
            ))}
            <div className="mt-4 p-2 border border-cyan-dim/30 bg-cyan-dim/10 text-cyan-bright text-sm leading-relaxed">
              &gt; WARNING: Subject exhibits high levels of analog friction. Performances are tactile, loud, and intentionally unsequenced.
            </div>
          </div>
        </div>

        <div className="border border-green-dim/50 bg-black/70 p-4 rounded relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-dim to-transparent"></div>
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-green" />
            <h3 className="font-share text-green tracking-widest uppercase">Current Objective</h3>
          </div>
          <div className="font-vt323 text-[#e7dfd1] space-y-2 text-base md:text-lg">
            {currentObjective.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <div className="mt-4 p-2 border border-green-dim/30 bg-green-dim/10 text-green-bright text-sm leading-relaxed">
              &gt; STATUS: Operational. Next deployment vector is loaded. Open Launch Vector for show coordinates.
            </div>
          </div>
        </div>
      </div>

      <div className="rounded p-[1px] bg-gradient-to-r from-[#4f2ea3] via-[#8f66ff] to-[#d8c2ff] shadow-[0_0_20px_rgba(143,102,255,0.34)]">
        <section className="border border-[#a97bff]/45 bg-[#07050f] rounded-[7px] p-4 md:p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-[#a97bff]/25 pb-2">
            <h3 className="font-share text-xl md:text-2xl tracking-wider uppercase text-[#f3ebff]">
              Mission Visual + Launch Archive
            </h3>
            <span className="font-vt323 text-sm md:text-base uppercase tracking-wider text-[#eadbff]">
              External Transmissions + Field Photos
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-5">
            <div className="border border-[#a97bff]/35 bg-black/70 rounded p-3 md:p-4">
              <div className="font-share text-lg md:text-xl text-[#f3ebff] uppercase tracking-wider">Launch Video Links</div>
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
              <div className="font-share text-lg md:text-xl text-[#f3ebff] uppercase tracking-wider">Jason Photo Archive</div>
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