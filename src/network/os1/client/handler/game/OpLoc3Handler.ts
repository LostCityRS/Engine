import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import type OpLoc3 from "#/network/client/model/game/OpLoc3.js";

export default class OpLoc3Handler extends MessageHandler {
    handle(message: OpLoc3, player: NetworkPlayer): boolean {
        return true;
    }
}
