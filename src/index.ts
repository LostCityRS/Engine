import World from '#/engine/World.ts';
import ServerList from '#/engine/ServerList.ts';

import TcpServer from '#/server/TcpServer.ts';
import { startWeb } from '#/web/Web.ts';

await startWeb();

await World.load();

const server = new TcpServer();
await server.start(40001);

ServerList.update(1, 0);
