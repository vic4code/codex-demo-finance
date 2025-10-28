#!/usr/bin/env python3
"""Generate deterministic, high-resolution sample datasets.

This module fabricates daily price and macro series spanning 2000-present using
piecewise interpolation between historical anchor points plus smoothed noise.
It is intended as an offline fallback when upstream data vendors are
unavailable in CI or restricted environments.
"""
from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Tuple

import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
SITE_DATA_DIR = ROOT / "site" / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)
SITE_DATA_DIR.mkdir(parents=True, exist_ok=True)

END_DATE = pd.Timestamp.today(tz="UTC").normalize().tz_localize(None)
BUSINESS_DATES = pd.date_range("2000-01-03", END_DATE, freq="B")


@dataclass(frozen=True)
class SeriesConfig:
    anchors: List[Tuple[str, float]]
    seed: int
    noise: float = 0.015
    smooth: int = 7
    method: str = "log"


def _interpolate_series(config: SeriesConfig) -> pd.Series:
    anchors = pd.DataFrame(config.anchors, columns=["date", "value"])
    anchors["date"] = pd.to_datetime(anchors["date"], utc=True)
    anchors = anchors.sort_values("date")
    anchors = anchors.drop_duplicates("date", keep="last")
    start = anchors["date"].min().tz_convert(None)
    end = BUSINESS_DATES.max()
    index = pd.date_range(start, end, freq="B")

    anchor_dates = anchors["date"].dt.tz_convert("UTC").dt.tz_localize(None)
    anchor_index = anchor_dates.astype("int64")
    anchor_values = anchors["value"].astype(float).to_numpy()

    rng = np.random.default_rng(config.seed)
    raw_noise = rng.normal(scale=config.noise, size=len(index))
    if config.smooth > 1:
        raw_noise = pd.Series(raw_noise).rolling(config.smooth, min_periods=1, center=True).mean().to_numpy()

    if config.method == "log":
        if np.any(anchor_values <= 0):
            raise ValueError("Log interpolation requires positive anchors")
        baseline = np.interp(index.astype("int64"), anchor_index, np.log(anchor_values))
        values = np.exp(baseline + raw_noise)
    else:
        baseline = np.interp(index.astype("int64"), anchor_index, anchor_values)
        values = baseline * (1 + raw_noise)
        values = np.where(values < 0, baseline, values)

    series = pd.Series(values, index=index)
    return series


def _series_to_records(series: pd.Series, precision: int = 4) -> List[Dict[str, float]]:
    output: List[Dict[str, float]] = []
    for timestamp, value in series.items():
        epoch_ms = int(pd.Timestamp(timestamp).tz_localize("UTC").timestamp() * 1000)
        output.append({"t": epoch_ms, "v": round(float(value), precision)})
    return output


PRICE_CONFIG: Dict[str, SeriesConfig] = {
    "^GSPC": SeriesConfig(
        anchors=[
            ("2000-01-03", 1455.22),
            ("2002-10-09", 776.76),
            ("2007-10-09", 1565.15),
            ("2009-03-09", 676.53),
            ("2013-12-31", 1848.36),
            ("2016-12-30", 2238.83),
            ("2018-12-24", 2351.10),
            ("2020-03-23", 2237.40),
            ("2021-12-31", 4766.18),
            ("2022-10-12", 3577.03),
            ("2024-12-31", 4770.00),
        ],
        seed=11,
        noise=0.012,
        smooth=9,
    ),
    "^NDX": SeriesConfig(
        anchors=[
            ("2000-03-10", 4816.35),
            ("2002-10-09", 812.43),
            ("2007-10-31", 2238.98),
            ("2009-03-09", 1027.04),
            ("2013-12-31", 3592.00),
            ("2018-08-29", 7700.00),
            ("2020-03-23", 7000.00),
            ("2021-11-19", 16573.37),
            ("2022-10-14", 10649.15),
            ("2024-12-31", 18000.00),
        ],
        seed=13,
        noise=0.016,
        smooth=11,
    ),
    "GLD": SeriesConfig(
        anchors=[
            ("2004-11-18", 44.38),
            ("2008-03-17", 93.56),
            ("2011-08-22", 185.85),
            ("2015-12-03", 101.17),
            ("2020-08-06", 194.45),
            ("2022-03-08", 193.30),
            ("2024-12-31", 210.00),
        ],
        seed=17,
        noise=0.009,
        smooth=7,
    ),
    "TLT": SeriesConfig(
        anchors=[
            ("2002-07-30", 85.12),
            ("2008-12-30", 122.15),
            ("2012-07-24", 128.53),
            ("2016-07-08", 143.62),
            ("2020-03-09", 179.70),
            ("2022-10-24", 92.74),
            ("2024-12-31", 98.00),
        ],
        seed=19,
        noise=0.013,
        smooth=9,
    ),
    "UUP": SeriesConfig(
        anchors=[
            ("2007-03-20", 24.77),
            ("2008-11-21", 26.45),
            ("2015-03-13", 26.73),
            ("2020-03-20", 28.95),
            ("2022-09-27", 30.93),
            ("2024-12-31", 29.50),
        ],
        seed=23,
        noise=0.006,
        smooth=5,
    ),
    "BTC-USD": SeriesConfig(
        anchors=[
            ("2013-11-29", 1090.00),
            ("2015-01-14", 210.00),
            ("2017-12-17", 19500.00),
            ("2018-12-15", 3200.00),
            ("2020-03-12", 4816.00),
            ("2021-11-10", 68789.63),
            ("2022-11-21", 15760.00),
            ("2024-12-31", 95000.00),
        ],
        seed=29,
        noise=0.05,
        smooth=3,
    ),
    "^VIX": SeriesConfig(
        anchors=[
            ("2000-01-03", 24.50),
            ("2002-07-24", 35.41),
            ("2008-11-20", 80.86),
            ("2010-05-21", 40.10),
            ("2011-08-08", 48.00),
            ("2015-08-24", 40.74),
            ("2018-02-05", 37.32),
            ("2020-03-16", 82.69),
            ("2022-10-12", 33.63),
            ("2024-12-31", 18.00),
        ],
        seed=31,
        noise=0.04,
        smooth=5,
    ),
}


MACRO_CONFIG: Dict[str, SeriesConfig] = {
    "VIX": PRICE_CONFIG["^VIX"],
    "DXY": SeriesConfig(
        anchors=[
            ("2000-01-03", 102.0),
            ("2002-01-30", 119.0),
            ("2008-03-17", 71.0),
            ("2017-01-03", 103.0),
            ("2020-03-20", 102.8),
            ("2022-09-27", 114.0),
            ("2024-12-31", 103.5),
        ],
        seed=37,
        noise=0.008,
        smooth=9,
    ),
    "TENY": SeriesConfig(
        anchors=[
            ("2000-01-03", 6.58),
            ("2003-06-13", 3.11),
            ("2006-06-28", 5.24),
            ("2008-12-30", 2.05),
            ("2012-07-24", 1.40),
            ("2016-07-08", 1.36),
            ("2018-10-05", 3.23),
            ("2020-08-04", 0.51),
            ("2022-10-20", 4.33),
            ("2024-12-31", 4.10),
        ],
        seed=41,
        noise=0.02,
        smooth=7,
        method="linear",
    ),
    "CPI_YoY": SeriesConfig(
        anchors=[
            ("2000-01-14", 2.7),
            ("2009-07-14", -1.9),
            ("2011-09-14", 3.9),
            ("2015-01-14", -0.1),
            ("2020-05-12", 0.1),
            ("2022-06-10", 9.1),
            ("2024-12-10", 3.3),
        ],
        seed=43,
        noise=0.03,
        smooth=11,
        method="linear",
    ),
    "OIL": SeriesConfig(
        anchors=[
            ("2000-01-03", 25.6),
            ("2008-07-03", 145.3),
            ("2009-02-18", 34.9),
            ("2014-06-20", 107.3),
            ("2016-02-11", 26.2),
            ("2020-04-21", 15.0),
            ("2022-03-08", 124.0),
            ("2024-12-31", 78.0),
        ],
        seed=47,
        noise=0.035,
        smooth=5,
    ),
}


def build_payload(config_map: Dict[str, SeriesConfig]) -> Dict[str, List[Dict[str, float]]]:
    payload: Dict[str, List[Dict[str, float]]] = {}
    for name, config in config_map.items():
        series = _interpolate_series(config)
        payload[name] = _series_to_records(series)
    return payload


def write_json(name: str, payload) -> None:
    raw = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    for directory in (DATA_DIR, SITE_DATA_DIR):
        path = directory / f"{name}.json"
        path.write_text(raw, encoding="utf-8")
        print(f"Wrote {path.relative_to(ROOT)}")


def main() -> None:
    prices = build_payload(PRICE_CONFIG)
    macro = build_payload(MACRO_CONFIG)
    events = json.loads((DATA_DIR / "events.json").read_text(encoding="utf-8")) if (DATA_DIR / "events.json").exists() else []
    write_json("prices", prices)
    write_json("macro", macro)
    if events:
        write_json("events", events)


if __name__ == "__main__":
    main()
