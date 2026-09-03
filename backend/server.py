from fastapi import FastAPI, APIRouter
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import json
import uuid
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone

import seed_data
import veda_agent

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Varta Verde API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# --------------------------------------------------------------------------
# Seeding
# --------------------------------------------------------------------------
async def seed_collection(name, docs, key="key"):
    coll = db[name]
    await coll.delete_many({})
    if docs:
        await coll.insert_many([{**d} for d in docs])
    logger.info(f"Seeded {len(docs)} docs into {name}")


@app.on_event("startup")
async def seed_db():
    await seed_collection("soil_machinery", seed_data.SOIL_MACHINERY)
    await seed_collection("crops", seed_data.CROPS)
    await seed_collection("horticulture", seed_data.HORTICULTURE)
    await seed_collection("landraces", seed_data.LANDRACES)
    await seed_collection("schemes", seed_data.SCHEMES)
    await seed_collection("success_stories", seed_data.SUCCESS_STORIES)


def clean(doc):
    doc.pop("_id", None)
    return doc


# --------------------------------------------------------------------------
# Health / meta
# --------------------------------------------------------------------------
@api_router.get("/")
async def root():
    return {"message": "Varta Verde API running", "modules": 4}


@api_router.get("/dashboard")
async def dashboard():
    schemes = [clean(s) for s in await db.schemes.find().to_list(100)]
    stories = [clean(s) for s in await db.success_stories.find().to_list(10)]
    return {
        "farmer": {"name": "Ramesh Ji", "name_hi": "राम-रामसा", "khasra": "Khasra No. 104/2 • Barmer Rural",
                    "parcel": "1.5-hectare clay-loam parcel", "ph": "7.4",
                    "moisture": "Good (62%)", "pest_risk": "Low / Safe", "cycle": "Zaid / Kharif prep"},
        "schemes": schemes,
        "stories": stories,
    }


# --------------------------------------------------------------------------
# Farm Machinery Advisor
# --------------------------------------------------------------------------
class MachineryInput(BaseModel):
    area: float = 1.5
    area_unit: str = "acres"        # acres | hectares
    soil: str = "heavy_clay"
    topography: str = "flat"        # flat | slope | terraced
    tillage: str = "zero"           # zero | conventional
    power: str = "diesel"           # diesel | electric
    lang: str = "en"                # en | hi
    notes: str = ""                 # crop grown / free-text farmer notes


@api_router.post("/advisor/machinery")
async def advise_machinery(inp: MachineryInput):
    return await build_machinery_plan(inp)


MACHINERY_MD = (ROOT_DIR / "data" / "India_Farm_Machinery_Solutions_By_Soil_Type.md").read_text(encoding="utf-8")

SOIL_LABELS = {"heavy_clay": "Heavy Clay / Black Cotton soil", "sandy_loam": "Sandy Loam / Red & Yellow soil",
               "alluvial": "Alluvial soil (Indo-Gangetic plains)", "arid": "Desert / Arid sandy soil"}


def _machinery_prompt(inp: "MachineryInput", plan: dict) -> str:
    lang_line = ("Write the entire advisory in simple Hindi (Devanagari script). Keep machine names in English inside brackets."
                 if inp.lang == "hi" else "Write in clear, simple English suitable for an Indian smallholder farmer.")
    return f"""FARMER PROFILE
- Holding size: {inp.area} {inp.area_unit} ({plan['tier']})
- Soil: {SOIL_LABELS.get(inp.soil, inp.soil)}
- Topography: {inp.topography}
- Cultivation practice: {'Zero / minimum tillage (conservation agriculture)' if inp.tillage == 'zero' else 'Conventional deep tillage'}
- Power source preference: {inp.power}
- Crop / farmer notes: {inp.notes.strip() or 'not provided'}

RULE-ENGINE SHORTLIST (already shown to farmer as cards; validate, refine or challenge it using the guide):
- Prime mover: {plan['prime_mover']['title']}
- Implements: {', '.join(plan['implements'])}
- Paired implement: {plan['secondary_implement']['name']}

{lang_line}
Produce a personalised machinery advisory with these markdown sections (## headings, short bullets, no tables):
## Advisor's Assessment  (2-3 sentences on what this soil + holding size demand)
## Recommended Prime Mover  (HP range, 2WD/4WD, tyre/ballast guidance, buy vs Custom Hiring Centre for this holding size)
## Implement Set & Sequence  (primary tillage → secondary → sowing → intercultural → harvest; explain WHY each suits the soil)
## Avoid / Cautions  (specific compaction, moisture, slope or timing mistakes for this soil)
## Cost, Subsidy & Next Steps  (indicative costs from the guide, SMAM/CHC route, 3 concrete next steps)
Keep it under 450 words. Cite figures (HP, depth, cost) only when they appear in the guide or the shortlist."""


@api_router.post("/advisor/machinery/ai")
async def advise_machinery_ai(inp: MachineryInput):
    from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone

    plan = await build_machinery_plan(inp)
    session_id = str(uuid.uuid4())

    async def gen():
        yield f"data: {json.dumps({'type': 'cards', 'plan': plan, 'session_id': session_id})}\n\n"
        system = ("You are Varta Verde's Farm Machinery Advisor, an agricultural mechanisation expert for India. "
                  "Ground every recommendation primarily in the reference guide below; you may add well-established "
                  "general agronomy/mechanisation knowledge when the guide is silent, and say so briefly. Never invent "
                  "scheme names, prices or HP figures not supported by the guide.\n\n=== REFERENCE GUIDE ===\n" + MACHINERY_MD)
        chat = LlmChat(api_key=os.environ["EMERGENT_LLM_KEY"], session_id=session_id,
                       system_message=system).with_model("openai", "gpt-5.4-mini")
        full = []
        try:
            async for ev in chat.stream_message(UserMessage(text=_machinery_prompt(inp, plan))):
                if isinstance(ev, TextDelta):
                    full.append(ev.content)
                    yield f"data: {json.dumps({'type': 'token', 'content': ev.content})}\n\n"
                elif isinstance(ev, StreamDone):
                    break
        except Exception as e:
            logger.exception("machinery AI stream failed")
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"
            return
        await db.machinery_advisories.insert_one({
            "session_id": session_id, "input": inp.model_dump(), "plan": plan,
            "advisory": "".join(full), "created_at": datetime.now(timezone.utc).isoformat(),
        })
        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    return StreamingResponse(gen(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})


async def build_machinery_plan(inp: MachineryInput):
    soil = await db.soil_machinery.find_one({"key": inp.soil})
    if not soil:
        soil = await db.soil_machinery.find_one({"key": "heavy_clay"})
    soil = clean(soil)

    acres = inp.area * (2.47 if inp.area_unit == "hectares" else 1)
    if acres < 2:
        tier = "Smallholder Farmer Tier"
    elif acres <= 12:
        tier = "Medium Holding Tier"
    else:
        tier = "Commercial Holding Tier"

    prime = soil["prime_mover"]
    implements = list(soil["implements"])
    secondary = dict(soil["secondary_implement"])

    # Conservation / zero-till override
    if inp.tillage == "zero":
        secondary = {"name": "Happy Seeder / Zero-Till Drill",
                      "desc": "Direct drilling in crop residue without burning; slip-clutch protects against soil drag. Ideal for Conservation Agriculture.",
                      "specs": {"Tillage Depth": "8-10 cm", "Practice": "Conservation Agriculture"}}
        if "Happy Seeder" not in " ".join(implements):
            implements.insert(0, "Zero-Till Seed Drill")

    if inp.topography == "slope":
        implements.append("Contour Ploughing Attachment")
    elif inp.topography == "terraced":
        implements.append("Walk-Behind Power Tiller (terrace)")

    return {
        "tier": tier,
        "soil_name": soil["name"],
        "match_summary": f"Matched for {inp.area} {inp.area_unit.capitalize()[:2]} • {soil['name']}",
        "prime_mover": {
            "title": soil["prime_mover"],
            "prime": prime,
            "fuel": soil["fuel"], "fuel_note": soil["fuel_note"],
            "optimal_speed": soil["optimal_speed"], "operating_depth": soil["operating_depth"],
            "pto_power": f"{soil['prime_mover_hp_min']} HP min",
        },
        "warning": soil["warning"],
        "implements": implements,
        "secondary_implement": secondary,
        "subsidy": {
            "scheme": "SMAM",
            "capital_grant": f"{soil['subsidy_pct']}% to {min(soil['subsidy_pct']+10,50)}% Subsidy",
            "ceiling": "₹2,50,000",
            "chc_rate": f"₹{soil['chc_rate']} / Hour Rental",
            "chc_note": soil["chc_note"],
        },
        "characteristics": soil["characteristics"],
    }


# --------------------------------------------------------------------------
# Crop Diversification Advisor
# --------------------------------------------------------------------------
class CropInput(BaseModel):
    zone: str = "Arid/Semi-Arid"
    season: str = "Kharif"
    rainfall: str = "Rainfed"       # Irrigated | Rainfed | Drought-prone
    market: str = "Local"           # Local | Processing | Export
    soil: Optional[str] = None


@api_router.post("/advisor/crops")
async def advise_crops(inp: CropInput):
    crops = [clean(c) for c in await db.crops.find().to_list(100)]
    scored = []
    for c in crops:
        score = 0
        if inp.zone in c["zones"]:
            score += 3
        if inp.season in c["season"]:
            score += 2
        if inp.rainfall in c["rainfall"]:
            score += 3
        if inp.market in c["market"]:
            score += 1
        if inp.soil and inp.soil in c["soils"]:
            score += 2
        if score > 0:
            c["_score"] = score
            scored.append(c)
    scored.sort(key=lambda x: x["_score"], reverse=True)
    if not scored:
        scored = crops
    return {"recommendations": scored[:5], "top": scored[0] if scored else None}


# --------------------------------------------------------------------------
# Livelihood / Horticulture Advisor
# --------------------------------------------------------------------------
class LivelihoodInput(BaseModel):
    land: float = 0.5               # acres available
    water: str = "Moderate"         # Low | Moderate | High
    capital: str = "Low"            # Low | Medium | High
    market_distance: int = 40       # km


CAP_ORDER = {"Low": 1, "Medium": 2, "High": 3}


@api_router.post("/advisor/livelihood")
async def advise_livelihood(inp: LivelihoodInput):
    items = [clean(h) for h in await db.horticulture.find().to_list(100)]
    result = []
    for h in items:
        score = 0
        if inp.land >= h["min_land"]:
            score += 3
        if CAP_ORDER.get(inp.capital, 1) >= CAP_ORDER.get(h["capital"], 1):
            score += 3
        else:
            score -= 2
        if inp.market_distance <= h["market_distance_km"]:
            score += 2
        h["_score"] = score
        result.append(h)
    result.sort(key=lambda x: x["_score"], reverse=True)
    return {"recommendations": result[:5], "top": result[0] if result else None}


# --------------------------------------------------------------------------
# Landrace / Traditional Seed Advisor
# --------------------------------------------------------------------------
class SeedInput(BaseModel):
    state: str = "Rajasthan"
    pest: Optional[str] = None
    salinity: str = "Low"           # Low | Moderate | High
    nutrition: Optional[str] = None


@api_router.post("/advisor/seeds")
async def advise_seeds(inp: SeedInput):
    items = [clean(l) for l in await db.landraces.find().to_list(100)]
    scored = []
    for l in items:
        score = 0
        if inp.state in l["states"]:
            score += 4
        if inp.pest and any(inp.pest.lower() in p.lower() for p in l["pest_resistance"]):
            score += 3
        if inp.nutrition and any(inp.nutrition.lower() in n.lower() for n in l["nutrition"]):
            score += 2
        if l["salinity"] and inp.salinity.lower() in l["salinity"].lower():
            score += 1
        l["_score"] = score
        scored.append(l)
    scored.sort(key=lambda x: x["_score"], reverse=True)
    return {"recommendations": scored[:5], "top": scored[0] if scored else None}


# --------------------------------------------------------------------------
# Government Schemes
# --------------------------------------------------------------------------
@api_router.get("/schemes")
async def get_schemes(q: Optional[str] = None, category: Optional[str] = None):
    schemes = [clean(s) for s in await db.schemes.find().to_list(100)]
    if category and category not in ("All", "all"):
        schemes = [s for s in schemes if category.lower() in s["sector"].lower()]
    if q:
        ql = q.lower()
        schemes = [s for s in schemes if ql in s["name"].lower() or ql in s["benefit"].lower() or ql in s["sector"].lower()]
    return {"schemes": schemes}


class EligibilityInput(BaseModel):
    profile: str = "Small & Marginal Farmer"
    state: str = "Pan-India"


@api_router.post("/schemes/eligibility")
async def check_eligibility(inp: EligibilityInput):
    schemes = [clean(s) for s in await db.schemes.find().to_list(100)]
    eligible = []
    p = inp.profile.lower()
    for s in schemes:
        crit = " ".join(s["eligibility"]).lower()
        ok = True
        if "women" in p and "women" not in crit:
            ok = ok  # women still broadly eligible
        eligible.append({"key": s["key"], "name": s["name"], "eligible": True, "tagline": s["tagline"]})
    return {"eligible_count": len(eligible), "total": len(schemes), "schemes": eligible,
            "tier_note": "Maximum Assistance Tier: smallholders receive higher subsidy rates (up to 50% on machinery), priority seed minikits, and fast-track soil cluster funds."}


# --------------------------------------------------------------------------
# Veda Verde  — rule-based conversational assistant (over seeded data)
# --------------------------------------------------------------------------
class ChatInput(BaseModel):
    message: str
    lang: str = "en"


def _kw(text, words):
    return any(w in text for w in words)


@api_router.post("/chat")
async def chat(inp: ChatInput):
    t = inp.message.lower()
    hi = inp.lang == "hi"
    confidence = 0.9

    if _kw(t, ["hello", "hi ", "namaste", "namaskar", "hey", "नमस्ते"]) and len(t) < 25:
        msg = ("नमस्ते! मैं वेदा वर्दे हूँ 🌱 मशीनरी, फसल, बागवानी, बीज या सरकारी योजनाओं के बारे में पूछें।"
               if hi else
               "Namaste! I am Veda Verde 🌱 Ask me about machinery, crops, horticulture, seeds, or government schemes.")
        return {"reply": msg, "confidence": confidence, "intent": "greeting"}

    # Machinery
    if _kw(t, ["tractor", "machine", "machinery", "rotavator", "plough", "implement", "hp", "मशीन", "ट्रैक्टर"]):
        soils = [clean(s) for s in await db.soil_machinery.find().to_list(10)]
        chosen = next((s for s in soils if any(w in t for w in s["name"].lower().split())), soils[0])
        reply = (f"{chosen['name']} के लिए सुझाव: {chosen['prime_mover']}। ⚠ {chosen['warning'][:120]}... SMAM योजना में {chosen['subsidy_pct']}% तक सब्सिडी उपलब्ध है।"
                 if hi else
                 f"For {chosen['name']}, use a {chosen['prime_mover']} with a {chosen['secondary_implement']['name']}. Fuel use ~{chosen['fuel']}. ⚠ {chosen['warning'][:140]}... You can claim up to {chosen['subsidy_pct']}% subsidy under SMAM.")
        return {"reply": reply, "confidence": confidence, "intent": "machinery"}

    # Schemes
    if _kw(t, ["scheme", "subsidy", "smam", "midh", "nfsm", "pkvy", "loan", "grant", "योजना", "सब्सिडी"]):
        schemes = [clean(s) for s in await db.schemes.find().to_list(10)]
        chosen = next((s for s in schemes if s["key"] in t or s["key"].upper().lower() in t), schemes[0])
        reply = (f"{chosen['name']}: {chosen['tagline']}. पात्रता: {', '.join(chosen['eligibility'][:2])}। पोर्टल: {chosen['apply_url']}"
                 if hi else
                 f"{chosen['name']} offers {chosen['tagline']} ({chosen['benefit_ceiling']}). Eligibility includes {', '.join(chosen['eligibility'][:2])}. Apply at {chosen['apply_url']}.")
        return {"reply": reply, "confidence": confidence, "intent": "schemes"}

    # Crops / millets
    if _kw(t, ["crop", "millet", "bajra", "ragi", "jowar", "sorghum", "oilseed", "mustard", "groundnut", "diversif", "फसल", "बाजरा", "रागी"]):
        crops = [clean(c) for c in await db.crops.find().to_list(20)]
        chosen = next((c for c in crops if any(w in t for w in [c["name"].lower(), c["name_hi"]])), crops[0])
        reply = (f"{chosen['name']} ({chosen['name_hi']}): पानी की जरूरत {chosen['water_mm']}mm, उपज {chosen['yield_q_ha']} q/ha, MSP {chosen['msp']}, ROI {chosen['roi']}। {chosen['intercropping']}"
                 if hi else
                 f"{chosen['name']} needs only {chosen['water_mm']}mm water ({chosen['water_saving_vs_paddy']} less than paddy), yields {chosen['yield_q_ha']} q/ha at MSP {chosen['msp']} (ROI {chosen['roi']}). Tip: {chosen['intercropping']}.")
        return {"reply": reply, "confidence": confidence, "intent": "crops"}

    # Horticulture
    if _kw(t, ["flower", "marigold", "jasmine", "fruit", "dragon", "papaya", "guava", "pomegranate", "horticultur", "livelihood", "फूल", "गेंदा", "बागवानी"]):
        items = [clean(h) for h in await db.horticulture.find().to_list(20)]
        chosen = next((h for h in items if any(w in t for w in [h["name"].lower(), h["name_hi"]])), items[0])
        reply = (f"{chosen['name']}: सेटअप लागत {chosen['setup_cost']}, आय {chosen['expected_income']}, MIDH में {chosen['subsidy_pct']}% सब्सिडी। मांग: {', '.join(chosen['high_demand_seasons'][:2])}"
                 if hi else
                 f"{chosen['name']} — setup ~{chosen['setup_cost']}, income {chosen['expected_income']}, with {chosen['subsidy_pct']}% MIDH subsidy. Peak demand: {', '.join(chosen['high_demand_seasons'][:2])}.")
        return {"reply": reply, "confidence": confidence, "intent": "horticulture"}

    # Seeds / landraces
    if _kw(t, ["seed", "landrace", "indigenous", "traditional", "desi", "organic", "बीज", "देसी"]):
        items = [clean(l) for l in await db.landraces.find().to_list(20)]
        chosen = items[0]
        reply = (f"{chosen['name']} ({chosen['native_region']}): {', '.join(chosen['strengths'][:2])}। बीज बैंक: {chosen['seed_bank']}"
                 if hi else
                 f"{chosen['name']} from {chosen['native_region']} offers {', '.join(chosen['strengths'][:2])} and resists {', '.join(chosen['pest_resistance'][:1])}. Source seeds at: {chosen['seed_bank']}.")
        return {"reply": reply, "confidence": confidence, "intent": "seeds"}

    # Fallback (low confidence -> KVK escalation)
    fallback = ("मुझे यकीन नहीं है। कृपया मशीनरी, फसल, बागवानी, बीज या योजना चुनें — या नजदीकी KVK अधिकारी से 1800-180-1551 पर संपर्क करें।"
                if hi else
                "I'm not fully sure about that. Try asking about machinery, crops, horticulture, seeds, or schemes — or reach your local KVK officer at the Kisan Call Centre 1800-180-1551.")
    return {"reply": fallback, "confidence": 0.4, "intent": "fallback", "escalate": True}


class ChatStreamInput(BaseModel):
    message: str
    lang: str = "en"
    session_id: Optional[str] = None


@api_router.post("/chat/stream")
async def chat_stream(inp: ChatStreamInput):
    from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone

    message = inp.message.strip()[:1200]
    session_id = inp.session_id or str(uuid.uuid4())
    history = await db.chat_messages.find({"session_id": session_id}, {"_id": 0, "role": 1, "text": 1}).sort("ts", 1).to_list(20)

    async def gen():
        yield f"data: {json.dumps({'type': 'start', 'session_id': session_id})}\n\n"
        if not message:
            yield f"data: {json.dumps({'type': 'done'})}\n\n"
            return
        llm = LlmChat(api_key=os.environ["EMERGENT_LLM_KEY"], session_id=session_id,
                      system_message=veda_agent.system_prompt(inp.lang)).with_model("openai", "gpt-5-mini")
        full, tail = [], ""
        try:
            async for ev in llm.stream_message(UserMessage(text=veda_agent.build_user_turn(message, history, inp.lang))):
                if isinstance(ev, TextDelta):
                    tail += ev.content
                    # hold back a small tail so the [[HELPLINE]] marker never leaks to the UI
                    if len(tail) > len(veda_agent.HELPLINE_MARK) + 4:
                        cut = len(tail) - len(veda_agent.HELPLINE_MARK)
                        emit, tail = tail[:cut], tail[cut:]
                        full.append(emit)
                        yield f"data: {json.dumps({'type': 'token', 'content': emit})}\n\n"
                elif isinstance(ev, StreamDone):
                    break
        except Exception:
            logger.exception("Veda LLM stream failed; falling back to rule engine")
            fb = await chat(ChatInput(message=message, lang=inp.lang))
            yield f"data: {json.dumps({'type': 'token', 'content': fb['reply']})}\n\n"
            yield f"data: {json.dumps({'type': 'done', 'escalate': bool(fb.get('escalate'))})}\n\n"
            return
        escalate = veda_agent.HELPLINE_MARK in tail
        tail = tail.replace(veda_agent.HELPLINE_MARK, "").rstrip()
        if tail:
            full.append(tail)
            yield f"data: {json.dumps({'type': 'token', 'content': tail})}\n\n"
        reply = "".join(full).strip()
        now = datetime.now(timezone.utc).isoformat()
        await db.chat_messages.insert_many([
            {"session_id": session_id, "role": "user", "text": message, "lang": inp.lang, "ts": now},
            {"session_id": session_id, "role": "bot", "text": reply, "escalate": escalate, "lang": inp.lang, "ts": now + "1"},
        ])
        yield f"data: {json.dumps({'type': 'done', 'escalate': escalate})}\n\n"

    return StreamingResponse(gen(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
