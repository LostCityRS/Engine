import GameServerMessage from '#/network/server/GameServerMessage.ts';

import GameServerPriority from '#/network/server/prot/game/GameServerPriority.ts';

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
