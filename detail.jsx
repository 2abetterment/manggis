/* Manggis — Species detail treatment */

const Phenology = ({ pheno }) => {
  const M = window.GARCINIA.MONTHS;
  if (!pheno) return <div className="pheno-empty mono">Phenological data not yet recorded.</div>;
  return (
    <div className="pheno">
      <div className="pheno-grid">
        {M.map((m, i) => {
          const mo = i + 1;
          const fl = pheno.flower?.includes(mo);
          const fr = pheno.fruit?.includes(mo);
          return (
            <div key={i} className="pheno-col">
              <div className="pheno-bars">
                <span className={"pheno-bar fl" + (fl ? " on" : "")} />
                <span className={"pheno-bar fr" + (fr ? " on" : "")} />
              </div>
              <span className="pheno-m mono">{m}</span>
            </div>
          );
        })}
      </div>
      <div className="pheno-key mono">
        <span><span className="pk fl" /> flowering</span>
        <span><span className="pk fr" /> fruiting</span>
      </div>
    </div>
  );
};

const KeyFact = ({ icon, label, children }) => (
  <div className="keyfact">
    <span className="keyfact-ic"><Icon name={icon} size={17} /></span>
    <div>
      <Label>{label}</Label>
      <div className="keyfact-val">{children}</div>
    </div>
  </div>
);

/* Gallery image categories with labelled slots */
const GALLERY = [
  { id: "g-herb-1", cat: "Herbarium", label: "Type sheet — holotype" },
  { id: "g-herb-2", cat: "Herbarium", label: "Voucher, fruiting" },
  { id: "g-herb-3", cat: "Herbarium", label: "Voucher, flowering" },
  { id: "g-live-1", cat: "Living collection", label: "Mature tree, habit" },
  { id: "g-live-2", cat: "Living collection", label: "Foliage & branching" },
  { id: "g-field-1", cat: "Field", label: "Flower, close-up" },
  { id: "g-field-2", cat: "Field", label: "Fruit on branch" },
  { id: "g-field-3", cat: "Field", label: "Fruit in section" }
];

const Detail = ({ sp, go, back, openSpecies, t }) => {
  const G = window.GARCINIA;
  const [tab, setTab] = React.useState("overview");
  const [herbFilter, setHerbFilter] = React.useState(null);
  const [lightbox, setLightbox] = React.useState(null); // index into GALLERY
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "description", label: "Description" },
    { id: "gallery", label: "Images" },
    { id: "distribution", label: "Distribution" },
    { id: "specimens", label: "Specimens" },
    { id: "literature", label: "Literature" }
  ];
  React.useEffect(() => { setTab("overview"); setHerbFilter(null); setLightbox(null); window.scrollTo(0,0); }, [sp.id]);

  // keyboard nav for lightbox
  React.useEffect(() => {
    if (lightbox === null) return;
    const h = (e) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox(i => (i + 1) % GALLERY.length);
      if (e.key === "ArrowLeft") setLightbox(i => (i - 1 + GALLERY.length) % GALLERY.length);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [lightbox]);

  const specimens = herbFilter ? sp.specimens?.filter(s => s.herbarium === herbFilter) : sp.specimens;
  const usedHerbaria = [...new Set((sp.specimens || []).map(s => s.herbarium))];
  const related = G.SPECIES.filter(s => s.section === sp.section && s.id !== sp.id).slice(0, 4);

  return (
    <div className="page detail">
      {/* breadcrumb */}
      <div className="crumb mono">
        <button onClick={() => go("home")}>My Manggis</button><span>/</span>
        <button onClick={() => go("browse")}>{G.GENUS}</button><span>/</span>
        <button onClick={() => go("browse", { section: sp.section })}>sect. {sp.section}</button><span>/</span>
        <span className="crumb-here"><i>{sp.epithet}</i></span>
      </div>

      {/* ===== HEADER ===== */}
      <header className="sp-header">
        <div className="sp-header-main">
          <div className="sp-rank mono">SPECIES · {G.FAMILY} · sect. {sp.section}</div>
          <h1 className="sp-name"><SciName sp={sp} size="clamp(36px,5vw,68px)" /></h1>
          <div className="sp-published mono">{sp.published}</div>
          <div className="sp-common">{sp.common.join(" · ")}</div>
          {sp.synonyms?.length > 0 && (
            <div className="sp-syn">
              <Label>Synonymy</Label>
              <ul>{sp.synonyms.map((s, i) => <li key={i}>≡ <i>{s.replace(/ ([A-Z].*)$/, "")}</i> <span className="syn-auth">{(s.match(/ ([A-Z].*)$/)||[])[1]||""}</span></li>)}</ul>
            </div>
          )}
        </div>
        <aside className="sp-header-side">
          <div className="sp-status-card">
            <Label>IUCN Red List</Label>
            <StatusChip code={sp.status} full size="lg" />
            <div className="sp-status-year mono">assessed {sp.statusYear}</div>
          </div>
          <div className="sp-actions">
            <button onClick={() => setTab("specimens")}><Icon name="specimen" size={15}/> {sp.specimens?.length || 0} specimens</button>
            <button onClick={() => setTab("gallery")}><Icon name="leaf" size={15}/> Image gallery</button>
          </div>
        </aside>
      </header>

      {/* ===== TABS ===== */}
      <div className="tabs">
        {tabs.map(tb => (
          <button key={tb.id} className={"tab" + (tab === tb.id ? " active" : "")} onClick={() => setTab(tb.id)}>
            {tb.label}
            {tb.id === "specimens" && <span className="tab-n mono">{sp.specimens?.length||0}</span>}
            {tb.id === "literature" && sp.references && <span className="tab-n mono">{sp.references.length}</span>}
          </button>
        ))}
      </div>

      <div className="tab-body">
        {/* ---- OVERVIEW ---- */}
        {tab === "overview" && (
          <div className="ov">
            <div className="ov-main">
              <p className="ov-diag">{sp.diagnosis}</p>
              <div className="keyfacts">
                <KeyFact icon="leaf" label="Habit">{sp.habit}, {sp.height}</KeyFact>
                <KeyFact icon="ruler" label="Elevation">{sp.elevation}</KeyFact>
                <KeyFact icon="globe" label="Native range">{sp.regions.join(", ")}</KeyFact>
                {sp.etymology && <KeyFact icon="book" label="Etymology">{sp.etymology}</KeyFact>}
              </div>
              {sp.uses && (<div className="ov-block">
                <Label>Common names &amp; uses</Label>
                <p>{sp.uses}</p>
              </div>)}
              {sp.nativeNote && (<div className="ov-block">
                <Label>Distribution note</Label>
                <p>{sp.nativeNote}</p>
              </div>)}
            </div>
            <aside className="ov-side">
              <div className="ov-card">
                <Label>Phenology</Label>
                <Phenology pheno={sp.phenology} />
              </div>
              {sp.typeSpecimen && (<div className="ov-card">
                <Label>Type</Label>
                <p className="type-cite mono">{sp.typeSpecimen}</p>
              </div>)}
              <div className="ov-card">
                <Label>At a glance</Label>
                <dl className="glance">
                  <dt>Accepted name</dt><dd><SciName sp={sp} /></dd>
                  <dt>Family</dt><dd>{G.FAMILY}</dd>
                  <dt>Section</dt><dd><i>{sp.section}</i></dd>
                  <dt>Specimens</dt><dd>{sp.specimens?.length || 0} linked</dd>
                </dl>
              </div>
            </aside>
          </div>
        )}

        {/* ---- DESCRIPTION ---- */}
        {tab === "description" && (
          <div className="desc">
            {sp.morphology ? (
              <table className="morph">
                <tbody>
                  {Object.entries(sp.morphology).map(([k, v]) => (
                    <tr key={k}><th>{k}</th><td>{v}</td></tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="ov-diag">{sp.diagnosis}</p>
            )}
            <p className="desc-note mono">Morphological description after published revisions; terminology follows the standard glossary of descriptive botany.</p>
          </div>
        )}

        {/* ---- GALLERY ---- */}
        {tab === "gallery" && (
          <div className="gallery">
            {["Herbarium", "Living collection", "Field"].map(cat => (
              <div key={cat} className="gal-group">
                <Label>{cat === "Herbarium" ? "Herbarium specimens" : cat === "Living collection" ? "Living collection" : "Field photographs"}</Label>
                <div className="gal-grid">
                  {GALLERY.filter(g => g.cat === cat).map((g) => {
                    const idx = GALLERY.indexOf(g);
                    return (
                      <figure key={g.id} className={"gal-item " + cat.toLowerCase().split(" ")[0]} onClick={() => setLightbox(idx)}>
                        <image-slot id={sp.id + "-" + g.id} shape="rect"
                          placeholder={cat === "Herbarium" ? "Drop specimen scan" : "Drop photo"}
                          style={{ width: "100%", height: "100%" }}></image-slot>
                        <figcaption><span className="mono">{cat === "Herbarium" ? "SHEET" : "PHOTO"}</span> {g.label}</figcaption>
                      </figure>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ---- DISTRIBUTION ---- */}
        {tab === "distribution" && (
          <div className="dist">
            <div className="dist-map"><RangeMap regions={sp.regions} /></div>
            <aside className="dist-side">
              <div className="ov-card">
                <Label>Native to</Label>
                <div className="region-chips">
                  {G.REGIONS.map(r => (
                    <span key={r} className={"region-chip" + (sp.regions.includes(r) ? " on" : "")}>{r}</span>
                  ))}
                </div>
              </div>
              <div className="ov-card">
                <Label>Biogeography</Label>
                <p>{sp.nativeNote}</p>
              </div>
              <div className="ov-card">
                <Label>Elevation</Label>
                <p className="mono">{sp.elevation}</p>
              </div>
            </aside>
          </div>
        )}

        {/* ---- SPECIMENS ---- */}
        {tab === "specimens" && (
          <div className="spec">
            {sp.specimens?.length ? (<>
              <div className="spec-herbfilter">
                <Label>Filter by herbarium</Label>
                <div className="herbtag-row">
                  <button className={"herb-tag" + (!herbFilter ? " active" : "")} onClick={() => setHerbFilter(null)}>All</button>
                  {usedHerbaria.map(c => <HerbTag key={c} code={c} active={herbFilter === c} onClick={() => setHerbFilter(herbFilter === c ? null : c)} />)}
                </div>
              </div>
              <table className="spec-table">
                <thead><tr>
                  <th>Collector &amp; number</th><th>Date</th><th>Locality</th><th>Herbarium</th><th>Barcode</th><th></th>
                </tr></thead>
                <tbody>
                  {specimens.map((s, i) => (
                    <tr key={i} className={s.type ? "is-type" : ""}>
                      <td className="sc-coll"><i>{s.collector}</i> <b className="mono">{s.number}</b>{s.type && <span className="type-badge">{s.type}</span>}</td>
                      <td className="mono">{s.year}</td>
                      <td>{s.country}<span className="sc-loc">{s.locality}</span></td>
                      <td><span className="herb-code sm">{s.herbarium}</span></td>
                      <td className="mono sc-bar">{s.barcode}</td>
                      <td><a className="sc-link" href={catUrl(s.herbarium, sp)} target="_blank" rel="noopener" title={`View in ${G.HERBARIA[s.herbarium]?.name || s.herbarium} catalogue`}><Icon name="ext" size={14}/></a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="desc-note mono">Specimen records link out to the holding institution&rsquo;s online catalogue and to aggregated occurrence data (GBIF).</p>
              <div className="spec-links">
                <a href={gbifOccUrl(sp)} target="_blank" rel="noopener"><Icon name="globe" size={14}/> All occurrences on GBIF</a>
                <a href={powoUrl(sp)} target="_blank" rel="noopener"><Icon name="leaf" size={14}/> Accepted name on POWO</a>
              </div>
            </>) : <div className="pheno-empty mono">No specimens linked yet for this name.</div>}
          </div>
        )}

        {/* ---- LITERATURE ---- */}
        {tab === "literature" && (
          <div className="lit-tab">
            {sp.references?.length ? (
              <ol className="ref-list">
                {sp.references.map((r, i) => (
                  <li key={i} className="ref">
                    <span className="ref-year mono">{r.year}</span>
                    <div className="ref-body">
                      <span className="ref-authors">{r.authors}</span>{" "}
                      <span className="ref-title">{r.title}.</span>{" "}
                      <span className="ref-source"><i>{r.source}</i>.</span>
                      {r.note && <span className="ref-note mono"> [{r.note}]</span>}
                    </div>
                    <a className="ref-link" href={scholarUrl(r)} target="_blank" rel="noopener"><Icon name="ext" size={14}/></a>
                  </li>
                ))}
              </ol>
            ) : <div className="pheno-empty mono">No references compiled yet.</div>}
          </div>
        )}
      </div>

      {/* ===== RELATED ===== */}
      {related.length > 0 && (
        <section className="related">
          <div className="section-head"><Label>Others in sect. {sp.section}</Label></div>
          <div className="related-row">
            {related.map(r => (
              <button key={r.id} className="related-card" onClick={() => openSpecies(r.id)}>
                <div className="related-img"><image-slot id={"rel-" + r.id} shape="rect" placeholder="" style={{width:"100%",height:"100%"}}></image-slot></div>
                <div className="related-name"><SciName sp={r} /></div>
                <StatusChip code={r.status} />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ===== LIGHTBOX ===== */}
      {lightbox !== null && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lb-close" onClick={() => setLightbox(null)}><Icon name="close" size={22}/></button>
          <button className="lb-nav prev" onClick={(e)=>{e.stopPropagation();setLightbox(i => (i - 1 + GALLERY.length) % GALLERY.length);}}><Icon name="chevron" size={26} style={{transform:"rotate(180deg)"}}/></button>
          <figure className="lb-figure" onClick={(e)=>e.stopPropagation()}>
            <image-slot id={sp.id + "-" + GALLERY[lightbox].id + "-lb"} shape="rect"
              placeholder="Drop image — appears here and in the gallery"
              style={{ width: "100%", height: "100%" }}></image-slot>
            <figcaption><span className="mono">{GALLERY[lightbox].cat.toUpperCase()}</span> {GALLERY[lightbox].label} · <SciName sp={sp} /></figcaption>
          </figure>
          <button className="lb-nav next" onClick={(e)=>{e.stopPropagation();setLightbox(i => (i + 1) % GALLERY.length);}}><Icon name="chevron" size={26}/></button>
        </div>
      )}
    </div>
  );
};

window.Detail = Detail;
