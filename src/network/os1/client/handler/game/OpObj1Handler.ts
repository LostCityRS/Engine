import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import type OpObj1 from "#/network/client/model/game/OpObj1.js";

export default class OpObj1Handler extends MessageHandler {
    handle(message: OpObj1, player: NetworkPlayer): boolean {
        return true;
    }
}
