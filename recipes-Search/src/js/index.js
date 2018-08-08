// Global app controller
import Search from './models/Search';
import * as searchView from './views/searchView';
import {elements, renderLoader, clearLoader} from './views/base';

/** Global state of the herokuapp
* - Search object
* - Current recipe object
* - Sopping list object
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
    // 4) search for Recipes
    await state.search.getResults();


    // 5) render results on UI
    clearLoader();
    searchView.renderResults(state.search.result);

  }
}

document.querySelector('.search').addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

const search = new Search('pizza');
//console.log(search);
search.getResults();


//http://food2fork.com/api/search
//1cc169cd69294c6a33d5b0c2c270c49f
