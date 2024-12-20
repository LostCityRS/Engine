import GameServerMessage from '#/network/server/GameServerMessage.ts';

import GameServerPriority from '#/network/server/prot/game/GameServerPriority.ts';

export default class PrivateChatFilter extends GameServerMessage {
    priority = GameServerPriority.BUFFERED;

    // 0: On
    // 1: Friends
    // 2: Off
    
    // Note: In the client, you have to move mouse over the 
    // stones before they visually update after sending this packet
    constructor(
        readonly value: number
    ) {
        super();
    }
}
