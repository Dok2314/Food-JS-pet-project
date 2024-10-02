function cards() {
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
}

export default cards;