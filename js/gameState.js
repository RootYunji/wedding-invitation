// [전역 상태 관리] 게임 전체에서 공유되는 상태 값
export const state = {
    guestName: '익명',
    playedGame: false,
    // 1단계 상태
    s1_attempts: 1, 
    s1_active: false, 
    s1_reels: [1, 1, 1], 
    s1_intervals: [null, null, null], 
    s1_stopped: [false, false, false],
    // 2단계 상태
    s2_active: false, 
    s2_timerStart: 0, 
    s2_timerRaf: null, 
    s2_diff: 0,
    // 3단계 상태
    s3_active: false, 
    s3_timerStart: 0, 
    s3_timerRaf: null, 
    s3_puzzle: [], 
    s3_selectedIdx: null, 
    s3_time: 0
};