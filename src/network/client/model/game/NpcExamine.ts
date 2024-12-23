import ClientMessage from '#/network/client/ClientMessage.ts';

export default class NpcExamine extends ClientMessage {
    idx: number;

    constructor(idx: number) {
        super();

        this.idx = idx;
    }
}
