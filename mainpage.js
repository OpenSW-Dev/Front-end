async function checkLoginStatus() {
    try {
        const response = await fetch('https://food-social.kro.kr/api/v1/members/me');
        const data = await response.json();
        
        // API 응답 결과에 따라 UI 한 번만 업데이트
        updateUI(data.success, data.data);
        
    } catch (error) {
        console.error('로그인 상태 확인 중 오류 발생:', error);
        // 에러 발생 시 로그아웃 상태로 처리
        updateUI(false);
    }
}
// 팔로잉 목록을 가져오는 함수
async function getFollowingList() {
    try {
        const response = await fetch('https://food-social.kro.kr/api/v1/follow');
        const data = await response.json();
        
        if (data.success) {
            // 팔로잉 수 업데이트
            updateFollowingCount(data.data.length);
        }
    } catch (error) {
        console.error('팔로잉 목록 가져오기 실패:', error);
        updateFollowingCount(0);
    }
}
// 팔로잉 수 업데이트 함수
function updateFollowingCount(count) {
    const followingCount = document.getElementById('followingCount');
    if (followingCount) {
        followingCount.textContent = count;
    }
}
async function fetchArticles() {
    try {
        const response = await fetch('https://food-social.kro.kr/api/v1/article/total');
        const data = await response.json();
        
        if (data.success) {
            updateGridItems(data.data);
        } else {
            console.error('게시글 데이터 가져오기 실패:', data.message);
            // 실패 시 빈 그리드 또는 에러 메시지 표시
            updateGridItems([]);
        }
    } catch (error) {
        console.error('게시글 데이터 가져오기 중 오류 발생:', error);
        updateGridItems([]);
    }
}
// 그리드 아이템 업데이트 함수
function updateGridItems(articles) {
    const gridContainer = document.getElementById('recipeGrid');
    if (!gridContainer) return;
    if (articles.length === 0) {
        gridContainer.innerHTML = `
            <div class="grid-item">
                <div class="no-image">게시글이 없습니다</div>
            </div>
        `;
        return;
    }
    // 최대 4개의 게시글만 표시
    const displayArticles = articles.slice(0, 4);
    
    gridContainer.innerHTML = displayArticles.map(article => `
        <div class="grid-item" onclick="goToArticle(${article.id})">
            ${article.image 
                ? `<img src="${article.image}" alt="${article.title}">`
                : `<div class="no-image">이미지가 없습니다</div>`
            }
            <div class="grid-item-overlay">
                <span>${article.title}</span>
            </div>
        </div>
    `).join('');
}

// 팔로우 목록을 가져오고 표시하는 함수
async function fetchAndDisplayFollows() {
    try {
        const response = await fetch('https://food-social.kro.kr/api/v1/follow');
        const data = await response.json();
        
        if (data.success) {
            updateFollowContainer(data.data);
            // 팔로잉 수도 함께 업데이트
            updateFollowingCount(data.data.length);
        } else {
            console.error('팔로우 목록 가져오기 실패');
        }
    } catch (error) {
        console.error('팔로우 목록 가져오기 중 오류 발생:', error);
    }
}
function updateFollowContainer(follows) {
    const followContainer = document.getElementById('followContainer');
    if (!followContainer) return;

    // 팔로우 목록이 비어있는 경우
    if (follows.length === 0) {
        followContainer.innerHTML = `
            <div class="follow-content">
                <div class="content-text">
                    <div class="content-title">팔로우한 사용자가 없습니다</div>
                </div>
            </div>
        `;
        return;
    }
    // 팔로우 목록 표시
    followContainer.innerHTML = follows.map(follow => `
        <div class="follow-content">
            <div class="circle-image"></div>
            <div class="content-text">
                <div class="content-title">${follow.nickname}</div>
            </div>
        </div>
    `).join('');
}
// 게시글 상세 페이지로 이동하는 함수
function goToArticle(id) {
    // 게시글 상세 페이지로 이동하는 로직
    window.location.href = `/article.html?id=${id}`;
}

// 페이지 로드 시 팔로우 목록 가져오기
document.addEventListener('DOMContentLoaded', async () => {
    await checkLoginStatus(); // 로그인 체크 먼저 실행
    fetchArticles(); // 담벼락 목록 가져오기
    fetchAndDisplayFollows(); // 팔로우 목록 가져오기
});
function updateUI(isLoggedIn, userData = null) {
    const headerLoginBtn = document.querySelector('.login-button');
    const editorLoginSection = document.getElementById('editorLoginSection');
    const editorContent = document.getElementById('editorContent');
    const followSection = document.getElementById('followSection');
    const accountNickname = document.getElementById('accountNickname');

    if (isLoggedIn && userData) {
        headerLoginBtn.textContent = '로그아웃';
        editorLoginSection.classList.add('hidden');
        editorContent.classList.remove('hidden');
        followSection.classList.remove('hidden');
        
        // 닉네임 업데이트
        if (accountNickname) {
            accountNickname.textContent = userData.nickname;
        }
    } else {
        headerLoginBtn.textContent = '로그인';
        editorLoginSection.classList.remove('hidden');
        editorContent.classList.add('hidden');
        followSection.classList.add('hidden');
    }
}

// 로그인/로그아웃 버튼 클릭 핸들러
function handleLoginClick() {
    // 로그인 페이지로 이동
    window.location.href = '/login.html';
}

function goToPage(page) {
    switch(page) {
        
        case 'login':
            window.location.href = '/login.html';
            break;
        case 'wall':
            window.location.href = '/wall.html';
            break;
        case 'editor':
            window.location.href = '/editor.html';
            break;
        case 'follow':
            window.location.href = '/follow.html';
            break;
        case 'image1':
            window.location.href = '/image1.html';
            break;
        case 'image2':
            window.location.href = '/image2.html';
            break;
        case 'image3':
            window.location.href = '/image3.html';
            break;
        case 'image4':
            window.location.href = '/image4.html';
            break;
        case 'follow1':
            window.location.href = '/follow1.html';
            break;
        case 'follow2':
            window.location.href = '/follow2.html';
            break;
        default:
            console.log('알 수 없는 페이지입니다.');
    }
}
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
});
// 초기 UI 설정
updateUI();