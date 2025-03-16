export class ChangedTopic {
    constructor(
        public id: number,
        public seq: number,
        public prevId: number,
        public lastNextId: number,
        public parentId: number
    ) {
    }
}