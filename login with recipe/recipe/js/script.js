document.getElementById("searchButton").addEventListener("click", async () => {
  const query = document.getElementById("recipeSearch").value;
  const recipesContainer = document.getElementById("recipes");

  if (!query) {
    alert("Please enter a recipe name.");
    return;
  }

  try {
    const response = await fetch(
      `https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(
        query
      )}&app_id=330993dc&app_key=37a2fb68c84ad122d7f405f2b06d4c8e`
    );
    const data = await response.json();

    recipesContainer.innerHTML = "";
    if (data.hits.length > 0) {
      data.hits.forEach((hit) => {
        const recipe = hit.recipe;
        recipesContainer.innerHTML += `
        <br><br>
          <div class="recipe" data-recipe='${JSON.stringify(recipe)}'>
            <img src="${recipe.image}" alt="${recipe.label}">
            <h2>${recipe.label}</h2>
            <p>${recipe.ingredientLines.slice(0, 3).join(", ")}...</p>
          </div>
        `;
      });
    } else {
      recipesContainer.innerHTML =
        "<p><h1><h1><h1><h1>No recipes found.</h1></h1></h1></h1></p>";
    }
  } catch (error) {
    console.error("Error fetching recipes:", error);
    recipesContainer.innerHTML = "<p>Error fetching recipes.</p>";
  }
});

document.getElementById("recipes").addEventListener("click", (event) => {
  if (event.target.closest(".recipe")) {
    const recipe = JSON.parse(
      event.target.closest(".recipe").getAttribute("data-recipe")
    );
    const recipeDetail = document.getElementById("recipeDetail");
    const recipeContent = document.getElementById("recipeContent");

    // Clean up the recipeContent HTML to show only the image and the recipe text
    recipeContent.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.label}">
      <h2>${recipe.label}</h2>
      <p>${recipe.ingredientLines.join("<br>")}</p>
    `;

    recipeDetail.classList.remove("hidden");
    recipeDetail.classList.add("visible");
  }
});

document.getElementById("closeDetail").addEventListener("click", () => {
  const recipeDetail = document.getElementById("recipeDetail");
  recipeDetail.classList.remove("visible");
  recipeDetail.classList.add("hidden");
});
