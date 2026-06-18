import { useEffect, useState } from 'react';

type IssTelemetry = {
  latitude: number;
  longitude: number;
  timestamp: number;
};

const ISS_ENDPOINT = 'https://api.wheretheiss.at/v1/satellites/25544';

const formatIssCoord = (value?: number) => {
  if (value === undefined || value === null) return '--';
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return '--';
  return parsed.toFixed(2);
};

const formatIssTimestamp = (timestamp?: number) => {
  if (!timestamp) return '--';
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export function IssTrackerPanel({ compact = false }: { compact?: boolean }) {
  const [issTelemetry, setIssTelemetry] = useState<IssTelemetry | null>(null);
  const [issStatus, setIssStatus] = useState<'loading' | 'online' | 'error'>('loading');
  const [issError, setIssError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadIssTelemetry = async () => {
      try {
        setIssStatus((prev) => (prev === 'online' ? 'online' : 'loading'));
        setIssError(null);
        const response = await fetch(ISS_ENDPOINT, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`ISS telemetry request failed: ${response.status}`);
        }

        const payload = await response.json();
        const latitude = Number(payload?.latitude);
        const longitude = Number(payload?.longitude);
        const timestamp = Number(payload?.timestamp);

        if (Number.isNaN(latitude) || Number.isNaN(longitude) || Number.isNaN(timestamp)) {
          throw new Error('ISS telemetry payload was invalid.');
        }

        if (!isMounted) return;

        setIssTelemetry({ latitude, longitude, timestamp });
        setIssStatus('online');
      } catch (error) {
        if (!isMounted || controller.signal.aborted) return;
        setIssStatus('error');
        setIssError('Telemetry offline.');
      }
    };

    loadIssTelemetry();
    const interval = setInterval(loadIssTelemetry, 10000);

    return () => {
      isMounted = false;
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  const issLat = formatIssCoord(issTelemetry?.latitude);
  const issLon = formatIssCoord(issTelemetry?.longitude);
  const issLastUpdated = formatIssTimestamp(issTelemetry?.timestamp);
  const issMapUrl = issTelemetry
    ? `https://www.google.com/maps?q=${issTelemetry.latitude},${issTelemetry.longitude}`
    : 'https://www.google.com/maps?q=International+Space+Station';
  const issStatusLabel = issStatus === 'online' ? 'LOCKED' : issStatus === 'error' ? 'OFFLINE' : 'SYNCING';

  return (
    <div className={`border border-[#26f6fd]/45 bg-[#020a0b]/90 rounded-[7px] ${compact ? 'p-3 md:p-4' : 'p-4 md:p-5'}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-[#26f6fd]/25 pb-2">
        <h3 className="font-share text-lg md:text-xl tracking-wider text-[#c8feff] uppercase">
          ISS Orbital Tracker
        </h3>
        <span className="font-vt323 text-sm text-[#8feaf0] uppercase tracking-wider">
          ISS-LOCATION-NOW
        </span>
      </div>

      <div className={`mt-3 grid grid-cols-1 ${compact ? 'md:grid-cols-2' : 'md:grid-cols-[1.1fr_0.9fr]'} gap-3`}>
        <div className="border border-[#26f6fd]/30 bg-black/70 p-3">
          <div className="font-vt323 text-xs uppercase tracking-wider text-[#8feaf0]">Current Position</div>
          <div className="mt-2 font-share text-lg md:text-xl text-[#c8feff]">
            LAT {issLat} // LON {issLon}
          </div>
          <div className="mt-1 font-vt323 text-sm text-[#8feaf0]">
            LAST PING: {issLastUpdated}
          </div>
        </div>

        <div className="border border-[#26f6fd]/30 bg-black/70 p-3">
          <div className="font-vt323 text-xs uppercase tracking-wider text-[#8feaf0]">Status</div>
          <div className="mt-2 font-share text-lg md:text-xl text-[#c8feff]">{issStatusLabel}</div>
          <div className="mt-1 font-vt323 text-sm text-[#8feaf0]">
            {issError ?? 'Telemetry nominal.'}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={ISS_ENDPOINT}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-[#26f6fd]/60 px-3 py-1.5 font-share text-xs md:text-sm tracking-wider text-[#c8feff] hover:border-[#26f6fd] hover:bg-[#26f6fd]/10 transition-colors"
        >
          OPEN DATA FEED
        </a>
        <a
          href={issMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-[#26f6fd]/40 px-3 py-1.5 font-share text-xs md:text-sm tracking-wider text-[#8feaf0] hover:border-[#26f6fd] hover:bg-[#26f6fd]/10 transition-colors"
        >
          OPEN MAP
        </a>
      </div>
    </div>
  );
}
