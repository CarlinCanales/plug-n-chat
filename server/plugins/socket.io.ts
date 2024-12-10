import {Server as Engine} from "engine.io";
import {Server} from "socket.io";
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

    const currentUsers: Map<string, { userId: string, name: string, isConnected: boolean }> = new Map();

    io.bind(engine);

    io.on("connection", (socket) => {
        io.emit('current users', Array.from(currentUsers, ([_, value]) => value));

        const userId = socket.handshake.query.id as string;
        if (userId && currentUsers.has(userId)) {
            io.emit('new user', currentUsers.get(userId));
        } else {
            const newUser = {userId, isConnected: true, name: getRandomName()};
            currentUsers.set(newUser.userId, newUser);
            io.emit('new user', newUser);
        }

        socket.on('message', (message) => {
            socket.broadcast.emit('received-message', message);
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
