import GameServerMessage from '#/network/server/GameServerMessage.ts';

import GameServerPriority from '#/network/server/prot/game/GameServerPriority.ts';

export default class RunWeight extends GameServerMessage {
    priority = GameServerPriority.BUFFERED;

    constructor(
        readonly value: number
    ) {
        super();
    }
}
