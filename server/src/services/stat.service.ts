import * as ss from "simple-statistics";
import * as jstatNs from "jstat"; // jStat: studentt / centralF / normal 分布工具
const jStat: any =
  // ESM 命名匯出
  (jstatNs as any).jStat ??
  // default 上再掛 jStat（一些打包器會長這樣）
  (jstatNs as any).default?.jStat ??
  // 直接用 namespace（最後手段）
  (jstatNs as any);

/** ---------- Types ---------- **/
// Record<K, T> 用來定義一個物件，鍵的型別為 K，值的型別為 T
type Rows = Record<string, string | number>[];

type CI = {
  level: number;
  lower: number;
  upper: number;
};

/** ---------- Utilities ---------- **/

/**
 * 依指定 key 進行分組。
 * 泛型 T 必須符合 Record<string, any> → key: string, value: any
 * @example
 * groupBy([{g:'A',x:1},{g:'B',x:2},{g:'A',x:3}], 'g')
 *  => { A:[{...},{...}], B:[{...}] }
 */
function groupBy<T extends Record<string, any>>(
  rows: T[],
  key: string
): Record<string, T[]> {
  return rows.reduce((acc, r) => {
    const k = String(r[key]);
    (acc[k] ||= []).push(r);
    // acc[k] ||= []
    // acc 裡沒有 key 值 k 的話，在 acc 裡建一個 key 值，並先附值為 []
    // 等同於 if(!acc[k]) acc[k] = []
    return acc;
  }, {} as Record<string, T[]>);
}

/**
 * Z score
 * p ∈ (0,1)
 * @example
 * zScore(0.975)
 * 1.96
 */
function zScore(p: number) {
  return jStat.normal.inv(p, 0, 1);
}

/** 將數值夾在 [0,1] 範圍內 */
function clamp01(x: number) {
  return Math.min(1, Math.max(0, x));
}

/**
 * 將輸入嚴格轉為 number：
 * - 擋 undefined / null
 * - 擋 NaN / Infinity / -Infinity
 * 發現髒資料時丟出 400 錯誤，方便 API 直接回覆前端。
 */
function toNum(x: string | number | undefined): number {
  if (x === undefined || x === null)
    throw { status: 400, code: "MISSING_VALUE", message: "數值欄位缺失" };
  const v = Number(x);
  if (!Number.isFinite(v))
    throw { status: 400, code: "NOT_NUMERIC", message: `非數值輸入: ${x}` };
  return v;
}

/** ---------- Public APIs ---------- **/

/**
 * 兩獨立樣本 t 檢定（等變異假設, pooled-variance）
 * - t/df/p、兩組的大小與平均、Levene 等變異檢定、Cohen's d 與差異的 CI。
 * @param rows     資料列 (object)
 * @param groupKey 群組欄位名
 * @param valueKey 數值欄位名
 * @param ciLevel  信賴水準，預設 0.95
 */
export function independentT(
  rows: Rows,
  args: { groupKey: string; valueKey: string; ciLevel?: number }
) {
  const { groupKey, valueKey } = args;
  const ciLevel = args.ciLevel ?? 0.95;

  // 分組
  const g = groupBy(rows, groupKey);
  const keys = Object.keys(g);
  if (keys.length !== 2)
    throw {
      status: 400,
      code: "NEED_2_GROUPS",
      message: "independent_t 需要兩組",
    };

  const [A, B] = keys as [string, string];
  if (!g[A] || !g[B])
    throw { status: 400, code: "GROUP_UNDEFINED", message: "分組不存在" };

  // 取出兩組數值並轉 number
  const a = g[A].map((r) => toNum(r[valueKey]));
  const b = g[B].map((r) => toNum(r[valueKey]));
  const na = a.length,
    nb = b.length;
  if (na < 2 || nb < 2)
    throw { status: 400, code: "SMALL_N", message: "每組至少 n≥2" };

  // 基本統計量
  const ma = ss.mean(a),
    mb = ss.mean(b);
  const sva = ss.sampleVariance(a),
    svb = ss.sampleVariance(b);
  const df = na + nb - 2;

  // pooled 標準誤 & 檢定統計量
  const sp2 = ((na - 1) * sva + (nb - 1) * svb) / df;
  const se = Math.sqrt(sp2 * (1 / na + 1 / nb));
  const t = se === 0 ? 0 : (ma - mb) / se;
  const p = se === 0 ? 1 : 2 * (1 - jStat.studentt.cdf(Math.abs(t), df));

  // 假設檢定（等變異性） & 效應量 & 信賴區間
  const levene = leveneTest(rows, { groupKey, valueKey }); // {F, df1, df2, p}
  const d = cohensD_independent(a, b); // Cohen's d
  const ci = ciForMeanDiff_independent({
    ma,
    mb,
    sp2,
    na,
    nb,
    df,
    level: ciLevel,
  });

  return {
    t,
    p,
    ci,
    effectSize: { cohenD: d },
    df,
    means: { [A]: ma, [B]: mb },
    sizes: { [A]: na, [B]: nb },
    assumptions: { levene },
  };
}

/**
 * paired t-test
 * - t/df/p、差值平均、Cohen's dz、差值的 CI。
 * @param preKey  前測欄位
 * @param postKey 後測欄位
 */
export function pairedT(
  rows: Rows,
  args: { preKey: string; postKey: string; ciLevel?: number }
) {
  const { preKey, postKey } = args;
  const ciLevel = args.ciLevel ?? 0.95;

  // 差值向量 d
  const dvals = rows.map((r) => toNum(r[postKey]) - toNum(r[preKey]));
  const n = dvals.length;
  if (n < 2)
    throw { status: 400, code: "SMALL_N", message: "paired_t 需要 n≥2" };

  // 統計量
  const md = ss.mean(dvals);
  const sd = ss.sampleStandardDeviation(dvals); // 樣本標準差
  const se = sd / Math.sqrt(n);
  const df = n - 1;
  const t = se === 0 ? 0 : md / se;
  const p = se === 0 ? 1 : 2 * (1 - jStat.studentt.cdf(Math.abs(t), df));

  // 效應量與 CI
  const dz = sd === 0 ? 0 : md / sd; // Cohen's dz
  const ci = ciForMeanDiff_paired({ md, sd, n, df, level: ciLevel });

  return {
    t,
    p,
    ci,
    effectSize: { cohenDz: dz },
    df,
    meanDiff: md,
    n,
  };
}

/**
 * 單因子 ANOVA
 * 每組平均、樣本數、效果量 η² 與其保守 CI 近似。
 */
export function anovaOneWay(
  rows: Rows,
  args: { groupKey: string; valueKey: string; ciLevel?: number }
) {
  const { groupKey, valueKey } = args;
  const ciLevel = args.ciLevel ?? 0.95;

  // 分組
  const g: Record<string, Rows> = groupBy(rows, groupKey);
  const labels = Object.keys(g);

  // 各組資料（轉 number），以及組數檢查
  const groups: number[][] = labels.map((l) =>
    g[l]!.map((r) => toNum(r[valueKey]))
  );
  const k = groups.length;
  if (k < 2)
    throw { status: 400, code: "NEED_2_GROUPS", message: "anova 需要至少兩組" };

  // 基本量
  const all: number[] = groups.flat();
  const N = all.length;
  const grand = ss.mean(all);
  const groupMeans: number[] = groups.map((grp) => ss.mean(grp));

  // SS_between / SS_within
  const ssb = groups.reduce(
    (acc, grp, i) => acc + grp.length * (groupMeans[i]! - grand) ** 2,
    0
  );
  const ssw = groups.reduce(
    (acc, grp, i) =>
      acc + grp.reduce((a, v) => a + (v - groupMeans[i]!) ** 2, 0),
    0
  );

  // F and p
  const dfb = k - 1;
  const dfw = N - k;
  const msb = ssb / dfb,
    msw = ssw / dfw;
  const F = msw === 0 ? Infinity : msb / msw;
  const p = msw === 0 ? 0 : 1 - jStat.centralF.cdf(F, dfb, dfw);

  // 效果量 η² (類似迴歸的 R²)
  const sst = ssb + ssw;
  const eta2 = sst === 0 ? 0 : ssb / sst;

  // 粗略近似：方便先有 CI
  const varEta2Approx =
    (2 * eta2 ** 2 * (dfw ** 2 + (k - 1) ** 2)) / (N ** 2 * (k - 1) ** 2);
  const z = zScore(0.5 + ciLevel / 2);
  const ciEta2: CI = {
    level: ciLevel,
    lower: clamp01(eta2 - z * Math.sqrt(Math.max(varEta2Approx, 0))),
    upper: clamp01(eta2 + z * Math.sqrt(Math.max(varEta2Approx, 0))),
  };

  return {
    F,
    p,
    ci: { eta2: ciEta2 },
    effectSize: { eta2 },
    dfb,
    dfw,
    groupMeans: Object.fromEntries(labels.map((l, i) => [l, groupMeans[i]])),
    sizes: Object.fromEntries(labels.map((l, i) => [l, groups[i]!.length])),
  };
}

/**
 * 皮爾森相關 r（附 t 檢定與 Fisher z CI）
 * - H0: ρ = 0
 */
export function correlation(
  rows: Rows,
  args: { xKey: string; yKey: string; ciLevel?: number }
) {
  const { xKey, yKey } = args;
  const ciLevel = args.ciLevel ?? 0.95;

  // 檢查
  const x = rows.map((r) => toNum(r[xKey]));
  const y = rows.map((r) => toNum(r[yKey]));
  if (x.length !== y.length || x.length < 3)
    throw {
      status: 400,
      code: "BAD_LENGTH",
      message: "樣本量需 ≥3 且 x,y 等長",
    };

  // r、t、p
  const r = ss.sampleCorrelation(x, y);
  const n = x.length;
  const t = (r * Math.sqrt(n - 2)) / Math.sqrt(1 - r * r);
  const p = 2 * (1 - jStat.studentt.cdf(Math.abs(t), n - 2));

  // Fisher z 轉換的 CI（r → z → CI → r）
  const zVal = 0.5 * Math.log((1 + r) / (1 - r));
  const se = 1 / Math.sqrt(n - 3);
  const zcrit = zScore(0.5 + ciLevel / 2);
  const zl = zVal - zcrit * se;
  const zu = zVal + zcrit * se;
  const rl = (Math.exp(2 * zl) - 1) / (Math.exp(2 * zl) + 1);
  const ru = (Math.exp(2 * zu) - 1) / (Math.exp(2 * zu) + 1);

  return {
    r,
    t,
    p,
    ci: { level: ciLevel, lower: rl, upper: ru },
    df: n - 2,
  };
}

/** ---------- Levene’s test (assumption) ---------- **/

/**
 * Levene / Brown–Forsythe 等變異檢定（預設用 median 作為中心較穩健）
 * - 將 Z_ij = |Y_ij - T_i|（T_i = 組內 median/mean）做一因子 ANOVA，回傳 F/df/p。
 */
export function leveneTest(
  rows: Rows,
  args: { groupKey: string; valueKey: string; center?: "median" | "mean" }
) {
  const { groupKey, valueKey } = args;
  const center = args.center ?? "median";

  // 分組 & 檢查
  const g = groupBy(rows, groupKey);
  const labels = Object.keys(g);
  if (labels.length < 2)
    throw {
      status: 400,
      code: "NEED_2_GROUPS",
      message: "Levene 需要至少兩組",
    };

  // 取組別數值
  const groups = labels.map((l) => g[l]!.map((r) => toNum(r[valueKey])));
  const k = groups.length;
  const Ns = groups.map((grp) => grp.length);
  const N = Ns.reduce((a, b) => a + b, 0);

  // 以 median/mean 為中心，轉成 Z 值（絕對偏差）
  const Ti = groups.map((grp) =>
    center === "median" ? ss.median(grp) : ss.mean(grp)
  );
  const Zij = groups.map((grp, i) => grp.map((v) => Math.abs(v - Ti[i]!)));

  // 對 Z 做一因子 ANOVA：F = MS_between / MS_within
  const allZ = Zij.flat();
  const grandZ = ss.mean(allZ);
  const ssb = Zij.reduce(
    (acc, zgrp) => acc + zgrp.length * (ss.mean(zgrp) - grandZ) ** 2,
    0
  );
  const ssw = Zij.reduce(
    (acc, zgrp) => acc + zgrp.reduce((a, v) => a + (v - ss.mean(zgrp)) ** 2, 0),
    0
  );
  const dfb = k - 1;
  const dfw = N - k;
  const msb = ssb / dfb,
    msw = ssw / dfw;
  const F = msw === 0 ? Infinity : msb / msw;
  const p = msw === 0 ? 0 : 1 - jStat.centralF.cdf(F, dfb, dfw);

  return { F, df1: dfb, df2: dfw, p, center };
}

/** ---------- Helpers: Effect sizes & CIs ---------- **/

/** Cohen's d（獨立樣本）：以 pooled SD 標準化平均差。 */
function cohensD_independent(a: number[], b: number[]) {
  const ma = ss.mean(a),
    mb = ss.mean(b);
  const sva = ss.sampleVariance(a),
    svb = ss.sampleVariance(b);
  const na = a.length,
    nb = b.length;
  const sp2 = ((na - 1) * sva + (nb - 1) * svb) / (na + nb - 2);
  const sp = Math.sqrt(sp2);
  return sp === 0 ? 0 : (ma - mb) / sp;
}

/** (μA-μB) 的信賴區間（獨立樣本, pooled-variance）。 */
function ciForMeanDiff_independent(params: {
  ma: number;
  mb: number;
  sp2: number;
  na: number;
  nb: number;
  df: number;
  level: number;
}): CI {
  const { ma, mb, sp2, na, nb, df, level } = params;
  const se = Math.sqrt(sp2 * (1 / na + 1 / nb));
  const tcrit = jStat.studentt.inv(0.5 + level / 2, df);
  const diff = ma - mb;
  return { level, lower: diff - tcrit * se, upper: diff + tcrit * se };
}

/** 差值平均 (μd) 的信賴區間（成對樣本）。 */
function ciForMeanDiff_paired(params: {
  md: number;
  sd: number;
  n: number;
  df: number;
  level: number;
}): CI {
  const { md, sd, n, df, level } = params;
  const se = sd / Math.sqrt(n);
  const tcrit = jStat.studentt.inv(0.5 + level / 2, df);
  return { level, lower: md - tcrit * se, upper: md + tcrit * se };
}
