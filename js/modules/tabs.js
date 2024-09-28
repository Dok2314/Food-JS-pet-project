function tabs() {
    // Tabs
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
}

module.exports = tabs;