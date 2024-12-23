import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import type NpcExamine from "#/network/client/model/game/NpcExamine.js";

export default class NpcExamineHandler extends MessageHandler {
    handle(message: NpcExamine, player: NetworkPlayer): boolean {
        return true;
    }
}
