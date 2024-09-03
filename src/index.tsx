import {Hono} from 'hono'
import {createBunWebSocket} from 'hono/bun'
import {WSContext} from "hono/dist/types/helper/websocket";

const app = new Hono()
const {upgradeWebSocket, websocket} = createBunWebSocket()

const chatRooms = {} as Record<string, Set<WSContext>>;

app.get(
    '/x-com/:roomId',
    upgradeWebSocket((c) => {
        const roomId = c.req.param('roomId');
        return {
            onOpen(event, ws) {
                if (!chatRooms[roomId]) {
                    console.log('Connection opened for room:', roomId);
                    chatRooms[roomId] = new Set([ws]);
                } else {
                    chatRooms[roomId].add(ws);
                }
            },
            onMessage(event, ws) {
                const data = JSON.parse(event.data as string);
                const message = `${data.username}: ${data.message}`;
                chatRooms[roomId].forEach((user) => {
                    user.send(JSON.stringify(message));
                });
            },
            onClose: (event, ws) => {
                console.log('Connection closed')
                chatRooms[roomId].delete(ws);
            },
        }
    })
)

Bun.serve({
    fetch: app.fetch,
    websocket,
})

export default app;