import { Link } from 'react-router-dom';

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

const toPublicAsset = (relativePath: string) => `${import.meta.env.BASE_URL}${relativePath}`;

export function SchematicRepository() {
  return (
    <div className="flex flex-col h-full gap-4 pb-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b border-amber-dim pb-2">
        <div>
          <h2 className="font-share text-2xl uppercase tracking-widest text-amber-bright">Live Rig Lab</h2>
          <p className="font-vt323 text-sm text-amber-dim tracking-wider mt-0.5">Stage Plot for Venues</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="font-vt323 text-amber-dim text-sm md:text-base">AUTHORIZED STAGE MANIFEST</span>
          <Link
            to="/logistics"
            className="border border-amber-dim px-2 py-1 font-vt323 text-xs text-amber hover:border-amber hover:bg-amber hover:text-black transition-colors"
          >
            SEE SHOWS
          </Link>
        </div>
      </div>

      <div className="border-2 border-cyan-900 rounded overflow-hidden bg-[#051014]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-2 border-b border-cyan-900 font-share text-cyan-300 text-sm tracking-wider">
          <span>AUTHORIZED STAGE MANIFEST // ARCHIVE</span>
          <a
            href={toPublicAsset('stage-plot-original.pdf')}
            target="_blank"
            rel="noopener noreferrer"
            className="font-vt323 text-xs text-cyan-400 hover:text-cyan-200 transition-colors"
          >
            DOWNLOAD FULL PDF (EPK)
          </a>
        </div>
        <div className="bg-white p-2 md:p-3">
          <img
            src={toPublicAsset('stage-plot-original.png')}
            alt="Jason Achilles original stage setup diagram"
            className="w-full h-auto object-contain"
          />
        </div>
        <div className="px-4 py-2 border-t border-cyan-900 font-vt323 text-sm text-cyan-400/80">
          Contact: jmezilis@gmail.com · +1 (323) 481-5681
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-terminal-panel border-2 border-amber-dim rounded p-4">
          <div className="font-share text-amber-dim mb-2 border-b border-amber-dim/30 pb-1">
            INPUT PATCH LIST (FOH)
          </div>
          <div className="max-h-64 overflow-y-auto custom-scrollbar pr-2">
            {inputList.map((line) => (
              <div
                key={line.channel}
                className="grid grid-cols-[56px_1fr_92px] gap-2 py-1 border-b border-amber-dim/15 font-vt323 text-base"
              >
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
    </div>
  );
}
