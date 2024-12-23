import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import type OpPlayer2 from "#/network/client/model/game/OpPlayer2.js";

export default class OpPlayer2Handler extends MessageHandler {
    handle(message: OpPlayer2, player: NetworkPlayer): boolean {
        return true;
    }
}
