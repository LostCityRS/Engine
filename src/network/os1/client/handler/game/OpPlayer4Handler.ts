import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import type OpPlayer4 from "#/network/client/model/game/OpPlayer4.js";

export default class OpPlayer4Handler extends MessageHandler {
    handle(message: OpPlayer4, player: NetworkPlayer): boolean {
        return true;
    }
}
