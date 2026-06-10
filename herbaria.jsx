/* My Manggis — Herbaria index */

const Herbaria = ({ go, openSpecies, t }) => {
  const G = window.GARCINIA;
  const list = Object.values(G.HERBARIA);
  const maxSpec = Math.max(...list.map(h => h.specimens));

  // count in-database Garcinia records per herbarium
  const dbStats = React.useMemo(() => {
    const m = {};
    G.SPECIES.forEach(sp => (sp.specimens || []).forEach(s => {
      m[s.herbarium] = m[s.herbarium] || { records: 0, species: new Set() };
      m[s.herbarium].records++; m[s.herbarium].species.add(sp.id);
    }));
    return m;
  }, []);

  const totalSpec = list.reduce((a, h) => a + h.specimens, 0);
  const countries = [...new Set(list.map(h => h.country))];

  return (
    <div className="page herbpage">
      <header className="page-head">
        <Label>Specimen network</Label>
        <h1 className="page-title">Partner herbaria</h1>
        <p className="page-lede">Every accepted name in <i>My Manggis</i> resolves to physical specimens — types and vouchers — held across {list.length} collaborating institutions on three continents. Each record deep-links to the holding herbarium&rsquo;s online catalogue and to aggregated occurrence data on GBIF.</p>
        <div className="head-stats mono">
          <span><b>{list.length}</b> institutions</span><span className="dot">·</span>
          <span><b>{totalSpec.toLocaleString()}</b> Garcinia specimens</span><span className="dot">·</span>
          <span><b>{countries.length}</b> countries</span>
        </div>
      </header>

      <div className="herb-cards">
        {list.map(h => {
          const db = dbStats[h.code];
          return (
            <article key={h.code} className="herbcard">
              <div className="herbcard-seal">{h.code}</div>
              <div className="herbcard-body">
                <h3 className="herbcard-name">{h.name}</h3>
                <div className="herbcard-meta mono">
                  <span><Icon name="pin" size={13} /> {h.city}</span>
                  <span>est. {h.founded}</span>
                </div>
                <div className="herbcard-bar">
                  <div className="herbcard-bar-fill" style={{ width: (h.specimens / maxSpec * 100) + "%" }} />
                </div>
                <div className="herbcard-stats">
                  <div><span className="hc-n">{h.specimens}</span><span className="hc-l mono">Garcinia sheets</span></div>
                  <div><span className="hc-n">{db ? db.species.size : 0}</span><span className="hc-l mono">species in db</span></div>
                  <div><span className="hc-n">{db ? db.records : 0}</span><span className="hc-l mono">linked records</span></div>
                </div>
                <div className="herbcard-actions">
                  <a href={h.url} target="_blank" rel="noopener" className="hc-btn primary"><Icon name="globe" size={14} /> Visit collection</a>
                  <a href={h.cat(encodeURIComponent("Garcinia"))} target="_blank" rel="noopener" className="hc-btn"><Icon name="search" size={14} /> Search Garcinia <Icon name="ext" size={12} /></a>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <section className="herb-howto">
        <div className="section-head"><Label>How linking works</Label><h2>From name to physical sheet</h2></div>
        <div className="howto-steps">
          {[
            { n: "01", h: "Accepted name", p: "Each treatment fixes one accepted name with its author, place of publication and synonymy." },
            { n: "02", h: "Voucher specimens", p: "Type and voucher specimens are cited by collector, number, date and locality — the evidence behind the name." },
            { n: "03", h: "Herbarium catalogue", p: "Every record resolves to the holding institution&rsquo;s online catalogue via its Index Herbariorum code." },
            { n: "04", h: "Aggregated occurrence", p: "Records roll up into GBIF and POWO so distributions can be mapped and audited." }
          ].map(s => (
            <div key={s.n} className="howto-step">
              <span className="howto-n mono">{s.n}</span>
              <h4 dangerouslySetInnerHTML={{ __html: s.h }} />
              <p dangerouslySetInnerHTML={{ __html: s.p }} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

window.Herbaria = Herbaria;
