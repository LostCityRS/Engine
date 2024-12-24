import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import MessageGame from "#/network/server/model/game/MessageGame.js";
import type LocExamine from "#/network/client/model/game/LocExamine.js";

export default class LocExamineHandler extends MessageHandler {
    handle(message: LocExamine, player: NetworkPlayer): boolean {

        //todo: remove easter egg
        if (message.id === 1530) {
            player.write(new MessageGame("Who's there?"));
            return true;
        }

        return true;
    }
}
