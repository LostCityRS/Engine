import GameServerMessage from '#/network/server/GameServerMessage.ts';

import GameServerPriority from '#/network/server/prot/game/GameServerPriority.ts';

export default class RebuildNormal extends GameServerMessage {
    priority = GameServerPriority.IMMEDIATE;

    constructor(
        readonly absX: number,
        readonly absZ: number
    ) {
        super();
    }
}
