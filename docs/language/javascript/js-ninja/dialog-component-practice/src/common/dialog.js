import { Button } from "./button.js";
import { DialogContent } from "./dialogContent.js";

export const test = "test";

export const CommonDialog = function (title, options) {
    let _dialogs;
    let _dialogEl;
    let _titleEl;
    const _labelTextMap = {};
    const _buttonGroup = {};
    const _buttons = {};
    const _callbackMap = {};

    let _isEditMode = false;
    let _titleSnapshot = "";

    class Dialog {
        constructor(title, options) {
            initDialogs();
            createDialogEl();
            createTitleEl(title ?? "");
            if (options?.contents) {
                renderContents(options.contents);
            }
            createButtonGroup();
        }

        open() {
            storedCallbackCall("onOpen");
            _dialogs.style.display = "flex";
            _dialogEl.open = true;
        }

        close() {
            _buttons["close"].click();
        }

        changeTitle(title) {
            _titleEl.value = title;
        }

        editable(isEditable) {
            _isEditMode = isEditable;
            _buttons["edit"].click();
        }

        save() {
            _buttons["save"].click();
        }

        cancel() {
            _buttons["cancel"].click();
        }

        getDataSource() {
            const dataSource = {
                title: _titleEl.value,
                contents: [],
            };
            Object.values(_labelTextMap).forEach((con) => {
                dataSource.contents.push({
                    label: con.labelEl.innerText,
                    value: con.textEl.value || con.textEl.innerText,
                });
            });
            return dataSource;
        }

        setDataSource(dataSource) {
            clearDialog();
            clearObject(_labelTextMap);
            createTitleEl(_titleEl.value);
            renderContents(dataSource);
            createButtonGroup();
        }

        on(eventName, callback) {
            _callbackMap[eventName] = callback;
        }
    }

    function clearDialog() {
        _dialogEl.innerHTML = "";
    }

    function clearObject(obj) {
        const props = Object.getOwnPropertyNames(obj);
        for (let i = 0; i < props.length; i++) {
            delete obj[props[i]];
        }
    }

    function storedCallbackCall(eventName, event) {
        const cb = _callbackMap[eventName];
        if (cb) cb(event);
    }

    function initDialogs() {
        let dialogs = document.getElementById("commonDialogs");
        if (!dialogs) {
            dialogs = document.createElement("div");
            dialogs.id = "commonDialogs";
            document.querySelector("body").appendChild(dialogs);
        }
        _dialogs = dialogs;
    }

    function createDialogEl() {
        const dialog = document.createElement("dialog");
        dialog.classList.add("dialog");
        _dialogs.appendChild(dialog);
        _dialogEl = dialog;
    }

    function createTitleEl(value) {
        const title = document.createElement("input");
        title.classList.add("title");
        title.setAttribute("readonly", "readonly");
        title.value = value;
        _dialogEl.insertAdjacentElement("afterbegin", title);
        _titleEl = title;
    }

    function renderContents(contents) {
        for (const content of contents) {
            const contentDiv = new DialogContent(content);
            contentDiv.appendTo(_dialogEl);
            _labelTextMap[content.label] = contentDiv;
        }
    }

    function createButtonGroup() {
        createViewButtonGroup();
        createEditButtonGroup();
    }

    function createViewButtonGroup() {
        _buttonGroup["view"] = document.createElement("div");
        _buttonGroup["view"].classList.add("button-group");
        _dialogEl.appendChild(_buttonGroup["view"]);

        const editBtn = new Button({
            className: "edit-btn",
            text: "Edit",
            clickEventHandler: handleEditBtn,
        });
        editBtn.appendTo(_buttonGroup["view"]);
        _buttons["edit"] = editBtn.element;

        const closeBtn = new Button({
            className: "close-btn",
            text: "Close",
            clickEventHandler: handleCloseBtn,
        });
        closeBtn.appendTo(_buttonGroup["view"]);
        _buttons["close"] = closeBtn.element;
    }

    function createEditButtonGroup() {
        _buttonGroup["edit"] = document.createElement("div");
        _buttonGroup["edit"].classList.add("button-group");
        _buttonGroup["edit"].classList.add("hidden");
        _dialogEl.appendChild(_buttonGroup["edit"]);

        const saveBtn = new Button({
            className: "save-btn",
            text: "Save",
            clickEventHandler: handleSaveBtn,
        });
        saveBtn.appendTo(_buttonGroup["edit"]);
        _buttons["save"] = saveBtn.element;

        const cancelBtn = new Button({
            className: "cancel-btn",
            text: "Cancel",
            clickEventHandler: handleCancelBtn,
        });
        cancelBtn.appendTo(_buttonGroup["edit"]);
        _buttons["cancel"] = cancelBtn.element;
    }

    function toggleEditMode() {
        Object.values(_labelTextMap).forEach((con) => {
            con.changeMode(_isEditMode);
        });

        if (_isEditMode) {
            _titleEl.removeAttribute("readonly");
            _titleSnapshot = _titleEl.value;
            _buttonGroup["view"].style.display = "none";
            _buttonGroup["edit"].style.display = "flex";
        } else {
            _titleEl.setAttribute("readonly", "readonly");
            _buttonGroup["view"].style.display = "flex";
            _buttonGroup["edit"].style.display = "none";
        }
    }

    function handleCancelBtn() {
        storedCallbackCall("onCancel");
        _isEditMode = false;
        _titleEl.value = _titleSnapshot;
        Object.values(_labelTextMap).forEach((con) => con.cancelTextChange());
        toggleEditMode();
    }

    function handleSaveBtn() {
        storedCallbackCall("onSave");
        _isEditMode = false;
        toggleEditMode();
    }

    function handleEditBtn() {
        storedCallbackCall("onEdit");
        _isEditMode = true;
        toggleEditMode();
    }

    function handleCloseBtn() {
        storedCallbackCall("onClose");
        _dialogs.style.display = "none";
        _dialogEl.open = false;
    }

    return new Dialog(title, options);
};
