import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import type OpLoc5 from "#/network/client/model/game/OpLoc5.js";

export default class OpLoc5Handler extends MessageHandler {
    handle(message: OpLoc5, player: NetworkPlayer): boolean {
        return true;
    }
}
