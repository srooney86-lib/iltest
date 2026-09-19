/**
 * Game Engine & Application Controller
 * 상태 전이, 5분 카운트다운 타이머, 화면 라우팅, 리포트 렌더링 및 교사용 모달 제어
 */

class GameEngine {
    constructor() {
        this.studentProfile = {
            nickname: "",
            school: "",
            grade: "2학년"
        };
        this.currentStageIndex = 0;
        this.answers = {};
        this.totalSeconds = GAME_CONFIG.totalTimeLimitSeconds;
        this.remainingSeconds = this.totalSeconds;
        this.timerInterval = null;
        this.evaluationResult = null;

        this.initDOMElements();
        this.bindEvents();
    }

    initDOMElements() {
        this.screenIntro = document.getElementById('screen_intro');
        this.screenBriefing = document.getElementById('screen_briefing');
        this.screenGame = document.getElementById('screen_game');
        this.screenAnalyzing = document.getElementById('screen_analyzing');
        this.screenReport = document.getElementById('screen_report');

        this.hudTimer = document.getElementById('hud_timer');
        this.hudStageText = document.getElementById('hud_stage_text');
        this.hudProgressBar = document.getElementById('hud_progress_bar');
        this.missionContainer = document.getElementById('active_mission_arena');

        this.btnSound = document.getElementById('btn_sound_toggle');
        this.btnSettings = document.getElementById('btn_settings');
        this.modalSettings = document.getElementById('modal_settings');
    }

    bindEvents() {
        // 프로필 폼 제출 및 브리핑 이동
        const profileForm = document.getElementById('profile_form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const nickname = document.getElementById('input_nickname').value.trim();
                const school = document.getElementById('input_school').value.trim();
                const grade = document.getElementById('select_grade').value;

                if (!nickname) {
                    alert("요원 닉네임을 입력해주세요!");
                    return;
                }

                this.studentProfile = { nickname, school, grade };
                window.soundEngine.playClick();
                this.showBriefing();
            });
        }

        // 브리핑에서 본 미션 시작
        const btnStartGame = document.getElementById('btn_start_game');
        if (btnStartGame) {
            btnStartGame.addEventListener('click', () => {
                window.soundEngine.playCorrect();
                this.startGame();
            });
        }

        // 사운드 토글 버튼
        if (this.btnSound) {
            this.btnSound.addEventListener('click', () => {
                const isMuted = window.soundEngine.toggleMute();
                this.btnSound.textContent = isMuted ? '🔇' : '🔊';
            });
        }

        // 설정 / 교사용 모달
        if (this.btnSettings && this.modalSettings) {
            this.btnSettings.addEventListener('click', () => {
                this.openSettingsModal();
            });

            document.getElementById('btn_close_settings').addEventListener('click', () => {
                this.modalSettings.classList.add('hidden');
            });

            document.getElementById('btn_save_firebase').addEventListener('click', () => {
                this.saveFirebaseSettings();
            });

            document.getElementById('btn_export_json').addEventListener('click', () => {
                window.storageService.exportLocalRecordsAsJSON();
            });

            document.getElementById('btn_clear_data').addEventListener('click', () => {
                if (confirm("정말 모든 오프라인 진단 기록을 삭제하시겠습니까?")) {
                    window.storageService.clearLocalRecords();
                    alert("로컬 기록이 초기화되었습니다.");
                    this.updateSettingsModalUI();
                }
            });
        }

        // 리포트 화면 버튼들
        const btnRestart = document.getElementById('btn_restart');
        if (btnRestart) {
            btnRestart.addEventListener('click', () => {
                location.reload();
            });
        }

        const btnPrint = document.getElementById('btn_print');
        if (btnPrint) {
            btnPrint.addEventListener('click', () => {
                window.print();
            });
        }

        const btnDownloadResult = document.getElementById('btn_download_result');
        if (btnDownloadResult) {
            btnDownloadResult.addEventListener('click', () => {
                window.storageService.exportLocalRecordsAsJSON();
            });
        }
    }

    showBriefing() {
        this.screenIntro.classList.add('hidden');
        this.screenBriefing.classList.remove('hidden');
        document.getElementById('briefing_agent_name').textContent = this.studentProfile.nickname;
    }

    startGame() {
        this.screenBriefing.classList.add('hidden');
        this.screenGame.classList.remove('hidden');

        this.currentStageIndex = 0;
        this.answers = {};
        this.remainingSeconds = this.totalSeconds;

        this.startTimer();
        this.loadCurrentMission();
    }

    startTimer() {
        clearInterval(this.timerInterval);
        this.updateTimerDisplay();

        this.timerInterval = setInterval(() => {
            this.remainingSeconds--;
            this.updateTimerDisplay();

            if (this.remainingSeconds <= 30 && this.remainingSeconds > 0) {
                window.soundEngine.playWarningTick();
            }

            if (this.remainingSeconds <= 0) {
                clearInterval(this.timerInterval);
                alert("⏱️ 5분의 제한 시간이 종료되었습니다! 분석 화면으로 이동합니다.");
                this.finishGame();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const mins = Math.floor(this.remainingSeconds / 60);
        const secs = this.remainingSeconds % 60;
        this.hudTimer.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        if (this.remainingSeconds <= 45) {
            this.hudTimer.classList.add('warning');
        } else {
            this.hudTimer.classList.remove('warning');
        }
    }

    loadCurrentMission() {
        const mission = GAME_CONFIG.missions[this.currentStageIndex];
        if (!mission) {
            this.finishGame();
            return;
        }

        // HUD 업데이트
        const progressPercent = ((this.currentStageIndex) / GAME_CONFIG.stagesCount) * 100;
        this.hudProgressBar.style.width = `${progressPercent}%`;
        this.hudStageText.textContent = `STAGE ${mission.stageNumber} / ${GAME_CONFIG.stagesCount}`;

        // 미션별 전용 렌더러 호출
        switch (mission.stageNumber) {
            case 1:
                MissionRenderer.renderMission1(this.missionContainer, mission, (ans) => this.handleMissionDone(1, ans));
                break;
            case 2:
                MissionRenderer.renderMission2(this.missionContainer, mission, (ans) => this.handleMissionDone(2, ans));
                break;
            case 3:
                MissionRenderer.renderMission3(this.missionContainer, mission, (ans) => this.handleMissionDone(3, ans));
                break;
            case 4:
                MissionRenderer.renderMission4(this.missionContainer, mission, (ans) => this.handleMissionDone(4, ans));
                break;
            case 5:
                MissionRenderer.renderMission5(this.missionContainer, mission, (ans) => this.handleMissionDone(5, ans));
                break;
        }
    }

    handleMissionDone(stageNumber, answerData) {
        this.answers[stageNumber] = answerData;
        this.currentStageIndex++;

        if (this.currentStageIndex < GAME_CONFIG.stagesCount) {
            this.loadCurrentMission();
        } else {
            this.finishGame();
        }
    }

    finishGame() {
        clearInterval(this.timerInterval);
        this.screenGame.classList.add('hidden');
        this.screenAnalyzing.classList.remove('hidden');

        // PISA 및 Big6 지수 종합 계산
        this.evaluationResult = AssessmentEvaluator.evaluate(this.answers, this.remainingSeconds);

        // 데이터 저장 (오프라인 로컬 + 파이어베이스)
        window.storageService.saveResult(this.studentProfile, this.evaluationResult);

        // 1.8초간의 사이버네틱 분석 시각 효과 후 리포트 오픈
        setTimeout(() => {
            this.screenAnalyzing.classList.add('hidden');
            this.showReport();
        }, 1800);
    }

    showReport() {
        this.screenReport.classList.remove('hidden');
        const res = this.evaluationResult;

        // 1. 학생 프로필 & 요원 등급 뱃지
        document.getElementById('report_student_title').textContent = `${this.studentProfile.nickname} 요원의 진단 결과서`;
        document.getElementById('report_student_sub').textContent = `${this.studentProfile.school || '미스터리 팩트체크 본부'} · ${this.studentProfile.grade}`;
        document.getElementById('report_agent_badge').textContent = res.pisa.badge;

        // 2. PISA 읽기 문해력 결과
        document.getElementById('report_pisa_score').textContent = `${res.pisa.score}점`;
        document.getElementById('report_pisa_level').textContent = res.pisa.level;
        document.getElementById('report_pisa_summary').textContent = res.pisa.summary;
        DiagnosticChartRenderer.renderPisaGauge(
            document.getElementById('report_pisa_gauge_box'),
            res.pisa.score,
            res.pisa
        );

        // 3. Big6 인포메이션 리터러시 결과
        document.getElementById('report_big6_avg').textContent = `${res.big6.average}점`;
        document.getElementById('report_best_domain').textContent = res.big6.bestDomain.name;
        document.getElementById('report_weak_domain').textContent = res.big6.weakestDomain.name;

        // Canvas Radar Chart 렌더링
        const canvas = document.getElementById('radar_chart_canvas');
        DiagnosticChartRenderer.renderRadarChart(canvas, res.big6.scores);

        // 4. 상세 성장 피드백 코멘트
        const advice = res.diagnosticAdvice;
        document.getElementById('report_advice_headline').textContent = advice.headline;
        document.getElementById('report_strength_comment').innerHTML = advice.strengthComment;
        document.getElementById('report_growth_comment').innerHTML = advice.growthComment;

        const actionListEl = document.getElementById('report_action_items');
        actionListEl.innerHTML = advice.actionItems.map(item => `<li><span class="bullet">✓</span> ${item}</li>`).join('');
    }

    openSettingsModal() {
        this.updateSettingsModalUI();
        this.modalSettings.classList.remove('hidden');
    }

    updateSettingsModalUI() {
        const config = window.storageService.getCustomFirebaseConfig() || {};
        document.getElementById('cfg_api_key').value = config.apiKey || "";
        document.getElementById('cfg_project_id').value = config.projectId || "";
        document.getElementById('cfg_auth_domain').value = config.authDomain || "";

        const records = window.storageService.getAllLocalRecords();
        document.getElementById('offline_records_count').textContent = `${records.length}건`;

        const syncBadge = document.getElementById('firebase_status_badge');
        if (window.storageService.isFirebaseReady) {
            syncBadge.className = 'status-pill online';
            syncBadge.textContent = '● 온라인 연결됨 (Firestore)';
        } else {
            syncBadge.className = 'status-pill offline';
            syncBadge.textContent = '○ 오프라인 모드 (LocalStorage)';
        }
    }

    saveFirebaseSettings() {
        const apiKey = document.getElementById('cfg_api_key').value.trim();
        const projectId = document.getElementById('cfg_project_id').value.trim();
        const authDomain = document.getElementById('cfg_auth_domain').value.trim();

        const config = {
            apiKey,
            projectId,
            authDomain,
            storageBucket: `${projectId}.appspot.com`,
            appId: ""
        };

        const success = window.storageService.saveCustomFirebaseConfig(config);
        if (success) {
            alert("Firebase 설정이 성공적으로 저장 및 연결되었습니다!");
        } else {
            alert("Firebase 설정이 저장되었습니다. (유효한 키가 입력되면 온라인 동기화가 시작됩니다)");
        }
        this.updateSettingsModalUI();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.gameEngine = new GameEngine();
});
