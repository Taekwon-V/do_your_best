# [모듈 6] 구글 로그인 인증 & 가족 전용 접근 제어 및 웹 배포 (Auth & Deployment)

## 1. 개요
자녀의 성적과 대입 전략은 민감한 프라이버시 데이터이므로, **지정된 온 가족(부모님, 고2 첫째, 고1 둘째)의 Google 계정만 접근할 수 있는 화이트리스트 보안**을 적용하고, 언제 어디서든 접속할 수 있도록 **Firebase 인증 및 Vercel 실시간 웹 호스팅**을 구축했습니다.

---

## 2. 보안 & 인증 구현 명세 (Google OAuth + Family Whitelist)

### 2.1 Firebase Google 실계정 로그인
- 프로젝트: `do-your-best-fd8d3`
- `signInWithPopup(auth, googleProvider)`를 통해 비밀번호 없이 **Google 공식 팝업창에서 원클릭 로그인** 지원
- 자동 세션 유지 및 모바일/PC 실시간 연동

### 2.2 가족 이메일 화이트리스트 게이트 (`FamilyAccessGate`)
* **보안 작동 방식**:
  1. 관리자(학부모) 및 가족의 구글 이메일이 화이트리스트(`allowedEmails`)에 등록됨
  2. 로그인한 사용자의 이메일이 등록 목록에 존재할 때만 ➔ **대시보드 전체 접근 허용**
  3. 등록되지 않은 외부 계정 접근 시 ➔ **접근 제한 화면 노출 및 데이터 차단**

### 2.3 카카오톡 인앱 브라우저 탈출 (`InAppBrowserHandler`)
- 카카오톡 내부 링크 클릭 시 구글 로그인 차단(`403 disallowed_useragent`)을 방지하기 위해 `kakaotalk://web/openExternal` 호출을 통한 스마트폰 기본 브라우저(크롬/사파리) 자동 전환

---

## 3. 클라우드 인프라 & 배포 현황

### 3.1 인프라 구성
* **인증 (Auth)**: Firebase Authentication (Google Sign-In)
* **호스팅 (Hosting)**: Vercel (Next.js 14 App Router 최적화 배포)
* **저장소 (VCS)**: GitHub [`Taekwon-V/do_your_best`](https://github.com/Taekwon-V/do_your_best) (main 브랜치 자동 배포)
* **라이브 서비스 주소**: [`https://do-your-best.vercel.app`](https://do-your-best.vercel.app)

---

## 4. 모바일 & 웹 반응형 디자인 (Happy Hues #17)
* **테마**: Happy Hues 17번 (웜 크림 `#fef6e4`, 딥 네이비 `#001858`, 코랄 핑크 `#f582ae`, 파스텔 스카이 `#8bd3dd`)
* **적응형 레이아웃**: 모바일 세로 화면을 위한 상단 2단 헤더 및 3분할 D-Day 그리드 최적화 완료
