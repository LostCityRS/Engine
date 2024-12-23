import ClientMessage from '#/network/client/ClientMessage.ts';

export default class OpNpc1 extends ClientMessage {
    npcId: number;

    constructor(npcId: number) {
        super();

        this.npcId = npcId;
    }
}
