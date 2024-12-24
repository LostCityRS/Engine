import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import MessageHandler from '#/network/client/handler/MessageHandler.ts';
import type OpLoc from "#/network/client/model/game/OpLoc.js";
import MessageGame from "#/network/server/model/game/MessageGame.js";

export default class OpLocHandler extends MessageHandler {
    handle(message: OpLoc, player: NetworkPlayer): boolean {

        //todo: remove easter egg
        if (message.op === 1 && message.locId === 1530) {
            player.write(new MessageGame('Knock Knock...'))
            return true;
        }

        console.log("OpLoc1:", message.locId)
        return true;
    }
}
