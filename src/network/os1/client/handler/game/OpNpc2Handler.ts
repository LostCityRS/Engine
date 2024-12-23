import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import type OpNpc2 from "#/network/client/model/game/OpNpc2.js";

export default class OpNpc2Handler extends MessageHandler {
    handle(message: OpNpc2, player: NetworkPlayer): boolean {
        return true;
    }
}
