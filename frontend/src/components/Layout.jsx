import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Search, Mic, Languages, User, Phone } from "lucide-react";
import { useLang } from "@/store";
import VedaChat from "@/components/VedaChat";

export function Logo({ size = 40 }) {
  return (
    <img
      src="/logo.png"
      alt="Varta Verde emblem"
      width={size}
      height={size}
      data-testid="brand-logo-img"
      className="rounded-full bg-[#fbf7f1] ring-2 ring-sand/80 object-cover shrink-0"
      style={{ width: size, height: size }}
    />
  );
}

const NAV = [
  { to: "/", key: "nav_home", end: true },
  { to: "/machinery", key: "nav_machinery" },
  { to: "/crops", key: "nav_crops" },
  { to: "/livelihood", key: "nav_livelihood" },
  { to: "/seeds", key: "nav_seeds" },
  { to: "/schemes", key: "nav_schemes" },
];

function Navbar() {
  const { t, lang, setLang } = useLang();
  return (
    <header className="sticky top-0 z-40">
      {/* top bar */}
      <div className="bg-clay-dark text-sand">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-3">
          <NavLink to="/" className="flex items-center gap-2.5 shrink-0" data-testid="brand-logo">
            <Logo size={46} />
            <div className="leading-tight">
              <div className="font-extrabold text-lg tracking-tight">Varta Verde</div>
              <div className="text-[11px] text-sand/70 -mt-0.5">{t("tagline")}</div>
            </div>
          </NavLink>

          <div className="hidden md:flex flex-1 max-w-xl mx-auto">
            <div className="w-full flex items-center gap-2 bg-white/95 rounded-full px-4 h-10 text-soil">
              <Search size={17} className="text-clay" />
              <input
                data-testid="global-search"
                placeholder={t("search")}
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-soil-variant/60"
              />
              <Mic size={16} className="text-clay" />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              data-testid="lang-toggle"
              onClick={() => setLang(lang === "en" ? "hi" : "en")}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 transition-colors rounded-full pl-3 pr-3 h-9 text-sm font-semibold"
            >
              <Languages size={16} />
              {lang === "en" ? "English" : "हिंदी"}
            </button>
            <div className="h-9 w-9 rounded-full bg-clay grid place-items-center">
              <User size={17} />
            </div>
          </div>
        </div>
      </div>

      <div className="warli-band" />

      {/* module nav */}
      <nav className="bg-sand-low border-b border-sand-ochre">
        <div className="max-w-7xl mx-auto px-2 flex gap-1 overflow-x-auto">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              data-testid={`nav-${n.to === "/" ? "home" : n.to.slice(1)}`}
              className={({ isActive }) =>
                `whitespace-nowrap px-4 py-3 text-sm font-semibold border-b-[3px] transition-colors ${
                  isActive
                    ? "border-clay text-clay bg-white/60 rounded-t-md"
                    : "border-transparent text-soil-variant hover:text-clay"
                }`
              }
            >
              {t(n.key)}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  const { t } = useLang();
  return (
    <footer className="mt-16">
      <div className="warli-band" />
      <div className="bg-forest-deep text-sand/85">
        <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8 text-sm">
          <div>
            <h4 className="text-white font-bold text-base mb-2">{t("kisan_cc")}</h4>
            <p className="text-sand/70">{t("kcc_sub")}</p>
            <p className="text-marigold font-extrabold text-2xl mt-2">1800-180-1551</p>
            <p className="text-sand/60 text-xs mt-1">Available 6:00 AM – 10:00 PM (All 7 Days)</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-2">Krishi Vigyan Kendra (KVK)</h4>
            <p className="text-sand/70">Connect with your nearest district agricultural science center for soil testing, seed availability, and practical demonstrations.</p>
            <p className="text-marigold font-semibold mt-2 cursor-pointer">Find Nearest KVK Center ›</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-2">Field Offline Connectivity</h4>
            <p className="flex items-center gap-2 text-sand/80"><span className="h-2 w-2 rounded-full bg-marigold inline-block" /> Offline Sync Ready</p>
            <p className="text-sand/70 mt-2">Advisory bulletins, weather logs, and diagnostic keys cached locally for low-network field conditions.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-2">Government Integration</h4>
            <p className="text-sand/70">Integrated with Ministry of Agriculture & Farmers Welfare, PM-KISAN, and National Agriculture Market (e-NAM) standards.</p>
            <p className="text-sand/50 text-xs mt-3">© 2026 Varta Verde Digital Agricultural Advisory.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  return (
    <div className="App min-h-screen flex flex-col">
      <Navbar />
      <main key={pathname} className="flex-1 animate-fade-up">
        <Outlet />
      </main>
      <Footer />
      <VedaChat />
    </div>
  );
}
