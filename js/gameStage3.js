// [게임3] 사진 퍼즐

import { state } from './gameState.js';
import { saveMockRecord } from './gameBoard.js';

const puzzleGrid = document.getElementById('puzzle-grid');
const btnStartS3 = document.getElementById('btn-start-stage3');
const s3TimerEl = document.getElementById('stage3-timer');

const GRID_SIZE = 3; 
const TOTAL_PIECES = GRID_SIZE * GRID_SIZE;

function updateS3Timer() {
    if(!state.s3_active) return;
    s3TimerEl.innerText = ((Date.now() - state.s3_timerStart)/1000).toFixed(2);
    state.s3_timerRaf = requestAnimationFrame(updateS3Timer);
}

function initPuzzleDOM() {
    puzzleGrid.innerHTML = '';
    puzzleGrid.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;

    for(let i=0; i<TOTAL_PIECES; i++) {
        const div = document.createElement('div');
        div.className = 'puzzle-piece rounded-sm';
        div.dataset.index = i;
        div.style.backgroundSize = `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`;
        
        const row = Math.floor(i / GRID_SIZE);
        const col = i % GRID_SIZE;
        const posX = GRID_SIZE > 1 ? (col / (GRID_SIZE - 1)) * 100 : 0;
        const posY = GRID_SIZE > 1 ? (row / (GRID_SIZE - 1)) * 100 : 0;
        div.style.backgroundPosition = `${posX}% ${posY}%`;
        
        div.addEventListener('click', () => handlePuzzleClick(i));
        puzzleGrid.appendChild(div);
    }
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

function checkS3Win() {
    const isWin = state.s3_puzzle.every((val, i) => val === i);
    if(isWin) {
        state.s3_active = false;
        cancelAnimationFrame(state.s3_timerRaf);
        const finalTime = (Date.now() - state.s3_timerStart) / 1000;
        state.s3_time = finalTime;
        
        document.getElementById('puzzle-desc').innerHTML = `<span class="text-red-600 font-bold">완성! 기록: ${finalTime.toFixed(2)}초</span>`;
        
        saveMockRecord('stage3', { name: state.guestName, time: finalTime });
        saveMockRecord('overall', { 
            name: state.guestName, 
            s1_attempts: state.s1_attempts, 
            s2_diff: state.s2_diff, 
            s3_time: finalTime
        });

        setTimeout(() => {
            const modalStory = document.getElementById('modal-story');
            modalStory.classList.remove('hidden');
            setTimeout(() => {
                modalStory.classList.remove('opacity-0');
            }, 50);
        }, 1500); 
    }
}

btnStartS3.addEventListener('click', () => {
    btnStartS3.style.display = 'none';
    state.s3_puzzle = Array.from({length: TOTAL_PIECES}, (_, i) => i);
    state.s3_puzzle.sort(() => Math.random() - 0.5);
    state.s3_selectedIdx = null;
    renderPuzzle();
    
    state.s3_active = true;
    state.s3_timerStart = Date.now();
    updateS3Timer();
});

initPuzzleDOM();