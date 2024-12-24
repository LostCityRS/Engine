import ClientMessage from '#/network/client/ClientMessage.ts';

export default class OpLoc6 extends ClientMessage {
    id: number;

    constructor(id: number) {
        super();

        this.id = id;
    }
}
