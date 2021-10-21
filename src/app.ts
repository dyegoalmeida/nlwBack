import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

import { router } from "./routes";

const app = express();

app.use(cors());

const serverHttp = http.createServer(app);

const io = new Server(serverHttp, {
    cors: {
        origin: "*"
    }
});

io.on("connection", socket => {
    console.log(`Usuário conectado no socket ${socket.id}`);
});

/**
 * TypeError: Cannot destructure property 'code' of 'request.body' as it is undefined.
 * O express não aceita requisições somente via json, então precisamos
 * especificar pra ele isso, para que possa receber dentro do body dele requisições
 * via json.
 */
app.use(express.json());

app.use(router);

app.get("/github", (request, response) => {
    response.redirect(
        `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`
    );
});

app.get("/signin/callback", (request, response) => {
    //Destruturação, pegaremos o code de dentro da query
    const { code } = request.query;
    return response.json(code);
});

export {serverHttp, io }