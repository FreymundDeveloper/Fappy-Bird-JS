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

// const b = new barrierPair(700, 250, 400)
// document.querySelector('#base-flappy').appendChild(b.element)