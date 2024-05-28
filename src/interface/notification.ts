import { IAuthor } from "./thread";

export interface INotification {
    id: string;
    sender: IAuthor;
    content: string;
    redirectUrl: string;
    createdAt: string;
}

export interface INotificationData {
    notifications: INotification[];
    totalCount: number;
}