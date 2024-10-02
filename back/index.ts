import express, {type Express} from 'express';
import { createServer } from "http";
import {createApplication} from "./src/app";
import {UserRepository} from "./src/user/user.repository";

const app: Express = express();
const httpServer = createServer(app);
const port: string | number = process.env.PORT ?? 3000;

app.use(express.static('public'));

const io = createApplication(
    httpServer,
    {
        userRepo: new UserRepository()
    },
    {
    }
);
if (io != null) {
    console.log('websocket Server initiated');
}

httpServer.listen(port, () => {
    console.log(`server is running a http://localhost:${port}`);
});