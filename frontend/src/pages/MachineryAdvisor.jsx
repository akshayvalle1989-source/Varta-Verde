import { useState } from "react";
import { Sliders, Tractor, AlertTriangle, Fuel, Gauge, Ruler, Zap, Building2, Download, Mic, Sprout } from "lucide-react";
import { PageHeader, Panel, Field, OptionGrid, Segmented, Chip } from "@/components/advisor";
import { useLang, useChat } from "@/store";
import { api } from "@/lib/api";

const SOILS = [
  { value: "heavy_clay", label: "Heavy Clay", sub: "High shear strength, compacts rapidly" },
  { value: "sandy_loam", label: "Sandy Loam", sub: "High aeration, low draft resistance" },
  { value: "alluvial", label: "Alluvial", sub: "Fertile, well-structured plains" },
  { value: "arid", label: "Desert / Arid", sub: "Loose sand, low moisture" },
];

export default function MachineryAdvisor() {
  const { t, lang } = useLang();
  const { openChat } = useChat();
  const [area, setArea] = useState(1.5);
  const [unit, setUnit] = useState("acres");
  const [soil, setSoil] = useState("heavy_clay");
  const [topo, setTopo] = useState("flat");
  const [tillage, setTillage] = useState("zero");
  const [power, setPower] = useState("diesel");
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);

  const calc = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/advisor/machinery", {
        area: Number(area), area_unit: unit, soil, topography: topo, tillage, power,
      });
      setRes(data);
    } finally {
      setLoading(false);
    }
  };

  const maxArea = unit === "acres" ? 15 : 6;
  const pct = Math.min(100, (area / maxArea) * 100);

  return (
    <div>
      <PageHeader
        title={lang === "hi" ? "कस्टम कृषि मशीनरी सलाहकार" : "Customized Farm Machinery Advisor"}
        subtitle={lang === "hi" ? "मिट्टी-अनुकूल ट्रैक्टर व यंत्रों से मिट्टी की क्षति और डीजल खपत कम करें।" : "Prevent soil structural degradation and minimize diesel consumption with soil-matched tractor implements and custom power sizing."}
        badge="SMAM Subsidy Active (FY 25-26)"
      />

      <div className="max-w-7xl mx-auto px-4 py-6 grid lg:grid-cols-[380px_1fr] gap-5">
        {/* Input panel */}
        <Panel title={<span className="flex items-center gap-2"><Sliders size={18} className="text-clay" /> Farm & Soil Profile</span>} step="Step 1 of 1">
          <Field label="Total Holding Size" hint={<Segmented testid="unit" options={[{ value: "acres", label: "Acres" }, { value: "hectares", label: "Hectares" }]} value={unit} onChange={setUnit} />}>
            <div className="bg-sand-container rounded-lg p-4">
              <div className="flex items-end gap-2">
                <span className="text-4xl font-extrabold text-soil tabular-nums">{area}</span>
                <span className="text-sm text-soil-variant mb-1">{unit === "acres" ? "Acres" : "Hectares"}</span>
                <span className="ml-auto text-[11px] bg-clay text-white rounded-full px-2 py-1 font-semibold">{res?.tier || "Smallholder Farmer Tier"}</span>
              </div>
              <input
                data-testid="area-slider" type="range" min="0.25" max={maxArea} step="0.25"
                value={area} onChange={(e) => setArea(e.target.value)}
                className="clay-range w-full mt-3" style={{ "--val": `${pct}%` }}
              />
              <div className="flex justify-between text-[10px] text-soil-variant mt-1">
                <span>0.25 (Marginal)</span><span>{maxArea / 2}</span><span>{maxArea}+ (Commercial)</span>
              </div>
            </div>
          </Field>

          <Field label="Soil Density & Texture" hint="Hardpan risk factor">
            <OptionGrid testid="soil" options={SOILS} value={soil} onChange={setSoil} />
          </Field>

          <Field label="Field Topography & Grade">
            <OptionGrid testid="topo" cols={1} options={[
              { value: "flat", label: "Flat Plain (0-2%)" },
              { value: "slope", label: "Gentle Slope (3-8%)" },
              { value: "terraced", label: "Terraced / Bunded" },
            ]} value={topo} onChange={setTopo} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Primary Cultivation">
              <OptionGrid testid="tillage" cols={1} options={[
                { value: "zero", label: "Zero / Min Tillage" },
                { value: "conventional", label: "Deep Tillage" },
              ]} value={tillage} onChange={setTillage} />
            </Field>
            <Field label="Power Source">
              <OptionGrid testid="power" cols={1} options={[
                { value: "diesel", label: "Diesel / CHC" },
                { value: "electric", label: "Electric Grid" },
              ]} value={power} onChange={setPower} />
            </Field>
          </div>

          <button
            data-testid="calc-machinery"
            onClick={calc} disabled={loading}
            className="w-full bg-forest hover:bg-forest-dark text-white rounded-lg h-12 font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
          >
            <Tractor size={18} /> {loading ? "Calculating…" : "Calculate Machinery & Implements"}
          </button>
        </Panel>

        {/* Results */}
        <div className="space-y-4">
          {!res && (
            <div className="field-card p-10 text-center text-soil-variant">
              <Tractor size={40} className="mx-auto text-sand-ochre" />
              <p className="mt-3 font-semibold text-soil">Set your farm profile and tap Calculate</p>
              <p className="text-sm">We'll match a soil-appropriate prime mover, implements & subsidies.</p>
            </div>
          )}

          {res && (
            <>
              {/* Prime mover */}
              <div className="field-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 bg-forest-deep text-white">
                  <span className="text-xs font-bold tracking-wide">RECOMMENDED PRIME MOVER · {res.match_summary}</span>
                  <button className="text-xs flex items-center gap-1.5 hover:text-marigold-light"><Download size={14} /> {t("export_pdf")}</button>
                </div>
                <div className="p-5 grid md:grid-cols-[200px_1fr] gap-5">
                  <img src="https://images.unsplash.com/photo-1763800758293-40b0658f2141?crop=entropy&cs=srgb&fm=jpg&q=85&w=600" alt="Tractor" className="rounded-lg h-32 w-full object-cover" />
                  <div>
                    <h3 className="text-xl font-bold text-soil">{res.prime_mover.title}</h3>
                    <Chip tone="forest">Optimal for {res.soil_name}</Chip>
                    <p className="text-sm text-soil-variant mt-2 flex items-center gap-2"><Fuel size={16} className="text-clay" /> <b>{res.prime_mover.fuel}</b> ({res.prime_mover.fuel_note})</p>
                  </div>
                </div>
                {/* warning */}
                <div className="mx-5 mb-5 bg-clay/10 border border-clay/30 rounded-lg p-4 flex gap-3">
                  <AlertTriangle size={20} className="text-clay shrink-0" />
                  <div><p className="font-bold text-clay-deep text-sm">Safety & Agronomic Warning</p><p className="text-sm text-soil-variant mt-1">{res.warning}</p></div>
                </div>
                <div className="mx-5 mb-5 grid grid-cols-3 gap-3">
                  {[[Gauge, "Optimal Speed", res.prime_mover.optimal_speed], [Ruler, "Operating Depth", res.prime_mover.operating_depth], [Zap, "PTO Power Req.", res.prime_mover.pto_power]].map(([I, l, v], i) => (
                    <div key={i} className="bg-sand-container rounded-lg p-3 text-center">
                      <I size={16} className="mx-auto text-clay" />
                      <div className="text-[11px] text-soil-variant mt-1">{l}</div>
                      <div className="font-bold text-soil text-sm">{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Secondary implement + implement list */}
              <div className="field-card p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-soil flex items-center gap-2"><Sprout size={18} className="text-forest" /> Recommended Implement Pairing</h3>
                  <Chip tone="marigold">Straw Management Ready</Chip>
                </div>
                <div className="mt-3 grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-soil">{res.secondary_implement.name}</h4>
                    <p className="text-sm text-soil-variant mt-1">{res.secondary_implement.desc}</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {Object.entries(res.secondary_implement.specs).map(([k, v]) => <Chip key={k}>{k}: {v}</Chip>)}
                    </div>
                  </div>
                  <div className="bg-sand-container rounded-lg p-3">
                    <p className="text-xs font-semibold text-soil-variant mb-2">Full Implement Set</p>
                    <ul className="space-y-1.5">
                      {res.implements.map((im) => <li key={im} className="text-sm text-soil flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-clay" /> {im}</li>)}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Subsidy */}
              <div className="field-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 bg-clay-dark text-white">
                  <span className="font-bold flex items-center gap-2"><Building2 size={18} /> Govt Subsidies & Community Rental</span>
                  <span className="text-[10px] bg-marigold text-clay-dark rounded-full px-2 py-1 font-bold">SMAM SCHEME APPROVED</span>
                </div>
                <div className="p-5 grid md:grid-cols-2 gap-4">
                  <div className="bg-forest-sage rounded-lg p-4">
                    <p className="text-[11px] font-bold text-forest uppercase">Capital Purchase Grant</p>
                    <p className="text-2xl font-extrabold text-soil mt-1">{res.subsidy.capital_grant}</p>
                    <p className="text-xs text-soil-variant mt-1">For Small/Marginal & Women farmers under SMAM via Direct Benefit Transfer (DBT). Max Ceiling: {res.subsidy.ceiling}</p>
                  </div>
                  <div className="bg-sand-container rounded-lg p-4">
                    <p className="text-[11px] font-bold text-clay-dark uppercase">Custom Hiring Centre (CHC)</p>
                    <p className="text-2xl font-extrabold text-soil mt-1">{res.subsidy.chc_rate}</p>
                    <p className="text-xs text-soil-variant mt-1">{res.subsidy.chc_note}</p>
                  </div>
                </div>
                <div className="px-5 pb-5 flex flex-wrap gap-3">
                  <a href="https://agrimachinery.nic.in/" target="_blank" rel="noreferrer" className="bg-forest hover:bg-forest-dark text-white rounded-lg px-5 h-11 text-sm font-semibold flex items-center gap-2"><Building2 size={16} /> Apply for Subsidy via DBT Portal</a>
                  <button className="border border-sand-ochre rounded-lg px-5 h-11 text-sm font-semibold flex items-center gap-2 text-soil"><Download size={16} /> Download Implement Spec Sheet (PDF)</button>
                  <button onClick={() => openChat(false)} className="border border-clay text-clay rounded-lg px-5 h-11 text-sm font-semibold flex items-center gap-2 ml-auto"><Mic size={16} /> {t("ask_veda")}</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
