import GameServerMessage from '#/network/server/game/GameServerMessage.ts';

import GameServerPriority from '#/network/server/game/prot/GameServerPriority.ts';

export default class PrivateMessage extends GameServerMessage {
    priority = GameServerPriority.BUFFERED;

    constructor(
        readonly message: string,
        readonly u1: number,
        readonly u2: number,
        readonly u3: number
    ) {
        super();
    }
}
