import NetworkPlayer from '#/engine/NetworkPlayer.ts';
import type Player from '#/engine/Player.ts';
import Packet from '#/io/Packet.ts';
import Js5OpenRs2Cache from '#/js5/Js5OpenRs2Cache.ts';
import MessageGame from '#/network/server/model/game/MessageGame.ts';
import IfOpenSub from '#/network/server/model/game/IfOpenSub.ts';
import IfOpenTop from '#/network/server/model/game/IfOpenTop.ts';
import PlayerInfo from '#/network/server/model/game/PlayerInfo.ts';
import RebuildNormal from '#/network/server/model/game/RebuildNormal.ts';

class World {
    cache = Js5OpenRs2Cache.OSRS_1;

    players: Player[] = [];
    currentTick: number = 100; // start with a minute of uptime in case scripts skip testing 0-checks

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

        // process players
        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];

            // todo
        }

        // write client output
        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];
            if (!(player instanceof NetworkPlayer)) {
                continue;
            }

            player.write(new PlayerInfo());

            if (player.buffer.length > 0) {
                for (const message of player.buffer) {
                    player.write(message, true);
                }

                player.buffer.length = 0;
            }
        }

        this.currentTick++;

        // todo: account for drift due to event loop/OS scheduling
        setTimeout(this.cycle.bind(this), 600);
    }

    addPlayer(player: Player, reconnect = false) {
        this.players.push(player);

        if (player instanceof NetworkPlayer) {
            // todo: run login script, check the login reply from it, forward response to client
            const reply = Packet.alloc(6);
            if (reconnect) {
                reply.p1(15);
                player.client.write(reply);
                player.client.state = 1;
                return;
            }

            reply.p1(2);
            reply.p1(0);
            reply.p1(0);
            reply.p2(0);
            reply.p1(0);
            player.client.write(reply);
            player.client.state = 1;

            player.write(new RebuildNormal(3222, 3222));

            // runescript: mes("Welcome to RuneScape.");
            player.write(new MessageGame("Welcome to RuneScape."));

            // runescript: if_opentop(toplevel);
            player.write(new IfOpenTop(548));

            // runescript: if_openoverlay(toplevel:x, y);
            player.write(new IfOpenSub((548 << 16) | 90, 137, 0)); // toplevel:chat -> chat
            player.write(new IfOpenSub((548 << 16) | 99, 92, 0)); // toplevel:stone0 -> combat-unarmed
            player.write(new IfOpenSub((548 << 16) | 100, 320, 0)); // toplevel:stone1 -> stats
            player.write(new IfOpenSub((548 << 16) | 101, 274, 0)); // toplevel:stone2 -> questjournal_v2
            player.write(new IfOpenSub((548 << 16) | 102, 149, 0)); // toplevel:stone3 -> inventory
            player.write(new IfOpenSub((548 << 16) | 103, 387, 0)); // toplevel:stone4 -> wornitems
            player.write(new IfOpenSub((548 << 16) | 104, 271, 0)); // toplevel:stone5 -> prayer
            player.write(new IfOpenSub((548 << 16) | 105, 192, 0)); // toplevel:stone6 -> magic
            // player.write(new IfOpenSub((548 << 16) | 106, 0, 0)); // toplevel:stone7 -> todo
            player.write(new IfOpenSub((548 << 16) | 107, 550, 0)); // toplevel:stone8 -> friends2
            player.write(new IfOpenSub((548 << 16) | 108, 551, 0)); // toplevel:stone9 -> ignore2
            player.write(new IfOpenSub((548 << 16) | 109, 182, 0)); // toplevel:stone10 -> logout
            player.write(new IfOpenSub((548 << 16) | 110, 261, 0)); // toplevel:stone11 -> options
            player.write(new IfOpenSub((548 << 16) | 111, 464, 0)); // toplevel:stone12 -> emotes
            // player.write(new IfOpenSub((548 << 16) | 112, 0, 0)); // toplevel:stone13 -> todo
        }
    }
}

export default new World();
