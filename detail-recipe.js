// JWT 토큰에서 사용자 정보 가져오기 함수
function getUserInfoFromToken() {
  const token = localStorage.getItem("authToken"); // JWT 토큰 가져오기
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // JWT의 payload를 디코딩
    return payload; // payload에서 사용자 정보 반환
  } catch (error) {
    console.error("JWT 디코딩 중 오류 발생:", error);
    return null;
  }
}

// 댓글 작성 버튼과 연결
document.querySelector(".new-comment button").addEventListener("click", async () => {
  const commentText = document.querySelector(".new-comment textarea").value.trim();
  if (!commentText) {
    alert("댓글을 입력해주세요!");
    return;
  }

  // 게시글 ID 가져오기
  const articleElement = document.querySelector(".article");
  const articleId = articleElement ? parseInt(articleElement.dataset.articleId) : 0;

  // 사용자 이름 가져오기
  const userInfo = getUserInfoFromToken();
  const username = userInfo ? userInfo.username : "알 수 없는 사용자";

  try {
    const newComment = await createComment(commentText, articleId); // 댓글 작성 요청
    addCommentToUI(newComment, commentText, username); // UI에 댓글 추가
    document.querySelector(".new-comment textarea").value = ""; // 입력창 초기화
    updateCommentCount(); // 댓글 수 업데이트
  } catch (error) {
    console.error(error);
  }
});

// UI에 댓글 추가 함수 (사용자 이름 반영)
function addCommentToUI(responseData, commentText, username) {
  const commentSection = document.querySelector(".comments-section");
  const newCommentHTML = `
    <div class="comment" data-comment-id="${responseData.data.id || ""}">
      <div class="comment-content">
        <strong>${username}</strong>
        <p>${commentText}</p>
        <div class="comment-meta">작성일: ${new Date().toISOString().slice(0, 10)}</div>
      </div>
      <span class="heart-icon">❤️</span>
    </div>
  `;
  commentSection.insertAdjacentHTML("beforeend", newCommentHTML);
}

// 댓글 작성 API 요청 함수
async function createComment(comment, articleId, parentId = 0) {
  const url = "/api/v1/comment"; // API 엔드포인트
  const token = localStorage.getItem("authToken"); // JWT 토큰 가져오기

  const requestBody = {
    comment: comment,
    articleId: articleId,
    parentId: parentId,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "댓글 작성 실패");
    }

    const responseData = await response.json();
    console.log("댓글 작성 성공:", responseData);
    return responseData;
  } catch (error) {
    console.error("댓글 작성 중 오류 발생:", error);
    throw error;
  }
}

// 댓글 수 업데이트 함수
function updateCommentCount() {
  const commentCount = document.querySelectorAll(".comments-section .comment").length;
  console.log(`현재 댓글 수: ${commentCount}`);
}
