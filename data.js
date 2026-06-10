/* Manggis — data.js
   Loads real Garcinia data from Supabase.
   Falls back gracefully to static placeholder while loading.
   ─────────────────────────────────────────────────────────
   SETUP: replace the two constants below with your project values.
   You can find them in Supabase → Project Settings → API.
*/

const SUPABASE_URL = "https://eyldrucxywovksqasuqy.supabase.co";   // ← paste your project URL
const SUPABASE_ANON_KEY = "sb_publishable_lffx2AKe8mEP0WhQLaQ8Aw_mFueAnDr";                 // ← paste your anon/public key

// ─── Static lookup tables (these never change) ───────────────────────────────

const IUCN = {
  EX: { label: "Extinct",               code: "EX", color: "#231f1c" },
  EW: { label: "Extinct in the Wild",   code: "EW", color: "#3b2f4a" },
  CR: { label: "Critically Endangered", code: "CR", color: "#9e2b25" },
  EN: { label: "Endangered",            code: "EN", color: "#c4622d" },
  VU: { label: "Vulnerable",            code: "VU", color: "#b8902f" },
  NT: { label: "Near Threatened",       code: "NT", color: "#6f7a37" },
  LC: { label: "Least Concern",         code: "LC", color: "#3f7a52" },
  DD: { label: "Data Deficient",        code: "DD", color: "#8a8378" },
  NE: { label: "Not Evaluated",         code: "NE", color: "#b3ada1" }
};

const SECTIONS = ["Garcinia", "Brindonia", "Hebradendron", "Xanthochymus", "Rheediopsis", "Tagmanthera"];

const REGIONS = [
  "Peninsular Malaysia", "Borneo", "Sumatra", "Java",
  "Thailand", "Indochina", "Philippines", "Sri Lanka & India", "New Guinea"
];

// Region name normaliser — maps geography.higher_name values → REGIONS entries
const REGION_MAP = {
  "Siam": "Thailand",
  "Thailand": "Thailand",
  "Sarawak": "Borneo",
  "Kalimantan": "Borneo",
  "Sabah": "Borneo",
  "Brunei": "Borneo",
  "Sumatra Island": "Sumatra",
  "Sumatra": "Sumatra",
  "Belitung": "Sumatra",
  "Java": "Java",
  "Mindanao": "Philippines",
  "Palawan": "Philippines",
  "Philippines": "Philippines",
  "Luzon": "Philippines",
  "Malaya": "Peninsular Malaysia",
  "Peninsular Malaysia": "Peninsular Malaysia",
  "Singapore": "Peninsular Malaysia",
  "Johore": "Peninsular Malaysia",
  "New Guinea": "New Guinea",
  "Papua New Guinea": "New Guinea",
  "Western Australia": "New Guinea",
  "Ambon": "New Guinea",
};

// Herbaria — built from our real data + catalogue URLs
const HERBARIA_STATIC = {
  "A":    { code:"A",    name:"Arnold Arboretum, Harvard University",    city:"Cambridge, USA",           country:"United States", founded:1872, specimens:0,  url:"https://huh.harvard.edu/pages/botany", cat: q=>`https://kiki.huh.harvard.edu/databases/specimen_search.php?query_type=by_words&word=${q}` },
  "L":    { code:"L",    name:"Naturalis Biodiversity Center",            city:"Leiden, Netherlands",      country:"Netherlands",   founded:1829, specimens:0,  url:"https://www.naturalis.nl/en/science/collections", cat: q=>`https://bioportal.naturalis.nl/?language=en&query=${q}` },
  "E":    { code:"E",    name:"Royal Botanic Garden Edinburgh",           city:"Edinburgh, Scotland",      country:"UK",            founded:1670, specimens:0,  url:"https://www.rbge.org.uk/science-and-conservation/herbarium/", cat: q=>`https://www.gbif.org/occurrence/search?q=${q}&institution_code=E` },
  "SING": { code:"SING", name:"Singapore Botanic Gardens Herbarium",      city:"Singapore",                country:"Singapore",     founded:1875, specimens:0,  url:"https://www.nparks.gov.sg/sbg/research/herbarium", cat: q=>`https://www.gbif.org/occurrence/search?q=${q}&institution_code=SING` },
  "SAR":  { code:"SAR",  name:"Forest Herbarium, Sarawak Forestry",       city:"Kuching, Sarawak, Malaysia", country:"Malaysia",   founded:1928, specimens:0,  url:"https://forestry.sarawak.gov.my/", cat: q=>`https://www.gbif.org/occurrence/search?q=${q}&institution_code=SAR` },
  "K":    { code:"K",    name:"Royal Botanic Gardens, Kew",               city:"Kew, United Kingdom",      country:"UK",            founded:1853, specimens:0,  url:"https://www.kew.org/science/collections-and-resources/collections/herbarium", cat: q=>`https://powo.science.kew.org/results?q=${q}` },
  "BO":   { code:"BO",   name:"Herbarium Bogoriense",                     city:"Bogor, Indonesia",         country:"Indonesia",     founded:1817, specimens:0,  url:"https://www.lipi.go.id/", cat: q=>`https://www.gbif.org/occurrence/search?q=${q}&institution_code=BO` },
};

const LITERATURE = [
  { authors:"Linnaeus, C.", year:1753, title:"Species Plantarum", journal:"L. Salvius, Stockholm", vol:"1: 443", tag:"Foundational", note:"protologue of Garcinia mangostana" },
  { authors:"Hooker, J.D.", year:1874, title:"Garcinia L.", journal:"Flora of British India", vol:"1: 259–272", tag:"Flora" },
  { authors:"King, G.", year:1890, title:"Materials for a Flora of the Malayan Peninsula: Guttiferae", journal:"J. Asiat. Soc. Bengal", vol:"59: 113–162", tag:"Flora" },
  { authors:"Ridley, H.N.", year:1922, title:"Guttiferae", journal:"The Flora of the Malay Peninsula", vol:"1: 174–198", tag:"Flora" },
  { authors:"Pierre, L.", year:1882, title:"Flore Forestière de la Cochinchine", journal:"Doin, Paris", vol:"fasc. 15–18", tag:"Flora", note:"primary source for many SE Asian names" },
  { authors:"Whitmore, T.C.", year:1973, title:"Garcinia L.", journal:"Tree Flora of Malaya", vol:"2: 196–224", tag:"Revision" },
  { authors:"Richards, A.J.", year:1990, title:"Studies in Garcinia: the origin of the mangosteen (G. mangostana L.)", journal:"Botanical Journal of the Linnean Society", vol:"103: 301–354", tag:"Reproductive biology" },
  { authors:"Sweeney, P.W.", year:2008, title:"Phylogeny and floral diversity in the genus Garcinia (Clusiaceae)", journal:"International Journal of Plant Sciences", vol:"169(9): 1288–1303", tag:"Phylogenetics" },
  { authors:"Pedraza-Chaverri, J. et al.", year:2008, title:"Medicinal properties of mangosteen (Garcinia mangostana)", journal:"Food and Chemical Toxicology", vol:"46(10): 3227–3239", tag:"Phytochemistry" },
  { authors:"Obolskiy, D. et al.", year:2009, title:"Garcinia mangostana L.: a phytochemical and pharmacological review", journal:"Phytotherapy Research", vol:"23: 1047–1065", tag:"Phytochemistry" },
  { authors:"Nazre, M.", year:2014, title:"New evidence on the origin of mangosteen based on morphology and ITS sequence", journal:"Genetic Resources and Crop Evolution", vol:"61: 1147–1158", tag:"Systematics" },
  { authors:"Nazre, M., Newman, M.F. et al.", year:2018, title:"Phylogenetic relationships in Garcinia section Garcinia inferred from nuclear and plastid markers", journal:"Tree Genetics & Genomes", vol:"14: 47", tag:"Systematics" },
  { authors:"IUCN SSC Global Tree Specialist Group", year:2019, title:"Conservation assessments of Malesian Garcinia", journal:"IUCN Red List of Threatened Species", vol:"e.T—", tag:"Conservation" },
  { authors:"POWO", year:2024, title:"Plants of the World Online — Garcinia L.", journal:"Royal Botanic Gardens, Kew", vol:"facilitated by the Trustees", tag:"Resource" },
];

const MONTHS = ["J","F","M","A","M","J","J","A","S","O","N","D"];

// ─── Supabase fetch helper ────────────────────────────────────────────────────

async function sbFetch(table, select = "*", filters = "") {
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}${filters}`;
  const res = await fetch(url, {
    headers: {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": "Bearer " + SUPABASE_ANON_KEY,
      "Accept": "application/json"
    }
  });
  if (!res.ok) throw new Error(`Supabase ${table}: ${res.status} ${res.statusText}`);
  return res.json();
}

// ─── Data transformers ────────────────────────────────────────────────────────

function buildHerbaria(rawHerbaria, rawSpecs) {
  // Count specimens per herbarium
  const counts = {};
  rawSpecs.forEach(s => { counts[s.herbarium_id] = (counts[s.herbarium_id] || 0) + 1; });

  const result = {};
  rawHerbaria.forEach(h => {
    const acro = h.acronym;
    const base = HERBARIA_STATIC[acro] || {
      code: acro, name: h.name || acro,
      city: (h.address || "").split("\n").slice(-1)[0] || "",
      country: (h.address || "").split("\n").slice(-1)[0] || "",
      founded: null,
      url: `https://www.gbif.org/occurrence/search?q=Garcinia&institution_code=${acro}`,
      cat: q => `https://www.gbif.org/occurrence/search?q=${q}&institution_code=${acro}`
    };
    result[acro] = { ...base, specimens: counts[h.id] || 0 };
  });
  return result;
}

function buildSpecimen(s, herbaria, collectors, geography) {
  const h = herbaria[s.herbarium_id] || {};
  const c = collectors[s.collector_id] || {};
  const g = geography[s.geography_id] || {};
  const yr = s.collection_year || (s.collection_date ? parseInt(s.collection_date.slice(0,4)) : null);
  return {
    collector: c.name_for_display || s.imported_collector || "",
    number:    s.collector_number || "",
    year:      yr,
    country:   g.higher_name || g.name || "",
    locality:  [g.name, s.locality_detail].filter(Boolean).join(" — "),
    herbarium: h.acronym || "?",
    type:      null,
    barcode:   s.barcode || "",
    lat:       s.latitude  ? parseFloat(s.latitude)  : null,
    lon:       s.longitude ? parseFloat(s.longitude) : null,
  };
}

function normaliseRegion(higherName) {
  return REGION_MAP[higherName] || higherName;
}

function buildSpecies(rawNames, rawSpecs, rawDets, rawSyns, herbByDbId, collByDbId, geoByDbId) {
  // Build lookup maps
  const detsByNameId = {};
  rawDets.forEach(d => {
    detsByNameId[d.latin_name_id] = detsByNameId[d.latin_name_id] || [];
    detsByNameId[d.latin_name_id].push(d);
  });

  const specById = {};
  rawSpecs.forEach(s => { specById[s.id] = s; });

  // Synonym map: accepted_id → [synonym names]
  const synsByAccepted = {};
  rawSyns.forEach(s => {
    synsByAccepted[s.accepted_name_id] = synsByAccepted[s.accepted_name_id] || [];
    synsByAccepted[s.accepted_name_id].push(s.synonym_name_id);
  });
  // Also from synonym_of_id field
  const nameById = {};
  rawNames.forEach(n => { nameById[n.id] = n; });
  rawNames.forEach(n => {
    if (n.synonym_of_id) {
      synsByAccepted[n.synonym_of_id] = synsByAccepted[n.synonym_of_id] || [];
      synsByAccepted[n.synonym_of_id].push(n.id);
    }
  });

  // Only build species for names with rank = species (or well-known ones)
  const speciesNames = rawNames.filter(n =>
    n.rank === "species" ||
    (n.full_name && n.full_name.includes("valetoniana")) ||
    (n.full_name && n.full_name.toLowerCase().includes("nitida pierre"))
  );

  return speciesNames.map(n => {
    const epithet = n.epithet || n.full_name.replace(/^Garcinia\s+/i,"").split(" ")[0];

    // Find linked specimens via determinations
    const dets = detsByNameId[n.id] || [];
    const linkedSpecs = dets
      .filter(d => specById[d.specimen_id])
      .map(d => buildSpecimen(specById[d.specimen_id], herbByDbId, collByDbId, geoByDbId));

    // Derive regions from specimen localities
    const regionSet = new Set();
    linkedSpecs.forEach(s => {
      const g = geoByDbId[
        rawSpecs.find(rs => rs.collector_number === s.number)?.geography_id
      ];
      if (g) {
        const r = normaliseRegion(g.higher_name || g.name);
        if (REGIONS.includes(r)) regionSet.add(r);
      }
    });

    // Synonyms
    const synIds = synsByAccepted[n.id] || [];
    const synonyms = synIds.map(sid => nameById[sid]?.full_name).filter(Boolean);

    // Authority — clean it up
    const auth = (n.authority || "").trim();

    // Publication string
    const pubParts = [n.publication_year, n.volume ? `${n.volume}` : null, n.page ? `${n.page}` : null].filter(Boolean);
    const published = pubParts.length ? pubParts.join(": ") : "";

    return {
      id:        `garcinia-${n.id}`,
      dbId:      n.id,
      epithet:   epithet.toLowerCase(),
      author:    auth,
      full_name: n.full_name,
      common:    [],                    // not in PADME — could be added
      section:   "Garcinia",           // section data not in padmedata specimens
      status:    "NE",                 // IUCN not in PADME — NE = not evaluated
      statusYear: null,
      published: published,
      habit:     "Evergreen tree",
      height:    "",
      elevation: "",
      regions:   regionSet.size ? [...regionSet] : ["Peninsular Malaysia"],
      nativeNote: "",
      featured:  n.id === "51",        // G. mangostana
      synonyms:  synonyms,
      diagnosis: n.notes || `${n.full_name} — described by ${auth || "unknown author"}.`,
      morphology: {},
      phenology:  { flower: [], fruit: [] },
      uses:       "",
      etymology:  "",
      typeSpecimen: "",
      specimens:  linkedSpecs,
      references: [
        ...(n.publication_year ? [{
          authors: auth,
          year: parseInt(n.publication_year),
          title: n.full_name,
          source: published
        }] : []),
        { authors: "POWO", year: 2024,
          title: `${n.full_name} — Plants of the World Online`,
          source: "Royal Botanic Gardens, Kew" }
      ],
      // Extra fields for the app
      is_endemic:     n.is_endemic === "true" || n.is_endemic === true,
      is_illegitimate:n.is_illegitimate === "true" || n.is_illegitimate === true,
      protologue_image: n.protologue_image || null,
    };
  });
}

// ─── Main loader ─────────────────────────────────────────────────────────────

async function loadGarciniaData() {
  try {
    console.log("[Manggis] Loading from Supabase…");

    const [names, specs, dets, syns, herbaria, collectors, geography] = await Promise.all([
      sbFetch("garcinia_names"),
      sbFetch("garcinia_specimens"),
      sbFetch("garcinia_determinations"),
      sbFetch("garcinia_synonyms"),
      sbFetch("garcinia_herbaria"),
      sbFetch("garcinia_collectors"),
      sbFetch("garcinia_geography"),
    ]);

    // Build id-keyed lookups using DB id field
    const herbByDbId  = {};  herbaria.forEach(h  => { herbByDbId[h.id]  = h; });
    const collByDbId  = {};  collectors.forEach(c => { collByDbId[c.id]  = c; });
    const geoByDbId   = {};  geography.forEach(g  => { geoByDbId[g.id]   = g; });

    // Build HERBARIA keyed by acronym with specimen counts
    const HERBARIA = buildHerbaria(herbaria, specs);

    // Build SPECIES array from real names + specimen data
    const SPECIES = buildSpecies(names, specs, dets, syns, herbByDbId, collByDbId, geoByDbId);

    // Featured species: prefer mangostana if present, else first
    const featured = SPECIES.find(s => s.epithet === "mangostana") || SPECIES[0];
    if (featured) featured.featured = true;

    const totalSpecimens = Object.values(HERBARIA).reduce((a,h) => a + h.specimens, 0);
    const allRegions = new Set(SPECIES.flatMap(s => s.regions));

    window.GARCINIA = {
      IUCN, HERBARIA, SECTIONS, REGIONS, MONTHS,
      SPECIES, LITERATURE,
      GENUS: "Garcinia", FAMILY: "Clusiaceae",
      stats: {
        species:       SPECIES.length,
        acceptedGlobal: 462,
        specimens:     totalSpecimens,
        herbaria:      Object.keys(HERBARIA).length,
        countries:     allRegions.size,
      },
      // Raw tables exposed for advanced use
      _raw: { names, specs, dets, syns, herbaria, collectors, geography }
    };

    console.log(`[Manggis] Loaded: ${SPECIES.length} names, ${totalSpecimens} specimens, ${Object.keys(HERBARIA).length} herbaria`);

    // Signal to the app that data is ready
    window.dispatchEvent(new CustomEvent("garcinia:ready"));

  } catch (err) {
    console.error("[Manggis] Supabase load failed:", err);
    console.warn("[Manggis] Using static fallback data.");
    loadFallback();
  }
}

// ─── Fallback (runs if Supabase is unreachable / keys not set) ────────────────

function loadFallback() {
  // Minimal static data so the app renders while you set up Supabase
  const HERBARIA = Object.fromEntries(
    Object.entries(HERBARIA_STATIC).map(([k,v]) => [k, { ...v, specimens: 0 }])
  );

  const fallbackSpecies = [
    {
      id:"mangostana", epithet:"mangostana", author:"L.",
      common:["Mangosteen","Manggis"], section:"Garcinia",
      status:"DD", statusYear:2021, published:"Sp. Pl. 1: 443 (1753)",
      habit:"Evergreen tree", height:"6–25 m", elevation:"0–1000 m",
      regions:["Peninsular Malaysia","Sumatra","Java","Thailand","Philippines"],
      nativeNote:"Wild progenitors occur across Sundaland.",
      featured:true,
      synonyms:["Mangostana garcinia Gaertn."],
      diagnosis:"A small to medium evergreen tree with a pyramidal crown. Distinguished by its glossy leathery leaves and celebrated thick purple pericarp enclosing snow-white arils.",
      morphology:{}, phenology:{ flower:[3,4,5], fruit:[6,7,8,9] },
      uses:"Premier tropical fruit — the queen of fruits.",
      etymology:"Latinisation of the Malay name manggis.",
      typeSpecimen:"Lectotype: Herb. Hermann 3: 12, No. 226 (BM).",
      specimens:[
        { collector:"Wallich, N.", number:"4855", year:1822, country:"Singapore", locality:"Singapore Island, cultivated", herbarium:"K", type:"isotype", barcode:"K000000001" },
        { collector:"Ridley, H.N.", number:"3120", year:1893, country:"Malaysia", locality:"Penang, Waterfall Gardens", herbarium:"SING", type:null, barcode:"SING000003120" },
        { collector:"Corner, E.J.H.", number:"27744", year:1937, country:"Singapore", locality:"Botanic Gardens, cult.", herbarium:"SING", type:null, barcode:"SING000027744" },
      ],
      references:[
        { authors:"Linnaeus, C.", year:1753, title:"Species Plantarum", source:"1: 443", note:"protologue" },
        { authors:"POWO", year:2024, title:"Garcinia mangostana L. — Plants of the World Online", source:"Royal Botanic Gardens, Kew" }
      ]
    }
  ];

  window.GARCINIA = {
    IUCN, HERBARIA, SECTIONS, REGIONS, MONTHS,
    SPECIES: fallbackSpecies, LITERATURE,
    GENUS:"Garcinia", FAMILY:"Clusiaceae",
    stats:{ species:1, acceptedGlobal:462, specimens:0, herbaria:Object.keys(HERBARIA).length, countries:9 }
  };

  window.dispatchEvent(new CustomEvent("garcinia:ready"));
}

// ─── Boot ─────────────────────────────────────────────────────────────────────

// If keys are still placeholders, skip the network call
if (SUPABASE_URL.includes("YOUR_PROJECT") || SUPABASE_ANON_KEY.includes("sb_publishable_lffx2AKe8mEP0WhQLaQ8Aw_mFueAnDr")) {
  console.info("[Manggis] Supabase keys not set — using static fallback. See data.js to configure.");
  loadFallback();
} else {
  loadGarciniaData();
}
