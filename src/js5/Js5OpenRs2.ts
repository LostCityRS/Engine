import Js5Index from '#/js5/Js5Index.ts';
import OpenRs2 from '#/util/OpenRs2.ts';

export default class Js5OpenRs2 extends Js5Index {
    openrs2: OpenRs2;
    archive: number;

    constructor(openrs2: OpenRs2, archive: number, discardPacked: boolean, discardUnpacked: boolean) {
        super(discardPacked, discardUnpacked);

        this.openrs2 = openrs2;
        this.archive = archive;
    }

    async load() {
        const index = await this.openrs2.getGroup(255, this.archive);
        if (!index) {
            return;
        }

        this.decode(index);

        // todo: optionally defer loading, because large caches may not have enough available RAM
        for (let i = 0; i < this.size; i++) {
            this.packed[this.groupIds[i]] = await this.openrs2.getGroup(this.archive, this.groupIds[i]);
        }
    }
}

// const config = new Js5OpenRs2(OpenRs2.OSRS_1, 10, false, false);
// await config.load();
// config.unpackGroup(1);
// console.log(config.packed);
