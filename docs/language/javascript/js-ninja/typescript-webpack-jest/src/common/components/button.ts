export class Button {
    element: HTMLButtonElement;

    constructor({
        className,
        text,
        clickEventHandler,
    }: {
        className: string;
        text: string;
        clickEventHandler: () => void;
    }) {
        this.element = document.createElement("button");
        this.element.classList.add(className);
        this.element.innerText = text;
        this.element.onclick = clickEventHandler;
    }

    appendTo(parent: HTMLElement) {
        parent.appendChild(this.element);
    }
}
