import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const logs = [
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

const sourceBadgeStyles: Record<string, string> = {
  WIRED: 'border-white/80 bg-white text-black shadow-[0_0_16px_rgba(255,255,255,0.25)]',
  KTLA: 'border-[#c8102e] bg-[#c8102e]/15 text-[#ff8a8a] shadow-[0_0_14px_rgba(200,16,46,0.35)]',
  'Planetary Radio': 'border-[#6b5cff] bg-[#6b5cff]/15 text-[#c4bdff] shadow-[0_0_14px_rgba(107,92,255,0.35)]',
  'CBC Radio': 'border-[#d8232a] bg-[#d8232a]/15 text-[#ffadb0] shadow-[0_0_14px_rgba(216,35,42,0.35)]',
  TMJ4: 'border-[#0095da] bg-[#0095da]/15 text-[#8fdcff] shadow-[0_0_14px_rgba(0,149,218,0.35)]',
};

export function ResearchLogs() {
  return (
    <div className="flex flex-col gap-4 pb-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-red-dim pb-2">
        <div>
          <h2 className="font-share text-2xl uppercase tracking-widest text-red-bright text-glow-red">
            Press Archive
          </h2>
          <p className="font-vt323 text-sm text-red-dim tracking-wider mt-0.5">As seen in WIRED, KTLA, CBC & more</p>
        </div>
        <span className="font-vt323 text-red-dim text-sm md:text-base">PRESS CLIPS ONLINE</span>
      </div>

      <div className="overflow-visible md:overflow-y-auto custom-scrollbar md:pr-2 flex flex-col gap-4">
        <div className="border border-red-dim/60 bg-black/70 p-4">
          <h3 className="font-share text-red-bright uppercase tracking-wider">Press Brief</h3>
          <p className="font-vt323 text-red mt-2 text-lg leading-relaxed">
            Coverage from major outlets on the Mars microphone work and the Jason Achilles story. Real engineering
            cred — not costume sci-fi branding.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              to="/discography"
              className="border border-red px-3 py-1.5 font-share text-xs tracking-wider text-red-bright hover:bg-red hover:text-black transition-colors"
            >
              OPEN NERD SH!T
            </Link>
            <Link
              to="/"
              className="border border-red-dim px-3 py-1.5 font-share text-xs tracking-wider text-red hover:border-red hover:bg-red/10 transition-colors"
            >
              RETURN TO BAND OVERVIEW
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {logs.map((log, i) => (
            <motion.a
              key={log.id}
              href={log.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative border border-red-dim/55 bg-black/80 p-4 md:p-5 hover:border-red hover:bg-red/8 transition-all duration-200"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex flex-col gap-3 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 font-share text-xl md:text-2xl tracking-[0.14em] uppercase border-2 ${
                        sourceBadgeStyles[log.source] ??
                        'border-red-dim bg-red-dim/15 text-red-bright shadow-[0_0_12px_rgba(255,95,133,0.3)]'
                      }`}
                    >
                      {log.source}
                    </span>
                    <span className="font-vt323 text-base md:text-lg text-red-dim bg-red-dim/20 px-2 py-0.5">
                      {log.date}
                    </span>
                  </div>
                  <h3 className="font-share text-lg md:text-xl text-[#ffd6e2] group-hover:text-red-bright transition-colors leading-snug">
                    {log.title}
                  </h3>
                  <span className="font-vt323 text-sm text-red-dim">{log.id}</span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-vt323 text-sm text-red-dim">[{log.status}]</span>
                  <ExternalLink className="w-5 h-5 text-red-dim group-hover:text-red transition-colors" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
