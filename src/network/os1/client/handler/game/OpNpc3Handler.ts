import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import type OpNpc3 from "#/network/client/model/game/OpNpc3.js";

export default class OpNpc3Handler extends MessageHandler {
    handle(message: OpNpc3, player: NetworkPlayer): boolean {
        return true;
    }
}
