import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import type OpObj4 from "#/network/client/model/game/OpObj4.js";

export default class OpObj4Handler extends MessageHandler {
    handle(message: OpObj4, player: NetworkPlayer): boolean {
        return true;
    }
}
