import { Components } from "../app";
import { User } from "@retro/shared";
import { v4 as uuid } from "uuid";
import {
  type Config,
  starWars,
  uniqueNamesGenerator,
} from "unique-names-generator";
import { Server, Socket } from "socket.io";

const userNameConfig: Config = {
  dictionaries: [starWars],
  style: "capital",
  length: 1,
};

export default function ({ userRepo }: Components) {
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
        io.to(`user-${user.uuid}`).emit("logged", user);

        // notify the other users
        const players = await userRepo.findAll();
        console.log("broadcast players : ", players);
        io.emit("players", players);
      },
    logout: (io: Server) =>
      async function (uuid: string) {
        try {
          const user = await userRepo.findById(uuid);
          user.loggedIn = false;

          // notify the other users
          const players = await userRepo.findAll();
          console.log("broadcast players : ", players);
          io.emit("players", players);
        } catch (e) {
          console.error(e);
        }
      },
  };
}
