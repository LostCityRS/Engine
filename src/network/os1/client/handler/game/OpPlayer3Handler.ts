import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import type OpPlayer3 from "#/network/client/model/game/OpPlayer3.js";

export default class OpPlayer3Handler extends MessageHandler {
    handle(message: OpPlayer3, player: NetworkPlayer): boolean {
        return true;
    }
}
