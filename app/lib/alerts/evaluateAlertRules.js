export function compareMetric(metricValue, operator, threshold) {
  const value = Number(metricValue || 0);
  const target = Number(threshold || 0);

  switch (operator) {
    case ">":
      return value > target;
    case ">=":
      return value >= target;
    case "<":
      return value < target;
    case "<=":
      return value <= target;
    case "=":
    case "==":
      return value === target;
    default:
      return false;
  }
}

export function evaluateAlertRules(rules = [], metrics = {}) {
  const triggered = [];

  for (const rule of rules) {
    if (!rule?.is_active) continue;

    const metricValue = Number(metrics?.[rule.metric_key] ?? 0);
    const hit = compareMetric(metricValue, rule.operator, rule.threshold);

    if (hit) {
      triggered.push({
        rule_name: rule.rule_name,
        metric_key: rule.metric_key,
        metric_value: metricValue,
        operator: rule.operator,
        threshold: Number(rule.threshold || 0),
        severity: rule.severity || "medium",
      });
    }
  }

  return triggered;
}