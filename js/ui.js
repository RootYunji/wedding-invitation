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
    Object.values(screens).forEach(s => {
        if(s) {
            s.classList.add('hidden');
            s.classList.remove('fade-in');
        }
    });
    if(screens[screenId]) {
        screens[screenId].classList.remove('hidden');
        screens[screenId].classList.add('fade-in');
    }
    
    if(screenId !== 'intro' && screenId !== 'invitation') {
        header.classList.remove('hidden');
    } else {
        header.classList.add('hidden');
    }
}