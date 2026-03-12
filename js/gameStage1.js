// [게임1] 777 슬롯

import { state } from './gameState.js';
import { showScreen } from './ui.js';
import { saveMockRecord } from './gameBoard.js';

const reelEls = [document.getElementById('reel-1'), document.getElementById('reel-2'), document.getElementById('reel-3')];
const stopBtns = [document.getElementById('btn-stop-1'), document.getElementById('btn-stop-2'), document.getElementById('btn-stop-3')];
const s1AttemptsEl = document.getElementById('stage1-attempts');
const s1MsgEl = document.getElementById('stage1-msg');

export function startStage1() {
    state.s1_active = true;
    state.s1_stopped = [false, false, false];
    s1MsgEl.innerText = "숫자를 터치해서 멈추세요!";
    s1MsgEl.classList.replace('text-red-600', 'text-zinc-500');

    reelEls.forEach((el, i) => {
        el.parentElement.style.borderColor = '#e5e5e5'; 
        if(state.s1_intervals[i]) clearInterval(state.s1_intervals[i]);
        state.s1_intervals[i] = setInterval(() => {
            state.s1_reels[i] = Math.floor(Math.random() * 9) + 1;
            el.innerText = state.s1_reels[i];
        }, 40 + (i * 15)); 
    });
}

stopBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
        if(!state.s1_active || state.s1_stopped[i]) return;
        
        state.s1_stopped[i] = true;
        clearInterval(state.s1_intervals[i]);
        
        if(Math.random() < 0.8) state.s1_reels[i] = 7;
        else state.s1_reels[i] = Math.floor(Math.random() * 9) + 1;
        
        reelEls[i].innerText = state.s1_reels[i];
        btn.style.borderColor = '#dc2626'; 

        checkS1State(i);
    });
});

function checkS1State(lastStoppedIndex) {
    if (state.s1_reels[lastStoppedIndex] !== 7) {
        state.s1_active = false;
        const currentBox = stopBtns[lastStoppedIndex];
        currentBox.classList.add('shake');
        s1MsgEl.innerText = "앗, 7이 아닙니다! 다시 돌아갑니다.";
        s1MsgEl.classList.replace('text-zinc-500', 'text-red-600');
        
        setTimeout(() => {
            currentBox.classList.remove('shake');
            state.s1_attempts++;
            s1AttemptsEl.innerText = state.s1_attempts;
            startStage1(); 
        }, 800);
        return;
    }

    if(state.s1_stopped.every(s => s)) {
        state.s1_active = false;
        s1MsgEl.innerText = `성공! 총 ${state.s1_attempts}회 도전했습니다.`;
        s1MsgEl.classList.replace('text-zinc-500', 'text-red-600');
        
        saveMockRecord('stage1', { name: state.guestName, attempts: state.s1_attempts });
        setTimeout(() => showScreen('stage2'), 1500); 
    }
}