// [게임1] 777 슬롯
import { state } from './gameState.js';
import { showScreen } from './ui.js';
import { startStage2 } from './gameStage2.js';

const reelEls = [document.getElementById('reel-1'), document.getElementById('reel-2'), document.getElementById('reel-3')];
const stopBtns = [document.getElementById('btn-stop-1'), document.getElementById('btn-stop-2'), document.getElementById('btn-stop-3')];
const s1AttemptsEl = document.getElementById('stage1-attempts');
const s1MsgEl = document.getElementById('stage1-msg');
const btnPassS1 = document.getElementById('btn-pass-s1');

// 최초 시작 (전체 게임 리셋 시)
export function initStage1() {
    state.s1_attempts = 1; // 여기서만 1로 초기화
    startStage1();
}

// 릴 회전 시작 (실패 후 재시작 시 호출)
export function startStage1() {
    state.s1_active = true; 
    state.s1_stopped = [false, false, false];
    s1AttemptsEl.innerText = state.s1_attempts; // 현재 누적 횟수 표시
    
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
        // state.s1_active가 false면 터치 자체가 안 먹힘 (정적 시간 보장)
        if(!state.s1_active || state.s1_stopped[i]) return;
        
        state.s1_stopped[i] = true;
        clearInterval(state.s1_intervals[i]);
        
        if(Math.random() < 0.7) state.s1_reels[i] = 7;
        else state.s1_reels[i] = Math.floor(Math.random() * 9) + 1;
        
        reelEls[i].innerText = state.s1_reels[i];
        checkS1State(i);
    });
});

function checkS1State(lastStoppedIndex) {
    if (state.s1_reels[lastStoppedIndex] !== 7) {
        // 🌟 실패 즉시 조작 차단
        state.s1_active = false; 
        state.s1_intervals.forEach(clearInterval); // 나머지 릴도 정지(선택사항)

        const currentBox = stopBtns[lastStoppedIndex];
        currentBox.classList.add('shake');
        s1MsgEl.innerText = "앗, 틀렸습니다😂 다시 시작!";
        s1MsgEl.classList.replace('text-zinc-500', 'text-red-600');
        
        // 🌟 1초(1000ms) 동안 정적 유지 후 재시작
        setTimeout(() => {
            currentBox.classList.remove('shake');
            state.s1_attempts++; // 횟수 누적
            startStage1(); 
        }, 1000); 
        return;
    }

    if(state.s1_stopped.every(s => s)) {
        state.s1_active = false;
        s1MsgEl.innerText = `성공! 총 ${state.s1_attempts}회 도전했습니다.`;
        s1MsgEl.classList.replace('text-zinc-500', 'text-red-600');
        
        state.s1_tries = state.s1_attempts; // 최종 결과값 저장
        
        setTimeout(() => {
            showScreen('stage2');
            startStage2(); 
        }, 1500);
    }
}

// 포기 버튼 (생략)