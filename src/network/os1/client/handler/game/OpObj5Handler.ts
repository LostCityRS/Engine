import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import type OpObj5 from "#/network/client/model/game/OpObj5.js";

export default class OpObj5Handler extends MessageHandler {
    handle(message: OpObj5, player: NetworkPlayer): boolean {
        return true;
    }
}
