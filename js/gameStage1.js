// [게임1] 777 슬롯
import { state } from './gameState.js';
import { showScreen } from './ui.js';
import { saveRecord } from './api.js'; // 구글스프레드 전송 API 모듈

const reelEls = [document.getElementById('reel-1'), document.getElementById('reel-2'), document.getElementById('reel-3')];
const stopBtns = [document.getElementById('btn-stop-1'), document.getElementById('btn-stop-2'), document.getElementById('btn-stop-3')];
const s1AttemptsEl = document.getElementById('stage1-attempts');
const s1MsgEl = document.getElementById('stage1-msg');
const btnPassS1 = document.getElementById('btn-pass-s1');


export function startStage1() {
    state.s1_active = true;
    state.s1_stopped = [false, false, false];
    s1MsgEl.innerText = "숫자를 터치해서 멈추세요!";
    s1MsgEl.classList.replace('text-red-600', 'text-zinc-500');

    // 릴 애니메이션 인터벌 시작
    reelEls.forEach((el, i) => {
        el.parentElement.style.borderColor = '#e5e5e5'; 
        if(state.s1_intervals[i]) clearInterval(state.s1_intervals[i]);
        state.s1_intervals[i] = setInterval(() => {
            state.s1_reels[i] = Math.floor(Math.random() * 9) + 1;
            el.innerText = state.s1_reels[i];
        }, 40 + (i * 15)); 
    });
}

// 릴 정지 이벤트 바인딩
stopBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
        if(!state.s1_active || state.s1_stopped[i]) return;
        
        state.s1_stopped[i] = true;
        clearInterval(state.s1_intervals[i]);
        
        // 80% 확률로 무조건 7 당첨 보정
        if(Math.random() < 0.8) state.s1_reels[i] = 7;
        else state.s1_reels[i] = Math.floor(Math.random() * 9) + 1;
        
        reelEls[i].innerText = state.s1_reels[i];
        btn.style.borderColor = '#dc2626'; 

        checkS1State(i);
    });
});

// 1단계 클리어 및 실패 상태 체크 로직
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

    // 1단계 올클리어 (모두 7로 정지)
    if(state.s1_stopped.every(s => s)) {
        state.s1_active = false;
        s1MsgEl.innerText = `성공! 총 ${state.s1_attempts}회 도전했습니다.`;
        s1MsgEl.classList.replace('text-zinc-500', 'text-red-600');
        
        // 전역 상태에 1단계 기록 메모리 적재 (DB 전송은 나중에)
        state.s1_tries = state.s1_attempts; 
        
        // 1.5초 대기 후 2단계 뷰로 라우팅
        setTimeout(() => showScreen('stage2'), 1500);
    }
}

// 패스(건너뛰기) 버튼 클릭 핸들러
if (btnPassS1) {
    btnPassS1.addEventListener('click', () => {
        if(!confirm("포기하시면 명예의 전당 순위표에서 맨 아래로 밀려납니다. 계속할까요?")) return;
        
        // 실행 중인 애니메이션 및 상태 강제 종료
        state.s1_active = false;
        state.s1_intervals.forEach(interval => clearInterval(interval));
        
        // 패스 페이로드 구성 (점수는 0, is_passed는 true)
        const passData = {
            name: state.guestName,
            s1_tries: 0,
            s2_gap: 0,
            s3_time: 0,
            is_passed: true
        };
        
        // DB 전송 후 곧바로 청첩장 최종 뷰로 라우팅 (비동기 대기 안함)
        saveRecord(passData); 
        showScreen('invitation');
    });
}