import ServerRepository from '#/network/server/prot/ServerRepository.ts';

import GameMessage from '#/network/server/model/game/GameMessage.ts';
import GameMessageEncoder from '#/network/os1/server/codec/game/GameMessageEncoder.ts';
import IfOpenTop from '#/network/server/model/game/IfOpenTop.ts';
import IfOpenTopEncoder from '#/network/os1/server/codec/game/IfOpenTopEncoder.ts';
import Logout from '#/network/server/model/game/Logout.ts';
import LogoutEncoder from '#/network/os1/server/codec/game/LogoutEncoder.ts';
import MidiJingle from '#/network/server/model/game/MidiJingle.ts';
import MidiJingleEncoder from '#/network/os1/server/codec/game/MidiJingleEncoder.ts';
import MidiSong from '#/network/server/model/game/MidiSong.ts';
import MidiSongEncoder from '#/network/os1/server/codec/game/MidiSongEncoder.ts';
import RebuildNormal from '#/network/server/model/game/RebuildNormal.ts';
import RebuildNormalEncoder from '#/network/os1/server/codec/game/RebuildNormalEncoder.ts';
import PrivateMessage from '#/network/server/model/game/PrivateMessage.ts';
import PrivateMessageEncoder from '#/network/os1/server/codec/game/PrivateMessageEncoder.ts';

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
