import ClientMessage from '#/network/client/ClientMessage.ts';

export default class ObjExamine extends ClientMessage {
    id: number;

    constructor(id: number) {
        super();

        this.id = id;
    }
}
