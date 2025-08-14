export type Pagination = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

export interface SearchParams {
    q?: string;
    page?: number;
    limit?: number;
}
