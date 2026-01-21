export function sparklineTooltipRenderer(params: { yValue: number }) {
  return {
    content: params.yValue.toFixed(2),
  };
}
