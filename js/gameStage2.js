// [게임2] 10.31초 맞추기
import { state } from './gameState.js';
import { navigateTo } from './ui.js';

const btnTimerArea = document.getElementById('btn-timer-area'); 
const s2TimerDisplay = document.getElementById('stage2-timer-display');
const s2Msg = document.getElementById('stage2-msg');
const btnPassS2 = document.getElementById('btn-pass-s2');
const s2RecordDisplay = document.getElementById('stage2-record'); // 상단 오차 표시 영역

const TARGET_TIME = 10.31; // 목표 시간

export function startStage2() {
    state.s2_active = false; 
    s2TimerDisplay.innerText = "0.00";
    s2TimerDisplay.classList.replace('text-red-600', 'text-zinc-400');
    
    // 시작 전 상단 오차율 초기화
    if(s2RecordDisplay) s2RecordDisplay.innerText = "10.31"; 

    s2Msg.innerText = "잠시 후 타이머가 시작됩니다...";
    s2Msg.classList.replace('text-red-600', 'text-zinc-500');

    setTimeout(() => {
        state.s2_active = true;
        state.s2_timerStart = Date.now();
        
        s2Msg.innerText = "타이머를 터치해서 멈추세요!";
        s2TimerDisplay.classList.replace('text-zinc-400', 'text-red-600'); 
        
        updateS2Timer();
    }, 1000); 
}

function updateS2Timer() {
    if(!state.s2_active) return;
    
    // 1. 가운데 실시간 타이머 계산
    const elapsed = (Date.now() - state.s2_timerStart) / 1000;
    s2TimerDisplay.innerText = elapsed.toFixed(2);
    
    // 2. 🌟 상단 실시간 오차율 계산 (10.31 - 현재시간의 절대값)
    const currentDiff = Math.abs(elapsed - TARGET_TIME);
    if(s2RecordDisplay) s2RecordDisplay.innerText = currentDiff.toFixed(2);

    state.s2_timerRaf = requestAnimationFrame(updateS2Timer);
}

btnTimerArea.addEventListener('click', () => {
    if(!state.s2_active) return; 
    
    state.s2_active = false;
    cancelAnimationFrame(state.s2_timerRaf);
    
    // 최종 멈춘 시간 및 오차 확정
    const finalTime = (Date.now() - state.s2_timerStart) / 1000;
    const finalDiff = Math.abs(finalTime - TARGET_TIME);
    
    s2TimerDisplay.innerText = finalTime.toFixed(2);
    if(s2RecordDisplay) s2RecordDisplay.innerText = finalDiff.toFixed(2);
    
    checkS2State(finalDiff);
});

function checkS2State(finalDiff) {
    state.s2_gap = finalDiff; 
    
    // 🌟 하단에 최종 성공 기록 표시
    s2Msg.innerHTML = `성공! 10.31초와의 최종 오차: <strong class="text-red-600">${finalDiff.toFixed(2)}초</strong>`;
    s2Msg.classList.replace('text-zinc-500', 'text-zinc-800');
    
    setTimeout(() => {
        navigateTo('stage3');
    }, 1500);
}

// 포기 버튼 (이름 지우기 포함)
if (btnPassS2) {
    btnPassS2.addEventListener('click', () => {
        if(!confirm("포기하시면 RANK에서 제외됩니다. 바로 청첩장으로 이동할까요?")) return;
        state.s2_active = false;
        cancelAnimationFrame(state.s2_timerRaf);
        state.guestName = null;
        navigateTo('invitation');
    });
}