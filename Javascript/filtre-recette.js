import recipes from "./recipes.js";
import displayRecipes from "./recette.js";
import { updateSelectOptions } from "./select.js";
import { updateRecipeCount } from "./recette.js"; // Assurez-vous que cette fonction est importée

const filterInput = document.querySelector('.filter input');

// filtre-recette.js
export function applyMainFilter() {
    const filterText = filterInput.value.toLowerCase(); // Texte de recherche principal
    const tags = Array.from(document.querySelectorAll('.tags p')).map(tag => tag.textContent.toLowerCase()); // Liste des tags actifs

    

    // Étape 1 : Filtrage par texte
    let filteredRecipes = [];
    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        let textMatch = false;

        // Vérification du texte dans le nom de la recette
        if (recipe.name.toLowerCase().includes(filterText)) {
            textMatch = true;
        }

        // Vérification du texte dans la description
        if (!textMatch && recipe.description.toLowerCase().includes(filterText)) {
            textMatch = true;
        }

        // Vérification du texte dans les ingrédients
        if (!textMatch) {
            for (let j = 0; j < recipe.ingredients.length; j++) {
                if (recipe.ingredients[j].ingredient.toLowerCase().includes(filterText)) {
                    textMatch = true;
                    break;
                }
            }
        }

        // Ajouter la recette si elle correspond au texte
        if (textMatch) {
            filteredRecipes.push(recipe);
        }
    }

    

    // Étape 2 : Filtrage par tags
    let recipesWithTags = [];
    for (let i = 0; i < filteredRecipes.length; i++) {
        const recipe = filteredRecipes[i];
        let matchAllTags = true;

        // Vérification de chaque tag
        for (let j = 0; j < tags.length; j++) {
            const tag = tags[j];
            let tagMatch = false;

            // Vérification du tag dans le nom de la recette
            if (recipe.name.toLowerCase().includes(tag)) {
                tagMatch = true;
            }

            // Vérification du tag dans les ingrédients
            if (!tagMatch) {
                for (let k = 0; k < recipe.ingredients.length; k++) {
                    if (recipe.ingredients[k].ingredient.toLowerCase().includes(tag)) {
                        tagMatch = true;
                        break;
                    }
                }
            }

            // Vérification du tag dans l'appareil
            if (!tagMatch && recipe.appliance.toLowerCase().includes(tag)) {
                tagMatch = true;
            }

            // Vérification du tag dans les ustensiles
            if (!tagMatch) {
                for (let l = 0; l < recipe.ustensils.length; l++) {
                    if (recipe.ustensils[l].toLowerCase().includes(tag)) {
                        tagMatch = true;
                        break;
                    }
                }
            }

            // Si un tag ne correspond pas, arrêter la vérification pour cette recette
            if (!tagMatch) {
                matchAllTags = false;
                break;
            }
        }

        // Ajouter la recette si tous les tags correspondent
        if (matchAllTags) {
            recipesWithTags.push(recipe);
        }
    }


    // Étape 3 : Affichage des résultats
    if (recipesWithTags.length === 0) {
        displayNoResultsMessage(filterText); // Message si aucune recette n'est trouvée
    } else {
        displayRecipes(recipesWithTags); // Affichage des recettes
        updateSelectOptions(recipesWithTags); // Mise à jour des options
        updateRecipeCount(recipesWithTags); // Mise à jour du nombre de recettes
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