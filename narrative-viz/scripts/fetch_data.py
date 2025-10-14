#!/usr/bin/env python3
"""Daily data fetcher for Narrative-Driven Market Timeline."""
from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Dict, List, Optional

import pandas as pd
import yfinance as yf
import yaml

try:
    from deep_translator import GoogleTranslator  # type: ignore
except Exception:  # pragma: no cover - optional dependency
    GoogleTranslator = None

try:  # pragma: no cover - optional dependency
    from fredapi import Fred
except Exception:  # pragma: no cover - optional dependency
    Fred = None  # type: ignore

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
SITE_DATA_DIR = ROOT / "site" / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)
SITE_DATA_DIR.mkdir(parents=True, exist_ok=True)

PRICE_TICKERS: Dict[str, str] = {
    "^VIX": "^VIX",
    "^GSPC": "^GSPC",
    "^IXIC": "^IXIC",
    "GLD": "GLD",
    "TLT": "TLT",
    "UUP": "UUP",
    "BTC-USD": "BTC-USD",
}

MACRO_TICKERS: Dict[str, str] = {
    "VIX": "^VIX",
    "DXY": "DX-Y.NYB",
    "OIL": "CL=F",
    "TENY_FALLBACK": "^TNX",
}

TRANSLATION_HINTS = {
    "網路泡沫見頂": "Dot-com bubble peak",
    "NASDAQ 達高點後長期回檔": "NASDAQ peaked and entered a prolonged correction.",
    "911恐攻": "9/11 attacks",
    "美國受到恐怖攻擊引發全球市場震盪": "Terrorist attacks in the U.S. shocked global markets.",
    "雷曼兄弟倒閉": "Lehman Brothers collapse",
    "引爆全球金融危機的導火線": "Catalyst of the global financial crisis.",
    "波動末日": "Volmageddon",
    "反向VIX ETN在波動暴漲中崩潰": "Inverse VIX ETNs imploded amid a volatility spike.",
    "COVID-19 熔斷": "COVID-19 circuit breaker",
    "疫情恐慌引發市場重挫與政策總動員": "Market meltdown and policy bazooka followed.",
    "俄烏戰爭": "Russia–Ukraine war",
    "避險資金湧向美元與原物料": "Risk-off flows to USD and commodities.",
    "SVB倒閉": "SVB collapse",
    "銀行體系壓力再度升溫引發衰退疑慮": "Banking stress revived recession fears.",
}


def is_english(text: str) -> bool:
    return all(ord(ch) < 128 for ch in text)


def translate_text(text: str) -> str:
    if not text:
        return ""
    if is_english(text):
        return text
    if text in TRANSLATION_HINTS:
        return TRANSLATION_HINTS[text]
    if GoogleTranslator is not None:
        try:
            translator = GoogleTranslator(source="auto", target="en")
            translated = translator.translate(text)
            if translated:
                return translated
        except Exception:
            pass
    ascii_text = "".join(ch if ord(ch) < 128 else " " for ch in text)
    ascii_text = " ".join(ascii_text.split())
    return ascii_text or "Untitled event"


def fetch_history(ticker: str) -> pd.Series:
    history = yf.download(ticker, period="max", interval="1d", auto_adjust=False, progress=False)
    if history.empty:
        return pd.Series(dtype=float)
    price_col = "Adj Close" if "Adj Close" in history else "Close"
    series = history[price_col].dropna()
    series.index = series.index.tz_localize(None)
    return series


def series_to_records(series: pd.Series) -> List[Dict[str, Optional[float]]]:
    records: List[Dict[str, Optional[float]]] = []
    for timestamp, value in series.items():
        if pd.isna(value):
            value_out: Optional[float] = None
        else:
            value_out = float(value)
        epoch_ms = int(pd.Timestamp(timestamp).timestamp() * 1000)
        records.append({"t": epoch_ms, "v": value_out})
    return records


def build_prices() -> Dict[str, List[Dict[str, Optional[float]]]]:
    output: Dict[str, List[Dict[str, Optional[float]]]] = {}
    for name, ticker in PRICE_TICKERS.items():
        print(f"Downloading price series for {name} ({ticker})...")
        series = fetch_history(ticker)
        if series.empty:
            print(f"Warning: No data for {ticker}")
            output[name] = []
        else:
            output[name] = series_to_records(series)
    return output


def build_macro(price_payload: Dict[str, List[Dict[str, Optional[float]]]]) -> Dict[str, List[Dict[str, Optional[float]]]]:
    macro: Dict[str, List[Dict[str, Optional[float]]]] = {}

    # VIX via price payload ensures alignment
    macro["VIX"] = price_payload.get("^VIX", [])

    # Dollar index via Yahoo Finance fallback
    dxy_series = fetch_history(MACRO_TICKERS["DXY"])
    if dxy_series.empty:
        dxy_series = fetch_history("DXY")
    macro["DXY"] = series_to_records(dxy_series) if not dxy_series.empty else []

    # Crude oil front-month via Yahoo Finance
    oil_series = fetch_history(MACRO_TICKERS["OIL"])
    macro["OIL"] = series_to_records(oil_series) if not oil_series.empty else []

    fred_key = os.getenv("FRED_API_KEY")
    fred_client: Optional[Fred] = None
    if fred_key and Fred is not None:
        try:
            fred_client = Fred(api_key=fred_key)
        except Exception as error:  # pragma: no cover
            print(f"Failed to authenticate with FRED: {error}")
            fred_client = None

    # 10Y yield via FRED (preferred) or Yahoo fallback
    ten_year_records: List[Dict[str, Optional[float]]] = []
    if fred_client is not None:
        print("Fetching 10Y yield from FRED (DGS10)...")
        try:
            ten_year = fred_client.get_series("DGS10")
            ten_year.index = pd.to_datetime(ten_year.index)
            ten_year = ten_year.resample("D").ffill()
            ten_year_records = series_to_records(ten_year.dropna())
        except Exception as error:
            print(f"FRED 10Y fetch failed: {error}")
    if not ten_year_records:
        print("Falling back to Yahoo Finance for 10Y yield (^TNX)...")
        tnx_series = fetch_history(MACRO_TICKERS["TENY_FALLBACK"])
        ten_year_records = series_to_records(tnx_series / 100.0) if not tnx_series.empty else []
    macro["TENY"] = ten_year_records

    # CPI YoY via FRED if possible
    cpi_records: List[Dict[str, Optional[float]]] = []
    if fred_client is not None:
        print("Fetching CPI YoY from FRED (CPIAUCSL)...")
        try:
            cpi = fred_client.get_series("CPIAUCSL")
            cpi.index = pd.to_datetime(cpi.index)
            cpi = cpi.resample("M").last()
            cpi_yoy = cpi.pct_change(12) * 100
            cpi_yoy = cpi_yoy.dropna()
            cpi_records = series_to_records(cpi_yoy)
        except Exception as error:
            print(f"FRED CPI fetch failed: {error}")
    macro["CPI_YoY"] = cpi_records

    # Ensure keys exist even if empty
    for key in ["VIX", "DXY", "TENY", "CPI_YoY", "OIL"]:
        macro.setdefault(key, [])

    return macro


def load_events() -> List[Dict[str, str]]:
    yaml_path = ROOT / "events.yaml"
    if not yaml_path.exists():
        return SAMPLE_EVENTS
    with yaml_path.open("r", encoding="utf-8") as handle:
        events_raw = yaml.safe_load(handle) or []
    events: List[Dict[str, str]] = []
    for entry in events_raw:
        if not isinstance(entry, dict):
            continue
        date_str = str(entry.get("date", "")).strip()
        title = translate_text(str(entry.get("title", "")).strip())
        brief = translate_text(str(entry.get("brief", "")).strip())
        if entry.get("title_en"):
            title = str(entry["title_en"]).strip()
        if entry.get("brief_en"):
            brief = str(entry["brief_en"]).strip()
        if not date_str:
            continue
        events.append({"date": date_str, "title": title, "brief": brief})
    return events


SAMPLE_EVENTS = [
    {"date": "2000-03-10", "title": "Dot-com bubble peak", "brief": "NASDAQ peaked and entered a prolonged correction."},
    {"date": "2001-09-11", "title": "9/11 attacks", "brief": "Terrorist attacks in the U.S. shocked global markets."},
    {"date": "2008-09-15", "title": "Lehman Brothers collapse", "brief": "Catalyst of the global financial crisis."},
    {"date": "2018-02-05", "title": "Volmageddon", "brief": "Inverse VIX ETNs imploded amid a volatility spike."},
    {"date": "2020-03-16", "title": "COVID-19 circuit breaker", "brief": "Market meltdown and policy bazooka followed."},
    {"date": "2022-02-24", "title": "Russia–Ukraine war", "brief": "Risk-off flows to USD and commodities."},
    {"date": "2023-03-10", "title": "SVB collapse", "brief": "Banking stress revived recession fears."},
]


def write_json(name: str, payload) -> None:
    pretty = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    for directory in (DATA_DIR, SITE_DATA_DIR):
        path = directory / f"{name}.json"
        with path.open("w", encoding="utf-8") as handle:
            handle.write(pretty)
        print(f"Wrote {path.relative_to(ROOT)}")


def main() -> None:
    prices = build_prices()
    macro = build_macro(prices)
    events = load_events()
    if not events:
        events = SAMPLE_EVENTS

    write_json("prices", prices)
    write_json("macro", macro)
    write_json("events", events)


if __name__ == "__main__":
    main()
