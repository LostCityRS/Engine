import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import type OpNpc4 from "#/network/client/model/game/OpNpc4.js";

export default class OpNpc4Handler extends MessageHandler {
    handle(message: OpNpc4, player: NetworkPlayer): boolean {
        return true;
    }
}
