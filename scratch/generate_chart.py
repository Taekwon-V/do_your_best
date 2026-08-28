import math, os

artifact_dir = r'C:\Users\kic17\.gemini\antigravity-ide\brain\2f3c92f4-03f9-468a-853b-46468292cd09'
svg_path = os.path.join(artifact_dir, 'gpa_distribution_chart.svg')

# Canvas dimension
W, H = 1000, 680
pad_l, pad_r, pad_t, pad_b = 90, 80, 90, 110
plot_w = W - pad_l - pad_r
plot_h = H - pad_t - pad_b

mu = 3.00
sigma = 0.9518

def norm_cdf(z):
    return 0.5 * (1.0 + math.erf(z / math.sqrt(2.0)))

def to_x(gpa):
    return pad_l + ((gpa - 1.0) / 4.0) * plot_w

def to_y_cdf(pct):
    return pad_t + plot_h - (pct / 100.0) * plot_h

svg = []
svg.append(f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="100%" height="100%" style="background:#fffdfa; font-family:'Pretendard', -apple-system, sans-serif;">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fdfbf7"/>
      <stop offset="100%" stop-color="#f5ede0"/>
    </linearGradient>
    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="25%" stop-color="#3b82f6"/>
      <stop offset="55%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#ef4444"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="2" dy="3" stdDeviation="3" flood-opacity="0.12"/>
    </filter>
  </defs>

  <!-- Card Background -->
  <rect x="0" y="0" width="{W}" height="{H}" fill="url(#bgGrad)"/>
  <rect x="30" y="20" width="{W-60}" height="{H-40}" rx="24" fill="#ffffff" stroke="#1e293b" stroke-width="2.5" filter="url(#shadow)"/>

  <!-- Title & Header -->
  <text x="{W/2}" y="55" text-anchor="middle" font-size="22" font-weight="900" fill="#0f172a">2028 내신 5등급제 누적 GPA 정규분포 곡선 &amp; 백분위 매트릭스</text>
  <text x="{W/2}" y="77" text-anchor="middle" font-size="12" font-weight="600" fill="#64748b">일반고 5개 학기 124단위수 가중평균 모델 (μ = 3.00, σ = 0.952)</text>
''')

# Shaded 5-tier grade regions
zones = [
    (1.00, 1.70, '#10b981', '1등급', '상위 10%'),
    (1.70, 2.57, '#3b82f6', '2등급', '상위 34%'),
    (2.57, 3.43, '#f59e0b', '3등급', '상위 66%'),
    (3.43, 4.30, '#f97316', '4등급', '상위 90%'),
    (4.30, 5.00, '#ef4444', '5등급', '상위 100%'),
]

for g_start, g_end, col, label, sub in zones:
    x1, x2 = to_x(g_start), to_x(g_end)
    svg.append(f'<rect x="{x1}" y="{pad_t}" width="{x2-x1}" height="{plot_h}" fill="{col}" opacity="0.08"/>')
    svg.append(f'<line x1="{x2}" y1="{pad_t}" x2="{x2}" y2="{pad_t+plot_h}" stroke="{col}" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.6"/>')
    # Top zone badge
    badge_w = 90
    svg.append(f'<rect x="{(x1+x2)/2 - badge_w/2}" y="{pad_t + 10}" width="{badge_w}" height="22" rx="11" fill="{col}" opacity="0.9"/>')
    svg.append(f'<text x="{(x1+x2)/2}" y="{pad_t + 25}" text-anchor="middle" font-size="11" font-weight="800" fill="#ffffff">{label} ({sub})</text>')

# Horizontal Grid Lines for CDF (0% to 100%)
for pct in range(0, 101, 10):
    y = to_y_cdf(pct)
    svg.append(f'<line x1="{pad_l}" y1="{y}" x2="{pad_l+plot_w}" y2="{y}" stroke="#e2e8f0" stroke-width="1"/>')
    svg.append(f'<text x="{pad_l - 12}" y="{y + 4}" text-anchor="end" font-size="11" font-weight="700" fill="#64748b">{pct}%</text>')

# Y axis Label
svg.append(f'<text x="{pad_l - 50}" y="{pad_t + plot_h/2}" text-anchor="middle" font-size="13" font-weight="800" fill="#1e293b" transform="rotate(-90 {pad_l - 50} {pad_t + plot_h/2})">전국 누적 상위 백분위 (%)</text>')

# CDF Curve (S-Curve)
cdf_pts = []
for g_int in range(100, 501):
    g = g_int / 100.0
    z = (g - mu) / sigma
    pct = norm_cdf(z) * 100.0
    x, y = to_x(g), to_y_cdf(pct)
    cdf_pts.append(f'{x:.2f},{y:.2f}')

svg.append(f'<polyline points="{" ".join(cdf_pts)}" fill="none" stroke="url(#lineGrad)" stroke-width="4.5" stroke-linecap="round" filter="url(#shadow)"/>')

# X-Axis Ticks & Labels
for g_int in range(100, 501, 50):
    g = g_int / 100.0
    x = to_x(g)
    svg.append(f'<line x1="{x}" y1="{pad_t+plot_h}" x2="{x}" y2="{pad_t+plot_h+8}" stroke="#0f172a" stroke-width="2"/>')
    svg.append(f'<text x="{x}" y="{pad_t+plot_h+28}" text-anchor="middle" font-size="13" font-weight="800" fill="#0f172a">{g:.2f}등급</text>')

svg.append(f'<text x="{W/2}" y="{pad_t+plot_h+60}" text-anchor="middle" font-size="14" font-weight="900" fill="#0f172a">5등급제 최종 누적 평균 내신 (GPA)</text>')

# KEY MILESTONE HIGHLIGHTS
milestones = [
    (1.30, 3.79, '#10b981', '구 1등급 컷', '1.30 (3.8%)', 'top'),
    (1.70, 9.96, '#059669', '5등급제 1등급 컷', '1.70 (10.0%)', 'top'),
    (1.75, 10.94, '#2563eb', '구 2등급 컷', '1.75 (10.9%)', 'bottom'),
    (2.25, 23.52, '#3b82f6', '구 3등급 컷', '2.25 (23.5%)', 'top'),
    (2.41, 28.62, '#ec4899', '★ 우리 아들 현재 성적!', '2.41등급 (상위 28.6%)', 'target'),
    (2.57, 34.11, '#f59e0b', '5등급제 2등급 컷', '2.57 (34.1%)', 'bottom'),
    (3.00, 50.13, '#64748b', '전국 정중앙', '3.00 (50.1%)', 'top'),
]

for g, pct, col, title, badge, pos in milestones:
    x = to_x(g)
    y = to_y_cdf(pct)
    
    if pos == 'target':
        # Special highlight for Our Son
        svg.append(f'<circle cx="{x}" cy="{y}" r="16" fill="#ec4899" opacity="0.25"/>')
        svg.append(f'<circle cx="{x}" cy="{y}" r="8" fill="#ec4899" stroke="#ffffff" stroke-width="2.5" filter="url(#shadow)"/>')
        svg.append(f'<line x1="{x}" y1="{y}" x2="{x}" y2="{pad_t+plot_h}" stroke="#ec4899" stroke-width="2" stroke-dasharray="3 3"/>')
        
        # Pin card
        card_w, card_h = 170, 52
        card_x, card_y = x - card_w/2, y - 72
        svg.append(f'<rect x="{card_x}" y="{card_y}" width="{card_w}" height="{card_h}" rx="10" fill="#ec4899" stroke="#831843" stroke-width="2" filter="url(#shadow)"/>')
        svg.append(f'<polygon points="{x-8},{card_y+card_h} {x+8},{card_y+card_h} {x},{card_y+card_h+8}" fill="#ec4899"/>')
        svg.append(f'<text x="{x}" y="{card_y+20}" text-anchor="middle" font-size="12" font-weight="900" fill="#ffffff">{title}</text>')
        svg.append(f'<text x="{x}" y="{card_y+39}" text-anchor="middle" font-size="13" font-weight="900" fill="#fdf2f8">{badge}</text>')
    else:
        svg.append(f'<circle cx="{x}" cy="{y}" r="5" fill="{col}" stroke="#ffffff" stroke-width="1.5"/>')
        svg.append(f'<line x1="{x}" y1="{y}" x2="{x}" y2="{pad_t+plot_h}" stroke="{col}" stroke-width="1" stroke-dasharray="2 2" opacity="0.6"/>')
        y_offset = -14 if pos == 'top' else 24
        svg.append(f'<text x="{x}" y="{y + y_offset}" text-anchor="middle" font-size="10" font-weight="800" fill="{col}">{badge}</text>')

svg.append('</svg>')

with open(svg_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(svg))

print('SUCCESS:', svg_path)
