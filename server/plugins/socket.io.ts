import {Server as Engine} from "engine.io";
import {Server} from "socket.io";
import {defineEventHandler} from "h3";
import {NitroApp} from "nitropack/types";
import names from './names.json';

type User = { socketId: string[], userId: string, name: string, isConnected: boolean };
type Message = { friendId: string, userId: string, message: string, created: number };

function getRandomName() {
    const min = 0;
    const max = names.length;
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return names[randomNum];
}

export default defineNitroPlugin((nitroApp: NitroApp) => {
    const engine = new Engine();
    const io = new Server();

    const currentUsers: Map<string, User> = new Map();
    const messages: Map<string, Message[]> = new Map();

    io.bind(engine);

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId as string;
        const friendId = socket.handshake.query.friendId as string;
        const [id1, id2] = [userId, friendId].sort();

        io.emit('current users', Array.from(currentUsers, ([_, value]) => value));
        io.emit('room messages', messages.get(`${id1}-${id2}`) || [], userId, friendId);
        io.emit('latest messages', Array.from(messages, ([key, value]) => key.includes(userId) && value.sort((a, b) => b.created - a.created).filter((_, index) => index === 0)).filter(Boolean).flat());

        if (userId && currentUsers.has(userId)) {
            const currentUser = currentUsers.get(userId);
            currentUser?.socketId.push(socket.id);
            io.emit('new user', currentUser);
        } else {
            const newUser = {socketId: [socket.id], userId, isConnected: true, name: getRandomName()};
            currentUsers.set(newUser.userId, newUser);
            io.emit('new user', newUser);
        }

        socket.on('get friend', friendId => {
            const friend = currentUsers.get(friendId);
            socket.emit('receive friend', friend);
        })

        socket.on('message', (message: string, uid: string, fid: string) => {
            const [min, max] = [uid, fid].sort();
            const room = `${min}-${max}`;
            const created = new Date().getTime();
            const newMessage = {created, friendId: fid, userId: uid, message};

            if (messages.has(room)) {
                const messagesAlreadyInRoom = messages.get(room);
                if (messagesAlreadyInRoom) {
                    messages.set(room, [newMessage, ...messagesAlreadyInRoom]);
                }
            } else {
                messages.set(room, [newMessage]);
            }
            const friendSocketIds = currentUsers.get(fid)?.socketId;
            socket.to(friendSocketIds || []).emit('received message', newMessage, uid, fid);
        })
    });

    nitroApp.router.use("/socket.io/", defineEventHandler({
        handler(event) {
            // @ts-ignore
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
