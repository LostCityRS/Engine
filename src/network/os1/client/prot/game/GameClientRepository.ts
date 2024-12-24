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
import OpPlayerDecoder from "#/network/os1/client/codec/game/OpPlayerDecoder.js";
import OpPlayerHandler from "#/network/os1/client/handler/game/OpPlayerHandler.js";
import OpPlayer2Decoder from "#/network/os1/client/codec/game/OpPlayer2Decoder.js";
import OpPlayer3Decoder from "#/network/os1/client/codec/game/OpPlayer3Decoder.js";
import OpPlayer4Decoder from "#/network/os1/client/codec/game/OpPlayer4Decoder.js";
import OpPlayer5Decoder from "#/network/os1/client/codec/game/OpPlayer5Decoder.js";
import OpPlayer6Decoder from "#/network/os1/client/codec/game/OpPlayer6Decoder.js";
import OpPlayer7Decoder from "#/network/os1/client/codec/game/OpPlayer7Decoder.js";
import OpPlayer8Decoder from "#/network/os1/client/codec/game/OpPlayer8Decoder.js";
import OpNpcDecoder from "#/network/os1/client/codec/game/OpNpcDecoder.js";
import OpNpcHandler from "#/network/os1/client/handler/game/OpNpcHandler.js";
import OpLocDecoder from "#/network/os1/client/codec/game/OpLocDecoder.js";
import OpLocHandler from "#/network/os1/client/handler/game/OpLocHandler.js";
import OpObjDecoder from "#/network/os1/client/codec/game/OpObjDecoder.js";
import OpObjHandler from "#/network/os1/client/handler/game/OpObjHandler.js";
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
        this.bind(new OpPlayerDecoder(1, 246), new OpPlayerHandler())
        this.bind(new OpPlayerDecoder(2, 146), new OpPlayerHandler())
        this.bind(new OpPlayerDecoder(3, 102), new OpPlayerHandler())
        this.bind(new OpPlayerDecoder(4, 78), new OpPlayerHandler())
        this.bind(new OpPlayerDecoder(5, 117), new OpPlayerHandler())
        this.bind(new OpPlayerDecoder(6, 111), new OpPlayerHandler())
        this.bind(new OpPlayerDecoder(7, 119), new OpPlayerHandler())
        this.bind(new OpPlayerDecoder(8, 145), new OpPlayerHandler())
        this.bind(new OpNpcDecoder(1, 84), new OpNpcHandler())
        this.bind(new OpNpcDecoder(2, 13), new OpNpcHandler())
        this.bind(new OpNpcDecoder(3, 67), new OpNpcHandler())
        this.bind(new OpNpcDecoder(4, 95), new OpNpcHandler())
        this.bind(new OpNpcDecoder(5, 88), new OpNpcHandler())
        this.bind(new OpLocDecoder(1, 73), new OpLocHandler())
        this.bind(new OpLocDecoder(2, 90), new OpLocHandler())
        this.bind(new OpLocDecoder(3, 133), new OpLocHandler())
        this.bind(new OpLocDecoder(4, 83), new OpLocHandler())
        this.bind(new OpLocDecoder(5, 56), new OpLocHandler())
        this.bind(new OpObjDecoder(1, 135), new OpObjHandler())
        this.bind(new OpObjDecoder(2, 179), new OpObjHandler())
        this.bind(new OpObjDecoder(3, 76), new OpObjHandler())
        this.bind(new OpObjDecoder(4, 220), new OpObjHandler())
        this.bind(new OpObjDecoder(5, 19), new OpObjHandler())
        this.bind(new LocExamineDecoder(), new LocExamineHandler())
        this.bind(new NpcExamineDecoder(), new NpcExamineHandler())
        this.bind(new TileObjExamineDecoder(), new ObjExamineHandler())
    }
}
