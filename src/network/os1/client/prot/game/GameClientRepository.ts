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
import OpPlayerHandler from "#/network/os1/client/handler/game/OpPlayerHandler.js";
import OpPlayer2Decoder from "#/network/os1/client/codec/game/OpPlayer2Decoder.js";
import OpPlayer3Decoder from "#/network/os1/client/codec/game/OpPlayer3Decoder.js";
import OpPlayer4Decoder from "#/network/os1/client/codec/game/OpPlayer4Decoder.js";
import OpPlayer5Decoder from "#/network/os1/client/codec/game/OpPlayer5Decoder.js";
import OpPlayer6Decoder from "#/network/os1/client/codec/game/OpPlayer6Decoder.js";
import OpPlayer7Decoder from "#/network/os1/client/codec/game/OpPlayer7Decoder.js";
import OpPlayer8Decoder from "#/network/os1/client/codec/game/OpPlayer8Decoder.js";
import OpNpc1Decoder from "#/network/os1/client/codec/game/OpNpc1Decoder.js";
import OpNpcHandler from "#/network/os1/client/handler/game/OpNpcHandler.js";
import OpNpc2Decoder from "#/network/os1/client/codec/game/OpNpc2Decoder.js";
import OpNpc3Decoder from "#/network/os1/client/codec/game/OpNpc3Decoder.js";
import OpNpc4Decoder from "#/network/os1/client/codec/game/OpNpc4Decoder.js";
import OpNpc5Decoder from "#/network/os1/client/codec/game/OpNpc5Decoder.js";
import OpLocDecoder from "#/network/os1/client/codec/game/OpLocDecoder.js";
import OpLocHandler from "#/network/os1/client/handler/game/OpLocHandler.js";
import OpLoc2Decoder from "#/network/os1/client/codec/game/OpLoc2Decoder.js";
import OpLoc3Decoder from "#/network/os1/client/codec/game/OpLoc3Decoder.js";
import OpLoc4Decoder from "#/network/os1/client/codec/game/OpLoc4Decoder.js";
import OpLoc5Decoder from "#/network/os1/client/codec/game/OpLoc5Decoder.js";
import OpObj1Decoder from "#/network/os1/client/codec/game/OpObj1Decoder.js";
import OpObjHandler from "#/network/os1/client/handler/game/OpObjHandler.js";
import OpObj2Decoder from "#/network/os1/client/codec/game/OpObj2Decoder.js";
import OpObj3Decoder from "#/network/os1/client/codec/game/OpObj3Decoder.js";
import OpObj4Decoder from "#/network/os1/client/codec/game/OpObj4Decoder.js";
import OpObj5Decoder from "#/network/os1/client/codec/game/OpObj5Decoder.js";
import LocExamineDecoder from "#/network/os1/client/codec/game/LocExamineDecoder.js";
import LocExamineHandler from "#/network/os1/client/handler/game/LocExamineHandler.js";
import NpcExamineDecoder from "#/network/os1/client/codec/game/NpcExamineDecoder.js";
import NpcExamineHandler from "#/network/os1/client/handler/game/NpcExamineHandler.js";
import TileObjExamineDecoder from "#/network/os1/client/codec/game/ObjExamineDecoder.js";
import ObjExamineHandler from "#/network/os1/client/handler/game/ObjExamineHandler.js";

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
        this.bind(new OpPlayer1Decoder(), new OpPlayerHandler())
        this.bind(new OpPlayer2Decoder(), new OpPlayerHandler())
        this.bind(new OpPlayer3Decoder(), new OpPlayerHandler())
        this.bind(new OpPlayer4Decoder(), new OpPlayerHandler())
        this.bind(new OpPlayer5Decoder(), new OpPlayerHandler())
        this.bind(new OpPlayer6Decoder(), new OpPlayerHandler())
        this.bind(new OpPlayer7Decoder(), new OpPlayerHandler())
        this.bind(new OpPlayer8Decoder(), new OpPlayerHandler())
        this.bind(new OpNpc1Decoder(), new OpNpcHandler())
        this.bind(new OpNpc2Decoder(), new OpNpcHandler())
        this.bind(new OpNpc3Decoder(), new OpNpcHandler())
        this.bind(new OpNpc4Decoder(), new OpNpcHandler())
        this.bind(new OpNpc5Decoder(), new OpNpcHandler())
        this.bind(new OpLocDecoder(), new OpLocHandler())
        this.bind(new OpLoc2Decoder(), new OpLocHandler())
        this.bind(new OpLoc3Decoder(), new OpLocHandler())
        this.bind(new OpLoc4Decoder(), new OpLocHandler())
        this.bind(new OpLoc5Decoder(), new OpLocHandler())
        this.bind(new OpObj1Decoder(), new OpObjHandler())
        this.bind(new OpObj2Decoder(), new OpObjHandler())
        this.bind(new OpObj3Decoder(), new OpObjHandler())
        this.bind(new OpObj4Decoder(), new OpObjHandler())
        this.bind(new OpObj5Decoder(), new OpObjHandler())
        this.bind(new LocExamineDecoder(), new LocExamineHandler())
        this.bind(new NpcExamineDecoder(), new NpcExamineHandler())
        this.bind(new TileObjExamineDecoder(), new ObjExamineHandler())
    }
}
