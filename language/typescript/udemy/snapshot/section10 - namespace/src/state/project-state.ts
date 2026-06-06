namespace App {
    type Listener<T> = (items: T[]) => void;

    class ListenableState<T> {
        protected listeners: Listener<T>[] = [];

        addListener(listenerFn: Listener<T>) {
            this.listeners.push(listenerFn);
        }
    }

    export class ProjectState extends ListenableState<Project> {
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

    export const projectState = ProjectState.getInstance();
}
