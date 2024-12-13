import type NetworkPlayer from '#/engine/NetworkPlayer.ts';
import type Packet from '#/io/Packet.ts';

export default abstract class ClientSocket {
    state: number = 0;
    player: NetworkPlayer | null = null;

    abstract write(src: Uint8Array | Packet): void;

    abstract close(): void;
    abstract terminate(): void;
}
