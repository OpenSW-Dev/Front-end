document.addEventListener('DOMContentLoaded', function() {
    const followButtons = document.querySelectorAll('.follow-button');
    
    followButtons.forEach(button => {
        button.addEventListener('click', function() {
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

        // 호버 시 텍스트 변경 (팔로잉 상태일 때만)
        button.addEventListener('mouseenter', function() {
            if (this.classList.contains('following')) {
                this.textContent = '언팔로우';
            }
        });

        // 호버 해제 시 텍스트 복구 (팔로잉 상태일 때만)
        button.addEventListener('mouseleave', function() {
            if (this.classList.contains('following')) {
                this.textContent = '팔로잉';
            }
        });
    });
});