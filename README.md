# Narrative-Driven Market Timeline

An interactive, fully client-side visual narrative that overlays historic market-moving events with macroeconomic stress markers and cross-asset performance. The project is optimized for GitHub Pages hosting and fetches data daily through GitHub Actions.

![Narrative timeline placeholder](https://dummyimage.com/1280x720/0f172a/ffffff&text=Narrative-Driven+Market+Timeline)

> **Live site:** https://vic4code.github.io/codex-demo-finance/

## Features

- **Triple-layer storytelling** – Events, macro indicators, and market indices share a synchronized time axis, zoom level, and crosshair.
- **Daily automation** – A GitHub Actions workflow fetches Yahoo Finance and FRED data each morning at 09:30 Asia/Taipei (01:30 UTC) and deploys the refreshed site (it also runs on every push to `main` so the very first commit immediately publishes Pages).
- **Graceful fallbacks** – Sample JSON datasets are bundled; if live fetches fail the interface notifies the viewer and loads cached data.
- **Theme-aware UI** – Tailwind + custom CSS variables support light/dark themes with automatic detection and a manual override.
- **Mobile-first controls** – Filters collapse into an accessible drawer on small screens while maintaining keyboard navigation support.
- **Annotation intelligence** – Event labels use clustering to avoid overlaps and can be toggled for dense ranges.

## Project structure

```
├─ index.html            # Landing page + visualization
├─ css/styles.css        # Tailwind-friendly custom styling
├─ js/app.js             # ECharts orchestration & controls
├─ data/                 # JSON outputs committed daily
│  ├─ prices.json
│  ├─ macro.json
│  └─ events.json
├─ scripts/
│  └─ fetch_data.py      # Data ingestion script (Yahoo, FRED, YAML events)
├─ events.yaml           # Source of curated events (any language)
├─ requirements.txt      # Python dependencies for the fetch script
├─ .github/workflows/
│  └─ update.yml         # Scheduled automation + Pages deploy
├─ README.md             # Documentation
└─ LICENSE               # MIT
```

## Local development

1. **Install Python dependencies** (optional if you rely on bundled samples):

   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Fetch the latest datasets** (requires internet access; FRED metrics are optional unless `FRED_API_KEY` is provided):

   ```bash
   export FRED_API_KEY="your-token"  # optional
   python scripts/fetch_data.py
   ```

   The script writes JSON files to `data/`. If translations are needed for non-English event titles, the script attempts automatic translation (via Google Translate). Provide `title_en` / `brief_en` in YAML if you prefer manual phrasing.

3. **Launch a static server** from the repository root:

   ```bash
   python -m http.server 4173
   ```

   Visit [http://localhost:4173](http://localhost:4173). The app requires no bundling or build process.

## GitHub Pages deployment

The repository is structured so that GitHub Pages can publish straight from the repository root while the workflow prepares the bundle automatically. To
make the visualization available via `https://<username>.github.io/<repository>/` (and viewable on mobile immediately), follow
these steps after pushing the project to GitHub:

1. Push the repository to GitHub (the default branch should be `main`).
2. In the GitHub UI, navigate to **Settings → Pages**.
3. Under **Build and deployment**, choose **Source → GitHub Actions**. This allows the bundled workflow to control deploys.
4. Save the settings. The workflow now runs automatically on every push to `main`—including your very first commit—and publishes the latest static bundle.
5. Grab the Pages URL shown in the **Deployments** panel (it will look like `https://<username>.github.io/<repository>/`) and
   share or bookmark it. The layout is responsive, so opening the link on a phone uses the mobile drawer controls.

> **Tip:** You can trigger an on-demand deployment anytime via **Actions → Update data and deploy → Run workflow** if you want to refresh mid-day.

## Automation workflow

- **Schedule:** Every day at 01:30 UTC (09:30 Asia/Taipei).
- **Steps:**
  1. Install Python dependencies.
  2. Run `scripts/fetch_data.py` to refresh `data/*.json`.
  3. Commit changes if datasets differ from the previous run.
  4. Package the static assets and deploy via `actions/deploy-pages`.
- **Manual trigger:** Run from the Actions tab using *Run workflow*.

## Editing narratives

- Update `events.yaml` with additional entries. Example:

  ```yaml
  - date: 2024-11-01
    title: 新的事件
    brief: 事件描述
    title_en: New catalyst
    brief_en: Cross-asset rebalancing accelerated.
  ```

- The fetch script normalizes text to English. Provide `title_en` / `brief_en` for precise wording or rely on automatic translation.

## Adding assets or indicators

- **Markets:** Extend `PRICE_TICKERS` in `scripts/fetch_data.py` and add the corresponding definition in `js/app.js` under `MARKET_DEFINITIONS`. The UI will automatically include the checkbox.
- **Macro:** Add a key to both `MACRO_TICKERS` (or FRED logic) and `MACRO_DEFINITIONS` in `app.js`.
- Rerun `python scripts/fetch_data.py` to generate updated JSON.

## Accessibility and performance notes

- High-contrast palettes ensure a WCAG AA contrast ratio (≥ 4.5:1).
- Respect for `prefers-reduced-motion` reduces transitions where possible.
- Semantic HTML structure (header/main/section/footer) supports screen readers.
- Preconnect hints (`cdn.jsdelivr.net`, `cdnjs.cloudflare.com`) improve loading for CDN assets.

## Contributing

1. Fork the repository and create a topic branch.
2. Ensure linting/tests (if any) pass and update documentation when adding new assets or indicators.
3. Submit a pull request describing the enhancements. Be mindful of accessibility and performance targets (aim for Lighthouse ≥ 90 across all categories).

## License

Released under the [MIT License](./LICENSE). Data sources remain subject to their respective terms (Yahoo Finance, FRED, and curated event narratives).
