import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import type ObjExamine from "#/network/client/model/game/ObjExamine.js";

export default class ObjExamineHandler extends MessageHandler {
    handle(message: ObjExamine, player: NetworkPlayer): boolean {
        return true;
    }
}
