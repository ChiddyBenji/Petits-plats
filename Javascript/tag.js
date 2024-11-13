import recipes from "./recipes.js"; // Assurez-vous que les recettes sont importées
import displayRecipes from "./recette.js"; // Assurez-vous que la fonction d'affichage est importée
import {applyMainFilter} from "./filtre-recette.js";

export function createTag(name) {
    const containTags = document.querySelector('.contain-tags');
    
    const tagDiv = document.createElement('div');
    tagDiv.classList.add('tags');

    const tagName = document.createElement('p');
    tagName.textContent = name;

    const closeIcon = document.createElement('i');
    closeIcon.classList.add('fa-solid', 'fa-xmark');
    closeIcon.setAttribute('aria-hidden', 'true');

    closeIcon.addEventListener('click', () => {
        containTags.removeChild(tagDiv);
        applyMainFilter();
    });

    tagDiv.appendChild(tagName);
    tagDiv.appendChild(closeIcon);
    containTags.appendChild(tagDiv);

    applyMainFilter(); // Filtre les recettes lorsque le tag est créé
}