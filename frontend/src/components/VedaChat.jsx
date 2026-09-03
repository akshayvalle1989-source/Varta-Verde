import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Mic, Volume2, Sprout } from "lucide-react";
import { useChat, useLang, speak, getRecognizer } from "@/store";
import { API } from "@/lib/api";

export default function VedaChat() {
  const { open, setOpen, openChat, autoVoice, setAutoVoice } = useChat();
  const { lang } = useLang();
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef(null);
  const recRef = useRef(null);

  const greet = lang === "hi"
    ? "नमस्ते! मैं वेदा वर्दे हूँ 🌱 मशीनरी, फसल, बागवानी, बीज या योजनाओं के बारे में पूछें।"
    : "Namaste! I'm Veda Verde 🌱 Ask me about machinery, crops, horticulture, seeds or government schemes.";

  useEffect(() => {
    if (open && msgs.length === 0) setMsgs([{ role: "bot", text: greet }]);
    // eslint-disable-next-line
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, loading]);

  useEffect(() => {
    if (open && autoVoice) {
      startVoice();
      setAutoVoice(false);
    }
    // eslint-disable-next-line
  }, [open, autoVoice]);

  const send = async (text) => {
    const q = (text ?? input).trim();
    if (!q || loading) return;
    setMsgs((m) => [...m, { role: "user", text: q }, { role: "bot", text: "", streaming: true }]);
    setInput("");
    setLoading(true);
    const patchLast = (fn) => setMsgs((m) => { const c = [...m]; c[c.length - 1] = fn(c[c.length - 1]); return c; });
    try {
      const r = await fetch(`${API}/chat/stream`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, lang, session_id: localStorage.getItem("veda_session") }),
      });
      if (!r.ok || !r.body) throw new Error("bad response");
      const reader = r.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const parts = buf.split("\n\n");
        buf = parts.pop();
        for (const p of parts) {
          if (!p.startsWith("data: ")) continue;
          const ev = JSON.parse(p.slice(6));
          if (ev.type === "start") localStorage.setItem("veda_session", ev.session_id);
          else if (ev.type === "token") patchLast((b) => ({ ...b, text: b.text + ev.content }));
          else if (ev.type === "done") patchLast((b) => ({ ...b, streaming: false, escalate: ev.escalate }));
        }
      }
      patchLast((b) => ({ ...b, streaming: false }));
    } catch (e) {
      patchLast((b) => ({ ...b, streaming: false, text: b.text || (lang === "hi" ? "नेटवर्क समस्या। कृपया पुनः प्रयास करें या 1800-180-1551 पर कॉल करें।" : "Network issue. Please try again or call 1800-180-1551."), escalate: !b.text }));
    } finally {
      setLoading(false);
    }
  };

  const startVoice = () => {
    const r = getRecognizer(lang);
    if (!r) {
      setMsgs((m) => [...m, { role: "bot", text: "Voice input isn't supported in this browser." }]);
      return;
    }
    recRef.current = r;
    setListening(true);
    r.onresult = (e) => {
      const said = e.results[0][0].transcript;
      setListening(false);
      send(said);
    };
    r.onerror = () => setListening(false);
    r.onend = () => setListening(false);
    r.start();
  };

  return (
    <>
      {!open && (
        <button
          data-testid="veda-fab"
          onClick={() => openChat(false)}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-verdant hover:bg-verdant-deep text-white pl-4 pr-5 h-14 rounded-full shadow-earth-lg transition-all hover:scale-105"
        >
          <span className="h-8 w-8 rounded-full bg-white/20 grid place-items-center"><Sprout size={18} /></span>
          <span className="font-semibold text-sm">{lang === "hi" ? "वेदा वर्दे" : "Ask Veda Verde"}</span>
        </button>
      )}

      {open && (
        <div
          data-testid="veda-panel"
          className="fixed bottom-5 right-5 z-50 w-[92vw] max-w-[380px] h-[560px] max-h-[80vh] bg-white rounded-2xl shadow-earth-lg border-[1.5px] border-sand-ochre flex flex-col overflow-hidden"
        >
          <div className="bg-verdant-deep text-white px-4 py-3 flex items-center gap-3">
            <span className="h-9 w-9 rounded-full bg-verdant grid place-items-center"><Sprout size={18} /></span>
            <div className="flex-1">
              <div className="font-bold leading-tight">Veda Verde</div>
              <div className="text-[11px] text-sand/70">AI Krishi Mitra • GPT-5 mini • {lang === "hi" ? "हिंदी" : "English"}</div>
            </div>
            <button data-testid="veda-close" onClick={() => setOpen(false)} className="p-1.5 hover:bg-white/10 rounded-full"><X size={18} /></button>
          </div>

          <div ref={scrollRef} className="veda-scroll flex-1 overflow-y-auto p-3 space-y-3 bg-sand-low">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  data-testid={`veda-msg-${m.role}`}
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-clay text-white rounded-br-sm"
                      : "bg-white border border-sand-ochre text-soil rounded-bl-sm"
                  }`}
                >
                  <span className="whitespace-pre-wrap">{m.text}</span>
                  {m.streaming && <span className="inline-block w-1.5 h-3.5 bg-verdant ml-1 animate-pulse align-middle" />}
                  {m.role === "bot" && !m.streaming && m.text && (
                    <button
                      onClick={() => speak(m.text, lang)}
                      className="ml-2 align-middle text-clay hover:text-clay-deep inline-flex"
                      title="Read aloud"
                    >
                      <Volume2 size={14} />
                    </button>
                  )}
                  {m.escalate && !m.streaming && (
                    <a href="tel:18001801551" data-testid="veda-helpline" className="block mt-2 text-xs font-semibold text-clay underline">📞 Kisan Call Centre 1800-180-1551</a>
                  )}
                </div>
              </div>
            ))}
            {loading && !msgs[msgs.length - 1]?.text && (
              <div className="flex justify-start"><div className="bg-white border border-sand-ochre rounded-2xl px-3 py-2 text-sm text-soil-variant animate-pulse">{lang === "hi" ? "सोच रही हूँ…" : "Thinking…"}</div></div>
            )}
          </div>

          {/* quick chips */}
          <div className="flex gap-1.5 px-3 pt-2 flex-wrap bg-sand-low">
            {[["Machinery for clay soil", "फसल सुझाव"], ["Best millet for drought", "बाजरा"], ["SMAM subsidy", "योजना"]].map((c, i) => (
              <button key={i} onClick={() => send(lang === "hi" ? c[1] : c[0])}
                className="text-[11px] bg-white border border-sand-ochre rounded-full px-2.5 py-1 text-soil-variant hover:border-clay hover:text-clay">
                {lang === "hi" ? c[1] : c[0]}
              </button>
            ))}
          </div>

          <div className="p-3 flex items-center gap-2 bg-sand-low">
            <button
              data-testid="veda-voice"
              onClick={startVoice}
              className={`h-11 w-11 shrink-0 rounded-full grid place-items-center transition-colors ${listening ? "bg-clay text-white animate-pulse" : "bg-sand-container text-clay hover:bg-sand-ochre"}`}
            >
              <Mic size={18} />
            </button>
            <input
              data-testid="veda-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={lang === "hi" ? "अपना प्रश्न लिखें..." : "Type your question..."}
              className="flex-1 h-11 rounded-full border-[1.5px] border-sand-ochre px-4 text-sm outline-none focus:border-clay bg-white"
            />
            <button data-testid="veda-send" onClick={() => send()} className="h-11 w-11 shrink-0 rounded-full bg-clay hover:bg-clay-deep text-white grid place-items-center">
              <Send size={17} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
