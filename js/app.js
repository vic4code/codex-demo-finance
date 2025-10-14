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

async function fetchDataset(name) {
  const basePaths = [
    `./data/${name}.json`,
    `data/${name}.json`,
    `${name}.json`
  ];
  for (const path of basePaths) {
    try {
      const response = await fetch(path, { cache: "no-cache" });
      if (response.ok) {
        return { data: await response.json(), message: null };
      }
    } catch (error) {
      // Continue to next path
    }
  }
  return {
    data: null,
    message: `Unable to load ${name} dataset from the bundled data directory.`
  };
}

async function loadData() {
  state.fallbackMessages = [];
  const [prices, macro, events] = await Promise.all([
    fetchDataset("prices"),
    fetchDataset("macro"),
    fetchDataset("events")
  ]);

  state.data.prices = prices.data || {};
  state.data.macro = macro.data || {};
  state.data.events = Array.isArray(events.data) ? events.data : [];

  [prices, macro, events]
    .filter((result) => result.message)
    .forEach((result) => state.fallbackMessages.push(result.message));

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

function prepareMacroSeries(xAxisIndex, yAxisIndex) {
  const start = state.selections.startDate;
  const end = state.selections.endDate;
  return MACRO_DEFINITIONS.filter((def) => state.selections.macros.has(def.key)).map((def) => {
    const rawSeries = state.data.macro[def.key] || [];
    const filtered = filterSeriesByDate(rawSeries, start, end);
    return {
      name: def.label,
      type: "line",
      xAxisIndex,
      yAxisIndex,
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

function prepareMarketSeries(xAxisIndex, yAxisIndex) {
  const start = state.selections.startDate;
  const end = state.selections.endDate;
  return MARKET_DEFINITIONS.filter((def) => state.selections.markets.has(def.key)).map((def) => {
    const rawSeries = state.data.prices[def.key] || [];
    const filtered = filterSeriesByDate(rawSeries, start, end);
    const data = state.selections.rebase ? rebaseSeries(filtered) : toPairs(filtered);
    return {
      name: def.label,
      type: "line",
      xAxisIndex,
      yAxisIndex,
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

function prepareEventSeries(theme, xAxisIndex, yAxisIndex) {
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
      xAxisIndex,
      yAxisIndex,
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
      xAxisIndex,
      yAxisIndex,
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
      labelLayout: { moveOverlap: "shiftY" },
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

  const gridConfigs = [
    { top: 96, height: 78, left: 80, right: 80, containLabel: true },
    { top: 204, height: 150, left: 80, right: 80, containLabel: true },
    { top: 388, height: 190, left: 80, right: 80, containLabel: true }
  ];

  const xAxes = gridConfigs.map((grid, index) => ({
    type: "time",
    gridIndex: index,
    min: start,
    max: end,
    axisLabel: {
      color: theme.mutedColor,
      show: index === gridConfigs.length - 1
    },
    axisTick: { show: index === gridConfigs.length - 1 },
    axisLine: {
      show: index === gridConfigs.length - 1,
      lineStyle: { color: theme.borderColor }
    },
    splitLine: { show: false },
    axisPointer: { label: { color: theme.textColor, backgroundColor: theme.borderColor } }
  }));

  const yAxes = [
    {
      type: "value",
      gridIndex: 0,
      min: 0,
      max: 1.1,
      show: false,
      splitLine: { show: false }
    },
    {
      type: "value",
      gridIndex: 1,
      name: "Macro indicators",
      nameLocation: "middle",
      nameGap: 56,
      axisLabel: { color: theme.mutedColor },
      axisLine: { lineStyle: { color: theme.borderColor } },
      splitLine: { lineStyle: { color: `${theme.borderColor}44` } }
    },
    {
      type: state.selections.logScale ? "log" : "value",
      gridIndex: 2,
      name: state.selections.rebase ? "Markets (rebased = 100)" : "Markets",
      nameLocation: "middle",
      nameGap: 64,
      axisLabel: {
        color: theme.mutedColor,
        formatter: (value) =>
          state.selections.rebase ? Number(value).toFixed(0) : formatNumber(Number(value))
      },
      axisLine: { lineStyle: { color: theme.borderColor } },
      splitLine: { lineStyle: { color: `${theme.borderColor}44` } }
    }
  ];

  const marketSeries = prepareMarketSeries(2, 2);
  const macroSeries = prepareMacroSeries(1, 1);
  const eventSeries = prepareEventSeries(theme, 0, 0);

  const legendEntries = Array.from(
    new Set([
      ...macroSeries.map((series) => series.name),
      ...marketSeries.map((series) => series.name),
      eventSeries.markers.name
    ])
  );

  charts.timeline.setOption(
    {
      backgroundColor: theme.backgroundColor,
      grid: gridConfigs,
      legend: {
        data: legendEntries,
        textStyle: { color: theme.textColor },
        top: 16,
        icon: "circle",
        itemGap: 16,
        type: "scroll"
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross", link: [{ xAxisIndex: [0, 1, 2] }] },
        backgroundColor: theme.backgroundColor,
        borderColor: theme.borderColor,
        textStyle: { color: theme.textColor },
        extraCssText: "box-shadow:0 12px 34px -20px rgba(15,23,42,0.5);border-radius:12px;padding:12px 16px;",
        formatter: (params) => {
          if (!params || !params.length) return "";
          const axisValue = Number(params[0].axisValue);
          const header = `<div style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.12em;color:${theme.mutedColor}">${formatDateTooltip(axisValue)}</div>`;

          const buildRows = (items) =>
            items
              .map(
                (item) => `
                  <div style="display:flex;justify-content:space-between;gap:16px;align-items:center;">
                    <span style="display:flex;align-items:center;gap:6px;color:${item.color}">${item.marker || ""}${item.seriesName}</span>
                    <span>${formatNumber(Number(item.value[1]))}</span>
                  </div>`
              )
              .join("");

          const macroItems = params.filter((item) => item.seriesType === "line" && item.yAxisIndex === 1);
          const marketItems = params.filter((item) => item.seriesType === "line" && item.yAxisIndex === 2);
          const eventItems = params.filter((item) => item.seriesType === "scatter" && item.data?.events?.length);

          const sections = [];
          if (marketItems.length) {
            sections.push(
              `<div style="margin-top:12px"><div style="font-size:0.65rem;text-transform:uppercase;letter-spacing:0.16em;color:${theme.mutedColor}">Markets</div><div style="margin-top:6px;display:grid;gap:6px">${buildRows(marketItems)}</div></div>`
            );
          }
          if (macroItems.length) {
            sections.push(
              `<div style="margin-top:12px"><div style="font-size:0.65rem;text-transform:uppercase;letter-spacing:0.16em;color:${theme.mutedColor}">Macro</div><div style="margin-top:6px;display:grid;gap:6px">${buildRows(macroItems)}</div></div>`
            );
          }
          if (eventItems.length) {
            const eventEntries = [];
            eventItems.forEach((item) => {
              item.data.events.forEach((event) => {
                eventEntries.push(
                  `<div style="padding:6px 0;border-bottom:1px solid ${theme.borderColor}"><strong style="display:block;font-size:0.75rem;margin-bottom:2px;">${event.title}</strong><span style="color:${theme.mutedColor};font-size:0.75rem;">${event.brief}</span></div>`
                );
              });
            });
            sections.push(
              `<div style="margin-top:12px"><div style="font-size:0.65rem;text-transform:uppercase;letter-spacing:0.16em;color:${theme.mutedColor}">Events</div><div style="margin-top:6px;display:flex;flex-direction:column;gap:4px">${eventEntries.join("")}</div></div>`
            );
          }

          return `${header}${sections.join("")}`;
        }
      },
      dataZoom: [
        { type: "inside", xAxisIndex: [0, 1, 2] },
        { type: "slider", xAxisIndex: [0, 1, 2], brushSelect: false, bottom: 20, height: 24 }
      ],
      xAxis: xAxes,
      yAxis: yAxes,
      series: [eventSeries.stems, eventSeries.markers, ...macroSeries, ...marketSeries]
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
