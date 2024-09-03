import {Hono} from 'hono'
import {createBunWebSocket} from 'hono/bun'
import {WSContext} from "hono/dist/types/helper/websocket";

const app = new Hono()
const {upgradeWebSocket, websocket} = createBunWebSocket()
const users = new Set<WSContext>();

app.get('/', (c) => {
    return c.json({message: 'Hello World'})
})

Bun.serve({
    fetch: app.fetch,
    websocket,
})

export default app;