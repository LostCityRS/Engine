import ServerMessage from '#/network/server/ServerMessage.ts';

export default class Js5GroupResponse extends ServerMessage {
    archive: number;
    group: number;
    prefetch: boolean;
    data: Uint8Array;
    xor: number;

    constructor(archive: number, group: number, prefetch: boolean, data: Uint8Array, xor: number) {
        super();

        this.archive = archive;
        this.group = group;
        this.prefetch = prefetch;
        this.data = data;
        this.xor = xor;
    }
}
