export interface IAuthor {
    id: string;
    name: string;
    profileImage: string;
    username: string;
}

export interface IComments {
    id: string;
    parentCommentId?: string;
    sender: IAuthor;
    text: string;
    totalComments: number;
    totalLikes: number;
    subComments: IComments[];
    createdAt: string;
    thumbnails?: string[];
    likedBy: string[];
}

export interface IThread {
    id: string;
    author: IAuthor;
    comments: IComments[];
    createdAt: string;
    likedBy: string[];
    title: string;
    totalComments: number;
    totalLikes: number;
    thumbnails?: string[];
}