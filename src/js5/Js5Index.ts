import Packet from '#/io/Packet.ts';
import GZip from '#/io/GZip.ts';
import BZip2 from '#/io/BZip2.ts';

export default class Js5Index {
    static decompress(src: Uint8Array) {
        const buf = new Packet(src);

        const ctype = buf.g1();
        const clen = buf.g4();
        if (clen < 0) {
            throw new Error();
        }

        if (ctype === 0) {
            const temp = new Uint8Array(clen);
            buf.gdata(temp);
            return temp;
        } else {
            const ulen = buf.g4();
            if (ulen < 0) {
                throw new Error();
            }

            const temp = new Uint8Array(ulen);
            if (ctype === 1) {
                temp.set(BZip2.decompress(buf, ulen), 0);
            } else {
                temp.set(GZip.decompress(buf), 0);
            }
            return temp;
        }
    }

    version = 0;
    size = 0;
    groupId = new Int32Array();
    groupNameHash = new Int32Array();
    groupNameHashTable = new Map<number, number>();
    capacity = 0;
    groupChecksum = new Int32Array();
    groupVersion = new Int32Array();
    groupSize = new Int32Array();
    fileId: (Int32Array | null)[] = [];
    fileNameHash: Int32Array[] = [];
    fileNameHashTable: Map<number, number>[] = [];
    groupCapacity = new Int32Array();

    packed: (Uint8Array | null)[] = [];
    unpacked: (Uint8Array | null)[][] = [];
    crc = 0;
    discardPacked = false;
    discardUnpacked = false;

    decode(src: Uint8Array) {
        this.crc = Packet.getcrc(src);

        const buf = new Packet(Js5Index.decompress(src));

        const protocol = buf.g1();
        if (protocol < 5 || protocol > 7) {
            throw new Error();
        }

        if (protocol >= 6) {
            this.version = buf.g4();
        }

        const info = buf.g1();
        const hasNames = (info & 0x1) !== 0;

        if (protocol >= 7) {
            // todo
        } else {
            this.size = buf.g2();
        }

        let prevGroupId = 0;
        let maxGroupId = -1;
        this.groupId = new Int32Array(this.size);

        for (let i = 0; i < this.size; i++) {
            if (protocol >= 7) {
                // todo
            } else {
                this.groupId[i] = prevGroupId += buf.g2();
            }

            if (this.groupId[i] > maxGroupId) {
                maxGroupId = this.groupId[i];
            }
        }

        this.capacity = maxGroupId + 1;
        this.groupSize = new Int32Array(this.capacity);
        this.groupChecksum = new Int32Array(this.capacity);
        this.groupVersion = new Int32Array(this.capacity);
        this.fileId = new Array(this.capacity).fill(null);
        this.groupCapacity = new Int32Array(this.capacity);
        this.packed = new Array(this.capacity).fill(null);
        this.unpacked = new Array(this.capacity).fill([]);

        if (hasNames) {
            this.groupNameHash = new Int32Array(this.capacity);
            this.groupNameHashTable = new Map();

            for (let i = 0; i < this.capacity; i++) {
                this.groupNameHash[i] = -1;
            }

            for (let i = 0; i < this.size; i++) {
                this.groupNameHash[this.groupId[i]] = buf.g4();
                this.groupNameHashTable.set(this.groupNameHash[this.groupId[i]], this.groupId[i]);
            }
        }

        for (let i = 0; i < this.size; i++) {
            this.groupChecksum[this.groupId[i]] = buf.g4();
        }

        for (let i = 0; i < this.size; i++) {
            this.groupVersion[this.groupId[i]] = buf.g4();
        }

        for (let i = 0; i < this.size; i++) {
            if (protocol >= 7) {
                // todo
            } else {
                this.groupSize[this.groupId[i]] = buf.g2();
            }
        }

        for (let i = 0; i < this.size; i++) {
            let prevFileId = 0;
            let maxFileId = -1;

            const groupId = this.groupId[i];
            const groupSize = this.groupSize[groupId];
            this.fileId[groupId] = new Int32Array(groupSize);

            for (let j = 0; j < groupSize; j++) {
                let fileId = 0;
                if (protocol >= 7) {
                    // todo
                } else {
                    fileId = prevFileId += buf.g2();
                }
                this.fileId[groupId][j] = prevFileId;

                if (fileId > maxFileId) {
                    maxFileId = fileId;
                }
            }

            this.groupCapacity[groupId] = maxFileId + 1;
            if (maxFileId + 1 === groupSize) {
                this.fileId[groupId] = null;
            }
        }

        if (hasNames) {
            this.fileNameHash = new Array(this.capacity);
            this.fileNameHashTable = new Array(this.capacity);

            for (let i = 0; i < this.size; i++) {
                const groupId = this.groupId[i];
                const groupSize = this.groupSize[groupId];

                this.fileNameHash[groupId] = new Int32Array(this.groupCapacity[groupId]);
                this.fileNameHashTable[groupId] = new Map();

                for (let fileId = 0; fileId < this.groupCapacity[groupId]; fileId++) {
                    this.fileNameHash[groupId][fileId] = -1;
                }

                for (let j = 0; j < groupSize; j++) {
                    let fileId = -1;
                    if (this.fileId[groupId]) {
                        fileId = this.fileId[groupId][j];
                    } else {
                        fileId = j;
                    }

                    this.fileNameHash[groupId][fileId] = buf.g4();
                    this.fileNameHashTable[groupId].set(this.fileNameHash[groupId][fileId], fileId);
                }
            }
        }
    }
}
