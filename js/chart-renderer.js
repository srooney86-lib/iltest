/**
 * Pure HTML5 Canvas Radar & Bar Chart Renderer
 * 외부 라이브러리 없이 100% 오프라인에서 고해상도(Hi-DPI) 방사형 차트 렌더링
 */

class DiagnosticChartRenderer {
    /**
     * Big6 6대 영역 방사형(Radar/Spider) 차트 그리기
     * @param {HTMLCanvasElement} canvas
     * @param {Object} scores - { taskDefinition: 85, seekingStrategies: 90, ... }
     */
    static renderRadarChart(canvas, scores) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        // 캔버스 크기 및 Hi-DPI 보정
        const width = canvas.parentElement.clientWidth || 360;
        const height = Math.min(width, 360);
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(dpr, dpr);

        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(centerX, centerY) - 52;

        const labels = [
            "1. 과제 정의",
            "2. 탐색 전략",
            "3. 위치·접근",
            "4. 정보 활용",
            "5. 정보 종합",
            "6. 평가·성찰"
        ];
        const keys = [
            "taskDefinition",
            "seekingStrategies",
            "locationAccess",
            "useOfInformation",
            "synthesis",
            "evaluation"
        ];

        const totalAxes = labels.length;
        const angleStep = (Math.PI * 2) / totalAxes;

        ctx.clearRect(0, 0, width, height);

        // 1. 거미줄 배경 원/다각형 그리기 (20%, 40%, 60%, 80%, 100%)
        const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
        levels.forEach((level) => {
            ctx.beginPath();
            for (let i = 0; i < totalAxes; i++) {
                const angle = i * angleStep - Math.PI / 2;
                const x = centerX + Math.cos(angle) * (radius * level);
                const y = centerY + Math.sin(angle) * (radius * level);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.strokeStyle = level === 1.0 ? 'rgba(56, 189, 248, 0.4)' : 'rgba(148, 163, 184, 0.15)';
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        // 2. 축 선(Spoke) 그리기 & 라벨 표시
        ctx.font = 'bold 11px Pretendard, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let i = 0; i < totalAxes; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            // 축 선
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
            ctx.stroke();

            // 라벨 위치 (반경보다 약간 바깥)
            const labelDist = radius + 22;
            const lx = centerX + Math.cos(angle) * labelDist;
            const ly = centerY + Math.sin(angle) * labelDist;

            ctx.fillStyle = '#94a3b8';
            ctx.fillText(labels[i], lx, ly);
        }

        // 3. 학생 데이터 다각형 그리기
        ctx.beginPath();
        const dataPoints = [];
        for (let i = 0; i < totalAxes; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const rawScore = scores[keys[i]] || 0;
            const normalized = Math.max(0, Math.min(100, rawScore)) / 100;
            const x = centerX + Math.cos(angle) * (radius * normalized);
            const y = centerY + Math.sin(angle) * (radius * normalized);
            dataPoints.push({ x, y, score: Math.round(rawScore) });

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();

        // 영역 채우기 (그라데이션 및 네온 효과)
        ctx.fillStyle = 'rgba(14, 165, 233, 0.35)';
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // 4. 각 꼭짓점에 포인트 및 점수 뱃지 그리기
        dataPoints.forEach((pt) => {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
            ctx.fillStyle = '#38bdf8';
            ctx.fill();
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    }

    /**
     * PISA 읽기 문해력 점수 게이지 바 그리기
     */
    static renderPisaGauge(container, score, levelObj) {
        if (!container) return;
        const normalized = Math.min(100, Math.max(10, ((score - 250) / (700 - 250)) * 100));

        container.innerHTML = `
            <div class="pisa-meter">
                <div class="pisa-meter-bar-track">
                    <div class="pisa-meter-bar-fill" style="width: ${normalized}%;"></div>
                </div>
                <div class="pisa-meter-labels">
                    <span>기초 (Lv 1)</span>
                    <span>기본 (Lv 2)</span>
                    <span>우수 (Lv 3)</span>
                    <span>고급 (Lv 4)</span>
                    <span>마스터 (Lv 5-6)</span>
                </div>
            </div>
        `;
    }
}

window.DiagnosticChartRenderer = DiagnosticChartRenderer;
