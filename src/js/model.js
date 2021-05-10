import { API_URL, ITEMS_PER_PAGE, API_KEY } from './config';
import { AJAX } from './helpers';

export const state = {
    recipe: {}, // current recipe
    search: { // current search
        query: '', // query coming from the view
        results: [], // results coming from the passed query onto loadSearchResults 
        itemsPerPage: ITEMS_PER_PAGE, // coming from config
        page: 1, // coming from each page update and when loading new recipes
    },
    bookmarks: [],
}

const createRecipeObject = (data) => {
    const { recipe } = data.data;
    return {
        id: recipe.id,
        ingredients: recipe.ingredients,
        publisher: recipe.publisher,
        servings: recipe.servings,
        title: recipe.title, 
        sourceUrl: recipe.source_url,
        imageUrl: recipe.image_url,
        cookingTime: recipe.cooking_time,
        // Conditionally add properties to object
        ...(recipe.key && {key: recipe.key}),
    };
}

export const loadRecipe = async (id) => {
    try {
        const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);

        state.recipe = createRecipeObject(data);

        if(state.bookmarks.some(bookmark => bookmark.id === id)) {
            state.recipe.bookmarked = true;
        } else {
            state.recipe.bookmarked = false;  
        } 

    } catch (err) {
        throw err;
    }
}

export const loadSearchResults = async (query) => {
    try {
        state.search.query = query;
        
        const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

        const search = data.data.recipes.map(recipe => ({
            id: recipe.id,
            imageUrl: recipe.image_url,
            publisher: recipe.publisher,
            title: recipe.title,
            ...(recipe.key && {key: recipe.key}),
        }));

        state.search.results = search;
        state.search.page = 1;
    } catch (err) {
        throw err;
    }
}

export const getSearchResultsPage = function(page = state.search.page) {
    state.search.page = page;

    const start = (page - 1) * state.search.itemsPerPage; //0;
    const end = page * state.search.itemsPerPage; //9;
    // console.log(state.search.page);
    return state.search.results.slice(start, end);
}

export const updateServings = (newServings) => {
    state.recipe.ingredients.forEach(ingredient => {
        ingredient.quantity = ingredient.quantity * newServings / state.recipe.servings;
    });

    state.recipe.servings = newServings;
}

export const persistBookmarks = function() {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export const addBookmark = function(recipe) {
    // Add Bookmark to state
    state.bookmarks.push(recipe);

    // Mark current recipe as a bookmark
    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    // Persiste bookmarks on local storage
    persistBookmarks();
}

export const removeBookmark = function(id) {
    // Remove bookmark from state by finding the index
    const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
    state.bookmarks.splice(index, 1);

    // Mark as not a bookmark
    if(id === state.recipe.id) state.recipe.bookmarked = false;

    // Persiste bookmarks on local storage
    persistBookmarks();
}

const init = () => {
    const bookmarks = localStorage.getItem('bookmarks');
    if(bookmarks) state.bookmarks = JSON.parse(bookmarks);
}

init();

const clearBookmarks = () => {
    localStorage.clear('bookmarks');
}

// clearBookmarks();

export const uploadRecipe = async (newRecipe) => {
    try {
        const ingredients = Object.entries(newRecipe)
            .filter(ele => ele[0].includes('ingredient') && ele[1] !== "")
            .map(ingredient => {
                // const ingArr = ingredient[1].replaceAll(' ', '').split(',');
                const ingArr = ingredient[1].split(',').map(el => el.trim());
                if(ingArr.length !== 3) throw new Error('Wrong ingredient format, Please use the correct format'); 

                const [quantity, unit, description] = ingArr

                return {
                    quantity: quantity ? +quantity : null,
                    unit,
                    description,
                }
            });

        const recipe = {
            title: newRecipe.title, 
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        }

        const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
        console.log("🚀 ~ file: model.js ~ line 153 ~ uploadRecipe ~ data", data);

        state.recipe = createRecipeObject(data);

        addBookmark(state.recipe);
    } catch(err) {
        throw err
    }
}