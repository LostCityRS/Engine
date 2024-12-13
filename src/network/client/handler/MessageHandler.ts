import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import type ClientMessage from '#/network/client/ClientMessage.ts';
import type ClientSocket from '#/server/ClientSocket.ts';

export default abstract class MessageHandler {
    abstract handle(message: ClientMessage, client: ClientSocket | NetworkPlayer): boolean;
}
