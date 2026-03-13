// [게임3] 사진 퍼즐 (3x3)
import { state } from './gameState.js';
import { saveRecord } from './api.js'; 
import { navigateTo } from './ui.js'; 

const puzzleGrid = document.getElementById('puzzle-grid');
const s3TimerEl = document.getElementById('stage3-timer');
const s3MsgEl = document.getElementById('stage3-msg');
const btnPassS3 = document.getElementById('btn-pass-s3');

const GRID_SIZE = 3; 
const TOTAL_PIECES = GRID_SIZE * GRID_SIZE; 

// 🌟 퍼즐로 쓸 로컬 웨딩 사진 경로를 여기에 입력하세요!
// (HTML의 <link rel="preload">에 있는 그 경로와 맞추시면 됩니다)
const PUZZLE_IMAGE_PATH = './assets/images/game/puzzle.png'; 

export function initPuzzleDOM() {
    puzzleGrid.innerHTML = '';
    puzzleGrid.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;

    // 시작 전 초기 셋업 (타이머 숨김, 상태 초기화)
    state.s3_active = false;
    state.s3_started = false; // 새로 추가: 섞기 전/후 판별
    s3TimerEl.classList.add('hidden'); // 타이머 숨김
    s3MsgEl.innerText = "사진을 터치하면 퍼즐이 섞이고 시작됩니다!";

    for(let i=0; i<TOTAL_PIECES; i++) {
        const div = document.createElement('div');
        div.className = 'puzzle-piece rounded-sm relative';
        div.dataset.index = i; 
        
        // 🌟 로컬 이미지 적용
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
}

function updateS3Timer() {
    if(!state.s3_active) return;
    s3TimerEl.innerText = ((Date.now() - state.s3_timerStart)/1000).toFixed(2);
    state.s3_timerRaf = requestAnimationFrame(updateS3Timer);
}

function renderPuzzle() {
    const children = Array.from(puzzleGrid.children);
    state.s3_puzzle.forEach((val, visualIndex) => {
        const el = children.find(c => parseInt(c.dataset.index) === val);
        puzzleGrid.appendChild(el);
        
        if(visualIndex === state.s3_selectedIdx) el.classList.add('selected');
        else el.classList.remove('selected');
    });
}

function handlePuzzleClick(originalVal) {
    // 🌟 [최초 클릭 감지] 아직 섞기 전이라면, 퍼즐을 섞고 게임을 시작합니다!
    if (!state.s3_started) {
        startPuzzleGame();
        return;
    }

    // 이미 시작된 상태라면 정상적인 자리 바꾸기 로직 수행
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

// 🌟 퍼즐 섞기 & 타이머 시작 함수
function startPuzzleGame() {
    state.s3_started = true;
    
    // 무작위로 섞기
    state.s3_puzzle.sort(() => Math.random() - 0.5);
    state.s3_selectedIdx = null;
    renderPuzzle();
    
    // 타이머 등장 및 시작
    state.s3_active = true;
    state.s3_timerStart = Date.now();
    s3TimerEl.classList.remove('hidden'); 
    s3TimerEl.classList.replace('text-zinc-600', 'text-red-600'); 
    s3MsgEl.innerText = "두 조각을 차례로 터치해 자리를 바꾸세요!";
    
    updateS3Timer();
}

function checkS3Win() {
    const isWin = state.s3_puzzle.every((val, i) => val === i);
    
    if(isWin) {
        state.s3_active = false;
        cancelAnimationFrame(state.s3_timerRaf);
        const finalTime = (Date.now() - state.s3_timerStart) / 1000;
        state.s3_time = finalTime; 
        
        s3MsgEl.innerHTML = `완성! 기록: <strong class="text-red-600">${finalTime.toFixed(2)}초</strong>`;
        
        // 🌟 최종 기록 싹 모아서 API 전송!
        const finalData = {
            name: state.guestName,
            s1_tries: state.s1_tries,
            s2_gap: state.s2_gap,
            s3_time: state.s3_time,
            is_passed: false 
        };
        saveRecord(finalData); 

        // 1.5초 후 엔딩 모달 띄우기
        setTimeout(() => {
            const modalStory = document.getElementById('modal-story');
            modalStory.classList.remove('hidden');
            setTimeout(() => {
                modalStory.classList.remove('opacity-0');
            }, 50);
        }, 1500); 
    }
}

if (btnPassS3) {
    btnPassS3.addEventListener('click', () => {
        if(!confirm("포기하시면 RANK에서 제외됩니다. 바로 청첩장으로 이동할까요?")) return;

        state.s3_active = false;
        cancelAnimationFrame(state.s3_timerRaf);

        state.guestName = null;
        navigateTo('invitation');
    });
}

// 화면 진입 시 초기화 
initPuzzleDOM();