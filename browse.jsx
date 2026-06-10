/* Manggis — Species browse & search index */

const SpeciesCard = ({ sp, openSpecies, view }) => {
  const G = window.GARCINIA;
  if (view === "list") {
    return (
      <button className="sp-row" onClick={() => openSpecies(sp.id)}>
        <span className="sp-row-thumb">
          <image-slot id={"thumb-" + sp.id} shape="rect"
            placeholder="" style={{ width: "100%", height: "100%" }}></image-slot>
        </span>
        <span className="sp-row-name">
          <SciName sp={sp} />
          <span className="sp-row-common">{sp.common.slice(0,2).join(" · ")}</span>
        </span>
        <span className="sp-row-section mono">sect. {sp.section}</span>
        <span className="sp-row-region">{sp.regions[0]}{sp.regions.length>1?` +${sp.regions.length-1}`:""}</span>
        <StatusChip code={sp.status} />
        <Icon name="chevron" size={16} style={{ color: "var(--ink-faint)" }} />
      </button>
    );
  }
  return (
    <button className="sp-card" onClick={() => openSpecies(sp.id)}>
      <div className="sp-card-img">
        <image-slot id={"thumb-" + sp.id} shape="rect"
          placeholder="Drop image" style={{ width: "100%", height: "100%" }}></image-slot>
        <span className="sp-card-status"><StatusChip code={sp.status} /></span>
        <span className="sp-card-sect mono">sect. {sp.section}</span>
      </div>
      <div className="sp-card-body">
        <h3 className="sp-card-name"><SciName sp={sp} /></h3>
        <div className="sp-card-common">{sp.common.slice(0,2).join(" · ")}</div>
        <p className="sp-card-diag">{sp.diagnosis}</p>
        <div className="sp-card-foot mono">
          <span>{sp.habit}</span>
          <span>{sp.regions.length} {sp.regions.length===1?"region":"regions"}</span>
        </div>
      </div>
    </button>
  );
};

const FacetGroup = ({ title, options, value, onToggle, render }) => (
  <div className="facet">
    <Label>{title}</Label>
    <div className="facet-opts">
      {options.map(o => {
        const active = value.includes(o);
        return (
          <button key={o} className={"facet-opt" + (active ? " active" : "")} onClick={() => onToggle(o)}>
            <span className="facet-box">{active && <Icon name="close" size={11} stroke={2.4} />}</span>
            {render ? render(o) : o}
          </button>
        );
      })}
    </div>
  </div>
);

const Browse = ({ go, openSpecies, initial, t }) => {
  const G = window.GARCINIA;
  const [q, setQ] = React.useState(initial?.q || "");
  const [view, setView] = React.useState(t.browseView || "grid");
  const [sort, setSort] = React.useState("az");
  const [sections, setSections] = React.useState([]);
  const [statuses, setStatuses] = React.useState([]);
  const [regions, setRegions] = React.useState([]);
  const [showFilters, setShowFilters] = React.useState(true);

  React.useEffect(() => { if (initial?.q != null) setQ(initial.q); }, [initial]);

  const toggle = (setter, arr) => (v) => setter(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);

  const results = React.useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = G.SPECIES.filter(sp => {
      if (sections.length && !sections.includes(sp.section)) return false;
      if (statuses.length && !statuses.includes(sp.status)) return false;
      if (regions.length && !sp.regions.some(r => regions.includes(r))) return false;
      if (term) {
        const hay = [sp.epithet, "garcinia " + sp.epithet, sp.author, sp.section,
          ...(sp.common||[]), ...(sp.synonyms||[]), ...sp.regions, sp.diagnosis||""]
          .join(" ").toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
    const ranks = { CR:0, EN:1, VU:2, NT:3, LC:4, DD:5, NE:6 };
    list = [...list].sort((a,b) => {
      if (sort === "az") return a.epithet.localeCompare(b.epithet);
      if (sort === "status") return (ranks[a.status]??9) - (ranks[b.status]??9);
      if (sort === "specimens") return (b.specimens?.length||0) - (a.specimens?.length||0);
      return 0;
    });
    return list;
  }, [q, sections, statuses, regions, sort]);

  const activeCount = sections.length + statuses.length + regions.length;
  const clearAll = () => { setSections([]); setStatuses([]); setRegions([]); setQ(""); };

  return (
    <div className="page browse">
      <div className="browse-head">
        <div>
          <Label>The genus in full</Label>
          <h1 className="browse-title">Browse <i>Garcinia</i></h1>
        </div>
        <div className="browse-searchbar">
          <Icon name="search" size={18} />
          <input value={q} onChange={e => setQ(e.target.value)} autoFocus
            placeholder="Search species, synonyms, common names, regions…" />
          {q && <button className="clear-q" onClick={() => setQ("")}><Icon name="close" size={15} /></button>}
        </div>
      </div>

      <div className="browse-toolbar">
        <button className={"tool-btn" + (showFilters ? " active" : "")} onClick={() => setShowFilters(v => !v)}>
          <Icon name="filter" size={15} /> Filters{activeCount ? <span className="tool-badge">{activeCount}</span> : null}
        </button>
        <div className="result-count mono">{results.length} {results.length===1?"species":"species"}</div>
        <div className="toolbar-right">
          <div className="sort-wrap">
            <span className="mono">Sort</span>
            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="az">A–Z (epithet)</option>
              <option value="status">Conservation priority</option>
              <option value="specimens">Most specimens</option>
            </select>
          </div>
          <div className="view-toggle">
            <button className={view==="grid"?"active":""} onClick={() => setView("grid")} aria-label="Grid view"><Icon name="grid" size={16} /></button>
            <button className={view==="list"?"active":""} onClick={() => setView("list")} aria-label="List view"><Icon name="list" size={16} /></button>
          </div>
        </div>
      </div>

      <div className={"browse-body" + (showFilters ? "" : " no-filters")}>
        {showFilters && (
          <aside className="filters">
            <div className="filters-head">
              <Label>Refine</Label>
              {activeCount > 0 && <button className="clear-all" onClick={clearAll}>Clear all</button>}
            </div>
            <FacetGroup title="Taxonomic section" options={G.SECTIONS}
              value={sections} onToggle={toggle(setSections, sections)}
              render={(o) => <span>sect. <i>{o}</i></span>} />
            <FacetGroup title="Conservation status" options={["CR","EN","VU","NT","LC","DD"]}
              value={statuses} onToggle={toggle(setStatuses, statuses)}
              render={(o) => <span className="facet-status"><span className="status-dot" style={{background:G.IUCN[o].color}} />{G.IUCN[o].code} — {G.IUCN[o].label}</span>} />
            <FacetGroup title="Distribution" options={G.REGIONS}
              value={regions} onToggle={toggle(setRegions, regions)} />
          </aside>
        )}

        <div className="results-area">
          {results.length === 0 ? (
            <div className="empty">
              <Icon name="leaf" size={32} />
              <p>No species match <b>{q ? `“${q}”` : "these filters"}</b>.</p>
              <button onClick={clearAll}>Reset search</button>
            </div>
          ) : (
            <div className={view === "grid" ? "results-grid" : "results-list"}>
              {results.map(sp => <SpeciesCard key={sp.id} sp={sp} openSpecies={openSpecies} view={view} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

window.Browse = Browse;
