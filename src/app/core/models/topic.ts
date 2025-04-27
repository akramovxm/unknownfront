export interface Topic {
    id: number;
    titleUz: string;
    titleRu: string;
    seq: number;
    prevId: number | null;
    nextId: number | null;
}