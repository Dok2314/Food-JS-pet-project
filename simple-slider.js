const slides = document.querySelectorAll('.offer__slide'),
    slider = document.querySelector('.offer__slider'),
    next = document.querySelector('.offer__slider-next'),
    previous = document.querySelector('.offer__slider-prev'),
    current = document.querySelector('#current'),
    total = document.querySelector('#total'),
    slidesWrapper = document.querySelector('.offer__slider-wrapper'),
    width = window.getComputedStyle(slidesWrapper).width;

let slideIndex = 1;

// Simple slider without animation
showSlides(slideIndex);

if (slides.length < 10) {
    total.textContent = `0${slides.length}`;
} else {
    total.textContent = `${slides.length}`;
}

function showSlides(n) {
    if (n > slides.length) {
        slideIndex = 1;
    }

    if (n < 1) {
        slideIndex = slides.length;
    }

    slides.forEach(slide => slide.style.display = 'none');

    slides[slideIndex - 1].style.display = 'block';

    if (slideIndex < 10) {
        current.textContent = `0${slideIndex}`;
    } else {
        current.textContent = slideIndex;
    }
}

function plusSlideIndex(n) {
    showSlides(slideIndex += n);
}

previous.addEventListener('click', () => {
    plusSlideIndex(-1);
});

next.addEventListener('click', () => {
    plusSlideIndex(1);
});