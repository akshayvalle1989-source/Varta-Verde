"""Curated agronomic data distilled from the Varta Verde research guides:
- India_Farm_Machinery_Solutions_By_Soil_Type.md
- MILLET_DIVERSIFICATION_COMPLETE_A.md
- Comprehensive_Horticulture_Farm_Guide.md
Used to seed MongoDB collections and power the rule-based advisory engines.
"""

# ---------------------------------------------------------------------------
# SOIL x MACHINERY  (Farm Machinery Advisor)
# ---------------------------------------------------------------------------
SOIL_MACHINERY = [
    {
        "key": "heavy_clay",
        "name": "Heavy Clay / Black Cotton",
        "name_hi": "भारी चिकनी / काली कपास मिट्टी",
        "region": "Deccan Plateau (Maharashtra, MP, Karnataka, Gujarat, Telangana)",
        "coverage": "~20% of India",
        "characteristics": ["High clay (30-40%), swells & cracks", "Excellent moisture retention", "Heavy when wet, hard when dry", "Prone to permanent compaction"],
        "prime_mover": "25-30 HP Compact 4WD Tractor",
        "prime_mover_hp_min": 21.5,
        "implements": ["9-Tyne Spring-Loaded Cultivator", "Disc Plough (15-20 cm)", "Heavy-Duty Disc Harrow", "Low Ground-Pressure / Wide-Tread Tyres"],
        "secondary_implement": {"name": "Happy Seeder / Rotary Tiller (Rotavator 4ft)", "desc": "Direct drilling in crop residue without burning; slip-clutch protects against clay drag.", "specs": {"Tillage Depth": "8-10 cm", "Blade Count": "36 L-type"}},
        "fuel": "2.8 Litres / Hour", "fuel_note": "~35% less diesel burn than conventional 50 HP tractors",
        "optimal_speed": "4.2 - 5.5 km/h", "operating_depth": "12 - 15 cm",
        "warning": "Avoid heavy 45+ HP tractors on wet clay soil to prevent severe subsoil root compaction. Over-weight axles compress clay capillary spaces, causing delayed seedling emergence and surface waterlogging.",
        "critical_machine": "Wide-tread Tyres", "critical_cost": 50000, "subsidy_pct": 40,
        "chc_rate": 450, "chc_note": "KVK Block Hub has 28 HP tractors with matched rotavators for reservation within 6 km.",
    },
    {
        "key": "sandy_loam",
        "name": "Sandy Loam / Red & Yellow Soil",
        "name_hi": "बलुई दोमट / लाल-पीली मिट्टी",
        "region": "Central & South India (Tamil Nadu, Karnataka, Odisha, Chhattisgarh, AP)",
        "coverage": "~18% of India",
        "characteristics": ["High aeration, low draft resistance", "Low water retention, prone to crusting", "Slightly acidic (pH 5-6.5)", "Erosion-prone on slopes"],
        "prime_mover": "35-42 HP Lightweight 2WD Tractor",
        "prime_mover_hp_min": 30,
        "implements": ["Spring-Loaded Cultivator", "Conservation / No-Till Seeder", "Tine Harrow", "Drip Irrigation + Mulching Kit"],
        "secondary_implement": {"name": "No-Till Seeder + Mulch Layer", "desc": "Preserves fragile soil structure, reduces erosion and conserves scarce moisture.", "specs": {"Row Spacing": "22-30 cm", "Mulch": "Plastic / Organic"}},
        "fuel": "3.2 Litres / Hour", "fuel_note": "Lightweight frame avoids fuel waste on loose soils",
        "optimal_speed": "5.0 - 6.5 km/h", "operating_depth": "8 - 12 cm",
        "warning": "Avoid deep ploughing on slopes — use contour ploughing to prevent monsoon erosion. Mulching is mandatory for moisture retention.",
        "critical_machine": "Drip Irrigation", "critical_cost": 150000, "subsidy_pct": 50,
        "chc_rate": 400, "chc_note": "Nearest Custom Hiring Centre stocks spring-loaded cultivators and no-till seeders.",
    },
    {
        "key": "alluvial",
        "name": "Alluvial Soil (Indo-Gangetic Plains)",
        "name_hi": "जलोढ़ मिट्टी (सिंधु-गंगा मैदान)",
        "region": "Punjab, Haryana, Uttar Pradesh, Bihar, West Bengal",
        "coverage": "~40% of India",
        "characteristics": ["Highly fertile, rich in potash & lime", "Low nitrogen, fine-medium texture", "Excellent water retention & drainage", "Uniform, well-structured"],
        "prime_mover": "35-45 HP 4WD Tractor",
        "prime_mover_hp_min": 35,
        "implements": ["Laser Land Leveller", "Super Seeder (tillage + sowing)", "Mouldboard Plough (20-25 cm)", "Power Harrow"],
        "secondary_implement": {"name": "Happy Seeder (Residue Management)", "desc": "Direct sowing with straw management for rice-wheat systems; ends stubble burning.", "specs": {"Working Width": "6-7 ft", "Best For": "Rice-Wheat"}},
        "fuel": "3.5 Litres / Hour", "fuel_note": "Laser levelling saves 20-25% irrigation water",
        "optimal_speed": "5.5 - 7.0 km/h", "operating_depth": "20 - 25 cm",
        "warning": "Avoid ploughing when waterlogged to prevent compaction. Incorporate green manure every 2-3 years to replenish nitrogen.",
        "critical_machine": "Laser Leveller", "critical_cost": 250000, "subsidy_pct": 50,
        "chc_rate": 500, "chc_note": "Laser levellers available on custom hire at ₹500/hr through district CHC.",
    },
    {
        "key": "arid",
        "name": "Desert / Arid Sandy Soil",
        "name_hi": "मरुस्थलीय / शुष्क बलुई मिट्टी",
        "region": "Thar & Western Rajasthan, Gujarat",
        "coverage": "~4.4% of India",
        "characteristics": ["Sandy to gravel, very low clay", "Extremely low moisture retention", "Good drainage, poor fertility", "Responsive to irrigation & FYM"],
        "prime_mover": "35 HP Lightweight Tractor",
        "prime_mover_hp_min": 30,
        "implements": ["Spring-Loaded Cultivator", "Disc Harrow", "Bajra / Millet Seeder", "Drip + Mulch (essential)"],
        "secondary_implement": {"name": "Drip Irrigation + Underground Piping", "desc": "40-50% water savings in desert conditions; reduces evaporation vs surface channels.", "specs": {"Water Saving": "40-50%", "Mulch": "Essential"}},
        "fuel": "3.0 Litres / Hour", "fuel_note": "Avoid deep sand sinkage; keep axle load light",
        "optimal_speed": "4.5 - 6.0 km/h", "operating_depth": "8 - 12 cm",
        "warning": "Avoid heavy 50+ HP tractors in deep sand to prevent fuel waste and sinkage. Add 2-3 tons/ha organic matter annually.",
        "critical_machine": "Borewell Rig / Drip", "critical_cost": 550000, "subsidy_pct": 50,
        "chc_rate": 450, "chc_note": "Tractor-mounted borewell rigs and drip kits via Western Hub (Rajkot/Jaisalmer).",
    },
]

# ---------------------------------------------------------------------------
# CROP DIVERSIFICATION  (Millets & Oilseeds)
# ---------------------------------------------------------------------------
CROPS = [
    {
        "key": "pearl_millet", "name": "Pearl Millet (Bajra)", "name_hi": "बाजरा",
        "botanical": "Pennisetum glaucum", "category": "Millet",
        "season": ["Kharif"], "duration_days": "70-90", "yield_q_ha": "20-30",
        "water_mm": "400-600", "water_saving_vs_paddy": "70%", "msp": "₹2,150-2,500/q", "roi": "258%",
        "rainfall": ["Rainfed", "Drought-prone"], "soils": ["arid", "sandy_loam", "heavy_clay"],
        "zones": ["Arid/Semi-Arid", "Northwest Plains", "Deccan Plateau"],
        "best_varieties": ["Raj 171 (drought-hardy)", "HB 3 (water-stress tolerant)", "Pioneer HQ-36 (hybrid)"],
        "intercropping": "Bajra + Pigeon Pea (4:1) — adds ~₹1,20,000/ha & fixes nitrogen",
        "scheme": "NFSM", "note": "Most flexible crop (pH 6.0-8.5). Survives 250mm in extreme drought.",
        "market": ["Local", "Processing"],
    },
    {
        "key": "sorghum", "name": "Sorghum (Jowar)", "name_hi": "ज्वार",
        "botanical": "Sorghum bicolor", "category": "Millet",
        "season": ["Kharif", "Rabi"], "duration_days": "100-120", "yield_q_ha": "22-30",
        "water_mm": "400-500", "water_saving_vs_paddy": "60%", "msp": "₹2,970/q + stover", "roi": "1,018%",
        "rainfall": ["Rainfed", "Drought-prone"], "soils": ["heavy_clay", "sandy_loam", "arid"],
        "zones": ["Deccan Plateau", "Central Plateau", "Arid/Semi-Arid"],
        "best_varieties": ["CSH 13 (hybrid)", "CSV 15", "M 35-1 (dual-purpose)"],
        "intercropping": "Sorghum + Pigeon Pea (3:1) — grain + stover income up to ₹2,95,000/ha",
        "scheme": "NFSM", "note": "Highest ROI crop in India. Dual purpose: grain (food) + stover (fodder). Survives 50°C.",
        "market": ["Local", "Processing", "Export"],
    },
    {
        "key": "finger_millet", "name": "Finger Millet (Ragi)", "name_hi": "रागी / मंडुआ",
        "botanical": "Eleusine coracana", "category": "Millet",
        "season": ["Kharif", "Rabi"], "duration_days": "100-120", "yield_q_ha": "30-35",
        "water_mm": "600-900", "water_saving_vs_paddy": "40%", "msp": "₹3,400-3,600/q", "roi": "340%",
        "rainfall": ["Rainfed", "Irrigated"], "soils": ["sandy_loam", "heavy_clay"],
        "zones": ["South India", "Central Plateau", "Western Ghats"],
        "best_varieties": ["GPU 28 (high-yield)", "Indaf 8", "CO 12 (Tamil Nadu)"],
        "intercropping": "Ragi + Pigeon Pea (2:1) — traditional South India system, ~₹2,45,000/ha combined",
        "scheme": "NFSM", "note": "Calcium champion (344mg/100g) & iron-rich (28mg). Highest yield & MSP among millets.",
        "market": ["Local", "Processing", "Export"],
    },
    {
        "key": "foxtail_millet", "name": "Foxtail Millet (Kangni)", "name_hi": "कंगनी",
        "botanical": "Setaria italica", "category": "Millet",
        "season": ["Kharif"], "duration_days": "70-90", "yield_q_ha": "20-25",
        "water_mm": "400-500", "water_saving_vs_paddy": "65%", "msp": "₹2,850-3,500/q", "roi": "338%",
        "rainfall": ["Rainfed", "Drought-prone"], "soils": ["sandy_loam", "arid"],
        "zones": ["South India", "Deccan Plateau", "Arid/Semi-Arid"],
        "best_varieties": ["SiA 3085", "Prasad", "Lepakshi"],
        "intercropping": "Foxtail + Red gram — premium niche grain",
        "scheme": "NFSM", "note": "Premium export grain (₹15,000-20,000/ton). Value-add: pop, flour, health bars (10-20x grain price).",
        "market": ["Processing", "Export"],
    },
    {
        "key": "mustard", "name": "Mustard (Sarson)", "name_hi": "सरसों",
        "botanical": "Brassica juncea", "category": "Oilseed",
        "season": ["Rabi"], "duration_days": "110-140", "yield_q_ha": "12-18",
        "water_mm": "240-400", "water_saving_vs_paddy": "60%", "msp": "₹5,650/q", "roi": "180%",
        "rainfall": ["Irrigated", "Rainfed"], "soils": ["alluvial", "sandy_loam"],
        "zones": ["Northwest Plains", "Central Plateau"],
        "best_varieties": ["Pusa Bold", "RH 749", "Giriraj"],
        "intercropping": "Mustard border rows with chickpea/wheat",
        "scheme": "NFSM", "note": "Cool-season oilseed, low water need. Strong domestic oil demand.",
        "market": ["Local", "Processing"],
    },
    {
        "key": "groundnut", "name": "Groundnut (Moongphali)", "name_hi": "मूंगफली",
        "botanical": "Arachis hypogaea", "category": "Oilseed",
        "season": ["Kharif", "Rabi"], "duration_days": "100-130", "yield_q_ha": "15-25",
        "water_mm": "500-700", "water_saving_vs_paddy": "45%", "msp": "₹6,377/q", "roi": "160%",
        "rainfall": ["Rainfed", "Irrigated"], "soils": ["sandy_loam", "arid", "alluvial"],
        "zones": ["Deccan Plateau", "Arid/Semi-Arid", "South India"],
        "best_varieties": ["TAG 24", "GG 20", "Kadiri 6"],
        "intercropping": "Groundnut + Finger Millet (semi-arid) — diversified produce",
        "scheme": "NFSM", "note": "High-value oilseed + nitrogen fixation. Excellent in light sandy soils.",
        "market": ["Local", "Processing", "Export"],
    },
    {
        "key": "sesame", "name": "Sesame (Til)", "name_hi": "तिल",
        "botanical": "Sesamum indicum", "category": "Oilseed",
        "season": ["Kharif", "Zaid"], "duration_days": "80-95", "yield_q_ha": "4-8",
        "water_mm": "300-400", "water_saving_vs_paddy": "70%", "msp": "₹9,267/q", "roi": "210%",
        "rainfall": ["Rainfed", "Drought-prone"], "soils": ["sandy_loam", "arid"],
        "zones": ["Central Plateau", "Arid/Semi-Arid"],
        "best_varieties": ["TKG 22", "RT 351", "GT 10"],
        "intercropping": "Sesame + pulses in light soils",
        "scheme": "NFSM", "note": "Very low water need, high price realisation. Good export premium.",
        "market": ["Export", "Processing"],
    },
]

# ---------------------------------------------------------------------------
# LIVELIHOOD DIVERSIFICATION  (Horticulture, Flowers, Fruits)
# ---------------------------------------------------------------------------
HORTICULTURE = [
    {
        "key": "marigold", "name": "African Marigold (Genda)", "name_hi": "गेंदा",
        "type": "Flower", "gestation": "60-75 days to first bloom", "setup_cost": "₹40,000-60,000 / acre",
        "returns_timeline": "Weekly harvest for 3-4 months", "min_land": 0.25, "water": "Moderate", "capital": "Low",
        "market_distance_km": 40, "high_demand_seasons": ["Dussehra", "Diwali", "Wedding season (Nov-Feb)"],
        "expected_income": "₹1,50,000-2,00,000 / acre / cycle", "subsidy_pct": 40, "scheme": "MIDH",
        "variety": "Pusa Narangi Genda", "note": "Frequent weekly cash flow; high festival demand; low investment.",
    },
    {
        "key": "jasmine", "name": "Jasmine (Mogra)", "name_hi": "मोगरा / चमेली",
        "type": "Flower", "gestation": "5-6 months to first yield", "setup_cost": "₹80,000-1,20,000 / acre",
        "returns_timeline": "Daily plucking, yields for 8-10 years", "min_land": 0.25, "water": "Moderate", "capital": "Medium",
        "market_distance_km": 30, "high_demand_seasons": ["Summer (Apr-Jun)", "Wedding & temple season"],
        "expected_income": "₹2,50,000-3,50,000 / acre / year", "subsidy_pct": 40, "scheme": "MIDH",
        "variety": "Gundumalli / Ramanathapuram Gundumalli", "note": "Perennial, daily income, strong temple & perfume demand.",
    },
    {
        "key": "tuberose", "name": "Tuberose (Rajnigandha)", "name_hi": "रजनीगंधा",
        "type": "Flower", "gestation": "90-100 days", "setup_cost": "₹70,000-90,000 / acre",
        "returns_timeline": "Cut flowers for 2-3 years", "min_land": 0.5, "water": "Moderate-High", "capital": "Medium",
        "market_distance_km": 50, "high_demand_seasons": ["Wedding season", "Festivals"],
        "expected_income": "₹2,00,000-3,00,000 / acre / year", "subsidy_pct": 40, "scheme": "MIDH",
        "variety": "Prajwal / Phule Rajani", "note": "Premium cut-flower for bouquets & garlands.",
    },
    {
        "key": "dragon_fruit", "name": "Dragon Fruit", "name_hi": "ड्रैगन फ्रूट",
        "type": "Fruit", "gestation": "12-18 months to first fruit", "setup_cost": "₹4,00,000-6,00,000 / acre",
        "returns_timeline": "Peak yield from year 3, lasts 20+ years", "min_land": 1.0, "water": "Low", "capital": "High",
        "market_distance_km": 80, "high_demand_seasons": ["Jun-Nov (fruiting)"],
        "expected_income": "₹6,00,000-10,00,000 / acre / year at maturity", "subsidy_pct": 50, "scheme": "MIDH",
        "variety": "Red-fleshed (Siam Red)", "note": "High-value urban & export demand; drought-tolerant cactus crop.",
    },
    {
        "key": "papaya", "name": "Papaya", "name_hi": "पपीता",
        "type": "Fruit", "gestation": "9-11 months to first harvest", "setup_cost": "₹1,50,000-2,00,000 / acre",
        "returns_timeline": "Continuous harvest for 2-3 years", "min_land": 0.5, "water": "Medium", "capital": "Medium",
        "market_distance_km": 40, "high_demand_seasons": ["Year-round"],
        "expected_income": "₹3,00,000-4,50,000 / acre / year", "subsidy_pct": 50, "scheme": "MIDH",
        "variety": "Red Lady / Pusa Nanha", "note": "Fast returns among fruit crops; steady year-round market.",
    },
    {
        "key": "guava", "name": "Guava (Amrood)", "name_hi": "अमरूद",
        "type": "Fruit", "gestation": "2-3 years to bearing", "setup_cost": "₹1,20,000-1,80,000 / acre",
        "returns_timeline": "Bears for 25-30 years", "min_land": 1.0, "water": "Low-Medium", "capital": "Medium",
        "market_distance_km": 50, "high_demand_seasons": ["Winter (Nov-Feb)", "Monsoon"],
        "expected_income": "₹2,50,000-4,00,000 / acre / year", "subsidy_pct": 50, "scheme": "MIDH",
        "variety": "Allahabad Safeda / L-49 (Sardar)", "note": "Hardy, low maintenance, long orchard life.",
    },
    {
        "key": "pomegranate", "name": "Pomegranate (Anar)", "name_hi": "अनार",
        "type": "Fruit", "gestation": "2-3 years", "setup_cost": "₹2,50,000-3,50,000 / acre",
        "returns_timeline": "Bears for 25+ years", "min_land": 1.0, "water": "Low", "capital": "High",
        "market_distance_km": 100, "high_demand_seasons": ["Festivals", "Export windows"],
        "expected_income": "₹4,00,000-6,00,000 / acre / year", "subsidy_pct": 50, "scheme": "MIDH",
        "variety": "Bhagwa / Arakta", "note": "Arid-zone premium fruit with strong export value.",
    },
]

# ---------------------------------------------------------------------------
# LANDRACES / TRADITIONAL SEEDS
# ---------------------------------------------------------------------------
LANDRACES = [
    {
        "key": "desi_bajra", "name": "Desi Bajra Landrace", "name_hi": "देसी बाजरा",
        "native_region": "Rajasthan, Gujarat", "states": ["Rajasthan", "Gujarat", "Haryana"],
        "strengths": ["Extreme drought tolerance", "Heat resilience up to 45°C", "Low input need"],
        "pest_resistance": ["Downy mildew tolerance", "Shoot fly resistance"],
        "salinity": "Moderate", "nutrition": ["High iron", "High fibre"],
        "organic_protocol": "FYM 5t/ha + jeevamrit; zero synthetic sprays; seed treatment with beejamrit.",
        "seed_bank": "Community Seed Bank, Barmer (KVK) + Sahaja Samrudha network",
    },
    {
        "key": "moth_bean", "name": "Moth Bean (Desi Matki)", "name_hi": "मोठ / मटकी",
        "native_region": "Western Rajasthan", "states": ["Rajasthan", "Gujarat"],
        "strengths": ["Thrives on marginal arid soils", "Nitrogen fixing", "Very low water"],
        "pest_resistance": ["Natural bollworm repellence", "Yellow mosaic tolerance"],
        "salinity": "Moderate-High", "nutrition": ["High protein", "High zinc"],
        "organic_protocol": "Rhizobium seed inoculation; intercrop with bajra; no chemical fertiliser needed.",
        "seed_bank": "Arid Legumes Gene Bank, Jodhpur",
    },
    {
        "key": "kalajeera_rice", "name": "Kalajeera Aromatic Rice", "name_hi": "कालाजीरा चावल",
        "native_region": "Koraput, Odisha", "states": ["Odisha", "Chhattisgarh"],
        "strengths": ["Aromatic premium grain", "Adapted to rainfed uplands"],
        "pest_resistance": ["Stem borer tolerance", "Blast resistance"],
        "salinity": "Low", "nutrition": ["High iron", "Aromatic antioxidants"],
        "organic_protocol": "SRI method + organic compost; traditional beushening; premium organic certification.",
        "seed_bank": "MS Swaminathan Community Gene Bank, Koraput",
    },
    {
        "key": "navara_rice", "name": "Navara Medicinal Rice", "name_hi": "नवरा चावल",
        "native_region": "Kerala", "states": ["Kerala", "Tamil Nadu"],
        "strengths": ["Ayurvedic medicinal value", "Short duration (60-90 days)"],
        "pest_resistance": ["Field pest tolerance"],
        "salinity": "Low", "nutrition": ["Medicinal starch", "GI-tagged"],
        "organic_protocol": "Fully organic wetland cultivation; panchagavya foliar sprays.",
        "seed_bank": "Navara Rice Farmers Society, Palakkad",
    },
    {
        "key": "gandhakasala", "name": "Rajamudi / Aromatic Landrace", "name_hi": "राजमुडी",
        "native_region": "Karnataka", "states": ["Karnataka"],
        "strengths": ["Red aromatic rice", "Traditional royal variety", "Nutrient dense"],
        "pest_resistance": ["Good field tolerance"],
        "salinity": "Low", "nutrition": ["High iron & zinc", "Fibre rich"],
        "organic_protocol": "Organic paddy with green manure (dhaincha); community seed saving.",
        "seed_bank": "Sahaja Samrudha Seed Network, Mysuru",
    },
]

# ---------------------------------------------------------------------------
# GOVERNMENT SCHEMES
# ---------------------------------------------------------------------------
SCHEMES = [
    {
        "key": "smam", "name": "Sub-Mission on Agricultural Mechanization (SMAM)",
        "name_hi": "कृषि यंत्रीकरण उप-मिशन (SMAM)",
        "domain": "Farm Machinery Advisor", "sector": "Central Sector",
        "tagline": "40% to 50% Direct Subsidy", "benefit_ceiling": "Up to ₹1,25,000",
        "benefit": "Direct DBT financial grant for tractor-drawn rotavators, laser levellers, and solar pumping modules. Custom Hiring Centres get up to 80% capital aid.",
        "eligibility": ["Small & Marginal farmers", "Women cultivators", "Registered SC/ST agriculturists", "Farmer Producer Organisations (FPOs)"],
        "documents": ["Aadhaar linked to active bank + mobile number", "Updated Land Record (Khatauni / RoR / 7-12 Extract)", "Bank passbook with clear IFSC / cancelled cheque", "Valid equipment quotation from authorised manufacturer/dealer"],
        "apply_url": "https://agrimachinery.nic.in/", "apply_label": "Apply on Agricoop Portal",
        "closes_in_days": 18,
    },
    {
        "key": "midh", "name": "Mission for Integrated Development of Horticulture (MIDH)",
        "name_hi": "बागवानी के एकीकृत विकास हेतु मिशन (MIDH)",
        "domain": "Livelihood Advisor", "sector": "Horticulture",
        "tagline": "40% – 50% Assistance", "benefit_ceiling": "Polyhouse & Drip Sets",
        "benefit": "High-value protected floriculture, cut-flower polyhouses, pack houses and orchards. Assistance for micro-irrigation, drip and shade nets.",
        "eligibility": ["Individual flower & fruit growers with assured water", "Self-Help Groups (SHGs)", "Joint Liability Groups (JLGs)", "Farmer Cooperatives"],
        "documents": ["Land Possession Certificate (LPC) or registered lease (>10 years)", "Detailed Project Report (DPR) by District Horticulture Officer", "Water & Soil Testing Report from accredited lab", "Aadhaar-seeded bank account statement"],
        "apply_url": "https://midh.gov.in/", "apply_label": "Apply via MIDH Portal",
        "closes_in_days": 30,
    },
    {
        "key": "nfsm", "name": "National Food Security Mission (NFSM) – Nutri-Cereals",
        "name_hi": "राष्ट्रीय खाद्य सुरक्षा मिशन (NFSM) – पोषक अनाज",
        "domain": "Crop Diversification Advisor", "sector": "Crops & Millets",
        "tagline": "Free Seed Minikits + Direct Aid", "benefit_ceiling": "₹6,000 / Hectare Demo Grant",
        "benefit": "Encouraging climate-resilient Bajra, Ragi, Jowar and minor millet clusters. High-density drought-tolerant hybrid seed packs delivered via KVK blocks; demo aid paid via DBT.",
        "eligibility": ["Farmers in recognised agro-climatic dryland zones", "Priority to smallholders diversifying out of water-intensive paddy", "Individual & cluster farmers"],
        "documents": ["Kisan Credit Card (KCC) or Aadhaar Card", "Sowing Declaration & Crop-Area Verification by Patwari/VAA", "Active Bank Account linked to PM-KISAN database"],
        "apply_url": "https://www.nfsm.gov.in/", "apply_label": "Register on NFSM Portal",
        "closes_in_days": 25,
    },
    {
        "key": "pkvy", "name": "Paramparagat Krishi Vikas Yojana (PKVY)",
        "name_hi": "परंपरागत कृषि विकास योजना (PKVY)",
        "domain": "Landrace Advisor", "sector": "Traditional Seeds & Bio-Farming",
        "tagline": "₹50,000 / Hectare (3-Year)", "benefit_ceiling": "₹31,000 Direct Cash (Bio-Inputs)",
        "benefit": "Promotes organic farming through cluster approach & PGS-India certification. ₹31,000/ha for organic conversion & manures, ₹19,000/ha for PGS certification, packaging & branding.",
        "eligibility": ["Cluster of 20+ farmers with 20-50 ha contiguous land", "Committed to zero synthetic chemical application", "Farmer clusters practising organic/traditional farming"],
        "documents": ["Cluster Formation Resolution (signed by Group Lead)", "Participatory Guarantee System (PGS-India) Registration Form", "Land Map showing contiguous field boundaries"],
        "apply_url": "https://pgsindia-ncof.gov.in/", "apply_label": "Register PGS Organic Cluster",
        "closes_in_days": 45,
    },
]

# ---------------------------------------------------------------------------
# SUCCESS STORIES
# ---------------------------------------------------------------------------
SUCCESS_STORIES = [
    {
        "key": "harish", "title": "How Harish Choudhary Saved ₹42,000 on Irrigation and Fertilizers",
        "block": "MANDORE BLOCK",
        "body": "By switching 0.8 hectares to organic pearl millet intercropped with moth beans, Harish cut his diesel tractor hours in half and obtained premium organic certified pricing at the Jodhpur mandi.",
        "verified_by": "Verified by KVK Barmer Agronomist",
        "image": "https://images.unsplash.com/photo-1696371268939-5c5710319bde?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    },
]
