// Icons
import icons from 'url:../../img/icons.svg';

// Config Variables 
import { ITEMS_PER_PAGE } from '../config'

// previewView Class
import PreviewView from './previewView'

class ResultViews extends PreviewView {
    _parentElement = document.querySelector('.results');
    _errMessage = "Sorry, we could not find this recipe. Please try again. 😴🥱"
    _message = "";
}

export default new ResultViews();