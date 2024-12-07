import {Server as Engine} from "engine.io";
import {Server, Socket} from "socket.io";
import {defineEventHandler} from "h3";
import {NitroApp} from "nitropack/types";
import names from './names.json';

function getRandomName() {
    const min = 0;
    const max = names.length;
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return names[randomNum];
}

export default defineNitroPlugin((nitroApp: NitroApp) => {
    const engine = new Engine();
    const io = new Server();

    const currentUsers: { id: Socket['id'], name: string }[] = [];

    io.bind(engine);

    io.on('connect', (socket) => {
        io.emit('current users', currentUsers);
    })
    io.on("connection", (socket) => {
        const newUser = {id: socket.id, name: getRandomName()};
        currentUsers.push(newUser);
        io.emit('new user', newUser);
        socket.on('message', (message) => {
            console.log('message:', message);
            socket.broadcast.emit('received-message', message);
        })
        socket.on("disconnect", () => {
            socket.broadcast.emit('user disconnected', currentUsers.find(currentUser => currentUser.id === socket.id));
            currentUsers.splice(currentUsers.indexOf(newUser), 1);
        })
    });

    nitroApp.router.use("/socket.io/", defineEventHandler({
        handler(event) {
            engine.handleRequest(event.node.req, event.node.res);
            event._handled = true;
        },
        websocket: {
            open(peer) {
                // @ts-expect-error private method and property
                engine.prepare(peer._internal.nodeReq);
                // @ts-expect-error private method and property
                engine.onWebSocket(peer._internal.nodeReq, peer._internal.nodeReq.socket, peer.websocket);
            }
        }
    }));
});
