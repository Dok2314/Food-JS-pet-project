function slider({container, slide, nextArrow, previousArrow, totalCounter, currentCounter, wrapper, field}) {
    // Slider with transform effect
    const slides = document.querySelectorAll(slide),
        slider = document.querySelector(container),
        next = document.querySelector(nextArrow),
        previous = document.querySelector(previousArrow),
        current = document.querySelector(currentCounter),
        total = document.querySelector(totalCounter),
        slidesWrapper = document.querySelector(wrapper),
        slidesInner = document.querySelector(field),
        width = window.getComputedStyle(slidesWrapper).width,
        totalSlides = slides.length;

    let slideIndex = 1,
        offset = 0;

    showCurrentNumber(slideIndex);

    showTotalNumber(totalSlides);

    slidesInner.style.width = 100 * totalSlides + '%';
    slidesInner.style.display = 'flex';
    slidesInner.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width;
    });

    slider.style.position = 'relative';

    const indicators = document.createElement('ol'),
        dots = [];

    indicators.classList.add('carousel-indicators');
    slider.append(indicators);

    for (let i = 0; i < totalSlides; i++) {
        let dot = document.createElement('div');
        dot.setAttribute('data-slide-to', `${i + 1}`);
        dot.classList.add('dot');

        if (i === 0) {
            dot.style.opacity = `1`;
        }

        indicators.append(dot);
        dots.push(dot);
    }

    let widthNumber = +width.replace(/\D/g, '');

    next.addEventListener('click', () => {
        if (offset === widthNumber * (totalSlides - 1)) {
            offset = 0;
        } else {
            offset += widthNumber;
        }

        slidesInner.style.transform = `translateX(-${offset}px)`;

        if (slideIndex === totalSlides) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        showCurrentNumber(slideIndex);

        getDots(dots, slideIndex);
    });

    previous.addEventListener('click', () => {
        if (offset === 0) {
            offset = widthNumber * (totalSlides - 1);
        } else {
            offset -= widthNumber;
        }

        slidesInner.style.transform = `translateX(-${offset}px)`;

        if (slideIndex === 1) {
            slideIndex = totalSlides;
        } else {
            slideIndex--;
        }

        showCurrentNumber(slideIndex);

        getDots(dots, slideIndex);
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');

            slideIndex = +slideTo;
            offset = widthNumber * (slideTo - 1);

            slidesInner.style.transform = `translateX(-${offset}px)`;

            showCurrentNumber(slideIndex);

            getDots(dots, slideIndex);
        });
    });

    function showCurrentNumber(slideIndex) {
        if (slideIndex < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    }

    function showTotalNumber(totalSlides) {
        if (totalSlides < 10) {
            total.textContent = `0${totalSlides}`;
        } else {
            total.textContent = `${totalSlides}`;
        }
    }

    function getDots(dots, slideIndex) {
        dots.forEach(dot => dot.style.opacity = `.5`);
        dots[slideIndex - 1].style.opacity = `1`;
    }
}

export default slider;