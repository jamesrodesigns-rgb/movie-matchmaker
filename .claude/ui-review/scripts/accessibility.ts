export type AxeFinding = {
  id: string;
  impact?: string;
  description: string;
  help: string;
  helpUrl: string;
  nodes: { html: string; target: string[] }[];
};

export function summarizeAxe(axeResult: any) {
  const violations: AxeFinding[] = (axeResult.violations || []).map((v: any) => ({
    id: v.id,
    impact: v.impact,
    description: v.description,
    help: v.help,
    helpUrl: v.helpUrl,
    nodes: v.nodes?.slice(0, 5).map((n: any) => ({
      html: n.html,
      target: n.target
    })) || []
  }));
  return { violations, violationCount: violations.length };
}