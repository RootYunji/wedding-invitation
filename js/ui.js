import { state } from './gameState.js'; 

export const screens = {
    intro: document.getElementById('screen-intro'),
    stage1: document.getElementById('screen-stage1'),
    stage2: document.getElementById('screen-stage2'),
    stage3: document.getElementById('screen-stage3'),
    invitation: document.getElementById('screen-invitation')
};
export const header = document.getElementById('app-header');
const appContainer = document.getElementById('app-container');

// 해시 변경 감지 이벤트
window.addEventListener('hashchange', handleRoute);
window.addEventListener('load', handleRoute); 

// 라우터 함수: 주소창의 # 값에 따라 화면을 전환
function handleRoute() {
    let currentHash = window.location.hash.replace('#', '') || 'intro';

    // 이름(guestName)이 입력되지 않은 상태에서 게임 화면(stage)으로 접근하려고 하면 무조건 대문(intro)으로 튕겨냅니다.
    // 단, invitation은 예외로 
    if (currentHash !== 'intro' && currentHash !== 'invitation' && !state.guestName) {
        window.location.hash = 'intro'; // 주소를 강제로 #intro로 변경
        return; // 함수를 여기서 종료하여 아래 renderScreen이 실행되지 않게 함
    }

    // 실제 화면 전환 처리
    renderScreen(currentHash);
}

// 실제 화면을 그리고 숨기는 함수
function renderScreen(screenId) {
    Object.values(screens).forEach(s => {
        if(s) {
            s.classList.add('hidden');
            s.classList.remove('fade-in');
        }
    });

    if(screens[screenId]) {
        screens[screenId].classList.remove('hidden');
        screens[screenId].classList.add('fade-in');

        // 컨테이너 스크롤 맨 위로!
        if (appContainer) appContainer.scrollTop = 0;
    }
    
    // 헤더 노출 규칙
    if(screenId !== 'intro' && screenId !== 'invitation') {
        header.classList.remove('hidden');
    } else {
        header.classList.add('hidden');
    }
}

// 다른 파일에서 화면을 이동시킬 때 쓰는 함수
export function navigateTo(hashName) {
    window.location.hash = hashName; 
}