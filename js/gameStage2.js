// [게임2] 10.31 시간 맞추기

import { state } from './gameState.js';
import { showScreen } from './ui.js';
import { saveMockRecord } from './gameBoard.js';

const btnActionS2 = document.getElementById('btn-action-stage2');
const s2TimerDisplay = document.getElementById('stage2-timer-display');
const s2Spinner = document.getElementById('stage2-spinner');
const s2Msg = document.getElementById('stage2-msg');

function updateS2Timer() {
    if(!state.s2_active) return;
    const elapsed = (Date.now() - state.s2_timerStart) / 1000;
    s2TimerDisplay.innerText = elapsed.toFixed(2);
    state.s2_timerRaf = requestAnimationFrame(updateS2Timer);
}

btnActionS2.addEventListener('click', () => {
    if(!state.s2_active) {
        state.s2_active = true;
        state.s2_timerStart = Date.now();
        
        btnActionS2.innerText = "STOP";
        btnActionS2.classList.replace('bg-zinc-900', 'bg-red-600');
        s2Spinner.classList.remove('hidden');
        s2Msg.innerHTML = "";
        
        updateS2Timer();
    } else {
        state.s2_active = false;
        cancelAnimationFrame(state.s2_timerRaf);
        
        const finalTime = (Date.now() - state.s2_timerStart) / 1000;
        s2TimerDisplay.innerText = finalTime.toFixed(2);
        
        btnActionS2.classList.replace('bg-red-600', 'bg-zinc-200');
        btnActionS2.classList.replace('text-white', 'text-zinc-400');
        btnActionS2.disabled = true;
        s2Spinner.classList.add('hidden');

        const diff = Math.abs(finalTime - 10.31);
        state.s2_diff = diff;
        
        s2Msg.innerHTML = `<span class="text-zinc-500">10.31초와의 오차:</span><br><strong class="text-red-600 text-lg">${diff.toFixed(2)}초!</strong><br><span class="text-xs text-zinc-400 mt-1">다음 단계로 이동합니다.</span>`;
        
        saveMockRecord('stage2', { name: state.guestName, diff: diff });
        setTimeout(() => showScreen('stage3'), 2500); 
    }
});