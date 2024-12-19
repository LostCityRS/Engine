import ServerRepository from '#/network/server/prot/ServerRepository.ts';

import GameMessage from '#/network/server/model/game/MessageGame.ts';
import GameMessageEncoder from '#/network/os1/server/codec/game/MessageGameEncoder.ts';
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
import PlayerInfo from '#/network/server/model/game/PlayerInfo.ts';
import PlayerInfoEncoder from '#/network/os1/server/codec/game/PlayerInfoEncoder.ts';
import IfOpenSub from '#/network/server/model/game/IfOpenSub.ts';
import IfOpenSubEncoder from '#/network/os1/server/codec/game/IfOpenSubEncoder.ts';
import RunEnergy from '#/network/server/model/game/RunEnergy.ts';
import RunEnergyEncoder from '../codec/game/RunEnergyEncoder.ts';
import ChatSettings from '#/network/server/model/game/ChatSettings.ts';
import ChatSettingsEncoder from '../codec/game/ChatSettingsEncoder.ts';

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
        this.bind(PlayerInfo, new PlayerInfoEncoder());
        this.bind(IfOpenSub, new IfOpenSubEncoder());
        this.bind(RunEnergy, new RunEnergyEncoder());
        this.bind(ChatSettings, new ChatSettingsEncoder());
    }
}
