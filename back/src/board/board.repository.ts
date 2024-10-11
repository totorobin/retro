import { Board } from "@retro/shared";
import { Errors } from "../utils";

export class BoardRepository {
  private readonly board: Map<string, Board> = new Map();

  findAll(): Promise<Board[]> {
    const entities = Array.from(this.board.values());
    return Promise.resolve(entities);
  }

  findById(id: string): Promise<Board> {
    if (this.board.has(id)) {
      return Promise.resolve(this.board.get(id)!);
    } else {
      return Promise.reject(Errors.ENTITY_NOT_FOUND);
    }
  }

  save(entity: Board): Promise<void> {
    this.board.set(entity.name, entity);
    return Promise.resolve();
  }
}
