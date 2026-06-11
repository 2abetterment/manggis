/* Manggis — app shell: routing + tweaks */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "indigo",
  "heroLayout": "plate",
  "density": "regular",
  "accent": "auto",
  "fontScale": 17,
  "browseView": "grid",
  "plates": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = React.useState({ view: "home", params: {} });
  const G = window.GARCINIA;

  const go = (view, params = {}) => { setRoute({ view, params }); window.scrollTo(0, 0); };
  const openSpecies = (id) => { setRoute({ view: "detail", params: { id } }); window.scrollTo(0, 0); };

  // "/" focuses search → jump to browse
  React.useEffect(() => {
    const h = (e) => {
      if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
        e.preventDefault(); go("browse");
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const sp = route.view === "detail" ? G.SPECIES.find(s => s.id === route.params.id) : null;

  const appStyle = { "--base-size": (t.fontScale || 17) + "px" };
  if (t.accent && t.accent !== "auto") appStyle["--accent"] = t.accent;
  const ACCENTS = ["#15734a", "#0d7d6e", "#2a4d9e", "#c0395f", "#7a3fa0", "#b9852b"];

  return (
    <div className="app" data-theme={t.theme} data-density={t.density}
      data-plates={t.plates ? "on" : "off"}
      style={appStyle}>
      <TopNav view={route.view} go={go} />

      <main>
        {route.view === "home" && <Home go={go} openSpecies={openSpecies} t={t} />}
        {route.view === "browse" && <Browse go={go} openSpecies={openSpecies} initial={route.params} t={t} />}
        {route.view === "herbaria" && <Herbaria go={go} openSpecies={openSpecies} t={t} />}
        {route.view === "literature" && <Literature go={go} t={t} />}
        {route.view === "detail" && sp && <Detail sp={sp} go={go} openSpecies={openSpecies} t={t} />}
        {route.view === "detail" && !sp && <div className="page"><p>Species not found.</p></div>}
      </main>

      <Footer go={go} />

      <TweaksPanel>
        <TweakSection label="Visual direction" />
        <TweakSelect label="Palette" value={t.theme}
          options={[
            { value: "garden", label: "Botanic — crisp white & emerald" },
            { value: "orchard", label: "Orchard — ivory, teal & coral" },
            { value: "indigo", label: "Indigo — cool academic blue" },
            { value: "monograph", label: "Monograph — warm parchment" },
            { value: "herbarium", label: "Herbarium — cool archival" },
            { value: "nightshade", label: "Nightshade — dark" }
          ]}
          onChange={(v) => setTweak("theme", v)} />
        <TweakRadio label="Hero layout" value={t.heroLayout}
          options={["plate", "centered"]}
          onChange={(v) => setTweak("heroLayout", v)} />
        <TweakRow label="Accent">
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <button onClick={() => setTweak("accent", "auto")}
              style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".06em", textTransform: "uppercase",
                padding: "5px 9px", borderRadius: 6, cursor: "pointer",
                border: "1px solid " + (t.accent === "auto" ? "var(--accent)" : "var(--line-strong)"),
                background: t.accent === "auto" ? "var(--accent)" : "transparent",
                color: t.accent === "auto" ? "var(--flesh)" : "var(--ink-soft)" }}>Theme</button>
            {ACCENTS.map(c => (
              <button key={c} onClick={() => setTweak("accent", c)} aria-label={c}
                style={{ width: 20, height: 20, borderRadius: "50%", background: c, cursor: "pointer",
                  border: t.accent === c ? "2px solid var(--ink)" : "2px solid transparent",
                  boxShadow: "0 0 0 1px var(--line-strong)" }} />
            ))}
          </div>
        </TweakRow>

        <TweakSection label="Layout" />
        <TweakRadio label="Density" value={t.density}
          options={["compact", "regular", "comfy"]}
          onChange={(v) => setTweak("density", v)} />
        <TweakRadio label="Browse default" value={t.browseView}
          options={["grid", "list"]}
          onChange={(v) => setTweak("browseView", v)} />
        <TweakSlider label="Base text" value={t.fontScale} min={15} max={20} step={1} unit="px"
          onChange={(v) => setTweak("fontScale", v)} />
        <TweakToggle label="Plate frames on images" value={t.plates}
          onChange={(v) => setTweak("plates", v)} />
      </TweaksPanel>
    </div>
  );
}

// Mount only after Supabase data is ready — fixes the race condition
// where app.jsx renders before data.js finishes its async fetch
function _mount() {
  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
}

if (window.GARCINIA) {
  _mount();                                           // data already loaded
} else {
  window.addEventListener("garcinia:ready", _mount, { once: true });
}
