document.addEventListener('DOMContentLoaded', function() {
    // 유저 목록을 표시할 컨테이너
    const container = document.querySelector('.container');

    // 유저 HTML 생성 함수
    function createUserHTML(user) {
        return `
            <div class="user">
                <a href="/users/${user.id}" class="user-link">
                    <img src="https://via.placeholder.com/60" alt="User Image">
                    <div class="user-info">
                        <div class="user-name">${user.nickname}</div>
                        <div class="user-description">사용자</div>
                    </div>
                    <div class="user-status">
                        <button class="follow-button following" onclick="event.stopPropagation()">팔로잉</button>
                    </div>
                </a>
            </div>
        `;
    }

    // 팔로우 버튼 이벤트 설정 함수
    function setupFollowButtons() {
        const followButtons = document.querySelectorAll('.follow-button');
        
        followButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                if (this.classList.contains('following')) {
                    this.classList.remove('following');
                    this.classList.add('not-following');
                    this.textContent = '팔로우';
                } else {
                    this.classList.remove('not-following');
                    this.classList.add('following');
                    this.textContent = '팔로잉';
                }
            });

            button.addEventListener('mouseenter', function() {
                if (this.classList.contains('following')) {
                    this.textContent = '언팔로우';
                }
            });

            button.addEventListener('mouseleave', function() {
                if (this.classList.contains('following')) {
                    this.textContent = '팔로잉';
                } else {
                    this.textContent = '팔로우';
                }
            });
        });
    }

    // API에서 데이터 가져오기
    async function fetchUsers() {
        try {
            // API 엔드포인트 URL을 실제 URL로 변경해야 합니다
            const response = await fetch('https://food-social.kro.kr/api/v1/follow');
            const result = await response.json();

            if (result.success && result.data) {
                // 기존 제목 유지
                let usersHTML = '<h1 class="title">팔로잉</h1>';
                
                // 각 유저에 대한 HTML 생성
                result.data.forEach(user => {
                    usersHTML += createUserHTML(user);
                });

                // 컨테이너에 HTML 삽입
                container.innerHTML = usersHTML;

                // 팔로우 버튼 이벤트 설정
                setupFollowButtons();
            } else {
                container.innerHTML = '<h1 class="title">팔로잉</h1><p>사용자 목록을 불러올 수 없습니다.</p>';
            }
        } catch (error) {
            console.error('데이터를 불러오는 중 오류가 발생했습니다:', error);
            container.innerHTML = '<h1 class="title">팔로잉</h1><p>오류가 발생했습니다. 나중에 다시 시도해주세요.</p>';
        }
    }

    // 페이지 로드 시 사용자 목록 가져오기
    fetchUsers();
});
