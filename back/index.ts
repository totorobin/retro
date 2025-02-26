import {v4 as uuid} from "uuid";
import express, {type Express} from "express";
import {createServer} from "http";
import {createApplication} from "./src/app";
import {UserRepository} from "./src/user/user.repository";
import {BoardRepository} from "./src/board/board.repository";
import fileUpload from 'express-fileupload';
import path from 'node:path';

const app: Express = express();
const httpServer = createServer(app);
const port: string | number = process.env.PORT ?? 3000;

app.use(express.static("public"));
app.use(fileUpload())

app.post('/download', (req, res) => {

    const filename = uuid();
    const path = `${__dirname}/files/pictures/${filename}.jpg`;
    // @ts-ignore
    req.files.file.mv(path, (err: any) => {
        if (err) {
            console.log('error', err)
            return res.status(500).send(err)
        } else {
            console.log('file upload complete');
            res.json({id: filename})
        }

    })
})

app.get('/data/pictures/:id', (req, res) => {
    res.sendFile(path.resolve('files/pictures', req.params.id + '.jpg'));
})

const io = createApplication(
    httpServer,
    {
        userRepo: new UserRepository(),
        boardRepo: new BoardRepository(),
    },
    {}
);
if (io != null) {
    console.log("websocket Server initiated");
}

httpServer.listen(port, () => {
    console.log(`server is running a http://localhost:${port}`);
});
