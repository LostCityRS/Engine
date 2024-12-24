import ClientMessage from '#/network/client/ClientMessage.ts';

export default class OpLoc extends ClientMessage {
    op: number;
    locId: number;
    x: number;
    z: number;

    constructor(op: number, locId: number, x: number, z: number) {
        super();
        this.op = op;
        this.locId = locId;
        this.x = x;
        this.z = z;
    }
}
