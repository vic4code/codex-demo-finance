const SAMPLE_DATA = {
  prices: {
    "^GSPC": [
      { t: 1672444800000, v: 3823.96 },
      { t: 1675036800000, v: 4070.56 },
      { t: 1677628800000, v: 4046.56 },
      { t: 1680307200000, v: 4155.22 },
      { t: 1682899200000, v: 4221.02 },
      { t: 1685577600000, v: 4450.38 },
      { t: 1688169600000, v: 4511.89 }
    ],
    "^IXIC": [
      { t: 1672444800000, v: 10466.48 },
      { t: 1675036800000, v: 11512.41 },
      { t: 1677628800000, v: 11394.94 },
      { t: 1680307200000, v: 12142.24 },
      { t: 1682899200000, v: 12646.95 },
      { t: 1685577600000, v: 13461.92 },
      { t: 1688169600000, v: 13787.92 }
    ],
    GLD: [
      { t: 1672444800000, v: 168.15 },
      { t: 1675036800000, v: 179.31 },
      { t: 1677628800000, v: 171.35 },
      { t: 1680307200000, v: 182.15 },
      { t: 1682899200000, v: 182.77 },
      { t: 1685577600000, v: 180.57 },
      { t: 1688169600000, v: 183.22 }
    ],
    TLT: [
      { t: 1672444800000, v: 104.19 },
      { t: 1675036800000, v: 107.65 },
      { t: 1677628800000, v: 103.84 },
      { t: 1680307200000, v: 108.99 },
      { t: 1682899200000, v: 102.21 },
      { t: 1685577600000, v: 102.53 },
      { t: 1688169600000, v: 100.07 }
    ],
    UUP: [
      { t: 1672444800000, v: 27.8 },
      { t: 1675036800000, v: 28.15 },
      { t: 1677628800000, v: 27.58 },
      { t: 1680307200000, v: 27.98 },
      { t: 1682899200000, v: 27.61 },
      { t: 1685577600000, v: 27.68 },
      { t: 1688169600000, v: 28.27 }
    ],
    "BTC-USD": [
      { t: 1672444800000, v: 16547.5 },
      { t: 1675036800000, v: 23126.41 },
      { t: 1677628800000, v: 23427.73 },
      { t: 1680307200000, v: 28468.31 },
      { t: 1682899200000, v: 28316.2 },
      { t: 1685577600000, v: 30466.96 },
      { t: 1688169600000, v: 30477.43 }
    ],
    "^VIX": [
      { t: 1672444800000, v: 21.67 },
      { t: 1675036800000, v: 19.85 },
      { t: 1677628800000, v: 18.49 },
      { t: 1680307200000, v: 19.02 },
      { t: 1682899200000, v: 17.95 },
      { t: 1685577600000, v: 13.44 },
      { t: 1688169600000, v: 13.59 }
    ]
  },
  macro: {
    VIX: [
      { t: 1672444800000, v: 21.67 },
      { t: 1675036800000, v: 19.85 },
      { t: 1677628800000, v: 18.49 },
      { t: 1680307200000, v: 19.02 },
      { t: 1682899200000, v: 17.95 },
      { t: 1685577600000, v: 13.44 },
      { t: 1688169600000, v: 13.59 }
    ],
    DXY: [
      { t: 1672444800000, v: 103.44 },
      { t: 1675036800000, v: 102.06 },
      { t: 1677628800000, v: 105.21 },
      { t: 1680307200000, v: 102.06 },
      { t: 1682899200000, v: 104.04 },
      { t: 1685577600000, v: 103.27 },
      { t: 1688169600000, v: 102.92 }
    ],
    TENY: [
      { t: 1672444800000, v: 3.88 },
      { t: 1675036800000, v: 3.53 },
      { t: 1677628800000, v: 3.96 },
      { t: 1680307200000, v: 3.47 },
      { t: 1682899200000, v: 3.57 },
      { t: 1685577600000, v: 3.81 },
      { t: 1688169600000, v: 3.84 }
    ],
    CPI_YoY: [
      { t: 1669852800000, v: 7.1 },
      { t: 1672444800000, v: 6.5 },
      { t: 1675123200000, v: 6.4 },
      { t: 1677628800000, v: 6.0 },
      { t: 1680307200000, v: 4.9 },
      { t: 1682899200000, v: 4.0 },
      { t: 1685577600000, v: 3.0 }
    ],
    OIL: [
      { t: 1672444800000, v: 79.65 },
      { t: 1675036800000, v: 74.47 },
      { t: 1677628800000, v: 76.32 },
      { t: 1680307200000, v: 75.67 },
      { t: 1682899200000, v: 71.74 },
      { t: 1685577600000, v: 69.93 },
      { t: 1688169600000, v: 80.72 }
    ]
  },
  events: [
    { date: "2000-03-10", title: "Dot-com bubble peak", brief: "NASDAQ peaked and entered a prolonged correction." },
    { date: "2001-09-11", title: "9/11 attacks", brief: "Terrorist attacks in the U.S. shocked global markets." },
    { date: "2008-09-15", title: "Lehman Brothers collapse", brief: "Catalyst of the global financial crisis." },
    { date: "2018-02-05", title: "Volmageddon", brief: "Inverse VIX ETNs imploded amid a volatility spike." },
    { date: "2020-03-16", title: "COVID-19 circuit breaker", brief: "Market meltdown and policy bazooka followed." },
    { date: "2022-02-24", title: "Russia–Ukraine war", brief: "Risk-off flows to USD and commodities." },
    { date: "2023-03-10", title: "SVB collapse", brief: "Banking stress revived recession fears." }
  ]
};

const MACRO_DEFINITIONS = [
  { key: "VIX", label: "VIX", color: "#f97316" },
  { key: "TENY", label: "US 10Y Yield", color: "#22d3ee" },
  { key: "DXY", label: "DXY Dollar Index", color: "#38bdf8" },
  { key: "CPI_YoY", label: "CPI YoY", color: "#f43f5e" },
  { key: "OIL", label: "WTI Crude", color: "#a855f7" }
];

const MARKET_DEFINITIONS = [
  { key: "^GSPC", label: "S&P 500", color: "#22c55e" },
  { key: "^IXIC", label: "NASDAQ 100", color: "#3b82f6" },
  { key: "GLD", label: "Gold (GLD)", color: "#facc15" },
  { key: "TLT", label: "Treasury (TLT)", color: "#6366f1" },
  { key: "UUP", label: "USD (UUP)", color: "#0ea5e9" },
  { key: "BTC-USD", label: "Bitcoin", color: "#f97316" }
];

const state = {
  data: {
    prices: {},
    macro: {},
    events: []
  },
  selections: {
    macros: new Set(["VIX", "TENY", "DXY"]),
    markets: new Set(["^GSPC", "GLD", "TLT", "UUP", "BTC-USD"]),
    rebase: true,
    logScale: false,
    showAnnotations: true,
    smoothLines: true,
    startDate: null,
    endDate: null
  },
  fallbackMessages: []
};

const charts = {
  timeline: null
};

async function fetchDataset(name, fallback) {
  const basePaths = [
    `./data/${name}.json`,
    `data/${name}.json`,
    `${name}.json`
  ];
  for (const path of basePaths) {
    try {
      const response = await fetch(path, { cache: "no-cache" });
      if (response.ok) {
        return { data: await response.json(), usedFallback: false };
      }
    } catch (error) {
      // Continue to next path
    }
  }
  state.fallbackMessages.push(`Live ${name} feed unavailable. Showing cached sample.`);
  return { data: fallback, usedFallback: true };
}

async function loadData() {
  state.fallbackMessages = [];
  const [prices, macro, events] = await Promise.all([
    fetchDataset("prices", SAMPLE_DATA.prices),
    fetchDataset("macro", SAMPLE_DATA.macro),
    fetchDataset("events", SAMPLE_DATA.events)
  ]);

  state.data.prices = prices.data || {};
  state.data.macro = macro.data || {};
  state.data.events = Array.isArray(events.data) ? events.data : SAMPLE_DATA.events;

  initializeDateRange();
  showFallbackBanner();
}

function initializeDateRange() {
  const allSeries = [
    ...Object.values(state.data.prices || {}),
    ...Object.values(state.data.macro || {})
  ].filter(Boolean);
  const timestamps = allSeries.flat().map((point) => point.t);
  if (!timestamps.length) {
    const now = Date.now();
    state.selections.startDate = new Date(now - 365 * 24 * 60 * 60 * 1000);
    state.selections.endDate = new Date(now);
    return;
  }
  const min = Math.min(...timestamps);
  const max = Math.max(...timestamps);
  state.selections.startDate = new Date(min);
  state.selections.endDate = new Date(max);
}

function showFallbackBanner() {
  const banner = document.getElementById("data-status");
  if (!banner) return;
  if (state.fallbackMessages.length) {
    banner.textContent = state.fallbackMessages.join(" ");
    banner.classList.add("show");
  } else {
    banner.classList.remove("show");
  }
}

function setupTheme() {
  const storedPreference = localStorage.getItem("ndmt-theme");
  if (storedPreference) {
    applyTheme(storedPreference);
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light", false);
  }
  const toggle = document.getElementById("theme-toggle");
  toggle?.addEventListener("click", () => {
    const current = document.body.dataset.theme || "auto";
    const next = current === "dark" ? "light" : current === "light" ? "auto" : "dark";
    applyTheme(next);
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
    const stored = localStorage.getItem("ndmt-theme");
    if (!stored || stored === "auto") {
      applyTheme(event.matches ? "dark" : "light", false);
    }
  });
}

function applyTheme(mode, persist = true) {
  const validModes = ["auto", "light", "dark"];
  const targetMode = validModes.includes(mode) ? mode : "auto";
  document.body.dataset.theme = targetMode === "auto" ? "" : targetMode;
  document.body.setAttribute("data-theme-mode", targetMode);
  if (persist) {
    localStorage.setItem("ndmt-theme", targetMode);
  }
  const icon = document.getElementById("theme-icon");
  if (icon) {
    if (targetMode === "dark") {
      icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"></path>';
    } else if (targetMode === "light") {
      icon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><path d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 6.95-1.414-1.414M6.464 6.464 5.05 5.05m12.728 0-1.414 1.414M6.464 17.536 5.05 18.95" stroke-linecap="round"></path>';
    } else {
      icon.innerHTML = '<path d="M17.657 16.657A8 8 0 0 1 7.343 6.343 8.001 8.001 0 1 0 17.657 16.657Z"></path>';
    }
  }
  refreshCharts();
}

function setupControls() {
  const desktopContainer = document.getElementById("controls-desktop");
  const mobileContainer = document.getElementById("controls-mobile");
  if (!desktopContainer || !mobileContainer) return;

  const factories = [
    () => buildDateRangeControls(),
    () => buildCheckboxGroup("Macro indicators", "macros", MACRO_DEFINITIONS, state.selections.macros),
    () => buildCheckboxGroup("Market assets", "markets", MARKET_DEFINITIONS, state.selections.markets),
    () => buildToggleGroup()
  ];

  factories.forEach((factory) => {
    const desktopSection = factory();
    const mobileSection = factory();
    desktopContainer.appendChild(desktopSection);
    mobileContainer.appendChild(mobileSection);
  });

  setupDrawer();
}

function setupDrawer() {
  const openBtn = document.getElementById("controls-toggle");
  const closeBtn = document.getElementById("controls-close");
  const drawer = document.getElementById("control-panel");
  const backdrop = document.getElementById("drawer-backdrop");
  if (!openBtn || !closeBtn || !drawer || !backdrop) return;

  const toggleDrawer = (open) => {
    document.body.classList.toggle("drawer-open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    openBtn.setAttribute("aria-expanded", String(open));
    backdrop.classList.toggle("show", open);
  };

  openBtn.addEventListener("click", () => toggleDrawer(true));
  closeBtn.addEventListener("click", () => toggleDrawer(false));
  backdrop.addEventListener("click", () => toggleDrawer(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") toggleDrawer(false);
  });
}

function buildDateRangeControls() {
  const wrapper = document.createElement("section");
  wrapper.className = "control-group";
  wrapper.innerHTML = `
    <h4>Date range</h4>
    <div class="space-y-3">
      <label class="flex flex-col gap-1">
        <span class="text-muted text-xs uppercase tracking-wide">Start</span>
        <input type="date" id="start-date" class="rounded-lg border-border bg-surface text-foreground focus:border-accent" data-control="start-date" />
      </label>
      <label class="flex flex-col gap-1">
        <span class="text-muted text-xs uppercase tracking-wide">End</span>
        <input type="date" id="end-date" class="rounded-lg border-border bg-surface text-foreground focus:border-accent" data-control="end-date" />
      </label>
    </div>
  `;
  const startInput = wrapper.querySelector("#start-date");
  const endInput = wrapper.querySelector("#end-date");
  if (startInput && endInput) {
    const start = formatDateInput(state.selections.startDate);
    const end = formatDateInput(state.selections.endDate);
    startInput.value = start;
    endInput.value = end;
    startInput.max = end;
    endInput.min = start;

    startInput.addEventListener("change", (event) => {
      const value = event.target.value ? new Date(event.target.value) : state.selections.startDate;
      if (value <= state.selections.endDate) {
        state.selections.startDate = value;
        endInput.min = formatDateInput(value);
        refreshCharts();
      }
    });

    endInput.addEventListener("change", (event) => {
      const value = event.target.value ? new Date(event.target.value) : state.selections.endDate;
      if (value >= state.selections.startDate) {
        state.selections.endDate = value;
        startInput.max = formatDateInput(value);
        refreshCharts();
      }
    });
  }
  return wrapper;
}

function buildCheckboxGroup(title, type, definitions, selectedSet) {
  const wrapper = document.createElement("section");
  wrapper.className = "control-group";
  const items = definitions
    .map(
      (def) => `
      <label class="flex items-center justify-between gap-3 rounded-lg border border-transparent px-3 py-2 hover:border-border">
        <span class="flex items-center gap-2">
          <span class="h-2.5 w-2.5 rounded-full" style="background:${def.color}"></span>
          <span>${def.label}</span>
        </span>
        <input type="checkbox" value="${def.key}" ${selectedSet.has(def.key) ? "checked" : ""} class="rounded border-border text-accent focus:ring-accent" data-control="${type}" />
      </label>
    `
    )
    .join("");
  wrapper.innerHTML = `
    <h4>${title}</h4>
    <div class="flex flex-col gap-2" role="group" aria-label="${title}">
      ${items}
    </div>
  `;
  wrapper.querySelectorAll("input[type='checkbox']").forEach((input) => {
    input.addEventListener("change", (event) => {
      const value = event.target.value;
      if (event.target.checked) {
        selectedSet.add(value);
      } else {
        selectedSet.delete(value);
      }
      if (!selectedSet.size) {
        selectedSet.add(value);
      }
      refreshCharts();
    });
  });
  return wrapper;
}

function buildToggleGroup() {
  const wrapper = document.createElement("section");
  wrapper.className = "control-group";
  wrapper.innerHTML = `
    <h4>Visual tweaks</h4>
    <div class="space-y-3">
      ${buildToggleRow("Rebase to 100", "rebase", state.selections.rebase)}
      ${buildToggleRow("Logarithmic scale", "logScale", state.selections.logScale)}
      ${buildToggleRow("Show annotations", "showAnnotations", state.selections.showAnnotations)}
      ${buildToggleRow("Smooth lines", "smoothLines", state.selections.smoothLines)}
    </div>
  `;
  wrapper.querySelectorAll("input[type='checkbox']").forEach((input) => {
    input.addEventListener("change", (event) => {
      const { name, checked } = event.target;
      state.selections[name] = checked;
      refreshCharts();
    });
  });
  return wrapper;
}

function buildToggleRow(label, name, value) {
  return `
    <label class="flex items-center justify-between gap-4">
      <span>${label}</span>
      <span class="toggle-switch">
        <input type="checkbox" name="${name}" ${value ? "checked" : ""} aria-label="${label}" data-control="toggle-${name}" />
      </span>
    </label>
  `;
}

function formatDateInput(date) {
  if (!date) return "";
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "–";
  if (Math.abs(value) >= 1000) {
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }
  if (Math.abs(value) >= 100) {
    return value.toFixed(2);
  }
  if (Math.abs(value) >= 1) {
    return value.toFixed(2);
  }
  return value.toFixed(3);
}

function formatDateTooltip(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function filterSeriesByDate(series, start, end) {
  return series.filter((point) => point.t >= start.getTime() && point.t <= end.getTime());
}

function rebaseSeries(series) {
  const valid = series.filter((point) => point.v !== null && !Number.isNaN(point.v));
  if (!valid.length) return series.map((point) => [point.t, null]);
  const base = valid[0].v;
  return series.map((point) => [point.t, point.v !== null ? (point.v / base) * 100 : null]);
}

function toPairs(series) {
  return series.map((point) => [point.t, point.v]);
}

function prepareMacroSeries() {
  const start = state.selections.startDate;
  const end = state.selections.endDate;
  return MACRO_DEFINITIONS.filter((def) => state.selections.macros.has(def.key)).map((def) => {
    const rawSeries = state.data.macro[def.key] || [];
    const filtered = filterSeriesByDate(rawSeries, start, end);
    return {
      name: def.label,
      type: "line",
      yAxisIndex: 1,
      smooth: state.selections.smoothLines,
      showSymbol: false,
      emphasis: { focus: "series" },
      connectNulls: true,
      itemStyle: { color: def.color },
      lineStyle: { width: 2 },
      data: toPairs(filtered)
    };
  });
}

function prepareMarketSeries() {
  const start = state.selections.startDate;
  const end = state.selections.endDate;
  return MARKET_DEFINITIONS.filter((def) => state.selections.markets.has(def.key)).map((def) => {
    const rawSeries = state.data.prices[def.key] || [];
    const filtered = filterSeriesByDate(rawSeries, start, end);
    const data = state.selections.rebase ? rebaseSeries(filtered) : toPairs(filtered);
    return {
      name: def.label,
      type: "line",
      yAxisIndex: 0,
      smooth: state.selections.smoothLines,
      showSymbol: false,
      emphasis: { focus: "series" },
      connectNulls: true,
      itemStyle: { color: def.color },
      lineStyle: { width: 2 },
      data
    };
  });
}

function clusterEvents(minGapDays = 10) {
  const events = [...state.data.events];
  events.sort((a, b) => new Date(a.date) - new Date(b.date));
  const clusters = [];
  events.forEach((event) => {
    const timestamp = new Date(event.date).getTime();
    const lastCluster = clusters[clusters.length - 1];
    if (lastCluster) {
      const gap = Math.abs(timestamp - lastCluster.timestamp);
      if (gap <= minGapDays * 24 * 60 * 60 * 1000) {
        lastCluster.events.push(event);
        return;
      }
    }
    clusters.push({ timestamp, events: [event] });
  });
  return clusters.map((cluster) => {
    const [first] = cluster.events;
    const label = cluster.events.length > 1 ? `${first.title} +${cluster.events.length - 1} more` : first.title;
    return {
      timestamp: cluster.timestamp,
      label,
      events: cluster.events
    };
  });
}

function prepareEventSeries(theme) {
  const clusters = clusterEvents();
  const scatterData = clusters.map((cluster) => ({
    value: [cluster.timestamp, 1],
    label: cluster.label,
    events: cluster.events
  }));

  const lineData = clusters.map((cluster) => ({
    coords: [
      [cluster.timestamp, 0],
      [cluster.timestamp, 1]
    ]
  }));

  return {
    stems: {
      name: "Event stems",
      type: "lines",
      showInLegend: false,
      silent: true,
      coordinateSystem: "cartesian2d",
      yAxisIndex: 2,
      zlevel: 1,
      lineStyle: {
        color: theme.accent,
        width: 1.2,
        type: "dashed",
        opacity: 0.6
      },
      data: lineData,
      tooltip: { show: false }
    },
    markers: {
      name: "Narrative events",
      type: "scatter",
      yAxisIndex: 2,
      symbolSize: 16,
      data: scatterData,
      label: {
        show: state.selections.showAnnotations,
        position: "top",
        align: "center",
        color: theme.textColor,
        backgroundColor: `${theme.accent}22`,
        borderColor: theme.accent,
        borderWidth: 1,
        borderRadius: 6,
        padding: [4, 8],
        formatter: (params) => params.data.label,
        overflow: "break"
      },
      itemStyle: {
        color: theme.accent,
        borderColor: theme.backgroundColor,
        borderWidth: 1.4
      },
      tooltip: { show: false }
    }
  };
}

function initCharts() {
  const element = document.getElementById("timeline-chart");
  if (element) {
    charts.timeline = echarts.init(element, null, { renderer: "canvas" });
  }

  window.addEventListener(
    "resize",
    debounce(() => {
      charts.timeline?.resize();
    }, 150)
  );
}

function getChartTheme() {
  const style = getComputedStyle(document.body);
  return {
    backgroundColor: style.getPropertyValue("--surface"),
    textColor: style.getPropertyValue("--foreground"),
    mutedColor: style.getPropertyValue("--muted"),
    borderColor: style.getPropertyValue("--border"),
    accent: style.getPropertyValue("--accent") || "#facc15"
  };
}

function refreshCharts() {
  if (!charts.timeline) return;
  if (!state.selections.startDate || !state.selections.endDate) return;
  const theme = getChartTheme();
  const start = state.selections.startDate.getTime();
  const end = state.selections.endDate.getTime();

  const marketSeries = prepareMarketSeries();
  const macroSeries = prepareMacroSeries();
  const eventSeries = prepareEventSeries(theme);

  const legendEntries = Array.from(
    new Set([
      ...marketSeries.map((series) => series.name),
      ...macroSeries.map((series) => series.name),
      eventSeries.markers.name
    ])
  );

  charts.timeline.setOption(
    {
      backgroundColor: theme.backgroundColor,
      grid: { top: 48, left: 64, right: 64, bottom: 88 },
      legend: {
        data: legendEntries,
        textStyle: { color: theme.textColor },
        top: 0,
        icon: "circle"
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" },
        backgroundColor: theme.backgroundColor,
        borderColor: theme.borderColor,
        textStyle: { color: theme.textColor },
        formatter: (params) => {
          if (!params || !params.length) return "";
          const axisValue = Number(params[0].axisValue);
          const header = `<div class='text-xs uppercase tracking-wide text-muted'>${formatDateTooltip(axisValue)}</div>`;
          const metricRows = params
            .filter((item) => item.seriesType === "line")
            .map(
              (item) => `
                <div class='flex justify-between gap-8'>
                  <span style='color:${item.color}'>${item.seriesName}</span>
                  <span>${formatNumber(Number(item.value[1]))}</span>
                </div>`
            )
            .join("");

          const eventItems = params.filter((item) => item.seriesType === "scatter" && item.data?.events?.length);
          let eventsSection = "";
          if (eventItems.length) {
            const entries = [];
            eventItems.forEach((item) => {
              item.data.events.forEach((event) => {
                entries.push(
                  `<div><strong>${event.title}</strong><div class='text-muted'>${event.brief}</div></div>`
                );
              });
            });
            eventsSection = `
              <div style='margin-top:8px;padding-top:8px;border-top:1px solid ${theme.borderColor}'>
                ${entries.join("<div style='height:6px'></div>")}
              </div>
            `;
          }

          return `${header}${metricRows}${eventsSection}`;
        }
      },
      dataZoom: [
        { type: "inside", xAxisIndex: 0 },
        { type: "slider", xAxisIndex: 0, brushSelect: false, bottom: 24, height: 24 }
      ],
      xAxis: {
        type: "time",
        min: start,
        max: end,
        axisLabel: { color: theme.mutedColor },
        axisLine: { lineStyle: { color: theme.borderColor } },
        axisPointer: { label: { color: theme.textColor, backgroundColor: theme.borderColor } }
      },
      yAxis: [
        {
          type: state.selections.logScale ? "log" : "value",
          position: "left",
          name: state.selections.rebase ? "Markets (rebased = 100)" : "Markets",
          nameLocation: "middle",
          nameGap: 48,
          axisLabel: {
            color: theme.mutedColor,
            formatter: (value) =>
              state.selections.rebase ? Number(value).toFixed(0) : formatNumber(Number(value))
          },
          axisLine: { lineStyle: { color: theme.borderColor } },
          splitLine: { lineStyle: { color: `${theme.borderColor}55` } }
        },
        {
          type: "value",
          position: "right",
          name: "Macro",
          nameLocation: "middle",
          nameGap: 52,
          alignTicks: true,
          axisLabel: { color: theme.mutedColor },
          axisLine: { lineStyle: { color: theme.borderColor } },
          splitLine: { show: false }
        },
        {
          type: "value",
          min: 0,
          max: 1,
          show: false
        }
      ],
      series: [...marketSeries, ...macroSeries, eventSeries.stems, eventSeries.markers]
    },
    true
  );

  syncControlState();
}

function debounce(fn, delay = 200) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(null, args), delay);
  };
}

function bootstrap() {
  setupTheme();
  initCharts();
  loadData().then(() => {
    setupControls();
    refreshCharts();
  });
  const year = new Date().getFullYear();
  const copyright = document.getElementById("copyright-year");
  if (copyright) {
    copyright.textContent = year;
  }
}

document.addEventListener("DOMContentLoaded", bootstrap);

function syncControlState() {
  if (!state.selections.startDate || !state.selections.endDate) return;
  const startValue = formatDateInput(state.selections.startDate);
  const endValue = formatDateInput(state.selections.endDate);
  document.querySelectorAll("input[data-control='start-date']").forEach((input) => {
    if (input.value !== startValue) input.value = startValue;
    input.max = endValue;
  });
  document.querySelectorAll("input[data-control='end-date']").forEach((input) => {
    if (input.value !== endValue) input.value = endValue;
    input.min = startValue;
  });

  document.querySelectorAll("input[data-control='macros']").forEach((input) => {
    input.checked = state.selections.macros.has(input.value);
  });
  document.querySelectorAll("input[data-control='markets']").forEach((input) => {
    input.checked = state.selections.markets.has(input.value);
  });

  document.querySelectorAll("input[data-control='toggle-rebase']").forEach((input) => {
    input.checked = !!state.selections.rebase;
  });
  document.querySelectorAll("input[data-control='toggle-logScale']").forEach((input) => {
    input.checked = !!state.selections.logScale;
  });
  document.querySelectorAll("input[data-control='toggle-showAnnotations']").forEach((input) => {
    input.checked = !!state.selections.showAnnotations;
  });
  document.querySelectorAll("input[data-control='toggle-smoothLines']").forEach((input) => {
    input.checked = !!state.selections.smoothLines;
  });
}
