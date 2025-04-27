import {Subject} from "@features/profile/subjects/models/subject";
import {Topic} from "@models/topic";
import {Source} from "@models/source";

export interface TaskSnapshot {
    id: number;
    contentUz: string;
    contentRu: string;
    level: string;
    type: string;
    rowAnswers: boolean;
    subject: Subject;
    topic: Topic | null;
    source: Source | null;
    answers: AnswerSnapshot[];
    selectedAnswer: AnswerSnapshot | null;
    taskId: number;
}

export interface AnswerSnapshot {
    id: number;
    valueUz: string;
    valueRu: string;
    correct: boolean;
    answerId: number;
}