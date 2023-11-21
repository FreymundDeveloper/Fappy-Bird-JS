function newElement(tagName, className) {
    const element = document.createElement(tagName);
    element.className = className;
    return element
}

function Barrier(reverse = false) {
    this.element = newElement('div', 'barrier');

    const border = newElement('div', 'barrier-border');
    const body = newElement('div', 'barrier-body');

    this.element.appendChild(reverse ? body : border);
    this.element.appendChild(reverse ? border : body);

    this.setHeight = height => body.style.height = `${height}px`;
}

function BarrierPair(height, opening, valuePx) {
    this.element = newElement('div', 'barrier-pair');

    this.top = new Barrier(true);
    this.bottom = new Barrier(false);

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

function Barriers(height, width, opening, space, notifyPoint) {
    this.pairs = [
        new BarrierPair(height, opening, width),
        new BarrierPair(height, opening, (width + space)),
        new BarrierPair(height, opening, (width + (space * 2))),
        new BarrierPair(height, opening, (width + (space * 3))),
        new BarrierPair(height, opening, (width + (space * 4)))
    ];

    const moving = 3;

    this.animation = () => {
        this.pairs.forEach(pair => {
            pair.setValuePx(pair.getValuePx() - moving);

            if (pair.getValuePx() < -pair.getWidth()) {
                pair.setValuePx(pair.getValuePx() + (space * this.pairs.length));
                pair.randomOpening();
            }

            const mid = width / 2;
            const crossMid = ((pair.getValuePx() + moving) >= mid) && (pair.getValuePx() < mid);

            if(crossMid) notifyPoint();
        });
    }
}

function Bird(gameHeight) {
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

function Progress() {
    this.element = newElement('span', 'progress');
    this.updatePoints = points => {
        this.element.innerHTML = points;
    }
    this.updatePoints(0);
}

function overlayCheck(elementOne, elementTwo) {
    const one = elementOne.getBoundingClientRect();
    const two = elementTwo.getBoundingClientRect();

    const horizontal = ((one.left + one.width) >= two.left) && ((two.left + two.width) >= one.left);
    const vertical = ((one.top + one.height) >= two.top) && ((two.top + two.height) >= one.top);

    return horizontal && vertical;
}

function collisionCheck(bird, barriers) {
    let collided = false;

    barriers.pairs.forEach(barriersPair => {
        if (!collided) {
            const top = barriersPair.top.element;
            const bottom = barriersPair.bottom.element;

            collided = overlayCheck(bird.element, top) || overlayCheck(bird.element, bottom);
        }
    });
    return collided;
}

function FlappyBird() {
    let points = 0;
    
    const gameMap = document.querySelector('#base-flappy');
    const height = gameMap.clientHeight;
    const width = gameMap.clientWidth;

    const progress = new Progress();
    const barriers = new Barriers(height, width, 250, 350, () => progress.updatePoints(++points));
    const bird = new Bird(height);

    gameMap.appendChild(progress.element);
    gameMap.appendChild(bird.element);
    barriers.pairs.forEach(pair => gameMap.appendChild(pair.element));

    this.start = () => {
        const timeOut = setInterval(() => {
            barriers.animation();
            bird.animation();

            if (collisionCheck(bird, barriers)) clearInterval(timeOut);
        }, 20);
    }
}

new FlappyBird().start();