import React, { createContext, useContext, useState, useCallback } from "react";

/* ------------------------------------------------------------------ */
/* Language                                                            */
/* ------------------------------------------------------------------ */
const STR = {
  en: {
    tagline: "Digital Agricultural Advisory",
    search: "Search agri schemes, subsidies, seeds...",
    nav_home: "Hub Dashboard",
    nav_machinery: "Farm Machinery",
    nav_crops: "Crop Diversification",
    nav_livelihood: "Livelihood & Horticulture",
    nav_seeds: "Traditional Seeds",
    nav_schemes: "Govt Schemes",
    namaste: "Namaste",
    ask_veda: "Ask Veda Verde",
    speak_q: "Speak Your Farming Question",
    voice_mitra: "Voice Krishi Mitra",
    voice_desc: "Tap and speak directly. Ask about pest control, seed viability, or nearest diesel machinery rentals.",
    action_hub: "Personalized Action Hub",
    empirical: "EMPIRICAL FIELD MODULES",
    calculate: "Calculate",
    export_pdf: "Export Advisory",
    listen: "Listen",
    apply_now: "Apply Now",
    kisan_cc: "Kisan Call Centre",
    kcc_sub: "Toll-Free Agro Advisory Service",
  },
  hi: {
    tagline: "डिजिटल कृषि सलाहकार",
    search: "योजनाएँ, सब्सिडी, बीज खोजें...",
    nav_home: "मुख्य डैशबोर्ड",
    nav_machinery: "कृषि मशीनरी",
    nav_crops: "फसल विविधीकरण",
    nav_livelihood: "आजीविका एवं बागवानी",
    nav_seeds: "पारंपरिक बीज",
    nav_schemes: "सरकारी योजनाएँ",
    namaste: "नमस्ते",
    ask_veda: "वेदा वर्दे से पूछें",
    speak_q: "अपना कृषि प्रश्न बोलें",
    voice_mitra: "वॉइस कृषि मित्र",
    voice_desc: "टैप करें और सीधे बोलें। कीट नियंत्रण, बीज या नजदीकी मशीनरी किराये के बारे में पूछें।",
    action_hub: "व्यक्तिगत कार्य केंद्र",
    empirical: "क्षेत्र मॉड्यूल",
    calculate: "गणना करें",
    export_pdf: "सलाह निर्यात करें",
    listen: "सुनें",
    apply_now: "अभी आवेदन करें",
    kisan_cc: "किसान कॉल सेंटर",
    kcc_sub: "टोल-फ्री कृषि सलाह सेवा",
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");
  const t = useCallback((k) => (STR[lang] && STR[lang][k]) || STR.en[k] || k, [lang]);
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
export const useLang = () => useContext(LanguageContext);

/* ------------------------------------------------------------------ */
/* Chat (Veda Verde) open/close + voice trigger                        */
/* ------------------------------------------------------------------ */
const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [autoVoice, setAutoVoice] = useState(false);
  const openChat = useCallback((withVoice = false) => {
    setAutoVoice(withVoice);
    setOpen(true);
  }, []);
  return (
    <ChatContext.Provider value={{ open, setOpen, openChat, autoVoice, setAutoVoice }}>
      {children}
    </ChatContext.Provider>
  );
}
export const useChat = () => useContext(ChatContext);

/* ------------------------------------------------------------------ */
/* Web Speech helpers                                                  */
/* ------------------------------------------------------------------ */
export function speak(text, lang = "en") {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang === "hi" ? "hi-IN" : "en-IN";
  u.rate = 0.98;
  window.speechSynthesis.speak(u);
}

export function getRecognizer(lang = "en") {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;
  const r = new SR();
  r.lang = lang === "hi" ? "hi-IN" : "en-IN";
  r.interimResults = false;
  r.maxAlternatives = 1;
  return r;
}
