// Parcel Icons
import icons from 'url:../../img/icons.svg';

// View class
export default class View {
    _data;

    /**
     * Render the received object to the DOM 
     * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
     * @returns {undefined} undefined
     * @this {Object} View instance 
     * @author Marlon Steve
     * @todo Finish implementation
     */
    render(data) {
        // Check for empty array or object
        if(!data || (Array.isArray(data) && data.length === 0)) return this.showError();
        if(!data || Object.keys(data).length === 0) return;

        this._data = data;

        const markup = this._generateMarkup();
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    update(data) {
        this._data = data;

        const newMarkup = this._generateMarkup();

        const newDom = document.createRange().createContextualFragment(newMarkup);
        const newElements = Array.from(newDom.querySelectorAll('*'));
        const curElements = Array.from(this._parentElement.querySelectorAll('*'));
        
        console.log("🚀 ~ file: View.js ~ line 27 ~ View ~ update ~ newElements", newElements)
        console.log("🚀 ~ file: View.js ~ line 29 ~ View ~ update ~ curElements", curElements)

        newElements.forEach((newEl, i) => {
            const curEl = curElements[i];
            if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== "") {
                curEl.textContent = newEl.textContent;
            }

            if(!newEl.isEqualNode(curEl)) {
                Array.from(newEl.attributes).forEach(attr => 
                    curEl.setAttribute(attr.name, attr.value)
                );
            }
        });
    }

    showSpinner()  {
        let html = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
      `;
    
        this._clear()
        this._parentElement.insertAdjacentHTML('afterbegin', html);
    };
    
    _clear() {
        this._parentElement.innerHTML = " ";
    }

    showError(err = this._errMessage) {
        const markup = `
            <div class="error">
                <div>
                <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                </svg>
                </div>
                <p>${err}</p>
            </div>
        `

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    showMessage(message = this._message) {
        const markup = `
            <div class="message">
                <div>
                <svg>
                    <use href="${icons}#icon-smile"></use>
                </svg>
                </div>
                <p>${message}</p>
            </div>
        `

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
}