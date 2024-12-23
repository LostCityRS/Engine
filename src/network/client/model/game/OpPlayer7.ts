import ClientMessage from '#/network/client/ClientMessage.ts';

export default class OpPlayer7 extends ClientMessage {
    playerId: number;

    constructor(playerId: number) {
        super();

        this.playerId = playerId;
    }
}
