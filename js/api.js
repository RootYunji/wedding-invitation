// 구글 Apps Script URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyxNj6NyWwBW85ZLfgD7bG2N2o96twN4fK2BzFaqrdViJbYcc38kEqVcKLCthP7VTKgCQ/exec';

/*
 * 게임 결과 데이터를 구글 시트에 저장. (POST 요청)
 * @param {Object} data - { name, s1_tries, s2_gap, s3_time, is_passed }
*/
export async function saveRecord(data) {
    try {
        console.log("Uploading Score...", data);
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            // 중요: CORS Preflight 에러 방지를 위해 text/plain 사용
            headers: {
                'Content-Type': 'text/plain', 
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        console.log("Status(Save Success): ", result);
        return result;
    } catch (error) {
        console.error("Error: ", error);
        return null;
    }
}

/*
 * 구글 시트에서 명예의 전당 데이터를 가져. (GET 요청)
 * @returns {Array} - 객체 배열 반환
*/
export async function getLeaderboardData() {
    try {
        console.log("Fetching Rankings...");
        const response = await fetch(SCRIPT_URL);
        const data = await response.json();
        console.log("Status(Sync Complete): ", data);
        return data;
    } catch (error) {
        console.error("Error: ", error);
        return [];
    }
}