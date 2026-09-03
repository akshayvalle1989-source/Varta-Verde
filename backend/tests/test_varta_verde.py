"""Backend tests for Varta Verde platform"""
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://pdf-guide-site.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# --- Health & Dashboard ---
def test_root(client):
    r = client.get(f"{API}/")
    assert r.status_code == 200
    assert "Varta Verde" in r.json()["message"]


def test_dashboard(client):
    r = client.get(f"{API}/dashboard")
    assert r.status_code == 200
    data = r.json()
    assert "farmer" in data and data["farmer"]["name"]
    assert isinstance(data["schemes"], list) and len(data["schemes"]) >= 2
    assert isinstance(data["stories"], list) and len(data["stories"]) >= 1


# --- Machinery ---
def test_machinery_advisor(client):
    payload = {"area": 1.5, "area_unit": "acres", "soil": "heavy_clay",
               "topography": "flat", "tillage": "zero", "power": "diesel"}
    r = client.post(f"{API}/advisor/machinery", json=payload)
    assert r.status_code == 200
    d = r.json()
    assert d["prime_mover"]["title"]
    assert d["warning"]
    assert d["subsidy"]["scheme"] == "SMAM"
    assert isinstance(d["implements"], list)
    assert "Happy Seeder" in d["secondary_implement"]["name"] or "Zero-Till" in d["secondary_implement"]["name"]


def test_machinery_slope(client):
    payload = {"area": 5, "area_unit": "acres", "soil": "sandy_loam",
               "topography": "slope", "tillage": "conventional", "power": "diesel"}
    r = client.post(f"{API}/advisor/machinery", json=payload)
    assert r.status_code == 200
    d = r.json()
    assert any("Contour" in i for i in d["implements"])


# --- Crops ---
def test_crops_advisor(client):
    r = client.post(f"{API}/advisor/crops", json={
        "zone": "Arid/Semi-Arid", "season": "Kharif", "rainfall": "Rainfed", "market": "Local"})
    assert r.status_code == 200
    d = r.json()
    assert len(d["recommendations"]) > 0
    top = d["top"]
    assert "name" in top and "water_mm" in top and "msp" in top


# --- Livelihood ---
def test_livelihood_advisor(client):
    r = client.post(f"{API}/advisor/livelihood", json={
        "land": 0.5, "water": "Moderate", "capital": "Low", "market_distance": 40})
    assert r.status_code == 200
    d = r.json()
    assert len(d["recommendations"]) > 0
    assert "name" in d["top"]


# --- Seeds ---
def test_seeds_advisor(client):
    r = client.post(f"{API}/advisor/seeds", json={
        "state": "Rajasthan", "salinity": "Low"})
    assert r.status_code == 200
    d = r.json()
    assert len(d["recommendations"]) > 0


# --- Schemes ---
def test_schemes_list(client):
    r = client.get(f"{API}/schemes")
    assert r.status_code == 200
    assert len(r.json()["schemes"]) > 0


def test_schemes_filter(client):
    r = client.get(f"{API}/schemes", params={"category": "Horticulture"})
    assert r.status_code == 200
    schemes = r.json()["schemes"]
    for s in schemes:
        assert "horticulture" in s["sector"].lower()


def test_schemes_eligibility(client):
    r = client.post(f"{API}/schemes/eligibility", json={
        "profile": "Small & Marginal Farmer", "state": "Rajasthan"})
    assert r.status_code == 200
    d = r.json()
    assert d["eligible_count"] >= 1
    assert d["total"] >= 1


# --- Chat ---
def test_chat_millet(client):
    r = client.post(f"{API}/chat", json={"message": "best millet for drought", "lang": "en"})
    assert r.status_code == 200
    d = r.json()
    assert d["intent"] == "crops"
    assert len(d["reply"]) > 20


def test_chat_smam(client):
    r = client.post(f"{API}/chat", json={"message": "SMAM subsidy", "lang": "en"})
    assert r.status_code == 200
    assert r.json()["intent"] == "schemes"


def test_chat_greeting(client):
    r = client.post(f"{API}/chat", json={"message": "namaste", "lang": "en"})
    assert r.status_code == 200
    assert r.json()["intent"] == "greeting"


def test_chat_fallback(client):
    r = client.post(f"{API}/chat", json={"message": "weather forecast next week", "lang": "en"})
    assert r.status_code == 200
    d = r.json()
    assert d["intent"] == "fallback"
    assert d.get("escalate") is True
