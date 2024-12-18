async function fetchRecipeData() {
  try {
    const authToken = localStorage.getItem("authToken");
    const articlesContainer = document.querySelector(".articles-container");

    // 로그인 상태 확인
    if (!authToken) {
      articlesContainer.innerHTML = `
        <div class="message-container">
          <span class="message-icon">🔒</span>
          <h2 class="message-title">로그인이 필요합니다</h2>
          <p class="message-text">
            원하는 요리사를 팔로우 하고싶다면 로그인해주세요.<br />
            맛있는 레시피가 기다리고 있어요!
          </p>
          <a href="login.html" class="message-button">로그인 하러 가기</a>
        </div>
      `;
      return;
    }

    const response = await fetch(
      "https://food-social.kro.kr/api/v1/article/following-articles",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    if (data.success) {
      const articles = data.data;
      articlesContainer.innerHTML = ""; // 기존 컨텐츠 초기화

      // 게시글이 없을 경우
      if (!articles || articles.length === 0) {
        articlesContainer.innerHTML = `
          <div class="message-container">
            <span class="message-icon">🥄</span>
            <h2 class="message-title">팔로우한 사용자가 없습니다</h2>
            <p class="message-text">
              팔로우한 사용자의 게시글이 여기에 표시됩니다.<br />
              좋아하는 요리사를 찾아 팔로우해보세요!
            </p>
            <a href="recipes.html" class="message-button">요리사 찾으러 가기</a>
          </div>
        `;
        return;
      }

      // 게시글 렌더링
      articles.forEach((article) => {
        const articlePost = document.createElement("div");
        articlePost.classList.add("article-post");

        const articleHeader = document.createElement("div");
        articleHeader.classList.add("article-header");

        const authorProfileImage = document.createElement("img");
        authorProfileImage.src =
          article.image || "../logoimage/profile.jpg"; // 기본 프로필 이미지
        authorProfileImage.alt = article.nickname;
        authorProfileImage.classList.add("author-profile-image");

        const authorName = document.createElement("div");
        authorName.classList.add("author-name");
        authorName.textContent = article.nickname || "Unknown";

        articleHeader.appendChild(authorProfileImage);
        articleHeader.appendChild(authorName);

        const articleImage = document.createElement("img");
        articleImage.src = article.image || "../logoimage/salad.jpg";
        articleImage.alt = article.title;
        articleImage.classList.add("article-image");

        const articleDescription = document.createElement("div");
        articleDescription.classList.add("article-description");

        const articleTitle = document.createElement("h3");
        articleTitle.textContent = article.title;

        const articleWriter = document.createElement("p");
        articleWriter.textContent = `요리사: ${article.nickname}`;

        articleDescription.appendChild(articleTitle);
        articleDescription.appendChild(articleWriter);

        articlePost.appendChild(articleHeader);
        articlePost.appendChild(articleImage);
        articlePost.appendChild(articleDescription);

        articlesContainer.appendChild(articlePost);

        articlePost.addEventListener("click", () => {
          window.location.href = `detail-recipe.html?id=${article.id}`;
        });
      });
    } else {
      console.error("Error: ", data.message);
    }
  } catch (error) {
    console.error("There was a problem with the fetch operation: ", error);
    const articlesContainer = document.querySelector(".articles-container");
    articlesContainer.innerHTML = `
      <div class="message-container">
        <span class="message-icon">❗</span>
        <h2 class="message-title">오류 발생</h2>
        <p class="message-text">
          서버와 통신 중 오류가 발생했습니다.<br />
          다시 시도해 주세요.
        </p>
      </div>
    `;
  }
}

window.onload = fetchRecipeData;
