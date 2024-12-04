import ServerRepository from '#/network/server/prot/ServerRepository.ts';

import IfOpenTopEncoder from '#/network/os1/server/game/codec/IfOpenTopEncoder.ts';
import IfOpenTop from '#/network/server/game/model/IfOpenTop.ts';
import RebuildNormalEncoder from '#/network/os1/server/game/codec/RebuildNormalEncoder.ts';
import RebuildNormal from '#/network/server/game/model/RebuildNormal.ts';

export default class GameServerRepository extends ServerRepository {
    constructor() {
        super();

        this.bind(IfOpenTop, new IfOpenTopEncoder());
        this.bind(RebuildNormal, new RebuildNormalEncoder());
    }
}
