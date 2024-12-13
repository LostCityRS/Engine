// pseudo-packet to use as a placeholder during development, not real!

import GameClientMessage from '#/network/client/game/GameClientMessage.ts';
import GameClientLimit from '#/network/client/game/prot/GameClientLimit.ts';

export default class NoOp extends GameClientMessage {
    limit = GameClientLimit.CLIENT;

    constructor() {
        super();
    }
}
