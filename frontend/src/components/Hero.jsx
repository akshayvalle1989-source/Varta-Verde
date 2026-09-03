import { Link } from "react-router-dom";
import { Mic, ArrowRight, Globe2, Leaf, Wind, Droplets, FlaskConical, Sprout, Landmark } from "lucide-react";

const PILLARS = [
  { icon: Droplets, en: "Landscape-level water conservation", hi: "भू-दृश्य स्तर पर जल संरक्षण" },
  { icon: FlaskConical, en: "Reduce reliance on synthetic inputs", hi: "रासायनिक इनपुट पर निर्भरता कम करें" },
  { icon: Wind, en: "Accelerate soil carbon sequestration", hi: "मृदा कार्बन संचयन को गति दें" },
  { icon: Sprout, en: "Drought-hardy native landraces & climate-resilient practices", hi: "सूखा-सहनशील देसी किस्में व जलवायु-लचीली पद्धतियाँ" },
  { icon: Globe2, en: "Achieve the Sustainable Development Goals", hi: "सतत विकास लक्ष्यों (SDG) की प्राप्ति" },
  { icon: Leaf, en: "Mission LiFE — Lifestyle for Environment", hi: "मिशन LiFE — पर्यावरण अनुकूल जीवनशैली" },
];

const PHOTOS = [
  { src: "/farmers/farmer-smile.jpg", alt: "Smiling Indian farmer in turban", cls: "col-span-2 row-span-2" },
  { src: "/farmers/women-green-field.jpg", alt: "Women farmers working in a green field, Gujarat", cls: "" },
  { src: "/farmers/farmer-sky.jpg", alt: "Farmer standing proudly in his field", cls: "" },
  { src: "/farmers/women-paddy.jpg", alt: "Women farmers in a paddy field", cls: "" },
  { src: "/farmers/paddy-team.jpg", alt: "Farmers transplanting rice in Kuttanad", cls: "" },
];

export function Hero({ t, lang, openChat }) {
  const hi = lang === "hi";
  return (
    <section data-testid="home-hero" className="rounded-2xl overflow-hidden shadow-earth bg-gradient-to-br from-clay-dark via-clay-deep to-clay text-white">
      <div className="p-6 md:p-8 grid lg:grid-cols-[1.25fr_1fr] gap-8 items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase bg-black/20 rounded-full px-3 py-1">
            <Sprout size={13} className="text-marigold-light" /> {hi ? "आपका व्यक्तिगत कृषि मित्र" : "Your Personalised Krishi Mitra"}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mt-4 leading-[1.1]">
            {hi ? <>खेती जो धरती को भी <span className="text-marigold-light">समृद्ध</span> करे</> : <>Farming that leaves the land <span className="text-marigold-light">richer</span> than it found it</>}
          </h1>
          <p className="text-sand/90 mt-4 max-w-xl text-sm md:text-base leading-relaxed" data-testid="hero-intro">
            {hi
              ? "ISRO के अनुसार भारत की 30% भूमि पहले ही क्षरित हो चुकी है और कृषि हमारे तेज़ी से घटते भूजल का 85% उपयोग करती है — हमारी पारिस्थितिक स्थिरता एक निर्णायक मोड़ पर है। वर्ता वर्दे स्थानीय मिट्टी, जलवायु और बाज़ार के आँकड़ों का विश्लेषण कर सटीक कृषि सलाह देता है और छोटे किसानों को पात्र सरकारी सततता सब्सिडी से सहजता से जोड़ता है।"
              : <>With ISRO reporting that <b className="text-white">30% of India's land is already degraded</b> and agriculture consuming <b className="text-white">85% of our rapidly depleting groundwater</b>, our ecological stability has reached a critical tipping point. Varta Verde helps reverse this trajectory by analyzing localized soil, climate, and market data to deliver hyper-targeted agronomic advice while seamlessly connecting smallholders to eligible government sustainability subsidies.</>}
          </p>
          <p className="text-sand/80 mt-3 max-w-xl text-sm leading-relaxed">
            {hi
              ? "सूखा-सहनशील देसी फसलों और जलवायु-लचीली पद्धतियों को बढ़ावा देकर वर्ता वर्दे ग्रामीण समुदायों को सशक्त बनाता है कि वे:"
              : "Through the promotion of drought-hardy native crops (landraces) and climate-resilient practices, Varta Verde empowers rural communities to:"}
          </p>

          <ul className="grid sm:grid-cols-2 gap-x-5 gap-y-2.5 mt-4" data-testid="hero-pillars">
            {PILLARS.map((p, i) => {
              const I = p.icon;
              return (
                <li key={i} className="flex items-center gap-2.5 text-sm font-medium text-sand animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
                  <span className="h-7 w-7 rounded-lg bg-white/10 grid place-items-center shrink-0"><I size={15} className="text-marigold-light" /></span>
                  {hi ? p.hi : p.en}
                </li>
              );
            })}
          </ul>

          <div className="flex flex-wrap gap-3 mt-7">
            <Link to="/schemes" data-testid="hero-schemes-cta" className="bg-marigold hover:bg-marigold-light text-clay-dark rounded-full pl-5 pr-4 h-12 font-bold flex items-center gap-2 transition-colors shadow-lg">
              <Landmark size={18} /> {hi ? "मेरी सरकारी योजना खोजें" : "Find My Govt Scheme"} <ArrowRight size={17} />
            </Link>
            <button data-testid="speak-question-btn" onClick={() => openChat(true)} className="bg-white/10 hover:bg-white/20 border border-white/25 text-white rounded-full px-5 h-12 font-semibold flex items-center gap-2 transition-colors">
              <Mic size={17} /> {t("speak_q")}
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-3 grid-rows-2 gap-2.5 h-[300px] md:h-[360px]" data-testid="farmer-montage">
            {PHOTOS.map((p, i) => (
              <div key={i} className={`relative overflow-hidden rounded-xl ring-1 ring-white/20 ${p.cls} animate-fade-up`} style={{ animationDelay: `${120 + i * 90}ms` }}>
                <img src={p.src} alt={p.alt} loading={i === 0 ? "eager" : "lazy"} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
            ))}
          </div>
          <div className="absolute -bottom-3 left-3 right-3 md:left-6 md:right-6 bg-white text-soil rounded-xl px-4 py-3 shadow-earth flex items-center gap-3">
            <span className="h-9 w-9 rounded-full bg-verdant text-white grid place-items-center shrink-0"><Mic size={17} /></span>
            <div className="flex-1 leading-tight">
              <div className="font-bold text-sm">{t("voice_mitra")}</div>
              <div className="text-[11px] text-soil-variant">{hi ? "हिंदी या अंग्रेज़ी में बोलें — वेदा वर्दे सुन रही है" : "Speak in Hindi or English — Veda Verde is listening"}</div>
            </div>
            <span className="text-[10px] bg-sand-container text-clay-dark rounded-full px-2 py-0.5 font-semibold shrink-0">हिंदी • EN</span>
          </div>
        </div>
      </div>
      <div className="h-4" />
    </section>
  );
}
