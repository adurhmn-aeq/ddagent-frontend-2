export interface IUser {
    firstname: string;
    lastname: string;
    email: string;
    userId: string;
    // inviteId: string;
}

export type CurrentUserContextType = {
    users: IUser[];
    saveUser: (user: IUser) => void
}

//user interface