// pseudo-packet to use as a placeholder during development, not real!

import GameClientMessage from '#/network/client/GameClientMessage.ts';
import GameClientLimit from '#/network/client/prot/game/GameClientLimit.ts';

export default class NoOp extends GameClientMessage {
    limit = GameClientLimit.CLIENT;

    constructor() {
        super();
    }
}
