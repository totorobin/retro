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

export interface Area extends BoardComponent {
    color: string;
    title: string;
    visible: boolean;
    forceVisiblility: boolean | null;
    lock: boolean;
}

export interface Picture extends BoardComponent {
    imageId: string;
    lock: boolean;
}

export interface Board {
    uuid: string
    ownerId: string
    users: Array<User>
    components: Array<BoardComponent>
}

export interface SavedBoard {
    uuid: string,
    ownerId: string
    users: string[],
    components: BoardComponent[],
}

export interface ServerToClientEvents {
    logged: (me: User) => void;
    players: (players: Array<User>) => void;
    board: (board: Board) => void;
    kickOut: () => void;
}

export interface ClientToServerEvents {
    login: (me: Partial<User>) => void;
    myBoards: (callback: (myBoards : Array<SavedBoard>) => void) => void;
    newBoard: (
        boardId: string | null,
        callback: (boardId: string) => void
    ) => void;
    joinBoard: (boardId: string) => void
    leaveBoard: (boardId: string) => void
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
