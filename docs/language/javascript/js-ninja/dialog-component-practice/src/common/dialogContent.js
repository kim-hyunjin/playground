export class DialogContent {
    snapshot;

    constructor({ label, text, editable, computed }) {
        this.editable = editable ?? true;
        this.content = document.createElement("div");
        this.content.classList.add("content");

        this.labelEl = document.createElement("label");
        this.labelEl.innerText = label;
        this.content.appendChild(this.labelEl);

        if (this.editable) {
            this.textEl = document.createElement("input");
            this.textEl.value = computed ? computed() : text ? text : "";
            this.textEl.setAttribute("readonly", "readonly");
        } else {
            this.textEl = document.createElement("span");
            this.textEl.innerText = computed ? computed() : text ? text : "";
        }
        this.textEl.classList.add("text");
        this.content.appendChild(this.textEl);
    }

    appendTo(parent) {
        parent.appendChild(this.content);
    }

    changeMode(editMode) {
        if (!this.editable) return;

        if (editMode) {
            this.textEl.removeAttribute("readonly");
            this.snapshot = this.textEl.value;
        } else {
            this.textEl.setAttribute("readonly", "readonly");
        }
    }

    cancelTextChange() {
        this.textEl.value = this.snapshot;
    }
}
