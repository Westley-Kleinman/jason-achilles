import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

type StageNode = {
  id: string;
  x: number;
  y: number;
  label: string;
  channel: string;
  freq: number;
  wave: OscillatorType;
};

const stageNodes: StageNode[] = [
  { id: 'drum-kit', x: 16, y: 66, label: '4PC DRUM KIT + MONITOR', channel: 'CH 1-8', freq: 85, wave: 'sawtooth' },
  { id: 'bass-rig', x: 37, y: 44, label: 'BASS AMP (MIC + DI)', channel: 'CH 9-10', freq: 110, wave: 'triangle' },
  { id: 'guitar-rig', x: 56, y: 36, label: 'GUITAR AMP (MIC)', channel: 'CH 11', freq: 146, wave: 'square' },
  { id: 'wurli-rig', x: 66, y: 62, label: 'WURLI AMP (MIC)', channel: 'CH 12', freq: 174, wave: 'triangle' },
  { id: 'synth-rig', x: 81, y: 48, label: 'SYNTH (MONO DI)', channel: 'CH 13', freq: 220, wave: 'square' },
  { id: 'theremin-rig', x: 88, y: 26, label: 'THEREMIN (DI)', channel: 'CH 14', freq: 294, wave: 'sine' },
];

const inputList = [
  { channel: 1, source: 'KICK', capture: 'MIC' },
  { channel: 2, source: 'SNARE', capture: 'MIC' },
  { channel: 3, source: 'TOM RACK', capture: 'MIC' },
  { channel: 4, source: 'TOM FLOOR', capture: 'MIC' },
  { channel: 5, source: 'HAT', capture: 'MIC' },
  { channel: 6, source: 'RIDE', capture: 'MIC' },
  { channel: 7, source: 'OH L', capture: 'MIC' },
  { channel: 8, source: 'OH R', capture: 'MIC' },
  { channel: 9, source: 'BASS AMP', capture: 'DI' },
  { channel: 10, source: 'BASS AMP', capture: 'MIC' },
  { channel: 11, source: 'GUITAR AMP', capture: 'MIC' },
  { channel: 12, source: 'WURLI AMP', capture: 'MIC' },
  { channel: 13, source: 'SYNTH', capture: 'MONO DI' },
  { channel: 14, source: 'THEREMIN', capture: 'DI' },
];

const mixNotes = [
  {
    section: 'DRUMS',
    notes: [
      'Very full mix with strong low-end snare + toms.',
      'Apply pronounced ambient gated reverbs.',
      'Reference feel: Phil Collins meets early Pink Floyd.',
    ],
  },
  {
    section: 'BASS',
    notes: ['Keep focus in lower mid-range; avoid boomy low-end.'],
  },
  {
    section: 'WURLITZER',
    notes: ['Treat as deep rhythm guitar with a thick body.'],
  },
  {
    section: 'GUITAR',
    notes: [
      'Mix like lead vocal with strong upper-mid presence.',
      'Ride delay/reverb FX to taste during transitions.',
    ],
  },
];

const stageRequirements = [
  'Three power drops: DRUMMER EARS, PEDALBOARD, and KEYS positions.',
  'Dedicated drum monitor at drum station.',
  'One bass stand and one guitar stand at performer zone.',
];

export function SchematicRepository() {
  const [activeNode, setActiveNode] = useState<StageNode | null>(null);

  const triggerAudio = (node: StageNode) => {
    setActiveNode(node);
    
    // Synthesize a raw, uncompressed-sounding tone
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = node.wave;
      
      osc.frequency.setValueAtTime(node.freq, ctx.currentTime);
      
      // Add some "analog" distortion/wobble
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 5;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 10;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
      lfo.stop(ctx.currentTime + 1.5);
      
    } catch (e) {
    }

    setTimeout(() => setActiveNode(null), 1500);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex justify-between items-center border-b border-amber-dim pb-2">
        <h2 className="font-share text-2xl uppercase tracking-widest text-amber-bright">
          Live Rig Lab
        </h2>
        <div className="flex items-center gap-3">
          <span className="font-vt323 text-amber-dim">BLUEPRINT_V2.0 // STAGE_PLOT_2026</span>
          <Link
            to="/logistics"
            className="border border-amber-dim px-2 py-1 font-vt323 text-xs text-amber hover:border-amber hover:bg-amber hover:text-black transition-colors"
          >
            SEE RIG IN FIELD
          </Link>
        </div>
      </div>

      <div className="relative min-h-[360px] md:min-h-[430px] xl:min-h-[500px] bg-[#051014] border-2 border-cyan-900 rounded overflow-hidden p-4 font-share text-cyan-500">
        {/* Blueprint Grid Background */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'linear-gradient(#0a2a3a 1px, transparent 1px), linear-gradient(90deg, #0a2a3a 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
          <div className="px-2 py-1 text-[10px] md:text-xs bg-[#021418]/85 border border-cyan-800/60 text-cyan-300 tracking-wide text-center">
            POWER DROP // DRUMMER EARS
          </div>
          <div className="px-2 py-1 text-[10px] md:text-xs bg-[#021418]/85 border border-cyan-800/60 text-cyan-300 tracking-wide text-center">
            POWER DROP // PEDALBOARD
          </div>
          <div className="px-2 py-1 text-[10px] md:text-xs bg-[#021418]/85 border border-cyan-800/60 text-cyan-300 tracking-wide text-center">
            POWER DROP // KEYS
          </div>
        </div>

        {/* Mock SVG Schematic */}
        <div className="relative w-full min-h-[280px] md:min-h-[340px] xl:min-h-[420px] border border-cyan-800/50 flex items-center justify-center">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 opacity-30 stroke-cyan-600 fill-none">
            <rect x="8" y="54" width="17" height="28" strokeWidth="0.5" />
            <rect x="31" y="34" width="14" height="20" strokeWidth="0.5" />
            <rect x="50" y="28" width="13" height="18" strokeWidth="0.5" />
            <rect x="60" y="54" width="13" height="20" strokeWidth="0.5" />
            <rect x="76" y="40" width="12" height="16" strokeWidth="0.5" />
            <circle cx="89" cy="24" r="6" strokeWidth="0.5" />
            <path d="M25 64 L31 44" strokeWidth="0.5" strokeDasharray="1,1" />
            <path d="M45 44 L50 37" strokeWidth="0.5" strokeDasharray="1,1" />
            <path d="M63 37 L76 48" strokeWidth="0.5" strokeDasharray="1,1" />
            <path d="M73 64 L76 48" strokeWidth="0.5" strokeDasharray="1,1" />
            <path d="M88 33 L82 47" strokeWidth="0.5" strokeDasharray="1,1" />
          </svg>

          {/* Hotspots */}
          {stageNodes.map((spot) => (
            <div
              key={spot.id}
              className="absolute flex flex-col items-center"
              style={{ left: `${spot.x}%`, top: `${spot.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <button
                onClick={() => triggerAudio(spot)}
                aria-label={`Test ${spot.label} ${spot.channel}`}
                className={`relative w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  activeNode?.id === spot.id 
                    ? 'border-cyan-300 bg-cyan-300/30 scale-125 shadow-[0_0_15px_rgba(103,232,249,0.5)]' 
                    : 'border-cyan-600 bg-cyan-900/50 hover:border-cyan-400 hover:bg-cyan-800/50'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${activeNode?.id === spot.id ? 'bg-cyan-300 animate-ping' : 'bg-cyan-600'}`}></div>
              </button>
              
              <div className="mt-2 max-w-[150px] px-2 py-1 bg-[#051014]/80 border border-cyan-800 text-[10px] md:text-xs text-center leading-tight whitespace-normal backdrop-blur-sm">
                {spot.label} <span className="text-cyan-300/80">[{spot.channel}]</span>
              </div>
              
              {/* Connection Line */}
              <div className="hidden md:block absolute top-8 w-px h-16 bg-cyan-800/50 -z-10"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-terminal-panel border-2 border-amber-dim rounded p-4">
          <div className="font-share text-amber-dim mb-2 border-b border-amber-dim/30 pb-1">
            INPUT PATCH LIST (FOH)
          </div>
          <div className="max-h-64 overflow-y-auto custom-scrollbar pr-2">
            {inputList.map((line) => (
              <div key={line.channel} className="grid grid-cols-[56px_1fr_92px] gap-2 py-1 border-b border-amber-dim/15 font-vt323 text-base">
                <span className="text-amber-bright">CH {line.channel}</span>
                <span className="text-amber">{line.source}</span>
                <span className="text-amber-dim text-right">{line.capture}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-terminal-panel border-2 border-amber-dim rounded p-4">
          <div className="font-share text-amber-dim mb-2 border-b border-amber-dim/30 pb-1">
            MIX DIRECTIVES + STAGE NOTES
          </div>
          <div className="max-h-64 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-3">
            {mixNotes.map((entry) => (
              <div key={entry.section}>
                <div className="font-share text-amber-bright text-sm">{entry.section}</div>
                <div className="mt-1 space-y-1">
                  {entry.notes.map((note, index) => (
                    <div key={`${entry.section}-${index}`} className="font-vt323 text-base text-amber">
                      &gt; {note}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-amber-dim/25">
              <div className="font-share text-amber-bright text-sm">STAGE REQUIREMENTS</div>
              <div className="mt-1 space-y-1">
                {stageRequirements.map((note, index) => (
                  <div key={`req-${index}`} className="font-vt323 text-base text-amber">
                    &gt; {note}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-terminal-panel border-2 border-amber-dim rounded p-4">
        <div className="font-share text-amber-dim mb-2 border-b border-amber-dim/30 pb-1">
          DIAGNOSTIC OUTPUT
        </div>
        <div className="font-vt323 text-lg">
          {activeNode ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-amber-bright flex flex-col"
            >
              <span>&gt; INITIATING STAGE NODE TEST...</span>
              <span>&gt; ANALYZING {activeNode.label}...</span>
              <span>&gt; PATCH ROUTE VERIFIED: {activeNode.channel}</span>
              <span className="animate-pulse">&gt; SIGNAL DETECTED. TEST TONE {activeNode.freq}HZ / {activeNode.wave.toUpperCase()}.</span>
            </motion.div>
          ) : (
            <span className="text-amber-dim/50">&gt; AWAITING INPUT... CLICK STAGE NODES TO AUDIT ROUTING.</span>
          )}
        </div>
        <div className="mt-2 font-vt323 text-xs text-amber-dim">
          &gt; SOURCE: STAGE PLOT 2026 (STRUCTURED FOR WEB) // FIELD VALIDATION PATH:
          <Link to="/logistics" className="text-amber hover:text-amber-bright underline ml-1">
            OPEN TRAJECTORY BOARD
          </Link>
        </div>
      </div>
    </div>
  );
}
