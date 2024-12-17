import Js5Index from '#/js5/Js5Index.ts';
import Packet from '#/io/Packet.ts';

export default class Js5Pack extends Js5Index {
    constructor(src: Uint8Array) {
        super();

        const buf = new Packet(src);

        const ctype = buf.g1();
        const clen = buf.g4();
        let len = clen;
        if (ctype != 0) {
            len += 4;
        }

        const index = new Uint8Array(5 + len);
        buf.pos -= 5;
        buf.gdata(index);
        this.decode(index);

        for (let i = 0; i < this.size; i++) {
            const ctype = buf.g1();
            const clen = buf.g4();
            let len = clen;
            if (ctype != 0) {
                len += 4;
            }

            const group = new Uint8Array(5 + len);
            buf.pos -= 5;
            buf.gdata(group);

            // todo: discardPacked
            this.packed[this.groupIds[i]] = group;
        }
    }
}
