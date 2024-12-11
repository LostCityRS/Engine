import ServerRepository from '#/network/server/prot/ServerRepository.ts';

import GameMessage from '#/network/server/game/model/GameMessage.ts';
import GameMessageEncoder from '../codec/GameMessageEncoder.ts';
import IfOpenTopEncoder from '#/network/os1/server/game/codec/IfOpenTopEncoder.ts';
import IfOpenTop from '#/network/server/game/model/IfOpenTop.ts';
import Logout from '#/network/server/game/model/Logout.ts';
import LogoutEncoder from '../codec/LogoutEncoder.ts';
import MidiJingle from '#/network/server/game/model/MidiJingle.ts';
import MidiJingleEncoder from '../codec/MidiJingleEncoder.ts';
import MidiSong from '#/network/server/game/model/MidiSong.ts';
import MidiSongEncoder from '../codec/MidiSongEncoder.ts';
import RebuildNormalEncoder from '#/network/os1/server/game/codec/RebuildNormalEncoder.ts';
import RebuildNormal from '#/network/server/game/model/RebuildNormal.ts';
import PrivateMessage from '#/network/server/game/model/PrivateMessage.ts';
import PrivateMessageEncoder from '../codec/PrivateMessageEncoder.ts';

export default class GameServerRepository extends ServerRepository {
    constructor() {
        super();

        this.bind(GameMessage, new GameMessageEncoder());
        this.bind(IfOpenTop, new IfOpenTopEncoder());
        this.bind(Logout, new LogoutEncoder());
        this.bind(MidiJingle, new MidiJingleEncoder());
        this.bind(MidiSong, new MidiSongEncoder());
        this.bind(PrivateMessage, new PrivateMessageEncoder());
        this.bind(RebuildNormal, new RebuildNormalEncoder());
    }
}
