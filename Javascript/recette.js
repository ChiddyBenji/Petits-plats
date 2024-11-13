import recipes from "./recipes.js";

const recipeContainer = document.querySelector('.contain-cards');
const recipeCountElement = document.querySelector('#recipe-count');  // Assurez-vous que cet élément existe dans votre HTML

// Fonction pour afficher les recettes
export default function displayRecipes(filteredRecipes) {
    recipeContainer.innerHTML = ''; // Vide le conteneur avant d'afficher les nouvelles recettes

    filteredRecipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('cards');

        const imgContainer = document.createElement('div');
        imgContainer.classList.add('contain-img-cards');

        const img = document.createElement('img');
        img.src = `JSON recipes/${recipe.image}`;
        img.alt = recipe.name;

        imgContainer.appendChild(img);

        const textContainer = document.createElement('div');
        textContainer.classList.add('contain-text-cards');

        const textFirst = document.createElement('div');
        textFirst.classList.add('text-cards-first');
        const title = document.createElement('h2');
        title.textContent = recipe.name;
        const subtitle = document.createElement('h3');
        subtitle.textContent = 'Recette';
        const description = document.createElement('p');
        description.textContent = recipe.description;

        textFirst.appendChild(title);
        textFirst.appendChild(subtitle);
        textFirst.appendChild(description);

        const textSecond = document.createElement('div');
        textSecond.classList.add('text-cards-second');
        const ingredientsTitle = document.createElement('h3');
        ingredientsTitle.textContent = 'Ingrédients';
        const gridContainer = document.createElement('div');
        gridContainer.classList.add('contain-grids-cards');

        recipe.ingredients.forEach(ing => {
            const gridCard = document.createElement('div');
            gridCard.classList.add('grid-cards');

            const ingredientName = document.createElement('h4');
            ingredientName.textContent = ing.ingredient;

            const ingredientQuantity = document.createElement('p');
            ingredientQuantity.textContent = `${ing.quantity || ''} ${ing.unit || ''}`;

            gridCard.appendChild(ingredientName);
            gridCard.appendChild(ingredientQuantity);
            gridContainer.appendChild(gridCard);
        });

        textSecond.appendChild(ingredientsTitle);
        textSecond.appendChild(gridContainer);
        textContainer.appendChild(textFirst);
        textContainer.appendChild(textSecond);

        recipeCard.appendChild(imgContainer);
        recipeCard.appendChild(textContainer);

        recipeContainer.appendChild(recipeCard);
    });
}

// Fonction pour mettre à jour le nombre de recettes
export function updateRecipeCount(filteredRecipes) {
    console.log("Mise à jour du nombre de recettes :", filteredRecipes.length); // Log pour vérifier
    if (recipeCountElement) {
        recipeCountElement.textContent = `${filteredRecipes.length} recette${filteredRecipes.length > 1 ? 's' : ''} disponibles`;
    }
}

// Afficher les recettes initiales
displayRecipes(recipes);
updateRecipeCount(recipes);