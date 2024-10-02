function tabs(tabsSelector, tabsContentSelector, tabsParentSelector, activeClass) {
    // Tabs
    const tabs = document.querySelectorAll(tabsSelector),
        tabsContent = document.querySelectorAll(tabsContentSelector),
        tabsParent = document.querySelector(tabsParentSelector);

    function hideTabContent() {
        tabsContent.forEach(tabContent => {
            tabContent.classList.add('hide');
            tabContent.classList.remove('show', 'fade');
        });

        tabs.forEach(tab => {
            tab.classList.remove(activeClass);
        })
    }

    function showTabContent(elemNum = 0) {
        tabsContent[elemNum].classList.add('show', 'fade');
        tabsContent[elemNum].classList.remove('hide');
        tabs[elemNum].classList.add(activeClass);
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (e) => {
        const target = e.target;

        if (target && target.classList.contains(tabsSelector.slice(1))) {
            tabs.forEach((tab, key) => {
                if (target === tab) {
                    hideTabContent();
                    showTabContent(key);
                }
            });
        }
    });
}

export default tabs;