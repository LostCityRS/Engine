import GameServerMessage from '#/network/server/GameServerMessage.ts';

import GameServerPriority from '#/network/server/prot/game/GameServerPriority.ts';

export default class PlayerInfo extends GameServerMessage {
    priority = GameServerPriority.IMMEDIATE;
}
