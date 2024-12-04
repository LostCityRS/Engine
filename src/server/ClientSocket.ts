import type Player from '#/engine/Player.ts';
import type Packet from '#/io/Packet.ts';

export default abstract class ClientSocket {
    state: number = 0;
    player: Player | null = null;

    abstract write(src: Uint8Array | Packet): void;

    abstract close(): void;
    abstract terminate(): void;
}
