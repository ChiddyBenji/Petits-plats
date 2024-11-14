export function applyMainFilter() {
    const filterText = filterInput.value.toLowerCase();  // Texte de recherche
    const tags = Array.from(document.querySelectorAll('.tags p')).map(tag => tag.textContent.toLowerCase());  // Récupère les tags

    console.log("Filtrage par texte :", filterText); // Log du texte de recherche

    // Filtrage des recettes par le texte de recherche
    let filteredRecipes = recipes.filter(recipe => {
        if (recipe.name.toLowerCase().includes(filterText) || 
            recipe.description.toLowerCase().includes(filterText) || 
            recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(filterText))) {
            return true;
        } else {
            return false;
        }
    });

    // Log du nombre de recettes après filtrage
    console.log("Nombre de recettes après filtrage principal :", filteredRecipes.length);

    // Filtrage des recettes par les tags
    filteredRecipes = filteredRecipes.filter(recipe => {
        let matchAllTags = true;

        for (let tag of tags) {
            if (!(recipe.name.toLowerCase().includes(tag) || 
                recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(tag)) || 
                recipe.appliance.toLowerCase().includes(tag) || 
                recipe.ustensils.some(ust => ust.toLowerCase().includes(tag))) ) {
                matchAllTags = false;
                break;  // Si un tag ne correspond pas, on arrête et on ne garde pas la recette
            }
        }

        if (matchAllTags) {
            return true;  // Si tous les tags correspondent, on garde la recette
        } else {
            return false;  // Si un tag ne correspond pas, on ne garde pas la recette
        }
    });

    // Log après filtrage par tags
    console.log("Nombre de recettes après filtrage par tags :", filteredRecipes.length);

    // Si aucune recette n'est trouvée, on affiche un message
    if (filteredRecipes.length === 0) {
        displayNoResultsMessage(filterText);  // Afficher le message si aucune recette n'est trouvée
    } else {
        // Sinon, on affiche les recettes et met à jour les options
        displayRecipes(filteredRecipes);  // Afficher les recettes filtrées
        updateSelectOptions(filteredRecipes);  // Mettre à jour les options du select
        updateRecipeCount(filteredRecipes);  // Mettre à jour le nombre de recettes affichées
    }
}
