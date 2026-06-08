import { readFileSync } from "node:fs";

export function summarizePortfolioSignal(input) {
  const lanes = Array.isArray(input.lanes) ? input.lanes : [];
  const averageScore = lanes.length
    ? Math.round(lanes.reduce((sum, lane) => sum + Number(lane.score || 0), 0) / lanes.length)
    : 0;
  const priorityLane = lanes
    .slice()
    .sort((left, right) => Number(right.score || 0) - Number(left.score || 0))[0]?.lane ?? "none";
  return { product: input.product, vertical: input.vertical, signals: input.signals ?? [], averageScore, priorityLane, laneCount: lanes.length, nextActions: lanes.map((lane) => ({ lane: lane.lane, owner: lane.owner, next: lane.next })) };
}

export function formatSummary(summary) {
  return `${summary.product}: ${summary.averageScore}/100 benchmark confidence across ${summary.signals.length} platform signals. Priority: ${summary.priorityLane}.`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [, , filePath = "fixtures/sample.json", flag = "--format", format = "summary"] = process.argv;
  const input = JSON.parse(readFileSync(filePath, "utf8"));
  const summary = summarizePortfolioSignal(input);
  console.log(format === "json" || flag === "--json" ? JSON.stringify(summary, null, 2) : formatSummary(summary));
}