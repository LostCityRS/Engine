import ClientMessage from '#/network/client/ClientMessage.ts';

export default class OpPlayer1 extends ClientMessage {
    playerId: number;

    constructor(playerId: number) {
        super();

        this.playerId = playerId;
    }
}
