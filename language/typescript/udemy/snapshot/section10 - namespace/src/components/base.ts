namespace App {
    export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
        templateElement: HTMLTemplateElement;
        hostElement: T;
        element: U;

        constructor(
            templateId: string,
            hostElementId: string,
            insertPos: "front" | "back",
            newElementId?: string
        ) {
            this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
            this.hostElement = document.getElementById(hostElementId)! as T;
            const importedNode = document.importNode(this.templateElement.content, true);
            this.element = importedNode.firstElementChild! as U;
            if (newElementId) this.element.id = newElementId;

            this.attachToHostElement(this.element, insertPos);
        }

        abstract configure(): void;
        abstract renderContent(): void;

        private attachToHostElement(element: Element, insertPos: "front" | "back") {
            if (insertPos === "front")
                this.hostElement.insertAdjacentElement("afterbegin", element);
            if (insertPos === "back") this.hostElement.insertAdjacentElement("beforeend", element);
        }
    }
}
