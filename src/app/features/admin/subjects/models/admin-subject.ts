import {User} from "@models/user";

export interface AdminSubject {
    id: number;
    titleUz: string;
    titleRu: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: User | null;
    updatedBy: User | null;
}