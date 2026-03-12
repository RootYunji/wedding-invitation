// [명예의 전당] 데이터를 저장하고 랭킹 모달창을 컨트롤하는 로직

export const memoryDB = { stage1: [], stage2: [], stage3: [], overall: [] };

export function saveMockRecord(stageStr, data) {
    memoryDB[stageStr].push(data);
}

const modalLb = document.getElementById('modal-leaderboard');
const panelLb = document.getElementById('leaderboard-panel');
const lbList = document.getElementById('lb-list');
let currentActiveTab = 1;

document.getElementById('btn-leaderboard').addEventListener('click', openLeaderboard);
if(document.getElementById('btn-final-leaderboard')) {
    document.getElementById('btn-final-leaderboard').addEventListener('click', openLeaderboard);
}
document.getElementById('btn-close-leaderboard').addEventListener('click', closeLeaderboard);

function openLeaderboard() {
    modalLb.classList.remove('hidden');
    setTimeout(() => {
        modalLb.classList.remove('opacity-0');
        panelLb.classList.remove('translate-y-full');
    }, 10);
    switchLeaderboardTab(1);
}

function closeLeaderboard() {
    modalLb.classList.add('opacity-0');
    panelLb.classList.add('translate-y-full');
    setTimeout(() => modalLb.classList.add('hidden'), 300);
}

// 모듈화 시 HTML의 onclick 속성에서 이 함수를 찾지 못하므로 전역(window)으로 열어줍니다.
window.switchLeaderboardTab = function(tabNum) {
    currentActiveTab = tabNum;
    [1, 2, 3].forEach(i => {
        const tab = document.getElementById(`tab-stage${i}`);
        if(tab) {
            if(i === tabNum) {
                tab.classList.add('text-red-600', 'border-b-2', 'border-red-600');
                tab.classList.remove('hover:text-red-500', 'text-zinc-400');
            } else {
                tab.classList.remove('text-red-600', 'border-b-2', 'border-red-600');
                tab.classList.add('hover:text-red-500', 'text-zinc-400');
            }
        }
    });
    const overallTab = document.getElementById('tab-overall');
    if(tabNum === 4) {
        overallTab.classList.add('text-red-600', 'border-b-2', 'border-red-600');
        overallTab.classList.remove('hover:text-red-500', 'text-zinc-400');
    } else {
        overallTab.classList.remove('text-red-600', 'border-b-2', 'border-red-600');
        overallTab.classList.add('hover:text-red-500', 'text-zinc-400');
    }
    renderLeaderboardList(tabNum);
};

function renderLeaderboardList(tabNum) {
    const stageStr = tabNum === 4 ? 'overall' : `stage${tabNum}`;
    let data = [...memoryDB[stageStr]];

    if(tabNum === 1) data.sort((a, b) => a.attempts - b.attempts); 
    else if(tabNum === 2) data.sort((a, b) => a.diff - b.diff); 
    else if(tabNum === 3) data.sort((a, b) => a.time - b.time);
    else if(tabNum === 4) data.sort((a, b) => a.s2_diff - b.s2_diff || a.s1_attempts - b.s1_attempts || a.s3_time - b.s3_time);

    lbList.innerHTML = '';
    if(data.length === 0) {
        lbList.innerHTML = `<div class="text-center text-zinc-400 py-10 text-sm">아직 기록이 없습니다.</div>`;
    } else {
        data.forEach((row, idx) => {
            let valStr = '';
            if (tabNum === 1) valStr = `${row.attempts}회`;
            else if (tabNum === 2) valStr = `오차 ${row.diff.toFixed(2)}초`;
            else if (tabNum === 3) valStr = `${row.time.toFixed(2)}초`;
            else if (tabNum === 4) {
                valStr = `<div class="text-right text-xs">
                    <span class="block text-red-600 font-bold">오차 ${row.s2_diff.toFixed(2)}초</span>
                    <span class="text-zinc-400 font-medium">1단 ${row.s1_attempts}회 | 3단 ${row.s3_time.toFixed(2)}초</span>
                </div>`;
            }
            
            let medal;
            if(idx === 0) medal = '<span class="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-md">1</span>';
            else if(idx === 1) medal = '<span class="w-6 h-6 rounded-full bg-zinc-400 text-white flex items-center justify-center font-bold text-xs shadow-md">2</span>';
            else if(idx === 2) medal = '<span class="w-6 h-6 rounded-full bg-zinc-300 text-white flex items-center justify-center font-bold text-xs shadow-md">3</span>';
            else medal = `<span class="text-zinc-400 w-6 h-6 inline-block text-center leading-6 text-xs font-bold">${idx+1}</span>`;
            
            const div = document.createElement('div');
            div.className = "flex justify-between items-center bg-white p-4 rounded-xl border border-zinc-100 shadow-sm";
            div.innerHTML = `
                <div class="flex items-center gap-3">
                    ${medal}
                    <span class="font-bold text-zinc-700 text-sm">${row.name}</span>
                </div>
                ${tabNum === 4 ? valStr : `<span class="text-red-600 font-bold text-sm tabular-nums">${valStr}</span>`}
            `;
            lbList.appendChild(div);
        });
    }
}