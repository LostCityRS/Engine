import GameServerMessage from '#/network/server/GameServerMessage.ts';

import GameServerPriority from '#/network/server/prot/game/GameServerPriority.ts';

export default class UpdateSkill extends GameServerMessage {
    priority = GameServerPriority.BUFFERED;

    constructor(
        readonly id: number,
        readonly level: number,
        readonly experience: number
    ) {
        super();
    }
}
