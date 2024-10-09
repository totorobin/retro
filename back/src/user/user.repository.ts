import {User} from "@retro/shared";
import {Errors} from "../utils";

export class UserRepository {
    private readonly users: Map<string, User> = new Map();

    findAll(): Promise<User[]> {
        const entities = Array.from(this.users.values());
        return Promise.resolve(entities);
    }

    findById(id: string): Promise<User> {
        if (this.users.has(id)) {
            return Promise.resolve(this.users.get(id)!);
        } else {
            return Promise.reject(Errors.ENTITY_NOT_FOUND);
        }
    }

    save(entity: User): Promise<void> {
        this.users.set(entity.uuid, entity);
        return Promise.resolve();
    }

}