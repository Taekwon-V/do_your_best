import sys

sys.stdout.reconfigure(encoding='utf-8')

# Run generation of full typescript file
cau_list = [
    # 1. 인문대학
    {"deptName": "국어국문학과", "collegeName": "인문대학", "cut5_g": 1.23, "min_g": "국수영탐(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.52, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "target", "group": "ga", "pct": 89.0},
    {"deptName": "영어영문학과", "collegeName": "인문대학", "cut5_g": 1.22, "min_g": "국수영탐(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.60, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "target", "group": "ga", "pct": 89.2},
    {"deptName": "유럽문화학부 (독일어문/프랑스어문/러시아어문)", "collegeName": "인문대학", "cut5_g": 1.27, "min_g": "국수영탐(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.78, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "safe", "group": "na", "pct": 88.5},
    {"deptName": "아시아문화학부 (일본어문/중국어문)", "collegeName": "인문대학", "cut5_g": 1.26, "min_g": "국수영탐(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.76, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "safe", "group": "ga", "pct": 88.5},
    {"deptName": "철학과", "collegeName": "인문대학", "cut5_g": 1.28, "min_g": "국수영탐(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.69, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "target", "group": "ga", "pct": 88.2},
    {"deptName": "역사학과", "collegeName": "인문대학", "cut5_g": 1.25, "min_g": "국수영탐(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.62, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "target", "group": "ga", "pct": 88.5},

    # 2. 사회과학대학
    {"deptName": "정치국제학과", "collegeName": "사회과학대학", "cut5_g": 1.20, "min_g": "국수영탐(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.44, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "reach", "group": "ga", "pct": 89.5},
    {"deptName": "심리학과", "collegeName": "사회과학대학", "cut5_g": 1.15, "min_g": "국수영탐(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.35, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "reach", "group": "na", "pct": 90.5},
    {"deptName": "문헌정보학과", "collegeName": "사회과학대학", "cut5_g": 1.27, "min_g": "국수영탐(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.79, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "safe", "group": "ga", "pct": 88.2},
    {"deptName": "사회복지학부", "collegeName": "사회과학대학", "cut5_g": 1.24, "min_g": "국수영탐(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.67, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "target", "group": "na", "pct": 88.8},
    {"deptName": "사회학과", "collegeName": "사회과학대학", "cut5_g": 1.23, "min_g": "국수영탐(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.60, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "target", "group": "na", "pct": 89.0},
    {"deptName": "도시계획·부동산학과", "collegeName": "사회과학대학", "cut5_g": 1.23, "min_g": "국수영탐(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.62, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "target", "group": "ga", "pct": 89.2},
    {"deptName": "공공인재학부", "collegeName": "사회과학대학", "cut5_g": 1.17, "min_g": "국수영탐(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.39, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "reach", "group": "ga", "pct": 90.8},
    {"deptName": "미디어커뮤니케이션학부", "collegeName": "사회과학대학", "cut5_g": 1.16, "min_g": "국수영탐(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.37, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "reach", "group": "ga", "pct": 90.5},

    # 3. 사범대학
    {"deptName": "교육학과", "collegeName": "사범대학", "cut5_g": 1.22, "min_g": "국수영탐(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.41, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "target", "group": "na", "pct": 89.5},
    {"deptName": "유아교육과", "collegeName": "사범대학", "cut5_g": 1.28, "min_g": "국수영탐(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.52, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "target", "group": "ga", "pct": 88.5},
    {"deptName": "영어교육과", "collegeName": "사범대학", "cut5_g": 1.20, "min_g": "국수영탐(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.39, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "reach", "group": "ga", "pct": 89.8},
    {"deptName": "체육교육과", "collegeName": "사범대학", "cut5_g": 1.37, "min_g": "국수영탐(1) 3개 합 8 이내", "req_g": 3, "sum_g": 8, "cat_g": "reach", "cut5_j": 1.54, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "target", "group": "na", "pct": 85.0},

    # 4. 경영경제대학
    {"deptName": "경영학부 (경영학)", "collegeName": "경영경제대학", "cut5_g": 1.18, "min_g": "국수영탐(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.50, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "target", "group": "da", "pct": 90.2},
    {"deptName": "경영학부 (글로벌금융)", "collegeName": "경영경제대학", "cut5_g": 1.17, "min_g": "국수영탐(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.44, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "reach", "group": "na", "pct": 90.8},
    {"deptName": "경제학부", "collegeName": "경영경제대학", "cut5_g": 1.19, "min_g": "국수영탐(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.48, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "target", "group": "na", "pct": 90.0},
    {"deptName": "응용통계학과", "collegeName": "경영경제대학", "cut5_g": 1.18, "min_g": "국수영탐(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.46, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "target", "group": "na", "pct": 90.5},
    {"deptName": "광고홍보학과", "collegeName": "경영경제대학", "cut5_g": 1.19, "min_g": "국수영탐(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.41, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "target", "group": "ga", "pct": 90.2},
    {"deptName": "국제물류학과", "collegeName": "경영경제대학", "cut5_g": 1.21, "min_g": "국수영탐(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.54, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "target", "group": "na", "pct": 89.8},
    {"deptName": "산업보안학과 (인문)", "collegeName": "경영경제대학", "cut5_g": 1.22, "min_g": "국수영탐(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.58, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "target", "group": "ga", "pct": 89.5},
    {"deptName": "산업보안학과 (자연)", "collegeName": "경영경제대학", "cut5_g": 1.17, "min_g": "국수영탐(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.46, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "reach", "group": "na", "pct": 91.0},

    # 5. 자연과학대학
    {"deptName": "수학과", "collegeName": "자연과학대학", "cut5_g": 1.20, "min_g": "국수영과(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.52, "min_j": "수능최저 없음", "type_j": "CAU탐구형", "cat_j": "target", "group": "ga", "pct": 90.0},
    {"deptName": "물리학과", "collegeName": "자연과학대학", "cut5_g": 1.23, "min_g": "국수영과(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.62, "min_j": "수능최저 없음", "type_j": "CAU탐구형", "cat_j": "target", "group": "na", "pct": 89.5},
    {"deptName": "화학과", "collegeName": "자연과학대학", "cut5_g": 1.18, "min_g": "국수영과(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.48, "min_j": "수능최저 없음", "type_j": "CAU탐구형", "cat_j": "target", "group": "na", "pct": 90.2},
    {"deptName": "생명과학과", "collegeName": "자연과학대학", "cut5_g": 1.15, "min_g": "국수영과(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.37, "min_j": "수능최저 없음", "type_j": "CAU탐구형", "cat_j": "reach", "group": "na", "pct": 90.8},

    # 6. 공과대학
    {"deptName": "화학공학과", "collegeName": "공과대학", "cut5_g": 1.16, "min_g": "국수영과(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.39, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "reach", "group": "ga", "pct": 91.2},
    {"deptName": "기계공학부", "collegeName": "공과대학", "cut5_g": 1.18, "min_g": "국수영과(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.44, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "reach", "group": "ga", "pct": 90.8},
    {"deptName": "에너지시스템공학부", "collegeName": "공과대학", "cut5_g": 1.20, "min_g": "국수영과(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.50, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "target", "group": "na", "pct": 90.2},
    {"deptName": "건축학부 (건축학 5년제 / 건축공학 4년제)", "collegeName": "공과대학", "cut5_g": 1.24, "min_g": "국수영과(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.60, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "target", "group": "na", "pct": 89.2},
    {"deptName": "사회기반시스템공학부 (건설환경플랜트/도시시스템)", "collegeName": "공과대학", "cut5_g": 1.26, "min_g": "국수영과(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.67, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "target", "group": "na", "pct": 89.0},
    {"deptName": "첨단소재공학과", "collegeName": "공과대학 (다빈치)", "cut5_g": 1.62, "min_g": "국수영과(1) 2개 합 6 이내", "req_g": 2, "sum_g": 6, "cat_g": "target", "cut5_j": 1.88, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "safe", "group": "na", "pct": 84.5},

    # 7. 창의ICT공과대학
    {"deptName": "전자전기공학부", "collegeName": "창의ICT공과대학", "cut5_g": 1.13, "min_g": "국수영과(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.37, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "reach", "group": "na", "pct": 91.5},
    {"deptName": "융합공학부", "collegeName": "창의ICT공과대학", "cut5_g": 1.15, "min_g": "국수영과(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.41, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "reach", "group": "na", "pct": 91.0},
    {"deptName": "지능형반도체공학과", "collegeName": "창의ICT공과대학", "cut5_g": 1.14, "min_g": "국수영과(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.35, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "reach", "group": "ga", "pct": 92.0},

    # 8. 소프트웨어대학
    {"deptName": "소프트웨어학부", "collegeName": "소프트웨어대학", "cut5_g": 1.14, "min_g": "국수영과(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.36, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "reach", "group": "da", "pct": 91.8},
    {"deptName": "AI학과", "collegeName": "소프트웨어대학", "cut5_g": 1.13, "min_g": "국수영과(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.35, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "reach", "group": "da", "pct": 92.2},

    # 9. 의학 / 약학 / 간호대학
    {"deptName": "의학부 (의예과)", "collegeName": "의과대학", "cut5_g": 1.00, "min_g": "국수영과(2) 4개 합 5 이내", "req_g": 4, "sum_g": 5, "cat_g": "reach", "cut5_j": 1.09, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "reach", "group": "ga", "pct": 99.2},
    {"deptName": "약학부", "collegeName": "약학대학", "cut5_g": 1.01, "min_g": "국수영과(1) 4개 합 5 이내", "req_g": 4, "sum_g": 5, "cat_g": "reach", "cut5_j": 1.21, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "reach", "group": "ga", "pct": 97.5},
    {"deptName": "간호학과 (자연)", "collegeName": "적십자간호대학", "cut5_g": 1.19, "min_g": "국수영과(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.46, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "target", "group": "na", "pct": 89.8},
    {"deptName": "간호학과 (인문)", "collegeName": "적십자간호대학", "cut5_g": 1.18, "min_g": "국수영탐(1) 3개 합 7 이내", "req_g": 3, "sum_g": 7, "cat_g": "reach", "cut5_j": 1.44, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "target", "group": "na", "pct": 89.5},

    # 10. 생명공학대학 (다빈치)
    {"deptName": "생명자원공학부 (동물생명공학)", "collegeName": "생명공학대학 (다빈치)", "cut5_g": 1.72, "min_g": "국수영과(1) 2개 합 6 이내", "req_g": 2, "sum_g": 6, "cat_g": "safe", "cut5_j": 1.93, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "safe", "group": "na", "pct": 83.5},
    {"deptName": "생명자원공학부 (식물생명공학)", "collegeName": "생명공학대학 (다빈치)", "cut5_g": 1.79, "min_g": "국수영과(1) 2개 합 6 이내", "req_g": 2, "sum_g": 6, "cat_g": "safe", "cut5_j": 1.96, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "safe", "group": "na", "pct": 83.0},
    {"deptName": "식품공학부 (식품공학)", "collegeName": "생명공학대학 (다빈치)", "cut5_g": 1.87, "min_g": "국수영과(1) 2개 합 6 이내", "req_g": 2, "sum_g": 6, "cat_g": "safe", "cut5_j": 1.99, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "safe", "group": "na", "pct": 82.5},
    {"deptName": "식품공학부 (식품영양)", "collegeName": "생명공학대학 (다빈치)", "cut5_g": 1.87, "min_g": "국수영과(1) 2개 합 6 이내", "req_g": 2, "sum_g": 6, "cat_g": "safe", "cut5_j": 2.00, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "safe", "group": "na", "pct": 82.0},
    {"deptName": "시스템생명공학과", "collegeName": "생명공학대학 (다빈치)", "cut5_g": 1.28, "min_g": "국수영과(1) 2개 합 6 이내", "req_g": 2, "sum_g": 6, "cat_g": "reach", "cut5_j": 1.75, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "safe", "group": "na", "pct": 84.0},

    # 11. 예술공학대학 & 예술대학
    {"deptName": "예술공학부", "collegeName": "예술공학대학 (다빈치)", "cut5_g": 1.72, "min_g": "국수영과(1) 2개 합 6 이내", "req_g": 2, "sum_g": 6, "cat_g": "safe", "cut5_j": 2.09, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "safe", "group": "na", "pct": 83.0},
    {"deptName": "공연영상창작학부 (영화)", "collegeName": "예술대학", "cut5_g": None, "min_g": None, "req_g": 0, "sum_g": 0, "cat_g": "reach", "cut5_j": 1.67, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "target", "group": "ga", "pct": 85.0},
    {"deptName": "공연영상창작학부 (문예창작)", "collegeName": "예술대학 (다빈치)", "cut5_g": None, "min_g": None, "req_g": 0, "sum_g": 0, "cat_g": "reach", "cut5_j": 1.68, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "target", "group": "na", "pct": 84.0},
    {"deptName": "디자인학부 (시각/산업/패션/실내환경)", "collegeName": "예술대학 (다빈치)", "cut5_g": 1.84, "min_g": "국수영탐 2개 합 6 이내", "req_g": 2, "sum_g": 6, "cat_g": "safe", "cut5_j": 1.90, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "safe", "group": "na", "pct": 83.5},
    {"deptName": "사진학과", "collegeName": "예술대학 (다빈치)", "cut5_g": None, "min_g": None, "req_g": 0, "sum_g": 0, "cat_g": "reach", "cut5_j": 1.93, "min_j": "수능최저 없음", "type_j": "CAU융합형", "cat_j": "safe", "group": "na", "pct": 82.0},
]

print(f"Generated {len(cau_list)} items for Chung-Ang University")
