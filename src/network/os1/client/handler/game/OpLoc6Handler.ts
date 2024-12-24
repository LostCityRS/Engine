import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import MessageGame from "#/network/server/model/game/MessageGame.js";
import type OpLoc6 from "#/network/client/model/game/OpLoc6.js";

export default class OpLoc6Handler extends MessageHandler {
    handle(message: OpLoc6, player: NetworkPlayer): boolean {

        //todo: remove easter egg
        if (message.id === 1530) {
            player.write(new MessageGame("Who's there?"));
            return true;
        }

        return true;
    }
}
