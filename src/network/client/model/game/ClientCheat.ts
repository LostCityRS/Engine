import ClientMessage from '#/network/client/ClientMessage.ts';

export default class ClientCheat extends ClientMessage {
    input: string;

    constructor(input: string) {
        super();

        this.input = input;
    }
}
