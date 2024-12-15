import GameServerMessage from '#/network/server/GameServerMessage.ts';

import GameServerPriority from '#/network/server/prot/game/GameServerPriority.ts';

export default class GameMessage extends GameServerMessage {
    priority = GameServerPriority.BUFFERED;

    constructor(
        readonly message: string
    ) {
        super();
    }
}
