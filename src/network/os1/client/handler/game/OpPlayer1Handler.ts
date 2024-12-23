import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import type OpPlayer1 from "#/network/client/model/game/OpPlayer1.js";

export default class OpPlayer1Handler extends MessageHandler {
    handle(message: OpPlayer1, player: NetworkPlayer): boolean {
        return true;
    }
}
