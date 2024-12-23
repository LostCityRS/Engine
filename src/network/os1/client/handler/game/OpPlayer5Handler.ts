import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import type OpPlayer5 from "#/network/client/model/game/OpPlayer5.js";

export default class OpPlayer5Handler extends MessageHandler {
    handle(message: OpPlayer5, player: NetworkPlayer): boolean {
        return true;
    }
}
