import recipes from "./recipes.js";
import displayRecipes from "./recette.js";
import { updateSelectOptions } from "./select.js";
import { updateRecipeCount } from "./recette.js"; // Assurez-vous que cette fonction est importée

const filterInput = document.querySelector('.filter input');

export function applyMainFilter() {
    const filterText = filterInput.value.toLowerCase();
    const tags = Array.from(document.querySelectorAll('.tags p')).map(tag => tag.textContent.toLowerCase());


    let filteredRecipes = recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(filterText) ||
        recipe.description.toLowerCase().includes(filterText) ||
        recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(filterText))
    );



    filteredRecipes = filteredRecipes.filter(recipe => {
        return tags.every(tag =>
            recipe.name.toLowerCase().includes(tag) ||
            recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(tag)) ||
            recipe.appliance.toLowerCase().includes(tag) ||
            recipe.ustensils.some(ust => ust.toLowerCase().includes(tag))
        );
    });



    if (filteredRecipes.length === 0) {
        displayNoResultsMessage(filterText);  // Afficher le message si aucune recette n'est trouvée
    } else {
        displayRecipes(filteredRecipes); // Afficher les recettes filtrées
        updateSelectOptions(filteredRecipes); // Mettre à jour les options du select
        updateRecipeCount(filteredRecipes); // Mettre à jour le nombre de recettes affichées
    }
}

function displayNoResultsMessage(searchTerm) {
    const recipeContainer = document.querySelector('.contain-cards');
    recipeContainer.innerHTML = '';  // Vider le conteneur des recettes

    const noResultsMessage = document.createElement('div');
    noResultsMessage.classList.add('no-results-message');
    noResultsMessage.innerHTML = `Aucune recette ne contient <strong>“${searchTerm}”</strong>. Vous pouvez chercher « tarte aux pommes », « poisson », etc.`;

    recipeContainer.appendChild(noResultsMessage);
}

// Écouteur pour la recherche dans le champ principal
filterInput.addEventListener('input', () => {
    const filterText = filterInput.value.toLowerCase();
    if (filterText.length >= 3) {
        applyMainFilter(); // Appliquer le filtre principal
    } else {
        // Si le texte est inférieur à 3 caractères, afficher toutes les recettes
        displayRecipes(recipes);
        updateSelectOptions(recipes);
        updateRecipeCount(recipes); // Mettre à jour le nombre de recettes
    }
});

// Afficher les recettes et options initialement
displayRecipes(recipes);
updateSelectOptions(recipes);
updateRecipeCount(recipes); // Afficher le nombre de recettes initialement