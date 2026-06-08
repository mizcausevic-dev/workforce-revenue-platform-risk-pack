# workforce-revenue-platform-risk-pack

Workforce Revenue Platform Risk Pack is a Kinetic Gain benchmark-pack repo for enterprise platform and company signals.

It evaluates **Salesforce, HubSpot, Gainsight, ChurnZero, dbt, Databricks, Looker, Sigma, Microsoft Entra ID, Palo Alto, Wiz, SailPoint, Saviynt, GitHub and GitLab, Terraform, Pulumi, Datadog, New Relic, ServiceNow, Workato, MuleSoft, Zapier, Workday, Rippling** through one board-readable operating lens: where the estate is exposed, where savings are available, where investment is justified, and what evidence leaders can show.

## Signal coverage

- Salesforce
- HubSpot
- Gainsight
- ChurnZero
- dbt
- Databricks
- Looker
- Sigma
- Microsoft Entra ID
- Palo Alto
- Wiz
- SailPoint
- Saviynt
- GitHub and GitLab
- Terraform
- Pulumi
- Datadog
- New Relic
- ServiceNow
- Workato
- MuleSoft
- Zapier
- Workday
- Rippling

## What it includes

- runnable Node CLI for synthetic benchmark summaries
- JSON fixture with exposure, savings, and investment lanes
- static proof page in site/index.html
- CI with Node's built-in test runner
- synthetic data only; no credentials, customer data, or external API calls

## Local run

`powershell
npm test
npm run demo
npm run build
`

## Output shape

`json
{
  "product": "Workforce Revenue Platform Risk Pack",
  "signals": ["Salesforce", "HubSpot", "Gainsight", "ChurnZero", "dbt", "Databricks", "Looker", "Sigma", "Microsoft Entra ID", "Palo Alto", "Wiz", "SailPoint", "Saviynt", "GitHub and GitLab", "Terraform", "Pulumi", "Datadog", "New Relic", "ServiceNow", "Workato", "MuleSoft", "Zapier", "Workday", "Rippling"],
  "averageScore": 85,
  "priorityLane": "investment"
}
`

## Kinetic Gain fit

This repo strengthens the portfolio's Platform and Company Signals layer without creating more Hostinger subdomains. The public repo itself is the proof artifact; the portfolio atlas reads the repo metadata and keeps the signal counts aligned.