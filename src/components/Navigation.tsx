import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { Activity, Disc, Map, Newspaper } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Band Overview', icon: Activity, desc: 'Signal Broadcast', color: 'signal' },
  { path: '/logistics', label: 'Launch Vector', icon: Map, desc: 'Shows & Tickets', color: 'trajectory' },
  {
    path: '/discography',
    label: 'Nerd Sh!t',
    icon: Disc,
    desc: 'Mars · ISS · Space Audio',
    color: 'purple',
  },
  {
    path: '/research',
    label: 'Press Archive',
    icon: Newspaper,
    desc: 'WIRED · KTLA · CBC · More',
    color: 'red',
  },
];

const colorMap: Record<string, { active: string; inactive: string; indicator: string }> = {
  signal: {
    active: 'border-[#fff94a] bg-[#fff94a]/22 text-[#ffffed] shadow-[0_0_22px_rgba(255,249,74,0.62)]',
    inactive: 'border-[#fff94a]/60 text-[#fff8b3] hover:border-[#fff94a] hover:bg-[#fff94a]/16',
    indicator: 'bg-[#fff94a]',
  },
  trajectory: {
    active: 'border-[#84ff6a] bg-[#84ff6a]/20 text-[#ebffe4] shadow-[0_0_20px_rgba(132,255,106,0.5)]',
    inactive: 'border-[#84ff6a]/55 text-[#c3ffb4] hover:border-[#84ff6a] hover:bg-[#84ff6a]/14',
    indicator: 'bg-[#84ff6a]',
  },
  rigblue: {
    active: 'border-[#6f82ff] bg-[#6f82ff]/24 text-[#f1f4ff] shadow-[0_0_24px_rgba(111,130,255,0.68)]',
    inactive: 'border-[#6f82ff]/65 text-[#d0d8ff] hover:border-[#6f82ff] hover:bg-[#6f82ff]/18',
    indicator: 'bg-[#6f82ff]',
  },
  purple: {
    active: 'border-[#d86bff] bg-[#d86bff]/22 text-[#fae7ff] shadow-[0_0_22px_rgba(216,107,255,0.55)]',
    inactive: 'border-[#d86bff]/58 text-[#eabfff] hover:border-[#d86bff] hover:bg-[#d86bff]/15',
    indicator: 'bg-[#d86bff]',
  },
  cyan: {
    active: 'border-[#26ffff] bg-[#26ffff]/22 text-[#e9ffff] shadow-[0_0_20px_rgba(38,255,255,0.58)]',
    inactive: 'border-[#26ffff]/55 text-[#a8fdff] hover:border-[#26ffff] hover:bg-[#26ffff]/15',
    indicator: 'bg-[#26ffff]',
  },
  red: {
    active: 'border-[#ff5f85] bg-[#ff5f85]/20 text-[#ffe1ea] shadow-[0_0_20px_rgba(255,95,133,0.48)]',
    inactive: 'border-[#ff5f85]/55 text-[#ffbfd0] hover:border-[#ff5f85] hover:bg-[#ff5f85]/14',
    indicator: 'bg-[#ff5f85]',
  },
};

const wrapLabelPaths = new Set(['/discography', '/research']);

export function Navigation() {
  const playClick = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  };

  return (
    <nav className="flex flex-col gap-2 md:gap-4 min-w-0">
      <div className="font-share text-base md:text-lg border-b border-amber-dim/50 pb-1 mb-1 md:mb-2 bg-gradient-to-r from-[#ff7a1a] via-[#ffb067] to-[#ffd3a8] bg-clip-text text-transparent">
        SELECT MODULE
      </div>
      <div className="flex md:flex-col gap-2 md:gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none pb-1 md:pb-0 -mx-0.5 px-0.5 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {navItems.map((item) => {
        const colors = colorMap[item.color];
        const wrapLabel = wrapLabelPaths.has(item.path);
        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={playClick}
            className={({ isActive }) =>
              `relative group flex items-center gap-2.5 md:gap-3.5 p-3 md:p-[1.15rem] border-2 transition-colors duration-75 shrink-0 w-[min(72vw,260px)] md:w-auto md:shrink snap-start ${
                isActive ? colors.active : colors.inactive
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 md:w-6 md:h-6 shrink-0 ${isActive ? 'animate-pulse' : ''}`} />
                <div className="flex flex-col overflow-hidden min-w-0">
                  <span
                    className={`font-share uppercase tracking-wider ${
                      wrapLabel
                        ? 'text-sm md:text-xl leading-tight whitespace-normal break-words'
                        : 'text-base md:text-2xl leading-tight md:leading-none truncate'
                    }`}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`font-vt323 text-xs md:text-base uppercase mt-0.5 md:mt-1 ${
                      wrapLabel ? 'whitespace-normal break-words leading-snug' : 'truncate'
                    } ${isActive ? '' : 'opacity-70'}`}
                  >
                    {item.desc}
                  </span>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className={`absolute left-0 top-0 bottom-0 w-1 ${colors.indicator}`}
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        );
      })}
      </div>
    </nav>
  );
}
