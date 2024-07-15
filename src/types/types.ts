export interface Chapter {
    id: string;
    title: string;
    content: string;
    chapterNumber: number;
}

export interface Story {
    id: string;
    title: string;
    chapters: Chapter[];
    categories: string[];
}

export interface Book {
    id: string;
    name: string;
    text: string;
    model: string;
}