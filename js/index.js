/*class="progress"class="barrier-body"class="barrier-border"class="barrier"
class="barrier-pair"class="bird"*/

function newElement(tagName, className) {
    const element = document.createElement(tagName);
    element.className = className;
    return element
}

function barrier(reverse = false) {
    this.element = newElement('div', 'barrier');

    const border = newElement('div', 'barrier-border');
    const body = newElement('div', 'barrier-body');

    this.element.appendChild(reverse ? body : border);
    this.element.appendChild(reverse ? border : body);

    this.setHeight = height => body.style.height = `${height}px`;
}

function barrierPair(height, opening, valuePx) {
    this.element = newElement('div', 'barrier-pair');

    this.top = new barrier(true);
    this.bottom = new barrier(false);

    this.element.appendChild(this.top.element);
    this.element.appendChild(this.bottom.element);

    this.randomOpening = () => {
        const heightTop = Math.random() * (height - opening);
        const heightBottom = height - opening - heightTop;

        this.top.setHeight(heightTop);
        this.bottom.setHeight(heightBottom);
    }

    this.getValuePx = () => parseInt(this.element.style.left.split('px')[0]);
    this.setValuePx = valuePx => this.element.style.left = `${valuePx}px`;
    this.getWidth = () => this.element.clientWidth;

    this.randomOpening();
    this.setValuePx(valuePx);
}

function barriers(height, width, opening, space, notifyPoint) {
    this.pairs = [
        new barrierPair(height, opening, width),
        new barrierPair(height, opening, (width + space)),
        new barrierPair(height, opening, (width + (space * 2))),
        new barrierPair(height, opening, (width + (space * 3))),
        new barrierPair(height, opening, (width + (space * 4)))
    ];

    const moving = 2;

    this.animation = () => {
        this.pairs.forEach(pair => {
            pair.setValuePx(pair.getValuePx() - moving);

            if (pair.getValuePx() < -pair.getWidth()) {
                pair.setValuePx(pair.getValuePx() + (space * this.pairs.length));
                pair.randomOpening();
            }

            const mid = width / 2;
            const crossMid = ((pair.getValuePx() + moving) >= mid) && (pair.getValuePx() < mid);

            if(crossMid) notifyPoint(); //for the brid
        });
    }
}

function bird(gameHeight) {
    let flying = false;

    this.element = newElement('img', 'bird');
    this.element.src = 'img/bird.png';

    this.getValuePx = () => parseInt(this.element.style.bottom.split('px')[0]);
    this.setValuePx = valuePx => this.element.style.bottom = `${valuePx}px`;

    window.onkeydown = press => flying = true;
    window.onkeyup = press => flying = false;

    this.animation = () => {
        const newPx = this.getValuePx() + (flying ? 6 : -3.5);
        const maxHeight = gameHeight - this.element.clientHeight;

        if (newPx <= 0) this.setValuePx(0);
        else if (newPx >= maxHeight) this.setValuePx(maxHeight);
        else this.setValuePx(newPx);
    }

    this.setValuePx(gameHeight / 2);
}

// const b = new barriers(700, 1200, 250, 350)
// const p = new bird(625)
// const gameMap = document.querySelector('#base-flappy')

// gameMap.appendChild(p.element)
// b.pairs.forEach(pair => gameMap.appendChild(pair.element))

// setInterval(() => {
//     b.animation()
//     p.animation();
// }, 20)