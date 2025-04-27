import {User} from "@models/user";

export interface AdminTopic {
    id: number;
    titleUz: string;
    titleRu: string;
    seq: number;
    prevId: number | null;
    nextId: number | null;
    createdAt: Date;
    updatedAt: Date;
    createdBy: User | null;
    updatedBy: User | null;
}
