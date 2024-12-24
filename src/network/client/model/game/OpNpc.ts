import ClientMessage from '#/network/client/ClientMessage.ts';

export default class OpNpc extends ClientMessage {
    op: number;
    idx: number;

    constructor(op: number, idx: number) {
        super();
        this.op = op;
        this.idx = idx;
    }
}
