/**
 * 중학생 문해력(PISA) & 인포메이션 리터러시(Big6) 5분 게임형 진단 프로그램
 * Config & Assessment Dataset
 */

const GAME_CONFIG = {
    title: "미스터리 팩트체크 본부: 5분의 비밀 요원 테스트",
    subtitle: "PISA 국제 문해력 기준 & Big6 인포메이션 리터러시 역량 진단",
    targetAge: "중학교 1~3학년 (만 12~15세)",
    totalTimeLimitSeconds: 300, // 5분
    stagesCount: 5,

    // 파이어베이스 기본 설정 템플릿 (오프라인 모드에서는 자동 우회)
    firebaseConfig: {
        apiKey: "", // 사용자 Firebase API 키 (비어있으면 로컬 스토리지 오프라인 모드)
        authDomain: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: ""
    },

    // PISA 2018/2025 읽기 문해력 수준 정의
    pisaLevels: [
        {
            level: "Level 1 (기초 탐색 요원)",
            range: [0, 407],
            badge: "🌱 수습 요원",
            summary: "명시적으로 직접 제시된 단편적 정보를 찾고 기본적인 내용을 확인하는 단계입니다.",
            advice: "글 전체의 맥락과 숨은 의미를 연결해보는 연습을 시작해 보세요."
        },
        {
            level: "Level 2 (기본 문해력 요원)",
            range: [408, 480],
            badge: "🔍 정식 요원",
            summary: "OECD가 정의한 '현대 사회에 능동적으로 참여하기 위한 기초 문해력'을 갖추었습니다. 글의 주제와 겉으로 드러난 직접적 관계를 잘 파악합니다.",
            advice: "단순 사실 확인을 넘어 '왜 이런 주장을 할까?'라는 글쓴이의 의도를 질문해보세요."
        },
        {
            level: "Level 3 (우수 분석 요원)",
            range: [481, 552],
            badge: "⚡ 엘리트 요원",
            summary: "서로 다른 문단의 정보를 결합하고, 맥락을 바탕으로 적절한 추론을 해내는 탄탄한 독해력을 갖추었습니다.",
            advice: "정보의 '출처의 객관성'과 '잠재적 편향'까지 날카롭게 짚어내는 비판적 읽기를 훈련하세요."
        },
        {
            level: "Level 4 (고급 통찰 요원)",
            range: [553, 625],
            badge: "🛡️ 특수 분석관",
            summary: "미묘한 언어적 뉘앙스를 포착하고, 정보의 신뢰성과 타당성을 비판적으로 검토할 수 있는 고도의 문해력입니다.",
            advice: "상충되는 복합적인 여러 문서나 데이터를 교차 검증하는 심화 탐구 프로젝트에 도전해보세요."
        },
        {
            level: "Level 5~6 (마스터 팩트체커)",
            range: [626, 750],
            badge: "👑 수석 마스터 요원",
            summary: "복잡하고 상충되는 여러 자료를 능숙하게 종합하고, 가짜 정보와 시각적 통계 왜곡까지 완벽히 판별하는 최고 수준의 문해력입니다.",
            advice: "당신은 완벽한 디지털 리더입니다! 자신의 비판적 시각을 글로 표현하고 다른 친구들과 토론을 이끌어보세요."
        }
    ],

    // Big6 인포메이션 리터러시 6대 영역
    big6Domains: {
        taskDefinition: {
            id: "taskDefinition",
            name: "1. 과제 정의 (Task Definition)",
            desc: "해결해야 할 문제가 무엇인지 파악하고 필요한 정보를 명확히 규정하는 능력"
        },
        seekingStrategies: {
            id: "seekingStrategies",
            name: "2. 정보 탐색 전략 (Seeking Strategies)",
            desc: "가능한 모든 정보원 중 가장 신뢰성 높고 적절한 출처를 선택하는 능력"
        },
        locationAccess: {
            id: "locationAccess",
            name: "3. 위치 파악 및 접근 (Location & Access)",
            desc: "효과적인 키워드와 검색 전략으로 정보원에 빠르고 정확하게 도달하는 능력"
        },
        useOfInformation: {
            id: "useOfInformation",
            name: "4. 정보 활용 (Use of Information)",
            desc: "정보를 읽고 해석하며 사실과 의견, 왜곡된 주장을 분별해 추출하는 능력"
        },
        synthesis: {
            id: "synthesis",
            name: "5. 정보 종합 (Synthesis)",
            desc: "다양한 출처의 핵심 정보를 논리적으로 재구성하여 결론을 완성하는 능력"
        },
        evaluation: {
            id: "evaluation",
            name: "6. 평가 및 성찰 (Evaluation)",
            desc: "완성된 결과물의 객관성을 비판적으로 검증하고 탐색 과정을 성찰하는 능력"
        }
    },

    // 5단계 인터랙티브 게임 미션 시나리오
    missions: [
        {
            id: 1,
            stageNumber: 1,
            title: "미션 1: 단톡방 소음 속 '핵심 키워드 레이더'",
            subtitle: "Big6 [과제 정의 & 위치 접근] & PISA [정보 위치 찾기]",
            timeLimit: 50,
            instruction: "학교 단톡방에 괴담이 돌기 시작했습니다! 쏟아지는 수다 속에서 '우리가 진짜 검증해야 할 핵심 과제'와 '가장 효과적인 검색 키워드'를 찾아내세요.",
            storyContext: {
                sender: "반 단톡방 제보방 (알림 99+)",
                messages: [
                    { user: "지우", text: "야 들었어? 학교 앞 편의점에서 파는 '브레인부스터 울트라' 마시면 밤새 집중력 300% 오른대!" },
                    { user: "태민", text: "근데 옆반 민수는 그거 마시고 심장 터질 뻔해서 응급실 갈 뻔했다던데 진짜임?" },
                    { user: "서연", text: "인스타 보니까 다들 마시고 전교 1등 했다고 난리임 ㅋㅋ 진짜 효과 있는 거 맞냐고" },
                    { user: "도윤", text: "누가 팩트체크 좀 해봐! 오늘 밤샘 숙제해야 하는데 마셔도 안전한 거냐고!" }
                ]
            },
            questions: [
                {
                    id: "m1_q1",
                    type: "single",
                    question: "[Q1. 과제 정의] 이 혼란스러운 대화에서 요원이 가장 먼저 규명해야 할 '핵심 탐구 과제'는 무엇인가요?",
                    options: [
                        { text: "브레인부스터 음료가 어느 편의점에서 1+1 행사 중인지 최저가 찾기", scoreBig6: { taskDefinition: 5 }, scorePisa: 10, isCorrect: false },
                        { text: "인스타 인플루언서들이 올린 후기 영상의 조회수를 비교하기", scoreBig6: { taskDefinition: 5 }, scorePisa: 10, isCorrect: false },
                        { text: "해당 고카페인 에너지 음료의 실제 성분 안전성과 청소년 신체 영향 검증하기", scoreBig6: { taskDefinition: 40 }, scorePisa: 45, isCorrect: true },
                        { text: "옆반 민수가 응급실에 진짜 갔는지 소문의 진원지 친구 추궁하기", scoreBig6: { taskDefinition: 15 }, scorePisa: 15, isCorrect: false }
                    ]
                },
                {
                    id: "m1_q2",
                    type: "chips",
                    question: "[Q2. 위치 및 접근] 국가 공식 데이터 및 학술 자료를 찾기 위한 '가장 효과적인 검색 키워드 2개'를 고르세요.",
                    maxSelect: 2,
                    chips: [
                        { id: "c1", text: "식품의약품안전처 고카페인", isCorrect: true, big6Domain: "locationAccess", pisaScore: 35, big6Score: 35 },
                        { id: "c2", text: "개존맛 에너지음료 솔직후기 ㄷㄷ", isCorrect: false, big6Domain: "locationAccess", pisaScore: 0, big6Score: 0 },
                        { id: "c3", text: "청소년 일일 카페인 권장 섭취량", isCorrect: true, big6Domain: "locationAccess", pisaScore: 35, big6Score: 35 },
                        { id: "c4", text: "전교 1등 밤샘 비법 꿀팁 모음", isCorrect: false, big6Domain: "locationAccess", pisaScore: 0, big6Score: 0 }
                    ]
                }
            ]
        },
        {
            id: 2,
            stageNumber: 2,
            title: "미션 2: 정보 감별소 '신뢰도 스캔'",
            subtitle: "Big6 [탐색 전략 & 정보원 평가] & PISA [품질 및 신뢰성 평가]",
            timeLimit: 55,
            instruction: "검색 결과 4개의 웹 문서가 감지되었습니다. 팩트체크에 믿고 쓸 수 있는 '공신력 있는 출처 2개'를 선택하세요! (상업적 광고나 낚시성 글을 피하세요)",
            cards: [
                {
                    id: "source_1",
                    badge: "🏛️ 공공기관 보도자료",
                    domain: "www.mfds.go.kr (식품의약품안전처)",
                    title: "청소년 고카페인 음료 섭취 실태 및 안전 가이드라인 발표",
                    snippet: "식약처 조사 결과, 청소년 1일 카페인 권장 섭취 상한량은 체중 1kg당 2.5mg으로 권고... 과다 섭취 시 수면장애 및 칼슘 흡수 방해 유발 확인.",
                    isReliable: true,
                    rationale: "정부 공공기관 도메인(.go.kr)과 통제된 임상 연구 데이터를 제공하므로 신뢰도 최상입니다.",
                    scoreBig6: { seekingStrategies: 35, locationAccess: 20 },
                    scorePisa: 40
                },
                {
                    id: "source_2",
                    badge: "📢 스폰서 광고 블로그",
                    domain: "blog.naver.com/health_booster_99 [AD]",
                    title: "[긴급] 지금 안 마시면 시험 망함! 브레인부스터 파격 50% 세일 링크",
                    snippet: "단 일주일 만에 전교 30등 수직상승 실화? 의사들도 놀란 천재들의 비법 음료! 아래 링크를 통해 지금 즉시 구매하세요 (광고 협찬 포함)...",
                    isReliable: false,
                    rationale: "상업적 판매 목적의 스폰서 광고([AD])이며 과장된 광고 문구로 객관적 근거가 없습니다.",
                    scoreBig6: { seekingStrategies: -15, locationAccess: -10 },
                    scorePisa: -20
                },
                {
                    id: "source_3",
                    badge: "📱 개인 SNS 릴스",
                    domain: "tiktok.com/@study_with_me",
                    title: "이거 마시고 시험 봤더니 진짜 집중 개잘됨 ㄷㄷ 부작용은 몰루?",
                    snippet: "하트 1.2만개 | 댓글 452개: '진짜 효과 있어요?' '나 마셨다가 손 떨림 ㅠㅠ' 익명 유저들의 주관적 경험담 공방 진행 중...",
                    isReliable: false,
                    rationale: "개인의 주관적 경험담 및 조회수 목적의 콘텐츠로 과학적 검증이 결여되어 있습니다.",
                    scoreBig6: { seekingStrategies: -15, locationAccess: -10 },
                    scorePisa: -20
                },
                {
                    id: "source_4",
                    badge: "📑 학술 연구 논문",
                    domain: "academic.kci.go.kr (한국청소년보건학회지)",
                    title: "에너지 음료 섭취가 중·고등학생의 인지 피로도 및 심박수에 미치는 영향",
                    snippet: "중학생 320명 대상 이중맹검 대조군 실험: 일시적 각성 효과는 1~2시간 지속되나, 이후 급격한 피로 반등 및 집중력 저하가 통계적으로 유의미(p<0.01)하게 관찰됨.",
                    isReliable: true,
                    rationale: "연구 대상과 대조군이 명시된 학술 심사 논문(KCI 등재지)으로 객관적 검증 가치가 높습니다.",
                    scoreBig6: { seekingStrategies: 35, locationAccess: 20 },
                    scorePisa: 40
                }
            ]
        },
        {
            id: 3,
            stageNumber: 3,
            title: "미션 3: 스피드 팩트 스와이프 '진실 vs 왜곡'",
            subtitle: "Big6 [정보 활용] & PISA [이해하기 및 문자적/추론적 해석]",
            timeLimit: 60,
            instruction: "수집한 자료를 분석하여 4개의 진술 카드가 [사실(FACT)]인지, 교묘하게 [왜곡(FAKE)]된 것인지 판정하세요!",
            swipeCards: [
                {
                    id: "s1",
                    evidence: "공식 문서: '브레인부스터 1캔에는 카페인 130mg이 들어있다. 체중 50kg 청소년의 1일 권장 한도는 125mg이다.'",
                    claim: "진술: '체중 50kg인 중학생이 이 음료를 하루 딱 1캔만 마셔도 이미 하루 권장 상한선을 초과한다.'",
                    answer: "FACT",
                    explanation: "130mg은 125mg을 초과하므로 1캔만으로도 권장 상한선을 넘는다는 것은 정확한 사실(FACT)입니다.",
                    pisaSkill: "문자적 의미 이해 (Literal Understanding)",
                    scoreBig6: { useOfInformation: 25 },
                    scorePisa: 25
                },
                {
                    id: "s2",
                    evidence: "설문 데이터: '제품 만족도 설문에서 전체 응답자 100명 중 15명이 집중력이 향상되었다고 답했다.'",
                    claim: "진술: '따라서 이 음료를 마신 청소년 10명 중 8~9명은 확실한 집중력 향상 효과를 보았다.'",
                    answer: "FAKE",
                    explanation: "100명 중 15%에 불과한 수치를 80~90%인 것처럼 침소봉대하여 왜곡한 진술(FAKE)입니다.",
                    pisaSkill: "통계 왜곡 및 수치 해석 (Data Interpretation)",
                    scoreBig6: { useOfInformation: 25 },
                    scorePisa: 25
                },
                {
                    id: "s3",
                    evidence: "광고 시각자료 분석: '광고 그래프의 Y축이 0%가 아니라 96%부터 시작하여, 97%와 98%의 1% 차이가 마치 5배 이상 엄청난 차이처럼 보이게 그려져 있다.'",
                    claim: "진술: '이 시각 자료는 축의 기저선을 왜곡하여 미세한 차이를 극적인 효과처럼 착시를 일으키고 있다.'",
                    answer: "FACT",
                    explanation: "차트 기저선 왜곡(Truncated Graph) 기법을 사용하여 착시를 유도한 시각 자료의 문제를 올바르게 지적했습니다.",
                    pisaSkill: "다중 양식 시각 자료 평가 (Multimodal Evaluation)",
                    scoreBig6: { useOfInformation: 25 },
                    scorePisa: 25
                },
                {
                    id: "s4",
                    evidence: "상관관계 조사: '시험 성적이 우수한 학생들 중 일부가 시험 전날 에너지 음료를 마신 경험이 있는 것으로 조사되었다.'",
                    claim: "진술: '따라서 에너지 음료를 마시면 누구나 시험 성적이 우수해지는 직접적 원인이 된다.'",
                    answer: "FAKE",
                    explanation: "단순한 상관관계를 마치 인과관계(원인과 결과)인 것처럼 비약한 전형적인 논리적 오류(FAKE)입니다.",
                    pisaSkill: "인과관계 및 논리적 추론 (Cause vs Correlation)",
                    scoreBig6: { useOfInformation: 25 },
                    scorePisa: 25
                }
            ]
        },
        {
            id: 4,
            stageNumber: 4,
            title: "미션 4: 디지털 퍼즐 리포트 '정보의 종합'",
            subtitle: "Big6 [정보 종합 (Synthesis)] & PISA [복합 텍스트 통합 및 재구성]",
            timeLimit: 55,
            instruction: "검증된 핵심 조각들을 논리적인 순서(문제 진단 ➔ 과학적 사실 ➔ 합리적 대안)로 조립하여 완전한 팩트체크 리포트를 완성하세요.",
            slots: [
                { id: "slot_1", stepNumber: 1, label: "1단계: 현상 진단 (소문의 실체 파악)" },
                { id: "slot_2", stepNumber: 2, label: "2단계: 교차 검증 (과학적 팩트)" },
                { id: "slot_3", stepNumber: 3, label: "3단계: 합리적 대안 (청소년 행동 가이드)" }
            ],
            blocks: [
                {
                    id: "b1",
                    targetSlot: "slot_1",
                    text: "SNS에서 급격히 퍼진 '학습 능력 300% 향상' 소문은 상업적 과장 광고와 축 왜곡 착시 그래프에서 비롯된 미확인 정보다.",
                    isCorrect: true
                },
                {
                    id: "b2",
                    targetSlot: "slot_2",
                    text: "식약처 및 학술 연구에 따르면 1캔만으로도 일일 권장 카페인량을 초과하며 일시적 각성 후 급격한 피로 반등이 발생한다.",
                    isCorrect: true
                },
                {
                    id: "b3",
                    targetSlot: "slot_3",
                    text: "시험 기간 밤샘을 위해 음료에 의존하기보다, 규칙적인 수면과 충분한 수분 섭취로 뇌 피로를 회복하는 것이 과학적으로 안전하다.",
                    isCorrect: true
                },
                {
                    id: "b_trap",
                    targetSlot: "none",
                    text: "[함정 블록] 어차피 다들 마시니까 나만 안 마시면 손해이므로 친구들과 유행을 따라 함께 마시는 것이 가장 현명하다.",
                    isCorrect: false
                }
            ]
        },
        {
            id: 5,
            stageNumber: 5,
            title: "미션 5: 최종 팩트체크 디펜스 '비판적 성찰'",
            subtitle: "Big6 [평가 (Evaluation)] & PISA [성찰 및 메타인지]",
            timeLimit: 50,
            instruction: "리포트를 발행하기 직전 최종 검토 단계입니다! 문장의 편향성을 감별하고 요원 자신의 탐색 과정을 비판적으로 성찰하세요.",
            questions: [
                {
                    id: "m5_q1",
                    title: "[성찰 1. 균형 잡힌 서술] 리포트에 실을 문장 중 감정적 편향 없이 가장 객관적인 서술은 무엇인가요?",
                    options: [
                        {
                            text: "이 음료는 청소년 건강을 해치는 악마의 음료이므로 관련 판매점을 즉각 불매 운동해야 한다.",
                            scoreBig6: { evaluation: 10 },
                            scorePisa: 10,
                            isCorrect: false,
                            feedback: "감정적 분노 호소와 과격한 단정은 객관적 보도의 원칙에 어긋납니다."
                        },
                        {
                            text: "고카페인 음료는 개인 체질에 따라 일시적 각성과 함께 심박수 증가 등의 부작용이 공존하므로 주의 깊은 섭취 제한이 권장된다.",
                            scoreBig6: { evaluation: 50 },
                            scorePisa: 50,
                            isCorrect: true,
                            feedback: "훌륭합니다! 양면적 효과와 과학적 사실을 절제된 어조로 균형 있게 기술했습니다."
                        },
                        {
                            text: "내 친구가 마셔봤는데 별 효과도 없었으니 무조건 사기 제품임이 틀림없다.",
                            scoreBig6: { evaluation: 10 },
                            scorePisa: 10,
                            isCorrect: false,
                            feedback: "개인의 단편적 경험을 전체로 일반화하는 성급한 일반화의 오류입니다."
                        }
                    ]
                },
                {
                    id: "m5_q2",
                    title: "[성찰 2. 메타인지적 탐색 평가] 이번 탐색 과정에서 '내가 수행한 가장 훌륭한 정보 탐색 전략'은 무엇이었나요?",
                    options: [
                        {
                            text: "SNS 인기 릴스의 좋아요 수가 많은 순서대로 정보를 그대로 신뢰했다.",
                            scoreBig6: { evaluation: 10 },
                            scorePisa: 10,
                            isCorrect: false,
                            feedback: "인기도(조회수, 좋아요 수)는 정보의 객관적 진실성을 보증하지 못합니다."
                        },
                        {
                            text: "공공기관 및 학술 연구 데이터를 교차 비교하여 상업적 과장과 시각적 왜곡을 스스로 걸러냈다.",
                            scoreBig6: { evaluation: 50 },
                            scorePisa: 50,
                            isCorrect: true,
                            feedback: "완벽합니다! Big6의 최고 단계인 교차 검증과 프로세스 성찰을 성공적으로 수행했습니다."
                        },
                        {
                            text: "자료를 읽기 귀찮아서 검색 결과 가장 첫 번째에 뜬 상업 광고 링크만 확인했다.",
                            scoreBig6: { evaluation: 5 },
                            scorePisa: 5,
                            isCorrect: false,
                            feedback: "편향된 단일 출처에 의존하는 것은 인포메이션 리터러시의 가장 큰 함정입니다."
                        }
                    ]
                }
            ]
        }
    ]
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = GAME_CONFIG;
}
