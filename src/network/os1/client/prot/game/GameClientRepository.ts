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
import OpNpc1Decoder from "#/network/os1/client/codec/game/OpNpc1Decoder.js";
import OpNpc1Handler from "#/network/os1/client/handler/game/OpNpc1Handler.js";
import OpNpc2Decoder from "#/network/os1/client/codec/game/OpNpc2Decoder.js";
import OpNpc2Handler from "#/network/os1/client/handler/game/OpNpc2Handler.js";
import OpNpc3Decoder from "#/network/os1/client/codec/game/OpNpc3Decoder.js";
import OpNpc3Handler from "#/network/os1/client/handler/game/OpNpc3Handler.js";
import OpNpc4Decoder from "#/network/os1/client/codec/game/OpNpc4Decoder.js";
import OpNpc4Handler from "#/network/os1/client/handler/game/OpNpc4Handler.js";
import OpNpc5Decoder from "#/network/os1/client/codec/game/OpNpc5Decoder.js";
import OpNpc5Handler from "#/network/os1/client/handler/game/OpNpc5Handler.js";
import OpLoc1Decoder from "#/network/os1/client/codec/game/OpLoc1Decoder.js";
import OpLoc1Handler from "#/network/os1/client/handler/game/OpLoc1Handler.js";
import OpLoc2Decoder from "#/network/os1/client/codec/game/OpLoc2Decoder.js";
import OpLoc2Handler from "#/network/os1/client/handler/game/OpLoc2Handler.js";
import OpLoc3Decoder from "#/network/os1/client/codec/game/OpLoc3Decoder.js";
import OpLoc3Handler from "#/network/os1/client/handler/game/OpLoc3Handler.js";
import OpLoc4Decoder from "#/network/os1/client/codec/game/OpLoc4Decoder.js";
import OpLoc4Handler from "#/network/os1/client/handler/game/OpLoc4Handler.js";
import OpLoc5Decoder from "#/network/os1/client/codec/game/OpLoc5Decoder.js";
import OpLoc5Handler from "#/network/os1/client/handler/game/OpLoc5Handler.js";

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
        this.bind(new OpNpc1Decoder(), new OpNpc1Handler())
        this.bind(new OpNpc2Decoder(), new OpNpc2Handler())
        this.bind(new OpNpc3Decoder(), new OpNpc3Handler())
        this.bind(new OpNpc4Decoder(), new OpNpc4Handler())
        this.bind(new OpNpc5Decoder(), new OpNpc5Handler())
        this.bind(new OpLoc1Decoder(), new OpLoc1Handler())
        this.bind(new OpLoc2Decoder(), new OpLoc2Handler())
        this.bind(new OpLoc3Decoder(), new OpLoc3Handler())
        this.bind(new OpLoc4Decoder(), new OpLoc4Handler())
        this.bind(new OpLoc5Decoder(), new OpLoc5Handler())
    }
}
