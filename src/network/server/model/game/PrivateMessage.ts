import GameServerMessage from '#/network/server/GameServerMessage.ts';

import GameServerPriority from '#/network/server/prot/game/GameServerPriority.ts';

export default class PrivateMessage extends GameServerMessage {
    priority = GameServerPriority.BUFFERED;

    constructor(
        readonly senderName: string,
        readonly message: string,
        readonly senderId: number, //verify
        readonly messageId: number, //verify
        readonly senderRights: number,
    ) {
        super();
    }
}
