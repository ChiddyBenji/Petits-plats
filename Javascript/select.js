import { createTag } from './tag.js';  // Assurez-vous que cette fonction est bien définie
import recipes from "./recipes.js";  // Importation de vos recettes
import displayRecipes from "./recette.js";  // Importation de la fonction d'affichage des recettes
import { updateRecipeCount } from './recette.js';  // Importation de la fonction pour mettre à jour le compte des recettes

export function closeAllSelects() {
    selectBoxes.forEach(box => {
        const boxInput = box.querySelector('input');
        const boxOptionsContainer = box.querySelector('.options-container');
        boxInput.style.display = 'none';
        boxOptionsContainer.style.display = 'none';
        box.classList.remove('open');
    });
}

// Fonction pour peupler les options du menu déroulant en fonction des valeurs uniques
function populateOptionsForSelectBox(selectBox, uniqueValues) {
    const optionsContainer = selectBox.querySelector('.options-container');
    optionsContainer.innerHTML = ''; // Vide le conteneur avant d'ajouter de nouvelles options
    
    const ul = document.createElement('ul');
    optionsContainer.appendChild(ul);

    uniqueValues.forEach(value => {
        const li = document.createElement('li');
        li.classList.add('option');
        li.textContent = value;

        // Crée un tag lorsque l'utilisateur sélectionne une option
        li.addEventListener('click', () => {
            const input = selectBox.querySelector('input');
            input.value = value; // Met la valeur dans l'input
            createTag(value); // Crée un tag immédiatement après la sélection de l'option

            // Met à jour les options des autres menus en cascade
            applyCascadeFilter();
            
        });
        
        ul.appendChild(li);
    });
}

// Fonction pour mettre à jour les options des select-box en cascade
export function updateSelectOptions(filteredRecipes) {
    const selectBoxes = document.querySelectorAll('.select-box');
    let selectedIngredients = new Set(); 
    let selectedAppliances = new Set();
    let selectedUtensils = new Set();

    filteredRecipes.forEach(recipe => {
        recipe.ingredients.forEach(ing => selectedIngredients.add(ing.ingredient));
        selectedAppliances.add(recipe.appliance);
        recipe.ustensils.forEach(ust => selectedUtensils.add(ust));
    });

    selectBoxes.forEach(selectBox => {
        const paragraph = selectBox.querySelector('p');
        const type = paragraph.textContent.toLowerCase();

        if (type.includes('ingrédient')) {
            populateOptionsForSelectBox(selectBox, Array.from(selectedIngredients));
        } else if (type.includes('appareil')) {
            const filteredAppliances = filteredRecipes
                .filter(recipe => Array.from(selectedIngredients).some(ingredient =>
                    recipe.ingredients.some(ing => ing.ingredient === ingredient)))
                .map(recipe => recipe.appliance);
            populateOptionsForSelectBox(selectBox, Array.from(new Set(filteredAppliances)));
        } else if (type.includes('ustensile')) {
            const filteredUtensils = filteredRecipes
                .filter(recipe => Array.from(selectedAppliances).some(appliance => recipe.appliance === appliance))
                .flatMap(recipe => recipe.ustensils);
            populateOptionsForSelectBox(selectBox, Array.from(new Set(filteredUtensils)));
        }
    });

    // Met à jour le nombre de recettes affichées
    updateRecipeCount(filteredRecipes);
}

// Fonction pour filtrer les recettes en cascade
function applyCascadeFilter() {
    const selectBoxes = document.querySelectorAll('.select-box');
    const ingredientInput = selectBoxes[0].querySelector('input').value;
    const applianceInput = selectBoxes[1].querySelector('input').value;

    let filteredRecipes = recipes;

    if (ingredientInput) {
        filteredRecipes = filteredRecipes.filter(recipe =>
            recipe.ingredients.some(ing => ing.ingredient === ingredientInput));
    }
    
    if (applianceInput) {
        filteredRecipes = filteredRecipes.filter(recipe => recipe.appliance === applianceInput);
    }

    updateSelectOptions(filteredRecipes);
}

// Filtre les recettes en fonction du champ de recherche global
function filterRecipes(searchTerm) {
    let filteredRecipes = recipes.filter(recipe => {
        const lowerCaseTerm = searchTerm.toLowerCase();
        return recipe.name.toLowerCase().includes(lowerCaseTerm) ||
               recipe.description.toLowerCase().includes(lowerCaseTerm) ||
               recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(lowerCaseTerm));
    });

    // Met à jour les options des select-box en cascade
    updateSelectOptions(filteredRecipes);
    
    // Met à jour le nombre de recettes affichées en fonction des filtres appliqués
    updateRecipeCount(filteredRecipes);
}

const selectBoxes = document.querySelectorAll('.select-box');

// Gestion de l'ouverture et de la fermeture des menus déroulants
selectBoxes.forEach(selectBox => {
    const input = selectBox.querySelector('input');
    const optionsContainer = selectBox.querySelector('.options-container');
    const paragraph = selectBox.querySelector('p');
    const icon = selectBox.querySelector('i');

    let isMenuOpen = false;

    function toggleMenu() {
        const isOpen = optionsContainer.style.display === 'flex';
        closeAllSelects();
        optionsContainer.style.display = isOpen ? 'none' : 'flex';
        input.style.display = isOpen ? 'none' : 'flex'; // Cache l'input si le menu est fermé
        selectBox.classList.toggle('open', !isOpen);
        isMenuOpen = !isOpen; // Met à jour l'état du menu
    }

    paragraph.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleMenu();
    });

    icon.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleMenu();
    });

    selectBox.addEventListener('click', (event) => {
        event.stopPropagation(); // je ne veux pas que ca se propage a ses parents 
        if (event.target !== input) {
            toggleMenu();
        }
    });

    // Filtrage des options en fonction de l'input dans le champ de recherche
    input.addEventListener('input', () => {
        const searchValue = input.value.toLowerCase();

        if (searchValue === '') {
            updateSelectOptions(recipes); // Affiche toutes les options
        } else {
            const allOptions = Array.from(optionsContainer.querySelectorAll('.option'));
            const filteredOptions = allOptions.filter(option =>
                option.textContent.toLowerCase().includes(searchValue)
            );

            optionsContainer.querySelector('ul').innerHTML = '';  // Vide les options affichées
            filteredOptions.forEach(option => optionsContainer.querySelector('ul').appendChild(option));

            if (!filteredOptions.length && searchValue) {
                optionsContainer.querySelector('ul').innerHTML = '<li class="no-results">Aucune option trouvée</li>';
            }
        }

        if (!isMenuOpen) {
            toggleMenu();
        }
    });

    closeAllSelects();
    
});

// Écouteur de l'input de recherche global (filtre des recettes)
const filterInput = document.querySelector('.filter input');
filterInput.addEventListener('input', () => {
    const searchTerm = filterInput.value;
    filterRecipes(searchTerm);
});

// Ferme tous les menus lorsqu'on clique à l'extérieur d'une select-box
document.addEventListener('click', (event) => {
    if (!event.target.closest('.select-box')) {
        selectBoxes.forEach(selectBox => {
            const optionsContainer = selectBox.querySelector('.options-container');
            const input = selectBox.querySelector('input');
            optionsContainer.style.display = 'none';
            input.style.display = 'none';
            selectBox.classList.remove('open');
        });
    }
});