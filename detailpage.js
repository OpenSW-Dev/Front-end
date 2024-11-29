<script>
  // 댓글 추가 기능
  document.querySelector('.new-comment button').addEventListener('click', function() {
    const commentText = document.querySelector('.new-comment textarea').value;
    if (commentText.trim() === '') {
      alert('댓글을 입력해주세요!');
      return;
    }

    const commentSection = document.querySelector('.comments-section');
    const newComment = `
      <div class="comment">
        <div class="comment-content">
          <strong>새로운 사용자</strong>
          <p>${commentText}</p>
          <div class="comment-meta">작성일: ${new Date().toISOString().slice(0, 10)}</div>
        </div>
        <span class="heart-icon">❤️</span>
      </div>
    `;
    commentSection.insertAdjacentHTML('beforeend', newComment);
    document.querySelector('.new-comment textarea').value = ''; // 댓글 입력창 초기화
    updateCommentCount();
  });

  // 하트, 별 카운트 증가/감소 기능
  document.querySelectorAll('.heart-count .heart-icon, .bookmark-count .bookmark-icon').forEach(icon => {
    icon.addEventListener('click', function() {
      const countSpan = this.nextElementSibling;
      let count = parseInt(countSpan.textContent);
      if (this.classList.contains('active')) {
        count -= 1; // 이미 눌린 상태 -> 감소
        this.classList.remove('active');
      } else {
        count += 1; // 눌리지 않은 상태 -> 증가
        this.classList.add('active');
      }
      countSpan.textContent = count;
    });
  });

  // 댓글 좋아요(하트) 기능
  document.querySelector('.comments-section').addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('heart-icon')) {
      const heartIcon = e.target;
      heartIcon.classList.toggle('active'); // 눌린 상태 토글
    }
  });

  // 댓글 수 업데이트 함수
  function updateCommentCount() {
    const commentCount = document.querySelectorAll('.comments-section .comment').length;
    document.querySelector('.action-bar .stats span:last-child').textContent = `💬 ${commentCount}`;
  }
</script>