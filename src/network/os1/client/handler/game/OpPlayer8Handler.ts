import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import type OpPlayer8 from "#/network/client/model/game/OpPlayer8.js";

export default class OpPlayer8Handler extends MessageHandler {
    handle(message: OpPlayer8, player: NetworkPlayer): boolean {
        return true;
    }
}
