import { Room } from "@retro/shared";
import { Errors } from "../utils";

export class RoomRepository {
  private readonly rooms: Map<string, Room> = new Map();

  findAll(): Promise<Room[]> {
    const entities = Array.from(this.rooms.values());
    return Promise.resolve(entities);
  }

  findById(id: string): Promise<Room> {
    if (this.rooms.has(id)) {
      return Promise.resolve(this.rooms.get(id)!);
    } else {
      return Promise.reject(Errors.ENTITY_NOT_FOUND);
    }
  }

  save(entity: Room): Promise<void> {
    this.rooms.set(entity.name, entity);
    return Promise.resolve();
  }
}
