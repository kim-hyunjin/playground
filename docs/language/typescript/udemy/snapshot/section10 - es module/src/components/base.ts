// default export보다는 네임드 export를 사용하는 것이 더 좋다. import하는쪽의 name을 강제할 수 있기 때문
export default abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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
        if (insertPos === "front") this.hostElement.insertAdjacentElement("afterbegin", element);
        if (insertPos === "back") this.hostElement.insertAdjacentElement("beforeend", element);
    }
}
