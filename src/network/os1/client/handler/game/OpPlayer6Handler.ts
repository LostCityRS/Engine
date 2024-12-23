import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import type OpPlayer6 from "#/network/client/model/game/OpPlayer6.js";

export default class OpPlayer6Handler extends MessageHandler {
    handle(message: OpPlayer6, player: NetworkPlayer): boolean {
        return true;
    }
}
