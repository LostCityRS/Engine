import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import type OpPlayer7 from "#/network/client/model/game/OpPlayer7.js";

export default class OpPlayer7Handler extends MessageHandler {
    handle(message: OpPlayer7, player: NetworkPlayer): boolean {
        return true;
    }
}
