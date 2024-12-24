import ClientMessage from '#/network/client/ClientMessage.ts';

export default class OpObj extends ClientMessage {
    op: number;
    com: number;
    parent: number;
    id: number;

    constructor(op: number, com: number, parent: number, id: number) {
        super();
        this.op = op;
        this.com = com;
        this.parent = parent;
        this.id = id;
    }
}
