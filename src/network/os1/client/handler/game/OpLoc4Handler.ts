import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import type OpLoc4 from "#/network/client/model/game/OpLoc4.js";

export default class OpLoc4Handler extends MessageHandler {
    handle(message: OpLoc4, player: NetworkPlayer): boolean {
        return true;
    }
}
