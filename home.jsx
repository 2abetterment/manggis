/* Manggis — Landing / database home */

const Stat = ({ n, label, sub }) => (
  <div className="stat">
    <div className="stat-n">{n}</div>
    <div className="stat-label">{label}</div>
    {sub && <div className="stat-sub">{sub}</div>}
  </div>
);

const Home = ({ go, openSpecies, t }) => {
  const G = window.GARCINIA;
  const hero = t.heroLayout || "plate";
  const featured = G.SPECIES.find(s => s.featured);
  const [q, setQ] = React.useState("");
  const submit = (e) => { e.preventDefault(); go("browse", { q }); };

  return (
    <div className="page home">
      {/* ===== HERO ===== */}
      <section className={"hero hero-" + hero}>
        <div className="hero-copy">
          <div className="hero-kicker">
            <span className="rule-tick" />
            <span className="mono">Clusiaceae · Guttiferae</span>
          </div>
          <h1 className="hero-title">
            The genus <em>Garcinia</em>,<br/>specimen by specimen.
          </h1>
          <p className="hero-lede">
            A living taxonomic monograph — accepted names and synonymy, morphological
            descriptions, conservation assessments and distribution, each entry linked to
            type and voucher specimens held in the world&rsquo;s major herbaria.
          </p>
          <form className="hero-search" onSubmit={submit}>
            <Icon name="search" size={20} />
            <input value={q} onChange={e => setQ(e.target.value)}
              placeholder="Search a species, synonym, collector or herbarium code…" />
            <button type="submit">Search<Icon name="arrow" size={16} /></button>
          </form>
          <div className="hero-suggest">
            <span className="mono">Try</span>
            {["mangostana", "asam gelugor", "sect. Brindonia", "Kew (K)"].map(x => (
              <button key={x} onClick={() => go("browse", { q: x })}>{x}</button>
            ))}
          </div>
        </div>

        <div className="hero-plate">
          <figure className="plate">
            <image-slot id="hero-plate" class="plate-slot"
              shape="rect" placeholder="Drop a botanical plate / fruit photo"
              style={{ width: "100%", height: "100%" }}></image-slot>
            <div className="plate-corner tl" /><div className="plate-corner tr" />
            <div className="plate-corner bl" /><div className="plate-corner br" />
            <figcaption className="plate-cap">
              <span className="mono">PLATE I</span>
              <SciName sp={featured} /> — habit, flower &amp; fruit in section
            </figcaption>
          </figure>
          <div className="plate-note mono">Tab. ad nat. del. · drop your own image</div>
        </div>
      </section>

      {/* ===== STATS BAND ===== */}
      <section className="stats-band">
        <Stat n={G.stats.species} label="Species treated" sub={`of ~${G.stats.acceptedGlobal} accepted worldwide`} />
        <Stat n={G.stats.specimens.toLocaleString()} label="Linked specimens" sub="types & vouchers" />
        <Stat n={G.stats.herbaria} label="Partner herbaria" sub="across 3 continents" />
        <Stat n={G.stats.countries} label="Countries" sub="of native occurrence" />
      </section>

      {/* ===== FEATURED SPECIES ===== */}
      <section className="featured">
        <div className="section-head">
          <Label>Featured treatment</Label>
          <h2>The queen of fruits</h2>
        </div>
        <article className="feature-card" onClick={() => openSpecies(featured.id)}>
          <div className="feature-img">
            <image-slot id="feat-mangostana" shape="rect"
              placeholder="Drop a mangosteen image"
              style={{ width: "100%", height: "100%" }}></image-slot>
            <span className="feature-status"><StatusChip code={featured.status} full /></span>
          </div>
          <div className="feature-body">
            <div className="feature-rank mono">SPECIES · sect. {featured.section}</div>
            <h3 className="feature-name"><SciName sp={featured} size="clamp(30px,3.4vw,48px)" /></h3>
            <div className="feature-common">{featured.common.join(" · ")}</div>
            <p className="feature-diag">{featured.diagnosis}</p>
            <div className="feature-meta">
              <span><Icon name="leaf" size={15} /> {featured.habit}, {featured.height}</span>
              <span><Icon name="globe" size={15} /> {featured.regions.length} regions</span>
              <span><Icon name="specimen" size={15} /> {featured.specimens.length} linked specimens</span>
            </div>
            <span className="feature-go">Open full treatment <Icon name="arrow" size={16} /></span>
          </div>
        </article>
      </section>

      {/* ===== EXPLORE BY ===== */}
      <section className="explore">
        <div className="section-head">
          <Label>Ways in</Label>
          <h2>Explore the database</h2>
        </div>
        <div className="explore-grid">
          <button className="explore-tile" onClick={() => go("browse", { facet: "section" })}>
            <Icon name="leaf" size={26} />
            <h4>By taxonomic section</h4>
            <p>Six sections of <i>Garcinia</i> — from the true mangosteens to the sour <i>Brindonia</i>.</p>
            <span className="tile-go mono">{G.SECTIONS.length} sections <Icon name="chevron" size={14} /></span>
          </button>
          <button className="explore-tile" onClick={() => go("browse", { facet: "status" })}>
            <Icon name="shield" size={26} />
            <h4>By conservation status</h4>
            <p>IUCN Red List assessments, from Least Concern to Endangered and Data Deficient.</p>
            <span className="tile-go mono">IUCN categories <Icon name="chevron" size={14} /></span>
          </button>
          <button className="explore-tile" onClick={() => go("browse", { facet: "region" })}>
            <Icon name="globe" size={26} />
            <h4>By distribution</h4>
            <p>Native ranges across Malesia, mainland Asia and the Western Ghats.</p>
            <span className="tile-go mono">{G.REGIONS.length} regions <Icon name="chevron" size={14} /></span>
          </button>
          <button className="explore-tile" onClick={() => go("browse")}>
            <Icon name="specimen" size={26} />
            <h4>By specimen</h4>
            <p>Search type and voucher specimens by collector, number, locality or barcode.</p>
            <span className="tile-go mono">{G.stats.specimens.toLocaleString()} records <Icon name="chevron" size={14} /></span>
          </button>
        </div>
      </section>

      {/* ===== PARTNER HERBARIA ===== */}
      <section className="herbaria">
        <div className="section-head">
          <Label>Specimen network</Label>
          <h2>Linked to the world&rsquo;s herbaria</h2>
          <p className="section-lede">Every name resolves to physical specimens held across eight collaborating institutions, with deep links to their online catalogues.</p>
        </div>
        <div className="herb-grid">
          {Object.values(G.HERBARIA).map(h => (
            <button key={h.code} className="herb-row" onClick={() => go("herbaria")}>
              <span className="herb-code">{h.code}</span>
              <span className="herb-info">
                <span className="herb-name">{h.name}</span>
                <span className="herb-city mono">{h.city}</span>
              </span>
              <span className="herb-count mono">{h.specimens}</span>
              <Icon name="ext" size={15} />
            </button>
          ))}
        </div>
      </section>

      {/* ===== LITERATURE SHELF ===== */}
      <section className="lit">
        <div className="section-head">
          <Label>From the literature</Label>
          <h2>A curated bibliography</h2>
        </div>
        <div className="lit-grid">
          {G.LITERATURE.slice(0, 6).map((j, i) => (
            <article key={i} className="lit-card" onClick={() => go("literature")}>
              <div className="lit-tag mono">{j.tag}</div>
              <h4 className="lit-title">{j.title}</h4>
              <div className="lit-meta">
                <span>{j.authors}</span>
                <span className="lit-journal"><i>{j.journal}</i> · {j.vol} · {j.year}</span>
              </div>
            </article>
          ))}
        </div>
        <button className="section-more" onClick={() => go("literature")}>View the full bibliography <Icon name="arrow" size={16} /></button>
      </section>
    </div>
  );
};

window.Home = Home;
