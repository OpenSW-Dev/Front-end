// 하트, 별 카운트 증가/감소 기능
document
  .querySelectorAll(".heart-count .heart-icon, .bookmark-count .bookmark-icon")
  .forEach((icon) => {
    icon.addEventListener("click", function () {
      const countSpan = this.nextElementSibling;
      let count = parseInt(countSpan.textContent);
      if (this.classList.contains("active")) {
        count -= 1; // 이미 눌린 상태 -> 감소
        this.classList.remove("active");
      } else {
        count += 1; // 눌리지 않은 상태 -> 증가
        this.classList.add("active");
      }
      countSpan.textContent = count;
    });
  });

// 댓글 좋아요(하트) 기능
document
  .querySelector(".comments-section")
  .addEventListener("click", function (e) {
    if (e.target && e.target.classList.contains("heart-icon")) {
      const heartIcon = e.target;
      heartIcon.classList.toggle("active"); // 눌린 상태 토글
    }
  });

// 댓글 수 업데이트 함수
function updateCommentCount() {
  const commentCount = document.querySelectorAll(
    ".comments-section .comment"
  ).length;
  document.querySelector(
    ".action-bar .stats span:last-child"
  ).textContent = `💬 ${commentCount}`;
}

const urlParams = new URLSearchParams(window.location.search);
const articleId = urlParams.get("id");

if (articleId) {
  const authToken = localStorage.getItem("authToken");

  const headers = {
    "Content-Type": "application/json",
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  fetch(
    `https://food-social.kro.kr/api/v1/article/detail?articleId=${articleId}`,
    {
      method: "GET",
      headers: headers,
    }
  )
    .then((response) => response.json())
    .then((data) => {
      const article = data.data;

      document.querySelector(".post-title").textContent = article.title;

      const postMeta = document.querySelector(".post-meta");
      postMeta.textContent = `작성자: ${article.nickname} | 작성일: ${article.date}`;

      const postContent = document.querySelector(".post-content");
      postContent.innerHTML = article.content;

      const stats = document.querySelector(".stats");
      stats.innerHTML = `
        <div class="heart-count">
          <span class="heart-icon">❤️</span>
          <span>${article.likeCnt}</span>
        </div>
        <div class="bookmark-count">
          <span class="bookmark-icon">⭐</span>
          <span>${article.bookmarks || 0}</span>
        </div>
        <span>💬 ${article.cmtCnt}</span>
      `;

      const commentsSection = document.querySelector(".comments-section");

      commentsSection.innerHTML = "<h2>댓글</h2>";
      refreshComments(headers);
    })
    .catch((error) => {
      console.error("Error fetching article details:", error);
    });
} else {
  console.error("Article ID is missing in the URL");
  alert("유효하지 않은 게시글입니다.");
}

const commentButton = document.querySelector(".new-comment button");
const commentTextArea = document.querySelector(".new-comment textarea");

commentButton.addEventListener("click", function () {
  const commentContent = commentTextArea.value.trim();

  if (!commentContent) {
    alert("댓글을 입력하세요!");
    return;
  }

  const authToken = localStorage.getItem("authToken");

  const headers = {
    "Content-Type": "application/json",
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const commentData = {
    articleId: articleId,
    comment: commentContent,
    parentId: null,
  };

  fetch("https://food-social.kro.kr/api/v1/comment", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(commentData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        refreshComments(headers);

        commentTextArea.value = "";
      } else {
        alert("댓글 작성 실패: " + data.message);
      }
    })
    .catch((error) => {
      console.error("Error adding comment:", error);
      alert("댓글을 추가하는 중 오류가 발생했습니다.");
    });
});

function refreshComments(headers) {
  const commentsSection = document.querySelector(".comments-section");
  commentsSection.innerHTML = "";

  fetch(`https://food-social.kro.kr/api/v1/comment?articleId=${articleId}`, {
    method: "GET",
    headers: headers,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success && data.data.length > 0) {
        data.data.forEach((comment) => {
          const commentElement = document.createElement("div");
          commentElement.classList.add("comment");

          commentElement.innerHTML = `
              <div class="comment-content">
                <strong>${comment.nickname}</strong>
                <p>${comment.comment}</p>
                <div class="comment-meta">작성일: ${comment.updatedAt}</div>
              </div>
            `;

          commentsSection.appendChild(commentElement);
        });
      } else {
        commentsSection.innerHTML = "<p>댓글이 없습니다.</p>";
      }
    })
    .catch((error) => {
      console.error("Error fetching comments:", error);
      commentsSection.innerHTML =
        "<p>댓글을 불러오는 중 오류가 발생했습니다.</p>";
    });
}
