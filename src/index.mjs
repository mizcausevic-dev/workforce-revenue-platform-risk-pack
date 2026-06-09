import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function summarizePortfolioSignal(input) {
  const lanes = Array.isArray(input.lanes) ? input.lanes : [];
  const averageScore = lanes.length
    ? Math.round(lanes.reduce((sum, lane) => sum + Number(lane.score || 0), 0) / lanes.length)
    : 0;
  const priorityLane = lanes
    .slice()
    .sort((left, right) => Number(right.score || 0) - Number(left.score || 0))[0]?.lane ?? "none";
  return {
    product: input.product,
    vertical: input.vertical,
    signals: input.signals ?? [],
    averageScore,
    priorityLane,
    laneCount: lanes.length,
    nextActions: lanes.map((lane) => ({ lane: lane.lane, owner: lane.owner, next: lane.next }))
  };
}

export function formatSummary(summary) {
  const label = "benchmark confidence";
  return `${summary.product}: ${summary.averageScore}/100 ${label} across ${summary.signals.length} platform signals. Priority: ${summary.priorityLane}.`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function titleCase(value) {
  return String(value ?? "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function renderSite(input, summary) {
  const lanes = Array.isArray(input.lanes) ? input.lanes : [];
  const signals = Array.isArray(input.signals) ? input.signals : [];
  const signalItems = signals.slice(0, 24).map((signal) => `<span class="chip">${escapeHtml(signal)}</span>`).join("");
  const laneCards = lanes.map((lane) => `
    <article class="lane">
      <div class="lane-top"><span>${escapeHtml(titleCase(lane.lane))}</span><strong>${escapeHtml(lane.score)}/100</strong></div>
      <h3>${escapeHtml(lane.issue)}</h3>
      <p><b>Owner:</b> ${escapeHtml(lane.owner)}</p>
      <p><b>Next move:</b> ${escapeHtml(lane.next)}</p>
    </article>`).join("");
  const topSignals = signals.slice(0, 6).join(", ");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(input.product)} | Kinetic Gain</title>
  <meta name="description" content="${escapeHtml(input.product)} converts enterprise platform signals into board-ready exposure, savings, and investment decisions." />
  <style>
    :root { color-scheme: dark; --bg:#070b12; --panel:#101827; --panel2:#162236; --line:#27364f; --text:#f6f1e8; --muted:#aeb9cb; --aqua:#25d9f2; --mint:#39e7aa; --violet:#a78bfa; --amber:#ffd166; }
    * { box-sizing: border-box; }
    body { margin:0; background: radial-gradient(circle at 18% 0%, rgba(167,139,250,.16), transparent 32%), radial-gradient(circle at 100% 8%, rgba(37,217,242,.12), transparent 30%), var(--bg); color:var(--text); font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
    main { max-width:1180px; margin:0 auto; padding: clamp(24px, 4vw, 60px) 20px 48px; }
    .hero, .panel { border:1px solid var(--line); border-radius:30px; background: linear-gradient(145deg, rgba(16,24,39,.96), rgba(8,13,22,.98)); box-shadow:0 24px 90px rgba(0,0,0,.36); }
    .hero { padding: clamp(28px, 5vw, 58px); overflow:hidden; position:relative; }
    .hero::after { content:""; position:absolute; inset:0 0 auto; height:4px; background:linear-gradient(90deg,var(--mint),var(--aqua),var(--violet)); }
    .eyebrow { color:var(--mint); text-transform:uppercase; letter-spacing:.18em; font:800 12px/1.2 ui-monospace, SFMono-Regular, Consolas, monospace; }
    h1 { max-width:900px; margin:18px 0 18px; font-size:clamp(42px, 7vw, 86px); line-height:.94; letter-spacing:-.06em; }
    h2 { margin:0 0 16px; font-size:clamp(26px, 4vw, 44px); line-height:1; letter-spacing:-.035em; }
    h3 { margin:12px 0; font-size:20px; line-height:1.25; }
    p { color:var(--muted); font-size:17px; line-height:1.7; }
    .deck { max-width:780px; font-size:20px; }
    .metrics, .grid, .lenses { display:grid; gap:16px; }
    .metrics { grid-template-columns:repeat(4,minmax(0,1fr)); margin-top:26px; }
    .metric, .lane, .lens { border:1px solid rgba(255,255,255,.1); border-radius:20px; padding:18px; background:rgba(255,255,255,.04); }
    .metric span, .lane-top span, .lens span { color:var(--muted); text-transform:uppercase; letter-spacing:.14em; font:800 11px/1.2 ui-monospace, SFMono-Regular, Consolas, monospace; }
    .metric strong { display:block; margin-top:8px; color:var(--aqua); font-size:30px; }
    .panel { margin-top:22px; padding: clamp(24px, 4vw, 42px); }
    .chips { display:flex; flex-wrap:wrap; gap:10px; margin-top:18px; }
    .chip { min-height:36px; display:inline-flex; align-items:center; border:1px solid rgba(167,139,250,.35); border-radius:999px; padding:8px 12px; background:rgba(167,139,250,.10); color:#dfe7ff; font:700 13px/1 ui-monospace, SFMono-Regular, Consolas, monospace; }
    .grid { grid-template-columns:repeat(3,minmax(0,1fr)); }
    .lane-top { display:flex; justify-content:space-between; gap:14px; align-items:center; }
    .lane-top strong { color:var(--amber); font-size:22px; }
    .lenses { grid-template-columns:repeat(3,minmax(0,1fr)); }
    .lens b { color:var(--text); }
    .callout { border-left:4px solid var(--mint); background:rgba(57,231,170,.07); padding:18px 20px; border-radius:18px; }
    footer { margin-top:24px; color:var(--muted); display:flex; flex-wrap:wrap; gap:14px; font:700 13px/1.4 ui-monospace, SFMono-Regular, Consolas, monospace; }
    a { color:var(--aqua); }
    @media (max-width: 760px) { .metrics, .grid, .lenses { grid-template-columns:1fr; } main { padding-inline:14px; } .hero, .panel { border-radius:22px; } }
  </style>
</head>
<body>
  <main>
    <section class="hero">
      <div class="eyebrow">Kinetic Gain enterprise signal benchmark</div>
      <h1>${escapeHtml(input.product)}</h1>
      <p class="deck">A board-ready operating surface for ${escapeHtml(input.vertical)} leaders who need to answer where the stack is exposed, where spend can be consolidated, where investment is justified, and what story should go to the board.</p>
      <div class="metrics">
        <div class="metric"><span>Benchmark confidence</span><strong>${summary.averageScore}/100</strong></div>
        <div class="metric"><span>Priority lane</span><strong>${escapeHtml(titleCase(summary.priorityLane))}</strong></div>
        <div class="metric"><span>Evidence lanes</span><strong>${summary.laneCount}</strong></div>
        <div class="metric"><span>Signals mapped</span><strong>${signals.length}</strong></div>
      </div>
    </section>
    <section class="panel">
      <h2>What the product does</h2>
      <p>It turns platform, IAM, BI, workflow, HR, RevOps, observability, and integration signals into one executive packet. The value is not the vendor list by itself. The value is the normalized decision layer that connects vendor sprawl to exposure, savings, and investment priority.</p>
      <div class="chips">${signalItems}</div>
    </section>
    <section class="panel">
      <h2>Decision lanes</h2>
      <div class="grid">${laneCards}</div>
    </section>
    <section class="panel">
      <h2>How a SaaS GTM analyst and value architect would read it</h2>
      <div class="lenses">
        <article class="lens"><span>Revenue strategist</span><p><b>Question:</b> Which systems create growth drag or customer-risk leakage?</p><p>Current signal cluster: ${escapeHtml(topSignals)}.</p></article>
        <article class="lens"><span>Product marketing</span><p><b>Question:</b> Which proof points are buyer-readable without exposing implementation secrets?</p><p>The page packages platform proof as language a CFO, CIO, CRO, or board sponsor can scan quickly.</p></article>
        <article class="lens"><span>Technical reviewer</span><p><b>Question:</b> Is there a deterministic data contract?</p><p>The CLI summarizes fixture lanes into JSON and regenerates this static surface without connecting to live customer systems.</p></article>
      </div>
    </section>
    <section class="panel">
      <h2>What these repos have in common</h2>
      <div class="callout">Each repo is a public proof primitive for Kinetic Gain: normalize fragmented operational signals, score them consistently, route the next decision, and publish a board-safe evidence packet.</div>
      <p>Security posture: all data is synthetic fixture data. No customer tenant, credential, token, employee, financial, or private operational data is required for the public demo.</p>
    </section>
    <footer>
      <span>${escapeHtml(input.product)}</span>
      <a href="https://portfolio.kineticgain.com/">Portfolio</a>
      <a href="https://kineticgain.com/">Kinetic Gain</a>
      <a href="https://github.com/mizcausevic-dev">GitHub</a>
    </footer>
  </main>
</body>
</html>`;
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isCli) {
  const [, , filePath = "fixtures/sample.json", flag = "--format", format = "summary"] = process.argv;
  const input = JSON.parse(readFileSync(filePath, "utf8"));
  const summary = summarizePortfolioSignal(input);

  if (flag === "--site") {
    const target = format || "site/report.json";
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, JSON.stringify(summary, null, 2));
    writeFileSync(path.join(path.dirname(target), "index.html"), renderSite(input, summary));
  } else {
    console.log(format === "json" || flag === "--json" ? JSON.stringify(summary, null, 2) : formatSummary(summary));
  }
}
