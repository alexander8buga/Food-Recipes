// Global app controller
import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

import {elements, renderLoader, clearLoader} from './views/base';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';





/** Global state of the app
* - Search object
* - Current recipe object
* - Shopping list object
* - Linked recipes
*/

const state = {};

window.state = state;

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
      recipeView.renderRecipe(
        state.recipe,
        state.likes.isLiked(id)
      );


///      shopping.renderItem(new List().addItem(2, '', 'apple'));

    } catch(error) {
      alert("Error processing recipe!");
    }
  }
}
//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/**
* List controller
*/

const controlList = () => {
  // create a new list if there No lists
  if (!state.list) state.list = new List();

  // add each ingredient to the listView and UI
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
}



// handle delete and update list items events
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;
  // handle the delete btn
  if(e.target.matches('.shopping__delete, .shopping__delete *')) {
    // delete from the state
    state.list.deleteItem(id);
    // delete from the UI
    listView.deleteItem(id);

    // handle the count update
  } else if(e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value, 10);

    state.list.updateCount(id, val);
  }
});

/**
* Like controller
*/

// testing
state.likes = new Likes();

likesView.toggleLikedMenu(state.likes.getNumLikes());



const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const curID = state.recipe.id;

  // usr has NOTyet liked the recipe
  if (!state.likes.isLiked(curID)) {

    // Add like to the state
    const newLike = state.likes.addLike(
      curID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    )
    // toggle the like button
    likesView.toggleLikedBtn(true);
    // add like to the UI
    likesView.renderLikes(state.likes);

  // usr HAS liked curent recipe
  } else {
    // remove like to the state
    state.likes.deleteLike(curID);
    // toggle the like button
    likesView.toggleLikedBtn(false);

    // remove like from the UI
    likesView.deleteLike(curID);


  }

  likesView.toggleLikedMenu(state.likes.getNumLikes());
}

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

  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    // add ingredients to the shopping list
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')){
    controlLike();
  }
  //console.log(state.recipe);
})
