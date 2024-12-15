import ClientMessage from '#/network/client/ClientMessage.ts';

export default class MoveClick extends ClientMessage {
    // todo: make a routefind type?
    route: { x: number, z: number }[];
    ctrlHeld: boolean;

    constructor(route: { x: number, z: number }[], ctrlHeld: boolean) {
        super();

        this.route = route;
        this.ctrlHeld = ctrlHeld;
    }
}
