export function applyMainFilter() {
    const filterText = filterInput.value.toLowerCase();  // Texte de recherche
    const tags = Array.from(document.querySelectorAll('.tags p')).map(tag => tag.textContent.toLowerCase());  // Récupère les tags

    console.log("Filtrage par texte :", filterText); // Log du texte de recherche

    // Initialisation du tableau pour les recettes filtrées
    let filteredRecipes = [];

    // Boucle pour filtrer les recettes par le texte de recherche
    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        let textMatch = false;

        // Vérification du texte de recherche dans le nom de la recette
        if (recipe.name.toLowerCase().indexOf(filterText) !== -1) {
            textMatch = true;
        }

        // Vérification du texte de recherche dans la description
        if (!textMatch && recipe.description.toLowerCase().indexOf(filterText) !== -1) {
            textMatch = true;
        }

        // Vérification du texte de recherche dans les ingrédients
        if (!textMatch) {
            for (let j = 0; j < recipe.ingredients.length; j++) {
                if (recipe.ingredients[j].ingredient.toLowerCase().indexOf(filterText) !== -1) {
                    textMatch = true;
                    break;
                }
            }
        }

        // Ajout de la recette si elle correspond au texte de recherche
        if (textMatch) {
            filteredRecipes.push(recipe);
        }
    }

    // Log du nombre de recettes après filtrage principal
    console.log("Nombre de recettes après filtrage principal :", filteredRecipes.length);

    // Filtrage des recettes par les tags
    let recipesWithTags = [];

    for (let i = 0; i < filteredRecipes.length; i++) {
        const recipe = filteredRecipes[i];
        let matchAllTags = true;

        for (let j = 0; j < tags.length; j++) {
            const tag = tags[j];
            let tagMatch = false;

            // Vérification du tag dans le nom de la recette
            if (recipe.name.toLowerCase().indexOf(tag) !== -1) {
                tagMatch = true;
            }

            // Vérification du tag dans les ingrédients
            if (!tagMatch) {
                for (let k = 0; k < recipe.ingredients.length; k++) {
                    if (recipe.ingredients[k].ingredient.toLowerCase().indexOf(tag) !== -1) {
                        tagMatch = true;
                        break;
                    }
                }
            }

            // Vérification du tag dans l'appareil
            if (!tagMatch && recipe.appliance.toLowerCase().indexOf(tag) !== -1) {
                tagMatch = true;
            }

            // Vérification du tag dans les ustensiles
            if (!tagMatch) {
                for (let l = 0; l < recipe.ustensils.length; l++) {
                    if (recipe.ustensils[l].toLowerCase().indexOf(tag) !== -1) {
                        tagMatch = true;
                        break;
                    }
                }
            }

            // Si le tag ne correspond pas, arrêter la vérification pour cette recette
            if (!tagMatch) {
                matchAllTags = false;
                break;
            }
        }

        // Si tous les tags correspondent, ajouter la recette au tableau final
        if (matchAllTags) {
            recipesWithTags.push(recipe);
        }
    }

    // Log après filtrage par tags
    console.log("Nombre de recettes après filtrage par tags :", recipesWithTags.length);

    // Si aucune recette n'est trouvée, afficher le message
    if (recipesWithTags.length === 0) {
        displayNoResultsMessage(filterText);  // Afficher le message si aucune recette n'est trouvée
    } else {
        // Sinon, afficher les recettes et mettre à jour les options
        displayRecipes(recipesWithTags);  // Afficher les recettes filtrées
        updateSelectOptions(recipesWithTags);  // Mettre à jour les options du select
        updateRecipeCount(recipesWithTags);  // Mettre à jour le nombre de recettes affichées
    }
}
