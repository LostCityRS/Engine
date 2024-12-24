import ClientMessage from '#/network/client/ClientMessage.ts';

export default class OpNpc6 extends ClientMessage {
    idx: number;

    constructor(idx: number) {
        super();

        this.idx = idx;
    }
}
