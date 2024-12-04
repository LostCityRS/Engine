import GameServerMessage from '#/network/server/game/GameServerMessage.ts';

import GameServerPriority from '#/network/server/game/prot/GameServerPriority.ts';

export default class IfOpenTop extends GameServerMessage {
    priority = GameServerPriority.BUFFERED;

    constructor(
        readonly interfaceId: number
    ) {
        super();
    }
}
