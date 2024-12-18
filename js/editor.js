// editor.js

document.addEventListener("DOMContentLoaded", function () {
  const quill = new Quill("#editor", {
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline"],
        ["image", "code-block"],
      ],
    },
    placeholder: "Compose an epic recipe...",
    theme: "snow",
  });

  const authToken = localStorage.getItem("authToken");
  if (!authToken) {
    alert("글을 작성하려면 로그인해주세요.");
    window.location.href = "login.html";
  }

  const queryParams = new URLSearchParams(window.location.search);
  const articleId = queryParams.get("articleId");
  const submitButton = document.getElementById("editor-btn");

  // 수정 모드일 경우 기존 게시글 정보 로드
  if (articleId) {
    // 버튼 텍스트 변경
    submitButton.textContent = "수정하기";

    // 기존 게시글 로드
    fetch(`https://food-social.kro.kr/api/v1/article/detail?articleId=${articleId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.data) {
          const article = data.data;
          document.getElementById("recipe-title").value = article.title;
          document.getElementById("category").value = article.category;
          quill.root.innerHTML = article.content;
        } else {
          alert("게시글 정보를 불러올 수 없습니다.");
          console.error(data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching article details:", error);
      });
  }

  submitButton.addEventListener("click", () => {
    const title = document.getElementById("recipe-title").value.trim();
    const category = document.getElementById("category").value.trim();
    const content = quill.root.innerHTML.trim();

    if (!title || !category || !content) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const images = extractImages(content);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("content", content);

    images.forEach((image) => {
      if (image.startsWith("data:image")) {
        formData.append("images[]", image);
      } else {
        formData.append("images[]", image);
      }
    });

    let requestUrl = "https://food-social.kro.kr/api/v1/article/new";
    let method = "POST";

    // articleId가 있으면 수정 모드
    if (articleId) {
      requestUrl = `https://food-social.kro.kr/api/v1/article/modify/${articleId}`;
      method = "PUT";
    }

    fetch(requestUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
      },
      method: method,
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          if (articleId) {
            alert("성공적으로 글을 수정하였습니다.");
          } else {
            alert("성공적으로 글을 등록하였습니다.");
          }
          window.location.href = "recipes.html";
        } else {
          if (articleId) {
            alert("글을 수정하는데 실패하였습니다. 다시 시도해주세요.");
          } else {
            alert("글을 올리는데 실패하였습니다. 다시 시도해주세요.");
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        if (articleId) {
          alert("글을 수정하는 중 오류가 발생하였습니다. 다시 시도해주세요.");
        } else {
          alert("글을 올리는 중 오류가 발생하였습니다. 다시 시도해주세요.");
        }
      });
  });

  function extractImages(content) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");

    const imgElements = doc.querySelectorAll("img");
    const images = [];

    imgElements.forEach((img) => {
      const imgSrc = img.src;
      if (imgSrc && imgSrc.startsWith("data:image")) {
        images.push(imgSrc);
      } else if (imgSrc) {
        images.push(imgSrc);
      }
    });

    console.log(images);
    return images;
  }
});
