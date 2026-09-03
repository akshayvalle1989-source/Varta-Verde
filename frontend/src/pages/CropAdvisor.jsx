import { useState } from "react";
import { Sliders, Wheat, Droplets, TrendingUp, Sprout, ShieldCheck, ArrowRight } from "lucide-react";
import { PageHeader, Panel, Field, OptionGrid, Chip } from "@/components/advisor";
import { useLang } from "@/store";
import { api } from "@/lib/api";

const ZONES = [
  { value: "Arid/Semi-Arid", label: "Arid / Semi-Arid", sub: "Rajasthan, Gujarat" },
  { value: "Deccan Plateau", label: "Deccan Plateau", sub: "Maharashtra, Karnataka" },
  { value: "Central Plateau", label: "Central Plateau", sub: "MP, Chhattisgarh" },
  { value: "South India", label: "South India", sub: "Tamil Nadu, Karnataka" },
  { value: "Northwest Plains", label: "Northwest Plains", sub: "Punjab, Haryana" },
  { value: "Western Ghats", label: "Western Ghats", sub: "Kerala, W. Karnataka" },
];

export default function CropAdvisor() {
  const { lang } = useLang();
  const [zone, setZone] = useState("Arid/Semi-Arid");
  const [season, setSeason] = useState("Kharif");
  const [rainfall, setRainfall] = useState("Rainfed");
  const [market, setMarket] = useState("Local");
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);

  const calc = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/advisor/crops", { zone, season, rainfall, market });
      setRes(data);
    } finally { setLoading(false); }
  };

  return (
    <div>
      <PageHeader
        title={lang === "hi" ? "फसल विविधीकरण सलाहकार" : "Crop Diversification Advisor"}
        subtitle={lang === "hi" ? "जलवायु-सहनशील बाजरा और तिलहन जो 70% तक कम सिंचाई में उगते हैं और MSP से सुरक्षित हैं।" : "Climate-resilient millets & oilseeds needing up to 70% less irrigation than water-guzzling crops, secured under Government MSP."}
        badge="NFSM Nutri-Cereals Active"
        hideListen
      />

      <div className="max-w-7xl mx-auto px-4 py-6 grid lg:grid-cols-[380px_1fr] gap-5">
        <Panel title={<span className="flex items-center gap-2"><Sliders size={18} className="text-clay" /> Agro-Climatic Profile</span>} step="Step 1 of 1">
          <Field label="Agro-Climatic Zone / District">
            <OptionGrid testid="zone" cols={1} options={ZONES} value={zone} onChange={setZone} />
          </Field>
          <Field label="Season">
            <OptionGrid testid="season" options={[
              { value: "Kharif", label: "Kharif" }, { value: "Rabi", label: "Rabi" }, { value: "Zaid", label: "Zaid" },
            ]} value={season} onChange={setSeason} />
          </Field>
          <Field label="Rainfall Availability">
            <OptionGrid testid="rainfall" cols={1} options={[
              { value: "Irrigated", label: "Irrigated" },
              { value: "Rainfed", label: "Rainfed" },
              { value: "Drought-prone", label: "Drought-prone" },
            ]} value={rainfall} onChange={setRainfall} />
          </Field>
          <Field label="Target Market">
            <OptionGrid testid="market" options={[
              { value: "Local", label: "Local Mandi" },
              { value: "Processing", label: "Processing" },
              { value: "Export", label: "Export" },
            ]} value={market} onChange={setMarket} />
          </Field>
          <button data-testid="calc-crops" onClick={calc} disabled={loading} className="w-full bg-forest hover:bg-forest-dark text-white rounded-lg h-12 font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
            <Wheat size={18} /> {loading ? "Analysing…" : "Recommend Crops"}
          </button>
        </Panel>

        <div className="space-y-4">
          {!res && (
            <div className="field-card p-10 text-center text-soil-variant">
              <Wheat size={40} className="mx-auto text-sand-ochre" />
              <p className="mt-3 font-semibold text-soil">Choose your zone & conditions to see millet & oilseed matches</p>
            </div>
          )}
          {res && res.recommendations.map((c, i) => (
            <div key={c.key} data-testid={`crop-card-${c.key}`} className={`field-card p-5 ${i === 0 ? "border-l-4 border-l-forest" : ""}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-soil">{c.name}</h3>
                    <span className="text-sm text-soil-variant font-deva">{c.name_hi}</span>
                  </div>
                  <p className="text-xs italic text-soil-variant">{c.botanical}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {i === 0 && <Chip tone="forest">★ Top Match</Chip>}
                  <Chip tone={c.category === "Millet" ? "marigold" : "bloom"}>{c.category}</Chip>
                </div>
              </div>

              <p className="text-sm text-soil-variant mt-2">{c.note}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                {[
                  [Droplets, "Water", `${c.water_mm}mm`],
                  [Wheat, "Yield", `${c.yield_q_ha} q/ha`],
                  [TrendingUp, "MSP", c.msp],
                  [ShieldCheck, "ROI", c.roi],
                ].map(([I, l, v], k) => (
                  <div key={k} className="bg-sand-container rounded-lg p-3">
                    <I size={15} className="text-clay" />
                    <div className="text-[11px] text-soil-variant mt-1">{l}</div>
                    <div className="font-bold text-soil text-sm">{v}</div>
                  </div>
                ))}
              </div>

              <div className="mt-3 bg-forest-sage rounded-lg p-3">
                <p className="text-xs font-semibold text-forest flex items-center gap-1.5"><Droplets size={13} /> Saves {c.water_saving_vs_paddy} water vs paddy</p>
                <p className="text-sm text-soil mt-1"><b>Intercropping:</b> {c.intercropping}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="text-xs text-soil-variant">Best varieties:</span>
                {c.best_varieties.map((v) => <Chip key={v}>{v}</Chip>)}
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-sand-ochre">
                <span className="text-xs text-forest font-semibold flex items-center gap-1"><ShieldCheck size={14} /> Linked scheme: {c.scheme}</span>
                <a href="/schemes" className="text-sm font-semibold text-clay flex items-center gap-1">View {c.scheme} Support <ArrowRight size={14} /></a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
