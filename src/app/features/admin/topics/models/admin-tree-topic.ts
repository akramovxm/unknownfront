import {Topic} from "@models/topic";
import {User} from "@models/user";

export interface AdminTreeTopic {
    id: number;
    titleUz: string;
    titleRu: string;
    seq: number;
    parent: Topic | null;
    children: AdminTreeTopic[];
    prevId: number | null;
    nextId: number | null;
    createdAt: Date;
    updatedAt: Date;
    createdBy: User | null;
    updatedBy: User | null;
}