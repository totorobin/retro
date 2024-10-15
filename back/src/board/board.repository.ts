import { Errors } from "../utils";


export interface SavedBoard {
  uuid: string,
  users: string[]
}

export class BoardRepository {
  private readonly board: Map<string, SavedBoard> = new Map();

  findAll(): Promise<SavedBoard[]> {
    const entities = Array.from(this.board.values());
    return Promise.resolve(entities);
  }

  findById(uuid: string): Promise<SavedBoard> {
    if (this.board.has(uuid)) {
      return Promise.resolve(this.board.get(uuid)!);
    } else {
      return Promise.reject(Errors.ENTITY_NOT_FOUND);
    }
  }

  save(entity: SavedBoard): Promise<void> {
    this.board.set(entity.uuid, entity);
    return Promise.resolve();
  }
  findAllByUser(uuid: string) : Promise<SavedBoard[]> {
    const entities = Array.from(this.board.values()).filter(b => b.users.includes(uuid));
    return Promise.resolve(entities);
  }
}
