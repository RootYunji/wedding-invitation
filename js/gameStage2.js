// [게임2] 10.31초 맞추기
import { state } from './gameState.js';
import { showScreen } from './ui.js';
// import { startStage3 } from './gameStage3.js'; 

const btnTimerArea = document.getElementById('btn-timer-area'); 
const s2TimerDisplay = document.getElementById('stage2-timer-display');
const s2Msg = document.getElementById('stage2-msg');
const btnPassS2 = document.getElementById('btn-pass-s2');

// 2단계 시작
export function startStage2() {
    state.s2_active = true;
    state.s2_timerStart = Date.now();
    
    s2Msg.innerText = "타이머를 터치해서 멈추세요!";
    s2Msg.classList.replace('text-red-600', 'text-zinc-500');
    s2TimerDisplay.classList.replace('text-zinc-400', 'text-red-600'); 

    updateS2Timer();
}

function updateS2Timer() {
    if(!state.s2_active) return;
    const elapsed = (Date.now() - state.s2_timerStart) / 1000;
    s2TimerDisplay.innerText = elapsed.toFixed(2);
    state.s2_timerRaf = requestAnimationFrame(updateS2Timer);
}

// 타이머 정지 이벤트
btnTimerArea.addEventListener('click', () => {
    if(!state.s2_active) return; 
    
    state.s2_active = false;
    cancelAnimationFrame(state.s2_timerRaf);
    
    const finalTime = (Date.now() - state.s2_timerStart) / 1000;
    s2TimerDisplay.innerText = finalTime.toFixed(2);
    
    checkS2State(finalTime);
});

// 2단계 결과 체크 (무조건 통과)
function checkS2State(finalTime) {
    const targetTime = 10.31;
    const diff = Math.abs(finalTime - targetTime);

    // 기록 저장
    state.s2_gap = diff; 
    
    // 결과 메시지 한 줄로 표시
    s2Msg.innerText = `성공! 10.31초와의 오차: ${diff.toFixed(2)}초`;
    s2Msg.classList.replace('text-zinc-500', 'text-red-600');
    
    // 1.5초 후 3단계로 이동
    setTimeout(() => {
        showScreen('stage3');
        // if (typeof startStage3 === 'function') startStage3();
    }, 1500);
}

// 포기 버튼
if (btnPassS2) {
    btnPassS2.addEventListener('click', () => {
        if(!confirm("포기시 RANK에서 제외됩니다. 바로 청첩장으로 이동할까요?")) return;
        state.s2_active = false;
        cancelAnimationFrame(state.s2_timerRaf);
        showScreen('invitation');
    });
}