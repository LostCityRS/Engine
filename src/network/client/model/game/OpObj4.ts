import ClientMessage from '#/network/client/ClientMessage.ts';

export default class OpObj4 extends ClientMessage {
    com: number;
    parent: number;
    id: number;

    constructor(com: number, parent: number, id: number) {
        super();

        this.com = com;
        this.parent = parent;
        this.id = id;
    }
}
