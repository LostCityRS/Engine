import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import type OpObj2 from "#/network/client/model/game/OpObj2.js";

export default class OpObj2Handler extends MessageHandler {
    handle(message: OpObj2, player: NetworkPlayer): boolean {
        return true;
    }
}
