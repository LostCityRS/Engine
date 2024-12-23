import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import type OpObj3 from "#/network/client/model/game/OpObj3.js";

export default class OpObj3Handler extends MessageHandler {
    handle(message: OpObj3, player: NetworkPlayer): boolean {
        return true;
    }
}
