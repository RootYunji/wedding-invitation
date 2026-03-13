// [게임2] 10.31초 맞추기
import { state } from './gameState.js';
import { showScreen } from './ui.js';
import { saveRecord } from './api.js'; // 구글스프레드 전송 API 모듈
// import { startStage3 } from './gameStage3.js'; // 3단계 완성 시 주석 해제

const btnTimerArea = document.getElementById('btn-timer-area'); // 타이머 영역 전체
const s2TimerDisplay = document.getElementById('stage2-timer-display');
const s2Spinner = document.getElementById('stage2-spinner');
const s2Msg = document.getElementById('stage2-msg');
const btnPassS2 = document.getElementById('btn-pass-s2');

// 2단계 시작 (1단계 클리어 시 외부에서 호출됨)
export function startStage2() {
    state.s2_active = true;
    state.s2_timerStart = Date.now();
    
    s2Msg.innerText = "타이머를 터치해서 멈추세요!";
    s2Msg.classList.replace('text-red-600', 'text-zinc-500');
    s2TimerDisplay.classList.replace('text-zinc-400', 'text-red-600'); 
    s2Spinner.classList.remove('hidden');

    updateS2Timer();
}

// 타이머 숫자 업데이트 루프
function updateS2Timer() {
    if(!state.s2_active) return;
    const elapsed = (Date.now() - state.s2_timerStart) / 1000;
    s2TimerDisplay.innerText = elapsed.toFixed(2);
    state.s2_timerRaf = requestAnimationFrame(updateS2Timer);
}

// 타이머 정지 이벤트 바인딩 (영역 터치)
btnTimerArea.addEventListener('click', () => {
    if(!state.s2_active) return; // 이미 멈췄으면 무시
    
    // 타이머 정지
    state.s2_active = false;
    cancelAnimationFrame(state.s2_timerRaf);
    s2Spinner.classList.add('hidden');
    
    const finalTime = (Date.now() - state.s2_timerStart) / 1000;
    s2TimerDisplay.innerText = finalTime.toFixed(2);
    
    checkS2State(finalTime);
});

// 2단계 클리어 및 실패 상태 체크 로직
function checkS2State(finalTime) {
    const targetTime = 10.31;
    const diff = Math.abs(finalTime - targetTime);

    // 실패 (오차가 0.10초 초과)
    if (diff > 0.10) {
        btnTimerArea.classList.add('shake'); // 1단계처럼 틀리면 흔들림 효과
        s2Msg.innerText = `앗, 틀렸습니다😂 오차: ${diff.toFixed(2)}초 (다시 시작!)`;
        s2Msg.classList.replace('text-zinc-500', 'text-red-600');
        s2TimerDisplay.classList.replace('text-red-600', 'text-zinc-400');
        
        // 1.5초 후 재시작
        setTimeout(() => {
            btnTimerArea.classList.remove('shake');
            startStage2(); 
        }, 1500);
        return;
    }

    // 2단계 올클리어 (오차 0.10초 이내)
    s2Msg.innerText = `성공! 10.31초와의 오차: ${diff.toFixed(2)}초`;
    s2Msg.classList.replace('text-zinc-500', 'text-red-600');
    
    // 전역 상태에 2단계 기록 메모리 적재
    state.s2_gap = diff; 
    
    // 1.5초 대기 후 3단계 뷰로 라우팅
    setTimeout(() => {
        showScreen('stage3');
        // startStage3(); // 3단계 모듈이 완성되면 주석 해제하여 자동 시작 연결
    }, 1500);
}

// 패스(건너뛰기) 버튼 클릭 핸들러
if (btnPassS2) {
    btnPassS2.addEventListener('click', () => {
        if(!confirm("포기하시면 RANK에서 제외됩니다. 바로 청첩장으로 이동할까요?")) return;
        
        // 실행 중인 타이머 강제 종료
        state.s2_active = false;
        cancelAnimationFrame(state.s2_timerRaf);
        
        // 패스 페이로드 구성 (1단계 기록은 유지, 나머진 0)
        const passData = {
            name: state.guestName,
            s1_tries: state.s1_tries || 0,
            s2_gap: 0,
            s3_time: 0,
            is_passed: true
        };
        
        // DB 전송 후 곧바로 청첩장 최종 뷰로 라우팅
        saveRecord(passData); 
        showScreen('invitation');
    });
}