import {Injectable} from '@angular/core';
import {AdminTask} from "@features/admin/tasks/models/admin-task";
import {SelectionModel} from "@angular/cdk/collections";

@Injectable({
    providedIn: 'root'
})
export class TaskSelectionService {
    readonly selection = new SelectionModel<AdminTask>(true, []);

    getFromLocalStorage(): AdminTask[] {
        const tasks = localStorage.getItem("tasks");
        if (tasks) {
            return JSON.parse(tasks);
        }
        return [];
    }

    saveToLocalStorage() {
        localStorage.setItem("tasks", JSON.stringify(this.selection.selected));
    }

    removeFromLocalStorage() {
        localStorage.removeItem("tasks");
    }

    updateLocalStorage(task: AdminTask) {
        let string = localStorage.getItem("tasks");
        if (string) {
            const tasks: AdminTask[] = JSON.parse(string);
            let index = tasks.findIndex(t => t.id === task.id);
            if (index > -1) {
                tasks[index] = task;
                localStorage.setItem("tasks", JSON.stringify(tasks));
            }
        }
    }
}
