import ClientMessage from '#/network/client/ClientMessage.ts';

export default class XorChange extends ClientMessage {
    key: number;

    constructor(key: number) {
        super();

        this.key = key;
    }
}
