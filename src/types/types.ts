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
}


export interface Model {
    id: string;
    name: string;
}