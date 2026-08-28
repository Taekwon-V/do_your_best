import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

from generate_complete_master_db import inha_raw, incheon_raw
from generate_cau_data import convert_to_5grade

# Generate Inha markdown
inha_md = """# 인하대학교 2026/2027학년도 입시 결과 및 모집단위 분석

> **출처**: 인하대학교 입학처 공식 2026학년도 수시(학생부교과/학생부종합) 및 정시 입학통계  
> **기준**: 최종등록자 70% Cut 및 2028 5등급제 환산

---

## 1. 전형별 수능최저학력기준 및 특징 요약

* **학생부교과 (지역균형전형)**:
  * 인문: 국, 수, 영, 탐(1) 중 **2개 영역 합 6 이내**
  * 자연(일반): 국, 수, 영, 과(1) 중 **2개 영역 합 5 이내**
  * 의예과: 국, 수, 영, 과(2개 평균) 중 **3개 영역 1등급**
* **학생부종합 (인하미래인재전형)**:
  * **수능최저학력기준 미적용 (수능최저 없음)** *(의예과 제외)*
  * 1단계 서류 100%(3.5배수) ➔ 2단계 1단계 70% + 면접 30%

---

## 2. 전체 단과대학 및 모집단위별 70% Cut 통계 (61개 전 학과)

| 단과대학 | 모집단위 (학과) | 교과 9등급 70% Cut | ⭐ 2028 5등급제 환산 | 학종 9등급 70% Cut | ⭐ 2028 5등급제 환산 | 정시 군 | 정시 70% Cut 백분위 |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
"""

for d in inha_raw:
    g9_g = d["g9_g"] if d["g9_g"] else "-"
    c5_g = f"**{convert_to_5grade(d['g9_g'])}등급**" if d["g9_g"] else "-"
    g9_j = d["g9_j"] if d["g9_j"] else "-"
    c5_j = f"**{convert_to_5grade(d['g9_j'])}등급**" if d["g9_j"] else "-"
    grp_k = "가군" if d["grp"] == "ga" else ("나군" if d["grp"] == "na" else "다군")
    inha_md += f"| {d['col']} | {d['dept']} | {g9_g} | {c5_g} | {g9_j} | {c5_j} | {grp_k} | **{d['pct']}%** |\n"

with open(r"c:\work\do_your_best\docs\universities\inha\past_results_2026.md", "w", encoding="utf-8") as f:
    f.write(inha_md)

# Generate Incheon markdown
incheon_md = """# 국립인천대학교 2026/2027학년도 입시 결과 및 모집단위 분석

> **출처**: 국립인천대학교 입학처 공식 2026학년도 수시(교과/자기추천) 및 정시 입학통계  
> **기준**: 최종등록자 70% Cut 및 2028 5등급제 환산

---

## 1. 전형별 수능최저학력기준 및 특징 요약

* **학생부교과 (지역균형/교과우수자전형)**:
  * 인문/자연: 국, 수, 영, 탐(1) 중 **2개 영역 등급 합 7 이내**
  * 사범대/정보기술대/공과대/도시과학대/생명과학기술대 적용
* **학생부종합 (자기추천전형)**:
  * **수능최저학력기준 미적용 (수능최저 없음)**
  * 1단계 서류 100%(3배수) ➔ 2단계 1단계 70% + 면접 30%

---

## 2. 전체 단과대학 및 모집단위별 70% Cut 통계 (56개 전 학과)

| 단과대학 | 모집단위 (학과) | 교과 9등급 70% Cut | ⭐ 2028 5등급제 환산 | 학종 9등급 70% Cut | ⭐ 2028 5등급제 환산 | 정시 군 | 정시 70% Cut 백분위 |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
"""

for d in incheon_raw:
    g9_g = d["g9_g"] if d["g9_g"] else "-"
    c5_g = f"**{convert_to_5grade(d['g9_g'])}등급**" if d["g9_g"] else "-"
    g9_j = d["g9_j"] if d["g9_j"] else "-"
    c5_j = f"**{convert_to_5grade(d['g9_j'])}등급**" if d["g9_j"] else "-"
    grp_k = "가군" if d["grp"] == "ga" else ("나군" if d["grp"] == "na" else "다군")
    incheon_md += f"| {d['col']} | {d['dept']} | {g9_g} | {c5_g} | {g9_j} | {c5_j} | {grp_k} | **{d['pct']}%** |\n"

with open(r"c:\work\do_your_best\docs\universities\incheon\past_results_2026.md", "w", encoding="utf-8") as f:
    f.write(incheon_md)

print("Inha and Incheon past_results markdowns updated successfully!")
