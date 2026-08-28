# 💎 Phase 5: 가족 실시간 클라우드 동기화, 상담용 1장 PDF 리포트 & PWA 모바일 최적화 [완료 ✅]

## 1. 단계 목표
* 부모님과 자녀가 어떤 기기(PC, 스마트폰, 태블릿)에서든 지연 없이 동일한 데이터를 볼 수 있도록 **Cloud Firestore 실시간 동기화**를 완성했습니다.
* 학교/학원 입시 상담 시 지참할 수 있는 **A4 1장 프리미엄 인쇄/PDF 리포트** 및 **PWA 모바일 앱 설치** 지원을 완료했습니다.

---

## 2. 세부 개발 완료 내용

### 2.1 가족 간 실시간 데이터 동기화 & 백업 (`src/context/AdmissionsContext.tsx`, `ReportsTab.tsx`)
- **Cloud Firestore 실시간 리스너 (`onSnapshot`)**: 부모님이 PC에서 목표를 바꾸면 자녀의 스마트폰에 새로고침 없이 즉시 동기화.
- **데이터 백업 및 복원 (JSON Backup & Restore)**:
  * `[JSON 백업 파일 다운로드 (Export)]`: 원클릭으로 전체 가족 데이터 파일 로컬 저장.
  * `[JSON 백업 파일 복원 (Import)]`: 백업 파일 업로드 시 즉시 데이터 무결성 검증 및 복원.
  * `[기본 프리셋 초기화 (Reset)]`: 언제든 공식 기준 데이터로 안전 리셋 지원.

### 2.2 가족 상담용 A4 1장 프리미엄 리포트 (`src/components/report/OnePageConsultingReport.tsx`)
- 학교 담임교사 및 학원 컨설턴트 상담 시 즉시 제출 가능한 맞춤형 출력 레이아웃:
  * 기본 프로필, 희망 진로, 2028 개편안 적용 배지 및 D-Day
  * 5등급제 확정 내신, 최근 모의고사 백분위, 잔여 학기 Goal-Seek 목표 스트립
  * 수시 6장 황금 포트폴리오 (소신/적정/안정 2-2-2) 요약표 및 수능최저 진단 결과
  * 정시 가/나/다군 목표 배치표 & 70% Cut 백분위
  * 컨설턴트 핵심 소견 및 서명란
- `@media print` 스타일링 최적화로 페이지 넘어감 없이 정확히 깔끔한 1장 PDF로 출력.

### 2.3 PWA (Progressive Web App) & 모바일 최적화 (`public/manifest.json`, `src/app/layout.tsx`)
- `manifest.json` 매니페스트 및 iOS/Android 메타태그 설정:
  * 아이폰 Safari "홈 화면에 추가", 갤럭시 Chrome "앱 설치" 지원.
  * 테마 컬러 `#001858` / `#fef6e4` 적용 및 스탠드얼론(Standalone) 전체 화면 실행.

---

## 3. 완료 검증 결과 (Definition of Done)
1. ✅ **실시간 클라우드 동기화**: Cloud Firestore 리스너 및 로컬스토리지 듀얼 영속화 완비.
2. ✅ **JSON 파일 백업 및 복원**: 다운로드 및 파일 업로드 복원 100% 정상 작동.
3. ✅ **A4 1장 인쇄 미리보기**: 모달 프리뷰 및 `window.print()` 1장 출력 포맷팅 검증 완료.
4. ✅ **PWA 매니페스트 설정**: 스마트폰 홈 화면 바로가기 및 풀스크린 앱 모드 완비.
5. ✅ **Next.js Production Build 통과**: 빌드 에러 0건, 린트 통과 및 Vercel 배포 완료.
