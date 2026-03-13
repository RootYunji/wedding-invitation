// [게임3] 사진 퍼즐 (3x3)
import { state } from './gameState.js';
import { saveRecord } from './api.js'; 
import { navigateTo } from './ui.js'; 

const puzzleGrid = document.getElementById('puzzle-grid');
const s3TimerEl = document.getElementById('stage3-timer'); // 상단 실시간 소요시간 영역
const s3MsgEl = document.getElementById('stage3-msg');
const btnPassS3 = document.getElementById('btn-pass-s3');

const GRID_SIZE = 3; 
const TOTAL_PIECES = GRID_SIZE * GRID_SIZE; 
const PUZZLE_IMAGE_PATH = './assets/images/game/puzzle.png'; 

// 🌟 [업데이트] 방치 타이머 변수 추가
let idleTimer = null;

// 🌟 [업데이트] 30초 방치 시 초기화 로직
function resetIdleTimer() {
    clearTimeout(idleTimer);
    if (state.s3_completed) return; // 이미 성공했으면 작동 안 함
    idleTimer = setTimeout(() => {
        alert("시간이 초과되어 스테이지가 초기화됩니다.");
        initStage3(); 
    }, 360000); // 30초
}

// 🌟 [업데이트] 화면 이탈 시 호출될 리소스 정리 함수
export function cleanupStage3() {
    clearTimeout(idleTimer);
    cancelAnimationFrame(state.s3_timerRaf);
    state.s3_active = false;
}

// 🌟 [업데이트] 함수명을 main.js 구조에 맞게 initStage3으로 변경
export function initStage3() {
    cleanupStage3(); // 🌟 [업데이트] 혹시 모를 기존 타이머 정리
    
    puzzleGrid.innerHTML = '';
    puzzleGrid.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;

    state.s3_active = false;
    state.s3_started = false; 
    state.s3_completed = false; // 🌟 [업데이트] 완료 플래그 추가
    
    if(s3TimerEl) {
        s3TimerEl.innerText = "0.00";
        s3TimerEl.classList.replace('text-red-600', 'text-zinc-400');
    }
    
    s3MsgEl.innerText = "사진을 터치하면 퍼즐이 섞이고 시작됩니다!";
    s3MsgEl.classList.replace('text-red-600', 'text-zinc-500');

    for(let i=0; i<TOTAL_PIECES; i++) {
        const div = document.createElement('div');
        div.className = 'puzzle-piece relative border-none'; 
        div.dataset.index = i; 
        div.style.backgroundImage = `url('${PUZZLE_IMAGE_PATH}')`;
        div.style.backgroundSize = `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`;
        
        const row = Math.floor(i / GRID_SIZE);
        const col = i % GRID_SIZE;
        const posX = GRID_SIZE > 1 ? (col / (GRID_SIZE - 1)) * 100 : 0;
        const posY = GRID_SIZE > 1 ? (row / (GRID_SIZE - 1)) * 100 : 0;
        
        div.style.backgroundPosition = `${posX}% ${posY}%`;
        div.addEventListener('click', () => handlePuzzleClick(i));
        puzzleGrid.appendChild(div);
    }
    
    state.s3_puzzle = Array.from({length: TOTAL_PIECES}, (_, i) => i);
    resetIdleTimer(); // 🌟 [업데이트] 대기 상태에서도 방치 타이머 작동
}

function updateS3Timer() {
    if(!state.s3_active) return;
    
    // 🌟 상단 span에 실시간 소요 시간 표시
    const elapsed = (Date.now() - state.s3_timerStart) / 1000;
    s3TimerEl.innerText = elapsed.toFixed(2); 
    
    state.s3_timerRaf = requestAnimationFrame(updateS3Timer);
}

function renderPuzzle() {
    const children = Array.from(puzzleGrid.children);
    state.s3_puzzle.forEach((val, visualIndex) => {
        const el = children.find(c => parseInt(c.dataset.index) === val);
        puzzleGrid.appendChild(el);
        
        if(visualIndex === state.s3_selectedIdx) {
            el.classList.add('selected');
            el.style.zIndex = '10';
            el.style.border = '2px solid #dc2626';
            el.style.transform = 'scale(0.95)';
        } else {
            el.classList.remove('selected');
            el.style.zIndex = '1';
            el.style.border = 'none';
            el.style.transform = 'scale(1)';
        }
    });
}

function handlePuzzleClick(originalVal) {
    if (state.s3_completed) return; // 🌟 [업데이트] 완료되었으면 무시
    resetIdleTimer(); // 🌟 [업데이트] 터치 시 방치 타이머 리셋

    if (!state.s3_started) {
        startPuzzleGame();
        return;
    }

    if(!state.s3_active) return; 
    
    const visualIdx = state.s3_puzzle.indexOf(originalVal);

    if(state.s3_selectedIdx === null) {
        state.s3_selectedIdx = visualIdx;
        renderPuzzle();
    } else {
        if(state.s3_selectedIdx !== visualIdx) {
            const temp = state.s3_puzzle[state.s3_selectedIdx];
            state.s3_puzzle[state.s3_selectedIdx] = state.s3_puzzle[visualIdx];
            state.s3_puzzle[visualIdx] = temp;
        }
        state.s3_selectedIdx = null; 
        renderPuzzle();
        checkS3Win(); 
    }
}

function startPuzzleGame() {
    state.s3_started = true;
    state.s3_puzzle.sort(() => Math.random() - 0.5);
    state.s3_selectedIdx = null;
    renderPuzzle();
    
    state.s3_active = true;
    state.s3_timerStart = Date.now();
    
    s3TimerEl.classList.replace('text-zinc-400', 'text-red-600'); 
    s3MsgEl.innerText = "두 조각을 차례로 터치해 자리를 바꾸세요!";
    
    updateS3Timer();
}

function checkS3Win() {
    const isWin = state.s3_puzzle.every((val, i) => val === i);
    
    if(isWin) {
        cleanupStage3(); // 🌟 [업데이트] 타이머 완벽하게 끄기
        state.s3_completed = true; // 🌟 [업데이트] 플래그 변경
        
        // 최종 소요 시간 확정
        const finalTime = (Date.now() - state.s3_timerStart) / 1000;
        state.s3_time = finalTime; 
        s3TimerEl.innerText = finalTime.toFixed(2);
        
        // 🌟 하단에 최종 성공 기록 표시
        s3MsgEl.innerHTML = `성공! 최종 소요 시간: <strong class="text-red-600">${finalTime.toFixed(2)}초</strong>`;
        s3MsgEl.classList.replace('text-red-600', 'text-zinc-800');
        
        const finalData = {
            name: state.guestName,
            s1_tries: state.s1_tries,
            s2_gap: state.s2_gap,
            s3_time: state.s3_time,
            is_passed: false 
        };
        saveRecord(finalData); 

        setTimeout(() => {
            const modalStory = document.getElementById('modal-story');
            if(modalStory) {
                modalStory.classList.remove('hidden');
                setTimeout(() => {
                    modalStory.classList.remove('opacity-0');
                }, 50);
            }
        }, 1500); 
    }
}

if (btnPassS3) {
    btnPassS3.addEventListener('click', () => {
        if(!confirm("포기시 RANK에서 제외됩니다. \n바로 청첩장으로 이동할까요?")) return;
        
        cleanupStage3(); // 🌟 [업데이트] 함수 사용으로 통일
        state.guestName = null;
        navigateTo('invitation', true); // 🌟 [업데이트] 히스토리 덮어쓰기
    });
}

// 🌟 [업데이트] 함수 이름 변경 반영
initStage3();