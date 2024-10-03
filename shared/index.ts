export interface User {
    uuid: string;
    name: string;
    picture: string
    playing: boolean;
    loggedIn: boolean;
}


export interface ServerToClientEvents {
    logged: (me: User) => void;
    players: (players: Array<User>) => void;
}

export interface ClientToServerEvents {
    login: (me: Partial<User>) => void;
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    user?: User;
}