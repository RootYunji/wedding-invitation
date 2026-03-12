// js/main.js

// 작성해둔 모듈들을 불러옵니다. (확장자 .js 생략 금지)
import { state } from './gameState.js';
import { showScreen } from './ui.js';
import { startStage1 } from './gameStage1.js';
import './gameStage2.js'; 
import './gameStage3.js';
import './gameBoard.js';

// 메인 화면 버튼 이벤트 연결
document.getElementById('btn-direct-invite').addEventListener('click', () => {
    showScreen('invitation');
    document.getElementById('final-game-result').classList.add('hidden');
});

document.getElementById('btn-start-game').addEventListener('click', () => {
    const nameInput = document.getElementById('guest-name').value.trim();
    if(!nameInput) {
        alert("이름을 입력해주세요!");
        return;
    }
    state.guestName = nameInput;
    state.playedGame = true;
    document.getElementById('final-game-result').classList.remove('hidden');
    showScreen('stage1');
    startStage1(); 
});

document.getElementById('btn-close-story').addEventListener('click', () => {
    const modalStory = document.getElementById('modal-story');
    modalStory.classList.add('opacity-0');
    setTimeout(() => {
        modalStory.classList.add('hidden');
        showScreen('invitation'); 
    }, 700);
});