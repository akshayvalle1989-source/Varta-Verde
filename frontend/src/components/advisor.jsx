export function PageHeader({ title, subtitle, badge }) {
  return (
    <div className="bg-forest-deep text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">{title}</h1>
            <p className="text-sand/80 mt-3 text-sm md:text-base leading-relaxed">{subtitle}</p>
          </div>
          <div className="flex flex-col gap-2">
            {badge && <span className="text-xs bg-clay rounded-full px-3 py-1 font-semibold text-center">● {badge}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Panel({ title, step, children }) {
  return (
    <div className="field-card p-5 h-fit sticky top-40">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg text-soil">{title}</h2>
        {step && <span className="text-xs bg-sand-container text-clay-dark rounded-full px-3 py-1 font-semibold">{step}</span>}
      </div>
      {children}
    </div>
  );
}

export function Field({ label, hint, children }) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-soil">{label}</label>
        {hint && <span className="text-[11px] text-soil-variant">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export function OptionGrid({ options, value, onChange, cols = 2, testid }) {
  return (
    <div className={`grid gap-2 ${cols === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            data-testid={testid ? `${testid}-${o.value}` : undefined}
            onClick={() => onChange(o.value)}
            className={`text-left p-3 rounded-lg border-[1.5px] transition-all ${
              active ? "border-clay bg-sand-container ring-1 ring-clay" : "border-sand-ochre bg-white hover:border-clay/50"
            }`}
          >
            <div className="font-semibold text-sm text-soil flex items-center justify-between">
              {o.label}
              {active && <span className="h-2 w-2 rounded-full bg-clay" />}
            </div>
            {o.sub && <div className="text-[11px] text-soil-variant mt-0.5">{o.sub}</div>}
          </button>
        );
      })}
    </div>
  );
}

export function Segmented({ options, value, onChange, testid }) {
  return (
    <div className="inline-flex bg-sand-container rounded-lg p-1 gap-1">
      {options.map((o) => (
        <button
          key={o.value}
          data-testid={testid ? `${testid}-${o.value}` : undefined}
          onClick={() => onChange(o.value)}
          className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${
            value === o.value ? "bg-forest text-white" : "text-soil-variant hover:text-clay"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Chip({ children, tone = "sand" }) {
  const tones = {
    sand: "bg-sand-container border-sand-ochre text-clay-dark",
    forest: "bg-forest-sage border-forest text-forest",
    bloom: "bg-bloom-mist border-bloom-soft text-bloom-deep",
    marigold: "bg-marigold-light border-marigold-dark text-clay-dark",
  };
  return <span className={`text-[11px] font-semibold border rounded-full px-2.5 py-0.5 ${tones[tone]}`}>{children}</span>;
}
