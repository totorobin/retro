export interface User {
  uuid: string;
  name: string;
  picture: string;
  playing: boolean;
  loggedIn: boolean;
}

export interface Room {
    name: string
    users: List<User>
}

export interface ServerToClientEvents {
  logged: (me: User) => void;
  players: (players: Array<User>) => void;
  room: (room: Room) => void;
}

export interface ClientToServerEvents {
  login: (me: Partial<User>) => void;
  newRoom: (
    roomName: string | null,
    callback: (roomName: string) => void
  ) => void;
  joinRoom: (roomName: string)
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId?: string;
}
