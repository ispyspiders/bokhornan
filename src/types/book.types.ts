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