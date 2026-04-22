export class Button {
    constructor({ className, text, clickEventHandler }) {
        this.element = document.createElement("button");
        this.element.classList.add(className);
        this.element.innerText = text;
        this.element.onclick = clickEventHandler;
    }

    appendTo(parent) {
        parent.appendChild(this.element);
    }
}
