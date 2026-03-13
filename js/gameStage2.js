// [게임2] 10.31초 맞추기
import { state } from './gameState.js';
import { showScreen } from './ui.js';
// import { startStage3 } from './gameStage3.js'; // 3단계 완성 시 주석 해제

const btnTimerArea = document.getElementById('btn-timer-area'); 
const s2TimerDisplay = document.getElementById('stage2-timer-display');
const s2Spinner = document.getElementById('stage2-spinner');
const s2Msg = document.getElementById('stage2-msg');
const btnPassS2 = document.getElementById('btn-pass-s2');

// 2단계 시작
export function startStage2() {
    state.s2_active = true;
    state.s2_timerStart = Date.now();
    
    s2Msg.innerText = "타이머를 터치해서 멈추세요!";
    s2Msg.classList.replace('text-red-600', 'text-zinc-500');
    s2TimerDisplay.classList.replace('text-zinc-400', 'text-red-600'); 
    s2Spinner.classList.remove('hidden');

    updateS2Timer();
}

function updateS2Timer() {
    if(!state.s2_active) return;
    const elapsed = (Date.now() - state.s2_timerStart) / 1000;
    s2TimerDisplay.innerText = elapsed.toFixed(2);
    state.s2_timerRaf = requestAnimationFrame(updateS2Timer);
}

btnTimerArea.addEventListener('click', () => {
    if(!state.s2_active) return; 
    
    state.s2_active = false;
    cancelAnimationFrame(state.s2_timerRaf);
    s2Spinner.classList.add('hidden');
    
    const finalTime = (Date.now() - state.s2_timerStart) / 1000;
    s2TimerDisplay.innerText = finalTime.toFixed(2);
    
    checkS2State(finalTime);
});

function checkS2State(finalTime) {
    const targetTime = 10.31;
    const diff = Math.abs(finalTime - targetTime);

    // 실패 (오차 0.1초 초과)
    if (diff > 0.10) {
        btnTimerArea.classList.add('shake');
        s2Msg.innerText = `앗, 틀렸습니다😂 오차: ${diff.toFixed(2)}초 (다시 시작!)`;
        s2Msg.classList.replace('text-zinc-500', 'text-red-600');
        s2TimerDisplay.classList.replace('text-red-600', 'text-zinc-400');
        
        setTimeout(() => {
            btnTimerArea.classList.remove('shake');
            startStage2(); 
        }, 1500);
        return;
    }

    // 2단계 성공
    s2Msg.innerText = `성공! 10.31초와의 오차: ${diff.toFixed(2)}초`;
    s2Msg.classList.replace('text-zinc-500', 'text-red-600');
    
    state.s2_gap = diff; // 결과 메모리에 임시 저장
    
    setTimeout(() => {
        showScreen('stage3');
        // if (typeof startStage3 === 'function') startStage3();
    }, 1500);
}

// 포기 버튼: 데이터 저장 없이 종료
if (btnPassS2) {
    btnPassS2.addEventListener('click', () => {
        if(!confirm("포기하시면 RANK에서 제외됩니다. 바로 청첩장으로 이동할까요?")) return;
        
        state.s2_active = false;
        cancelAnimationFrame(state.s2_timerRaf);
        
        // 데이터 전송(saveRecord) 없이 바로 이동
        showScreen('invitation');
    });
}