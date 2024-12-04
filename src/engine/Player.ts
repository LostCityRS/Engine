import type ServerMessage from '#/network/server/ServerMessage.ts';
import type ClientSocket from '#/server/ClientSocket.ts';

export default class Player {
    client: ClientSocket | null = null;

    write(_: ServerMessage) {
    }
}
