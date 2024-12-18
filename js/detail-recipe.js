const authToken = localStorage.getItem("authToken");
let loggedInUserNickname = null;

const urlParams = new URLSearchParams(window.location.search);
const articleId = urlParams.get("id");

const headers = {
  "Content-Type": "application/json",
};

if (authToken) {
  headers["Authorization"] = `Bearer ${authToken}`;
}

function fetchUserNickname() {
  if (!authToken) return Promise.resolve(null);
  return fetch("https://food-social.kro.kr/api/v1/members/me", {
    method: "GET",
    headers: headers,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success && data.data && data.data.nickname) {
        return data.data.nickname;
      } else {
        return null;
      }
    })
    .catch((error) => {
      console.error("Error fetching user nickname:", error);
      return null;
    });
}

function updateCommentCount() {
  const commentCount = document.querySelectorAll(".comments-section .comment").length;
  const commentCountSpan = document.querySelector("#comment-count");
  if (commentCountSpan) {
    commentCountSpan.textContent = `💬 ${commentCount}`;
  }
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
              followStar.textContent =
                followStar.textContent === "☆" ? "⭐" : "☆";
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

      const images = postContent.querySelectorAll("img");
      images.forEach((img) => {
        img.style.maxWidth = "800px";
        img.style.height = "auto";
        img.style.width = "100%";
        img.style.display = "block";
        img.style.margin = "0 auto";
      });

      const stats = document.querySelector(".stats");
      stats.innerHTML =
        `<div class="heart-count">
          <span class="heart-icon" id="heart-icon">${article.myLike ? "❤️" : "🤍"}</span>
          <span id="heart-count">${article.likeCnt}</span>
        </div>
        <span id="comment-count">💬 ${article.cmtCnt}</span>`;

      const heartIcon = document.getElementById("heart-icon");
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
              fetchArticleDetails();
            } else {
              console.error("Failed to update heart count.");
            }
          })
          .catch((error) => {
            console.error("Error during fetch:", error);
          });
      });

      if (article.myArticle) {
        const postButtons = document.querySelector(".post-buttons");
        postButtons.style.display = "flex";

        const editButton = document.querySelector(".edit-button");
        editButton.addEventListener("click", function () {
          window.location.href = `editor.html?articleId=${articleId}`;
        });

        const deleteButton = document.querySelector(".delete-button");
        deleteButton.addEventListener("click", function () {
          if (!authToken) {
            alert("로그인이 필요합니다.");
            return;
          }
          fetch(`https://food-social.kro.kr/api/v1/article/delete/${articleId}`, {
            method: "DELETE",
            headers: headers,
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                alert("삭제되었습니다");
                window.location.href = "/";
              } else {
                alert("삭제 실패: " + data.message);
              }
            })
            .catch((error) => {
              console.error("Error deleting article:", error);
              alert("게시글 삭제 중 오류가 발생했습니다.");
            });
        });
      }

      const commentsSection = document.querySelector(".comments-section");
      commentsSection.innerHTML = "<h2>댓글</h2>";
      refreshComments(headers);
    })
    .catch((error) => {
      console.error("Error fetching article details:", error);
    });
}

function refreshComments(headers) {
  const commentsSection = document.querySelector(".comments-section");
  commentsSection.innerHTML = "<h2>댓글</h2>";

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

          const commentContentDiv = document.createElement("div");
          commentContentDiv.classList.add("comment-content");

          const authorStrong = document.createElement("strong");
          authorStrong.textContent = comment.nickname;

          const commentText = document.createElement("p");
          commentText.textContent = comment.comment;

          const commentMeta = document.createElement("div");
          commentMeta.classList.add("comment-meta");
          commentMeta.textContent = `작성일: ${comment.updatedAt}`;

          commentContentDiv.appendChild(authorStrong);
          commentContentDiv.appendChild(commentText);
          commentContentDiv.appendChild(commentMeta);

          commentElement.appendChild(commentContentDiv);

          if (loggedInUserNickname && comment.nickname === loggedInUserNickname) {
            const commentButtonsDiv = document.createElement("div");
            commentButtonsDiv.classList.add("comment-buttons");

            const editBtn = document.createElement("button");
            editBtn.textContent = "수정";
            editBtn.addEventListener("click", () => {
              enterEditMode(commentElement, comment.id, comment.comment, headers);
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "삭제";
            deleteBtn.addEventListener("click", () => {
              if (!authToken) {
                alert("로그인이 필요합니다.");
                return;
              }
              fetch(`https://food-social.kro.kr/api/v1/comment/${comment.id}`, {
                method: "DELETE",
                headers: headers,
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data.success) {
                    refreshComments(headers);
                  } else {
                    alert("댓글 삭제 실패: " + data.message);
                  }
                })
                .catch((error) => {
                  console.error("Error deleting comment:", error);
                  alert("댓글 삭제 중 오류가 발생했습니다.");
                });
            });

            commentButtonsDiv.appendChild(editBtn);
            commentButtonsDiv.appendChild(deleteBtn);
            commentElement.appendChild(commentButtonsDiv);
          }

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

function enterEditMode(commentElement, commentId, originalComment, headers) {
  commentElement.classList.add("editing"); // 수정 모드 스타일 적용
  const contentDiv = commentElement.querySelector(".comment-content");
  contentDiv.style.display = "none";

  const buttonsDiv = commentElement.querySelector(".comment-buttons");
  if (buttonsDiv) buttonsDiv.style.display = "none";

  const editForm = document.createElement("div");
  editForm.classList.add("comment-edit-form");

  const textarea = document.createElement("textarea");
  textarea.value = originalComment;

  const actionsDiv = document.createElement("div");
  actionsDiv.classList.add("edit-actions");

  const saveButton = document.createElement("button");
  saveButton.classList.add("save-button");
  saveButton.textContent = "저장";
  saveButton.addEventListener("click", () => {
    const updatedComment = textarea.value.trim();
    if (!updatedComment) {
      alert("수정할 댓글을 입력하세요!");
      return;
    }

    if (!localStorage.getItem("authToken")) {
      alert("로그인이 필요합니다.");
      return;
    }

    fetch(`https://food-social.kro.kr/api/v1/comment/${commentId}`, {
      method: "PATCH",
      headers: headers,
      body: JSON.stringify({ comment: updatedComment }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          refreshComments(headers);
        } else {
          alert("댓글 수정 실패: " + data.message);
        }
      })
      .catch((error) => {
        console.error("Error editing comment:", error);
        alert("댓글 수정 중 오류가 발생했습니다.");
      });
  });

  const cancelButton = document.createElement("button");
  cancelButton.classList.add("cancel-button");
  cancelButton.textContent = "취소";
  cancelButton.addEventListener("click", () => {
    editForm.remove();
    commentElement.classList.remove("editing");
    contentDiv.style.display = "block";
    if (buttonsDiv) buttonsDiv.style.display = "flex";
  });

  actionsDiv.appendChild(saveButton);
  actionsDiv.appendChild(cancelButton);

  editForm.appendChild(textarea);
  editForm.appendChild(actionsDiv);

  commentElement.appendChild(editForm);
}

if (articleId) {
  fetchUserNickname().then((nickname) => {
    loggedInUserNickname = nickname;
    fetchArticleDetails();
  });
} else {
  console.error("Article ID is missing in the URL");
  alert("유효하지 않은 게시글입니다.");
}

const commentButton = document.querySelector(".new-comment button");
const commentTextArea = document.querySelector(".new-comment textarea");

if (!authToken) {
  document.querySelector(".new-comment").style.display = "none";
} else {
  commentButton.addEventListener("click", function () {
    const commentContent = commentTextArea.value.trim();
    if (!commentContent) {
      alert("댓글을 입력하세요!");
      return;
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
