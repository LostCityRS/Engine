import ClientMessage from '#/network/client/ClientMessage.ts';

export default class IfButton extends ClientMessage {
    com: number;

    constructor(com: number) {
        super();

        this.com = com;
    }
}
