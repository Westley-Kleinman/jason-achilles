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
    status: 'DECRYPTED'
  },
  {
    id: 'LOG-02',
    title: 'Perseverance Rover Musician Microphone',
    source: 'KTLA',
    url: 'https://ktla.com/news/technology/jason-achilles-mezilis-mars-2020-perseverance-rover-musician-microphone/',
    date: '2021',
    status: 'DECRYPTED'
  },
  {
    id: 'LOG-03',
    title: 'Martian Mic Drop',
    source: 'Planetary Radio',
    url: 'https://www.planetary.org/planetary-radio/2023-martian-mic-drop',
    date: '2023',
    status: 'DECRYPTED'
  },
  {
    id: 'LOG-04',
    title: 'Music on Mars: If you thought space was silent, take a closer listen',
    source: 'CBC Radio',
    url: 'https://www.cbc.ca/radio/ideas/music-on-mars-if-you-thought-space-was-silent-take-a-closer-listen-1.6029648',
    date: '2021',
    status: 'DECRYPTED'
  },
  {
    id: 'LOG-05',
    title: 'Rock guitarist shows students how music can take you to Mars',
    source: 'TMJ4',
    url: 'https://www.tmj4.com/news/local-news/los-angeles-rock-guitarist-shows-students-how-music-can-take-you-to-mars',
    date: '2024',
    status: 'DECRYPTED'
  }
];

export function ResearchLogs() {
  return (
    <div className="flex flex-col gap-4 pb-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-red-dim pb-2">
        <h2 className="font-share text-2xl uppercase tracking-widest text-red-bright text-glow-red">
          Mars Acoustics Research
        </h2>
        <span className="font-vt323 text-red-dim animate-pulse text-sm md:text-base">CLASSIFIED_ACCESS_GRANTED</span>
      </div>

      <div className="overflow-visible md:overflow-y-auto custom-scrollbar md:pr-2 flex flex-col gap-4">
        <div className="font-vt323 text-red mb-2 border border-red-dim/40 bg-black/65 p-3">
          <p>&gt; ACCESSING EXTRATERRESTRIAL AUDIO LOGS...</p>
          <p>&gt; SUBJECT: JASON ACHILLES</p>
          <p>&gt; MISSION: MARS 2020 PERSEVERANCE ROVER MICROPHONE</p>
        </div>

        <div className="border border-red-dim/60 bg-black/70 p-4">
          <h3 className="font-share text-red-bright uppercase tracking-wider">
            Live Credibility Link
          </h3>
          <p className="font-vt323 text-red mt-2 text-lg leading-relaxed">
            The same engineering discipline used on the Mars microphone now drives the stage experiment. This is not
            costume sci-fi branding, it is real audio research translated into live heavy rock.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              to="/logistics"
              className="border border-red px-3 py-1.5 font-share text-xs tracking-wider text-red-bright hover:bg-red hover:text-black transition-colors"
            >
              OPEN TRAJECTORY BOARD
            </Link>
            <Link
              to="/"
              className="border border-red-dim px-3 py-1.5 font-share text-xs tracking-wider text-red hover:border-red hover:bg-red/10 transition-colors"
            >
              RETURN TO BROADCAST
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
              className="group relative border border-red-dim/55 bg-black/80 p-4 hover:border-red hover:bg-red/8 transition-all duration-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-vt323 text-red-dim bg-red-dim/20 px-1">{log.id}</span>
                  <span className="font-share text-xs text-red-bright">{log.source}</span>
                </div>
                <h3 className="font-share text-lg text-red group-hover:text-red-bright transition-colors">
                  {log.title}
                </h3>
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                <span className="font-vt323 text-red-dim">[{log.status}]</span>
                <ExternalLink className="w-5 h-5 text-red-dim group-hover:text-red transition-colors" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
