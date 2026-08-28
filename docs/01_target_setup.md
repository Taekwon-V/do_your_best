# [모듈 1] 목표 대학 & 학과 설정 (Target Setup)

## 1. 개요
수험생(자녀)이 목표로 하는 대학 및 학과를 설정하고, 수시(6개 카드)와 정시(3개 군)별 지원 전략 포트폴리오를 구성하는 모듈입니다.

---

## 2. 세부 기능 요구사항

### 2.1 수시 6장 포트폴리오 관리 (`Susi6CardGrid.tsx`)
- **2-2-2 황금 밸런스 슬롯 체계**:
  * 소신/상향(Reach 2장): 합격 도전 대학 (인하대 수학교육과, 중앙대 SW)
  * 적정(Target 2장): 성적 일치 대학 (국립인천대 수학교육과, 인하대 컴공)
  * 안정(Safe 2장): 합격 유력 대학 (인하대 수학과[교직], 국립인천대 컴공)
- **실시간 진단 뱃지**:
  * 내신 합격선 비교 뱃지: `[안정권 🟢]`, `[적정권 🟡]`, `[소신권 🟠]`, `[상향도전 🔴]`
  * 수능최저 충족 여부 판별: `[최저 충족 ✅]`, `[최저 위험 ⚠️]`, `[최저 미달 ❌]`

### 2.2 정시 3개 군(가/나/다군) 목표 관리 (`Jeongsi3GunGrid.tsx`)
- **군별 슬롯 체계**:
  * 가군 (인하대 컴공) / 나군 (국립인천대 수학교육과) / 다군 (중앙대 SW)
- **최신 모의고사 백분위 Gap 뱃지 연동**.

### 2.3 목표 대학 추가/수정 모달 (`TargetUniversityModal.tsx`)
- 인하대·인천대·중앙대·연고대 등 5등급제 입결 프리셋 자동 채우기 및 사용자 맞춤 직접 등록 지원.
- 수시 전형 구분: 학생부교과, 학생부종합, 논술.
- 정시 군별(가/나/다군) 및 수능 영역별 가중치 설정 지원.


---

## 3. 대학별 공식 모집요강 데이터베이스 (`docs/universities/`)

각 대학별 상세 모집요강 분석 문서를 분리하여 체계적으로 관리합니다:

* 🏫 **[인하대학교 (INHA)](file:///c:/work/do_your_best/docs/universities/inha/README.md)**:
  * **[2027 수시모집요강 분석서 (susi_2027.md)](file:///c:/work/do_your_best/docs/universities/inha/susi_2027.md)**: 학생부교과(지역균형 438명), 학생부종합(인하미래인재 면접 939명/서류 261명), 논술(457명), 수능최저
  * **[2026 정시모집요강 분석서 (jeongsi_2026.md)](file:///c:/work/do_your_best/docs/universities/inha/jeongsi_2026.md)**: 가/나/다군 분할 선발(1,197명), 자연(수35%+탐30%+미적/과탐 3% 가산), 인문(국35%+탐25%), 융합학부 유리한 점수 산출
  * **[2026 수시/정시 입시결과 데이터베이스 (past_results_2026.md)](file:///c:/work/do_your_best/docs/universities/inha/past_results_2026.md)**: 학생부교과(지역균형), 학생부종합(인하미래인재 면접/서류) 50%/70% Cut 및 정시 가/나/다군 수능 환산점수·백분위 70% Cut

* 🏫 **[국립인천대학교 (INU)](file:///c:/work/do_your_best/docs/universities/incheon/README.md)**:
  * **[2027 수시모집요강 분석서 (susi_2027.md)](file:///c:/work/do_your_best/docs/universities/incheon/susi_2027.md)**: 학생부교과(교과성적우수자 456명/수능최저 2개 합 7), 학생부교과(지역균형 293명/수능최저 없음), 학생부종합(자기추천 694명), 이수단위 가산점 공식
  * **[2027 정시모집요강 분석서 (jeongsi_2027.md)](file:///c:/work/do_your_best/docs/universities/incheon/jeongsi_2027.md)**: 가/나/다군 분할 선발(774명), 자연(수35%+탐30%+국25%+영10%/과탐 지정 폐지), 인문(국35%+수30%+탐25%+영10%)
  * **[2026 수시/정시 입시결과 데이터베이스 (past_results_2026.md)](file:///c:/work/do_your_best/docs/universities/incheon/past_results_2026.md)**: 학생부교과(교과성적우수자/지역균형), 학생부종합(자기추천) 70% Cut 및 정시 가/나/다군 일반학생 백분위 70% Cut·환산점수

* 🏫 **[중앙대학교 (CAU)](file:///c:/work/do_your_best/docs/universities/cau/README.md)**:
  * **[2025~2026 수시/정시 입시결과 데이터베이스 (past_results.md)](file:///c:/work/do_your_best/docs/universities/cau/past_results.md)**: 2026 수시(지역균형, CAU융합형인재, CAU탐구형인재, 논술) 70% Cut 및 2024~2025 정시(가/나/다군) 충원율(추가합격률)·경쟁률·장학제도 분석
