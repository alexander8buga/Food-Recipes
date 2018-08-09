// Global app controller
import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';

import {elements, renderLoader, clearLoader} from './views/base';
import Recipe from './models/Recipe';


/** Global state of the app
* - Search object
* - Current recipe object
* - Shopping list object
* - Linked recipes
*/

const state = {};

const controlSearch = async () => {
  // 1) get the query from the viewport
  const query = searchView.getInput();
  console.log(query);

  if (query) {
    // 2) new search object and add to state
    state.search = new Search(query);
    // 3) prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchResult);
    try{
      // 4) search for Recipes
      await state.search.getResults();

      // 5) render results on UI
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch(error){
      alert("Something went wrong when rendering results!");
      clearLoader();
    }
  }
}

document.querySelector('.search').addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResultPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if (btn){
    const goToPage = parseInt(btn.dataset.goto, 10);
    console.log(goToPage);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  };

})

/**
* recipe controller
*
*/
const controlRecipe = async () => {
  // ged the id from the url
  const id = window.location.hash.replace('#','');
  console.log(id);
  if(id){
    // prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // highlightSelector search item
    if (state.search) searchView.highlightSelector(id);

    //create new recipe object
    state.recipe = new Recipe(id);

    try {

      //get recipe data and parse ingredients
      await state.recipe.getRecipe();
  //    console.log(state.recipe.ingredients);
      state.recipe.parseIngredients();
      console.log(state.recipe.ingredients);
      //calc servings and time

      state.recipe.calcTime();
      state.recipe.calcServings();
  //    console.log(state.recipe);
      //render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch(error) {
      alert("Error processing recipe!");
    }
  }
}
//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


// handling recipe button clicks
elements.recipe.addEventListener('click',  e => {
  if(e.target.matches('.btn-decrease, .btn-decrease *')) {
    // decrease btn is clicked
    if(state.recipe.servings > 1)
      state.recipe.updateServings('dec');
      recipeView.updataServiceIngredient(state.recipe);
  } else  if (e.target.matches('.btn-increase, .btn-increase *')) {
    // increase btn is clicked
    state.recipe.updateServings('inc');
    recipeView.updataServiceIngredient(state.recipe);

  }
  console.log(state.recipe);
})
