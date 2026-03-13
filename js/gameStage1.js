// [게임1] 777 슬롯
import { state } from './gameState.js';
import { navigateTo } from './ui.js';
import { startStage2 } from './gameStage2.js';

const reelEls = [document.getElementById('reel-1'), document.getElementById('reel-2'), document.getElementById('reel-3')];
const stopBtns = [document.getElementById('btn-stop-1'), document.getElementById('btn-stop-2'), document.getElementById('btn-stop-3')];
const s1AttemptsEl = document.getElementById('stage1-attempts');
const s1MsgEl = document.getElementById('stage1-msg');
const btnPassS1 = document.getElementById('btn-pass-s1');

// 🌟 [업데이트] 방치 타이머 변수 및 30초 초기화 로직 추가
let idleTimer = null; 

function resetIdleTimer() {
    clearTimeout(idleTimer);
    if (!state.s1_active) return; 
    idleTimer = setTimeout(() => {
        alert("시간이 초과되어 스테이지가 초기화됩니다.");
        initStage1(); 
    }, 30000); 
}

// 🌟 [업데이트] 화면 이탈 시 호출될 리소스 정리 함수 추가
export function cleanupStage1() {
    clearTimeout(idleTimer);
    if (state.s1_intervals) state.s1_intervals.forEach(clearInterval);
    state.s1_active = false;
}

// 최초 시작 (전체 게임 리셋 시 - 대기 상태로 세팅)
export function initStage1() {
    cleanupStage1(); // 🌟 [업데이트] 혹시 모를 기존 타이머 정리
    
    state.s1_active = true; 
    state.s1_spinning = false; // 🌟 [업데이트] 롤러 회전 여부 상태 추가
    state.s1_stopped = [false, false, false];
    state.s1_attempts = 1; 
    s1AttemptsEl.innerText = state.s1_attempts; 
    
    // 🌟 [업데이트] 시작 전 안내 문구 변경 및 롤러 기본값 세팅
    s1MsgEl.innerText = "아무 버튼이나 눌러서 슬롯을 회전시키세요!";
    s1MsgEl.classList.replace('text-red-600', 'text-zinc-500');
    reelEls.forEach(el => el.innerText = "7");

    resetIdleTimer(); // 🌟 [업데이트] 방치 타이머 시작
}

// 릴 회전 시작 (첫 터치 또는 실패 후 재시작 시 호출)
export function startStage1() {
    state.s1_spinning = true; // 🌟 [업데이트] 회전 중 상태로 변경
    state.s1_stopped = [false, false, false]; // 🌟 [업데이트] 실패 후 재시작을 위해 배열 초기화
    
    s1MsgEl.innerText = "숫자를 터치해서 멈추세요!";
    s1MsgEl.classList.replace('text-red-600', 'text-zinc-500');

    reelEls.forEach((el, i) => {
        if(state.s1_intervals[i]) clearInterval(state.s1_intervals[i]);
        state.s1_intervals[i] = setInterval(() => {
            state.s1_reels[i] = Math.floor(Math.random() * 9) + 1;
            el.innerText = state.s1_reels[i];
        }, 40 + (i * 15)); 
    });
    
    resetIdleTimer(); // 🌟 [업데이트] 
}

stopBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
        if(!state.s1_active || state.s1_stopped[i]) return;
        resetIdleTimer(); // 🌟 [업데이트] 터치 시 방치 타이머 리셋
        
        // 🌟 [업데이트] 첫 터치 시 멈추지 않고 롤러 회전만 시작
        if (!state.s1_spinning) {
            startStage1();
            return;
        }
        
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
        state.s1_spinning = false; // 🌟 [업데이트] 상태 플래그 변경 (active는 유지)
        state.s1_intervals.forEach(clearInterval); 

        const currentBox = stopBtns[lastStoppedIndex];
        currentBox.classList.add('shake');
        s1MsgEl.innerText = "앗, 틀렸습니다😂 다시 시작!";
        s1MsgEl.classList.replace('text-zinc-500', 'text-red-600');
        
        setTimeout(() => {
            currentBox.classList.remove('shake');
            state.s1_attempts++; 
            s1AttemptsEl.innerText = state.s1_attempts; // 🌟 [업데이트] 시도 횟수 화면 갱신 추가
            startStage1(); 
        }, 1000); 
        return;
    }

    if(state.s1_stopped.every(s => s)) {
        cleanupStage1(); // 🌟 [업데이트] 게임 끝났으니 리소스 정리
        
        s1MsgEl.innerText = `성공! 총 ${state.s1_attempts}회 도전했습니다.`;
        s1MsgEl.classList.replace('text-zinc-500', 'text-red-600');
        
        state.s1_tries = state.s1_attempts; 
        
        setTimeout(() => {
            navigateTo('stage2', true); // 🌟 [업데이트] 히스토리 덮어쓰기 적용
            startStage2(); 
        }, 1500);
    }
}

// 포기 버튼 
if (btnPassS1) {
    btnPassS1.addEventListener('click', () => {
        if(!confirm("포기시 RANK에서 제외됩니다. 바로 청첩장으로 이동할까요?")) return;
        
        cleanupStage1(); // 🌟 [업데이트] 직접 끄는 대신 함수 사용
        state.guestName = null;
        navigateTo('invitation', true); // 🌟 [업데이트] 히스토리 덮어쓰기 적용
    });
}