import { state } from './gameState.js';
import { navigateTo } from './ui.js'; 

// 초기화(init) 및 정리(cleanup) 함수들
import { initStage1, cleanupStage1 } from './gameStage1.js'; 
import { initStage2, cleanupStage2 } from './gameStage2.js'; 
import { initStage3, cleanupStage3 } from './gameStage3.js'; 

// 모듈 내부 이벤트 리스너 바인딩을 위한 사이드 이펙트 로드
import './gameStage2.js'; 
import './gameStage3.js';
// import './gameBoard.js'; // 나중에 랭킹보드 완성 시 주석 해제

// [1] 청첩장 바로보기 (게임 Skip)
document.getElementById('btn-direct-invite').addEventListener('click', () => {
    state.playedGame = false;
    //document.getElementById('final-game-result').classList.add('hidden');
    navigateTo('invitation');
});

// [2] 미니 게임 도전 시작
document.getElementById('btn-start-game').addEventListener('click', () => {
    const nameInput = document.getElementById('guest-name').value.trim();
    
    if(!nameInput) {
        alert("이름(별명)을 입력해주세요!");
        return;
    }

    state.guestName = nameInput;
    state.playedGame = true;
    document.getElementById('final-game-result').classList.remove('hidden');
    
    navigateTo('stage1');
    initStage1(); 
});

// [3] 스토리 모달 닫기 및 최종 청첩장 렌더링
document.getElementById('btn-close-story').addEventListener('click', () => {
    const modalStory = document.getElementById('modal-story');
    modalStory.classList.add('opacity-0');

    setTimeout(() => {
        modalStory.classList.add('hidden');
        navigateTo('invitation', true); // 끝났으니 덮어쓰기
    }, 700);
});


// 🌟 [핵심] 화면 이탈 및 강제 리셋 관리
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '') || 'intro';
    
    // 다른 스테이지 리소스 무조건 강제 종료
    if (hash !== 'stage1') cleanupStage1();
    if (hash !== 'stage2') cleanupStage2();
    if (hash !== 'stage3') cleanupStage3();

    // 🌟 뒤로가기로 대문(intro)에 쫓겨난 경우 완전 초기화
    if (hash === 'intro') {
        state.guestName = null;
        state.playedGame = false;
    }

    // 뒤로가기/앞으로가기 등으로 게임 화면에 정상 진입 시 초기 셋업
    if (hash === 'stage1' && !state.s1_active && !state.s1_spinning) initStage1();
    if (hash === 'stage2' && !state.s2_active && !state.s2_completed) initStage2();
    if (hash === 'stage3' && !state.s3_active && !state.s3_completed) initStage3();
});

// [개발용] 뒤로가기 버튼
const btnBackDev = document.getElementById('btn-back-dev');
if (btnBackDev) {
    btnBackDev.addEventListener('click', () => {
        const currentHash = window.location.hash.replace('#', '') || 'intro';

        if (currentHash === 'stage2') {
            cleanupStage2(); 
            navigateTo('stage1', true); // 개발용 버튼도 덮어쓰기로 이동
            initStage1(); 
        } 
        else if (currentHash === 'stage1') {
            cleanupStage1(); 
            state.guestName = null;
            navigateTo('intro');
        }
        else if (currentHash === 'stage3') {
            cleanupStage3(); 
            navigateTo('stage2', true);
            initStage2(); 
        }
    });
}