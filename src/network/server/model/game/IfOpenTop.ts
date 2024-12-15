import GameServerMessage from '#/network/server/GameServerMessage.ts';

import GameServerPriority from '#/network/server/prot/game/GameServerPriority.ts';

export default class IfOpenTop extends GameServerMessage {
    priority = GameServerPriority.BUFFERED;

    constructor(
        readonly interfaceId: number
    ) {
        super();
    }
}
