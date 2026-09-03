import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tractor, Wheat, Flower2, Leaf, Volume2, Mic, ArrowRight, PlayCircle,
  BadgeCheck, Download, FlaskConical, Phone, Camera, Sprout,
} from "lucide-react";
import { useLang, useChat, speak } from "@/store";
import { api } from "@/lib/api";

const MODULES = [
  {
    to: "/machinery", icon: Tractor, tag: "Avoid Soil Compaction", tagColor: "bg-clay text-white",
    title: "Farm Machinery Advisor",
    desc: "Match tractor horsepower and rotavators strictly to your soil depth. Avoid excessive subsoil hardpan while slashing diesel burn.",
    stats: [["Recommended Spec", "35-42 HP 4WD Tractor"], ["Fuel Efficiency Gain", "▼ 30% Diesel Saved"]],
    foot: "Implements: Laser Leveller + Subsoiler", link: "Find Custom Implements",
  },
  {
    to: "/crops", icon: Wheat, tag: "Climate Resilient", tagColor: "bg-forest text-white",
    title: "Crop Diversification Advisor",
    desc: "High-yield millets (Bajra, Ragi) & drought-hardy oilseeds requiring up to 70% less irrigation than traditional water-guzzling crops, secured with MSP.",
    stats: [["Water Consumption", "▼ 70% Less Irrigation"], ["Procurement", "100% Gov MSP Assured"]],
    foot: "Top Choice: Pearl Millet (Bajra)", link: "See Millet Portfolio",
  },
  {
    to: "/livelihood", icon: Flower2, tag: "High Cash Flow", tagColor: "bg-bloom text-white", tag2: "Marigold & Jasmine Cashflow", accent: true,
    title: "Livelihood & Floriculture",
    desc: "Unlock frequent weekly cash flow through high-demand African Marigold, Jasmine, and arid-zone Pomegranate orchards, backed by a 40% polyhouse subsidy.",
    stats: [["Polyhouse Subsidy", "40% Capital Support"], ["Harvest Velocity", "Weekly Market Sales"]],
    foot: "Recommended: Pusa Narangi Genda", link: "Horticulture Calendar",
  },
  {
    to: "/seeds", icon: Leaf, tag: "Organic & Pest Hardy", tagColor: "bg-marigold-dark text-white",
    title: "Traditional Seed Advisor",
    desc: "Safeguard soil microbiology with heirloom Desi Bajra and indigenous moth bean strains. Naturally repellent to bollworms and resistant to long dry spells.",
    stats: [["Chemical Need", "Zero Synthetic Sprays"], ["Community Vaults", "4 Gene Banks Nearby"]],
    foot: "Direct Farmer Exchange", link: "Seed Bank Directory",
  },
];

function ModuleCard({ m, onSpeak }) {
  const nav = useNavigate();
  const Icon = m.icon;
  return (
    <div
      data-testid={`module-card-${m.to.slice(1)}`}
      onClick={() => nav(m.to)}
      className={`field-card p-5 cursor-pointer group transition-all hover:shadow-earth hover:-translate-y-0.5 ${m.accent ? "border-l-4 border-l-bloom bg-bloom-mist/40" : ""}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`h-11 w-11 rounded-xl grid place-items-center shrink-0 ${m.accent ? "bg-bloom text-white" : "bg-forest text-white"}`}>
            <Icon size={22} />
          </div>
          <div>
            <div className="flex flex-wrap gap-1.5 mb-1">
              <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${m.tagColor}`}>{m.tag}</span>
              {m.tag2 && <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-marigold-light text-clay-dark">{m.tag2}</span>}
            </div>
            <h3 className="font-bold text-lg text-soil leading-tight">{m.title}</h3>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onSpeak(`${m.title}. ${m.desc}`); }}
          className="h-8 w-8 rounded-full bg-sand-container grid place-items-center text-clay hover:bg-sand-ochre shrink-0"
          data-testid={`module-listen-${m.to.slice(1)}`}
        >
          <Volume2 size={15} />
        </button>
      </div>
      <p className="text-sm text-soil-variant mt-3 leading-relaxed">{m.desc}</p>
      <div className="grid grid-cols-2 gap-3 mt-4 bg-sand-container rounded-lg p-3">
        {m.stats.map((s, i) => (
          <div key={i}>
            <div className="text-[11px] text-soil-variant">{s[0]}</div>
            <div className="text-sm font-bold text-soil">{s[1]}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-3 text-sm">
        <span className="text-soil-variant text-xs">{m.foot}</span>
        <span className={`font-semibold flex items-center gap-1 ${m.accent ? "text-bloom" : "text-clay"} group-hover:gap-2 transition-all`}>
          {m.link} <ArrowRight size={15} />
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  const { t, lang } = useLang();
  const { openChat } = useChat();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard").then((r) => setData(r.data)).catch(() => {});
  }, []);

  const f = data?.farmer;
  const schemes = data?.schemes || [];
  const story = data?.stories?.[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Welcome banner */}
      <section className="rounded-2xl overflow-hidden shadow-earth bg-gradient-to-br from-clay-dark via-clay-deep to-clay text-white relative">
        <div className="p-6 md:p-8 grid lg:grid-cols-[1.4fr_1fr] gap-6">
          <div>
            {f && <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-black/20 rounded-full px-3 py-1">🌾 {f.khasra}</span>}
            <h1 className="text-3xl md:text-4xl font-extrabold mt-3">
              {t("namaste")}, {f?.name || "Kisan Ji"}! <span className="text-marigold-light text-2xl font-bold">({f?.name_hi || "राम-रामसा"})</span>
            </h1>
            <p className="text-sand/90 mt-2 max-w-xl text-sm md:text-base leading-relaxed">
              {lang === "hi"
                ? "आपके 1.5-हेक्टेयर चिकनी-दोमट खेत के लिए त्वरित, नि:शुल्क कृषि सलाह। मिट्टी pH 7.4 पर स्थिर है।"
                : <>Instant, zero-cost agronomic advisory customized for your <b>{f?.parcel || "1.5-hectare clay-loam parcel"}</b>. Soil pH is stable at {f?.ph || "7.4"}.</>}
            </p>
            <div className="grid grid-cols-3 gap-3 mt-5 max-w-lg">
              {[["MOISTURE", f?.moisture], ["PEST RISK", f?.pest_risk], ["ACTIVE CYCLE", f?.cycle]].map((c, i) => (
                <div key={i} className="bg-black/20 rounded-lg px-3 py-2">
                  <div className="text-[10px] text-sand/70 font-semibold">{c[0]}</div>
                  <div className="text-sm font-bold">{c[1] || "—"}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white text-soil rounded-xl p-4 self-start">
            <div className="flex items-center gap-2">
              <Mic size={18} className="text-clay" />
              <span className="font-bold">{t("voice_mitra")}</span>
              <span className="ml-auto text-[10px] bg-sand-container text-clay-dark rounded-full px-2 py-0.5 font-semibold">Hindi • English</span>
            </div>
            <p className="text-xs text-soil-variant mt-2 leading-relaxed">{t("voice_desc")}</p>
            <button
              data-testid="speak-question-btn"
              onClick={() => openChat(true)}
              className="mt-3 w-full bg-clay hover:bg-clay-deep text-white rounded-lg h-11 font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Mic size={17} /> {t("speak_q")}
            </button>
          </div>
        </div>
      </section>

      {/* Action hub */}
      <section className="mt-8">
        <p className="text-[11px] font-bold tracking-widest text-clay uppercase">{t("empirical")}</p>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-soil">{t("action_hub")}</h2>
          <p className="text-xs text-soil-variant max-w-sm">Calibrated to clay-loam density and semi-arid microclimates for maximum return on seed investment.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {MODULES.map((m) => <ModuleCard key={m.to} m={m} onSpeak={(txt) => speak(txt, lang)} />)}
        </div>
      </section>

      {/* Success story */}
      {story && (
        <section className="mt-8 field-card overflow-hidden">
          <div className="grid md:grid-cols-[280px_1fr]">
            <img src={story.image} alt="Success story" className="h-full w-full object-cover min-h-[220px]" />
            <div className="p-6">
              <p className="text-[11px] font-bold tracking-widest text-clay uppercase flex items-center gap-1.5"><BadgeCheck size={14} /> Success Story • {story.block}</p>
              <h3 className="text-xl font-bold text-soil mt-2">{story.title}</h3>
              <p className="text-sm text-soil-variant mt-2 leading-relaxed">{story.body}</p>
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <button
                  data-testid="story-listen"
                  onClick={() => speak(story.title + ". " + story.body, lang)}
                  className="bg-clay hover:bg-clay-deep text-white rounded-lg px-4 h-10 text-sm font-semibold flex items-center gap-2"
                >
                  <PlayCircle size={17} /> Listen to Audio Log (3 min)
                </button>
                <span className="text-xs text-soil-variant">{story.verified_by}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Active subsidies */}
      <section className="mt-8">
        <p className="text-[11px] font-bold tracking-widest text-clay uppercase">Official Government Incentives</p>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-soil">Active Subsidies & Free Minikits</h2>
          <a href="/schemes" className="text-sm font-semibold text-clay">View All Schemes ›</a>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {schemes.slice(0, 2).map((s) => (
            <div key={s.key} data-testid={`subsidy-card-${s.key}`} className="field-card p-5">
              <div className="flex items-center justify-between text-xs">
                <span className="bg-marigold-light text-clay-dark font-bold rounded-full px-2.5 py-0.5">{s.tagline}</span>
                <span className="text-soil-variant">Closes in {s.closes_in_days} Days</span>
              </div>
              <h3 className="font-bold text-soil mt-3">{s.name}</h3>
              <p className="text-sm text-soil-variant mt-1 leading-relaxed line-clamp-3">{s.benefit}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-forest font-semibold flex items-center gap-1"><BadgeCheck size={14} /> Eligible (Small Farmer)</span>
                <a href={s.apply_url} target="_blank" rel="noreferrer" className="bg-clay hover:bg-clay-deep text-white rounded-lg px-4 h-10 text-sm font-semibold flex items-center gap-1.5">
                  {s.apply_label} <Download size={15} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* KVK diagnostic */}
      <section className="mt-8 field-card p-6 bg-sand-container flex flex-col md:flex-row items-center gap-4">
        <div className="h-14 w-14 rounded-xl bg-bloom-mist grid place-items-center shrink-0"><FlaskConical size={26} className="text-clay" /></div>
        <div className="flex-1">
          <h3 className="font-bold text-soil flex items-center gap-2">Need Diagnostic Assistance for Your Field? <span className="text-[10px] bg-forest text-white rounded-full px-2 py-0.5">KVK Online</span></h3>
          <p className="text-sm text-soil-variant mt-1">Submit soil photos or plant disease leaves to Krishi Vigyan Kendra scientists. Get laboratory-verified advisory within 4 hours.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-sand-ochre rounded-lg px-4 h-11 text-sm font-semibold flex items-center gap-2 text-soil"><Camera size={16} /> Upload Pest Photo</button>
          <a href="tel:18001801551" className="bg-clay hover:bg-clay-deep text-white rounded-lg px-4 h-11 text-sm font-semibold flex items-center gap-2"><Phone size={16} /> Call Agronomist</a>
        </div>
      </section>
    </div>
  );
}
