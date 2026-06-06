import { Button } from "./components/button";
import { DialogContent } from "./components/dialogContent";
import { Contents } from "./models/contents";

interface Dialog {
    open(): void;
    close(): void;
    changeTitle(title: string): void;
    editable(isEditable: boolean): boolean;
    save(): void;
    cancel(): void;
    getDataSource(): DataSource;
    setDataSource(dataSource: DataSource): void;
    on(eventName: DialogEvent, callback: () => void): void;
}

type DialogEvent = "onOpen" | "onClose" | "onEdit" | "onSave" | "onCancel";

type DataSource = {
    title?: string;
    contents: Contents[];
};

type DialogOptions = {
    contents: Contents[];
};

export class CommonDialog implements Dialog {
    private _dialogs!: HTMLDivElement;
    private _dialogEl!: HTMLDivElement;
    private _titleEl!: HTMLInputElement;
    private _labelTextMap: Map<string, any> = new Map<string, any>();
    private _buttonGroup: Map<string, HTMLDivElement> = new Map<string, HTMLDivElement>();
    private _buttons: Map<string, HTMLButtonElement> = new Map<string, HTMLButtonElement>();
    private _callbackMap: Map<string, () => void> = new Map<string, () => void>();
    private _isEditMode = false;
    private _titleSnapshot = "";

    constructor(title: string, options?: DialogOptions) {
        this.initDialogs();
        this.createDialogEl();
        this.createTitleEl(title ?? "");
        if (options?.contents) {
            this.renderContents(options.contents);
        }
        this.createButtonGroup();
    }

    open() {
        this.storedCallbackCall("onOpen");
        this._dialogs.style.display = "flex";
        this._dialogEl.classList.remove("hidden");
    }

    close() {
        this._buttons.get("close")!.click();
    }

    changeTitle(title: string) {
        this._titleEl.value = title;
    }

    editable(isEditable: boolean) {
        this._isEditMode = isEditable;
        this._buttons.get("edit")!.click();
        return this._isEditMode;
    }

    save() {
        this._buttons.get("save")!.click();
    }

    cancel() {
        this._buttons.get("cancel")!.click();
    }

    getDataSource() {
        const dataSource: DataSource = {
            title: this._titleEl.value,
            contents: [],
        };
        this._labelTextMap.forEach((con: DialogContent) => {
            dataSource.contents.push({
                label: con.labelEl.innerText,
                text: con.getTextValue(),
                editable: con.editable,
            });
        });
        return dataSource;
    }

    setDataSource(dataSource: DataSource) {
        this.clearDialog();
        this._labelTextMap.clear();
        this.createTitleEl(this._titleEl.value);
        this.renderContents(dataSource.contents);
        this.createButtonGroup();
    }

    on(eventName: DialogEvent, callback: () => void) {
        this._callbackMap.set(eventName, callback);
    }

    private clearDialog() {
        this._dialogEl.innerHTML = "";
    }

    private storedCallbackCall(eventName: DialogEvent) {
        const cb = this._callbackMap.get(eventName);
        if (cb) cb();
    }

    private initDialogs() {
        let dialogs = document.getElementById("commonDialogs") as HTMLDivElement;
        if (!dialogs) {
            dialogs = document.createElement("div");
            dialogs.id = "commonDialogs";
            document.querySelector("body")!.appendChild(dialogs);
        }
        this._dialogs = dialogs;
    }

    private createDialogEl() {
        const dialog = document.createElement("div");
        dialog.classList.add("dialog");
        dialog.classList.add("hidden");
        this._dialogs.appendChild(dialog);
        this._dialogEl = dialog;
    }

    private createTitleEl(value: string) {
        const title = document.createElement("input");
        title.classList.add("title");
        title.setAttribute("readonly", "readonly");
        title.value = value;
        this._dialogEl.insertAdjacentElement("afterbegin", title);
        this._titleEl = title;
    }

    private renderContents(contents: Contents[]) {
        for (const content of contents) {
            const dialogContent = new DialogContent(content);
            dialogContent.appendTo(this._dialogEl);
            this._labelTextMap.set(content.label, dialogContent);
        }
    }

    private createButtonGroup() {
        this.createViewButtonGroup();
        this.createEditButtonGroup();
    }

    private createViewButtonGroup() {
        const viewGroup = document.createElement("div");
        this._buttonGroup.set("view", viewGroup);
        viewGroup.classList.add("button-group");
        this._dialogEl.appendChild(viewGroup);

        const editBtn = new Button({
            className: "edit-btn",
            text: "Edit",
            clickEventHandler: this.handleEditBtn.bind(this),
        });
        editBtn.appendTo(viewGroup);
        this._buttons.set("edit", editBtn.element);

        const closeBtn = new Button({
            className: "close-btn",
            text: "Close",
            clickEventHandler: this.handleCloseBtn.bind(this),
        });
        closeBtn.appendTo(viewGroup);
        this._buttons.set("close", closeBtn.element);
    }

    private createEditButtonGroup() {
        const editGruop = document.createElement("div");
        this._buttonGroup.set("edit", editGruop);
        editGruop.classList.add("button-group");
        editGruop.classList.add("hidden");
        this._dialogEl.appendChild(editGruop);

        const saveBtn = new Button({
            className: "save-btn",
            text: "Save",
            clickEventHandler: this.handleSaveBtn.bind(this),
        });
        saveBtn.appendTo(editGruop);
        this._buttons.set("save", saveBtn.element);

        const cancelBtn = new Button({
            className: "cancel-btn",
            text: "Cancel",
            clickEventHandler: this.handleCancelBtn.bind(this),
        });
        cancelBtn.appendTo(editGruop);
        this._buttons.set("cancel", cancelBtn.element);
    }

    private toggleEditMode() {
        this._labelTextMap.forEach((con) => {
            con.changeMode(this._isEditMode);
        });

        if (this._isEditMode) {
            this._titleEl.removeAttribute("readonly");
            this._titleSnapshot = this._titleEl.value;
            this._buttonGroup.get("view")!.classList.add("hidden");
            this._buttonGroup.get("edit")!.classList.remove("hidden");
        } else {
            this._titleEl.setAttribute("readonly", "readonly");
            this._buttonGroup.get("view")!.classList.remove("hidden");
            this._buttonGroup.get("edit")!.classList.add("hidden");
        }
    }

    private handleCancelBtn() {
        this.storedCallbackCall("onCancel");
        this._isEditMode = false;
        this._titleEl.value = this._titleSnapshot;
        this._labelTextMap.forEach((con) => con.cancelTextChange());
        this.toggleEditMode();
    }

    private handleSaveBtn() {
        this.storedCallbackCall("onSave");
        this._isEditMode = false;
        this.toggleEditMode();
    }

    private handleEditBtn() {
        this.storedCallbackCall("onEdit");
        this._isEditMode = true;
        this.toggleEditMode();
    }

    private handleCloseBtn() {
        this.storedCallbackCall("onClose");
        this._dialogs.style.display = "none";
        this._dialogEl.classList.add("hidden");
    }
}
