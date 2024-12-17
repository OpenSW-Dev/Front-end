// 댓글 수 업데이트 함수
function updateCommentCount() {
  const commentCount = document.querySelectorAll(
    ".comments-section .comment"
  ).length;

  const commentCountSpan = document.querySelector("#comment-count");

  if (commentCountSpan) {
    commentCountSpan.textContent = `💬 ${commentCount}`;
  }
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
      postMeta.innerHTML = `작성자: ${article.nickname} | 작성일: ${article.date} | 팔로우: <span class="follow-star">⭐</span>`;

      const followStar = document.querySelector(".follow-star");

      fetch("https://food-social.kro.kr/api/v1/follow", {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          const ids = data.data.map((item) => item.id);

          if (ids.includes(article.authorId)) {
            console.log("The article is in the list.");
            followStar.textContent = "⭐";
          } else {
            console.log("The article is not in the list.");
            followStar.textContent = "☆";
          }
        });

      followStar.addEventListener("click", function () {
        fetch("https://food-social.kro.kr/api/v1/follow", {
          method: "POST",
          headers: headers,
          body: JSON.stringify({ followingId: article.authorId }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              if (followStar.textContent === "☆") {
                followStar.textContent = "⭐";
              } else {
                followStar.textContent = "☆";
              }
            } else {
              console.error("Error following the post:", data.message);
            }
          })
          .catch((error) => {
            console.error("Error fetching follow status:", error);
          });
      });

      const postContent = document.querySelector(".post-content");
      postContent.innerHTML = article.content;

      const stats = document.querySelector(".stats");
      stats.innerHTML = `
        <div class="heart-count">
          <span class="heart-icon" id="heart-icon">❤️</span>
          <span id="heart-count">${article.likeCnt}</span>
        </div>
        <span id="comment-count">💬 ${article.cmtCnt}</span>
        `;

      const heartIcon = document.getElementById("heart-icon");
      const heartCount = document.getElementById("heart-count");

      const apiEndpoint = `https://food-social.kro.kr/api/v1/article/like/${articleId}`;

      heartIcon.addEventListener("click", () => {
        fetch(apiEndpoint, {
          method: "POST",
          headers: headers,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              let currentCount = parseInt(heartCount.textContent, 10);
              heartCount.textContent = currentCount + 1;
            } else {
              console.error("Failed to update heart count.");
            }
          })
          .catch((error) => {
            console.error("Error during fetch:", error);
          });
      });

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
        window.location.reload();
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
