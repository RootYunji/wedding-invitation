// [게임2] 10.31초 맞추기
import { state } from './gameState.js';
import { navigateTo } from './ui.js';

const btnTimerArea = document.getElementById('btn-timer-area'); 
const s2TimerDisplay = document.getElementById('stage2-timer-display');
const s2Msg = document.getElementById('stage2-msg');
const btnPassS2 = document.getElementById('btn-pass-s2');
const s2RecordDisplay = document.getElementById('stage2-record'); 

const TARGET_TIME = 10.31; 

// 🌟 [업데이트] 방치 타이머 변수 추가
let idleTimer = null; 

// 🌟 [업데이트] 30초 방치 시 초기화 로직
function resetIdleTimer() {
    clearTimeout(idleTimer);
    if (state.s2_completed) return; // 이미 성공해서 끝난 상태면 작동 안 함
    idleTimer = setTimeout(() => {
        alert("시간이 초과되어 스테이지가 초기화됩니다.");
        initStage2(); 
    }, 360000); // 30초
}

// 🌟 [업데이트] 화면 이탈 시 호출될 리소스 정리 함수
export function cleanupStage2() {
    clearTimeout(idleTimer);
    cancelAnimationFrame(state.s2_timerRaf);
    state.s2_active = false;
}

// 🌟 [업데이트] 기존 startStage2를 initStage2로 변경 및 수동 시작(대기) 상태로 세팅
export function initStage2() {
    cleanupStage2(); // 혹시 모를 기존 타이머 정리
    state.s2_completed = false; // 완료 여부 플래그
    
    s2TimerDisplay.innerText = "0.00";
    s2TimerDisplay.classList.replace('text-red-600', 'text-zinc-400');
    
    if(s2RecordDisplay) s2RecordDisplay.innerText = "10.31"; 

    // 🌟 [업데이트] 자동 시작 대신 안내 문구 변경
    s2Msg.innerText = "타이머를 터치해서 시작해보세요!";
    s2Msg.classList.replace('text-red-600', 'text-zinc-500');

    resetIdleTimer(); // 🌟 [업데이트] 대기 상태에서도 30초 방치 타이머 작동
}

// (실시간 타이머 계산 로직은 기존과 100% 동일하게 유지)
function updateS2Timer() {
    if(!state.s2_active) return;
    
    const elapsed = (Date.now() - state.s2_timerStart) / 1000;
    s2TimerDisplay.innerText = elapsed.toFixed(2);
    
    const currentDiff = Math.abs(elapsed - TARGET_TIME);
    if(s2RecordDisplay) s2RecordDisplay.innerText = currentDiff.toFixed(2);

    state.s2_timerRaf = requestAnimationFrame(updateS2Timer);
}

btnTimerArea.addEventListener('click', () => {
    if (state.s2_completed) return; // 이미 끝났으면 반응 안 함
    resetIdleTimer(); // 🌟 [업데이트] 터치 시 방치 타이머 리셋
    
    // 🌟 [업데이트] 첫 번째 터치 시: 타이머 시작!
    if(!state.s2_active) {
        state.s2_active = true;
        state.s2_timerStart = Date.now();
        
        s2Msg.innerText = "타이머를 터치해서 멈추세요!";
        s2TimerDisplay.classList.replace('text-zinc-400', 'text-red-600'); 
        
        updateS2Timer();
        return; // 시작했으니 이번 클릭 이벤트는 여기서 종료
    }
    
    // 🌟 [업데이트] 두 번째 터치 시: 정지 및 결과 확정
    state.s2_active = false;
    state.s2_completed = true;
    cancelAnimationFrame(state.s2_timerRaf);
    clearTimeout(idleTimer); // 게임이 끝났으므로 방치 타이머도 완전히 끔
    
    const finalTime = (Date.now() - state.s2_timerStart) / 1000;
    const finalDiff = Math.abs(finalTime - TARGET_TIME);
    
    s2TimerDisplay.innerText = finalTime.toFixed(2);
    if(s2RecordDisplay) s2RecordDisplay.innerText = finalDiff.toFixed(2);
    
    checkS2State(finalDiff);
});

function checkS2State(finalDiff) {
    state.s2_gap = finalDiff; 
    
    s2Msg.innerHTML = `성공! 10.31초와의 최종 오차: <strong class="text-red-600">${finalDiff.toFixed(2)}초</strong>`;
    s2Msg.classList.replace('text-zinc-500', 'text-zinc-800');
    
    setTimeout(() => {
        cleanupStage2();
        navigateTo('stage3', true); // 🌟 [업데이트] 히스토리 덮어쓰기 적용
    }, 1500);
}

// 포기 버튼
if (btnPassS2) {
    btnPassS2.addEventListener('click', () => {
        if(!confirm("포기시 RANK에서 제외됩니다. \n바로 청첩장으로 이동할까요?")) return;
        
        cleanupStage2(); // 🌟 [업데이트] 직접 끄는 대신 cleanup 함수 사용
        state.guestName = null;
        navigateTo('invitation', true); // 🌟 [업데이트] 히스토리 덮어쓰기 적용
    });
}