fetch("https://food-social.kro.kr/api/v1/article/total")
  .then((response) => response.json())
  .then((data) => {
    const articles = data.data;
    const gridContainer = document.querySelector(".grid-container");
    gridContainer.innerHTML = ""; // 기존 컨텐츠 초기화

    articles.forEach((article) => {
      // 그리드 아이템 생성
      const gridItem = document.createElement("div");
      gridItem.classList.add("grid-item");

      // 링크 추가
      const articleLink = document.createElement("a");
      articleLink.classList.add("article-link");
      articleLink.href = `detail-recipe.html?id=${article.id}`;

      // 이미지 추가
      const articleImage = document.createElement("img");
      articleImage.src = article.image || "../logoimage/salad.jpg";
      articleImage.alt = article.title;
      articleImage.classList.add("article-image");

      // 정보 컨테이너
      const articleInfo = document.createElement("div");
      articleInfo.classList.add("article-info");

      // 제목 추가
      const articleTitle = document.createElement("h3");
      articleTitle.classList.add("article-title");
      articleTitle.textContent = article.title;

      // 메타 정보 추가
      const articleMeta = document.createElement("div");
      articleMeta.classList.add("article-meta");

      const articleWriter = document.createElement("span");
      articleWriter.textContent = `요리사: ${article.nickname || "알 수 없음"}`;

      articleMeta.appendChild(articleWriter);
      articleInfo.appendChild(articleTitle);
      articleInfo.appendChild(articleMeta);

      // 요소 조립
      articleLink.appendChild(articleImage);
      articleLink.appendChild(articleInfo);
      gridItem.appendChild(articleLink);

      gridContainer.appendChild(gridItem);
    });
  })
  .catch((error) => {
    console.error("Error fetching articles:", error);
  });
