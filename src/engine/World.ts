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
        // read client input
        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];
            if (!(player instanceof NetworkPlayer)) {
                continue;
            }

            if (player.client.state === -1) {
                this.players.splice(i--, 1);
                continue;
            }

            // the client has code like `for (int i = 0; i < 5 && read(); i++)` which mirrors this logic

            player.client.userLimit = 0;
            player.client.clientLimit = 0;

            while (player.client.userLimit < 5 && player.client.clientLimit < 50 && player.read()) {
                // empty
            }
        }

        // todo: account for drift due to event loop/OS scheduling
        setTimeout(this.cycle.bind(this), 600);
    }

    addPlayer(player: Player) {
        if (player instanceof NetworkPlayer) {
            // todo: run login script, check the login reply from it, forward response to client
            const reply = Packet.alloc(6);
            reply.p1(2);
            reply.p1(0);
            reply.p1(0);
            reply.p2(0);
            reply.p1(0);
            player.client.write(reply);
            player.client.state = 1;

            player.write(new RebuildNormal(3222, 3222));
            player.write(new IfOpenTop(548));
        }

        this.players.push(player);
    }
}

export default new World();
