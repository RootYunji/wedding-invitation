import { state } from './gameState.js';
import { showScreen } from './ui.js';
import { startStage1 } from './gameStage1.js';

// 모듈 내부 이벤트 리스너 바인딩을 위한 사이드 이펙트 로드
import './gameStage2.js'; 
import './gameStage3.js';
import './gameBoard.js';

// [1] 청첩장 바로보기 (게임 Skip)
document.getElementById('btn-direct-invite').addEventListener('click', () => {
    // 미참여자 상태 마킹 및 하단 게임 결과(랭킹 등) 영역 강제 숨김
    state.playedGame = false;
    document.getElementById('final-game-result').classList.add('hidden');
    
    // 스토리 모달을 생략하고 곧바로 최종 청첩장 뷰로 라우팅
    showScreen('invitation');
});

// [2] 미니 게임 도전 시작
document.getElementById('btn-start-game').addEventListener('click', () => {
    const nameInput = document.getElementById('guest-name').value.trim();
    
    // 유효성 검사 (방명록/랭킹용 이름 필수)
    if(!nameInput) {
        alert("이름(별명)을 입력해주세요!");
        return;
    }

    // 전역 상태(state) 초기화
    state.guestName = nameInput;
    state.playedGame = true;

    // 게임 참여자용 결과 영역 노출 세팅 후 1단계 진입
    document.getElementById('final-game-result').classList.remove('hidden');
    showScreen('stage1');
    startStage1(); 
});

// [3] 스토리 모달 닫기 및 최종 청첩장 렌더링 (3단계 클리어 이후 플로우)
document.getElementById('btn-close-story').addEventListener('click', () => {
    const modalStory = document.getElementById('modal-story');
    
    // CSS transition을 이용한 Fade-out 애니메이션 적용
    modalStory.classList.add('opacity-0');
    
    // 애니메이션 지속 시간(700ms) 대기 후 모달 DOM 숨김 및 청첩장 뷰 마운트
    setTimeout(() => {
        modalStory.classList.add('hidden');
        showScreen('invitation'); 
    }, 700);
});

// [4] 상단 뒤로가기 버튼 (처음으로 돌아가기)
document.getElementById('btn-go-back').addEventListener('click', () => {
    // 앱 헤더(상단바) 숨기고 첫 인트로 화면으로 전환
    document.getElementById('app-header').classList.add('hidden');
    showScreen('intro');
});