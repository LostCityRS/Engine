import GameServerMessage from '#/network/server/GameServerMessage.ts';

import GameServerPriority from '#/network/server/prot/game/GameServerPriority.ts';

export default class IfOpenSub extends GameServerMessage {
    priority = GameServerPriority.IMMEDIATE;

    constructor(
        readonly interfaceId: number,
        readonly subInterfaceId: number,
        readonly type: number
    ) {
        super();
    }
}
