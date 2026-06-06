interface Draggable {
    dragStartHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
    dragOverHandler(event: DragEvent): void;
    dropHandler(event: DragEvent): void;
    dragLeaveHandler(event: DragEvent): void;
}

enum ProjectStatus {
    ACTIVE = "active",
    FINISHED = "finished",
}

class Project {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public people: number,
        public status: ProjectStatus
    ) {}
}

type Listener<T> = (items: T[]) => void;

class ListenableState<T> {
    protected listeners: Listener<T>[] = [];

    addListener(listenerFn: Listener<T>) {
        this.listeners.push(listenerFn);
    }
}

class ProjectState extends ListenableState<Project> {
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor() {
        super();
    }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    addProject(project: { title: string; desc: string; people: number }) {
        const newProj = new Project(
            Math.random().toString(),
            project.title,
            project.desc,
            project.people,
            ProjectStatus.ACTIVE
        );
        this.projects.push(newProj);
        this.notify();
    }

    notify() {
        for (const listener of this.listeners) {
            listener(this.projects.slice()); // 리스너가 프로젝트배열을 조작하지 못하도록 카피본을 넘겨준다.
        }
    }

    moveProject(projId: string, newStatus: ProjectStatus) {
        const project = this.projects.find((proj) => proj.id === projId);
        if (project && project.status !== newStatus) {
            project.status = newStatus;
            this.notify();
        }
    }
}

const projectState = ProjectState.getInstance();

interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validate(input: Validatable) {
    let isValid = true;
    if (input.required) {
        isValid = isValid && input.value.toString().trim().length !== 0;
    }
    if (input.minLength != null && typeof input.value === "string") {
        isValid = isValid && input.value.length >= input.minLength;
    }
    if (input.maxLength != null && typeof input.value === "string") {
        isValid = isValid && input.value.length <= input.maxLength;
    }
    if (input.min != null && typeof input.value === "number") {
        isValid = isValid && input.value >= input.min;
    }
    if (input.max != null && typeof input.value === "number") {
        isValid = isValid && input.value <= input.max;
    }
    return isValid;
}

function Autobind(
    _: any, // target
    _2: string, // methodName
    descriptor: PropertyDescriptor
): PropertyDescriptor {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            return originalMethod.bind(this);
        },
    };
    return adjDescriptor;
}

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        super("project-input", "app", "front", "user-input");
        this.titleInputElement = this.element.querySelector("#title")! as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector(
            "#description"
        )! as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector("#people")! as HTMLInputElement;
        this.configure();
    }

    configure() {
        // submitHandler 안의 this가 현재 이 클래스를 가리키도록 bind해주어야 한다. or 데코레이터 사용
        // this.element.addEventListener("submit", this.submitHandler.bind(this));
        this.element.addEventListener("submit", this.submitHandler);
    }

    renderContent(): void {}

    @Autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            projectState.addProject({ title, desc, people });
        }
        this.clearInput();
    }

    private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDesc = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;

        if (
            validate({ value: enteredTitle, required: true }) &&
            validate({ value: enteredDesc, required: true, minLength: 5 }) &&
            validate({ value: Number(enteredPeople), required: true, min: 1, max: 5 })
        ) {
            return [enteredTitle, enteredDesc, Number(enteredPeople)];
        } else {
            alert("Invalid Input, please fill out all input");
            return;
        }
    }

    private clearInput() {
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.peopleInputElement.value = "";
    }
}

class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
    constructor(private projectType: "active" | "finished") {
        super("project-list", "app", "back", `${projectType}-projects`);

        this.configure();
        this.renderContent();
    }

    configure(): void {
        projectState.addListener(this.renderProjects);
        this.element.addEventListener("dragover", this.dragOverHandler);
        this.element.addEventListener("drop", this.dropHandler);
        this.element.addEventListener("dragleave", this.dragLeaveHandler);
    }

    renderContent(): void {
        const listId = `${this.projectType}-projects-list`;
        this.element.querySelector("ul")!.id = listId;
        this.element.querySelector("h2")!.textContent =
            this.projectType.toUpperCase() + " PROJECTS";
    }

    @Autobind
    dragOverHandler(event: DragEvent): void {
        if (event.dataTransfer?.types[0] === "text/plain") {
            event.preventDefault(); // 기본값으로 drop이 불가능하게 되어있으므로 preventDefault()를 호출해주어야한다.
            const listEl = this.element.querySelector("ul")!;
            listEl.classList.add("droppable");
        }
    }

    @Autobind
    dropHandler(event: DragEvent): void {
        const projId = event.dataTransfer!.getData("text/plain");
        projectState.moveProject(
            projId,
            this.projectType === "active" ? ProjectStatus.ACTIVE : ProjectStatus.FINISHED
        );
    }

    @Autobind
    dragLeaveHandler(_: DragEvent): void {
        const listEl = this.element.querySelector("ul")!;
        listEl.classList.remove("droppable");
    }

    @Autobind
    private renderProjects(projects: Project[]) {
        const listEl = document.getElementById(
            `${this.projectType}-projects-list`
        )! as HTMLUListElement;
        listEl.innerHTML = "";
        for (const projItem of projects) {
            if (projItem.status === this.projectType) {
                new ProjectItem(this.element.querySelector("ul")!.id, projItem);
            }
        }
    }
}

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
    private project: Project;

    get persons() {
        if (this.project.people === 1) return "1 person";
        return `${this.project.people} persons`;
    }

    constructor(hostId: string, project: Project) {
        super("single-project", hostId, "back", project.id);
        this.project = project;

        this.configure();
        this.renderContent();
    }

    configure(): void {
        this.element.addEventListener("dragstart", this.dragStartHandler);
        this.element.addEventListener("dragend", this.dragEndHandler);
    }
    renderContent(): void {
        this.element.querySelector("h2")!.textContent = this.project.title;
        this.element.querySelector("h3")!.textContent = this.persons + " assigned";
        this.element.querySelector("p")!.textContent = this.project.description;
    }

    @Autobind
    dragStartHandler(event: DragEvent): void {
        event.dataTransfer!.setData("text/plain", this.project.id);
        event.dataTransfer!.effectAllowed = "move";
    }

    @Autobind
    dragEndHandler(_: DragEvent): void {
        console.log("drag end");
    }
}

const pInput = new ProjectInput();
const activePList = new ProjectList("active");
const finishedPList = new ProjectList("finished");
