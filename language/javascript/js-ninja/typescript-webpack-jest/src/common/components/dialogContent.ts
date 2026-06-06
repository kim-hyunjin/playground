import { Contents } from "../models/contents";

export class DialogContent {
    labelEl: HTMLLabelElement;
    textEl: HTMLInputElement | HTMLSpanElement;
    content: HTMLDivElement;
    editable: boolean;
    snapshot = "";

    constructor({ label, text, editable, computed }: Contents) {
        this.editable = editable ?? true;
        this.content = document.createElement("div");
        this.content.classList.add("content");

        this.labelEl = document.createElement("label");
        this.labelEl.innerText = label ?? "";
        this.content.appendChild(this.labelEl);

        if (this.editable) {
            this.textEl = document.createElement("input");
            (<HTMLInputElement>this.textEl).value = computed ? computed() : text ? text : "";
            this.textEl.setAttribute("readonly", "readonly");
        } else {
            this.textEl = document.createElement("span");
            this.textEl.innerText = computed ? computed() : text ? text : "";
        }
        this.textEl.classList.add("text");
        this.content.appendChild(this.textEl);
    }

    appendTo(parent: HTMLElement) {
        parent.appendChild(this.content);
    }

    changeMode(editMode: boolean) {
        if (!this.editable) return;

        if (editMode) {
            this.textEl.removeAttribute("readonly");
            this.snapshot = (<HTMLInputElement>this.textEl).value;
        } else {
            this.textEl.setAttribute("readonly", "readonly");
        }
    }

    cancelTextChange() {
        (<HTMLInputElement>this.textEl).value = this.snapshot;
    }

    getTextValue() {
        if (this.textEl instanceof HTMLInputElement) return this.textEl.value;

        return this.textEl.innerText;
    }
}
