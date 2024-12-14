fetch("https://food-social.kro.kr/api/v1/article/total")
  .then((response) => response.json())
  .then((data) => {
    const articles = data.data;
    const gridContainer = document.querySelector(".grid-container");

    articles.forEach((article) => {
      const gridItem = document.createElement("div");
      gridItem.classList.add("grid-item");

      const articleLink = document.createElement("a");
      articleLink.classList.add("article-link");
      articleLink.href = `detail-recipe.html?id=${article.id}`;

      const articleImage = document.createElement("img");

      articleImage.src = article.image
        ? article.image
        : "../logoimage/salad.jpg";
      articleImage.alt = article.title;
      articleImage.classList.add("article-image");

      articleImage.style.width = "400px";
      articleImage.style.height = "400px";
      articleImage.style.objectFit = "cover";

      const articleInfo = document.createElement("div");
      articleInfo.classList.add("article-info");

      const articleTitle = document.createElement("h3");
      articleTitle.textContent = article.title;

      const articleWriter = document.createElement("p");
      articleWriter.textContent = `요리사: ${article.nickname}`;

      const articleLikes = document.createElement("p");
      articleLikes.textContent = `좋아요: ${article.likes}`;

      const articleMeta = document.createElement("div");
      articleMeta.classList.add("article-meta");
      articleMeta.appendChild(articleWriter);
      articleMeta.appendChild(articleLikes);

      articleInfo.appendChild(articleTitle);
      articleInfo.appendChild(articleMeta);
      articleLink.appendChild(articleImage);
      articleLink.appendChild(articleInfo);
      gridItem.appendChild(articleLink);

      gridContainer.appendChild(gridItem);
    });
  })
  .catch((error) => {
    console.error("Error fetching articles:", error);
  });
