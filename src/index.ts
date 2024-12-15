import World from '#/engine/World.ts';
import ServerList from '#/engine/ServerList.ts';

import TcpServer from '#/server/TcpServer.ts';
import { startWeb } from '#/web/Web.ts';
import Js5 from '#/engine/Js5.ts';

await startWeb();

await Js5.load();
await World.load();

const server = new TcpServer();
await server.start(40001);

ServerList.update(1, 0);
