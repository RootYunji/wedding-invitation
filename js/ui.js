// [화면 전환 관리] 화면을 숨기고 보여주는 UI 컨트롤 함수만

export const screens = {
    intro: document.getElementById('screen-intro'),
    stage1: document.getElementById('screen-stage1'),
    stage2: document.getElementById('screen-stage2'),
    stage3: document.getElementById('screen-stage3'),
    invitation: document.getElementById('screen-invitation')
};
export const header = document.getElementById('app-header');

export function showScreen(screenId) {

    // 1. 모든 스크린 숨기기
    Object.values(screens).forEach(s => {
        if(s) {
            s.classList.add('hidden');
            s.classList.remove('fade-in');
        }
    });

    // 2. 대상 스크린 표시
    if(screens[screenId]) {
        screens[screenId].classList.remove('hidden');
        screens[screenId].classList.add('fade-in');

        // 🌟 [추가] 화면 전환 시 즉시 스크롤을 맨 위로 이동
        window.scrollTo({
            top: 0,
            behavior: 'auto' // 'smooth'보다 'auto'나 'instant'가 페이지 전환 시 더 깔끔합니다.
        });
    }
    
    // 3. 헤더 표시 여부 제어
    if(screenId !== 'intro' && screenId !== 'invitation') {
        header.classList.remove('hidden');
    } else {
        header.classList.add('hidden');
    }
}