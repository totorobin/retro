import {Components} from "../app";
import {User} from "@retro/shared";
import {v4 as uuid} from "uuid";
import {EventEmitter} from 'events'
import {type Config, starWars, uniqueNamesGenerator,} from "unique-names-generator";
import {Server, Socket} from "socket.io";

const userNameConfig: Config = {
    dictionaries: [starWars],
    style: "capital",
    length: 1,
};

export default function ({userRepo}: Components, emitter: EventEmitter) {
    return {
        login: (io: Server, socket: Socket) =>
            async function (me: Partial<User>) {
                let user = me as User;

                if (user.uuid) {
                    try {
                        user = await userRepo.findById(user.uuid);
                        if (me.name) user.name = me.name;
                    } catch (e) {
                        console.error(e);
                    }
                } else user.uuid = uuid();

                if (!user.name) user.name = uniqueNamesGenerator(userNameConfig);

                user.loggedIn = true;
                // persist the entity
                try {
                    await userRepo.save(user);
                } catch (e) {
                    //TODO
                }

                socket.data.userId = user.uuid;
                socket.join(`user-${user.uuid}`);

                // acknowledge the creation
                console.log("logged", socket.id, user);
                emitter.emit('broadcastUsers', [user.uuid])

                // notify the other users

                emitter.emit('broadcastAllUsers')

            },
        logout: (io: Server) =>
            async function (uuid: string) {
                try {
                    const user = await userRepo.findById(uuid);
                    user.loggedIn = false;

                    emitter.emit('broadcastBoardsFromUser', uuid)
                    // notify the other users
                    emitter.emit('broadcastAllUsers')
                } catch (e) {
                    console.error(e);
                }
            },
    };
}
