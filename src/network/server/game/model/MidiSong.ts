import GameServerMessage from '#/network/server/game/GameServerMessage.ts';

import GameServerPriority from '#/network/server/game/prot/GameServerPriority.ts';

export default class PlaySong extends GameServerMessage {
    priority = GameServerPriority.BUFFERED;

    constructor(
        readonly id: number
    ) {
        super();
    }
}
