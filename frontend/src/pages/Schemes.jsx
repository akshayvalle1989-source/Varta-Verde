import { useEffect, useState } from "react";
import { Search, Filter, BadgeCheck, ExternalLink, Download, FileText, Phone, MapPin, ShieldCheck } from "lucide-react";
import { PageHeader, Chip } from "@/components/advisor";
import { useLang } from "@/store";
import { api } from "@/lib/api";

const PROFILES = ["Small & Marginal Farmer", "Women Farmer / SHG", "SC/ST Farmer", "FPO / Cluster"];
const FILTERS = [
  { key: "All", label: "All Schemes" },
  { key: "Machinery", label: "Machinery & Tools" },
  { key: "Crops", label: "Crops & Millets" },
  { key: "Horticulture", label: "Horticulture" },
  { key: "Traditional", label: "Landrace / Organic" },
];

export default function Schemes() {
  const { lang } = useLang();
  const [schemes, setSchemes] = useState([]);
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");
  const [profile, setProfile] = useState("Small & Marginal Farmer");
  const [elig, setElig] = useState(null);

  const load = async () => {
    const { data } = await api.get("/schemes", { params: { category: filter === "All" ? undefined : filter, q: q || undefined } });
    setSchemes(data.schemes);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [filter]);

  const runEligibility = async () => {
    const { data } = await api.post("/schemes/eligibility", { profile, state: "Pan-India" });
    setElig(data);
  };

  return (
    <div>
      <PageHeader
        title={lang === "hi" ? "एकीकृत कृषि योजना पोर्टल" : "Integrated Central & State Agricultural Schemes Portal"}
        subtitle={lang === "hi" ? "पारदर्शी पात्रता, दस्तावेज़ जाँच-सूची और सीधे पोर्टल रूटिंग के साथ नियम-आधारित सब्सिडी मिलान।" : "Rule-based subsidy matching with transparent eligibility criteria, document checklists, and direct portal routing."}
        badge="14 Portals Centrally Monitored"
      />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">
        {/* Eligibility calculator */}
        <div className="field-card p-5">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[220px]">
              <p className="text-[11px] font-bold tracking-widest text-clay uppercase">Instant Scheme Discovery</p>
              <h2 className="font-bold text-xl text-soil">Quick Eligibility Calculator</h2>
              <p className="text-sm text-soil-variant mt-1">Select your farming profile to instantly calibrate eligible financial assistance, reserve quotas, and fast-track clearance status.</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-soil-variant block mb-1">Farmer Profile Category</label>
              <select data-testid="profile-select" value={profile} onChange={(e) => setProfile(e.target.value)} className="h-12 rounded-lg border-[1.5px] border-sand-ochre px-3 text-sm font-semibold text-soil bg-white outline-none focus:border-clay min-w-[220px]">
                {PROFILES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <button data-testid="find-subsidies" onClick={runEligibility} className="bg-clay hover:bg-clay-deep text-white rounded-lg px-6 h-12 font-semibold flex items-center gap-2"><Filter size={16} /> Find Subsidies</button>
          </div>
          {elig && (
            <div data-testid="eligibility-result" className="mt-4 bg-forest-sage rounded-lg p-4 flex flex-wrap items-center gap-4">
              <ShieldCheck size={26} className="text-forest" />
              <div className="flex-1">
                <p className="font-bold text-soil">Maximum Assistance Tier Activated</p>
                <p className="text-sm text-soil-variant">{elig.tier_note}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-forest">{elig.eligible_count}/{elig.total}</div>
                <div className="text-xs text-soil-variant">Schemes Eligible</div>
              </div>
            </div>
          )}
        </div>

        {/* search + filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 bg-white border-[1.5px] border-sand-ochre rounded-full px-4 h-11 flex-1 min-w-[240px]">
            <Search size={16} className="text-clay" />
            <input data-testid="scheme-search" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load()} placeholder="Search schemes, subsidies..." className="flex-1 bg-transparent outline-none text-sm" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button key={f.key} data-testid={`filter-${f.key}`} onClick={() => setFilter(f.key)}
                className={`text-sm font-semibold rounded-full px-4 h-11 border transition-colors ${filter === f.key ? "bg-clay text-white border-clay" : "bg-white border-sand-ochre text-soil-variant hover:border-clay"}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* scheme cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {schemes.map((s) => (
            <div key={s.key} data-testid={`scheme-card-${s.key}`} className="field-card p-5 flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <Chip tone="marigold">{s.domain}</Chip>
                <Chip tone="forest">{s.sector}</Chip>
              </div>
              <h3 className="font-bold text-lg text-soil mt-2">{s.name}</h3>
              <p className="text-sm text-soil-variant mt-1">{s.benefit}</p>

              <div className="grid grid-cols-2 gap-3 mt-3 bg-marigold-light/40 rounded-lg p-3">
                <div><div className="text-[11px] text-soil-variant">Financial Assistance</div><div className="font-bold text-soil">{s.tagline}</div></div>
                <div><div className="text-[11px] text-soil-variant">Ceiling / Package</div><div className="font-bold text-soil">{s.benefit_ceiling}</div></div>
              </div>

              <div className="mt-3">
                <p className="text-xs font-bold text-clay-dark">Eligibility Criteria</p>
                <ul className="mt-1 space-y-1">
                  {s.eligibility.map((e) => <li key={e} className="text-sm text-soil flex gap-2"><BadgeCheck size={15} className="text-forest shrink-0 mt-0.5" /> {e}</li>)}
                </ul>
              </div>

              <div className="mt-3">
                <p className="text-xs font-bold text-clay-dark">Mandatory Document Checklist</p>
                <ul className="mt-1 space-y-1">
                  {s.documents.map((d) => <li key={d} className="text-sm text-soil-variant flex gap-2"><FileText size={14} className="text-clay shrink-0 mt-0.5" /> {d}</li>)}
                </ul>
              </div>

              <div className="flex gap-2 mt-4 pt-3 border-t border-sand-ochre">
                <a href={s.apply_url} target="_blank" rel="noreferrer" className="bg-clay hover:bg-clay-deep text-white rounded-lg px-4 h-11 text-sm font-semibold flex items-center gap-2 flex-1 justify-center"><ExternalLink size={15} /> {s.apply_label}</a>
                <button className="border border-sand-ochre rounded-lg px-4 h-11 text-sm font-semibold flex items-center gap-2 text-soil"><Download size={15} /> Guidelines</button>
              </div>
            </div>
          ))}
        </div>

        {/* Help desk */}
        <div className="field-card p-6 bg-sand-container grid md:grid-cols-[1fr_320px] gap-5">
          <div>
            <p className="text-[11px] font-bold tracking-widest text-clay uppercase">Subsidies Desk & Field Verification</p>
            <h3 className="text-xl font-bold text-soil mt-1">Need help preparing documents or resolving DBT subsidy holds?</h3>
            <p className="text-sm text-soil-variant mt-2">Connect with multilingual agricultural officers at the Kisan Call Centre or visit your local KVK for physical document scrutiny, biometric e-KYC, and quotation endorsements.</p>
            <div className="flex gap-2 mt-4">
              <a href="tel:18001801551" className="bg-clay hover:bg-clay-deep text-white rounded-lg px-4 h-11 text-sm font-semibold flex items-center gap-2"><Phone size={16} /> 1800-180-1551</a>
              <button className="border border-sand-ochre bg-white rounded-lg px-4 h-11 text-sm font-semibold flex items-center gap-2 text-soil"><MapPin size={16} /> Find Nearest KVK</button>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-sand-ochre p-4">
            <p className="text-[11px] font-bold text-soil-variant uppercase">Assigned District Desk</p>
            <p className="font-bold text-soil mt-1">KVK District Science Centre</p>
            <p className="text-xs text-soil-variant">ICAR-Affiliated Extension Centre · Soil & Seed Testing Unit</p>
            <ul className="text-xs text-soil-variant mt-2 space-y-1">
              <li className="flex gap-1.5"><MapPin size={13} className="text-clay" /> Agri Research Farm, Station Road, Block HQ</li>
              <li>🕘 09:30 AM – 05:30 PM (Mon to Sat)</li>
              <li>Nodal Subsidy Officer: Dr. R. K. Patel</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
