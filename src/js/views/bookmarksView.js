// Icons
import icons from 'url:../../img/icons.svg';

// Config Variables 
import { ITEMS_PER_PAGE } from '../config'

// previewView Class
import PreviewView from './previewView'

class ResultViews extends PreviewView {
    _parentElement = document.querySelector('.bookmarks__list');
    _errMessage = "No bookmarks yet. Find a nice recipe and bookmark it. 😁😀"
    _message = "";

    addHandlerRender(handler) {
        window.addEventListener('load', handler);
    }
}

export default new ResultViews();