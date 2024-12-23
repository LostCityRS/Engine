import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import type OpLoc2 from "#/network/client/model/game/OpLoc2.js";

export default class OpLoc2Handler extends MessageHandler {
    handle(message: OpLoc2, player: NetworkPlayer): boolean {
        return true;
    }
}
