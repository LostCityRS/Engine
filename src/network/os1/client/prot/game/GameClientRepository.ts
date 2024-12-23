import ClientRepository from '#/network/client/prot/ClientRepository.ts';
import ClientCheatDecoder from '#/network/os1/client/codec/game/ClientCheatDecoder.ts';

import MoveClickDecoder from '#/network/os1/client/codec/game/MoveClickDecoder.ts';
import NoOpDecoder from '#/network/os1/client/codec/game/NoOpDecoder.ts';
import ClientCheatHandler from '#/network/os1/client/handler/game/ClientCheatHandler.ts';
import MoveClickHandler from '#/network/os1/client/handler/game/MoveClickHandler.ts';
import NoOpHandler from '#/network/os1/client/handler/game/NoOpHandler.ts';
import ClanDecoder from '../../codec/game/ClanDecoder.ts';
import IfButtonDecoder from '../../codec/game/IfButtonDecoder.ts';
import ClanHandler from '../../handler/game/ClanHandler.ts';
import IfButtonHandler from '../../handler/game/IfButtonHandler.ts';
import OpPlayer1Decoder from "#/network/os1/client/codec/game/OpPlayer1Decoder.js";
import OpPlayer1Handler from "#/network/os1/client/handler/game/OpPlayer1Handler.js";
import OpPlayer2Decoder from "#/network/os1/client/codec/game/OpPlayer2Decoder.js";
import OpPlayer2Handler from "#/network/os1/client/handler/game/OpPlayer2Handler.js";
import OpPlayer3Decoder from "#/network/os1/client/codec/game/OpPlayer3Decoder.js";
import OpPlayer3Handler from "#/network/os1/client/handler/game/OpPlayer3Handler.js";
import OpPlayer4Decoder from "#/network/os1/client/codec/game/OpPlayer4Decoder.js";
import OpPlayer4Handler from "#/network/os1/client/handler/game/OpPlayer4Handler.js";
import OpPlayer5Decoder from "#/network/os1/client/codec/game/OpPlayer5Decoder.js";
import OpPlayer6Decoder from "#/network/os1/client/codec/game/OpPlayer6Decoder.js";
import OpPlayer5Handler from "#/network/os1/client/handler/game/OpPlayer5Handler.js";
import OpPlayer6Handler from "#/network/os1/client/handler/game/OpPlayer6Handler.js";
import OpPlayer7Decoder from "#/network/os1/client/codec/game/OpPlayer7Decoder.js";
import OpPlayer7Handler from "#/network/os1/client/handler/game/OpPlayer7Handler.js";
import OpPlayer8Decoder from "#/network/os1/client/codec/game/OpPlayer8Decoder.js";
import OpPlayer8Handler from "#/network/os1/client/handler/game/OpPlayer8Handler.js";

export default class GameClientRepository extends ClientRepository {
    constructor() {
        super();

        this.bind(new MoveClickDecoder(176), new MoveClickHandler()); // MOVE_GAMECLICK
        this.bind(new MoveClickDecoder(60), new MoveClickHandler()); // MOVE_MINIMAPCLICK
        this.bind(new MoveClickDecoder(214), new MoveClickHandler()); // MOVE_OPCLICK

        this.bind(new NoOpDecoder(72, -1), new NoOpHandler());
        this.bind(new NoOpDecoder(228, 0), new NoOpHandler());
        this.bind(new NoOpDecoder(210, 4), new NoOpHandler());
        this.bind(new NoOpDecoder(161, 4), new NoOpHandler());
        this.bind(new NoOpDecoder(79, 4), new NoOpHandler());
        this.bind(new NoOpDecoder(178, 1), new NoOpHandler());
        this.bind(new NoOpDecoder(197, 0), new NoOpHandler());

        this.bind(new ClientCheatDecoder(), new ClientCheatHandler())
        this.bind(new IfButtonDecoder(), new IfButtonHandler())
        this.bind(new ClanDecoder(), new ClanHandler())
        this.bind(new OpPlayer1Decoder(), new OpPlayer1Handler())
        this.bind(new OpPlayer2Decoder(), new OpPlayer2Handler())
        this.bind(new OpPlayer3Decoder(), new OpPlayer3Handler())
        this.bind(new OpPlayer4Decoder(), new OpPlayer4Handler())
        this.bind(new OpPlayer5Decoder(), new OpPlayer5Handler())
        this.bind(new OpPlayer6Decoder(), new OpPlayer6Handler())
        this.bind(new OpPlayer7Decoder(), new OpPlayer7Handler())
        this.bind(new OpPlayer8Decoder(), new OpPlayer8Handler())
    }
}
