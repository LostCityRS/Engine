import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import type MoveClick from '#/network/client/model/game/MoveClick.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import RebuildNormal from '#/network/server/model/game/RebuildNormal.ts';
import Logout from '#/network/server/model/game/Logout.ts';

export default class LogoutHandler extends MessageHandler {
    handle(message: Logout, player: NetworkPlayer): boolean {
        player.write(message);
        return true;
    }
}
