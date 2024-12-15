import GameClientMessage from '#/network/client/GameClientMessage.ts';
import GameClientLimit from '#/network/client/prot/game/GameClientLimit.ts';

export default class MoveClick extends GameClientMessage {
    limit = GameClientLimit.USER;

    // todo: make a routefind type?
    route: { x: number, z: number }[];
    ctrlHeld: boolean;

    constructor(route: { x: number, z: number }[], ctrlHeld: boolean) {
        super();

        this.route = route;
        this.ctrlHeld = ctrlHeld;
    }
}
