import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {AdminUser} from "@entities/admin-user";

@Injectable({
    providedIn: 'root'
})
export class UserSelectionService {

    users: AdminUser[] = [];

    constructor() {
        const users = localStorage.getItem("users");
        if (users) {
            this.users = JSON.parse(users);
        }
    }

    set(users: AdminUser[]) {
        localStorage.setItem("users", JSON.stringify(users));
        this.users = users;
    }

    remove() {
        localStorage.removeItem("users");
        this.users = [];
    }

    update(user: AdminUser) {
        debugger
        let index = this.users.findIndex(u => u.id === user.id);
        if (index > -1) {
            this.users[index] = user;
            localStorage.setItem("users", JSON.stringify(this.users));
        }
    }
}
