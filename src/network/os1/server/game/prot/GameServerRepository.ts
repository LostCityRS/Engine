import ServerRepository from '#/network/server/prot/ServerRepository.ts';

import IfOpenTopEncoder from '#/network/os1/server/game/codec/IfOpenTopEncoder.ts';
import IfOpenTop from '#/network/server/game/model/IfOpenTop.ts';
import Logout from '#/network/server/game/model/Logout.ts';
import LogoutEncoder from '../codec/LogoutEncoder.ts';
import PlaySong from '#/network/server/game/model/PlaySong.ts';
import PlaySongEncoder from '../codec/PlaySongEncoder.ts';
import RebuildNormalEncoder from '#/network/os1/server/game/codec/RebuildNormalEncoder.ts';
import RebuildNormal from '#/network/server/game/model/RebuildNormal.ts';

export default class GameServerRepository extends ServerRepository {
    constructor() {
        super();

        this.bind(IfOpenTop, new IfOpenTopEncoder());
        this.bind(Logout, new LogoutEncoder());
        this.bind(PlaySong, new PlaySongEncoder());
        this.bind(RebuildNormal, new RebuildNormalEncoder());
    }
}
