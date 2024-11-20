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
        default:
            console.log('알 수 없는 페이지입니다.');
    }
}

// 페이지 로드 시 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.more-button, .login-button').forEach(button => {
        button.addEventListener('click', function(e) {
            const pageName = {
                'login': '로그인',
                'wall': '담벼락',
                'editor': '에디터',
                'follow': '팔로우'
            }[e.target.onclick.toString().match(/goToPage\('(.+)'\)/)[1]];
            
            if (!confirm(`${pageName} 페이지로 이동하시겠습니까?`)) {
                e.preventDefault();
                return false;
            }
        });
    });
});