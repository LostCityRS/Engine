import GameServerMessage from '#/network/server/GameServerMessage.ts';

import GameServerPriority from '#/network/server/prot/game/GameServerPriority.ts';

export default class MidiSong extends GameServerMessage {
    priority = GameServerPriority.BUFFERED;

    constructor(
        readonly id: number
    ) {
        super();
    }
}
