/**
 * 5단계 인터랙티브 미션 렌더러 및 사용자 인터랙션 처리기
 */

class MissionRenderer {
    /**
     * [미션 1] 단톡방 수다 & 키워드 레이더 렌더링
     */
    static renderMission1(container, missionData, onComplete) {
        const state = {
            selectedQ1Index: null,
            selectedChipIds: []
        };

        const chatHtml = missionData.storyContext.messages.map(msg => `
            <div class="chat-bubble-item">
                <div class="chat-avatar">${msg.user[0]}</div>
                <div class="chat-content">
                    <span class="chat-user">${msg.user}</span>
                    <div class="chat-bubble">${msg.text}</div>
                </div>
            </div>
        `).join('');

        const q1 = missionData.questions[0];
        const q2 = missionData.questions[1];

        const q1Html = q1.options.map((opt, idx) => `
            <div class="option-card" data-idx="${idx}">
                <div class="radio-indicator"></div>
                <div class="option-text">${opt.text}</div>
            </div>
        `).join('');

        const q2ChipsHtml = q2.chips.map(chip => `
            <button type="button" class="keyword-chip" data-chip-id="${chip.id}">
                <span class="chip-icon">🏷️</span> ${chip.text}
            </button>
        `).join('');

        container.innerHTML = `
            <div class="mission-wrapper">
                <div class="mission-header-bar">
                    <span class="mission-badge">STAGE 1</span>
                    <h3>${missionData.title}</h3>
                    <p class="mission-sub">${missionData.instruction}</p>
                </div>

                <div class="mission-chat-container">
                    <div class="chat-header">📱 ${missionData.storyContext.sender}</div>
                    <div class="chat-body">${chatHtml}</div>
                </div>

                <div class="quiz-block">
                    <div class="quiz-question-title">${q1.question}</div>
                    <div class="options-grid" id="m1_q1_options">${q1Html}</div>
                </div>

                <div class="quiz-block" style="margin-top: 1.5rem;">
                    <div class="quiz-question-title">${q2.question} <span class="badge-count" id="chip_counter">(0/2 선택)</span></div>
                    <div class="chips-container" id="m1_q2_chips">${q2ChipsHtml}</div>
                </div>

                <div class="action-btn-row">
                    <button class="game-btn primary" id="m1_submit_btn" disabled>
                        <span>다음 정보 감별소로 이동</span> ➜
                    </button>
                </div>
            </div>
        `;

        // 인터랙션 바인딩
        const optCards = container.querySelectorAll('#m1_q1_options .option-card');
        optCards.forEach(card => {
            card.addEventListener('click', () => {
                optCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                state.selectedQ1Index = parseInt(card.dataset.idx);
                window.soundEngine.playSelect();
                validateM1();
            });
        });

        const chipBtns = container.querySelectorAll('.keyword-chip');
        const chipCounter = container.querySelector('#chip_counter');

        chipBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.chipId;
                if (state.selectedChipIds.includes(id)) {
                    state.selectedChipIds = state.selectedChipIds.filter(x => x !== id);
                    btn.classList.remove('active');
                } else {
                    if (state.selectedChipIds.length >= 2) {
                        return; // 최대 2개
                    }
                    state.selectedChipIds.push(id);
                    btn.classList.add('active');
                }
                chipCounter.textContent = `(${state.selectedChipIds.length}/2 선택)`;
                window.soundEngine.playClick();
                validateM1();
            });
        });

        const submitBtn = container.querySelector('#m1_submit_btn');
        function validateM1() {
            if (state.selectedQ1Index !== null && state.selectedChipIds.length === 2) {
                submitBtn.removeAttribute('disabled');
            } else {
                submitBtn.setAttribute('disabled', 'true');
            }
        }

        submitBtn.addEventListener('click', () => {
            window.soundEngine.playCorrect();
            const chosenOption = q1.options[state.selectedQ1Index];
            onComplete({
                q1: { selectedIdx: state.selectedQ1Index, isCorrect: chosenOption.isCorrect },
                q2: { selected: state.selectedChipIds }
            });
        });
    }

    /**
     * [미션 2] 출처 감별소 (검색엔진 포털 신뢰도 스캔)
     */
    static renderMission2(container, missionData, onComplete) {
        const selectedSourceIds = [];

        const cardsHtml = missionData.cards.map(card => `
            <div class="source-card" data-source-id="${card.id}">
                <div class="source-card-header">
                    <span class="source-badge">${card.badge}</span>
                    <span class="source-domain">${card.domain}</span>
                </div>
                <h4 class="source-title">${card.title}</h4>
                <p class="source-snippet">${card.snippet}</p>
                <div class="source-select-footer">
                    <button type="button" class="source-pick-btn">
                        <span class="check-icon">✓</span> 자료 바구니에 담기
                    </button>
                </div>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="mission-wrapper">
                <div class="mission-header-bar">
                    <span class="mission-badge">STAGE 2</span>
                    <h3>${missionData.title}</h3>
                    <p class="mission-sub">${missionData.instruction}</p>
                    <div class="filter-status-box">
                        현재 선택된 출처: <strong id="source_counter">0/2</strong> (신뢰할 수 있는 공인 출처 2개를 고르세요)
                    </div>
                </div>

                <div class="sources-list-grid">${cardsHtml}</div>

                <div class="action-btn-row">
                    <button class="game-btn primary" id="m2_submit_btn" disabled>
                        <span>출처 검증 완료 및 다음 분석</span> ➜
                    </button>
                </div>
            </div>
        `;

        const cards = container.querySelectorAll('.source-card');
        const counter = container.querySelector('#source_counter');
        const submitBtn = container.querySelector('#m2_submit_btn');

        cards.forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.sourceId;
                if (selectedSourceIds.includes(id)) {
                    const idx = selectedSourceIds.indexOf(id);
                    selectedSourceIds.splice(idx, 1);
                    card.classList.remove('selected');
                    card.querySelector('.source-pick-btn').classList.remove('active');
                } else {
                    if (selectedSourceIds.length >= 2) {
                        return; // 최대 2개
                    }
                    selectedSourceIds.push(id);
                    card.classList.add('selected');
                    card.querySelector('.source-pick-btn').classList.add('active');
                }
                window.soundEngine.playClick();
                counter.textContent = `${selectedSourceIds.length}/2`;
                if (selectedSourceIds.length === 2) {
                    submitBtn.removeAttribute('disabled');
                } else {
                    submitBtn.setAttribute('disabled', 'true');
                }
            });
        });

        submitBtn.addEventListener('click', () => {
            window.soundEngine.playCorrect();
            onComplete({ selectedSources: selectedSourceIds });
        });
    }

    /**
     * [미션 3] 스피드 팩트 스와이프 (진실 vs 왜곡 판정)
     */
    static renderMission3(container, missionData, onComplete) {
        let currentIndex = 0;
        const results = [];
        const totalCards = missionData.swipeCards.length;

        function loadCard(index) {
            if (index >= totalCards) {
                onComplete({ cardResults: results });
                return;
            }

            const card = missionData.swipeCards[index];

            container.innerHTML = `
                <div class="mission-wrapper">
                    <div class="mission-header-bar">
                        <span class="mission-badge">STAGE 3</span>
                        <h3>${missionData.title}</h3>
                        <p class="mission-sub">${missionData.instruction}</p>
                        <div class="progress-pill">진행도: 카드 ${index + 1} / ${totalCards}</div>
                    </div>

                    <div class="swipe-deck-area">
                        <div class="swipe-card-box" id="active_swipe_card">
                            <div class="card-skill-tag">🎯 평가 역량: ${card.pisaSkill}</div>
                            <div class="evidence-quote-box">
                                <span class="quote-label">공식 근거 문서</span>
                                <div class="quote-text">${card.evidence}</div>
                            </div>
                            <div class="claim-box">
                                <span class="claim-label">검증 대상 진술</span>
                                <div class="claim-text">${card.claim}</div>
                            </div>
                        </div>

                        <div class="swipe-controls-row">
                            <button type="button" class="swipe-btn fake-btn" id="btn_fake">
                                <span class="btn-icon">❌</span>
                                <span class="btn-text">왜곡 / 과장 (FAKE)</span>
                            </button>
                            <button type="button" class="swipe-btn fact-btn" id="btn_fact">
                                <span class="btn-icon">⭕</span>
                                <span class="btn-text">검증된 사실 (FACT)</span>
                            </button>
                        </div>
                    </div>

                    <div id="feedback_overlay" class="feedback-toast hidden"></div>
                </div>
            `;

            const btnFake = container.querySelector('#btn_fake');
            const btnFact = container.querySelector('#btn_fact');
            const cardEl = container.querySelector('#active_swipe_card');
            const feedbackEl = container.querySelector('#feedback_overlay');

            function handleChoice(chosen) {
                btnFake.disabled = true;
                btnFact.disabled = true;

                const isCorrect = (chosen === card.answer);
                results.push({ cardId: card.id, chosen, isCorrect, skill: card.pisaSkill });

                if (isCorrect) {
                    window.soundEngine.playCorrect();
                    cardEl.classList.add('animate-correct');
                    feedbackEl.className = 'feedback-toast success';
                    feedbackEl.innerHTML = `<strong>정답입니다! 🎉</strong> ${card.explanation}`;
                } else {
                    window.soundEngine.playWrong();
                    cardEl.classList.add('animate-wrong');
                    feedbackEl.className = 'feedback-toast error';
                    feedbackEl.innerHTML = `<strong>오답입니다! 💡</strong> ${card.explanation}`;
                }
                feedbackEl.classList.remove('hidden');

                setTimeout(() => {
                    currentIndex++;
                    loadCard(currentIndex);
                }, 1600);
            }

            btnFake.addEventListener('click', () => handleChoice('FAKE'));
            btnFact.addEventListener('click', () => handleChoice('FACT'));
        }

        loadCard(currentIndex);
    }

    /**
     * [미션 4] 디지털 퍼즐 리포트 (정보 종합)
     */
    static renderMission4(container, missionData, onComplete) {
        const slotsState = {
            slot_1: null,
            slot_2: null,
            slot_3: null
        };

        const slotsHtml = missionData.slots.map(s => `
            <div class="puzzle-slot" data-slot-id="${s.id}">
                <div class="slot-header">
                    <span class="slot-num">${s.stepNumber}</span>
                    <span class="slot-label">${s.label}</span>
                </div>
                <div class="slot-dropzone" id="${s.id}_dropzone">
                    <span class="slot-placeholder">아래 블록 중 알맞은 조각을 클릭하여 배치하세요</span>
                </div>
            </div>
        `).join('');

        const blocksHtml = missionData.blocks.map(b => `
            <div class="puzzle-block-card" data-block-id="${b.id}">
                <span class="puzzle-handle">🧩</span>
                <p class="puzzle-text">${b.text}</p>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="mission-wrapper">
                <div class="mission-header-bar">
                    <span class="mission-badge">STAGE 4</span>
                    <h3>${missionData.title}</h3>
                    <p class="mission-sub">${missionData.instruction}</p>
                </div>

                <div class="puzzle-slots-container">${slotsHtml}</div>

                <div class="puzzle-inventory-container">
                    <div class="inventory-title">보관된 분석 조각들 (클릭하여 빈 슬롯에 자동 채우기)</div>
                    <div class="blocks-flex" id="puzzle_blocks_box">${blocksHtml}</div>
                </div>

                <div class="action-btn-row">
                    <button class="game-btn secondary" id="m4_reset_btn">전체 조각 초기화</button>
                    <button class="game-btn primary" id="m4_submit_btn" disabled>
                        <span>리포트 조립 완료</span> ➜
                    </button>
                </div>
            </div>
        `;

        const blockCards = container.querySelectorAll('.puzzle-block-card');
        const submitBtn = container.querySelector('#m4_submit_btn');
        const resetBtn = container.querySelector('#m4_reset_btn');

        function updateSlotsUI() {
            ['slot_1', 'slot_2', 'slot_3'].forEach(slotId => {
                const zone = container.querySelector(`#${slotId}_dropzone`);
                const blockId = slotsState[slotId];
                if (blockId) {
                    const blockObj = missionData.blocks.find(b => b.id === blockId);
                    zone.innerHTML = `
                        <div class="placed-block">
                            <span>${blockObj.text}</span>
                            <button type="button" class="remove-block-btn" data-slot="${slotId}">✕</button>
                        </div>
                    `;
                } else {
                    zone.innerHTML = `<span class="slot-placeholder">아래 블록 중 알맞은 조각을 클릭하여 배치하세요</span>`;
                }
            });

            // 블록 사용 여부 스타일
            blockCards.forEach(card => {
                const bid = card.dataset.blockId;
                const isUsed = Object.values(slotsState).includes(bid);
                card.classList.toggle('used', isUsed);
            });

            // 전체 슬롯 채워짐 여부
            const allFilled = slotsState.slot_1 && slotsState.slot_2 && slotsState.slot_3;
            if (allFilled) {
                submitBtn.removeAttribute('disabled');
            } else {
                submitBtn.setAttribute('disabled', 'true');
            }

            // 제거 버튼 리스너 바인딩
            container.querySelectorAll('.remove-block-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const slot = btn.dataset.slot;
                    slotsState[slot] = null;
                    window.soundEngine.playClick();
                    updateSlotsUI();
                });
            });
        }

        blockCards.forEach(card => {
            card.addEventListener('click', () => {
                const bid = card.dataset.blockId;
                if (Object.values(slotsState).includes(bid)) return;

                // 비어있는 첫 번째 슬롯에 배치
                const emptySlot = ['slot_1', 'slot_2', 'slot_3'].find(s => !slotsState[s]);
                if (emptySlot) {
                    slotsState[emptySlot] = bid;
                    window.soundEngine.playSelect();
                    updateSlotsUI();
                }
            });
        });

        resetBtn.addEventListener('click', () => {
            slotsState.slot_1 = null;
            slotsState.slot_2 = null;
            slotsState.slot_3 = null;
            window.soundEngine.playClick();
            updateSlotsUI();
        });

        submitBtn.addEventListener('click', () => {
            window.soundEngine.playCorrect();
            onComplete({ puzzlePlaced: { ...slotsState } });
        });
    }

    /**
     * [미션 5] 최종 팩트체크 디펜스 (비판적 성찰)
     */
    static renderMission5(container, missionData, onComplete) {
        const state = {
            q1Answer: null,
            q2Answer: null
        };

        const q1 = missionData.questions[0];
        const q2 = missionData.questions[1];

        const q1Opts = q1.options.map((opt, idx) => `
            <div class="option-card" data-q="1" data-idx="${idx}">
                <div class="radio-indicator"></div>
                <div class="option-text">${opt.text}</div>
            </div>
        `).join('');

        const q2Opts = q2.options.map((opt, idx) => `
            <div class="option-card" data-q="2" data-idx="${idx}">
                <div class="radio-indicator"></div>
                <div class="option-text">${opt.text}</div>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="mission-wrapper">
                <div class="mission-header-bar">
                    <span class="mission-badge final-stage">FINAL STAGE</span>
                    <h3>${missionData.title}</h3>
                    <p class="mission-sub">${missionData.instruction}</p>
                </div>

                <div class="quiz-block">
                    <div class="quiz-question-title">${q1.title}</div>
                    <div class="options-grid" id="m5_q1_opts">${q1Opts}</div>
                </div>

                <div class="quiz-block" style="margin-top: 1.5rem;">
                    <div class="quiz-question-title">${q2.title}</div>
                    <div class="options-grid" id="m5_q2_opts">${q2Opts}</div>
                </div>

                <div class="action-btn-row">
                    <button class="game-btn victory" id="m5_submit_btn" disabled>
                        <span>최종 팩트체크 리포트 발행</span> 🚀
                    </button>
                </div>
            </div>
        `;

        const submitBtn = container.querySelector('#m5_submit_btn');

        function checkCompletion() {
            if (state.q1Answer !== null && state.q2Answer !== null) {
                submitBtn.removeAttribute('disabled');
            } else {
                submitBtn.setAttribute('disabled', 'true');
            }
        }

        container.querySelectorAll('#m5_q1_opts .option-card').forEach(card => {
            card.addEventListener('click', () => {
                container.querySelectorAll('#m5_q1_opts .option-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                state.q1Answer = parseInt(card.dataset.idx);
                window.soundEngine.playSelect();
                checkCompletion();
            });
        });

        container.querySelectorAll('#m5_q2_opts .option-card').forEach(card => {
            card.addEventListener('click', () => {
                container.querySelectorAll('#m5_q2_opts .option-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                state.q2Answer = parseInt(card.dataset.idx);
                window.soundEngine.playSelect();
                checkCompletion();
            });
        });

        submitBtn.addEventListener('click', () => {
            window.soundEngine.playStageComplete();
            const opt1 = q1.options[state.q1Answer];
            const opt2 = q2.options[state.q2Answer];

            onComplete({
                q1: { selectedIdx: state.q1Answer, isCorrect: opt1.isCorrect },
                q2: { selectedIdx: state.q2Answer, isCorrect: opt2.isCorrect }
            });
        });
    }
}

window.MissionRenderer = MissionRenderer;
