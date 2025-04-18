export interface Review {
    id: string,
    user_id: string,
    user_name: string,
    book_id: string,
    book_title: string,
    rating: number,
    comment: string,
    created_at: string,
    updated_at: string,
}