import { Autobind } from "../decorators/autobind.js";
import { DragTarget } from "../models/drag-drop.js";
import { Project, ProjectStatus } from "../models/project.js";
import { projectState } from "../state/project-state.js";
import Component from "./base.js";
import { ProjectItem } from "./project-item.js";

export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
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
