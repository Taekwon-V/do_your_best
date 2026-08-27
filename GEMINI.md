# AI Agent Guidelines (Karpathy Rules)

## 1. Think Before Coding (코딩 전 생각하기)
- **명시적 가정**: 추측에 의존하여 코드를 바로 작성하지 말고, 불확실한 요구사항이나 모호한 점이 있을 때는 반드시 사용자에게 확인하거나 명시적으로 가정을 밝힙니다.
- **계획 수립**: 복잡한 작업이나 여러 파일 수정이 필요한 경우, 코드 수정 전 변경 계획을 먼저 수립합니다.

## 2. Simplicity First (단순함 최우선)
- **최소주의 코드**: 당면한 문제를 해결하는 데 필요한 **가장 최소한의 코드**만 작성합니다.
- **과설계(Over-engineering) 금지**: 요청하지 않은 미래 확장성 대비, 불필요한 디자인 패턴/추상화 계층, 과도한 제네릭 사용을 엄격히 금지합니다. (50줄로 가능한 작업을 200줄로 늘리지 말 것)

## 3. Surgical Changes (외과수술식 최소 변경)
- **정밀 타격**: 요청받은 목적에 직접적으로 관련된 코드만 수정합니다.
- **기존 코드 보존**: 관련 없는 주변 코드의 포맷팅 변경, 불필요한 리팩토링, 기존 주석 및 미사용 코드 임의 삭제를 절대 금지합니다.
- **추적 가능성**: 변경된 모든 코드 라인은 사용자의 요구사항과 명확히 1:1로 매핑되어야 합니다.

## 4. Goal-Driven Execution (목표 지향 자가 검증)
- **완료 기준 명확화**: 작업 완료를 선언하기 전, 무엇으로 검증할지(테스트 통과, 린트 에러 0건, 빌드 성공 등) 명확한 기준을 정의합니다.
- **자가 치유(Self-Healing)**: 코드를 수정한 후에는 반드시 테스트/린트 명령어를 스스로 실행하여 검증하고, 실패 시 스스로 원인을 분석하여 수정한 뒤 완료를 보고합니다.

---

## 5. Project Specifications (프로젝트 요구사항 명세)
본 프로젝트는 **2028학년도 대입 개편안(고2 5등급제 & 통합형 수능)** 맞춤형 대입 전략 웹 애플리케이션입니다.  
개발 및 수정 시 아래 `docs/` 내의 상세 기능 명세를 항상 최우선으로 준수합니다:

- [`docs/README.md`](docs/README.md): 프로젝트 개요 및 2028 대입(내신 5등급제, 통합수능) 도메인 배경
- [`docs/01_target_setup.md`](docs/01_target_setup.md): [모듈 1] 목표 대학 & 학과 설정 (수시 6장 / 정시 가나다군)
- [`docs/02_susi_gpa_simulator.md`](docs/02_susi_gpa_simulator.md): [모듈 2] 수시 내신 관리 & 목표 등급 역산(Goal-Seek) 시뮬레이터
- [`docs/03_jeongsi_mock_tracker.md`](docs/03_jeongsi_mock_tracker.md): [모듈 3] 정시 모의고사 트래커 & 수능 환산점수 로드맵
- [`docs/04_motivation_dashboard.md`](docs/04_motivation_dashboard.md): [모듈 4] 동기부여 & What-If 전략 대시보드
- [`docs/05_data_architecture.md`](docs/05_data_architecture.md): [모듈 5] 로컬 & 클라우드 동기화 데이터 모델
- [`docs/06_auth_and_deployment.md`](docs/06_auth_and_deployment.md): [모듈 6] 구글 로그인 인증 & 가족 전용 접근 제어 및 웹 배포

---

## 6. Development Phasing Roadmap (단계별 개발 로드맵)
개발 실행 시 [`docs/PHASES/`](docs/PHASES/) 디렉토리의 각 단계별 명세와 완료 검증 기준을 순차적으로 준수합니다:

- [`docs/PHASES/PHASE1.md`](docs/PHASES/PHASE1.md): **[Phase 1]** 프로젝트 기반 설정, 구글 가족 인증(화이트리스트) 및 배포 파이프라인
- [`docs/PHASES/PHASE2.md`](docs/PHASES/PHASE2.md): **[Phase 2]** 2028 5등급제 내신 계산 엔진 & 수시 역산(Goal-Seek) 시뮬레이터 MVP
- [`docs/PHASES/PHASE3.md`](docs/PHASES/PHASE3.md): **[Phase 3]** 2028 통합형 수능 모의고사 트래커 & 시계열 차트 및 Gap 분석
- [`docs/PHASES/PHASE4.md`](docs/PHASES/PHASE4.md): **[Phase 4]** 목표 대학 포트폴리오 (수시 6장 + 정시 3군) & 동기부여 종합 대시보드
- [`docs/PHASES/PHASE5.md`](docs/PHASES/PHASE5.md): **[Phase 5]** 가족 실시간 클라우드 동기화, 상담용 1장 PDF 리포트 & PWA 모바일 최적화
