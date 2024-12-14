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
    theme: "snow", // or 'bubble'
  });

  const submitButton = document.getElementById("editor-btn");
  submitButton.addEventListener("click", () => {
    const title = document.getElementById("recipe-title").value;
    const category = document.getElementById("category").value;

    const content = quill.root.innerHTML;

    if (!title || !category || !content) {
      alert("Please fill all fields.");
      return;
    }

    const images = extractImages(content);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("content", content);

    images.forEach((image, index) => {
      if (image.startsWith("data:image")) {
        formData.append("images[]", image);
      } else {
        formData.append("images[]", image);
      }
    });

    const authToken = localStorage.getItem("authToken");

    fetch("https://food-social.kro.kr/api/v1/article/new", {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
      },
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          alert("성공적으로 글을 등록하였습니다.");

          window.location.href = "recipes.html";
        } else {
          alert("글을 올리는데 실패하였습니다. 다시 시도해주세요.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("글을 올리는데 실패하였습니다. 다시 시도해주세요.");
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

    return images;
  }
});

// function removeIngredient(button) {
//   const ingredientContainer = button.parentElement;
//   ingredientContainer.remove();
// }

// const ingredientsList = document.getElementById("ingredients-list");
// const ingredientButton = document.getElementById("ingredient-btn");

// ingredientButton.onclick = () => {
//   const ingredientContainer = document.createElement("div");
//   ingredientContainer.className = "ingredient-container";

//   const ingredient = document.createElement("input");
//   ingredient.className = "ingredient";
//   ingredient.placeholder = "Ingredient";
//   ingredient.text = "text";

//   const removeButton = document.createElement("button");
//   removeButton.className = "btn remove-btn";
//   removeButton.textContent = "-";

//   removeButton.onclick = () => {
//     ingredientContainer.remove();
//   };

//   const amount = document.createElement("input");
//   amount.className = "ingredient-amount";
//   amount.placeholder = "Amount";
//   amount.text = "text";

//   ingredientContainer.appendChild(ingredient);
//   ingredientContainer.appendChild(removeButton);
//   ingredientContainer.appendChild(amount);

//   ingredientsList.appendChild(ingredientContainer);
// };
