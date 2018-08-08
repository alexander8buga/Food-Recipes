export const elements = {
  searchForm: document.querySelector('.search'),
  searchResultList: document.querySelector('.results__list'),
  searchInput: document.querySelector('.search__field'),
  searchResult: document.querySelector('.results')
};
export const elementStrings = {
  loader: 'loader'
}
export const renderLoader = parent => {
  const loader = `
    <div class="${elementStrings.loader}">
      <svg>
        <use href="img/icons.svg#icon-cw"></use>
      </svg>
    </div>
  `;
  parent.insertAdjacentHTML('afterBegin', loader);

}

export const clearLoader = () => {
  const loader = document.querySelector(`.${elementStrings.loader}`);
  if (loader) {
    loader.parentElement.removeChild(loader);
  }
}
