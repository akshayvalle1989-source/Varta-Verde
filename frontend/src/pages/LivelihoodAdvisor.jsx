import { useState } from "react";
import { Sliders, Flower2, CalendarClock, Wallet, TrendingUp, MapPin, ArrowRight } from "lucide-react";
import { PageHeader, Panel, Field, OptionGrid, Chip, useScrollToResults } from "@/components/advisor";
import { useLang } from "@/store";
import { api } from "@/lib/api";

const IMAGES = {
  marigold: "https://images.unsplash.com/photo-1620005807545-2e08850d6591?crop=entropy&cs=srgb&fm=jpg&q=85&w=600",
  jasmine: "https://images.unsplash.com/photo-1620005807545-2e08850d6591?crop=entropy&cs=srgb&fm=jpg&q=85&w=600",
};
const FALLBACK = "https://images.pexels.com/photos/10738421/pexels-photo-10738421.jpeg?auto=compress&cs=tinysrgb&w=600";

export default function LivelihoodAdvisor() {
  const { lang } = useLang();
  const [land, setLand] = useState(0.5);
  const [water, setWater] = useState("Moderate");
  const [capital, setCapital] = useState("Low");
  const [dist, setDist] = useState(40);
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);
  const resultsRef = useScrollToResults(res);

  const calc = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/advisor/livelihood", { land: Number(land), water, capital, market_distance: Number(dist) });
      setRes(data);
    } finally { setLoading(false); }
  };

  return (
    <div>
      <PageHeader
        title={lang === "hi" ? "आजीविका एवं बागवानी सलाहकार" : "Livelihood & Horticulture Advisor"}
        subtitle={lang === "hi" ? "फूल, फल और नर्सरी से साप्ताहिक नकदी प्रवाह — 40-50% MIDH सब्सिडी के साथ।" : "Unlock weekly cash flow with flowers, fruits & nurseries — backed by 40-50% MIDH capital subsidy."}
        badge="MIDH Horticulture Active"
      />

      <div className="max-w-7xl mx-auto px-4 py-6 grid lg:grid-cols-[380px_1fr] gap-5">
        <Panel title={<span className="flex items-center gap-2"><Sliders size={18} className="text-clay" /> Investment Profile</span>} step="Step 1 of 1">
          <Field label="Available Land Portion" hint={`${land} acre`}>
            <div className="bg-sand-container rounded-lg p-4">
              <div className="text-3xl font-extrabold text-soil tabular-nums">{land} <span className="text-sm text-soil-variant font-normal">acre</span></div>
              <input data-testid="land-slider" type="range" min="0.25" max="5" step="0.25" value={land} onChange={(e) => setLand(e.target.value)} className="clay-range w-full mt-3" style={{ "--val": `${(land / 5) * 100}%` }} />
              <div className="flex justify-between text-[10px] text-soil-variant mt-1"><span>0.25 (Backyard)</span><span>5 acre</span></div>
            </div>
          </Field>
          <Field label="Water Access">
            <OptionGrid testid="water" options={[
              { value: "Low", label: "Low" }, { value: "Moderate", label: "Moderate" }, { value: "High", label: "High" },
            ]} value={water} onChange={setWater} />
          </Field>
          <Field label="Capital Investment Capacity">
            <OptionGrid testid="capital" cols={1} options={[
              { value: "Low", label: "Low", sub: "Under ₹1 lakh" },
              { value: "Medium", label: "Medium", sub: "₹1-4 lakh" },
              { value: "High", label: "High", sub: "₹4 lakh+" },
            ]} value={capital} onChange={setCapital} />
          </Field>
          <Field label="Distance to Urban Market" hint={`${dist} km`}>
            <input data-testid="dist-slider" type="range" min="5" max="150" step="5" value={dist} onChange={(e) => setDist(e.target.value)} className="clay-range w-full" style={{ "--val": `${(dist / 150) * 100}%` }} />
          </Field>
          <button data-testid="calc-livelihood" onClick={calc} disabled={loading} className="w-full bg-forest hover:bg-forest-dark text-white rounded-lg h-12 font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
            <Flower2 size={18} /> {loading ? "Analysing…" : "Recommend Livelihood Crops"}
          </button>
        </Panel>

        <div className="space-y-4" ref={resultsRef} data-testid="advisor-results">
          {!res && (
            <div className="field-card p-10 text-center text-soil-variant">
              <Flower2 size={40} className="mx-auto text-sand-ochre" />
              <p className="mt-3 font-semibold text-soil">Set your land, water & capital to see flower and fruit options</p>
            </div>
          )}
          {res && res.recommendations.map((h, i) => (
            <div key={h.key} data-testid={`livelihood-card-${h.key}`} className={`field-card overflow-hidden ${h.type === "Flower" ? "border-l-4 border-l-bloom" : "border-l-4 border-l-marigold-dark"}`}>
              <div className="grid md:grid-cols-[200px_1fr]">
                <img src={IMAGES[h.key] || FALLBACK} alt={h.name} className="h-full w-full object-cover min-h-[160px]" />
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-soil">{h.name}</h3>
                        <span className="text-sm text-soil-variant font-deva">{h.name_hi}</span>
                      </div>
                      <p className="text-xs text-soil-variant">Variety: {h.variety}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {i === 0 && <Chip tone="forest">★ Top Match</Chip>}
                      <Chip tone={h.type === "Flower" ? "bloom" : "marigold"}>{h.type}</Chip>
                    </div>
                  </div>
                  <p className="text-sm text-soil-variant mt-2">{h.note}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                    {[
                      [CalendarClock, "Gestation", h.gestation],
                      [Wallet, "Setup Cost", h.setup_cost],
                      [TrendingUp, "Income", h.expected_income],
                      [MapPin, "Returns", h.returns_timeline],
                    ].map(([I, l, v], k) => (
                      <div key={k} className="bg-sand-container rounded-lg p-2.5">
                        <I size={14} className="text-clay" />
                        <div className="text-[10px] text-soil-variant mt-1">{l}</div>
                        <div className="font-bold text-soil text-xs leading-tight">{v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className="text-xs text-soil-variant">High demand:</span>
                    {h.high_demand_seasons.map((s) => <Chip key={s} tone="bloom">{s}</Chip>)}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-sand-ochre">
                    <span className="text-xs text-forest font-semibold">💰 {h.subsidy_pct}% MIDH capital subsidy</span>
                    <a href="/schemes" className="text-sm font-semibold text-clay flex items-center gap-1">MIDH Support <ArrowRight size={14} /></a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
