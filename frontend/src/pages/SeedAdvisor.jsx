import { useState } from "react";
import { Sliders, Leaf, ShieldCheck, MapPin, Sparkles, Building2, ArrowRight } from "lucide-react";
import { PageHeader, Panel, Field, OptionGrid, Chip, useScrollToResults } from "@/components/advisor";
import { useLang } from "@/store";
import { api } from "@/lib/api";

const STATES = ["Rajasthan", "Gujarat", "Odisha", "Kerala", "Karnataka", "Tamil Nadu", "Chhattisgarh", "Haryana"];

export default function SeedAdvisor() {
  const { lang } = useLang();
  const [state, setState] = useState("Rajasthan");
  const [pest, setPest] = useState("");
  const [salinity, setSalinity] = useState("Low");
  const [nutrition, setNutrition] = useState("");
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);
  const resultsRef = useScrollToResults(res);

  const calc = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/advisor/seeds", { state, pest: pest || null, salinity, nutrition: nutrition || null });
      setRes(data);
    } finally { setLoading(false); }
  };

  return (
    <div>
      <PageHeader
        title={lang === "hi" ? "पारंपरिक बीज सलाहकार" : "Landrace & Traditional Seed Advisor"}
        subtitle={lang === "hi" ? "देसी, कीट-सहनशील किस्में जो मिट्टी की सूक्ष्म-जैविकी की रक्षा करती हैं और लंबे सूखे में टिकती हैं।" : "Heirloom, pest-hardy indigenous varieties that safeguard soil microbiology and endure long dry spells — with community seed bank contacts."}
        badge="PKVY Organic Cluster Active"
      />

      <div className="max-w-7xl mx-auto px-4 py-6 grid lg:grid-cols-[380px_1fr] gap-5">
        <Panel title={<span className="flex items-center gap-2"><Sliders size={18} className="text-clay" /> Seed Requirement Profile</span>} step="Step 1 of 1">
          <Field label="Region / State">
            <select data-testid="state-select" value={state} onChange={(e) => setState(e.target.value)} className="w-full h-12 rounded-lg border-[1.5px] border-sand-ochre px-3 text-sm font-semibold text-soil bg-white outline-none focus:border-clay">
              {STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Specific Pest / Disease Vulnerability">
            <OptionGrid testid="pest" cols={1} options={[
              { value: "", label: "Any / Not sure" },
              { value: "stem borer", label: "Stem borer" },
              { value: "bollworm", label: "Bollworm" },
              { value: "blast", label: "Blast / Mildew" },
            ]} value={pest} onChange={setPest} />
          </Field>
          <Field label="Soil Salinity Level">
            <OptionGrid testid="salinity" options={[
              { value: "Low", label: "Low" }, { value: "Moderate", label: "Moderate" }, { value: "High", label: "High" },
            ]} value={salinity} onChange={setSalinity} />
          </Field>
          <Field label="Nutritional Goal">
            <OptionGrid testid="nutrition" cols={1} options={[
              { value: "", label: "Any" },
              { value: "iron", label: "High Iron" },
              { value: "zinc", label: "High Zinc" },
              { value: "protein", label: "High Protein" },
            ]} value={nutrition} onChange={setNutrition} />
          </Field>
          <button data-testid="calc-seeds" onClick={calc} disabled={loading} className="w-full bg-forest hover:bg-forest-dark text-white rounded-lg h-12 font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
            <Leaf size={18} /> {loading ? "Searching…" : "Find Indigenous Varieties"}
          </button>
        </Panel>

        <div className="space-y-4" ref={resultsRef} data-testid="advisor-results">
          {!res && (
            <div className="field-card p-10 text-center text-soil-variant">
              <Leaf size={40} className="mx-auto text-sand-ochre" />
              <p className="mt-3 font-semibold text-soil">Choose your state & needs to discover heirloom landraces</p>
            </div>
          )}
          {res && res.recommendations.map((l, i) => (
            <div key={l.key} data-testid={`seed-card-${l.key}`} className={`field-card p-5 ${i === 0 ? "border-l-4 border-l-marigold-dark" : ""}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-soil">{l.name}</h3>
                    <span className="text-sm text-soil-variant font-deva">{l.name_hi}</span>
                  </div>
                  <p className="text-xs text-soil-variant flex items-center gap-1 mt-0.5"><MapPin size={12} /> Native: {l.native_region}</p>
                </div>
                {i === 0 && <Chip tone="forest">★ Best for {state}</Chip>}
              </div>

              <div className="grid md:grid-cols-2 gap-3 mt-3">
                <div className="bg-forest-sage rounded-lg p-3">
                  <p className="text-xs font-bold text-forest flex items-center gap-1.5"><Sparkles size={13} /> Agronomic Strengths</p>
                  <ul className="mt-1.5 space-y-1">{l.strengths.map((s) => <li key={s} className="text-sm text-soil flex gap-2"><span className="h-1.5 w-1.5 rounded-full bg-forest mt-1.5" /> {s}</li>)}</ul>
                </div>
                <div className="bg-bloom-mist rounded-lg p-3">
                  <p className="text-xs font-bold text-bloom-deep flex items-center gap-1.5"><ShieldCheck size={13} /> Pest / Disease Resistance</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">{l.pest_resistance.map((p) => <Chip key={p} tone="bloom">{p}</Chip>)}</div>
                  <p className="text-xs text-soil-variant mt-2">Salinity tolerance: <b>{l.salinity}</b></p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="text-xs text-soil-variant">Nutrition:</span>
                {l.nutrition.map((n) => <Chip key={n} tone="marigold">{n}</Chip>)}
              </div>

              <div className="mt-3 bg-sand-container rounded-lg p-3">
                <p className="text-xs font-bold text-clay-dark">🌱 Organic Cultivation Protocol</p>
                <p className="text-sm text-soil mt-1">{l.organic_protocol}</p>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-sand-ochre">
                <span className="text-xs text-forest font-semibold flex items-center gap-1"><Building2 size={14} /> Seed Bank: {l.seed_bank}</span>
                <a href="/schemes" className="text-sm font-semibold text-clay flex items-center gap-1">PKVY Support <ArrowRight size={14} /></a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
