import GameServerMessage from '#/network/server/GameServerMessage.ts';

import GameServerPriority from '#/network/server/prot/game/GameServerPriority.ts';

export default class PlaySound extends GameServerMessage {
    priority = GameServerPriority.BUFFERED;

    constructor(
        readonly id: number,
        readonly immediate: boolean,
        readonly delay: number
    ) {
        super();
    }
}
