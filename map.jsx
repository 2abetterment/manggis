/* Manggis — schematic distribution map of Malesia / SE Asia.
   Stylised data-viz, not a survey map: landmasses are simplified blobs,
   highlighted when the species occurs there; dots mark illustrative records. */

const LANDMASS = {
  "Sri Lanka & India": { label: "India · Sri Lanka", d: "M40,150 q-18,-40 6,-72 q22,-28 40,-6 q14,16 4,46 q-10,30 -28,40 q-14,8 -22,-8 Z", lx: 44, ly: 96 },
  "Thailand":          { label: "Thailand", d: "M205,120 q14,-40 36,-30 q18,8 10,40 q-8,30 -26,40 q-20,10 -28,-12 q-6,-22 8,-38 Z", lx: 210, ly: 110 },
  "Indochina":         { label: "Indochina", d: "M250,108 q26,-30 46,-12 q16,16 4,44 q-14,30 -38,30 q-22,0 -24,-26 q-2,-22 12,-36 Z", lx: 272, ly: 120 },
  "Philippines":       { label: "Philippines", d: "M392,150 q12,-26 26,-14 q10,10 2,30 l10,8 q8,16 -6,24 q-14,6 -20,-8 q-4,12 -16,6 q-10,-6 -2,-22 q-12,-10 0,-30 q4,-10 6,-2 Z", lx: 404, ly: 150 },
  "Sumatra":           { label: "Sumatra", d: "M196,210 q34,-22 56,8 q14,18 -8,30 q-30,18 -54,42 q-18,16 -28,2 q-8,-14 8,-30 q12,-34 26,-52 Z", lx: 214, ly: 250 },
  "Peninsular Malaysia":{ label: "Malay Pen.", d: "M250,170 q18,-8 22,14 q4,24 -8,46 q-10,20 -22,14 q-10,-6 -6,-28 q2,-30 14,-46 Z", lx: 256, ly: 208 },
  "Borneo":            { label: "Borneo", d: "M300,200 q40,-20 70,6 q26,24 8,52 q-22,32 -62,30 q-34,-2 -36,-32 q-2,-34 20,-56 Z", lx: 332, ly: 238 },
  "Java":              { label: "Java", d: "M232,300 q50,-6 96,4 q22,4 12,18 q-14,16 -54,14 q-44,-2 -62,-14 q-12,-8 8,-22 Z", lx: 280, ly: 312 },
  "New Guinea":        { label: "New Guinea", d: "M430,250 q34,-18 66,2 q24,16 8,38 q-20,26 -54,22 q-30,-4 -34,-30 q-2,-20 14,-32 Z", lx: 466, ly: 280 }
};

const RangeMap = ({ regions }) => {
  const set = new Set(regions);
  const dots = [];
  regions.forEach((r) => {
    const m = LANDMASS[r]; if (!m) return;
    for (let i = 0; i < 4; i++) {
      const seed = (r.charCodeAt(0) * (i + 3)) % 30;
      dots.push({ x: m.lx + (seed - 15) * 1.4, y: m.ly + ((seed * 7) % 26 - 13) });
    }
  });
  return (
    <div className="rangemap">
      <svg viewBox="0 0 540 380" className="rangemap-svg">
        {/* sea grid */}
        <defs>
          <pattern id="sea" width="22" height="22" patternUnits="userSpaceOnUse">
            <path d="M0 22V0H22" fill="none" stroke="var(--line)" strokeWidth="0.6" opacity="0.5"/>
          </pattern>
        </defs>
        <rect x="0" y="0" width="540" height="380" fill="url(#sea)" />
        {/* equator */}
        <line x1="0" y1="250" x2="540" y2="250" stroke="var(--line)" strokeWidth="1" strokeDasharray="2 6"/>
        <text x="8" y="244" className="map-axis">equator</text>
        {Object.entries(LANDMASS).map(([name, m]) => {
          const on = set.has(name);
          return (
            <g key={name} className={"land" + (on ? " on" : "")}>
              <path d={m.d} fill={on ? "var(--mangosteen)" : "var(--paper-2)"}
                stroke={on ? "var(--mangosteen)" : "var(--ink-faint)"}
                strokeWidth="1" fillOpacity={on ? 0.16 : 0.7} />
              <text x={m.lx} y={m.ly} className={"map-label" + (on ? " on" : "")} textAnchor="middle">{m.label}</text>
            </g>
          );
        })}
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r="3.4" className="occ-dot" />
        ))}
      </svg>
      <div className="rangemap-legend mono">
        <span><span className="lg-swatch on" /> native occurrence</span>
        <span><span className="lg-dot" /> illustrative record</span>
      </div>
    </div>
  );
};

window.RangeMap = RangeMap;
