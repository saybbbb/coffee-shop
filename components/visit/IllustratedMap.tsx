/**
 * Hand-drawn style neighbourhood map in the Nurvana palette.
 * Pure SVG so it stays crisp at any size and matches the brand (no map embed).
 */

const STREET_EDGE = "#d8c4a5";
const STREET = "#fbf5ec";
const LABEL = "#a08a6c";

function Street({ d, width = 22 }: { d: string; width?: number }) {
  return (
    <>
      <path d={d} stroke={STREET_EDGE} strokeWidth={width + 4} strokeLinecap="round" fill="none" />
      <path d={d} stroke={STREET} strokeWidth={width} strokeLinecap="round" fill="none" />
    </>
  );
}

function Label({ x, y, rotate = 0, children }: { x: number; y: number; rotate?: number; children: string }) {
  return (
    <text
      x={x}
      y={y}
      transform={rotate ? `rotate(${rotate} ${x} ${y})` : undefined}
      fill={LABEL}
      fontFamily="Space Mono, monospace"
      fontSize="10"
      letterSpacing="2"
      textAnchor="middle"
      dominantBaseline="central"
    >
      {children}
    </text>
  );
}

function Icon({ x, y, name, size = 16, color }: { x: number; y: number; name: string; size?: number; color: string }) {
  return (
    <text
      x={x}
      y={y}
      fontFamily="Material Symbols Outlined"
      fontSize={size}
      fill={color}
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontVariationSettings: "'FILL' 1" }}
    >
      {name}
    </text>
  );
}

export default function IllustratedMap() {
  return (
    <svg
      viewBox="0 0 640 460"
      className="w-full h-full"
      role="img"
      aria-label="Map: Nurvana Café at the corner of Bean Street and Steam Avenue, a 3 minute walk from Roast District Station"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Ground */}
      <rect width="640" height="460" fill="#efe2cd" />

      {/* City blocks */}
      <g fill="#e7d6bc">
        <rect x="140" y="130" width="170" height="100" rx="10" />
        <rect x="350" y="130" width="170" height="100" rx="10" />
        <rect x="560" y="130" width="90" height="100" rx="10" />
        <rect x="140" y="270" width="170" height="70" rx="10" />
        <rect x="350" y="270" width="170" height="60" rx="10" />
        <rect x="350" y="0" width="170" height="90" rx="10" />
        <rect x="560" y="0" width="90" height="90" rx="10" />
        <rect x="-10" y="270" width="110" height="80" rx="10" />
      </g>

      {/* Park */}
      <path d="M-10 -10 H300 V88 Q 230 100 150 92 Q 60 86 -10 96 Z" fill="#cfdcb0" />
      <g fill="#a9bf8e">
        {[
          [40, 30], [85, 52], [130, 24], [175, 58], [220, 30], [262, 60], [60, 72], [200, 76],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="9" />
        ))}
      </g>
      <text x="150" y="44" fill="#6f8457" fontFamily="Epilogue, serif" fontStyle="italic" fontSize="15" textAnchor="middle">
        Bloom Park
      </text>

      {/* River */}
      <path
        d="M-10 392 C 150 350, 290 430, 450 382 S 610 338, 650 350"
        stroke="#b7cfcc"
        strokeWidth="34"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M-10 392 C 150 350, 290 430, 450 382 S 610 338, 650 350"
        stroke="#cbdedb"
        strokeWidth="2"
        strokeDasharray="10 14"
        fill="none"
      />
      <text x="530" y="400" fill="#7f9e9a" fontFamily="Epilogue, serif" fontStyle="italic" fontSize="13" textAnchor="middle">
        Riverwalk
      </text>

      {/* Streets (drawn after the river so Steam Ave reads as a bridge) */}
      <Street d="M-20 110 H660" width={16} />
      <Street d="M120 110 V350" width={14} />
      <Street d="M540 -20 V340" width={14} />
      <Street d="M-20 250 H660" />
      <Street d="M330 -20 V480" />
      <Street d="M150 425 L520 65" width={16} />

      <Label x={60} y={110}>ROAST RD</Label>
      <Label x={70} y={250}>BEAN ST</Label>
      <Label x={330} y={60} rotate={-90}>STEAM AVE</Label>
      <Label x={262} y={316} rotate={-44.2}>ARTISAN ALLEY</Label>

      {/* Landmarks */}
      <g>
        <circle cx="430" cy="180" r="15" fill="#fbf5ec" stroke={STREET_EDGE} strokeWidth="2" />
        <Icon x={430} y={180} name="local_library" color="#8b6a48" />
        <circle cx="220" cy="180" r="15" fill="#fbf5ec" stroke={STREET_EDGE} strokeWidth="2" />
        <Icon x={220} y={180} name="storefront" color="#8b6a48" />
      </g>

      {/* Walking route: station → café */}
      <path
        className="map-walk"
        d="M540 110 V250 H352"
        stroke="#c48a55"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="2 10"
        fill="none"
      />
      <g transform="translate(470 224)">
        <rect x="-44" y="-12" width="88" height="24" rx="12" fill="#fdf9f4" stroke="#e1c1a4" />
        <text x="0" y="0" fill="#6c5c3d" fontFamily="Space Mono, monospace" fontSize="10" textAnchor="middle" dominantBaseline="central">
          3 min walk
        </text>
      </g>

      {/* Station */}
      <g>
        <circle cx="540" cy="110" r="17" fill="#33210d" />
        <Icon x={540} y={110} name="train" color="#f6e0b9" size={18} />
        <rect x="560" y="72" width="76" height="22" rx="11" fill="#fdf9f4" stroke="#e1c1a4" />
        <text x="598" y="83" fill="#33210d" fontFamily="Space Mono, monospace" fontSize="9.5" textAnchor="middle" dominantBaseline="central">
          Roast Stn
        </text>
      </g>

      {/* Café pin */}
      <g className="map-pin">
        <circle cx="330" cy="250" r="22" fill="#c48a55" className="map-pin-pulse" />
        <circle cx="330" cy="250" r="22" fill="#c48a55" className="map-pin-pulse map-pin-pulse-delay" />
        <circle cx="330" cy="250" r="22" fill="#33210d" stroke="#fdf9f4" strokeWidth="4" />
        <Icon x={330} y={250} name="local_cafe" color="#f6e0b9" size={22} />
        <g transform="translate(330 202)">
          <rect x="-62" y="-17" width="124" height="34" rx="17" fill="#33210d" />
          <path d="M-7 16 L0 25 L7 16 Z" fill="#33210d" />
          <text x="0" y="0" fill="#fdf9f4" fontFamily="Bricolage Grotesque, sans-serif" fontWeight="800" fontSize="14" textAnchor="middle" dominantBaseline="central">
            Nurvana Café
          </text>
        </g>
      </g>

      {/* Compass */}
      <g transform="translate(606 424)" opacity="0.8">
        <circle r="18" fill="#fdf9f4" stroke="#e1c1a4" />
        <path d="M0 -12 L5 2 L0 -1 L-5 2 Z" fill="#33210d" />
        <text y="9" fill="#33210d" fontFamily="Space Mono, monospace" fontSize="8" textAnchor="middle" dominantBaseline="central">
          N
        </text>
      </g>
    </svg>
  );
}
