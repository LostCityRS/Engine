import GameServerMessage from '#/network/server/game/GameServerMessage.ts';

import GameServerPriority from '#/network/server/game/prot/GameServerPriority.ts';

export default class RebuildNormal extends GameServerMessage {
    priority = GameServerPriority.IMMEDIATE;

    constructor(
        readonly absX: number,
        readonly absZ: number
    ) {
        super();
    }
}
