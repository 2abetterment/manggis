/* Manggis — shared UI: icons, wordmark, chips, nav, footer */

/* ---- External catalogue link helpers ---- */
const sciQuery = (sp, genus = "Garcinia") => encodeURIComponent(`${genus} ${sp.epithet}`);
const gbifUrl = (sp) => `https://www.gbif.org/species/search?q=${sciQuery(sp)}`;
const gbifOccUrl = (sp) => `https://www.gbif.org/occurrence/search?q=${sciQuery(sp)}`;
const powoUrl = (sp) => `https://powo.science.kew.org/results?q=${sciQuery(sp)}`;
const catUrl = (herbCode, sp) => {
  const h = window.GARCINIA.HERBARIA[herbCode];
  return h && h.cat ? h.cat(sciQuery(sp)) : gbifOccUrl(sp);
};
const scholarUrl = (ref) => `https://scholar.google.com/scholar?q=${encodeURIComponent(ref.title + " " + (ref.authors||""))}`;

/* ---- Icon set: hairline botanical-ink style ---- */
const Icon = ({ name, size = 18, stroke = 1.5, style }) => {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round",
    strokeLinejoin: "round", style };
  switch (name) {
    case "search":   return <svg {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>;
    case "leaf":     return <svg {...p}><path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 16-9 0 9-4 16-9 16Z"/><path d="M7 17C9 13 13 9 18 7"/></svg>;
    case "pin":      return <svg {...p}><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z"/><circle cx="12" cy="10" r="2.4"/></svg>;
    case "book":     return <svg {...p}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5Z"/><path d="M4 5.5v15"/></svg>;
    case "grid":     return <svg {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
    case "list":     return <svg {...p}><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/></svg>;
    case "chevron":  return <svg {...p}><path d="M9 6l6 6-6 6"/></svg>;
    case "down":     return <svg {...p}><path d="M6 9l6 6 6-6"/></svg>;
    case "ext":      return <svg {...p}><path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v4.5A1.5 1.5 0 0 1 16.5 20h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10"/></svg>;
    case "close":    return <svg {...p}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case "arrow":    return <svg {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case "specimen": return <svg {...p}><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M12 7v10M12 7c-2 1.5-3 3-3 3M12 7c2 1.5 3 3 3 3M12 12c-1.5 1-2.5 2-2.5 2M12 12c1.5 1 2.5 2 2.5 2"/></svg>;
    case "globe":    return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 2.6 15.4 0 18M12 3c-2.6 2.6-2.6 15.4 0 18"/></svg>;
    case "shield":   return <svg {...p}><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6Z"/></svg>;
    case "ruler":    return <svg {...p}><rect x="3" y="8" width="18" height="8" rx="1"/><path d="M7 8v3M11 8v4M15 8v3M19 8v4"/></svg>;
    case "calendar": return <svg {...p}><rect x="3" y="5" width="18" height="16" rx="1.5"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>;
    case "sparkle":  return <svg {...p}><path d="M12 3l1.8 5.6L19 10l-5.2 1.4L12 17l-1.8-5.6L5 10l5.2-1.4Z"/></svg>;
    case "filter":   return <svg {...p}><path d="M3 5h18M6 12h12M10 19h4"/></svg>;
    default:         return null;
  }
};

/* ---- Mangosteen seal mark ---- */
const Seal = ({ size = 34 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <circle cx="24" cy="24" r="22.5" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
    <circle cx="24" cy="25" r="13" fill="var(--mangosteen)"/>
    {/* calyx */}
    <g fill="var(--forest)">
      <path d="M24 9c2 2.5 2 5 0 7-2-2-2-4.5 0-7Z"/>
      <path d="M17 11c2.7 1.3 3.7 3.5 3 6.3-2.7-1.3-3.7-3.5-3-6.3Z"/>
      <path d="M31 11c-.7 2.8-1.7 5-4.4 6.3.7-2.8 1.7-5 4.4-6.3Z"/>
    </g>
    {/* stigma rosette */}
    <g stroke="var(--flesh)" strokeWidth="1.4" strokeLinecap="round" opacity="0.92">
      <path d="M24 25v-5M24 25v5M24 25h5M24 25h-5M24 25l3.5-3.5M24 25l-3.5 3.5M24 25l3.5 3.5M24 25l-3.5-3.5"/>
    </g>
    <circle cx="24" cy="25" r="1.7" fill="var(--flesh)"/>
  </svg>
);

/* ---- Wordmark ---- */
const Wordmark = ({ onClick, compact }) => (
  <button className="wordmark" onClick={onClick} aria-label="My Manggis home">
    <span className="wordmark-seal" style={{ color: "var(--ink-soft)" }}><Seal size={compact ? 30 : 38} /></span>
    <span className="wordmark-text">
      <span className="wordmark-name">My Manggis</span>
      {!compact && <span className="wordmark-sub">Garcinia&nbsp;·&nbsp;a world taxonomic database</span>}
    </span>
  </button>
);

/* ---- Botanical name renderer (italic genus + epithet, roman author) ---- */
const SciName = ({ sp, genus = "Garcinia", abbrev = false, author = true, size }) => (
  <span className="sciname" style={size ? { fontSize: size } : null}>
    <i>{abbrev ? "G." : genus} {sp.epithet}</i>{author && sp.author ? <span className="author"> {sp.author}</span> : null}
  </span>
);

/* ---- IUCN conservation chip ---- */
const StatusChip = ({ code, full = false, size = "md" }) => {
  const s = window.GARCINIA.IUCN[code] || window.GARCINIA.IUCN.NE;
  return (
    <span className={`status-chip ${size}`} title={s.label}>
      <span className="status-dot" style={{ background: s.color }} />
      <b style={{ color: s.color }}>{s.code}</b>
      {full && <span className="status-label">{s.label}</span>}
    </span>
  );
};

/* ---- Herbarium code tag ---- */
const HerbTag = ({ code, onClick, active }) => {
  const h = window.GARCINIA.HERBARIA[code];
  return (
    <button className={"herb-tag" + (active ? " active" : "")} onClick={onClick}
      title={h ? `${h.name} — ${h.city}` : code}>{code}</button>
  );
};

/* ---- Section label (small-caps specimen-label microtype) ---- */
const Label = ({ children, style }) => <div className="ui-label" style={style}>{children}</div>;

/* ---- Primary navigation ---- */
const TopNav = ({ view, go, query, setQuery }) => {
  const items = [
    { id: "home", label: "Home" },
    { id: "browse", label: "Browse species" },
    { id: "herbaria", label: "Herbaria" },
    { id: "literature", label: "Literature" }
  ];
  return (
    <header className="topnav">
      <Wordmark compact onClick={() => go("home")} />
      <nav className="topnav-links">
        {items.map(it => (
          <button key={it.id}
            className={"navlink" + (view === it.id ? " active" : "")}
            onClick={() => go(it.id)}>
            {it.label}
          </button>
        ))}
      </nav>
      <button className="nav-search" onClick={() => go("browse")}>
        <Icon name="search" size={16} />
        <span>Search the database</span>
        <kbd>/</kbd>
      </button>
    </header>
  );
};

/* ---- Footer ---- */
const Footer = ({ go }) => {
  const G = window.GARCINIA;
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <span style={{ color: "var(--flesh)" }}><Seal size={40} /></span>
          <div>
            <div className="footer-name">My Manggis</div>
            <div className="footer-tag">A world taxonomic database for the genus <i>Garcinia</i> (Clusiaceae) — linking accepted names, herbarium specimens, living collections and the published literature.</div>
          </div>
        </div>
        <div className="footer-cols">
          <div className="footer-col">
            <Label>Database</Label>
            <button onClick={() => go("browse")}>Browse species</button>
            <button onClick={() => go("browse", { facet: "status" })}>Conservation</button>
            <button onClick={() => go("browse", { facet: "region" })}>Distribution</button>
            <button onClick={() => go("literature")}>Literature</button>
          </div>
          <div className="footer-col">
            <Label>Herbaria</Label>
            {Object.keys(G.HERBARIA).slice(0,5).map(c => (
              <button key={c} onClick={() => go("herbaria")}>{c} — {G.HERBARIA[c].city.split(",")[0]}</button>
            ))}
            <button onClick={() => go("herbaria")}>All collections →</button>
          </div>
          <div className="footer-col">
            <Label>About</Label>
            <button onClick={() => go("home")}>The project</button>
            <a href="https://www.gbif.org" target="_blank" rel="noopener">Data sources</a>
            <button onClick={() => go("home")}>Contribute records</button>
          </div>
        </div>
      </div>
      <div className="footer-rule" />
      <div className="footer-fine">
        <span>© {new Date().getFullYear()} My Manggis. Nomenclature follows published treatments; occurrence &amp; conservation figures shown here are illustrative.</span>
        <span className="mono">CC&nbsp;BY&nbsp;4.0 · data via GBIF · POWO · IUCN</span>
      </div>
    </footer>
  );
};

Object.assign(window, { Icon, Seal, Wordmark, SciName, StatusChip, HerbTag, Label, TopNav, Footer,
  gbifUrl, gbifOccUrl, powoUrl, catUrl, scholarUrl, sciQuery });
