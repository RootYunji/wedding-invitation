// [게임1] 777 슬롯
import { state } from './gameState.js';
import { showScreen } from './ui.js';
// 🌟 이제 1단계에서는 saveRecord가 필요 없습니다. (마지막 3단계에서 한꺼번에 전송)
// import { saveRecord } from './api.js'; 
import { startStage2 } from './gameStage2.js'; // 2단계 시작 함수 가져오기

const reelEls = [document.getElementById('reel-1'), document.getElementById('reel-2'), document.getElementById('reel-3')];
const stopBtns = [document.getElementById('btn-stop-1'), document.getElementById('btn-stop-2'), document.getElementById('btn-stop-3')];
const s1AttemptsEl = document.getElementById('stage1-attempts');
const s1MsgEl = document.getElementById('stage1-msg');
const btnPassS1 = document.getElementById('btn-pass-s1');

export function startStage1() {
    state.s1_active = true;
    state.s1_stopped = [false, false, false];
    state.s1_attempts = 1; // 🌟 시작할 때 시도 횟수 초기화
    s1AttemptsEl.innerText = state.s1_attempts;
    s1MsgEl.innerText = "숫자를 터치해서 멈추세요!";
    s1MsgEl.classList.replace('text-red-600', 'text-zinc-500');

    reelEls.forEach((el, i) => {
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
        
        // 70% 확률로 7 보정
        if(Math.random() < 0.7) state.s1_reels[i] = 7;
        else state.s1_reels[i] = Math.floor(Math.random() * 9) + 1;
        
        reelEls[i].innerText = state.s1_reels[i];
        checkS1State(i);
    });
});

function checkS1State(lastStoppedIndex) {
    if (state.s1_reels[lastStoppedIndex] !== 7) {
        state.s1_active = false;
        const currentBox = stopBtns[lastStoppedIndex];
        currentBox.classList.add('shake');
        s1MsgEl.innerText = "앗, 틀렸습니다😂 다시 시작!";
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
        
        state.s1_tries = state.s1_attempts; 
        
        setTimeout(() => {
            showScreen('stage2');
            startStage2(); // 🌟 2단계 화면 보여주고 타이머 바로 작동 시작
        }, 1500);
    }
}

// 🗑 포기 버튼 로직: 저장 없이 화면만 이동
if (btnPassS1) {
    btnPassS1.addEventListener('click', () => {
        if(!confirm("포기시 RANK에서 제외됩니다. 바로 청첩장으로 이동할까요?")) return;
        
        state.s1_active = false;
        state.s1_intervals.forEach(clearInterval);
        
        // 🌟 저장 로직 삭제! 그냥 바로 이동
        showScreen('invitation');
    });
}