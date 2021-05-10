// Parcel Icons
import icons from 'url:../../img/icons.svg';

// View
import View from '../views/View';

class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _message = 'Recipe was successfully uploaded'
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _openBtn = document.querySelector('.nav__btn--add-recipe');
    _closeBtn = document.querySelector('.btn--close-modal');

    constructor() {
        super();
        this._addHandlerShowWindow();
        this._addHandlerRemoveWindow();
    }

    toggleClasses() {
        this._window.classList.toggle('hidden');
        this._overlay.classList.toggle('hidden');
    }

    _addHandlerShowWindow() {
        this._openBtn.addEventListener('click', this.toggleClasses.bind(this));
    }

    _addHandlerRemoveWindow() {
        this._closeBtn.addEventListener('click', this.toggleClasses.bind(this));
        this._overlay.addEventListener('click', this.toggleClasses.bind(this));
    } 

    addHandlerUpload(handler) {
        this._parentElement.addEventListener('submit', function(e) {
            e.preventDefault();
            const dataArr = [...new FormData(this)];
            const data = Object.fromEntries(dataArr);
            handler(data);
        });
    }

    _generateMarkup() {
       
    }
}

export default new AddRecipeView();