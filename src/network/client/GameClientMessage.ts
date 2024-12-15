import ClientMessage from '#/network/client/ClientMessage.ts';

import type GameClientLimit from '#/network/client/prot/game/GameClientLimit.ts';

export default abstract class GameClientMessage extends ClientMessage {
    readonly abstract limit: GameClientLimit;
}
