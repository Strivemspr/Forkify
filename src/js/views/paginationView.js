// Parcel Icons
import icons from 'url:../../img/icons.svg';

// View
import View from '../views/View';

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    _generateMarkup() {
        const currentPage = this._data.page;
        console.log("🚀 ~ file: paginationView.js ~ line 15 ~ PaginationView ~ _generateMarkup ~ currentPage", currentPage)
        
        const numPages = Math.ceil(this._data.results.length / this._data.itemsPerPage); 

        // Page 1, and there are other pages
        if(currentPage === 1 && numPages > 1) {
            return `
                <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
                    <span>Page ${currentPage + 1}</span>
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
            `
        }

        // Last Page
        if(currentPage === numPages && numPages > 1) {
            return `
                <button data-goto="${currentPage - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${currentPage - 1}</span>
                </button>
            `
        }

        // Other Page 
        if(currentPage < numPages) {
            return `
                <button data-goto="${currentPage - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${currentPage - 1}</span>
                </button>
                <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
                    <span>Page ${currentPage + 1}</span>
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
            `
        }
        
        // Only 1 Page
        return '';
    }

    addHandlerPagination(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn--inline');
            if(!btn) return;

            const pageTarget = +btn.dataset.goto;

            handler(pageTarget);
        })
    }
}

export default new PaginationView();