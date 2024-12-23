import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import type OpLoc1 from "#/network/client/model/game/OpLoc1.js";
import MessageGame from "#/network/server/model/game/MessageGame.js";

export default class OpLoc1Handler extends MessageHandler {
    handle(message: OpLoc1, player: NetworkPlayer): boolean {

        //todo: remove easter egg
        if (message.locId === 1530) {
            player.write(new MessageGame('Knock Knock...'))
            return true;
        }

        console.log("OpLoc1:", message.locId)
        return true;
    }
}
