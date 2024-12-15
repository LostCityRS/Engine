import type GameClientLimit from '#/network/client/codec/game/GameClientLimit.ts';
import MessageDecoder from '#/network/client/codec/MessageDecoder.ts';

export default abstract class GameMessageDecoder extends MessageDecoder {
    abstract limit: GameClientLimit;
}
