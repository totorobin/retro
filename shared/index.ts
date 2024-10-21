export interface User {
    uuid: string;
    name: string;
    picture: string;
    playing: boolean;
    loggedIn: boolean;
}

export interface BoardComponent {
    id?: string;
    owner?: string;
    type: string;
    position: number[];
}

export interface PostIt extends BoardComponent {
    text: string;
    color: string;
    visible: boolean;
}

export interface Board {
    uuid: string
    users: Array<User>
    components: Array<BoardComponent>
}

export interface ServerToClientEvents {
    logged: (me: User) => void;
    players: (players: Array<User>) => void;
    board: (board: Board) => void;
    boards: (boards: Array<Board>) => void;
    kickOut: () => void;
}

export interface ClientToServerEvents {
    login: (me: Partial<User>) => void;
    newBoard: (
        boardId: string | null,
        callback: (boardId: string) => void
    ) => void;
    joinBoard: (boardId: string) => void
    addComponent: (boardId: string, component: BoardComponent, callback: (componentId: string) => void) => void
    updateComponent: (boardId: string, component: BoardComponent) => void
    deleteComponent: (boardId: string, componentId: string) => void
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    userId?: string;
}
