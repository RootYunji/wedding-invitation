import { state } from './gameState.js';
import { navigateTo } from './ui.js'; // 🌟 showScreen 대신 navigateTo 사용
import { initStage1, startStage1 } from './gameStage1.js'; // 🌟 initStage1 추가
import { startStage2 } from './gameStage2.js'; // 뒤로가기에서 사용할 2단계 시작 함수

// 모듈 내부 이벤트 리스너 바인딩을 위한 사이드 이펙트 로드
import './gameStage2.js'; 
import './gameStage3.js';
// import './gameBoard.js'; // 나중에 랭킹보드 완성 시 주석 해제

// [1] 청첩장 바로보기 (게임 Skip)
document.getElementById('btn-direct-invite').addEventListener('click', () => {
    // 미참여자 상태 마킹 및 하단 게임 결과(랭킹 등) 영역 강제 숨김
    state.playedGame = false;
    document.getElementById('final-game-result').classList.add('hidden');
    
    // 스토리 모달을 생략하고 곧바로 최종 청첩장 뷰로 라우팅 (해시 변경)
    navigateTo('invitation');
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

    // 게임 참여자용 결과 영역 노출 세팅
    document.getElementById('final-game-result').classList.remove('hidden');
    
    // 1단계 진입 (해시 변경 및 횟수 1회부터 초기화 시작)
    navigateTo('stage1');
    initStage1(); 
});

// [3] 스토리 모달 닫기 및 최종 청첩장 렌더링 (3단계 클리어 이후 플로우)
document.getElementById('btn-close-story').addEventListener('click', () => {
    const modalStory = document.getElementById('modal-story');
    
    // CSS transition을 이용한 Fade-out 애니메이션 적용
    modalStory.classList.add('opacity-0');
    
    // 애니메이션 지속 시간(700ms) 대기 후 모달 DOM 숨김 및 청첩장 뷰 마운트
    setTimeout(() => {
        modalStory.classList.add('hidden');
        navigateTo('invitation'); 
    }, 700);
});

// [개발용] 뒤로가기 버튼 로직
const btnBackDev = document.getElementById('btn-back-dev');
if (btnBackDev) {
    btnBackDev.addEventListener('click', () => {
        // 🌟 DOM 클래스 대신 현재 해시(주소)를 기준으로 판별합니다.
        const currentHash = window.location.hash.replace('#', '') || 'intro';

        if (currentHash === 'stage2') {
            // Stage 2에서 뒤로가면 1단계로 (타이머 중단 처리 포함)
            state.s2_active = false;
            cancelAnimationFrame(state.s2_timerRaf);
            navigateTo('stage1');
            startStage1(); // 1단계 릴 재시작
        } 
        else if (currentHash === 'stage1') {
            // Stage 1에서 뒤로가면 인트로로 (릴 중단 처리 포함)
            state.s1_active = false;
            if (state.s1_intervals) {
                state.s1_intervals.forEach(clearInterval);
            }
            navigateTo('intro');
        }
        else if (currentHash === 'stage3') {
            // 3단계에서 뒤로 가면 2단계로
            navigateTo('stage2');
            startStage2(); // 2단계 타이머 재시작
        }
    });
}