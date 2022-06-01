import Notiflix, { Notify } from 'notiflix';
import './sass/main.scss';
import fetchPictures from './js/fetchPictures';
import LoadMoreBtn from './js/loadMoreBtn';


const refs = {
    inputData: document.querySelector('#search-form input'),
    gallery: document.querySelector('.gallery-thumb'),
    submitBtn: document.querySelector('#search-form button'),
    loadMoreButton: document.querySelector('.load-more-btn'),

};

const { searchForm, inputData, gallery, submitBtn,loadMoreButton } = refs;

submitBtn.addEventListener('click', onSearch);

let nextPageFormInput = '';
let nextPageNumber = 1;
let ifTextEntered = true;

const loadMoreBtn = new LoadMoreBtn({
    selector: ".load-more-btn",
    hidden: true,
});

function onSearch(evt) {
    evt.preventDefault();
    ifTextEntered = true;
    gallery.innerHTML = '';
    loadMoreBtn.disable();

    let inputForSearch = inputData.value.trim();
    nextPageFormInput = inputForSearch;
    nextPageNumber = 1;

    if (nextPageFormInput === '') {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        loadMoreBtn.hide();
        inputData.value = '';
        return;
    }

    return fetchPictures(inputForSearch, nextPageNumber)
        .then(pictures => renderPictures(pictures))
        .catch(error => console.log(error));
}

function renderPictures(pictures) {
    let picturesCounter = pictures.data.hits.length;
    let totalHits = pictures.data.totalHits;

    if (!picturesCounter) {
        Notiflix.Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
        loadMoreBtn.hide();
        inputData.value = '';
        return;
    }
    
    if (picturesCounter > 0) {
        //После первого запроса при каждом новом поиске выводить уведомление
        //в котором будет написано сколько всего нашли изображений(свойство totalHits)
        if (ifTextEntered) {
            Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`)
            ifTextEntered = false;
        }

        loadMoreBtn.enable();
        loadMoreBtn.show();
        
        //add html structure
        const galleryMarkup = pictures.data.hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
            return
            ` <div class="gallery__card">
            <a class="gallery__card__item href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" width="300" height="200" loading="lazy"/> </a>
            <div class="gallery_info">
            <p class="gallery_info_item>
            <b>Likes</b>
            ${likes}
            </p>

            <p class="gallery_info_item>
            <b>Views</b>
            ${views}
            </p>
 
            <p class="gallery_info_item>
            <b>Comments</b>
            ${comments}
            </p>

            <p class="gallery_info_item>
            <b>Downloads</b>
            ${downloads}
            </p>
            </div>
        </div>`;
        }).join('');

        gallery.insertAdjacentHTML('beforeend', galleryMarkup);
        inputData.value = '';

        if (picturesCounter < 40 && picturesCounter > 0) {
            loadMoreBtn.hide();
            Notify.info("We're sorry, but you've reached the end of search results.");
        }
    }
 
}
        //add load

        loadMoreButton.addEventListener('click', onloadMore);

        function onloadMore(evt) {
            evt.preventDefault();
            loadMoreBtn.disable();
           
            nextPageNumber += 1;
 
            return fetchPictures(nextPageFormInput, nextPageNumber)
                .then(pictures => renderPictures(pictures))
                .catch(error => {
                    console.log(error)
                });
        } 
    
