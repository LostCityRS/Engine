import fs from 'fs';
import net from 'net';
import path from 'path';

import forge from 'node-forge';

export default class Packet {
    private static readonly crctable: Int32Array = new Int32Array(256);
    private static readonly bitmask: Uint32Array = new Uint32Array(33);

    private static readonly CRC32_POLYNOMIAL = 0xEDB88320;

    private static cacheMinCount = 0;
    private static cacheMidCount = 0;
    private static cacheMaxCount = 0;
    private static cacheMassiveCount = 0;

    private static cacheMin: Packet[] = []; // 100 B
    private static cacheMid: Packet[] = []; // 5 KB
    private static cacheMax: Packet[] = []; // 30 KB
    private static cacheMassive: Packet[] = []; // 10 MB

    static {
        for (let i: number = 0; i < 32; i++) {
            this.bitmask[i] = (1 << i) - 1;
        }
        this.bitmask[32] = 0xffffffff;

        for (let b = 0; b < 256; b++) {
            let remainder = b;

            for (let bit = 0; bit < 8; bit++) {
                if ((remainder & 0x1) == 1) {
                    remainder = (remainder >>> 1) ^ this.CRC32_POLYNOMIAL;
                } else {
                    remainder >>>= 0x1;
                }
            }

            this.crctable[b] = remainder;
        }
    }

    static getcrc(src: Uint8Array, offset: number, length: number): number {
        let crc = 0xffffffff;
        for (let i = offset; i < length; i++) {
            crc = (crc >>> 8) ^ (this.crctable[(crc ^ src[i]) & 0xFF]);
        }
        return ~crc;
    }

    static checkcrc(src: Uint8Array, offset: number, length: number, expected: number = 0): boolean {
        const checksum: number = Packet.getcrc(src, offset, length);
        // console.log(checksum, expected);
        return checksum == expected;
    }

    static wrap(src: Uint8Array, advance: boolean = true): Packet {
        const buf: Packet = new Packet(src);
        if (advance) {
            buf.pos = src.length;
        }

        return buf;
    }

    static unwrap(src: Uint8Array, copy: boolean): Uint8Array {
        if (copy) {
            const len: number = src.length;
            const temp: Uint8Array = new Uint8Array(len);
            temp.set(src);
            return temp;
        }
        return src;
    }

    static alloc(size: number): Packet {
        if (size === 100 && Packet.cacheMinCount > 0) {
            return Packet.cacheMin[--Packet.cacheMinCount];
        } else if (size === 5_000 && Packet.cacheMidCount > 0) {
            return Packet.cacheMid[--Packet.cacheMidCount];
        } else if (size === 30_000 && Packet.cacheMaxCount > 0) {
            return Packet.cacheMax[--Packet.cacheMaxCount];
        } else if (size === 10_000_000 && Packet.cacheMassiveCount > 0) {
            return Packet.cacheMassive[--Packet.cacheMassiveCount];
        }

        return new Packet(new Uint8Array(size));
    }

    static load(destFile: string, seekToEnd: boolean = false): Packet {
        const packet: Packet = new Packet(new Uint8Array(fs.readFileSync(destFile)));
        if (seekToEnd) {
            packet.pos = packet.data.length;
        }
        return packet;
    }

    data: Uint8Array;
    #view: DataView;
    pos: number;
    bitPos: number;

    constructor(src: Uint8Array) {
        this.data = src;
        this.#view = new DataView(this.data.buffer);
        this.pos = 0;
        this.bitPos = 0;
    }

    release() {
        this.pos = 0;
        this.bitPos = 0;

        if (this.data.length === 100 && Packet.cacheMinCount < 100) {
            Packet.cacheMin[Packet.cacheMinCount++] = this;
        } else if (this.data.length === 5_000 && Packet.cacheMidCount < 250) {
            Packet.cacheMid[Packet.cacheMidCount++] = this;
        } else if (this.data.length === 30_000 && Packet.cacheMaxCount < 50) {
            Packet.cacheMax[Packet.cacheMaxCount++] = this;
        } else if (this.data.length === 10_000_000 && Packet.cacheMassiveCount < 10) {
            Packet.cacheMassive[Packet.cacheMassiveCount++] = this;
        }
    }

    get available(): number {
        return this.data.length - this.pos;
    }

    get length(): number {
        return this.data.length;
    }

    save(destFile: string, length: number = this.pos, start: number = 0): void {
        const dir: string = path.dirname(destFile);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(destFile, this.data.subarray(start, start + length));
    }

    send(socket: net.Socket) {
        if (socket.writable) {
            socket.write(this.data.subarray(0, this.pos));
        }
    }

    // ----

    p1(value: number): void {
        this.#view.setUint8(this.pos++, value);
    }

    p1_alt1(value: number): void {
        this.#view.setUint8(this.pos++, value + 128);
    }

    p1_alt2(value: number): void {
        this.#view.setUint8(this.pos++, -value);
    }

    p1_alt3(value: number): void {
        this.#view.setUint8(this.pos++, 128 - value);
    }

    p2(value: number): void {
        this.#view.setUint16(this.pos, value);
        this.pos += 2;
    }

    p2_alt1(value: number): void {
        this.#view.setUint16(this.pos, value, true);
        this.pos += 2;
    }

    p2_alt2(value: number): void {
        this.#view.setUint8(this.pos++, (value >> 8) & 0xFF);
        this.#view.setUint8(this.pos++, (value + 128) & 0xFF);
    }

    p2_alt3(value: number): void {
        this.#view.setUint8(this.pos++, value + 128);
        this.#view.setUint8(this.pos++, value >> 8);
    }

    p3(value: number): void {
        this.#view.setUint8(this.pos++, value >> 16);
        this.#view.setUint16(this.pos, value);
        this.pos += 2;
    }

    p4(value: number): void {
        this.#view.setInt32(this.pos, value);
        this.pos += 4;
    }

    p4_alt1(value: number): void {
        this.#view.setInt32(this.pos, value, true);
        this.pos += 4;
    }

    p4_alt2(value: number): void {
        this.#view.setUint8(this.pos++, value >> 8);
        this.#view.setUint8(this.pos++, value);
        this.#view.setUint8(this.pos++, value >> 24);
        this.#view.setUint8(this.pos++, value >> 16);
    }

    p5(value: bigint): void {
        this.p1(Number(value >> 32n));
        this.p4(Number(value & 0xffffffffn));
    }

    p6(value: bigint): void {
        this.p2(Number(value >> 32n));
        this.p4(Number(value & 0xffffffffn));
    }

    p8(value: bigint): void {
        this.#view.setBigInt64(this.pos, value);
        this.pos += 8;
    }

    pbool(value: boolean): void {
        this.p1(value ? 1 : 0);
    }

    pjstr(str: string, terminator: number = 0): void {
        const length: number = str.length;
        for (let i: number = 0; i < length; i++) {
            this.#view.setUint8(this.pos++, str.charCodeAt(i));
        }
        this.#view.setUint8(this.pos++, terminator);
    }

    pjstr2(str: string): void {
        this.p1(0);
        this.pjstr(str);
    }

    pdata(src: Uint8Array, off: number = 0, len: number = src.length): void {
        for (let i: number = off; i < off + len; i++) {
            this.#view.setUint8(this.pos++, src[i]);
        }
    }

    pdata_alt2(src: Uint8Array, off: number = 0, len: number = src.length): void {
        for (let i: number = off; i < off + len; i++) {
            this.#view.setUint8(this.pos++, 128 + src[i]);
        }
    }

    psmarts(value: number): void {
        if (value < 128) {
            this.p1(value);
        } else {
            this.p2(value + 32768);
        }
    }

    psmart(value: number): void {
        if (value < -64 || value >= 64) {
            this.p2(value + 49152);
        } else {
            this.p1(value + 64);
        }
    }

    pisaac(value: number): void {
        this.p1(value);
    }

    psize4(size: number): void {
        this.#view.setUint32(this.pos - size - 4, size);
    }

    psize2(size: number): void {
        this.#view.setUint16(this.pos - size - 2, size);
    }

    psize1(size: number): void {
        this.#view.setUint8(this.pos - size - 1, size);
    }

    // ----

    g1(): number {
        return this.#view.getUint8(this.pos++);
    }

    g1_alt1(): number {
        return (this.#view.getUint8(this.pos++) - 128) & 0xFF;
    }

    g1_alt2(): number {
        return (-this.#view.getUint8(this.pos++)) & 0xFF;
    }

    g1_alt3(): number {
        return (128 - this.#view.getUint8(this.pos++)) & 0xFF;
    }

    g1b(): number {
        return this.#view.getInt8(this.pos++);
    }

    g1b_alt1(): number {
        let val = (this.#view.getUint8(this.pos++) - 128) & 0xFF;
        if (val > 0x7F) {
            val -= 0xFF;
        }
        return val;
    }

    g1b_alt2(): number {
        let val = (-this.#view.getUint8(this.pos++)) & 0xFF;
        if (val > 0x7F) {
            val -= 0xFF;
        }
        return val;
    }

    g1b_alt3(): number {
        let val = (128 - this.#view.getUint8(this.pos++)) & 0xFF;
        if (val > 0x7F) {
            val -= 0xFF;
        }
        return val;
    }

    g2(): number {
        this.pos += 2;
        return this.#view.getUint16(this.pos - 2);
    }

    g2_alt3(): number {
        this.pos += 2;
        return ((this.#view.getUint8(this.pos - 1)) << 8) + ((this.#view.getUint8(this.pos - 2) - 128) & 0xFF);
    }

    g2s(): number {
        this.pos += 2;
        return this.#view.getInt16(this.pos - 2);
    }

    g3(): number {
        const result: number = (this.#view.getUint8(this.pos++) << 16) | this.#view.getUint16(this.pos);
        this.pos += 2;
        return result;
    }

    g4(): number {
        this.pos += 4;
        return this.#view.getInt32(this.pos - 4);
    }

    g8(): bigint {
        this.pos += 8;
        return this.#view.getBigInt64(this.pos - 8);
    }

    gbool(): boolean {
        return this.g1() === 1;
    }

    gdata(dest: Uint8Array, offset: number, length: number): void {
        dest.set(this.data.subarray(this.pos, this.pos + length), offset);
        this.pos += length;
    }

    gPacket(length: number): Packet {
        const dest: Uint8Array = new Uint8Array(length);
        dest.set(this.data.subarray(this.pos, this.pos + length), 0);
        this.pos += length;
        return new Packet(dest);
    }

    gjstr(terminator: number = 0): string {
        const length: number = this.data.length;
        let str: string = '';
        let b: number;
        while ((b = this.#view.getUint8(this.pos++)) !== terminator && this.pos < length) {
            str += String.fromCharCode(b);
        }
        return str;
    }

    fastgstr(): string | null {
        if (this.data[this.pos] === 0) {
            this.pos++;
            return null;
        } else {
            return this.gjstr();
        }
    }

    gjstr2(): string {
        const version: number = this.#view.getUint8(this.pos++);
        if (version !== 0) {
            throw new Error();
        }
        return this.gjstr();
    }

    gsmarts(): number {
        return this.#view.getUint8(this.pos) < 128 ? this.g1() : this.g2() - 32768;
    }

    gsmart(): number {
        return this.#view.getUint8(this.pos) < 128 ? this.g1() - 64 : this.g2s() - 49152;
    }

    bits(): void {
        this.bitPos = this.pos * 8;
        // this.bitPos = this.pos << 3;
    }

    bytes(): void {
        this.pos = ((this.bitPos + 7) / 8) | 0;
        // this.pos = (this.bitPos + 7) >>> 3;
    }

    gBit(n: number): number {
        let bytePos: number = this.bitPos >>> 3;
        let remaining: number = 8 - (this.bitPos & 7);
        let value: number = 0;
        this.bitPos += n;

        for (; n > remaining; remaining = 8) {
            value += (this.#view.getUint8(bytePos++) & Packet.bitmask[remaining]) << (n - remaining);
            n -= remaining;
        }

        if (n == remaining) {
            value += this.#view.getUint8(bytePos) & Packet.bitmask[remaining];
        } else {
            value += (this.#view.getUint8(bytePos) >>> (remaining - n)) & Packet.bitmask[n];
        }

        return value;
    }

    pBit(n: number, value: number): void {
        let bytePos: number = this.bitPos >>> 3;
        let remaining: number = 8 - (this.bitPos & 7);
        this.bitPos += n;

        for (; n > remaining; remaining = 8) {
            this.#view.setUint8(bytePos, this.#view.getUint8(bytePos) & ~Packet.bitmask[remaining]);
            this.#view.setUint8(bytePos, this.#view.getUint8(bytePos) | ((value >>> (n - remaining)) & Packet.bitmask[remaining]));
            bytePos++;
            n -= remaining;
        }

        if (n == remaining) {
            this.#view.setUint8(bytePos, this.#view.getUint8(bytePos) & ~Packet.bitmask[remaining]);
            this.#view.setUint8(bytePos, this.#view.getUint8(bytePos) | value & Packet.bitmask[remaining]);
        } else {
            this.#view.setUint8(bytePos, this.#view.getUint8(bytePos) & (~Packet.bitmask[n] << (remaining - n)));
            this.#view.setUint8(bytePos, this.#view.getUint8(bytePos) | ((value & Packet.bitmask[n]) << (remaining - n)));
        }
    }

    tinyenc(key: number[], offset: number, length: number): void {
        const start: number = this.pos;
        this.pos = offset;

        const blocks: number = ((length - offset) / 8) | 0;
        for (let i: number = 0; i < blocks; i++) {
            let v0: number = this.g4();
            let v1: number = this.g4();
            let sum: number = 0;

            let num_rounds: number = 32;
            while (num_rounds-- > 0) {
                v0 += (v1 + (v1 << 4 ^ v1 >>> 5) ^ sum + key[sum & 0x3]) | 0;
                sum = (sum + 0x9E3779B9) | 0;
                v1 += ((v0 >>> 5 ^ v0 << 4) + v0 ^ sum + key[sum >>> 11 & 0xE8C00003]) | 0;
            }

            this.pos -= 8;
            this.p4(v0);
            this.p4(v1);
        }

        this.pos = start;
    }

    tinydec(key: number[], offset: number, length: number): void {
        const start: number = this.pos;

        const blocks: number = ((length - offset) / 8) | 0;
        this.pos = offset;

        const delta: number = 0x9E3779B9;
        for (let i: number = 0; i < blocks; i++) {
            let v0: number = this.g4();
            let v1: number = this.g4();
            let num_rounds: number = 32;
            let sum: number = delta * num_rounds;

            while (num_rounds-- > 0) {
                v1 -= (((v0 << 4) ^ (v0 >>> 5)) + v0) ^ (sum + key[(sum >>> 11) & 0x3]);
                v1 = v1 >>> 0; // js

                sum -= delta;
                sum = sum >>> 0; // js

                v0 -= (((v1 << 4) ^ (v1 >>> 5)) + v1) ^ (sum + key[sum & 0x3]);
                v0 = v0 >>> 0; // js
            }

            this.pos -= 8;
            this.p4(v0);
            this.p4(v1);
        }

        this.pos = start;
    }

    rsaenc(pem: forge.pki.rsa.PrivateKey): void {
        const length: number = this.pos;
        this.pos = 0;

        const dec: Uint8Array = new Uint8Array(length);
        this.gdata(dec, 0, dec.length);

        const bigRaw: forge.jsbn.BigInteger = new forge.jsbn.BigInteger(Array.from(dec));
        const rawEnc: Uint8Array = Uint8Array.from(bigRaw.modPow(pem.e, pem.n).toByteArray());

        this.pos = 0;
        this.p1(rawEnc.length);
        this.pdata(rawEnc, 0, rawEnc.length);
    }

    rsadec(pem: forge.pki.rsa.PrivateKey): void {
        const p: forge.jsbn.BigInteger = pem.p;
        const q: forge.jsbn.BigInteger = pem.q;
        const dP: forge.jsbn.BigInteger = pem.dP;
        const dQ: forge.jsbn.BigInteger = pem.dQ;
        const qInv: forge.jsbn.BigInteger = pem.qInv;

        const enc: Uint8Array = new Uint8Array(this.g1());
        this.gdata(enc, 0, enc.length);

        const bigRaw: forge.jsbn.BigInteger = new forge.jsbn.BigInteger(Array.from(enc));
        const m1: forge.jsbn.BigInteger = bigRaw.mod(p).modPow(dP, p);
        const m2: forge.jsbn.BigInteger = bigRaw.mod(q).modPow(dQ, q);
        const h: forge.jsbn.BigInteger = qInv.multiply(m1.subtract(m2)).mod(p);
        const rawDec: Uint8Array = new Uint8Array(m2.add(h.multiply(q)).toByteArray());

        this.pos = 0;
        this.pdata(rawDec, 0, rawDec.length);
        this.pos = 0;
    }
}
