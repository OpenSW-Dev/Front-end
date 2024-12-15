async function fetchRecipeData() {
  try {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      console.error("Auth token is missing.");
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
      const articlesContainer = document.querySelector(".articles-container");

      articles.forEach((article) => {
        const articlePost = document.createElement("div");
        articlePost.classList.add("article-post");

        const articleHeader = document.createElement("div");
        articleHeader.classList.add("article-header");

        const authorProfileImage = document.createElement("img");
        authorProfileImage.src = article.image || "../logoimage/profile.jpg"; // Default profile image
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
        articleTitle.style.marginLeft = "15px";
        articleTitle.style.marginBottom = "0px";


        const articleWriter = document.createElement("p");
        articleWriter.textContent = `요리사: ${article.nickname}`;
        articleWriter.style.marginLeft = "20px";
        articleWriter.style.marginTop = "15px";

        articleDescription.appendChild(articleTitle);
        articleDescription.appendChild(articleWriter);

        articlePost.appendChild(articleHeader);
        articlePost.appendChild(articleImage);
        articlePost.appendChild(articleDescription);

        articlesContainer.appendChild(articlePost);
      });
    } else {
      console.error("Error: ", data.message);
    }
  } catch (error) {
    console.error("There was a problem with the fetch operation: ", error);
  }
}

window.onload = fetchRecipeData;
