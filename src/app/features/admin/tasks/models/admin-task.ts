import {AdminTopic} from "@features/admin/topics/models/admin-topic";
import {User} from "@models/user";
import {AdminSource} from "@models/admin-source";

export interface AdminTask {
    id: number;
    contentUz: string;
    contentRu: string;
    level: string;
    type: string;
    rowAnswers: boolean;
    topic: AdminTopic | null;
    source: AdminSource | null;
    answers: AdminAnswer[];
    createdAt: Date;
    updatedAt: Date;
    createdBy: User | null;
    updatedBy: User | null;
}

export interface AdminAnswer {
    id: number;
    valueUz: string;
    valueRu: string;
    correct: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: User | null;
    updatedBy: User | null;
}