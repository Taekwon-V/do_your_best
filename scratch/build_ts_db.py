import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

# Helper for 5-grade calculation
def c5(g9):
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

def get_susi_cat(cut5):
    if cut5 < 1.50:
        return 'reach'
    elif cut5 <= 1.70:
        return 'target'
    else:
        return 'safe'

from generate_complete_master_db import inha_raw, incheon_raw
from generate_cau_data import cau_departments

header = '''import { SusiCategory, JeongsiGroup } from '@/types/admissions';

export interface DepartmentAdmissionData {
  deptName: string;
  collegeName: string; // 단과대학명
  susiGyogwa?: {
    expectedCut5: number;
    minCsatDesc: string;
    requiredSubjectsCount: number;
    sumGradeLimit: number;
    susiCategory: SusiCategory;
    admissionType: '교과';
  };
  susiJonghap?: {
    expectedCut5: number;
    minCsatDesc: string;
    requiredSubjectsCount: number;
    sumGradeLimit: number;
    susiCategory: SusiCategory;
    typeName: string; // 예: "인하미래인재", "자기추천", "CAU융합형", "CAU탐구형"
    admissionType: '종합';
  };
  jeongsi?: {
    group: JeongsiGroup;
    percentileCut: number;
    subjectWeights: {
      korean: number;
      math: number;
      english: number;
      inquiry: number;
      history: number;
    };
  };
}

export interface UniversityData {
  univId: string;
  univName: string;
  shortName: string;
  badge: string;
  departments: DepartmentAdmissionData[];
}

export const UNIVERSITY_ADMISSIONS_DB: UniversityData[] = [
'''

# Build Inha
inha_entries = []
for d in inha_raw:
    cut5_g = c5(d["g9_g"]) if d["g9_g"] else None
    cut5_j = c5(d["g9_j"]) if d["g9_j"] else None
    
    gyogwa_str = "undefined"
    if cut5_g:
        req_cnt = 3 if "의예과" in d["dept"] else 2
        sum_lim = 3 if "의예과" in d["dept"] else (5 if "과" in d["min_g"] else 6)
        cat = get_susi_cat(cut5_g)
        gyogwa_str = f"{{ expectedCut5: {cut5_g}, minCsatDesc: '{d['min_g']}', requiredSubjectsCount: {req_cnt}, sumGradeLimit: {sum_lim}, susiCategory: '{cat}', admissionType: '교과' }}"
    
    jonghap_str = "undefined"
    if cut5_j:
        req_cnt = 3 if "의예과" in d["dept"] else 0
        sum_lim = 3 if "의예과" in d["dept"] else 0
        cat = get_susi_cat(cut5_j)
        jonghap_str = f"{{ expectedCut5: {cut5_j}, minCsatDesc: '{d['min_j']}', requiredSubjectsCount: {req_cnt}, sumGradeLimit: {sum_lim}, susiCategory: '{cat}', typeName: '인하미래인재', admissionType: '종합' }}"
        
    jeongsi_str = f"{{ group: '{d['grp']}', percentileCut: {d['pct']}, subjectWeights: {{ korean: {d['w_kor']}, math: {d['w_mat']}, inquiry: {d['w_inq']}, english: 0, history: 0 }} }}"
    
    inha_entries.append(f"""      {{
        deptName: '{d['dept']}',
        collegeName: '{d['col']}',
        susiGyogwa: {gyogwa_str},
        susiJonghap: {jonghap_str},
        jeongsi: {jeongsi_str},
      }}""")

inha_section = f"""  // ==========================================
  // 1. 인하대학교 (INHA UNIVERSITY) - {len(inha_raw)}개 전 학과 수록
  // ==========================================
  {{
    univId: 'inha',
    univName: '인하대학교',
    shortName: '인하대',
    badge: '인천 명문사립 🏫',
    departments: [
{",\n".join(inha_entries)}
    ],
  }},
"""

# Build Incheon
incheon_entries = []
for d in incheon_raw:
    cut5_g = c5(d["g9_g"]) if d["g9_g"] else None
    cut5_j = c5(d["g9_j"]) if d["g9_j"] else None
    
    gyogwa_str = "undefined"
    if cut5_g:
        req_cnt = 0 if "수능최저 없음" in d["min_g"] else 2
        sum_lim = 0 if "수능최저 없음" in d["min_g"] else 7
        cat = get_susi_cat(cut5_g)
        gyogwa_str = f"{{ expectedCut5: {cut5_g}, minCsatDesc: '{d['min_g']}', requiredSubjectsCount: {req_cnt}, sumGradeLimit: {sum_lim}, susiCategory: '{cat}', admissionType: '교과' }}"
    
    jonghap_str = "undefined"
    if cut5_j:
        req_cnt = 0
        sum_lim = 0
        cat = get_susi_cat(cut5_j)
        jonghap_str = f"{{ expectedCut5: {cut5_j}, minCsatDesc: '{d['min_j']}', requiredSubjectsCount: {req_cnt}, sumGradeLimit: {sum_lim}, susiCategory: '{cat}', typeName: '자기추천', admissionType: '종합' }}"
        
    jeongsi_str = f"{{ group: '{d['grp']}', percentileCut: {d['pct']}, subjectWeights: {{ korean: {d['w_kor']}, math: {d['w_mat']}, inquiry: {d['w_inq']}, english: 0, history: 0 }} }}"
    
    incheon_entries.append(f"""      {{
        deptName: '{d['dept']}',
        collegeName: '{d['col']}',
        susiGyogwa: {gyogwa_str},
        susiJonghap: {jonghap_str},
        jeongsi: {jeongsi_str},
      }}""")

incheon_section = f"""  // ==========================================
  // 2. 국립인천대학교 (INCHEON NATIONAL UNIVERSITY) - {len(incheon_raw)}개 전 학과 수록
  // ==========================================
  {{
    univId: 'incheon',
    univName: '국립인천대학교',
    shortName: '인천대',
    badge: '인천 거점국립 🏛️',
    departments: [
{",\n".join(incheon_entries)}
    ],
  }},
"""

# Build CAU
cau_entries = []
for d in cau_departments:
    cut5_g = c5(d["g9_gyogwa"]) if d["g9_gyogwa"] else None
    cut5_j = c5(d["g9_jonghap"]) if d["g9_jonghap"] else None
    
    gyogwa_str = "undefined"
    if cut5_g:
        req_cnt = 4 if "의학부" in d["deptName"] or "약학부" in d["deptName"] else (2 if "다빈치" in d["collegeName"] else 3)
        sum_lim = 5 if "의학부" in d["deptName"] or "약학부" in d["deptName"] else (6 if "다빈치" in d["collegeName"] else (8 if "체육" in d["deptName"] else 7))
        min_desc = "국수영과(2) 4개 합 5 이내" if "의학부" in d["deptName"] else ("국수영과(1) 4개 합 5 이내" if "약학부" in d["deptName"] else ("국수영탐 2개 합 6 이내" if "다빈치" in d["collegeName"] else ("국수영탐 3개 합 8 이내" if "체육" in d["deptName"] else "국수영탐(1) 3개 합 7 이내")))
        cat = get_susi_cat(cut5_g)
        gyogwa_str = f"{{ expectedCut5: {cut5_g}, minCsatDesc: '{min_desc}', requiredSubjectsCount: {req_cnt}, sumGradeLimit: {sum_lim}, susiCategory: '{cat}', admissionType: '교과' }}"
        
    jonghap_str = "undefined"
    if cut5_j:
        t_name = "CAU탐구형" if "자연과학대학" in d["collegeName"] else "CAU융합형"
        cat = get_susi_cat(cut5_j)
        jonghap_str = f"{{ expectedCut5: {cut5_j}, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: '{cat}', typeName: '{t_name}', admissionType: '종합' }}"
        
    w_kor = 35 if any(k in d["collegeName"] for k in ["인문", "사회", "사범", "예술", "경영"]) and "자연" not in d["deptName"] else 25
    w_mat = 40 if w_kor == 25 or "경영" in d["collegeName"] else 30
    w_inq = 35 if w_kor == 25 else 25
    
    jeongsi_str = f"{{ group: '{d['jeongsi_group']}', percentileCut: {d['percentile']}, subjectWeights: {{ korean: {w_kor}, math: {w_mat}, inquiry: {w_inq}, english: 0, history: 0 }} }}"
    
    cau_entries.append(f"""      {{
        deptName: '{d['deptName']}',
        collegeName: '{d['collegeName']}',
        susiGyogwa: {gyogwa_str},
        susiJonghap: {jonghap_str},
        jeongsi: {jeongsi_str},
      }}""")

cau_section = f"""  // ==========================================
  // 3. 중앙대학교 (CHUNG-ANG UNIVERSITY) - {len(cau_departments)}개 전 학과 수록
  // ==========================================
  {{
    univId: 'cau',
    univName: '중앙대학교',
    shortName: '중앙대',
    badge: '서울/다빈치 캠퍼스 🌟',
    departments: [
{",\n".join(cau_entries)}
    ],
  }},
"""

sky_section = """  // ==========================================
  // 4. 주요 상위 대학 (서울대 / 연세대 / 고려대) - 6개 학과
  // ==========================================
  {
    univId: 'sky',
    univName: '주요 상위권 대학 (SKY)',
    shortName: 'SKY',
    badge: '최상위권 🏆',
    departments: [
      {
        deptName: '서울대학교 컴퓨터공학부',
        collegeName: '공과대학',
        susiGyogwa: { expectedCut5: 1.00, minCsatDesc: '국수영탐(2) 3개 영역 합 7 이내', requiredSubjectsCount: 3, sumGradeLimit: 7, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.05, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'reach', typeName: '일반전형', admissionType: '종합' },
        jeongsi: { group: 'na', percentileCut: 98.0, subjectWeights: { korean: 33.3, math: 40, inquiry: 26.7, english: 0, history: 0 } },
      },
      {
        deptName: '서울대학교 수학교육과',
        collegeName: '사범대학',
        susiGyogwa: { expectedCut5: 1.02, minCsatDesc: '국수영탐(2) 3개 영역 합 7 이내', requiredSubjectsCount: 3, sumGradeLimit: 7, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.08, minCsatDesc: '수능최저 없음', requiredSubjectsCount: 0, sumGradeLimit: 0, susiCategory: 'reach', typeName: '일반전형', admissionType: '종합' },
        jeongsi: { group: 'na', percentileCut: 97.0, subjectWeights: { korean: 33.3, math: 40, inquiry: 26.7, english: 0, history: 0 } },
      },
      {
        deptName: '연세대학교 인공지능학과',
        collegeName: '인공지능융합대학',
        susiGyogwa: { expectedCut5: 1.10, minCsatDesc: '국수 중 1개 포함 2개 합 5 이내', requiredSubjectsCount: 2, sumGradeLimit: 5, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.18, minCsatDesc: '국수 중 1개 포함 2개 합 5 이내', requiredSubjectsCount: 2, sumGradeLimit: 5, susiCategory: 'reach', typeName: '활동우수형', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 96.0, subjectWeights: { korean: 22.2, math: 44.4, inquiry: 33.3, english: 0, history: 0 } },
      },
      {
        deptName: '연세대학교 경영학과',
        collegeName: '경영대학',
        susiGyogwa: { expectedCut5: 1.12, minCsatDesc: '국수 중 1개 포함 2개 합 4 이내', requiredSubjectsCount: 2, sumGradeLimit: 4, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.16, minCsatDesc: '국수 중 1개 포함 2개 합 4 이내', requiredSubjectsCount: 2, sumGradeLimit: 4, susiCategory: 'reach', typeName: '활동우수형', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 95.5, subjectWeights: { korean: 33.3, math: 33.3, inquiry: 33.3, english: 0, history: 0 } },
      },
      {
        deptName: '고려대학교 컴퓨터학과',
        collegeName: '정보대학',
        susiGyogwa: { expectedCut5: 1.12, minCsatDesc: '국수영탐 3개 영역 합 7 이내', requiredSubjectsCount: 3, sumGradeLimit: 7, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.20, minCsatDesc: '국수영탐 4개 영역 합 8 이내', requiredSubjectsCount: 4, sumGradeLimit: 8, susiCategory: 'reach', typeName: '학업우수형', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 96.0, subjectWeights: { korean: 31.25, math: 37.5, inquiry: 31.25, english: 0, history: 0 } },
      },
      {
        deptName: '고려대학교 수학교육과',
        collegeName: '사범대학',
        susiGyogwa: { expectedCut5: 1.15, minCsatDesc: '국수영탐 3개 영역 합 7 이내', requiredSubjectsCount: 3, sumGradeLimit: 7, susiCategory: 'reach', admissionType: '교과' },
        susiJonghap: { expectedCut5: 1.24, minCsatDesc: '국수영탐 4개 영역 합 8 이내', requiredSubjectsCount: 4, sumGradeLimit: 8, susiCategory: 'reach', typeName: '학업우수형', admissionType: '종합' },
        jeongsi: { group: 'ga', percentileCut: 95.0, subjectWeights: { korean: 31.25, math: 37.5, inquiry: 31.25, english: 0, history: 0 } },
      },
    ],
  },
];
"""

full_code = header + inha_section + incheon_section + cau_section + sky_section

with open(r"c:\work\do_your_best\src\data\universityAdmissionsDB.ts", "w", encoding="utf-8") as f:
    f.write(full_code)

print("Full database written successfully!")
