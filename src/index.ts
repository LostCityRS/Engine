import World from '#/engine/World.ts';
import TcpServer from '#/server/TcpServer.ts';

await World.load();

const server = new TcpServer();
server.start(40001);
