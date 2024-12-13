import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import type MoveClick from '#/network/client/game/model/MoveClick.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import RebuildNormal from '#/network/server/game/model/RebuildNormal.ts';

export default class MoveClickHandler extends MessageHandler {
    handle(message: MoveClick, player: NetworkPlayer): boolean {
        if (!message.route.length) {
            return true;
        }

        let destX = message.route[message.route.length - 1].x;
        let destZ = message.route[message.route.length - 1].z;

        player.write(new RebuildNormal(destX, destZ));
        return true;
    }
}
