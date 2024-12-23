import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import type OpNpc1 from "#/network/client/model/game/OpNpc1.js";

export default class OpNpc1Handler extends MessageHandler {
    handle(message: OpNpc1, player: NetworkPlayer): boolean {
        return true;
    }
}
