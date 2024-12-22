import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import NoOp from '#/network/client/model/game/NoOp.ts';
import GameServerMessage from '#/network/server/GameServerMessage.ts';

export default class IfButtonHandler extends MessageHandler {
    handle(message: GameServerMessage | NoOp, player: NetworkPlayer): boolean {
        if (message == NoOp)
            return true
        player.write(message as GameServerMessage);
        return true;
    }
}
