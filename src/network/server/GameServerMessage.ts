import OutgoingMessage from '#/network/server/ServerMessage.ts';

import type GameServerPriority from '#/network/server/prot/game/GameServerPriority.ts';

export default abstract class GameServerMessage extends OutgoingMessage {
    readonly abstract priority: GameServerPriority;
}
