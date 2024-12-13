import ClientRepository from '#/network/client/prot/ClientRepository.ts';

import MoveClickDecoder from '#/network/os1/client/game/codec/MoveClickDecoder.ts';
import MoveClickHandler from '#/network/os1/client/game/handler/MoveClickHandler.ts';

export default class GameClientRepository extends ClientRepository {
    constructor() {
        super();

        this.bind(new MoveClickDecoder(176), new MoveClickHandler()); // MOVE_GAMECLICK
        this.bind(new MoveClickDecoder(60), new MoveClickHandler()); // MOVE_MINIMAPCLICK
        this.bind(new MoveClickDecoder(214), new MoveClickHandler()); // MOVE_OPCLICK
    }
}
