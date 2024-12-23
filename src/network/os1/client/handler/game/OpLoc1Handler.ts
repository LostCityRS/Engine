import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import type OpLoc1 from "#/network/client/model/game/OpLoc1.js";

export default class OpLoc1Handler extends MessageHandler {
    handle(message: OpLoc1, player: NetworkPlayer): boolean {
        return true;
    }
}
