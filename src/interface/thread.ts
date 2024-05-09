export interface IAuthor {
    id: string;
    name: string;
    email: string;
    profileImage: string;
    username: string;
    bio: string;
    threads?: IThread[];
    comments?: IComments[];
    totalFollowers: number;
    totalFollowing: number;
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
    threadId?: string;
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