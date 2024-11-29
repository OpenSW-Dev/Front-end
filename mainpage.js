let isLoggedIn = false;

function toggleLogin() {
    isLoggedIn = !isLoggedIn;
    updateUI();
}

function updateUI() {
    const headerLoginBtn = document.getElementById('headerLoginBtn');
    const editorLoginSection = document.getElementById('editorLoginSection');
    const editorContent = document.getElementById('editorContent');
    const followSection = document.getElementById('followSection');

    if (isLoggedIn) {
        headerLoginBtn.textContent = '로그아웃';
        editorLoginSection.classList.add('hidden');
        editorContent.classList.remove('hidden');
        followSection.classList.remove('hidden');
    } else {
        headerLoginBtn.textContent = '로그인';
        editorLoginSection.classList.remove('hidden');
        editorContent.classList.add('hidden');
        followSection.classList.add('hidden');
    }
}

function goToPage(page) {
    switch(page) {
        case 'login':
            if (confirm('로그인 페이지로 이동하시겠습니까?')) {
                window.location.href = '/login.html';
            }
            break;
            //case 'login':
            //window.location.href = '/login.html';
            //break;
        case 'wall':
            window.location.href = '/wall.html';
            break;
        case 'editor':
            window.location.href = '/editor.html';
            break;
        case 'follow':
            window.location.href = '/follow.html';
            break;
        default:
            console.log('알 수 없는 페이지입니다.');
    }
}

// 초기 UI 설정
updateUI();