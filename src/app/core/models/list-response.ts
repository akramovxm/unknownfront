export interface ListResponse<T> {
    message: string;
    data: T;
    totalElements: number;
    page: number;
    size: number;
}
