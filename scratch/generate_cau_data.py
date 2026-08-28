import sys
import os
import re

sys.stdout.reconfigure(encoding='utf-8')

# 5등급제 환산 공식 함수 (9등급제 -> 5등급제)
# 9등급제 1.0~1.3 -> 5등급 1.00~1.05
# 9등급제 1.5 -> 5등급 1.15
# 9등급제 1.8 -> 5등급 1.25
# 9등급제 2.0 -> 5등급 1.35
# 9등급제 2.2 -> 5등급 1.45
# 9등급제 2.5 -> 5등급 1.58
# 9등급제 3.0 -> 5등급 1.75
# 9등급제 3.5 -> 5등급 1.95
def convert_to_5grade(g9):
    if g9 is None or g9 <= 0:
        return 1.5
    if g9 <= 1.1:
        return 1.00
    elif g9 <= 1.3:
        return round(1.00 + (g9 - 1.1) * 0.25, 2)
    elif g9 <= 2.0:
        return round(1.05 + (g9 - 1.3) * 0.40, 2)
    elif g9 <= 3.0:
        return round(1.33 + (g9 - 2.0) * 0.42, 2)
    elif g9 <= 4.0:
        return round(1.75 + (g9 - 3.0) * 0.30, 2)
    else:
        return round(2.05 + (g9 - 4.0) * 0.30, 2)

cau_departments = [
    # 1. 인문대학
    {"deptName": "국어국문학과", "collegeName": "인문대학", "g9_gyogwa": 1.76, "g9_jonghap": 2.45, "jeongsi_group": "ga", "percentile": 89.0},
    {"deptName": "영어영문학과", "collegeName": "인문대학", "g9_gyogwa": 1.72, "g9_jonghap": 2.65, "jeongsi_group": "ga", "percentile": 89.2},
    {"deptName": "유럽문화학부 (독어독문/불어불문/러시아어문)", "collegeName": "인문대학", "g9_gyogwa": 1.85, "g9_jonghap": 3.10, "jeongsi_group": "na", "percentile": 88.5},
    {"deptName": "아시아문화학부 (일본어문/중국어문)", "collegeName": "인문대학", "g9_gyogwa": 1.82, "g9_jonghap": 3.05, "jeongsi_group": "ga", "percentile": 88.5},
    {"deptName": "철학과", "collegeName": "인문대학", "g9_gyogwa": 1.88, "g9_jonghap": 2.85, "jeongsi_group": "ga", "percentile": 88.2},
    {"deptName": "역사학과", "collegeName": "인문대학", "g9_gyogwa": 1.80, "g9_jonghap": 2.70, "jeongsi_group": "ga", "percentile": 88.5},

    # 2. 사회과학대학
    {"deptName": "정치국제학과", "collegeName": "사회과학대학", "g9_gyogwa": 1.68, "g9_jonghap": 2.25, "jeongsi_group": "ga", "percentile": 89.5},
    {"deptName": "심리학과", "collegeName": "사회과학대학", "g9_gyogwa": 1.55, "g9_jonghap": 2.05, "jeongsi_group": "na", "percentile": 90.5},
    {"deptName": "문헌정보학과", "collegeName": "사회과학대학", "g9_gyogwa": 1.85, "g9_jonghap": 3.15, "jeongsi_group": "ga", "percentile": 88.2},
    {"deptName": "사회복지학부", "collegeName": "사회과학대학", "g9_gyogwa": 1.78, "g9_jonghap": 2.80, "jeongsi_group": "na", "percentile": 88.8},
    {"deptName": "사회학과", "collegeName": "사회과학대학", "g9_gyogwa": 1.75, "g9_jonghap": 2.65, "jeongsi_group": "na", "percentile": 89.0},
    {"deptName": "도시계획·부동산학과", "collegeName": "사회과학대학", "g9_gyogwa": 1.74, "g9_jonghap": 2.70, "jeongsi_group": "ga", "percentile": 89.2},
    {"deptName": "공공인재학부", "collegeName": "사회과학대학", "g9_gyogwa": 1.60, "g9_jonghap": 2.15, "jeongsi_group": "ga", "percentile": 90.8},
    {"deptName": "미디어커뮤니케이션학부", "collegeName": "사회과학대학", "g9_gyogwa": 1.58, "g9_jonghap": 2.10, "jeongsi_group": "ga", "percentile": 90.5},

    # 3. 사범대학
    {"deptName": "교육학과", "collegeName": "사범대학", "g9_gyogwa": 1.73, "g9_jonghap": 2.20, "jeongsi_group": "na", "percentile": 89.5},
    {"deptName": "유아교육과", "collegeName": "사범대학", "g9_gyogwa": 1.88, "g9_jonghap": 2.45, "jeongsi_group": "ga", "percentile": 88.5},
    {"deptName": "영어교육과", "collegeName": "사범대학", "g9_gyogwa": 1.68, "g9_jonghap": 2.15, "jeongsi_group": "ga", "percentile": 89.8},
    {"deptName": "체육교육과", "collegeName": "사범대학", "g9_gyogwa": 2.10, "g9_jonghap": 2.50, "jeongsi_group": "na", "percentile": 85.0},

    # 4. 경영경제대학
    {"deptName": "경영학부 (경영학)", "collegeName": "경영경제대학", "g9_gyogwa": 1.63, "g9_jonghap": 2.40, "jeongsi_group": "da", "percentile": 90.2},
    {"deptName": "경영학부 (글로벌금융)", "collegeName": "경영경제대학", "g9_gyogwa": 1.61, "g9_jonghap": 2.25, "jeongsi_group": "na", "percentile": 90.8},
    {"deptName": "경제학부", "collegeName": "경영경제대학", "g9_gyogwa": 1.65, "g9_jonghap": 2.35, "jeongsi_group": "na", "percentile": 90.0},
    {"deptName": "응용통계학과", "collegeName": "경영경제대학", "g9_gyogwa": 1.62, "g9_jonghap": 2.30, "jeongsi_group": "na", "percentile": 90.5},
    {"deptName": "광고홍보학과", "collegeName": "경영경제대학", "g9_gyogwa": 1.64, "g9_jonghap": 2.20, "jeongsi_group": "ga", "percentile": 90.2},
    {"deptName": "국제물류학과", "collegeName": "경영경제대학", "g9_gyogwa": 1.70, "g9_jonghap": 2.50, "jeongsi_group": "na", "percentile": 89.8},
    {"deptName": "산업보안학과 (인문)", "collegeName": "경영경제대학", "g9_gyogwa": 1.72, "g9_jonghap": 2.60, "jeongsi_group": "ga", "percentile": 89.5},
    {"deptName": "산업보안학과 (자연)", "collegeName": "경영경제대학", "g9_gyogwa": 1.60, "g9_jonghap": 2.30, "jeongsi_group": "na", "percentile": 91.0},

    # 5. 자연과학대학
    {"deptName": "수학과", "collegeName": "자연과학대학", "g9_gyogwa": 1.68, "g9_jonghap": 2.45, "jeongsi_group": "ga", "percentile": 90.0},
    {"deptName": "물리학과", "collegeName": "자연과학대학", "g9_gyogwa": 1.75, "g9_jonghap": 2.70, "jeongsi_group": "na", "percentile": 89.5},
    {"deptName": "화학과", "collegeName": "자연과학대학", "g9_gyogwa": 1.62, "g9_jonghap": 2.35, "jeongsi_group": "na", "percentile": 90.2},
    {"deptName": "생명과학과", "collegeName": "자연과학대학", "g9_gyogwa": 1.55, "g9_jonghap": 2.10, "jeongsi_group": "na", "percentile": 90.8},

    # 6. 공과대학
    {"deptName": "화학공학과", "collegeName": "공과대학", "g9_gyogwa": 1.58, "g9_jonghap": 2.15, "jeongsi_group": "ga", "percentile": 91.2},
    {"deptName": "기계공학부", "collegeName": "공과대학", "g9_gyogwa": 1.62, "g9_jonghap": 2.25, "jeongsi_group": "ga", "percentile": 90.8},
    {"deptName": "에너지시스템공학부", "collegeName": "공과대학", "g9_gyogwa": 1.68, "g9_jonghap": 2.40, "jeongsi_group": "na", "percentile": 90.2},
    {"deptName": "건축학부 (건축학 5년제 / 건축공학 4년제)", "collegeName": "공과대학", "g9_gyogwa": 1.78, "g9_jonghap": 2.65, "jeongsi_group": "na", "percentile": 89.2},
    {"deptName": "사회기반시스템공학부 (건설환경플랜트/도시시스템)", "collegeName": "공과대학", "g9_gyogwa": 1.82, "g9_jonghap": 2.80, "jeongsi_group": "na", "percentile": 89.0},
    {"deptName": "첨단소재공학과", "collegeName": "공과대학 (다빈치)", "g9_gyogwa": 2.69, "g9_jonghap": 3.42, "jeongsi_group": "na", "percentile": 84.5},

    # 7. 창의ICT공과대학
    {"deptName": "전자전기공학부", "collegeName": "창의ICT공과대학", "g9_gyogwa": 1.50, "g9_jonghap": 2.10, "jeongsi_group": "na", "percentile": 91.5},
    {"deptName": "융합공학부", "collegeName": "창의ICT공과대학", "g9_gyogwa": 1.54, "g9_jonghap": 2.20, "jeongsi_group": "na", "percentile": 91.0},
    {"deptName": "지능형반도체공학과", "collegeName": "창의ICT공과대학", "g9_gyogwa": 1.52, "g9_jonghap": 2.05, "jeongsi_group": "ga", "percentile": 92.0},

    # 8. 소프트웨어대학
    {"deptName": "소프트웨어학부", "collegeName": "소프트웨어대학", "g9_gyogwa": 1.52, "g9_jonghap": 2.06, "jeongsi_group": "da", "percentile": 91.8},
    {"deptName": "AI학과", "collegeName": "소프트웨어대학", "g9_gyogwa": 1.51, "g9_jonghap": 2.05, "jeongsi_group": "da", "percentile": 92.2},

    # 9. 의학 / 약학 / 간호대학
    {"deptName": "의학부 (의예과)", "collegeName": "의과대학", "g9_gyogwa": 1.12, "g9_jonghap": 1.40, "jeongsi_group": "ga", "percentile": 99.2},
    {"deptName": "약학부", "collegeName": "약학대학", "g9_gyogwa": 1.16, "g9_jonghap": 1.70, "jeongsi_group": "ga", "percentile": 97.5},
    {"deptName": "간호학과 (자연)", "collegeName": "적십자간호대학", "g9_gyogwa": 1.65, "g9_jonghap": 2.30, "jeongsi_group": "na", "percentile": 89.8},
    {"deptName": "간호학과 (인문)", "collegeName": "적십자간호대학", "g9_gyogwa": 1.62, "g9_jonghap": 2.25, "jeongsi_group": "na", "percentile": 89.5},

    # 10. 생명공학대학 (다빈치)
    {"deptName": "생명자원공학부 (동물생명공학)", "collegeName": "생명공학대학 (다빈치)", "g9_gyogwa": 2.94, "g9_jonghap": 3.60, "jeongsi_group": "na", "percentile": 83.5},
    {"deptName": "생명자원공학부 (식물생명공학)", "collegeName": "생명공학대학 (다빈치)", "g9_gyogwa": 3.15, "g9_jonghap": 3.70, "jeongsi_group": "na", "percentile": 83.0},
    {"deptName": "식품공학부 (식품공학)", "collegeName": "생명공학대학 (다빈치)", "g9_gyogwa": 3.40, "g9_jonghap": 3.80, "jeongsi_group": "na", "percentile": 82.5},
    {"deptName": "식품공학부 (식품영양)", "collegeName": "생명공학대학 (다빈치)", "g9_gyogwa": 3.39, "g9_jonghap": 3.85, "jeongsi_group": "na", "percentile": 82.0},
    {"deptName": "시스템생명공학과", "collegeName": "생명공학대학 (다빈치)", "g9_gyogwa": 1.87, "g9_jonghap": 3.00, "jeongsi_group": "na", "percentile": 84.0},

    # 11. 예술공학대학 & 예술대학
    {"deptName": "예술공학부", "collegeName": "예술공학대학 (다빈치)", "g9_gyogwa": 2.94, "g9_jonghap": 4.14, "jeongsi_group": "na", "percentile": 83.0},
    {"deptName": "공연영상창작학부 (영화)", "collegeName": "예술대학", "g9_gyogwa": None, "g9_jonghap": 2.80, "jeongsi_group": "ga", "percentile": 85.0},
    {"deptName": "공연영상창작학부 (문예창작)", "collegeName": "예술대학 (다빈치)", "g9_gyogwa": None, "g9_jonghap": 2.83, "jeongsi_group": "na", "percentile": 84.0},
    {"deptName": "디자인학부 (시각/산업/패션/실내환경)", "collegeName": "예술대학 (다빈치)", "g9_gyogwa": 3.30, "g9_jonghap": 3.50, "jeongsi_group": "na", "percentile": 83.5},
    {"deptName": "사진학과", "collegeName": "예술대학 (다빈치)", "g9_gyogwa": None, "g9_jonghap": 3.60, "jeongsi_group": "na", "percentile": 82.0},
]

print(f"Total Chung-Ang University departments extracted: {len(cau_departments)}")
for d in cau_departments:
    cut5_g = convert_to_5grade(d["g9_gyogwa"]) if d["g9_gyogwa"] else None
    cut5_j = convert_to_5grade(d["g9_jonghap"]) if d["g9_jonghap"] else None
    print(f"[{d['collegeName']}] {d['deptName']} => 교과 {cut5_g} (9등급 {d['g9_gyogwa']}) | 학종 {cut5_j} (9등급 {d['g9_jonghap']}) | 정시 {d['jeongsi_group']}군 {d['percentile']}%")
