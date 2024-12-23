import ClientMessage from '#/network/client/ClientMessage.ts';

export default class LocExamine extends ClientMessage {
    id: number;

    constructor(id: number) {
        super();

        this.id = id;
    }
}
