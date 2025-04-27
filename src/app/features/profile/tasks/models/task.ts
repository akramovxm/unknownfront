import {Subject} from "@features/profile/subjects/models/subject";
import {Topic} from "@models/topic";
import {Source} from "@models/source";

export interface Task {
    id: number;
    contentUz: string;
    contentRu: string;
    level: string;
    type: string;
    rowAnswers: boolean;
    subject: Subject;
    topic: Topic | null;
    source: Source | null;
    answers: Answer[];
}

export interface Answer {
    id: number;
    valueUz: string;
    valueRu: string;
}