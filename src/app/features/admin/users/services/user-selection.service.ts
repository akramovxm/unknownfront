import {Injectable} from '@angular/core';
import {AdminUser} from "@features/admin/users/models/admin-user";
import {SelectionModel} from "@angular/cdk/collections";

@Injectable({
    providedIn: 'root'
})
export class UserSelectionService {
    readonly selection = new SelectionModel<AdminUser>(true, []);

    getFromLocalStorage(): AdminUser[] {
        const users = localStorage.getItem("users");
        if (users) {
            return JSON.parse(users);
        }
        return [];
    }

    saveToLocalStorage() {
        localStorage.setItem("users", JSON.stringify(this.selection.selected));
    }

    removeFromLocalStorage() {
        localStorage.removeItem("users");
    }

    updateLocalStorage(user: AdminUser) {
        let string = localStorage.getItem("users");
        if (string) {
            const users: AdminUser[] = JSON.parse(string);
            let index = users.findIndex(u => u.id === user.id);
            if (index > -1) {
                users[index] = user;
                localStorage.setItem("users", JSON.stringify(users));
            }
        }
    }
}
