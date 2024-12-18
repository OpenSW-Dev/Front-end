// detail-recipe.js

// 로그인 여부 확인
const authToken = localStorage.getItem("authToken");

function updateCommentCount() {
  const commentCount = document.querySelectorAll(".comments-section .comment").length;
  const commentCountSpan = document.querySelector("#comment-count");
  if (commentCountSpan) {
    commentCountSpan.textContent = `💬 ${commentCount}`;
  }
}

const urlParams = new URLSearchParams(window.location.search);
const articleId = urlParams.get("id");

if (articleId) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  function fetchArticleDetails() {
    fetch(`https://food-social.kro.kr/api/v1/article/detail?articleId=${articleId}`, {
      method: "GET",
      headers: headers,
    })
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
              followStar.textContent = "⭐";
            } else {
              followStar.textContent = "☆";
            }
          });

        followStar.addEventListener("click", function () {
          if (!authToken) {
            alert("로그인이 필요합니다.");
            return;
          }
          fetch("https://food-social.kro.kr/api/v1/follow", {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ followingId: article.authorId }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                followStar.textContent = followStar.textContent === "☆" ? "⭐" : "☆";
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

        // 이미지 크기 조정
        const images = postContent.querySelectorAll("img");
        images.forEach((img) => {
          img.style.maxWidth = "800px";
          img.style.height = "auto";
          img.style.width = "100%";
          img.style.display = "block";
          img.style.margin = "0 auto";
        });

        const stats = document.querySelector(".stats");
        stats.innerHTML = `
          <div class="heart-count">
            <span class="heart-icon" id="heart-icon">${article.myLike ? "❤️" : "🤍"}</span>
            <span id="heart-count">${article.likeCnt}</span>
          </div>
          <span id="comment-count">💬 ${article.cmtCnt}</span>
        `;

        const heartIcon = document.getElementById("heart-icon");
        const heartCount = document.getElementById("heart-count");
        const apiEndpoint = `https://food-social.kro.kr/api/v1/article/like/${articleId}`;

        heartIcon.addEventListener("click", () => {
          if (!authToken) {
            alert("로그인이 필요합니다.");
            return;
          }
          fetch(apiEndpoint, {
            method: "POST",
            headers: headers,
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                // 좋아요 상태 업데이트를 위해 재조회
                fetchArticleDetails();
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
  }

  fetchArticleDetails();

} else {
  console.error("Article ID is missing in the URL");
  alert("유효하지 않은 게시글입니다.");
}

const commentButton = document.querySelector(".new-comment button");
const commentTextArea = document.querySelector(".new-comment textarea");

// 로그인 상태가 아니면 댓글 작성 폼 숨기기
if (!authToken) {
  document.querySelector(".new-comment").style.display = "none";
} else {
  commentButton.addEventListener("click", function () {
    const commentContent = commentTextArea.value.trim();
    if (!commentContent) {
      alert("댓글을 입력하세요!");
      return;
    }

    const headers = {
      "Content-Type": "application/json",
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const commentData = {
      articleId: urlParams.get("id"),
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
}

function refreshComments(headers) {
  const commentsSection = document.querySelector(".comments-section");
  commentsSection.innerHTML = "<h2>댓글</h2>";

  const articleId = new URLSearchParams(window.location.search).get("id");
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
        updateCommentCount();
      } else {
        commentsSection.innerHTML = "<h2>댓글</h2><p>댓글이 없습니다.</p>";
        updateCommentCount();
      }
    })
    .catch((error) => {
      console.error("Error fetching comments:", error);
      commentsSection.innerHTML =
        "<h2>댓글</h2><p>댓글을 불러오는 중 오류가 발생했습니다.</p>";
    });
}
