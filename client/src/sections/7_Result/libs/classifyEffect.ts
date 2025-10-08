export const classifyEffect = (val?: number, kind: "d" | "eta2" | "r" = "d") => {
  if (typeof val !== "number" || !Number.isFinite(val)) return "—"
  const x = Math.abs(val)
  if (kind === "eta2") {
    if (x >= 0.14) return "Large effect"
    if (x >= 0.06) return "Medium effect"
    if (x >= 0.01) return "Small effect"
    return "Trivial effect"
  }
  if (kind === "r") {
    if (x >= 0.5) return "Large correlation"
    if (x >= 0.3) return "Medium correlation"
    if (x >= 0.1) return "Small correlation"
    return "Negligible correlation"
  }
  // d / dz
  if (x >= 0.8) return "Large effect"
  if (x >= 0.5) return "Medium effect"
  if (x >= 0.2) return "Small effect"
  return "Trivial effect"
}