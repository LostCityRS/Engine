import ClientMessage from '#/network/client/ClientMessage.ts';

export default class OpLoc4 extends ClientMessage {
    locId: number;
    x: number;
    z: number;

    constructor(locId: number, x: number, z: number) {
        super();

        this.locId = locId;
        this.x = x;
        this.z = z;
    }
}
