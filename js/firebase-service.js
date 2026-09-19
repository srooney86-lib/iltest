/**
 * Firebase & Offline Storage Service
 * 오프라인 상태에서는 LocalStorage에 안전하게 누적 저장하고,
 * Firebase 설정이 주어지면 Firestore 컬렉션(student_assessments)으로 자동 동기화
 */

class StorageService {
    constructor() {
        this.STORAGE_KEY = "FACT_CHECKER_ASSESSMENT_RECORDS";
        this.CONFIG_KEY = "FACT_CHECKER_FIREBASE_CONFIG";
        this.isFirebaseReady = false;
        this.db = null;

        this.initFirebase();
    }

    // 로컬 스토리지에 저장된 사용자 Firebase 설정 불러오기
    getCustomFirebaseConfig() {
        try {
            const saved = localStorage.getItem(this.CONFIG_KEY);
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.warn("Config load error", e);
        }
        return GAME_CONFIG.firebaseConfig;
    }

    saveCustomFirebaseConfig(config) {
        localStorage.setItem(this.CONFIG_KEY, JSON.stringify(config));
        return this.initFirebase();
    }

    initFirebase() {
        const config = this.getCustomFirebaseConfig();
        if (config && config.apiKey && config.projectId && window.firebase) {
            try {
                if (!firebase.apps.length) {
                    firebase.initializeApp(config);
                }
                this.db = firebase.firestore();
                this.isFirebaseReady = true;
                console.log("🔥 Firebase Firestore 연동 완료!");
                return true;
            } catch (err) {
                console.warn("Firebase 초기화 대기 또는 실패:", err);
                this.isFirebaseReady = false;
                return false;
            }
        } else {
            this.isFirebaseReady = false;
            return false;
        }
    }

    /**
     * 학생 평가 결과 저장 (오프라인 우선 + 온라인 동기화)
     */
    async saveResult(studentProfile, evaluationResult) {
        const record = {
            id: 'REC_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
            timestamp: new Date().toISOString(),
            dateFormatted: new Date().toLocaleString('ko-KR'),
            student: {
                nickname: studentProfile.nickname || "익명 요원",
                school: studentProfile.school || "미지정 학교",
                grade: studentProfile.grade || "중학교",
                classNum: studentProfile.classNum || ""
            },
            pisa: evaluationResult.pisa,
            big6: evaluationResult.big6,
            isSyncedToCloud: false
        };

        // 1. 오프라인 LocalStorage에 무조건 백업
        this.saveToLocal(record);

        // 2. Firebase가 연결되어 있다면 Firestore에 전송
        if (this.isFirebaseReady && this.db) {
            try {
                await this.db.collection("student_assessments").doc(record.id).set(record);
                record.isSyncedToCloud = true;
                this.updateLocalRecordSyncStatus(record.id, true);
                console.log("Cloud Firestore sync success:", record.id);
            } catch (error) {
                console.warn("Cloud sync deferred (stored locally):", error);
            }
        }

        return record;
    }

    saveToLocal(record) {
        try {
            const records = this.getAllLocalRecords();
            records.unshift(record);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
        } catch (e) {
            console.error("Local storage save error", e);
        }
    }

    getAllLocalRecords() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    updateLocalRecordSyncStatus(id, status) {
        const records = this.getAllLocalRecords();
        const target = records.find(r => r.id === id);
        if (target) {
            target.isSyncedToCloud = status;
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
        }
    }

    clearLocalRecords() {
        localStorage.removeItem(this.STORAGE_KEY);
    }

    exportLocalRecordsAsJSON() {
        const records = this.getAllLocalRecords();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(records, null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", `fact_checker_results_${Date.now()}.json`);
        document.body.appendChild(dlAnchor);
        dlAnchor.click();
        dlAnchor.remove();
    }
}

window.storageService = new StorageService();
