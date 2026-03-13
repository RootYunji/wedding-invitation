// [게임2] 10.31초 맞추기
import { state } from './gameState.js';
import { navigateTo } from './ui.js';

const btnTimerArea = document.getElementById('btn-timer-area'); 
const s2TimerDisplay = document.getElementById('stage2-timer-display');
const s2Msg = document.getElementById('stage2-msg');
const btnPassS2 = document.getElementById('btn-pass-s2');

// 2단계 준비 및 시작
export function startStage2() {
    // 1. 초기 상태 설정 (타이머는 아직 0.00)
    state.s2_active = false; 
    s2TimerDisplay.innerText = "0.00";
    s2TimerDisplay.classList.replace('text-red-600', 'text-zinc-400'); // 시작 전엔 흐릿하게
    s2Msg.innerText = "잠시 후 타이머가 시작됩니다...";
    s2Msg.classList.replace('text-red-600', 'text-zinc-500');

    // 2. 🌟 1초(1000ms) 대기 후 타이머 시작
    setTimeout(() => {
        state.s2_active = true;
        state.s2_timerStart = Date.now();
        
        s2Msg.innerText = "타이머를 터치해서 멈추세요!";
        s2TimerDisplay.classList.replace('text-zinc-400', 'text-red-600'); // 시작하면 진하게
        
        updateS2Timer();
    }, 1000); 
}

function updateS2Timer() {
    if(!state.s2_active) return;
    const elapsed = (Date.now() - state.s2_timerStart) / 1000;
    s2TimerDisplay.innerText = elapsed.toFixed(2);
    state.s2_timerRaf = requestAnimationFrame(updateS2Timer);
}

// 타이머 정지 이벤트
btnTimerArea.addEventListener('click', () => {
    // 아직 시작 안 했거나 이미 멈췄으면 무시
    if(!state.s2_active) return; 
    
    state.s2_active = false;
    cancelAnimationFrame(state.s2_timerRaf);
    
    const finalTime = (Date.now() - state.s2_timerStart) / 1000;
    s2TimerDisplay.innerText = finalTime.toFixed(2);
    
    checkS2State(finalTime);
});

function checkS2State(finalTime) {
    const targetTime = 10.31;
    const diff = Math.abs(finalTime - targetTime);

    state.s2_gap = diff; 
    
    s2Msg.innerText = `성공! 10.31초와의 오차: ${diff.toFixed(2)}초`;
    s2Msg.classList.replace('text-zinc-500', 'text-red-600');
    
    setTimeout(() => {
        navigateTo('stage3');
        // if (typeof startStage3 === 'function') startStage3();
    }, 1500);
}

// 포기 버튼
if (btnPassS2) {
    btnPassS2.addEventListener('click', () => {
        if(!confirm("포기하시면 RANK에서 제외됩니다. 바로 청첩장으로 이동할까요?")) return;

        state.s2_active = false;
        cancelAnimationFrame(state.s2_timerRaf);

        state.guestName = null;
        navigateTo('invitation');
    });
}
