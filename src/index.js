import Notiflix from 'notiflix'
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from 'axios';

const form = document.querySelector('#search-form');
const divGallery = document.querySelector('.gallery');
const btnLodMore = document.querySelector('.load-more');

const KEY = '29210178-99963cb2fa4a70f711806a762';
let serchNeedImage = '';
let currentPage = 1;


form.addEventListener('submit', serchImages);
btnLodMore.addEventListener('click', loadMoreSerchImages);


function serchImages(e) {
    console.log('work')
    e.preventDefault();
    addClassListHiden()
    currentPage = 1
    clearListOfGallery()
    
    if ((e.currentTarget.elements.searchQuery.value).trim() === '') {
        addClassListHiden()
        Notiflix.Notify.warning('Please input smt. to serch');
        return;
    } else {
        serchNeedImage = e.currentTarget.elements.searchQuery.value
        fechfunction(serchNeedImage);
    }
    
}
async function fechfunction(serchNeedImage) {

    try {
        const response = await axios.get(`https://pixabay.com/api/?key=${KEY}&q=${serchNeedImage}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`)
        if (response.data.total === 0) {
                Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
                addClassListHiden()
                return;
        }
        else if (response.data.totalHits <= 40) {
                currentPage += 1;
                Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`)
                createListOfImages(response.data);
                addClassListHiden()
            } else {
                currentPage += 1;
                Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`)
                createListOfImages(response.data);
            }
     }
    catch (error) {
        console.log(error);
        
    } 
}

function createListOfImages(rezultSerches) {

    removeClassListHidden()
    
    for (const item of rezultSerches.hits) {
        const rezult = `<div class="photo-card">
        <a href="${item.largeImageURL}"><img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" width="270" height ="180"/>
        </a>
        <div class="info">
        <p class="info-item">
        <b>Likes ${item.likes}</b>
        </p>
        <p class="info-item">
        <b>Views ${item.views}</b>
        </p>
        <p class="info-item">
        <b>Comments ${item.comments}</b>
        </p>
        <p class="info-item">
        <b>Downloads ${item.downloads}</b>
        </p>
        </div>
        </div>`
        
        divGallery.insertAdjacentHTML('beforeend', rezult);  
    }

    const lightbox = new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionDelay: 250,
    });
}

async function loadMoreSerchImages() {
    try { 
        const response = await axios.get(`https://pixabay.com/api/?key=${KEY}&q=${serchNeedImage}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=40`);
        let count = currentPage*40;
        currentPage += 1;

        createListOfImages(response.data);

        if (count >= response.data.totalHits) {
            addClassListHiden()
            Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
        }
    }
    catch (error) {
        console.log(error);
    }
}

function clearListOfGallery() {
    divGallery.innerHTML = "";
}

function removeClassListHidden() {
    btnLodMore.classList.remove("hidden");
}

function addClassListHiden() {
    btnLodMore.classList.add("hidden");
}

