/* My Manggis — Literature / bibliography index */

const Literature = ({ go, t }) => {
  const G = window.GARCINIA;
  const refs = G.LITERATURE;
  const tags = [...new Set(refs.map(r => r.tag))];
  const [activeTag, setActiveTag] = React.useState(null);
  const [q, setQ] = React.useState("");
  const [sort, setSort] = React.useState("newest");

  const results = React.useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = refs.filter(r => {
      if (activeTag && r.tag !== activeTag) return false;
      if (term) {
        const hay = [r.authors, r.title, r.journal, r.tag, r.vol].join(" ").toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
    list = [...list].sort((a, b) => sort === "newest" ? b.year - a.year
      : sort === "oldest" ? a.year - b.year
      : a.authors.localeCompare(b.authors));
    return list;
  }, [q, activeTag, sort]);

  const scholar = (r) => `https://scholar.google.com/scholar?q=${encodeURIComponent(r.title + " " + r.authors)}`;
  const tagCount = (tg) => refs.filter(r => r.tag === tg).length;

  return (
    <div className="page litpage">
      <header className="page-head">
        <Label>The published record</Label>
        <h1 className="page-title">Literature &amp; references</h1>
        <p className="page-lede">A working bibliography for the genus <i>Garcinia</i> — from Linnaeus&rsquo;s 1753 protologue through modern molecular systematics, regional floras, phytochemistry and conservation assessment. Citations link out to Google&nbsp;Scholar, POWO and the original sources.</p>
      </header>

      <div className="lit-controls">
        <div className="browse-searchbar lit-search">
          <Icon name="search" size={18} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search authors, titles, journals…" />
          {q && <button className="clear-q" onClick={() => setQ("")}><Icon name="close" size={15} /></button>}
        </div>
        <div className="sort-wrap">
          <span className="mono">Sort</span>
          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="author">By author</option>
          </select>
        </div>
      </div>

      <div className="lit-tags">
        <button className={"littag" + (!activeTag ? " active" : "")} onClick={() => setActiveTag(null)}>All <span className="mono">{refs.length}</span></button>
        {tags.map(tg => (
          <button key={tg} className={"littag" + (activeTag === tg ? " active" : "")} onClick={() => setActiveTag(activeTag === tg ? null : tg)}>
            {tg} <span className="mono">{tagCount(tg)}</span>
          </button>
        ))}
      </div>

      <ol className="biblio">
        {results.map((r, i) => (
          <li key={i} className="biblio-item">
            <div className="biblio-year"><span className="by-n">{r.year}</span><span className="by-tag mono">{r.tag}</span></div>
            <div className="biblio-body">
              <div className="biblio-cite">
                <span className="biblio-authors">{r.authors}</span> ({r.year}). <span className="biblio-title">{r.title}.</span> <span className="biblio-journal"><i>{r.journal}</i> {r.vol}.</span>
                {r.note && <span className="biblio-note mono"> — {r.note}</span>}
              </div>
              <div className="biblio-links">
                <a href={scholar(r)} target="_blank" rel="noopener"><Icon name="ext" size={13} /> Scholar</a>
                <a href={`https://powo.science.kew.org/results?q=${encodeURIComponent("Garcinia")}`} target="_blank" rel="noopener"><Icon name="leaf" size={13} /> POWO</a>
              </div>
            </div>
          </li>
        ))}
        {results.length === 0 && (
          <div className="empty"><Icon name="book" size={32} /><p>No references match <b>{q ? `“${q}”` : "this filter"}</b>.</p><button onClick={() => { setQ(""); setActiveTag(null); }}>Reset</button></div>
        )}
      </ol>

      <p className="desc-note mono cite-note">Citations are illustrative and compiled for demonstration; verify against the original sources before use.</p>
    </div>
  );
};

window.Literature = Literature;
