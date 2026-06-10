/* Manggis — data.js — loads Garcinia data from Supabase */
(function () {

  const URL = "https://eyldrucxywovksqasuqy.supabase.co/rest/v1";
  const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bGRydWN4eXdvdmtzcWFzdXF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNjQ0MDUsImV4cCI6MjA5NjY0MDQwNX0.mY8satAN0mO_-nO8bud5s1iWVcdYZmOl6XOlhjyg1-Y";

  const HEADERS = { "apikey": KEY, "Authorization": "Bearer " + KEY, "Accept": "application/json" };

  const IUCN = {
    EX:{label:"Extinct",code:"EX",color:"#231f1c"},
    EW:{label:"Extinct in the Wild",code:"EW",color:"#3b2f4a"},
    CR:{label:"Critically Endangered",code:"CR",color:"#9e2b25"},
    EN:{label:"Endangered",code:"EN",color:"#c4622d"},
    VU:{label:"Vulnerable",code:"VU",color:"#b8902f"},
    NT:{label:"Near Threatened",code:"NT",color:"#6f7a37"},
    LC:{label:"Least Concern",code:"LC",color:"#3f7a52"},
    DD:{label:"Data Deficient",code:"DD",color:"#8a8378"},
    NE:{label:"Not Evaluated",code:"NE",color:"#b3ada1"}
  };

  const SECTIONS = ["Garcinia","Brindonia","Hebradendron","Xanthochymus","Rheediopsis","Tagmanthera"];
  const REGIONS  = ["Peninsular Malaysia","Borneo","Sumatra","Java","Thailand","Indochina","Philippines","Sri Lanka & India","New Guinea"];
  const MONTHS   = ["J","F","M","A","M","J","J","A","S","O","N","D"];

  const REGION_MAP = {
    "Siam":"Thailand","Thailand":"Thailand",
    "Sarawak":"Borneo","Kalimantan":"Borneo","Sabah":"Borneo","Brunei":"Borneo",
    "Sumatra Island":"Sumatra","Sumatra":"Sumatra","Belitung":"Sumatra",
    "Java":"Java",
    "Mindanao":"Philippines","Palawan":"Philippines","Philippines":"Philippines","Luzon":"Philippines","Palawan Islands":"Philippines",
    "Malaya":"Peninsular Malaysia","Peninsular Malaysia":"Peninsular Malaysia","Singapore":"Peninsular Malaysia","Johore":"Peninsular Malaysia","Pahang":"Peninsular Malaysia",
    "New Guinea":"New Guinea","Papua New Guinea":"New Guinea","Moluccas Islands":"New Guinea",
    "Kuching":"Borneo","Sarawak":"Borneo",
  };

  const HERBARIA_META = {
    "A":   {url:"https://huh.harvard.edu",                cat:q=>`https://kiki.huh.harvard.edu/databases/specimen_search.php?query_type=by_words&word=${q}`,    city:"Cambridge, USA",       country:"United States", founded:1872},
    "L":   {url:"https://www.naturalis.nl",               cat:q=>`https://bioportal.naturalis.nl/?query=${q}`,                                                    city:"Leiden, Netherlands",  country:"Netherlands",   founded:1829},
    "E":   {url:"https://www.rbge.org.uk",                cat:q=>`https://www.gbif.org/occurrence/search?q=${q}&institution_code=E`,                              city:"Edinburgh, UK",        country:"UK",            founded:1670},
    "SING":{url:"https://www.nparks.gov.sg/sbg/research", cat:q=>`https://www.gbif.org/occurrence/search?q=${q}&institution_code=SING`,                           city:"Singapore",            country:"Singapore",     founded:1875},
    "SAR": {url:"https://forestry.sarawak.gov.my",        cat:q=>`https://www.gbif.org/occurrence/search?q=${q}&institution_code=SAR`,                            city:"Kuching, Malaysia",    country:"Malaysia",      founded:1928},
    "K":   {url:"https://www.kew.org",                    cat:q=>`https://powo.science.kew.org/results?q=${q}`,                                                    city:"Kew, UK",              country:"UK",            founded:1853},
    "BO":  {url:"https://www.lipi.go.id",                 cat:q=>`https://www.gbif.org/occurrence/search?q=${q}&institution_code=BO`,                              city:"Bogor, Indonesia",     country:"Indonesia",     founded:1817},
  };

  const LITERATURE = [
    {authors:"Linnaeus, C.",year:1753,title:"Species Plantarum",journal:"L. Salvius, Stockholm",vol:"1: 443",tag:"Foundational",note:"protologue of Garcinia mangostana"},
    {authors:"Hooker, J.D.",year:1874,title:"Garcinia L.",journal:"Flora of British India",vol:"1: 259–272",tag:"Flora"},
    {authors:"King, G.",year:1890,title:"Materials for a Flora of the Malayan Peninsula: Guttiferae",journal:"J. Asiat. Soc. Bengal",vol:"59: 113–162",tag:"Flora"},
    {authors:"Ridley, H.N.",year:1922,title:"Guttiferae",journal:"The Flora of the Malay Peninsula",vol:"1: 174–198",tag:"Flora"},
    {authors:"Pierre, L.",year:1882,title:"Flore Forestière de la Cochinchine",journal:"Doin, Paris",vol:"fasc. 15–18",tag:"Flora"},
    {authors:"Whitmore, T.C.",year:1973,title:"Garcinia L.",journal:"Tree Flora of Malaya",vol:"2: 196–224",tag:"Revision"},
    {authors:"Richards, A.J.",year:1990,title:"Studies in Garcinia: the origin of the mangosteen",journal:"Botanical Journal of the Linnean Society",vol:"103: 301–354",tag:"Reproductive biology"},
    {authors:"Sweeney, P.W.",year:2008,title:"Phylogeny and floral diversity in Garcinia (Clusiaceae)",journal:"International Journal of Plant Sciences",vol:"169(9): 1288–1303",tag:"Phylogenetics"},
    {authors:"Nazre, M. et al.",year:2018,title:"Phylogenetic relationships in Garcinia section Garcinia",journal:"Tree Genetics & Genomes",vol:"14: 47",tag:"Systematics"},
    {authors:"IUCN SSC",year:2019,title:"Conservation assessments of Malesian Garcinia",journal:"IUCN Red List",vol:"e.T—",tag:"Conservation"},
    {authors:"POWO",year:2024,title:"Plants of the World Online — Garcinia L.",journal:"Royal Botanic Gardens, Kew",vol:"",tag:"Resource"},
  ];

  function get(table, params) {
    var qs = params ? "?" + params : "";
    return fetch(URL + "/" + table + qs, { headers: HEADERS }).then(function(r){ return r.json(); });
  }

  function normaliseRegion(h) { return REGION_MAP[h] || h; }

  function buildSpecies(names, specs, dets, syns, herbById, collById, geoById) {
    var detsByName = {};
    dets.forEach(function(d){ (detsByName[d.latin_name_id] = detsByName[d.latin_name_id]||[]).push(d); });

    var specById = {};
    specs.forEach(function(s){ specById[s.id] = s; });

    var nameById = {};
    names.forEach(function(n){ nameById[n.id] = n; });

    var synsByAccepted = {};
    syns.forEach(function(s){
      (synsByAccepted[s.accepted_name_id] = synsByAccepted[s.accepted_name_id]||[]).push(s.synonym_name_id);
    });
    names.forEach(function(n){
      if (n.synonym_of_id) (synsByAccepted[n.synonym_of_id] = synsByAccepted[n.synonym_of_id]||[]).push(n.id);
    });

    var speciesNames = names.filter(function(n){ return n.rank === "species" || (n.full_name && n.full_name.match(/valetoniana|nitida pierre/i)); });

    return speciesNames.map(function(n) {
      var epithet = (n.epithet || n.full_name.replace(/^Garcinia\s+/i,"").split(" ")[0] || "").toLowerCase();
      var detsForName = detsByName[n.id] || [];

      var linkedSpecs = detsForName.filter(function(d){ return specById[d.specimen_id]; }).map(function(d){
        var s = specById[d.specimen_id];
        var h = herbById[s.herbarium_id] || {};
        var c = collById[s.collector_id] || {};
        var g = geoById[s.geography_id] || {};
        var yr = s.collection_year || (s.collection_date ? parseInt(s.collection_date) : null);
        return {
          collector: c.name_for_display || s.imported_collector || "",
          number: s.collector_number || "",
          year: yr,
          country: g.higher_name || g.name || "",
          locality: [g.name, s.locality_detail].filter(Boolean).join(" — "),
          herbarium: h.acronym || "?",
          type: null,
          barcode: s.barcode || "",
          lat: s.latitude ? parseFloat(s.latitude) : null,
          lon: s.longitude ? parseFloat(s.longitude) : null,
        };
      });

      var regionSet = {};
      linkedSpecs.forEach(function(s){
        var r = normaliseRegion(s.country);
        if (REGIONS.indexOf(r) > -1) regionSet[r] = true;
      });

      var synonymIds = synsByAccepted[n.id] || [];
      var synonyms = synonymIds.map(function(sid){ return nameById[sid] && nameById[sid].full_name; }).filter(Boolean);

      return {
        id: "garcinia-" + n.id,
        dbId: n.id,
        epithet: epithet,
        author: (n.authority || "").trim(),
        full_name: n.full_name,
        common: [],
        section: "Garcinia",
        status: "NE",
        statusYear: null,
        published: [n.publication_year, n.volume, n.page].filter(Boolean).join(": "),
        habit: "Evergreen tree",
        height: "", elevation: "",
        regions: Object.keys(regionSet).length ? Object.keys(regionSet) : ["Peninsular Malaysia"],
        nativeNote: "",
        featured: n.id === 51,
        synonyms: synonyms,
        diagnosis: n.notes || (n.full_name + (n.authority ? " — " + n.authority : "") + "."),
        morphology: {}, phenology: {flower:[], fruit:[]},
        uses: "", etymology: "", typeSpecimen: "",
        specimens: linkedSpecs,
        references: [
          {authors:"POWO", year:2024, title:n.full_name + " — Plants of the World Online", source:"Royal Botanic Gardens, Kew"}
        ],
      };
    });
  }

  Promise.all([
    get("garcinia_names",     "select=*"),
    get("garcinia_specimens", "select=*"),
    get("garcinia_determinations", "select=*"),
    get("garcinia_synonyms",  "select=*"),
    get("garcinia_herbaria",  "select=*"),
    get("garcinia_collectors","select=*"),
    get("garcinia_geography", "select=*"),
  ]).then(function(results) {
    var names=results[0], specs=results[1], dets=results[2], syns=results[3],
        herbaria=results[4], collectors=results[5], geography=results[6];

    var herbById={}, collById={}, geoById={};
    herbaria.forEach(function(h){ herbById[h.id]=h; });
    collectors.forEach(function(c){ collById[c.id]=c; });
    geography.forEach(function(g){ geoById[g.id]=g; });

    var HERBARIA = {};
    herbaria.forEach(function(h){
      var meta = HERBARIA_META[h.acronym] || {url:"https://www.gbif.org", cat:function(q){return "https://www.gbif.org/occurrence/search?q="+q;}, city:"", country:"", founded:null};
      var specCount = specs.filter(function(s){ return s.herbarium_id === h.id; }).length;
      HERBARIA[h.acronym] = Object.assign({}, meta, {code:h.acronym, name:h.name, specimens:specCount});
    });

    var SPECIES = buildSpecies(names, specs, dets, syns, herbById, collById, geoById);
    var featured = SPECIES.find(function(s){ return s.epithet==="mangostana"; }) || SPECIES[0];
    if (featured) featured.featured = true;

    var totalSpecimens = Object.values(HERBARIA).reduce(function(a,h){ return a+h.specimens; }, 0);

    window.GARCINIA = {
      IUCN:IUCN, HERBARIA:HERBARIA, SECTIONS:SECTIONS, REGIONS:REGIONS, MONTHS:MONTHS,
      SPECIES:SPECIES, LITERATURE:LITERATURE,
      GENUS:"Garcinia", FAMILY:"Clusiaceae",
      stats:{
        species:SPECIES.length, acceptedGlobal:462,
        specimens:totalSpecimens, herbaria:Object.keys(HERBARIA).length, countries:9
      }
    };

    console.log("[Manggis] Loaded from Supabase: " + SPECIES.length + " names, " + totalSpecimens + " specimens");
    window.dispatchEvent(new CustomEvent("garcinia:ready"));

  }).catch(function(err) {
    console.error("[Manggis] Failed to load from Supabase:", err);
    window.dispatchEvent(new CustomEvent("garcinia:ready"));
  });

})();
