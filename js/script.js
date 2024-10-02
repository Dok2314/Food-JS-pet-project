import tabs from './modules/tabs.js';
import modal, {openModal} from './modules/modal.js';
import timer from './modules/timer.js';
import cards from './modules/cards.js';
import calc from './modules/calc.js';
import forms from './modules/forms.js';
import slider from './modules/slider.js';

window.addEventListener('DOMContentLoaded', (e) => {
    const modalTimerId = setTimeout(() => openModal('.modal', modalTimerId), 50000);

    tabs();

    modal('[data-modal]', '.modal', modalTimerId);

    timer();

    cards();

    calc();

    forms(modalTimerId);

    slider();
});