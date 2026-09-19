# 🕵️‍♂️ 미스터리 팩트체크 본부 (Mystery Fact-Checker)
> **중학생을 위한 5분 게임형 PISA 문해력 & Big6 인포메이션 리터러시 진단 프로그램**

---

## 📌 프로그램 개요

본 프로그램은 중학생들이 시험 형태의 부담감 없이 흥미진진한 **5분간의 비밀 요원 미션(게임)**을 스스로 수행하며, **OECD PISA 읽기 문해력 국제 기준**과 **Big6 인포메이션 리터러시 6대 영역**을 정밀하게 진단받을 수 있도록 설계된 웹 애플리케이션입니다.

- **대상**: 중학교 1~3학년 (만 12~15세)
- **소요 시간**: 약 5분 (300초 카운트다운 타이머)
- **주요 특징**:
  - 100% 무설치 오프라인 실행 지원 (인터넷 없이도 `index.html` 즉시 구동)
  - 순수 JavaScript Web Audio API로 생동감 넘치는 효과음(효과음 파일 다운로드 불필요)
  - HTML5 Canvas 기반의 고해상도 Big6 방사형(Radar) 역량 차트 및 PISA 등급 게이지 시각화
  - 결과지 PDF 출력 및 인쇄 최적화 스타일 지원
  - 교사용 데이터 관리 모달, 로컬 JSON/CSV 변환기 및 Firebase Firestore 클라우드 동기화 지원

---

## 🎯 평가 프레임워크 및 게임 스테이지

| 단계 | 스테이지명 | PISA 읽기 문해력 기준 | Big6 정보 리터러시 역량 | 주요 활동 |
| :---: | :--- | :--- | :--- | :--- |
| **Stage 1** | **키워드 레이더** | 정보 위치 찾기 (Locating Info) | 1. 과제 정의 (Task Definition)<br>3. 위치 및 접근 (Location & Access) | 단톡방 수다 속 핵심 연구 과제 파악 및 최적 검색 키워드 2개 선별 |
| **Stage 2** | **출처 감별소** | 품질 및 신뢰성 평가 (Assessing Credibility) | 2. 탐색 전략 (Seeking Strategies)<br>3. 위치 및 접근 (Location & Access) | 포털 검색 결과 중 공공기관 및 학술 논문 등 공신력 출처 선별 (광고/낚시 배제) |
| **Stage 3** | **스피드 팩트 스와이프** | 이해하기 및 통계 왜곡 포착 (Understanding) | 4. 정보 활용 (Use of Information) | 원문 근거와 진술을 대조하여 [사실(FACT)] vs [왜곡(FAKE)] 신속 판정 |
| **Stage 4** | **퍼즐 리포트 조립** | 복합 텍스트 통합 (Integrating Texts) | 5. 정보 종합 (Synthesis) | 검증된 근거 조각들을 논리적 순서(현상 ➔ 팩트 ➔ 대안)로 조립 |
| **Stage 5** | **최종 디펜스 & 성찰** | 비판적 성찰 및 메타인지 (Reflecting) | 6. 평가 및 성찰 (Evaluation) | 리포트 속 편향된 어조 감별 및 자신의 탐색 전략 자체 평가 |

---

## 📂 프로젝트 파일 구조

```
iltest/
├── index.html                  # 메인 웹 애플리케이션 (SPA)
├── css/
│   └── style.css               # 사이버 탐정 테마 UI & 인쇄용 스타일
├── js/
│   ├── config.js               # 미션 시나리오 문항 데이터 및 PISA/Big6 배점표
│   ├── audio.js                # Web Audio API 기반 오디오 효과음 엔진
│   ├── chart-renderer.js       # 순수 HTML5 Canvas 방사형 차트 렌더러
│   ├── evaluator.js            # PISA 6수준 및 Big6 환산 평가 엔진
│   ├── firebase-service.js     # 오프라인 로컬 저장 + 파이어베이스 동기화 서비스
│   ├── missions.js             # 5단계 미니게임 인터랙션 처리기
│   └── engine.js               # 게임 루프, 타이머, 상태 관리 및 화면 제어
├── tools/
│   ├── server.py               # 로컬 오프라인 테스트용 파이썬 서버 (포트 8000)
│   └── export_results.py       # 학생 진단 데이터 JSON을 엑셀(CSV)로 변환
├── .gitignore                  # Git 제외 목록
└── README.md                   # 프로젝트 가이드 문서
```

---

## 🚀 1. 오프라인 로컬 테스트 방법

### 방법 A. 파일 직접 열기 (가장 간단한 방법)
`index.html` 파일을 더블클릭하여 크롬(Chrome), 엣지(Edge), 웨일(Whale) 등 일반 웹 브라우저에서 바로 실행합니다. 외부 인터넷 연결이 없어도 사운드, 그래픽, 진단 엔진이 100% 정상 작동합니다.

### 방법 B. 파이썬 로컬 서버 실행
터미널(PowerShell 또는 명령 프롬프트)에서 아래 명령어를 실행하면 브라우저가 자동으로 실행됩니다.
```bash
python tools/server.py
```
- 브라우저 주소: `http://localhost:8000/index.html`

---

## 🐙 2. 깃허브(GitHub) 탑재 및 GitHub Pages 무료 배포 방법

1. **Git 저장소 초기화 및 커밋**:
   ```bash
   git init
   git add .
   git commit -m "feat: Initial commit for Mystery Fact-Checker Middle School Assessment"
   ```
2. **GitHub 레포지토리 연결 및 푸시**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/사용자계정명/저장소이름.git
   git push -u origin main
   ```
3. **GitHub Pages 무료 웹 호스팅 활성화 (학생들에게 주소 배포)**:
   - GitHub 저장소 웹페이지의 **Settings** ➔ **Pages** 메뉴로 이동합니다.
   - **Build and deployment** 항목의 Source를 `Deploy from a branch`로 설정하고 Branch를 `main` / `/(root)` 로 선택 후 **Save**를 누릅니다.
   - 1~2분 후 `https://사용자계정명.github.io/저장소이름/` 링크가 생성되어 학생들에게 주소만 전달하면 스마트폰이나 태블릿에서도 즉시 게임을 즐길 수 있습니다.

---

## 🔥 3. 파이어베이스(Firebase) 데이터베이스 연동 방법

기본적으로 프로그램은 **오프라인 우선(Offline-First)** 방식으로 동작하므로 Firebase를 설정하지 않아도 브라우저 `LocalStorage`에 모든 학생 결과가 안전하게 누적됩니다. 

학급 전체의 결과를 클라우드에 모으려면 다음과 같이 무료 Firebase를 연결할 수 있습니다:

1. **Firebase 콘솔 접속**: [https://console.firebase.google.com/](https://console.firebase.google.com/) 에 접속하여 무료 새 프로젝트를 만듭니다.
2. **Firestore 데이터베이스 생성**:
   - 좌측 메뉴에서 **Firestore Database** ➔ **데이터베이스 만들기** 클릭 (테스트 모드로 시작).
3. **웹 앱 등록 및 키 확인**:
   - 프로젝트 개요 화면에서 `</>` (웹) 아이콘을 클릭하여 앱을 등록하고 `firebaseConfig` 객체 값을 확인합니다.
4. **연동 적용 (두 가지 방법 중 택일)**:
   - **방법 1 (웹 화면에서 설정)**: 프로그램 우측 상단의 `⚙️ 관리` 버튼을 누르고 `Firebase API Key`, `Project ID`를 입력 후 저장합니다.
   - **방법 2 (코드에서 영구 지정)**: `js/config.js` 파일의 `firebaseConfig` 항목에 복사한 키를 붙여넣습니다:
     ```javascript
     firebaseConfig: {
         apiKey: "AIzaSy...",
         authDomain: "my-school.firebaseapp.com",
         projectId: "my-school",
         storageBucket: "my-school.appspot.com",
         messagingSenderId: "...",
         appId: "..."
     }
     ```
- 연동이 완료되면 학생이 미션을 끝마칠 때마다 Firestore의 `student_assessments` 컬렉션에 진단 결과가 실시간으로 자동 축적됩니다.

---

## 📊 4. 교사용 학생 진단 데이터 관리 및 엑셀(CSV) 변환

1. **데이터 내보내기**:
   - 웹 화면 우측 상단의 `⚙️ 관리` 버튼 ➔ `전체 데이터 내보내기 (.JSON)` 클릭
   - 또는 진단 결과 리포트 화면 하단의 `💾 진단 데이터 다운로드 (JSON)` 클릭
2. **엑셀(CSV) 일괄 변환**:
   - 다운로드한 JSON 파일을 `iltest/` 디렉토리에 두고 아래 파이썬 명령어를 실행합니다:
     ```bash
     python tools/export_results.py
     ```
   - 한국어 엑셀에서 글자 깨짐 없이 바로 열 수 있는 UTF-8-BOM 인코딩의 `.csv` 파일이 자동 생성됩니다.

---

## ⚖️ 라이선스
MIT License. 교육 목적의 자유로운 수정 및 확장이 가능합니다.
