import {User} from "./user";

export interface AdminSource {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: User | null;
    updatedBy: User | null;
}