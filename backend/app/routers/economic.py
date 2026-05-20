"""
Economic Router — Live Weather + Skill Development Engine
Uses Open-Meteo (free, no API key) for real weather data.
Gemini analyses weather + skill to produce tailored work advice.
"""
import asyncio
import json
import urllib.request
from fastapi import APIRouter, Query, Depends
from ..agent import ask_gemini
from .. import models
from ..security import get_current_user

router = APIRouter(prefix="/api/economic", tags=["economic"])

# ─── Helpers ──────────────────────────────────────────────────────────────────

# Pre-seeded coordinates for major Pakistani cities
CITY_COORDS: dict[str, tuple[float, float]] = {
    "lahore":      (31.5204, 74.3587),
    "karachi":     (24.8608, 67.0104),
    "islamabad":   (33.6844, 73.0479),
    "rawalpindi":  (33.5651, 73.0169),
    "faisalabad":  (31.4504, 73.1350),
    "multan":      (30.1575, 71.5249),
    "peshawar":    (34.0151, 71.5249),
    "quetta":      (30.1798, 66.9750),
    "gujranwala":  (32.1877, 74.1945),
    "sialkot":     (32.4945, 74.5229),
    "hyderabad":   (25.3960, 68.3578),
    "bahawalpur":  (29.3956, 71.6836),
    "sargodha":    (32.0836, 72.6711),
}

# WMO weather interpretation codes → (condition, emoji)
WMO_CODES: dict[int, tuple[str, str]] = {
    0:  ("Clear Sky",        "☀️"),
    1:  ("Mainly Clear",     "🌤️"),
    2:  ("Partly Cloudy",    "⛅"),
    3:  ("Overcast",         "☁️"),
    45: ("Foggy",            "🌫️"),
    48: ("Icy Fog",          "🌫️"),
    51: ("Light Drizzle",    "🌦️"),
    53: ("Drizzle",          "🌧️"),
    55: ("Heavy Drizzle",    "🌧️"),
    61: ("Light Rain",       "🌧️"),
    63: ("Rain",             "🌧️"),
    65: ("Heavy Rain",       "🌧️"),
    71: ("Light Snow",       "❄️"),
    73: ("Snow",             "❄️"),
    75: ("Heavy Snow",       "❄️"),
    80: ("Rain Showers",     "🌦️"),
    81: ("Rain Showers",     "🌦️"),
    82: ("Heavy Showers",    "⛈️"),
    95: ("Thunderstorm",     "⛈️"),
    96: ("Hail Storm",       "⛈️"),
    99: ("Heavy Thunderstorm","⛈️"),
}


async def _fetch_json(url: str) -> dict | None:
    """Async wrapper around urllib.request — no extra packages needed."""
    loop = asyncio.get_event_loop()
    def _sync():
        try:
            with urllib.request.urlopen(url, timeout=8) as resp:
                return json.loads(resp.read().decode())
        except Exception:
            return None
    return await loop.run_in_executor(None, _sync)


async def _resolve_coords(city: str) -> tuple[float, float]:
    """Return (lat, lon) for a city name using Open-Meteo Geocoding API."""
    cached = CITY_COORDS.get(city.lower().strip())
    if cached:
        return cached
    url = (
        f"https://geocoding-api.open-meteo.com/v1/search"
        f"?name={urllib.request.quote(city)}&count=1&language=en&format=json"
    )
    data = await _fetch_json(url)
    if data and data.get("results"):
        r = data["results"][0]
        return (r["latitude"], r["longitude"])
    return (31.5204, 74.3587)   # Fallback → Lahore


# ─── Endpoints ────────────────────────────────────────────────────────────────

@router.get("/weather")
async def get_weather(
    city: str = Query("Lahore"),
    skill: str = Query("painter"),
    current_user: models.User = Depends(get_current_user)
):
    """
    Fetches REAL weather from Open-Meteo (free, no API key required)
    then uses Gemini to produce skill-specific work advice based on conditions.
    """
    print(f"\n[WEATHER AGENT] 🌤️ Fetching live weather for city='{city}', skill='{skill}'")

    lat, lon = await _resolve_coords(city)
    weather_url = (
        f"https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}&longitude={lon}"
        f"&current=temperature_2m,relative_humidity_2m,apparent_temperature,"
        f"precipitation,wind_speed_10m,weather_code"
        f"&timezone=auto"
    )
    raw = await _fetch_json(weather_url)
    current = (raw or {}).get("current", {})

    temp         = current.get("temperature_2m", 33)
    feels_like   = current.get("apparent_temperature", temp)
    humidity     = current.get("relative_humidity_2m", 55)
    precipitation= current.get("precipitation", 0)
    wind_speed   = current.get("wind_speed_10m", 12)
    weather_code = current.get("weather_code", 0)
    condition, emoji = WMO_CODES.get(weather_code, ("Clear Sky", "☀️"))

    is_outdoor_safe = precipitation < 2.0 and wind_speed < 45

    print(f"[WEATHER AGENT] ✅ Got weather → {condition} {emoji}, {temp}°C, rain={precipitation}mm, wind={wind_speed}km/h")

    # Gemini work-advice prompt
    prompt = f"""
    You are an AI work advisor for daily-wage workers in Pakistan.
    Current weather in {city}: {condition} {emoji}, Temperature {temp}°C (feels like {feels_like}°C),
    Humidity {humidity}%, Wind {wind_speed} km/h, Precipitation {precipitation} mm.
    Worker skill: {skill}.

    In exactly 2 short, practical sentences:
    1. Say whether outdoor {skill} work is safe or risky today and why.
    2. Give one specific work tip based on these exact weather conditions.
    Do not use markdown. No asterisks.
    """
    fallback = (
        f"Today's weather in {city} is {condition} at {temp}°C — "
        f"{'safe for outdoor work' if is_outdoor_safe else 'avoid outdoor work due to weather conditions'}. "
        f"{'Great day to tackle outdoor contracts!' if is_outdoor_safe else 'Focus on indoor jobs today.'}"
    )
    work_advice = await ask_gemini(prompt, fallback)

    return {
        "city":               city,
        "temperature":        temp,
        "apparent_temperature": feels_like,
        "humidity":           humidity,
        "wind_speed":         wind_speed,
        "precipitation":      precipitation,
        "condition":          condition,
        "condition_emoji":    emoji,
        "weather_code":       weather_code,
        "work_advice":        work_advice,
        "is_outdoor_safe":    is_outdoor_safe,
    }


@router.get("/dashboard")
async def get_economic_dashboard(
    skill: str = Query("painter"),
    current_user: models.User = Depends(get_current_user)
):
    """
    Live Agentic Economic Engine powered by Gemini.
    """
    prompt = f"""
    You are an AI Economic Engine. A {skill} worker is asking for an upskilling tutorial.
    Generate a highly realistic 1-sentence description for a 60-second micro-learning video
    that would teach a {skill} a highly paid modern technique.
    Do not use markdown bolding.
    """
    fallback_desc = f"Quick masterclass on applying modern {skill} techniques for high-end commercial contracts."
    desc = await ask_gemini(prompt, fallback_desc)

    squads = {
        "painter":     "Model Town Painting Squad (4 Active Mates)",
        "electrician": "DHA Electrician Grid-7 (6 Active Mates)",
        "plumber":     "Lahore Plumbing Union (5 Active Mates)",
        "carpenter":   "Cantt Woodworkers Guild (3 Active Mates)",
        "mason":       "Haji Concrete Squad-A (8 Active Mates)",
    }

    return {
        "tutorial": {
            "video_title": f"Modern {skill.capitalize()} Masterclass",
            "duration": "60 Seconds",
            "rating": 4.9,
            "desc": desc,
        },
        "squad_name":    squads.get(skill.lower(), squads["painter"]),
        "squad_benefit": "Pool equipment costs and secure higher commercial contracts as a unified crew.",
    }
