export interface Book {
    id: string,
    volumeInfo: VolumeInfo,
}

export interface VolumeInfo {
    title: string,
    authors: Array<string>,
    publisher: string,
    publishedDate: string,
    description: string,
    pageCount: number,
    printType: string,
    categories: Array<string>,
    imageLinks: ImageLinks,
    language: string,
}

export interface ImageLinks {
    smallThumbnail: string,
    thumbnail: string
}

export interface LikedBook {
    id: number,
    user_id: number,
    book_id: string,
    created_at: string,
    updated_at: string,
    title: string,
    thumbnail: string
}

export const bookUrl = "https://www.googleapis.com/books/v1/volumes";