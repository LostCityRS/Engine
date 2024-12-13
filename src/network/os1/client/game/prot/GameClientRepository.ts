import ClientRepository from '#/network/client/prot/ClientRepository.ts';

import MoveClick from '#/network/client/game/model/MoveClick.ts';
import MoveClickDecoder from '#/network/os1/client/game/codec/MoveClickDecoder.ts';
import MoveClickHandler from '#/network/os1/client/game/handler/MoveClickHandler.ts';

export default class GameClientRepository extends ClientRepository {
    constructor() {
        super();

        this.bind(MoveClick, new MoveClickDecoder(), new MoveClickHandler());
    }
}
