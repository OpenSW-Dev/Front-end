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
});

function removeIngredient(button) {
  const ingredientContainer = button.parentElement;
  ingredientContainer.remove();
}

const ingredientsList = document.getElementById("ingredients-list");
const ingredientButton = document.getElementById("ingredient-btn");

ingredientButton.onclick = () => {
  const ingredientContainer = document.createElement("div");
  ingredientContainer.className = "ingredient-container";

  const ingredient = document.createElement("input");
  ingredient.className = "ingredient";
  ingredient.placeholder = "Ingredient";
  ingredient.text = "text";

  const removeButton = document.createElement("button");
  removeButton.className = "btn remove-btn";
  removeButton.textContent = "-";

  removeButton.onclick = () => {
    ingredientContainer.remove();
  };

  const amount = document.createElement("input");
  amount.className = "ingredient-amount";
  amount.placeholder = "Amount";
  amount.text = "text";

  ingredientContainer.appendChild(ingredient);
  ingredientContainer.appendChild(removeButton);
  ingredientContainer.appendChild(amount);

  ingredientsList.appendChild(ingredientContainer);
};
