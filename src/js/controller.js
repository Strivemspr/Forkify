// Thirds-Party Modules
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// Model
import * as model from './model';

// Views
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';
import { MODAL_CLOSE_SEC } from './config';

// Hot Reloading
if (module.hot) {
    module.hot.accept();
}

// Controller 
const controlRecipes = async () => {
    try {
        // 1.Get ID
        const id = window.location.hash.substring(1);
        if (!id) return;

        // 1.1 Update results view - only the active class
        resultsView.update(model.getSearchResultsPage());
        // 1.2 .Update bookmarks
        bookmarksView.update(model.state.bookmarks);

        // 2.Render Spinner
        recipeView.showSpinner();

        // 3.Loading Recipe
        await model.loadRecipe(id);

        // 4.Rendering Recipe
        recipeView.render(model.state.recipe);
    } catch (err) {
        recipeView.showError();
    }
};

const controlSearch = async () => {
    try {
        // 1. Load Spinner
        resultsView.showSpinner();

        // 2.Get Query
        const query = searchView.getQuery();
        if (!query) return;

        // 3. Load Search Results
        await model.loadSearchResults(query);

        // 4. Render Search Results
        // resultsView.render(model.state.search.results);
        resultsView.render(model.getSearchResultsPage());
        
        // 5. Render Pagination Buttons 
        paginationView.render(model.state.search);
    } catch (err) {
        resultsView.showError();
    }
};

const controlPagination = (pageTarget) => {
    // 1. Render NEW Search Results
    resultsView.render(model.getSearchResultsPage(pageTarget));
    // 2. Render NEW Pagination Buttons 
    paginationView.render(model.state.search);
}

const controlServings = (newServings) => {
    // 1. Update Servings In State
    model.updateServings(newServings);

    // 2. Update View 
    recipeView.update(model.state.recipe);
}

const controlAddBookmark = function() {
    // 1. Updates State - if bookmarked is false coerces to true and then runs the addbookmark method
    if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
    // otherwise run the removeBookmark method
    else model.removeBookmark(model.state.recipe.id);

    // 2. ReRender the recipe with changes
    recipeView.update(model.state.recipe);

    // 3. Render Bookmarks
    bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function() {
    bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe) {
    try {
        // Render Spinner
        addRecipeView.showSpinner();

        // Upload Recipe
        await model.uploadRecipe(newRecipe);

        // Render Recipe View
        recipeView.render(model.state.recipe);

        // Show Success Message
        addRecipeView.showMessage();
        
        // Render Bookmarks
        bookmarksView.render(model.state.bookmarks);

        window.history.pushState(null, '', `#${model.state.recipe.id}`);

        // Close Form
        setTimeout(function() {
            addRecipeView.toggleClasses();
        }, MODAL_CLOSE_SEC * 1000);
    } catch(err) {
        addRecipeView.showError(err.message);
    }
}

// Events Listeners
const init = () => { 
    bookmarksView.addHandlerRender(controlBookmarks);
    recipeView.addHandlerRender(controlRecipes);
    recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerAddBookmark(controlAddBookmark);
    searchView.addHandlerSearch(controlSearch);
    paginationView.addHandlerPagination(controlPagination);
    addRecipeView.addHandlerUpload(controlAddRecipe);
}

init();
// Set up events