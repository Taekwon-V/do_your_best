import numpy as np
import math

# 100만 명 시뮬레이션
z_cuts_9 = [np.inf, 1.750686, 1.226528, 0.738847, 0.253347, -0.253347, -0.738847, -1.226528, -1.750686, -np.inf]
z_cuts_5 = [np.inf, 1.281552, 0.412463, -0.412463, -1.281552, -np.inf]

N = 1000000
rho = 0.75
weights = np.array([4, 4, 4, 3, 3, 2, 4, 4, 4, 3, 3, 2, 4, 4, 4, 3, 3, 4, 4, 4, 3, 3, 4, 4, 4, 3, 3, 2, 2, 2])
total_w = np.sum(weights)

np.random.seed(42)
latent = np.random.randn(N)

gpas_5 = np.zeros(N)
gpas_9 = np.zeros(N)

for w in weights:
    noise = np.random.randn(N)
    score = np.sqrt(rho) * latent + np.sqrt(1 - rho) * noise
    gr5 = np.zeros(N)
    for k in range(1, 6):
        gr5[(score < z_cuts_5[k-1]) & (score >= z_cuts_5[k])] = k
    gpas_5 += w * gr5
    
    gr9 = np.zeros(N)
    for k in range(1, 10):
        gr9[(score < z_cuts_9[k-1]) & (score >= z_cuts_9[k])] = k
    gpas_9 += w * gr9

gpas_5 /= total_w
gpas_9 /= total_w

sorted_5 = np.sort(gpas_5)
sorted_9 = np.sort(gpas_9)

ts = []
ts.append("""// 2028 내신 5등급제 ↔ 기존 9등급제 0.01 단위 동등백분위 1:1 매핑 데이터베이스
export interface GpaDistributionItem {
  gpa5: number;        // 2028 5등급제 GPA (1.00 ~ 5.00)
  gpa9: number;        // 기존 9등급제 환산 GPA (1.00 ~ 9.00)
  zScore: number;      // 정규분포 Z값
  percentile: number;  // 전국 누적 상위 백분위 (%)
  tier5: number;       // 5등급제 등급 (1~5)
  tierDesc: string;
}

export const GPA_NORMAL_DISTRIBUTION_DB: GpaDistributionItem[] = [
""")

for g_int in range(100, 501):
    g5 = round(g_int / 100.0, 2)
    idx = int(np.searchsorted(sorted_5, g5))
    pct = round((idx / N) * 100.0, 2)
    if g5 == 1.00:
        pct = 0.51
        g9 = 1.00
    elif g5 == 5.00:
        pct = 100.0
        g9 = 9.00
    else:
        g9 = round(float(sorted_9[min(max(idx, 0), N - 1)]), 2)
        
    z = round((g5 - 3.00) / 0.9518, 3)
    
    if g5 <= 1.70:
        tier5 = 1
        tierDesc = "1등급 (상위 10%)"
    elif g5 <= 2.57:
        tier5 = 2
        tierDesc = "2등급 (상위 34%)"
    elif g5 <= 3.43:
        tier5 = 3
        tierDesc = "3등급 (상위 66%)"
    elif g5 <= 4.30:
        tier5 = 4
        tierDesc = "4등급 (상위 90%)"
    else:
        tier5 = 5
        tierDesc = "5등급 (상위 100%)"
        
    ts.append(f"  {{ gpa5: {g5:.2f}, gpa9: {g9:.2f}, zScore: {z:.3f}, percentile: {pct:.2f}, tier5: {tier5}, tierDesc: '{tierDesc}' }},\n")

ts.append("""];

/**
 * 5등급제 GPA를 9등급제 환산치 및 누적 백분위로 변환
 */
export function convertGpa5To9(gpa5: number): GpaDistributionItem {
  const rounded = Math.max(1.0, Math.min(5.0, Number(gpa5.toFixed(2))));
  const found = GPA_NORMAL_DISTRIBUTION_DB.find((item) => Math.abs(item.gpa5 - rounded) < 0.005);
  if (found) return found;

  const z = (rounded - 3.00) / 0.9518;
  const g9 = Number((5.00 + 1.771 * (rounded - 3.00)).toFixed(2));
  return {
    gpa5: rounded,
    gpa9: Math.max(1.0, Math.min(9.0, g9)),
    zScore: Number(z.toFixed(3)),
    percentile: 50.0,
    tier5: rounded <= 1.70 ? 1 : rounded <= 2.57 ? 2 : rounded <= 3.43 ? 3 : 4,
    tierDesc: `${rounded <= 1.70 ? 1 : rounded <= 2.57 ? 2 : 3}등급`,
  };
}

/**
 * 기존 9등급제 입결을 2028 5등급제 예상치로 역변환
 */
export function convertGpa9To5(gpa9: number): number {
  const rounded9 = Math.max(1.0, Math.min(9.0, Number(gpa9.toFixed(2))));
  // Find closest in DB
  let closest = GPA_NORMAL_DISTRIBUTION_DB[0];
  let minDiff = 999;
  for (const item of GPA_NORMAL_DISTRIBUTION_DB) {
    const diff = Math.abs(item.gpa9 - rounded9);
    if (diff < minDiff) {
      minDiff = diff;
      closest = item;
    }
  }
  return closest.gpa5;
}
""")

with open('src/data/gpaDistributionDB.ts', 'w', encoding='utf-8') as f:
    f.write(''.join(ts))

print("Successfully updated src/data/gpaDistributionDB.ts")
