# [모듈 6] 구글 로그인 인증 & 가족 전용 접근 제어 및 웹 배포 (Auth & Deployment)

## 1. 개요
자녀의 성적과 대입 전략은 민감한 프라이버시 데이터이므로, **지정된 가족 구성원(부모님, 자녀)의 Google 계정만 접근할 수 있는 화이트리스트 보안**을 적용하고, 언제 어디서든 접속할 수 있도록 **클라우드 실시간 동기화 및 웹 호스팅**을 구축하는 모듈입니다.

---

## 2. 보안 & 인증 요구사항 (Google OAuth + Family Whitelist)

### 2.1 구글 로그인 (Google Sign-In)
- 복잡한 회원가입이나 비밀번호 관리 없이 **Google 계정으로 1초 만에 원클릭 로그인** 지원
- 세션 유지 및 자동 로그인 (모바일/PC 어디서나 편리하게 접근)

### 2.2 가족 이메일 화이트리스트 게이트 (Family Access Gate)
* **작동 방식**:
  1. 관리자(학부모)가 허용할 가족 이메일 목록을 환경 변수 또는 보안 설정에 등록 (예: `ALLOWED_FAMILY_EMAILS=parent1@gmail.com,parent2@gmail.com,student@gmail.com`)
  2. 로그인한 사용자의 이메일이 허용 목록에 있으면 ➔ **대시보드 전체 접근 허용**
  3. 목록에 없는 외부인이 구글 로그인을 시도할 경우 ➔ **접근 거부 화면("인가되지 않은 계정입니다. 가족 계정으로 로그인해주세요.") 표시 및 차단**

### 2.3 가족 간 실시간 데이터 동기화 (Family Real-time Sync)
- 부모님이 PC에서 목표 대학을 수정하거나, 자녀가 스마트폰에서 최신 모의고사 성적을 입력하면 **가족 모두에게 실시간으로 즉시 반영**
- 오프라인 상태에서도 조회/입력 가능하도록 로컬 캐싱 지원

---

## 3. 클라우드 인프라 & 웹 배포 명세

### 3.1 권장 인프라 구성 (안전하고 유지비용 0원)
* **옵션 A (Firebase 올인원 - 가장 안정적 & 무료 tier 충분)**:
  * **Auth**: Firebase Authentication (Google Provider)
  * **Database**: Cloud Firestore (실시간 가족 데이터 동기화 및 보안 규칙 적용)
  * **Hosting**: Firebase Hosting / App Hosting (글로벌 CDN, 무료 HTTPS 인증서 자동 제공)
* **옵션 B (NextAuth + Vercel + Supabase)**:
  * **Auth**: NextAuth.js (Auth.js) Google Provider
  * **Database**: Supabase PostgreSQL / KV
  * **Hosting**: Vercel (Next.js 최적화 배포)

### 3.2 보안 규칙 (Database Security Rules)
```javascript
// Firestore 보안 규칙 예시 (화이트리스트 이메일만 읽기/쓰기 허용)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /family_data/{document=**} {
      allow read, write: if request.auth != null && 
        request.auth.token.email in ['father@gmail.com', 'mother@gmail.com', 'child@gmail.com'];
    }
  }
}
```

---

## 4. 모바일 & 웹 사용성 (PWA 지원)
* **PWA (Progressive Web App)** 지원: 스마트폰(아이폰/갤럭시) 홈 화면에 **'앱 아이콘'**으로 추가하여 일반 스마트폰 앱처럼 실행 가능
* 반응형 웹 디자인: PC 모니터, 태블릿(아이패드/갤럭시탭), 스마트폰 화면에 완벽 대응
