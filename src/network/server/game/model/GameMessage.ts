import GameServerMessage from '#/network/server/game/GameServerMessage.ts';

import GameServerPriority from '#/network/server/game/prot/GameServerPriority.ts';

export default class GameMessage extends GameServerMessage {
    priority = GameServerPriority.BUFFERED;

    constructor(
        readonly message: string
    ) {
        super();
    }
}
