import NetworkPlayer from '#/engine/NetworkPlayer.ts';
import type Player from '#/engine/Player.ts';
import Packet from '#/io/Packet.ts';
import Js5OpenRs2Cache from '#/js5/Js5OpenRs2Cache.ts';
import IfOpenTop from '#/network/server/model/game/IfOpenTop.ts';
import RebuildNormal from '#/network/server/model/game/RebuildNormal.ts';

class World {
    cache = Js5OpenRs2Cache.OSRS_1;

    players: Player[] = [];

    async load() {
        await this.cache.predownload();
        await this.cache.loadKeys();

        this.cycle();
    }

    cycle() {
        // todo: account for drift due to event loop/OS scheduling
        setTimeout(this.cycle.bind(this), 600);
    }

    addPlayer(player: Player) {
        if (player instanceof NetworkPlayer && player.client) {
            // todo: run login script, check the login reply from it, forward response to client
            const reply = Packet.alloc(6);
            reply.p1(2);
            reply.p1(0);
            reply.p1(0);
            reply.p2(0);
            reply.p1(0);
            player.client.write(reply);
            player.client.state = 2;

            player.write(new RebuildNormal(3222, 3222));
            player.write(new IfOpenTop(548));
        }

        // this.players.push(player);
    }
}

export default new World();
