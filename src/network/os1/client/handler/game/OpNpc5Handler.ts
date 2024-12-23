import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import type OpNpc5 from "#/network/client/model/game/OpNpc5.js";

export default class OpNpc5Handler extends MessageHandler {
    handle(message: OpNpc5, player: NetworkPlayer): boolean {
        return true;
    }
}
