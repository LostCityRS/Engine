import Packet from '#/io/Packet.ts';

type GameWorld = {
    id: number;
    members: boolean;
    host: string;
    country: number;
    players: number;
}

class ServerList {
    buf = Packet.alloc(5000);
    worlds: GameWorld[] = [];

    constructor() {
        this.register(1, true, '127.0.0.1', 0);
    }

    update(id: number, players: number, rebuild = true) {
        for (let i = 0; i < this.worlds.length; i++) {
            if (this.worlds[i].id === id) {
                this.worlds[i].players = players;

                if (rebuild) {
                    this.#rebuild();
                }

                break;
            }
        }
    }

    register(id: number, members: boolean, host: string, country: number, rebuild = true) {
        this.worlds.push({
            id,
            members,
            host,
            country,
            players: -1
        });

        if (rebuild) {
            this.#rebuild();
        }
    }

    #rebuild() {
        this.buf.pos = 0;
        this.buf.p4(0);
        const start = this.buf.pos;

        this.buf.p2(this.worlds.length);
        for (const world of this.worlds) {
            this.buf.p2((world.id & 0x7FFF) | (world.members ? 0x8000 : 0));
            this.buf.pjstr(world.host);
            this.buf.p1(world.country);
            this.buf.p2(world.players);
        }

        this.buf.psize4(this.buf.pos - start);
    }

    get response() {
        return this.buf.data.subarray(0, this.buf.pos);
    }
}

export default new ServerList();
