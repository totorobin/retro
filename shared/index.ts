export interface User {
  uuid: string;
  name: string;
  picture: string;
  playing: boolean;
  loggedIn: boolean;
}

export interface Board {
    name: string
    users: Array<User>
}

export interface ServerToClientEvents {
  logged: (me: User) => void;
  players: (players: Array<User>) => void;
  board: (room: Board) => void;
  kickOut: () => void;
}

export interface ClientToServerEvents {
  login: (me: Partial<User>) => void;
  newBoard: (
      boardId: string | null,
    callback: (boardId: string) => void
  ) => void;
  joinBoard: (boardId: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId?: string;
}
