/**
 * PISA & Big6 Evaluation Engine
 * 학생의 행동 로그와 미션 점수를 OECD PISA 6단계 및 Big6 6대 영역으로 정밀 환산
 */

class AssessmentEvaluator {
    /**
     * 전체 평가 결과 종합 산출
     * @param {Object} rawAnswers - 각 미션별 학생 응답 객체
     * @param {number} remainingSeconds - 남은 시간 (초)
     */
    static evaluate(rawAnswers, remainingSeconds = 0) {
        const big6Scores = {
            taskDefinition: 0,
            seekingStrategies: 0,
            locationAccess: 0,
            useOfInformation: 0,
            synthesis: 0,
            evaluation: 0
        };

        let pisaPoints = 300; // PISA 기본 기준점

        // --- 미션 1 평가 (과제 정의 & 키워드 탐색) ---
        const m1 = rawAnswers[1] || {};
        if (m1.q1 && m1.q1.isCorrect) {
            big6Scores.taskDefinition += 85;
            pisaPoints += 50;
        } else {
            big6Scores.taskDefinition += 30;
            pisaPoints += 15;
        }

        if (m1.q2 && m1.q2.selected) {
            const correctChips = m1.q2.selected.filter(id => id === 'c1' || id === 'c3').length;
            const wrongChips = m1.q2.selected.filter(id => id === 'c2' || id === 'c4').length;
            const netChips = Math.max(0, correctChips - wrongChips);
            big6Scores.locationAccess += (netChips / 2) * 50;
            pisaPoints += (netChips / 2) * 45;
        }

        // --- 미션 2 평가 (정보원 신뢰도 스캔 & 탐색 전략) ---
        const m2 = rawAnswers[2] || {};
        if (m2.selectedSources) {
            const hasGov = m2.selectedSources.includes('source_1');
            const hasAcademic = m2.selectedSources.includes('source_4');
            const hasAd = m2.selectedSources.includes('source_2');
            const hasSns = m2.selectedSources.includes('source_3');

            let sourceScore = 0;
            if (hasGov) sourceScore += 45;
            if (hasAcademic) sourceScore += 45;
            if (hasAd) sourceScore -= 25;
            if (hasSns) sourceScore -= 20;

            const normalizedSource = Math.max(15, Math.min(100, 20 + sourceScore));
            big6Scores.seekingStrategies = normalizedSource;
            big6Scores.locationAccess = Math.min(100, big6Scores.locationAccess + (normalizedSource * 0.5));
            pisaPoints += (normalizedSource * 0.75);
        }

        // --- 미션 3 평가 (정보 활용 & 팩트 스와이프) ---
        const m3 = rawAnswers[3] || {};
        if (m3.cardResults) {
            const totalCards = 4;
            const correctCount = m3.cardResults.filter(c => c.isCorrect).length;
            const ratio = correctCount / totalCards;
            big6Scores.useOfInformation = Math.round(Math.max(20, ratio * 100));
            pisaPoints += (ratio * 90);
        }

        // --- 미션 4 평가 (정보 종합 & 퍼즐 조립) ---
        const m4 = rawAnswers[4] || {};
        if (m4.puzzlePlaced) {
            let correctSlots = 0;
            if (m4.puzzlePlaced.slot_1 === 'b1') correctSlots++;
            if (m4.puzzlePlaced.slot_2 === 'b2') correctSlots++;
            if (m4.puzzlePlaced.slot_3 === 'b3') correctSlots++;

            const ratio = correctSlots / 3;
            big6Scores.synthesis = Math.round(Math.max(20, ratio * 100));
            pisaPoints += (ratio * 90);
        }

        // --- 미션 5 평가 (평가 및 메타인지적 성찰) ---
        const m5 = rawAnswers[5] || {};
        let evalPoints = 20;
        if (m5.q1 && m5.q1.isCorrect) {
            evalPoints += 40;
            pisaPoints += 45;
        }
        if (m5.q2 && m5.q2.isCorrect) {
            evalPoints += 40;
            pisaPoints += 45;
        }
        big6Scores.evaluation = Math.min(100, evalPoints);

        // 시간 보너스 (5분 제한 시간 내 신속한 분석: 최대 +30 PISA 점수)
        const speedBonus = Math.min(30, Math.floor(remainingSeconds / 10));
        pisaPoints += speedBonus;

        // 최종 PISA 점수 산출 (최대 700점 수준 보정)
        const finalPisaScore = Math.min(700, Math.max(310, Math.round(pisaPoints)));

        // PISA 레벨 매칭
        const pisaLevel = this.getPisaLevel(finalPisaScore);

        // Big6 종합 점수 (평균)
        const big6Average = Math.round(
            (big6Scores.taskDefinition +
             big6Scores.seekingStrategies +
             big6Scores.locationAccess +
             big6Scores.useOfInformation +
             big6Scores.synthesis +
             big6Scores.evaluation) / 6
        );

        // 강점과 약점 도메인 산출
        const domainKeys = Object.keys(big6Scores);
        domainKeys.sort((a, b) => big6Scores[b] - big6Scores[a]);
        const bestDomainKey = domainKeys[0];
        const weakestDomainKey = domainKeys[domainKeys.length - 1];

        return {
            pisa: {
                score: finalPisaScore,
                level: pisaLevel.level,
                badge: pisaLevel.badge,
                summary: pisaLevel.summary,
                advice: pisaLevel.advice,
                speedBonus: speedBonus
            },
            big6: {
                scores: big6Scores,
                average: big6Average,
                bestDomain: {
                    key: bestDomainKey,
                    name: GAME_CONFIG.big6Domains[bestDomainKey].name,
                    score: big6Scores[bestDomainKey]
                },
                weakestDomain: {
                    key: weakestDomainKey,
                    name: GAME_CONFIG.big6Domains[weakestDomainKey].name,
                    score: big6Scores[weakestDomainKey]
                }
            },
            diagnosticAdvice: this.generateAdvice(pisaLevel, big6Scores, bestDomainKey, weakestDomainKey)
        };
    }

    static getPisaLevel(score) {
        for (const item of GAME_CONFIG.pisaLevels) {
            if (score >= item.range[0] && score <= item.range[1]) {
                return item;
            }
        }
        return GAME_CONFIG.pisaLevels[GAME_CONFIG.pisaLevels.length - 1];
    }

    static generateAdvice(pisaLevel, scores, bestKey, weakKey) {
        const bestName = GAME_CONFIG.big6Domains[bestKey].name;
        const weakName = GAME_CONFIG.big6Domains[weakKey].name;

        return {
            headline: `당신은 ${pisaLevel.badge}! "${bestName.split('.')[1].trim()}"에 탁월한 잠재력을 지녔습니다.`,
            strengthComment: `특히 **${bestName}** 영역(${scores[bestKey]}점)에서 뛰어난 기량을 보여주었습니다. 복잡한 미디어 환경에서 핵심을 포착하는 감각이 매우 돋보입니다.`,
            growthComment: `한 단계 더 도약하기 위해서는 **${weakName}** 영역(${scores[weakKey]}점)을 보완해보세요. ${GAME_CONFIG.big6Domains[weakKey].desc}을(를) 의식하며 읽는 습관을 기르면 전 세계 상위 5% 팩트체커로 성장할 수 있습니다.`,
            actionItems: [
                "포털 뉴스를 볼 때 자극적인 제목 대신 공식 보도자료나 학술 출처 링크를 직접 확인하는 습관 들이기",
                "통계 그래프를 볼 때 세로축의 시작점이 0인지, 표본의 수가 충분한지 의심해보기",
                "친구나 단톡방에 글을 공유하기 전 '사실(Fact)'과 '글쓴이의 느낌(Opinion)'을 한 번 더 분리해 생각하기"
            ]
        };
    }
}

window.AssessmentEvaluator = AssessmentEvaluator;
