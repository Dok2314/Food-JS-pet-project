import cards from "../cards.js";

window.addEventListener('DOMContentLoaded', (e) => {
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(tabContent => {
            tabContent.classList.add('hide');
            tabContent.classList.remove('show', 'fade');
        });

        tabs.forEach(tab => {
            tab.classList.remove('tabheader__item_active');
        })
    }

    function showTabContent(elemNum = 0) {
        tabsContent[elemNum].classList.add('show', 'fade');
        tabsContent[elemNum].classList.remove('hide');
        tabs[elemNum].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (e) => {
        const target = e.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((tab, key) => {
                if (target === tab) {
                    hideTabContent();
                    showTabContent(key);
                }
            });
        }
    });

    // TIMER
    const deadLine = '2024-09-14';

    function getTimer(endTime) {
        let days = 0, hours = 0, minutes = 0, seconds = 0;
        const t = Date.parse(endTime) - Date.parse(new Date());

        if (t > 0) {
            days = Math.floor(t / (1000 * 60 * 60 * 24));
            hours = Math.floor(t / (1000 * 60 * 60) % 24);
            minutes = Math.floor(t / (1000 * 60) % 60);
            seconds = Math.floor((t / 1000) % 60);
        }

        return {
            total: t,
            days: getZero(days),
            hours: getZero(hours),
            minutes: getZero(minutes),
            seconds: getZero(seconds),
        };
    }

    function getZero(num) {
        return !(num < 0) && num < 10 ? `0${num}` : num;
    }

    function setClock(endTime) {
        const days = document.querySelector('#days'),
            hours = document.querySelector('#hours'),
            minutes = document.querySelector('#minutes'),
            seconds = document.querySelector('#seconds'),
            timerId = setInterval(updateTime, 1000);

        updateTime();

        function updateTime() {
            const t = getTimer(endTime);

            days.innerHTML = t.days;
            hours.innerHTML = t.hours;
            minutes.innerHTML = t.minutes;
            seconds.innerHTML = t.seconds;

            if (t.total <= 0) {
                clearInterval(timerId);
            }
        }
    }

    setClock(deadLine);

    // MODAL
    const modalTriggers = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    function showModalByScroll() {
        if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    modalTriggers.forEach((modalTrigger) => {
        modalTrigger.addEventListener('click', openModal);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') === '') {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 50000);
    window.addEventListener('scroll', showModalByScroll);

    // MenuCards
    class MenuCard {
        constructor(title, description, src, alt, price, parentSelector, ...classes) {
            this.title = title;
            this.description = description;
            this.src = src;
            this.alt = alt;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 41;
            this.changeToUAH();
        }

        changeToUAH() {
            return this.price *= this.transfer;
        }

        render() {
            const div = document.createElement('div');

            this.classes.forEach(className => div.classList.add(className));

            div.innerHTML = `
                <img src="${this.src}" alt="${this.alt}">
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.description}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;

            this.parent.append(div);
        }
    }

    const getResource = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    // getResource('http://localhost:3000/menu')
    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(card => {
                new MenuCard(
                    card.title,
                    card.descr,
                    card.img,
                    card.altimg,
                    card.price,
                    '.menu__field>.container',
                    ...card.classes ?? ['menu__item']
            ).render();
        });
    });

    // FORM XMLHttpRequest
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        bindPostData(form);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        });

        return await res.json();
    }

    const messages = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Мы свяжемся с Вами позже',
        failure: 'Что-то пошло не так...',
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = messages.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data);
                    showThanksModal(messages.success);
                    statusMessage.remove();
                }).catch(err => {
                    showThanksModal(messages.failure);
                }).finally(() => {
                    form.reset();
                });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        document.querySelector('.modal').append(thanksModal);

        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

    // Slider with transform effect
    const slides = document.querySelectorAll('.offer__slide'),
        next = document.querySelector('.offer__slider-next'),
        previous = document.querySelector('.offer__slider-prev'),
        current = document.querySelector('#current'),
        total = document.querySelector('#total'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesInner = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width,
        totalSlides = slides.length;

    let slideIndex = 1,
        offset = 0;

    if (slideIndex < 10) {
        current.textContent = `0${slideIndex}`;
    } else {
        current.textContent = `${slideIndex}`;
    }

    if (totalSlides < 10) {
        total.textContent = `0${totalSlides}`;
    } else {
        total.textContent = `${totalSlides}`;
    }

    slidesInner.style.width = 100 * totalSlides + '%';
    slidesInner.style.display = 'flex';
    slidesInner.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width;
    });

    let widthNumber = +width.slice(0, width.length - 2);

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

        if (slideIndex < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = `${slideIndex}`;
        }
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

        if (slideIndex < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    });

    // Simple slider without animation
    // showSlides(slideIndex);
    //
    // if (slides.length < 10) {
    //     total.textContent = `0${slides.length}`;
    // } else {
    //     total.textContent = slides.length;
    // }
    //
    // function showSlides(n) {
    //     if (n > slides.length) {
    //         slideIndex = 1;
    //     }
    //
    //     if (n < 1) {
    //         slideIndex = slides.length;
    //     }
    //
    //     slides.forEach(slide => slide.style.display = 'none');
    //
    //     slides[slideIndex - 1].style.display = 'block';
    //
    //     if (slideIndex < 10) {
    //         current.textContent = `0${slideIndex}`;
    //     } else {
    //         current.textContent = slideIndex;
    //     }
    // }
    //
    // function plusSlideIndex(n) {
    //     showSlides(slideIndex += n);
    // }
    //
    // previous.addEventListener('click', () => {
    //     plusSlideIndex(-1);
    // });
    //
    // next.addEventListener('click', () => {
    //     plusSlideIndex(1);
    // });
});